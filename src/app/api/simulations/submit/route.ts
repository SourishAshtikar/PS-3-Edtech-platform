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

    const simulation = await prisma.simulation.findUnique({
      where: { id: simulationId },
      include: { module: true }
    });

    if (!simulation) {
      return NextResponse.json({ error: "Simulation not found" }, { status: 404 });
    }

    // Check if already completed to prevent double XP reward
    const existingCompletion = await prisma.simulationProgress.findFirst({
      where: {
        userId: user.id,
        simulationId,
        completed: true,
      },
    });

    const xpEarned = existingCompletion ? 0 : simulation.xpReward;

    const result = await prisma.$transaction(async (tx) => {
      // Create attempt
      const attempt = await tx.simulationProgress.create({
        data: {
          userId: user.id,
          simulationId,
          completed: true,
          xpEarned,
        },
      });

      // Update User XP
      let updatedUser = user;
      if (xpEarned > 0) {
        updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            xp: { increment: xpEarned },
          },
        });

        const subjectId = simulation.module?.subjectId;
        if (subjectId) {
          const enrollment = await tx.subjectEnrollment.findUnique({
            where: { userId_subjectId: { userId: user.id, subjectId } }
          });
          
          if (enrollment) {
            await tx.subjectEnrollment.update({
              where: { id: enrollment.id },
              data: { xp: { increment: xpEarned } }
            });
          } else {
            await tx.subjectEnrollment.create({
              data: { userId: user.id, subjectId, xp: xpEarned }
            });
          }
        }
      }

      return { attempt, xpEarned, updatedUser };
    });

    return NextResponse.json({
      success: true,
      xpEarned: result.xpEarned,
      userXp: result.updatedUser.xp,
    });
  } catch (error: any) {
    console.error("Simulation submission error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
