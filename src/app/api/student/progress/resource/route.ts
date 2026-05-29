import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subtopicId, moduleId, resourceType } = await req.json();

    if (!subtopicId || !moduleId || !resourceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId }
    });

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const existing = await prisma.studentProgress.findUnique({
      where: { userId_moduleId: { userId: user.id, moduleId } }
    });

    const resourceKey = `${subtopicId}-${resourceType}`;
    let newCompletedResources: string[] = existing ? [...existing.completedResources] : [];
    
    // Check if the user already earned XP for this specific resource
    if (newCompletedResources.includes(resourceKey)) {
      // User already got XP for this resource, return gracefully
      return NextResponse.json({ success: true, xpEarned: 0, alreadyCompleted: true });
    }

    // Mark resource as completed
    newCompletedResources.push(resourceKey);

    // Give 25 XP for viewing a resource (notes, videos, quizzes, simulations, etc)
    const xpEarned = 25;

    // Save progress
    await prisma.studentProgress.upsert({
      where: {
        userId_moduleId: { userId: user.id, moduleId }
      },
      update: {
        completedResources: { set: newCompletedResources }
      },
      create: {
        userId: user.id,
        moduleId,
        completedSubtopics: [],
        completedResources: [resourceKey],
        completed: false
      }
    });

    // Award XP
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

    return NextResponse.json({ success: true, xpEarned, alreadyCompleted: false });
  } catch (error: any) {
    console.error("Error updating resource progress:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
