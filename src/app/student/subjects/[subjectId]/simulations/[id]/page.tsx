import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SimulationContainer } from "./SimulationContainer";

export default async function SimulationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const simulation = await prisma.simulation.findUnique({
    where: { id },
    include: { module: true }
  });

  if (!simulation) {
    notFound();
  }

  const category = simulation.module ? `Module ${simulation.module.moduleNo}: ${simulation.module.title}` : "General";

  // Cast type to match SimulationContainer expectations
  const typedSimulation = {
    id: simulation.id,
    title: simulation.title,
    description: simulation.description,
    difficulty: simulation.difficulty,
    xpReward: simulation.xpReward,
    estimatedTime: simulation.estimatedTime,
    learningOutcome: simulation.learningOutcome,
    frontendUrl: simulation.frontendUrl,
  };

  return <SimulationContainer simulation={typedSimulation} category={category} />;
}


