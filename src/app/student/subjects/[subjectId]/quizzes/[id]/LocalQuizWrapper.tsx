"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SubtopicQuiz } from "@/data/module1QuizData";
import { QuizPlayer } from "@/components/Quiz/QuizPlayer";
import { QuizResult } from "@/components/Quiz/QuizResult";

interface LocalQuizWrapperProps {
  quiz: SubtopicQuiz;
}

export function LocalQuizWrapper({ quiz }: LocalQuizWrapperProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});

  const handleComplete = (answers: Record<number, "A" | "B" | "C" | "D">) => {
    setUserAnswers(answers);
    setIsCompleted(true);
  };

  const handleRestart = () => {
    setUserAnswers({});
    setIsCompleted(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      {/* Back button */}
      <div className="mb-6 max-w-2xl mx-auto">
        <Link
          href={`/student/modules/${quiz.subtopicId.startsWith("st2-") ? "m2" : "m1"}`}
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Module {quiz.subtopicId.startsWith("st2-") ? "2" : "1"}
        </Link>
      </div>

      {/* Main player/result rendering */}
      {!isCompleted ? (
        <QuizPlayer
          title={quiz.title}
          questions={quiz.questions}
          onComplete={handleComplete}
        />
      ) : (
        <QuizResult
          subtopicId={quiz.subtopicId}
          title={quiz.title}
          questions={quiz.questions}
          userAnswers={userAnswers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
