import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SimulationContainer } from "@/app/student/subjects/[subjectId]/simulations/[id]/SimulationContainer";

export default async function SubtopicSimulationPage({ params }: { params: Promise<{ subjectId: string, id: string, subtopicId: string }> }) {
  const { subjectId, id: moduleId, subtopicId } = await params;
  
  const subtopic = await prisma.subtopic.findUnique({
    where: { id: subtopicId },
    include: { module: true }
  });

  if (!subtopic || !subtopic.simulationUrl) {
    notFound();
  }

  // Create a mock simulation object that SimulationContainer expects
  const simulation = {
    id: subtopic.id,
    title: subtopic.title,
    description: subtopic.description,
    difficulty: "Intermediate",
    xpReward: 100,
    estimatedTime: "15 mins",
    learningOutcome: subtopic.learningOutcome || "Practice and apply the principles from the learning materials in an interactive environment.",
    frontendUrl: subtopic.simulationUrl,
  };

  return (
    <SimulationContainer 
      simulation={simulation} 
      category={`Module ${subtopic.module.moduleNo}: ${subtopic.module.title}`} 
    />
  );
}
