import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import JSZip from "jszip";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { moduleId } = await params;

    const moduleData = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        flashcardDecks: {
          include: { cards: true }
        },
        quizzes: {
          include: { questions: true }
        },
        subtopics: {
          orderBy: { subtopicNo: 'asc' },
          include: {
            flashcardDecks: { include: { cards: true } },
            quizzes: { include: { questions: true } }
          }
        }
      }
    });

    if (!moduleData) {
      return new NextResponse("Module not found", { status: 404 });
    }

    const zip = new JSZip();

    // Helper to generate docx for flashcards
    const createFlashcardsDoc = async (deckTitle: string, cards: any[]) => {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: `Flashcards: ${deckTitle}`,
              heading: HeadingLevel.HEADING_1,
            }),
            ...cards.flatMap((card, index) => [
              new Paragraph({
                children: [
                  new TextRun({ text: `Q${index + 1}: `, bold: true }),
                  new TextRun(card.question)
                ],
                spacing: { before: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Answer: ", bold: true, italics: true }),
                  new TextRun(card.answer)
                ]
              })
            ])
          ],
        }],
      });
      return await Packer.toBuffer(doc);
    };

    // Helper to generate docx for quizzes
    const createQuizDoc = async (quizTitle: string, questions: any[]) => {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: `Quiz: ${quizTitle}`,
              heading: HeadingLevel.HEADING_1,
            }),
            ...questions.flatMap((q, index) => [
              new Paragraph({
                children: [
                  new TextRun({ text: `Q${index + 1}. `, bold: true }),
                  new TextRun(q.questionText)
                ],
                spacing: { before: 300 }
              }),
              ...q.options.map((opt: string, optIndex: number) => 
                new Paragraph({
                  text: `   ${String.fromCharCode(65 + optIndex)}. ${opt}`
                })
              ),
              new Paragraph({
                children: [
                  new TextRun({ text: "Correct Answer: ", bold: true, color: "008000" }),
                  new TextRun(q.correctAnswer)
                ],
                spacing: { before: 100 }
              }),
              ...(q.explanation ? [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Explanation: ", bold: true }),
                    new TextRun(q.explanation)
                  ]
                })
              ] : [])
            ])
          ],
        }],
      });
      return await Packer.toBuffer(doc);
    };

    // 1. Process Module-level Flashcards/Quizzes
    if (moduleData.flashcardDecks.length > 0 || moduleData.quizzes.length > 0) {
      const moduleFolder = zip.folder("Module Resources");
      if (moduleFolder) {
        for (const deck of moduleData.flashcardDecks) {
          if (deck.cards.length > 0) {
            const buf = await createFlashcardsDoc(deck.title, deck.cards);
            moduleFolder.file(`Flashcards - ${deck.title.replace(/[^a-z0-9]/gi, '_')}.docx`, buf);
          }
        }
        for (const quiz of moduleData.quizzes) {
          if (quiz.questions.length > 0) {
            const buf = await createQuizDoc(quiz.title, quiz.questions);
            moduleFolder.file(`Quiz - ${quiz.title.replace(/[^a-z0-9]/gi, '_')}.docx`, buf);
          }
        }
      }
    }

    // 2. Process Subtopics
    for (let i = 0; i < moduleData.subtopics.length; i++) {
      const subtopic = moduleData.subtopics[i];
      const folderName = `Subtopic ${i + 1} - ${subtopic.title.replace(/[^a-z0-9]/gi, '_')}`;
      const subtopicFolder = zip.folder(folderName);

      if (subtopicFolder) {
        // Create Links.txt
        let linksContent = `Resource Links for: ${subtopic.title}\n\n`;
        let hasLinks = false;
        
        if (subtopic.videoUrl) {
          linksContent += `Video URL: ${subtopic.videoUrl}\n`;
          hasLinks = true;
        }
        if (subtopic.notesUrl) {
          linksContent += `Notes URL: ${subtopic.notesUrl}\n`;
          hasLinks = true;
        }

        if (hasLinks) {
          subtopicFolder.file("Links.txt", linksContent);
        }

        // Subtopic Flashcards
        for (const deck of subtopic.flashcardDecks) {
          if (deck.cards.length > 0) {
            const buf = await createFlashcardsDoc(deck.title, deck.cards);
            subtopicFolder.file(`Flashcards - ${deck.title.replace(/[^a-z0-9]/gi, '_')}.docx`, buf);
          }
        }

        // Subtopic Quizzes
        for (const quiz of subtopic.quizzes) {
          if (quiz.questions.length > 0) {
            const buf = await createQuizDoc(quiz.title, quiz.questions);
            subtopicFolder.file(`Quiz - ${quiz.title.replace(/[^a-z0-9]/gi, '_')}.docx`, buf);
          }
        }
      }
    }

    // Generate ZIP
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="module-${moduleData.moduleNo}-export.zip"`,
      },
    });
  } catch (error) {
    console.error("[MODULE_EXPORT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
