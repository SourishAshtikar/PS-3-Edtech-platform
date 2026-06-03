import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { deckId, moduleId, subtopicId, subjectId } = body;

    if (!deckId || !moduleId || !subjectId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Get user enrollment for this subject to award XP
    const enrollment = await prisma.subjectEnrollment.findUnique({
      where: { userId_subjectId: { userId: user.id, subjectId } }
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in subject" }, { status: 400 });
    }

    // 2. Add 25 XP
    await prisma.subjectEnrollment.update({
      where: { id: enrollment.id },
      data: { xp: { increment: 25 } }
    });

    // 3. Mark progress for subtopic (if subtopicId is provided)
    if (subtopicId) {
      let progress = await prisma.studentProgress.findUnique({
        where: { userId_moduleId: { userId: user.id, moduleId } }
      });

      if (!progress) {
        progress = await prisma.studentProgress.create({
          data: {
            userId: user.id,
            moduleId,
            completedResources: [`${subtopicId}-flashcards`]
          }
        });
      } else {
        const resourceStr = `${subtopicId}-flashcards`;
        if (!progress.completedResources.includes(resourceStr)) {
          await prisma.studentProgress.update({
            where: { id: progress.id },
            data: {
              completedResources: {
                push: resourceStr
              }
            }
          });
        }
      }
    }

    return NextResponse.json({ success: true, xpEarned: 25 });
  } catch (error: any) {
    console.error("Error completing flashcards:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
