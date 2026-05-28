import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subtopicId, moduleId, completed } = await req.json();

    if (!subtopicId || !moduleId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert student progress
    const progress = await prisma.studentProgress.upsert({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: moduleId,
        }
      },
      update: {
        completedSubtopics: completed 
          ? { push: subtopicId } 
          : undefined, 
      },
      create: {
        userId: user.id,
        moduleId: moduleId,
        completedSubtopics: completed ? [subtopicId] : [],
      }
    });

    // If we're un-completing, Prisma's `push` doesn't support removal easily, so we fetch and set
    if (!completed) {
      const existing = await prisma.studentProgress.findUnique({
        where: { userId_moduleId: { userId: user.id, moduleId } }
      });
      if (existing) {
        await prisma.studentProgress.update({
          where: { id: existing.id },
          data: {
            completedSubtopics: {
              set: existing.completedSubtopics.filter((id) => id !== subtopicId)
            }
          }
        });
      }
    } else {
       // If completing, we need to ensure we don't have duplicates
       const existing = await prisma.studentProgress.findUnique({
        where: { userId_moduleId: { userId: user.id, moduleId } }
      });
      if (existing) {
        const uniqueSubtopics = Array.from(new Set(existing.completedSubtopics));
        await prisma.studentProgress.update({
          where: { id: existing.id },
          data: {
            completedSubtopics: {
              set: uniqueSubtopics
            }
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
