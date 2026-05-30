import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getOrCreateUser();
    if (!user || user.role !== "faculty") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.quiz.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getOrCreateUser();
    if (!user || user.role !== "faculty") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { moduleId, subtopicId, title, difficulty, timeLimit, xpReward, questions, documentUrl } = body;

    if (!moduleId || !title || !difficulty || !timeLimit || !xpReward) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Delete existing questions
    await prisma.question.deleteMany({
      where: { quizId: id },
    });

    // Update quiz metadata and create new questions
    const updatedQuiz = await prisma.quiz.update({
      where: { id },
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
            options: q.options || [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean),
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

    return NextResponse.json({ success: true, quiz: updatedQuiz });
  } catch (error: any) {
    console.error("Error updating quiz:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
