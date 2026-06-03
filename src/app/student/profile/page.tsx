import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Flame, Trophy, Award, Calendar, BookOpen, Target, CheckCircle2 } from "lucide-react";

export default async function StudentProfilePage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  // Fetch all students to calculate rank
  const allStudents = await prisma.user.findMany({
    where: { role: 'student' },
    orderBy: { xp: 'desc' }
  });
  const classRank = allStudents.findIndex(u => u.id === user.id) + 1;

  // Fetch badges earned
  const userBadges = await prisma.userBadge.findMany({
    where: { userId: user.id },
    include: { badge: true },
    orderBy: { dateEarned: 'desc' }
  });

  // Fetch quiz attempts
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    include: { quiz: { include: { module: true } } },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch simulation attempts
  const simulationAttempts = await prisma.simulationProgress.findMany({
    where: { userId: user.id },
    include: { simulation: { include: { module: true } } },
    orderBy: { createdAt: 'desc' }
  });

  const formattedJoinDate = user.createdAt.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile Header Card */}
      <Card className="border-zinc-200 shadow-md mb-8 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-[#7a0000]" />
        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 mb-4 sm:space-x-6 text-center sm:text-left">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg bg-zinc-100">
              <AvatarFallback className="bg-primary text-white text-4xl font-extrabold">
                {(user.name || "Student").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="pt-4 sm:pt-0 pb-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-3xl font-extrabold text-zinc-900 leading-tight">{user.name || "Student"}</h1>
                  <p className="text-zinc-500 text-sm font-medium">{user.email}</p>
                </div>
                <Badge className="bg-primary text-white hover:bg-primary border-none self-center sm:self-auto capitalize px-3 py-1 text-sm font-bold">
                  {user.role}
                </Badge>
              </div>
              <div className="flex items-center justify-center sm:justify-start text-xs text-zinc-400 mt-2 font-medium">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                <span>Joined {formattedJoinDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-amber-100 text-amber-600 p-3 rounded-xl">
              <Star className="w-7 h-7 fill-current" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Experience</p>
              <h3 className="text-2xl font-bold text-zinc-800">{user.xp} XP</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
              <Flame className="w-7 h-7 fill-current" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Daily Streak</p>
              <h3 className="text-2xl font-bold text-zinc-800">{user.streak} Days</h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">Max Streak: {(user as any).maxStreak || 0} Days</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
              <Trophy className="w-7 h-7 fill-current" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Leaderboard Rank</p>
              <h3 className="text-2xl font-bold text-zinc-800">#{classRank || 1}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Badges */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-zinc-200 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Award className="w-5 h-5 mr-2 text-primary" /> Badges Earned ({userBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBadges.length > 0 ? (
                <div className="space-y-4">
                  {userBadges.map((ub) => (
                    <div key={ub.id} className="flex items-start space-x-3 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                      <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-zinc-800">{ub.badge.name}</p>
                        <p className="text-xs text-zinc-500">{ub.badge.description}</p>
                        <span className="text-[10px] text-zinc-400 block mt-1">Earned {ub.dateEarned.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 py-6 text-center">No badges earned yet. Complete assessments and modules to unlock achievements.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Activity/Attempts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quiz Attempts */}
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" /> Quiz History ({quizAttempts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quizAttempts.length > 0 ? (
                <div className="divide-y divide-zinc-100">
                  {quizAttempts.map((attempt) => (
                    <div key={attempt.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
                      <div>
                        <h4 className="font-semibold text-zinc-800">{attempt.quiz.title}</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">Module {attempt.quiz.module.moduleNo} • {attempt.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${attempt.score / attempt.totalMarks >= 0.7 ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'} border-none font-bold`}>
                          Score: {attempt.score}/{attempt.totalMarks}
                        </Badge>
                        <span className="text-xs text-amber-600 block mt-1">+{attempt.xpEarned} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 py-6 text-center">No quizzes attempted yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Simulation Attempts */}
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" /> Simulation History ({simulationAttempts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {simulationAttempts.length > 0 ? (
                <div className="divide-y divide-zinc-100">
                  {simulationAttempts.map((attempt) => (
                    <div key={attempt.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
                      <div>
                        <h4 className="font-semibold text-zinc-800">{attempt.simulation.title}</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">Module {attempt.simulation.module.moduleNo} • {attempt.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold">
                          Completed
                        </Badge>
                        <span className="text-xs text-amber-600 block mt-1">+{attempt.xpEarned} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 py-6 text-center">No simulations completed yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
