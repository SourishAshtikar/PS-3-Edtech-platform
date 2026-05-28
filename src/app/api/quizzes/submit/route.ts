import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { quizId, answers } = body as {
      quizId: string;
      answers: { questionId: string; selectedOption: string }[];
    };

    if (!quizId || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true, module: true },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Evaluate answers
    let score = 0;
    const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);
    const answersData: { questionId: string; selectedOption: string; isCorrect: boolean }[] = [];

    for (const q of quiz.questions) {
      const submitted = answers.find((a) => a.questionId === q.id);
      const selectedOption = submitted ? submitted.selectedOption : "";
      const isCorrect = selectedOption === q.correctAnswer;
      if (isCorrect) {
        score += q.marks;
      }
      answersData.push({
        questionId: q.id,
        selectedOption,
        isCorrect,
      });
    }

    const percentage = quiz.questions.length > 0 ? (score / quiz.questions.length) * 100 : 0;
    const isPassed = percentage >= 70;
    const xpEarned = isPassed ? quiz.xpReward : 0;

    // Start a transaction to ensure atomic updates
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Quiz Attempt
      const attempt = await tx.quizAttempt.create({
        data: {
          userId: user.id,
          quizId: quiz.id,
          score,
          totalMarks,
          xpEarned,
          completed: true,
          answers: {
            create: answersData.map((a) => ({
              questionId: a.questionId,
              selectedOption: a.selectedOption,
              isCorrect: a.isCorrect,
            })),
          },
        },
      });

      // 2. Update User XP and SubjectEnrollment XP
      let updatedUser = user;
      if (xpEarned > 0) {
        updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            xp: { increment: xpEarned },
          },
        });

        const subjectId = quiz.module?.subjectId;
        if (subjectId) {
          const enrollment = await tx.subjectEnrollment.findUnique({
            where: { userId_subjectId: { userId: user.id, subjectId } }
          });
          
          if (enrollment) {
            await tx.subjectEnrollment.update({
              where: { id: enrollment.id },
              data: { xp: { increment: xpEarned } }
            });
          } else {
            await tx.subjectEnrollment.create({
              data: { userId: user.id, subjectId, xp: xpEarned }
            });
          }
        }
      }

      // 3. Check for Badges (e.g. Module 1 assessment unlocks Badge 1)
      let unlockedBadge = null;
      if (isPassed && quiz.id === "quiz1") {
        const badge = await tx.badge.findFirst({
          where: { condition: "Complete Module 1" },
        });

        if (badge) {
          const alreadyEarned = await tx.userBadge.findFirst({
            where: {
              userId: user.id,
              badgeId: badge.id,
            },
          });

          if (!alreadyEarned) {
            await tx.userBadge.create({
              data: {
                userId: user.id,
                badgeId: badge.id,
              },
            });
            unlockedBadge = badge;
          }
        }
      }

      return { attempt, xpEarned, unlockedBadge, updatedUser };
    });

    return NextResponse.json({
      success: true,
      score,
      totalQuestions: quiz.questions.length,
      xpEarned: result.xpEarned,
      unlockedBadge: result.unlockedBadge,
      userXp: result.updatedUser.xp,
    });
  } catch (error: any) {
    console.error("Quiz submission error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
