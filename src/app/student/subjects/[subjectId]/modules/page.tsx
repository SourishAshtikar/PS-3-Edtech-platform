import { ModuleCard } from "@/components/cards/ModuleCard";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ModulesPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });

  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const modules = await prisma.module.findMany({
    where: { subjectId },
    include: { 
      subtopics: true,
      quizzes: true,
      simulations: true
    },
    orderBy: { moduleNo: 'asc' },
  });

  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id, quiz: { module: { subjectId } } }
  });

  const simulationProgress = await prisma.simulationProgress.findMany({
    where: { userId: user.id, simulation: { module: { subjectId } } }
  });

  const modulesWithXp = modules.map(mod => {
    const totalXpAvailable = 
      mod.quizzes.reduce((acc, q) => acc + q.xpReward, 0) + 
      mod.simulations.reduce((acc, s) => acc + s.xpReward, 0);

    const moduleQuizAttempts = quizAttempts.filter(qa => mod.quizzes.some(q => q.id === qa.quizId));
    const moduleSimProgress = simulationProgress.filter(sp => mod.simulations.some(s => s.id === sp.simulationId));

    const xpEarned = 
      moduleQuizAttempts.reduce((acc, qa) => acc + qa.xpEarned, 0) +
      moduleSimProgress.reduce((acc, sp) => acc + sp.xpEarned, 0);

    return {
      ...mod,
      totalXpAvailable,
      xpEarned
    };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">{subject?.name || "Subject"}</Badge>
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-primary" />
          Learning Modules
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">
          Master the concepts of {subject?.name} across {modules.length} comprehensive modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulesWithXp.map((module) => (
          <ModuleCard key={module.id} module={module} href={`/student/subjects/${subjectId}/modules/${module.id}`} />
        ))}
      </div>
    </div>
  );
}
