import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { simulationId } = body as { simulationId: string };

    if (!simulationId) {
      return NextResponse.json({ error: "Missing simulationId" }, { status: 400 });
    }

    let simulation: any = await prisma.simulation.findUnique({
      where: { id: simulationId },
      include: { module: true }
    });

    let isMockSimulation = false;
    let subtopic = null;

    if (!simulation) {
      // Check if this is a "mock simulation" created from a subtopic's simulationUrl
      subtopic = await prisma.subtopic.findUnique({
        where: { id: simulationId },
        include: { module: true }
      });
      
      if (subtopic && subtopic.simulationUrl) {
        isMockSimulation = true;
        simulation = {
          id: subtopic.id,
          xpReward: 25, // Mock subtopic simulation gives 25 XP
          module: subtopic.module,
        };
      } else {
        return NextResponse.json({ error: "Simulation not found" }, { status: 404 });
      }
    }

    if (!isMockSimulation) {
      // Normal simulation tracking via SimulationProgress
      const existingCompletion = await prisma.simulationProgress.findFirst({
        where: {
          userId: user.id,
          simulationId,
          completed: true,
        },
      });

      const xpEarned = existingCompletion ? 0 : simulation.xpReward;

      const result = await prisma.$transaction(async (tx) => {
        const attempt = await tx.simulationProgress.create({
          data: { userId: user.id, simulationId, completed: true, xpEarned },
        });

        let updatedUser = user;
        if (xpEarned > 0) {
          updatedUser = await tx.user.update({
            where: { id: user.id },
            data: { xp: { increment: xpEarned } },
          });

          const subjectId = simulation.module?.subjectId;
          if (subjectId) {
            await tx.subjectEnrollment.upsert({
              where: { userId_subjectId: { userId: user.id, subjectId } },
              update: { xp: { increment: xpEarned } },
              create: { userId: user.id, subjectId, xp: xpEarned },
            });
          }
        }
        return { attempt, xpEarned, updatedUser };
      });

      return NextResponse.json({ success: true, xpEarned: result.xpEarned, userXp: result.updatedUser.xp });
    } else {
      // Handle mock simulation completion via StudentProgress to prevent foreign key errors
      const existingProgress = await prisma.studentProgress.findUnique({
        where: { userId_moduleId: { userId: user.id, moduleId: subtopic.moduleId } }
      });

      const resourceKey = `${subtopic.id}-sandbox_completed`;
      const completedResources = existingProgress?.completedResources || [];

      if (completedResources.includes(resourceKey)) {
        return NextResponse.json({ success: true, xpEarned: 0, userXp: user.xp });
      }

      completedResources.push(resourceKey);
      const xpEarned = simulation.xpReward;

      await prisma.studentProgress.upsert({
        where: { userId_moduleId: { userId: user.id, moduleId: subtopic.moduleId } },
        update: { completedResources: { set: completedResources } },
        create: {
          userId: user.id,
          moduleId: subtopic.moduleId,
          completedSubtopics: [],
          completedResources: [resourceKey],
          completed: false,
        }
      });

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { xp: { increment: xpEarned } }
      });

      const subjectId = subtopic.module?.subjectId;
      if (subjectId) {
        await prisma.subjectEnrollment.upsert({
          where: { userId_subjectId: { userId: user.id, subjectId } },
          update: { xp: { increment: xpEarned } },
          create: { userId: user.id, subjectId, xp: xpEarned },
        });
      }

      return NextResponse.json({ success: true, xpEarned, userXp: updatedUser.xp });
    }


  } catch (error: any) {
    console.error("Simulation submission error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
