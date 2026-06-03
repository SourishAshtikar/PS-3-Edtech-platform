import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ChevronLeft, Trophy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AttemptReviewPage({ params }: { params: Promise<{ subjectId: string; id: string; attemptId: string }> }) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const { subjectId, id: quizId, attemptId } = await params;

  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: { 
      quiz: {
        include: { questions: true }
      } 
    }
  });

  if (!attempt || attempt.userId !== user.id || attempt.quizId !== quizId) {
    notFound();
  }

  const percentage = attempt.totalMarks > 0 ? (attempt.score / attempt.totalMarks) * 100 : 0;
  const passed = percentage >= 70;
  const rawAnswersData = attempt.answersData as any[] || [];

  // Merge with actual questions from the database in case this is an older attempt
  // that only saved questionId, selectedOption, and isCorrect.
  const answersData = rawAnswersData.map(ans => {
    const dbQuestion = attempt.quiz.questions.find(q => q.id === ans.questionId);
    return {
      ...ans,
      questionText: ans.questionText || dbQuestion?.questionText || "Unknown Question",
      options: ans.options || dbQuestion?.options || [],
      correctAnswer: ans.correctAnswer || dbQuestion?.correctAnswer || "",
      explanation: ans.explanation || dbQuestion?.explanation || null
    };
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href={`/student/subjects/${subjectId}/quizzes`} className="flex items-center text-sm font-medium text-zinc-500 hover:text-primary mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Quizzes
      </Link>

      <Card className="border-zinc-200 shadow-xl overflow-hidden mb-8">
        <div className={`h-2 ${passed ? "bg-green-600" : "bg-primary"}`} />
        <CardHeader className="text-center pb-4 pt-8">
          <div className="mx-auto mb-4 flex items-center justify-center">
            {passed ? (
              <div className="bg-green-100 p-4 rounded-full text-green-600">
                <Trophy className="w-16 h-16" />
              </div>
            ) : (
              <div className="bg-red-100 p-4 rounded-full text-primary">
                <XCircle className="w-16 h-16" />
              </div>
            )}
          </div>
          <CardTitle className="text-3xl font-extrabold text-zinc-900">
            {passed ? "Attempt Passed!" : "Attempt Failed"}
          </CardTitle>
          <p className="text-zinc-500 mt-2">
            You scored <span className="font-bold text-zinc-800">{attempt.score}</span> out of{" "}
            <span className="font-bold text-zinc-800">{attempt.totalMarks}</span> ({Math.round(percentage)}%)
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Taken on {new Date(attempt.createdAt).toLocaleDateString()} at {new Date(attempt.createdAt).toLocaleTimeString()}
          </p>
        </CardHeader>
        <CardContent className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-center">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">XP Awarded</span>
              <span className="text-2xl font-bold text-amber-600">+{attempt.xpEarned} XP</span>
            </div>
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-center">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Passing Score</span>
              <span className="text-2xl font-bold text-zinc-700">70%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {answersData && answersData.length > 0 && (
        <Card className="border-zinc-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Detailed Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {answersData.map((ans, idx) => (
              <div key={ans.questionId || idx} className={`p-4 rounded-xl border ${ans.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex space-x-3 items-start mb-3">
                  {ans.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-zinc-900">{idx + 1}. {ans.questionText}</p>
                  </div>
                </div>
                
                <div className="ml-9 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Your Answer</span>
                      {ans.selectedOption ? (
                        <div className={`text-sm font-medium p-2 rounded border ${ans.isCorrect ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                          {ans.selectedOption}) {ans.options && ans.options[ans.selectedOption.charCodeAt(0) - 65]}
                        </div>
                      ) : (
                        <div className="text-sm font-medium p-2 rounded border bg-zinc-100 text-zinc-500 border-zinc-300">
                          Did not answer
                        </div>
                      )}
                    </div>
                    
                    {!ans.isCorrect && (
                      <div>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Correct Answer</span>
                        <div className="text-sm font-medium p-2 rounded border bg-green-100 text-green-800 border-green-300">
                          {ans.correctAnswer}) {ans.options && ans.options[ans.correctAnswer.charCodeAt(0) - 65]}
                        </div>
                      </div>
                    )}
                  </div>

                  {ans.explanation && (
                    <div className="mt-3 bg-white/60 p-3 rounded text-sm text-zinc-700 border border-zinc-200">
                      <span className="font-semibold text-zinc-900">Explanation:</span> {ans.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
