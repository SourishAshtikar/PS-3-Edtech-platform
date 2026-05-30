"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Target, Clock, AlertCircle } from "lucide-react";
import { QuizActive } from "@/components/student/QuizActive";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  marks: number;
}

interface QuizContainerProps {
  quiz: {
    id: string;
    moduleId: string;
    title: string;
    difficulty: string;
    timeLimit: number;
    xpReward: number;
    questions: Question[];
    module: {
      moduleNo: number;
    };
  };
}

export function QuizContainer({ quiz }: QuizContainerProps) {
  const [started, setStarted] = useState(false);
  const params = useParams();
  const subjectId = params?.subjectId as string;

  if (started) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <QuizActive quiz={quiz} onBack={() => setStarted(false)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href={subjectId ? `/student/subjects/${subjectId}/quizzes` : "/student/dashboard"} className="flex items-center text-sm font-medium text-zinc-500 hover:text-primary mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Quizzes
      </Link>

      <Card className="border-zinc-200 shadow-lg">
        <CardHeader className="bg-zinc-50 border-b border-zinc-100 pb-6">
          <div className="flex justify-between items-start mb-4">
            <Badge className="bg-primary/10 text-primary border-none">Module {quiz.module.moduleNo}</Badge>
            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">{quiz.xpReward} XP Reward</Badge>
          </div>
          <CardTitle className="text-3xl font-bold text-zinc-900">{quiz.title}</CardTitle>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-zinc-600 font-medium">
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-2 text-primary" /> {quiz.questions.length} Questions
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-primary" /> {quiz.timeLimit} Minutes Time Limit
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4">Instructions</h3>
          <ul className="space-y-3 text-zinc-600 mb-6 list-disc list-inside">
            <li>Ensure you have a stable internet connection before starting.</li>
            <li>Once started, the timer cannot be paused.</li>
            <li>You must score at least 70% to earn the XP reward and badge.</li>
            <li>Avoid refreshing the page during the quiz.</li>
          </ul>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start space-x-3 text-blue-800 mb-6">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Honor Code</p>
              <p>By starting this assessment, you agree to complete it independently without unauthorized assistance.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-zinc-50 border-t border-zinc-100 p-6 flex justify-between items-center">
          {quiz.questions.length === 0 ? (
            <p className="text-red-500 font-semibold text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" /> This quiz has no questions yet.
            </p>
          ) : (
            <div />
          )}
          <Button 
            size="lg" 
            onClick={() => setStarted(true)} 
            disabled={quiz.questions.length === 0}
            className="bg-primary hover:bg-primary/90 text-white font-bold px-8"
          >
            Begin Quiz Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
