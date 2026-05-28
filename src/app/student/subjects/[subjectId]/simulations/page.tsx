import { SimulationCard } from "@/components/cards/SimulationCard";
import { Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SimulationsPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });

  const dbSimulations = await prisma.simulation.findMany({
    where: { module: { subjectId } },
    include: { module: true },
    orderBy: { title: 'asc' }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">{subject?.name || "Interactive"}</Badge>
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
          <Gamepad2 className="w-8 h-8 mr-3 text-primary" />
          Simulations Library
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">
          Apply {subject?.name || "UI"} principles practically. Earn XP and Badges by completing these {dbSimulations.length} interactive sandboxes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dbSimulations.map((sim) => (
          <SimulationCard key={sim.id} simulation={sim} href={`/student/subjects/${subjectId}/simulations/${sim.id}`} />
        ))}
      </div>
    </div>
  );
}

