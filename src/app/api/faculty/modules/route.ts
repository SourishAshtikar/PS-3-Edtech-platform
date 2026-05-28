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
    const { moduleNo, title, hours, co, description, subtopics, subjectId } = body;

    if (!title || !moduleNo || !description || !subjectId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const createdModule = await prisma.module.create({
      data: {
        subjectId,
        moduleNo: Number(moduleNo),
        title,
        hours: Number(hours || 0),
        co: co || "",
        description,
        subtopics: {
          create: (subtopics || []).map((st: any, index: number) => ({
            subtopicNo: st.subtopicNo || `${moduleNo}.${index + 1}`,
            title: st.title,
            description: st.description || "",
            videoUrl: st.videoUrl || null,
            notesUrl: st.notesUrl || null,
            notesDownloadUrl: st.notesDownloadUrl || null,
            quizFileUrl: st.quizFileUrl || null,
            quizFileDownloadUrl: st.quizFileDownloadUrl || null,
            mindMapUrl: st.mindMapUrl || null,
            mindMapDownloadUrl: st.mindMapDownloadUrl || null,
            flashCardsUrl: st.flashCardsUrl || null,
            flashCardsDownloadUrl: st.flashCardsDownloadUrl || null,
            referenceUrl: st.referenceUrl || null,
            referenceDownloadUrl: st.referenceDownloadUrl || null,
            otherUrl: st.otherUrl || null,
            otherDownloadUrl: st.otherDownloadUrl || null,
            simulationUrl: st.simulationUrl || null,
            learningOutcome: st.learningOutcome || null,
          })),
        },
      },
      include: {
        subtopics: true,
      },
    });

    return NextResponse.json({ success: true, module: createdModule });
  } catch (error: any) {
    console.error("Error creating module:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");

    const modules = await prisma.module.findMany({
      where: subjectId ? { subjectId } : undefined,
      include: { subtopics: true },
      orderBy: { moduleNo: "asc" },
    });

    return NextResponse.json(modules);
  } catch (error: any) {
    console.error("Error fetching modules:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user || user.role !== "faculty") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { moduleId, moduleNo, title, hours, co, description, subtopics } = body;

    if (!moduleId || !title || !moduleNo || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingSubtopics = await prisma.subtopic.findMany({ where: { moduleId } });
    const existingIds = existingSubtopics.map(st => st.id);
    const newSubtopics = subtopics.filter((st: any) => !st.id);
    const updateSubtopics = subtopics.filter((st: any) => st.id);
    const updateIds = updateSubtopics.map((st: any) => st.id);
    const deleteIds = existingIds.filter(id => !updateIds.includes(id));

    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: {
        moduleNo: Number(moduleNo),
        title,
        hours: Number(hours || 0),
        co: co || "",
        description,
        subtopics: {
          deleteMany: { id: { in: deleteIds } },
          create: newSubtopics.map((st: any, index: number) => ({
            subtopicNo: st.subtopicNo || `${moduleNo}.${existingIds.length + index + 1}`,
            title: st.title,
            description: st.description || "",
            videoUrl: st.videoUrl || null,
            notesUrl: st.notesUrl || null,
            notesDownloadUrl: st.notesDownloadUrl || null,
            quizFileUrl: st.quizFileUrl || null,
            quizFileDownloadUrl: st.quizFileDownloadUrl || null,
            mindMapUrl: st.mindMapUrl || null,
            mindMapDownloadUrl: st.mindMapDownloadUrl || null,
            flashCardsUrl: st.flashCardsUrl || null,
            flashCardsDownloadUrl: st.flashCardsDownloadUrl || null,
            referenceUrl: st.referenceUrl || null,
            referenceDownloadUrl: st.referenceDownloadUrl || null,
            otherUrl: st.otherUrl || null,
            otherDownloadUrl: st.otherDownloadUrl || null,
            simulationUrl: st.simulationUrl || null,
            learningOutcome: st.learningOutcome || null,
          })),
          update: updateSubtopics.map((st: any) => ({
            where: { id: st.id },
            data: {
              title: st.title,
              description: st.description || "",
              videoUrl: st.videoUrl || null,
              notesUrl: st.notesUrl || null,
              notesDownloadUrl: st.notesDownloadUrl || null,
              quizFileUrl: st.quizFileUrl || null,
              quizFileDownloadUrl: st.quizFileDownloadUrl || null,
              mindMapUrl: st.mindMapUrl || null,
              mindMapDownloadUrl: st.mindMapDownloadUrl || null,
              flashCardsUrl: st.flashCardsUrl || null,
              flashCardsDownloadUrl: st.flashCardsDownloadUrl || null,
              referenceUrl: st.referenceUrl || null,
              referenceDownloadUrl: st.referenceDownloadUrl || null,
              otherUrl: st.otherUrl || null,
              otherDownloadUrl: st.otherDownloadUrl || null,
              simulationUrl: st.simulationUrl || null,
              learningOutcome: st.learningOutcome || null,
            }
          }))
        }
      },
      include: { subtopics: true }
    });

    return NextResponse.json({ success: true, module: updatedModule });
  } catch (error: any) {
    console.error("Error updating module:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
