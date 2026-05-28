import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user || user.role !== "faculty") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { moduleId, subtopicId, title, difficulty, timeLimit, xpReward, questions, documentUrl } = body;

    if (!moduleId || !title || !difficulty || !timeLimit || !xpReward) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create quiz with nested questions if manually created, or just documentUrl if doing document upload
    const createdQuiz = await prisma.quiz.create({
      data: {
        moduleId,
        subtopicId: subtopicId || null,
        title,
        difficulty,
        timeLimit: Number(timeLimit),
        xpReward: Number(xpReward),
        documentUrl: documentUrl || null,
        questions: {
          create: (questions || []).map((q: any) => ({
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer, // "A", "B", "C", "D"
            marks: Number(q.marks || 1),
            explanation: q.explanation || null,
            difficulty: q.difficulty || difficulty,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json({ success: true, quiz: createdQuiz });
  } catch (error: any) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");

    const quizzes = await prisma.quiz.findMany({
      where: subjectId ? { module: { subjectId } } : undefined,
      include: { module: true, questions: true },
      orderBy: { title: "asc" },
    });

    return NextResponse.json(quizzes);
  } catch (error: any) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
