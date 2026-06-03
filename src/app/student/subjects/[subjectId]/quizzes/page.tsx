import Link from "next/link";
import { Target, Clock, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function QuizzesPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const { subjectId } = await params;
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });

  const quizzes = await prisma.quiz.findMany({
    where: { module: { subjectId } },
    include: {
      module: true,
      questions: true,
      attempts: {
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { title: 'asc' }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">{subject?.name || "Assessments"}</Badge>
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
          <Target className="w-8 h-8 mr-3 text-primary" />
          Quizzes & Assessments
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">
          Test your knowledge, earn XP, and climb the leaderboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const attempt = quiz.attempts[0];
          const isCompleted = attempt?.completed;
          const percentage = attempt ? (attempt.score / attempt.totalMarks) * 100 : 0;
          const hasPassed = percentage >= 70;
          const status = isCompleted ? (hasPassed ? "passed" : "failed") : "pending";

          return (
            <Card key={quiz.id} className={`flex flex-col h-full hover:shadow-lg transition-shadow border-zinc-200 ${status === 'passed' ? 'bg-zinc-50 opacity-80' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-zinc-600 bg-white">
                    Module {quiz.module.moduleNo}
                  </Badge>
                  {status === 'pending' && <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Pending</Badge>}
                  {status === 'failed' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Failed</Badge>}
                  {status === 'passed' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>}
                </div>
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2 text-sm text-zinc-600">
                  {status === 'pending' ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" /> <span>Time Limit: {quiz.timeLimit} mins</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" /> <span>{quiz.totalQuestionsToAsk || quiz.questions.length} Questions</span>
                      </div>
                      <div className="flex items-center space-x-2 text-amber-600 font-medium">
                        <Trophy className="w-4 h-4" /> <span>{quiz.xpReward} XP Available</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 font-bold text-lg text-zinc-800">
                        <span>Score: {attempt.score}/{attempt.totalMarks}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-amber-600 font-medium">
                        <Trophy className="w-4 h-4" /> <span>+{attempt.xpEarned} XP Earned</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-zinc-100 mt-auto">
                {status === 'pending' && (
                  <Link href={`/student/subjects/${subjectId}/quizzes/${quiz.id}`} className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">Start Quiz</Button>
                  </Link>
                )}
                {status === 'failed' && (
                  <div className="w-full flex flex-col space-y-2">
                    <Link href={`/student/subjects/${subjectId}/quizzes/${quiz.id}`} className="w-full">
                      <Button variant="outline" className="w-full border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-semibold">Retry Quiz</Button>
                    </Link>
                    <Link href={`/student/subjects/${subjectId}/quizzes/${quiz.id}/attempts/${attempt.id}`} className="w-full">
                      <Button variant="ghost" className="w-full text-zinc-500 hover:text-primary text-xs">Review Last Attempt</Button>
                    </Link>
                  </div>
                )}
                {status === 'passed' && (
                  <div className="w-full flex flex-col space-y-2">
                    <Link href={`/student/subjects/${subjectId}/quizzes/${quiz.id}`} className="w-full">
                      <Button variant="outline" className="w-full text-green-700 border-green-200 bg-green-50 hover:bg-green-100 font-semibold">Retake Quiz</Button>
                    </Link>
                    <Link href={`/student/subjects/${subjectId}/quizzes/${quiz.id}/attempts/${attempt.id}`} className="w-full">
                      <Button variant="ghost" className="w-full text-zinc-500 hover:text-primary text-xs">Review Last Attempt</Button>
                    </Link>
                  </div>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

