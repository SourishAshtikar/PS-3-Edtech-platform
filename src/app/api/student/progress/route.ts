import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subtopicId, moduleId, completed } = await req.json();

    if (!subtopicId || !moduleId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { subtopics: true }
    });

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const existing = await prisma.studentProgress.findUnique({
      where: { userId_moduleId: { userId: user.id, moduleId } }
    });

    let xpEarned = 0;
    let newCompletedSubtopics: string[] = existing ? [...existing.completedSubtopics] : [];
    let isModuleCompletedNow = false;

    if (completed) {
      if (!newCompletedSubtopics.includes(subtopicId)) {
        newCompletedSubtopics.push(subtopicId);
        xpEarned += 0; // Subtopic completion gives 0 XP (points come from resources)
      }

      // Check if module is completed
      if (newCompletedSubtopics.length === module.subtopics.length && (!existing || !existing.completed)) {
        isModuleCompletedNow = true;
        xpEarned += 50; // Extra XP for module
      }
    } else {
      newCompletedSubtopics = newCompletedSubtopics.filter(id => id !== subtopicId);
    }

    // Save progress
    await prisma.studentProgress.upsert({
      where: {
        userId_moduleId: { userId: user.id, moduleId }
      },
      update: {
        completedSubtopics: { set: newCompletedSubtopics },
        completed: existing?.completed ? true : isModuleCompletedNow
      },
      create: {
        userId: user.id,
        moduleId,
        completedSubtopics: newCompletedSubtopics,
        completed: isModuleCompletedNow
      }
    });

    // Award XP
    if (xpEarned > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { xp: { increment: xpEarned } }
      });

      // Update SubjectEnrollment XP
      await prisma.subjectEnrollment.upsert({
        where: { userId_subjectId: { userId: user.id, subjectId: module.subjectId } },
        update: { xp: { increment: xpEarned } },
        create: {
          userId: user.id,
          subjectId: module.subjectId,
          xp: xpEarned
        }
      });
    }

    return NextResponse.json({ success: true, xpEarned });
  } catch (error: any) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
