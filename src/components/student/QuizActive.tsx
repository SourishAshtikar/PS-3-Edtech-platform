"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, AlertTriangle, ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  marks: number;
}

interface QuizActiveProps {
  quiz: {
    id: string;
    title: string;
    timeLimit: number;
    xpReward: number;
    questions: Question[];
  };
  onBack: () => void;
}

export function QuizActive({ quiz, onBack }: QuizActiveProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    score: number;
    totalQuestions: number;
    xpEarned: number;
    unlockedBadge: { name: string; description: string } | null;
  } | null>(null);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (option: string) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const answersPayload = Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    // Ensure all questions are represented (even if unanswered)
    quiz.questions.forEach((q) => {
      if (!selectedAnswers[q.id]) {
        answersPayload.push({
          questionId: q.id,
          selectedOption: "",
        });
      }
    });

    try {
      const response = await fetch("/api/quizzes/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz.id,
          answers: answersPayload,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        alert(data.error || "Failed to submit quiz");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  if (result) {
    const percentage = (result.score / result.totalQuestions) * 100;
    const passed = percentage >= 70;

    return (
      <Card className="border-zinc-200 shadow-xl overflow-hidden max-w-2xl mx-auto">
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
            {passed ? "Assessment Completed!" : "Keep Practicing!"}
          </CardTitle>
          <p className="text-zinc-500 mt-2">
            You scored <span className="font-bold text-zinc-800">{result.score}</span> out of{" "}
            <span className="font-bold text-zinc-800">{result.totalQuestions}</span> ({Math.round(percentage)}%)
          </p>
        </CardHeader>
        <CardContent className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-center">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">XP Awarded</span>
              <span className="text-2xl font-bold text-amber-600">+{result.xpEarned} XP</span>
            </div>
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-center">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Passing Score</span>
              <span className="text-2xl font-bold text-zinc-700">70%</span>
            </div>
          </div>

          {result.unlockedBadge && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center space-x-4">
              <div className="bg-amber-100 text-amber-600 p-2.5 rounded-full">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <Badge className="bg-amber-600 text-white hover:bg-amber-700 border-none mb-1">New Badge Unlocked!</Badge>
                <h4 className="font-bold text-zinc-800 text-base">{result.unlockedBadge.name}</h4>
                <p className="text-zinc-600 text-sm mt-0.5">{result.unlockedBadge.description}</p>
              </div>
            </div>
          )}

          {!passed && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start space-x-3 text-amber-800">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                To earn the <strong>{quiz.xpReward} XP</strong> reward and related badges, you need to score at least <strong>70%</strong>. Review the reading materials and try again!
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-zinc-50 border-t border-zinc-100 p-6 flex flex-col sm:flex-row gap-4">
          <Link href="/student/quizzes" className="w-full">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
              All Quizzes
            </Button>
          </Link>
          {!passed && (
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full border-zinc-300">
              <RotateCcw className="w-4 h-4 mr-2" /> Retry Quiz
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
      <CardHeader className="bg-zinc-50 border-b border-zinc-100 pb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-zinc-500">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <div className="flex items-center text-primary font-bold text-lg bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <Clock className="w-5 h-5 mr-1.5 animate-pulse" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <Progress value={progressPercent} className="h-2 bg-zinc-200" />
      </CardHeader>
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6 leading-tight">
          {currentQuestion.questionText}
        </h2>
        <div className="space-y-4">
          {[
            { key: "A", label: currentQuestion.optionA },
            { key: "B", label: currentQuestion.optionB },
            { key: "C", label: currentQuestion.optionC },
            { key: "D", label: currentQuestion.optionD },
          ].map(({ key, label }) => {
            const isSelected = selectedAnswers[currentQuestion.id] === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectOption(key)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center space-x-4 ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary font-semibold shadow-sm"
                    : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold border-2 ${
                    isSelected
                      ? "bg-primary text-white border-primary"
                      : "bg-zinc-100 text-zinc-500 border-zinc-300"
                  }`}
                >
                  {key}
                </span>
                <span className="text-base">{label}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="bg-zinc-50 border-t border-zinc-100 p-6 flex justify-between">
        <Button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          variant="outline"
          className="border-zinc-300"
        >
          Previous
        </Button>
        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white font-bold px-6"
          >
            {isSubmitting ? "Submitting..." : "Submit Assessment"}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white font-bold px-6"
          >
            Next <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
