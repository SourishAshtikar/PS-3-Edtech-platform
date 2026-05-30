"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, XCircle, RotateCcw, ArrowRight, HelpCircle, Check, X } from "lucide-react";
import Link from "next/link";
import { Question } from "@/data/module1QuizData";

interface QuizResultProps {
  subtopicId: string;
  title: string;
  questions: Question[];
  userAnswers: Record<number, "A" | "B" | "C" | "D">;
  onRestart: () => void;
}

export function QuizResult({
  subtopicId,
  title,
  questions,
  userAnswers,
  onRestart,
}: QuizResultProps) {
  const totalQuestions = questions.length;
  
  // Calculate score
  let correctCount = 0;
  questions.forEach((q) => {
    if (userAnswers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });
  
  const score = correctCount;
  const wrongCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= 70;

  // Save attempt to localStorage on mount
  useEffect(() => {
    try {
      const storedAttemptsStr = localStorage.getItem("hci_quiz_attempts");
      const attempts = storedAttemptsStr ? JSON.parse(storedAttemptsStr) : [];
      
      const newAttempt = {
        subtopicId,
        quizTitle: title,
        score,
        totalQuestions,
        percentage,
        correctCount,
        wrongCount,
        answers: userAnswers,
        attemptedAt: new Date().toISOString(),
      };
      
      attempts.push(newAttempt);
      localStorage.setItem("hci_quiz_attempts", JSON.stringify(attempts));
      
      // Update student overall stats in localStorage if needed (e.g. earned XP)
      const currentXpStr = localStorage.getItem("student_xp") || "0";
      const earnedXp = correctCount * 10; // 10 XP per correct question
      localStorage.setItem("student_xp", String(parseInt(currentXpStr, 10) + earnedXp));
      
    } catch (e) {
      console.error("Failed to save quiz attempt in localStorage:", e);
    }
  }, [subtopicId, title, score, totalQuestions, percentage, correctCount, wrongCount, userAnswers]);

  // Helper to render option text
  const getOptionText = (q: Question, opt: "A" | "B" | "C" | "D") => {
    const index = opt.charCodeAt(0) - 65;
    return q.options?.[index] || opt;
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Overview Card */}
      <Card className="border-zinc-200 shadow-xl overflow-hidden bg-white">
        <div className={`h-2 ${passed ? "bg-green-600" : "bg-primary"}`} />
        <CardHeader className="text-center pb-4 pt-8">
          <div className="mx-auto mb-4 flex items-center justify-center">
            {passed ? (
              <div className="bg-green-100 p-4 rounded-full text-green-600 animate-bounce">
                <Trophy className="w-16 h-16" />
              </div>
            ) : (
              <div className="bg-red-100 p-4 rounded-full text-primary">
                <XCircle className="w-16 h-16" />
              </div>
            )}
          </div>
          <CardTitle className="text-3xl font-extrabold text-zinc-900">
            {passed ? "Congratulations!" : "Keep Practicing!"}
          </CardTitle>
          <p className="text-zinc-500 mt-2 text-base">
            Quiz Title: <span className="font-semibold text-zinc-800">{title}</span>
          </p>
          <div className="mt-4 flex justify-center items-baseline gap-2">
            <span className="text-4xl font-extrabold text-zinc-900">{score}</span>
            <span className="text-xl text-zinc-400 font-semibold">/</span>
            <span className="text-xl text-zinc-500 font-semibold">{totalQuestions}</span>
            <span className="ml-3 text-2xl font-bold text-zinc-700 bg-zinc-100 px-3 py-1 rounded-lg">
              {percentage}%
            </span>
          </div>
        </CardHeader>

        <CardContent className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
              <span className="text-xs font-bold text-green-600 uppercase tracking-wider block mb-1">Correct</span>
              <span className="text-2xl font-bold text-green-700">{correctCount}</span>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Wrong</span>
              <span className="text-2xl font-bold text-primary">{wrongCount}</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">XP Earned</span>
              <span className="text-2xl font-bold text-amber-800">+{correctCount * 10} XP</span>
            </div>
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-150 text-center">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Status</span>
              <span className={`text-base font-bold uppercase ${passed ? "text-green-600" : "text-primary"}`}>
                {passed ? "Passed" : "Failed"}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-zinc-50 border-t border-zinc-100 p-6 flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            onClick={onRestart}
            variant="outline"
            className="w-full sm:w-auto border-zinc-300 text-zinc-700 font-bold"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Retry Quiz
          </Button>

          <Link
            href={`/student/modules/${subtopicId.startsWith("st2-") ? "m2" : "m1"}`}
            className="w-full sm:w-auto"
          >
            <Button className="w-full bg-primary hover:bg-primary/95 text-white font-bold px-6">
              Back to Module <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Questions Review list */}
      <h3 className="text-xl font-bold text-zinc-800 px-1">Questions Review</h3>
      
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selectedOption = userAnswers[q.id];
          const isCorrect = selectedOption === q.correctAnswer;

          return (
            <Card key={q.id} className="border-zinc-200 shadow-md overflow-hidden bg-white">
              <div className="p-6 space-y-4">
                {/* Question Header */}
                <div className="flex items-start gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 border ${
                    isCorrect
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-red-100 text-primary border-red-200"
                  }`}>
                    Q{qIndex + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-zinc-800 leading-relaxed text-base">
                      {q.questionText}
                    </p>
                  </div>
                </div>

                {/* Question Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
                  {(["A", "B", "C", "D"] as const).map((opt) => {
                    const optionIsCorrect = q.correctAnswer === opt;
                    const optionIsSelected = selectedOption === opt;
                    
                    let cardStyle = "border-zinc-200 bg-white text-zinc-700";
                    let icon = null;

                    if (optionIsCorrect) {
                      cardStyle = "border-green-600 bg-green-50/50 text-green-800 font-medium";
                      icon = <Check className="w-4 h-4 text-green-600 ml-auto flex-shrink-0" />;
                    } else if (optionIsSelected) {
                      cardStyle = "border-primary bg-red-50/50 text-primary font-medium";
                      icon = <X className="w-4 h-4 text-primary ml-auto flex-shrink-0" />;
                    }

                    return (
                      <div
                        key={opt}
                        className={`p-3 rounded-lg border text-sm flex items-center space-x-3 transition-colors ${cardStyle}`}
                      >
                        <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs border ${
                          optionIsCorrect
                            ? "bg-green-600 text-white border-green-600"
                            : optionIsSelected
                            ? "bg-primary text-white border-primary"
                            : "bg-zinc-50 text-zinc-500 border-zinc-200"
                        }`}>
                          {opt}
                        </span>
                        <span className="flex-1 leading-normal">
                          {getOptionText(q, opt)}
                        </span>
                        {icon}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Banner */}
                <div className="pl-11 pt-2">
                  <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4 flex items-start space-x-3">
                    <HelpCircle className="w-5 h-5 text-zinc-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-700">Explanation</h4>
                      <p className="text-sm text-zinc-600 mt-1 leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
