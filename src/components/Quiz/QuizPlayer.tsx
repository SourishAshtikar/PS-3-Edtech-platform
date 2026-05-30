"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Question } from "@/data/module1QuizData";
import { ChevronLeft, ChevronRight, CheckCircle, HelpCircle } from "lucide-react";

interface QuizPlayerProps {
  title: string;
  questions: Question[];
  onComplete: (answers: Record<number, "A" | "B" | "C" | "D">) => void;
}

export function QuizPlayer({ title, questions, onComplete }: QuizPlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIdx + 1) / totalQuestions) * 100);

  const handleOptionSelect = (option: "A" | "B" | "C" | "D") => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  // Helper to render option text
  const getOptionText = (q: Question, opt: "A" | "B" | "C" | "D") => {
    const index = opt.charCodeAt(0) - 65;
    return q.options?.[index] || opt;
  };

  return (
    <Card className="border-zinc-200 shadow-xl overflow-hidden bg-white max-w-2xl mx-auto">
      {/* Top red accent bar */}
      <div className="h-2 bg-primary" />
      
      <CardHeader className="p-6 bg-zinc-50 border-b border-zinc-100">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            Question {currentIdx + 1} of {totalQuestions}
          </span>
          <span className="text-xs text-zinc-500 font-semibold">
            {Object.keys(answers).length} answered
          </span>
        </div>
        <CardTitle className="text-lg font-bold text-zinc-900 leading-snug">
          {title}
        </CardTitle>
        <Progress value={progressPercent} className="h-1.5 bg-zinc-200 mt-4" />
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Question Text */}
        <div className="flex items-start space-x-3 bg-zinc-50 p-4 rounded-xl border border-zinc-150">
          <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="font-semibold text-zinc-800 leading-relaxed text-base">
            {currentQuestion.questionText}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {(["A", "B", "C", "D"] as const).map((opt) => {
            const isSelected = answers[currentQuestion.id] === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleOptionSelect(opt)}
                className={`w-full p-4 rounded-xl border-2 text-left flex items-center space-x-4 transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50/50"
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border ${
                  isSelected
                    ? "bg-primary text-white border-primary"
                    : "bg-zinc-50 text-zinc-500 border-zinc-200"
                }`}>
                  {opt}
                </span>
                <span className="text-sm font-medium leading-normal flex-1">
                  {getOptionText(currentQuestion, opt)}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="bg-zinc-50 border-t border-zinc-150 p-6 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIdx === 0}
          className="border-zinc-300 text-zinc-700 font-bold"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>

        {currentIdx < totalQuestions - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < totalQuestions}
            className="bg-primary hover:bg-primary/95 text-white font-bold shadow-md"
          >
            Submit Quiz <CheckCircle className="w-4 h-4 ml-1" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
