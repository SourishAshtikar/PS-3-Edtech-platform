import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Trophy } from "lucide-react";
export interface SimulationCardProps {
  simulation: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    xpReward: number;
    category?: string;
    module?: {
      moduleNo: number;
      title: string;
    } | null;
  };
  href: string;
}

export function SimulationCard({ simulation, href }: SimulationCardProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Beginner": return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Intermediate": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Advanced": return "bg-red-100 text-red-700 hover:bg-red-100";
      default: return "bg-zinc-100 text-zinc-700";
    }
  };

  const categoryLabel = simulation.category || 
    (simulation.module ? `Module ${simulation.module.moduleNo}: ${simulation.module.title}` : "");

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all hover:border-primary/50 group">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge className={getDifficultyColor(simulation.difficulty)} variant="secondary">
            {simulation.difficulty}
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1 text-amber-600 border-amber-200 bg-amber-50">
            <Trophy className="w-3 h-3 mr-1" />
            {simulation.xpReward} XP
          </Badge>
        </div>
        <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">{simulation.title}</CardTitle>
        <CardDescription className="line-clamp-2">{simulation.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {categoryLabel && (
          <div className="text-sm text-zinc-500 font-medium">
            Related to: {categoryLabel}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 border-t border-zinc-100 mt-auto">
        <Link href={href} className="w-full">
          <div className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-2 px-4 rounded-md font-medium hover:bg-primary/90 transition-colors">
            <Play className="w-4 h-4 fill-current" />
            <span>Start Simulation</span>
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
}

