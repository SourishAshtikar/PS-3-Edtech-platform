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
    const { moduleId, subtopicId, title, documentUrl, cards } = body;

    if (!moduleId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const createdDeck = await prisma.flashcardDeck.create({
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

    return NextResponse.json({ success: true, deck: createdDeck });
  } catch (error: any) {
    console.error("Error creating flashcard deck:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");

    const decks = await prisma.flashcardDeck.findMany({
      where: subjectId ? { module: { subjectId } } : undefined,
      include: { module: true, cards: true },
      orderBy: { title: "asc" },
    });

    return NextResponse.json(decks);
  } catch (error: any) {
    console.error("Error fetching flashcard decks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
