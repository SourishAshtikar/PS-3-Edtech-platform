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

    await prisma.flashcardDeck.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting flashcard deck:", error);
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
    const { moduleId, subtopicId, title, documentUrl, cards } = body;

    if (!moduleId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Delete existing cards
    await prisma.flashcard.deleteMany({
      where: { flashcardDeckId: id },
    });

    // Update deck metadata and create new cards
    const updatedDeck = await prisma.flashcardDeck.update({
      where: { id },
      data: {
        moduleId,
        subtopicId: subtopicId || null,
        title,
        documentUrl: documentUrl || null,
        cards: {
          create: (cards || []).map((c: any) => ({
            question: c.question,
            answer: c.answer,
          })),
        },
      },
      include: {
        cards: true,
      },
    });

    return NextResponse.json({ success: true, deck: updatedDeck });
  } catch (error: any) {
    console.error("Error updating flashcard deck:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
