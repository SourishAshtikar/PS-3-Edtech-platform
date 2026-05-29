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
    const { moduleId, subtopicId, title, description, difficulty, xpReward, estimatedTime, learningOutcome, frontendUrl } = body;

    if (!moduleId || !title || !description || !difficulty || !xpReward || !frontendUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const createdSimulation = await prisma.simulation.create({
      data: {
        moduleId,
        subtopicId: subtopicId || null,
        title,
        description,
        difficulty,
        xpReward: Number(xpReward),
        estimatedTime: estimatedTime || null,
        learningOutcome: learningOutcome || null,
        frontendUrl,
      },
    });

    return NextResponse.json({ success: true, simulation: createdSimulation });
  } catch (error: any) {
    console.error("Error creating simulation:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");

    const simulations = await prisma.simulation.findMany({
      where: subjectId ? { module: { subjectId } } : undefined,
      include: { module: true },
      orderBy: { title: "asc" },
    });

    return NextResponse.json(simulations);
  } catch (error: any) {
    console.error("Error fetching simulations:", error);
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
    const { id, moduleId, subtopicId, title, description, difficulty, xpReward, estimatedTime, learningOutcome, frontendUrl } = body;

    if (!id || !moduleId || !title || !description || !difficulty || !xpReward || !frontendUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedSimulation = await prisma.simulation.update({
      where: { id },
      data: {
        moduleId,
        subtopicId: subtopicId || null,
        title,
        description,
        difficulty,
        xpReward: Number(xpReward),
        estimatedTime: estimatedTime || null,
        learningOutcome: learningOutcome || null,
        frontendUrl,
      },
    });

    return NextResponse.json({ success: true, simulation: updatedSimulation });
  } catch (error: any) {
    console.error("Error updating simulation:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user || user.role !== "faculty") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Simulation ID is required" }, { status: 400 });
    }

    await prisma.simulation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting simulation:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
