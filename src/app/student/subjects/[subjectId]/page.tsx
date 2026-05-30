import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Flame, Trophy, Play, BookOpen, Target, Zap, Clock, Star,
  Gamepad2, Users, FileText, ExternalLink, Award, CheckCircle,
  ArrowRight, Book
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubjectResourceCard } from "@/components/cards/SubjectResourceCard";

export default async function StudentDashboard({ params }: { params: Promise<{ subjectId: string }> }) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const { subjectId } = await params;

  // 1. Fetch Subject and ensure Enrollment
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) redirect("/student/dashboard");

  let enrollment = await prisma.subjectEnrollment.findUnique({
    where: {
      userId_subjectId: { userId: user.id, subjectId }
    }
  });

  if (!enrollment) {
    enrollment = await prisma.subjectEnrollment.create({
      data: { userId: user.id, subjectId }
    });
  }

  // 2. Execute all independent queries concurrently
  const [
    modules,
    userProgress,
    recommendedSimulations,
    quizzes,
    enrollmentsTop,
    higherRankCount,
    subjectResources,
    userBadges
  ] = await Promise.all([
    prisma.module.findMany({
      where: { subjectId },
      include: { subtopics: true },
      orderBy: { moduleNo: 'asc' }
    }),
    prisma.studentProgress.findMany({
      where: { userId: user.id }
    }),
    prisma.simulation.findMany({
      where: { module: { subjectId } },
      take: 2,
      orderBy: { xpReward: 'desc' }
    }),
    prisma.quiz.findMany({
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
    }),
    prisma.subjectEnrollment.findMany({
      where: { subjectId },
      include: { user: true },
      orderBy: { xp: 'desc' },
      take: 3
    }),
    prisma.subjectEnrollment.count({
      where: { 
        subjectId, 
        xp: { gt: enrollment.xp } 
      }
    }),
    prisma.resource.findMany({
      where: { subjectId },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.userBadge.findMany({
      where: { userId: user.id },
      include: { badge: true }
    })
  ]);

  const topStudents = enrollmentsTop.map(e => ({ ...e.user, subjectXp: e.xp }));
  const classRank = higherRankCount + 1;

  // 9. Calculate Overall Progress & Active Module
  const totalSubjectSubtopics = modules.reduce((sum, mod) => sum + (mod.subtopics?.length || 0), 0);
  const completedSubjectSubtopics = userProgress.reduce((sum, prog) => sum + (prog.completedSubtopics?.length || 0), 0);
  const overallProgressPercent = totalSubjectSubtopics > 0 ? Math.round((completedSubjectSubtopics / totalSubjectSubtopics) * 100) : 0;
  
  const activeModule = modules.find(m => {
    const p = userProgress.find(up => up.moduleId === m.id);
    return !p || !p.completed || p.completedSubtopics.length < m.subtopics.length;
  }) || modules[modules.length - 1] || modules[0];

  const activeModuleProgress = activeModule ? userProgress.find((p) => p.moduleId === activeModule.id) : null;
  const activeModuleCompletedSubtopics = activeModuleProgress?.completedSubtopics.length || 0;
  const activeModuleTotalSubtopics = activeModule?.subtopics?.length || 1;
  const activeModuleProgressPercent = Math.round((activeModuleCompletedSubtopics / activeModuleTotalSubtopics) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome & Top Stats Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary to-[#700000] text-white border-primary shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-white/10 blur-3xl transform translate-x-1/2 rounded-full"></div>
          <CardHeader className="relative z-10 pb-0">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">Welcome back, {user.name || "Student"}!</CardTitle>
                <CardDescription className="text-white/80 mt-2 text-base">
                  You are making great progress in {subject.name}. Let's keep the momentum going!
                </CardDescription>
              </div>
              <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-primary-foreground text-primary font-bold text-lg">
                  {(user.name || "Student").charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-xl p-4 flex-1 flex items-center space-x-4 border border-white/10">
                <div className="bg-amber-400 p-2.5 rounded-xl text-amber-900 shadow-inner">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white/75 uppercase tracking-wider mb-0.5">{subject.name} XP</div>
                  <div className="text-2xl font-bold tracking-tight">{enrollment.xp} XP</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-xl p-4 flex-1 flex items-center space-x-4 border border-white/10">
                <div className="bg-orange-400 p-2.5 rounded-xl text-orange-900 shadow-inner">
                  <Flame className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white/75 uppercase tracking-wider mb-0.5">Daily Streak</div>
                  <div className="text-2xl font-bold tracking-tight">{user.streak} Days</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-xl p-4 flex-1 flex items-center space-x-4 border border-white/10">
                <div className="bg-blue-400 p-2.5 rounded-xl text-blue-900 shadow-inner">
                  <Trophy className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white/75 uppercase tracking-wider mb-0.5">Class Rank</div>
                  <div className="text-2xl font-bold tracking-tight">#{classRank || 1}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Resume Card */}
        <Card className="shadow-sm border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center font-bold text-zinc-800">
              <BookOpen className="w-5 h-5 mr-2 text-primary" /> Active Module
            </CardTitle>
            <CardDescription>Continue where you left off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeModule ? (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-semibold text-zinc-700">
                    <span>{activeModule.title}</span>
                    <span className="text-primary">
                      {activeModuleProgressPercent}%
                    </span>
                  </div>
                  <Progress
                    value={activeModuleProgressPercent}
                    className="h-2 bg-zinc-100"
                  />
                </div>
                <div className="text-xs text-zinc-500 font-medium">
                  Next Subtopic: <span className="font-semibold text-zinc-700">
                    {activeModule.subtopics[activeModuleCompletedSubtopics]?.title || "N/A"}
                  </span>
                </div>
                <Link href={`/student/subjects/${subjectId}/modules/${activeModule.id}`}>
                  <Button className="w-full mt-2 bg-primary hover:bg-primary/95 text-white">
                    Resume Module <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="py-6 text-center text-zinc-400 text-sm">
                No active modules available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-10">

          {/* 1. Learning Modules */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2.5 text-primary" /> Learning Modules
                </h3>
                <p className="text-zinc-500 text-sm mt-0.5">Explore syllabus concepts with videos & reference notes.</p>
              </div>
              <Link href={`/student/subjects/${subjectId}/modules`} className="text-sm font-semibold text-primary hover:underline flex items-center">
                All Modules <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {modules.map((mod) => {
                const prog = userProgress.find((p) => p.moduleId === mod.id);
                const completedCount = prog?.completedSubtopics.length || 0;
                const totalCount = mod.subtopics.length;
                const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                return (
                  <Card key={mod.id} className="hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden bg-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-bold text-lg border border-primary/10">
                          {mod.moduleNo}
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-800 text-base leading-snug">{mod.title}</h4>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-zinc-500 font-medium">{mod.hours} Hours</span>
                            <span className="text-xs text-zinc-300">•</span>
                            <span className="text-xs text-zinc-500 font-medium">CO: {mod.co}</span>
                            <span className="text-xs text-zinc-300">•</span>
                            <span className="text-xs text-zinc-500 font-medium">{mod.subtopics.length} Subtopics</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 md:w-1/3 w-full md:justify-end">
                        <div className="flex-1 max-w-[150px]">
                          <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-1">
                            <span>Progress</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <Progress value={progressPercent} className="h-1.5 bg-zinc-100" />
                        </div>
                        <Link href={`/student/subjects/${subjectId}/modules/${mod.id}`}>
                          <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/5 text-xs font-semibold px-4 h-9">
                            Study
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>


          {/* 2.5 Subject Resources */}
          {subjectResources.length > 0 && (
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-zinc-900 flex items-center mb-5">
                <Book className="w-6 h-6 mr-2.5 text-primary" /> Subject Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjectResources.map(resource => (
                  <div key={resource.id}>
                    <SubjectResourceCard
                      title={resource.title}
                      type={resource.type}
                      link={resource.link}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Quizzes & Assessments */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 flex items-center">
                  <Target className="w-6 h-6 mr-2.5 text-primary" /> Quizzes & Assessments
                </h3>
                <p className="text-zinc-500 text-sm mt-0.5">Test your concept understanding and earn XP points.</p>
              </div>
              <Link href={`/student/subjects/${subjectId}/quizzes`} className="text-sm font-semibold text-primary hover:underline flex items-center">
                All Quizzes <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quizzes.map((quiz) => {
                const attempt = quiz.attempts[0];
                const isCompleted = attempt?.completed;

                return (
                  <Card key={quiz.id} className={`hover:border-primary/30 transition-all duration-200 ${isCompleted ? 'bg-zinc-50/50' : 'bg-white'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline" className="text-[10px] px-2 border-zinc-200">
                          Module {quiz.module.moduleNo}
                        </Badge>
                        {isCompleted ? (
                          <Badge className="bg-emerald-100 hover:bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0 border-none font-semibold flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" /> Score: {attempt.score}/{attempt.totalMarks}
                          </Badge>
                        ) : (
                          <Badge className="bg-red-50 hover:bg-red-50 text-red-700 text-[10px] px-2 py-0 border border-red-200 font-semibold">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base font-bold text-zinc-800 line-clamp-1">{quiz.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" /> <span>{quiz.timeLimit}m limit</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-3.5 h-3.5" /> <span>{quiz.questions.length} Questions</span>
                        </div>
                        <div className="flex items-center text-amber-600 font-bold">
                          <Zap className="w-3.5 h-3.5 mr-0.5" /> <span>+{quiz.xpReward} XP</span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-4">
                      {isCompleted ? (
                        <Button variant="outline" disabled className="w-full text-xs font-semibold h-9">
                          Attempted
                        </Button>
                      ) : (
                        <Link href={`/student/subjects/${subjectId}/quizzes/${quiz.id}`} className="w-full block">
                          <Button className="w-full bg-primary hover:bg-primary/95 text-white text-xs font-semibold h-9 shadow-sm">
                            Start Quiz
                          </Button>
                        </Link>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Quick Challenges Extra Widget */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 text-base leading-snug">Rapid Fire Challenge</h4>
                <p className="text-amber-700/80 text-xs mt-0.5">Test your split-second concept recognition skills under a 60-second clock.</p>
              </div>
            </div>
            <Link href={`/student/subjects/${subjectId}/rapid-fire`}>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 h-9 shadow-sm">
                Challenge Yourself
              </Button>
            </Link>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">

          {/* 1. Recommended Simulations */}
          <Card className="bg-white shadow-sm border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-zinc-800 flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2 text-primary" /> Interactive Labs
              </CardTitle>
              <CardDescription className="text-xs">Gain visual UI practice on interactive simulators.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedSimulations.map((sim) => (
                <div key={sim.id} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg hover:border-primary/20 transition-all duration-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <Badge className="bg-amber-100 text-amber-800 text-[9px] hover:bg-amber-100 border-none font-bold">
                      +{sim.xpReward} XP
                    </Badge>
                    <Badge variant="outline" className="text-[9px] text-zinc-500">
                      {sim.difficulty}
                    </Badge>
                  </div>
                  <h5 className="font-semibold text-zinc-800 text-sm leading-snug line-clamp-1">{sim.title}</h5>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{sim.description}</p>
                  <Link href={`/student/subjects/${subjectId}/simulations/${sim.id}`} className="mt-3 block">
                    <Button variant="secondary" size="sm" className="w-full text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 h-8">
                      <Play className="w-3 h-3 mr-1.5 fill-current" /> Start Lab
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 2. Top Peers / Leaderboard Preview */}
          <Card className="bg-white shadow-sm border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-zinc-800 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-amber-500" /> Leaderboard Top 3
              </CardTitle>
              <CardDescription className="text-xs">Top performers in this subject cohort.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topStudents.map((student, idx) => {
                const isCurrentUser = student.id === user.id;
                const diceSeed = (student.name || "Student").replace(/\s+/g, "");
                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-150 ${isCurrentUser
                      ? "bg-primary/5 border-primary/20"
                      : "bg-zinc-50/50 border-zinc-100"
                      }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-6 h-6 flex items-center justify-center font-bold text-sm text-zinc-500">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                      </div>
                      <Avatar className="w-8 h-8 border border-zinc-200 flex-shrink-0">
                        <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${diceSeed}`} alt={student.name || "Student"} />
                        <AvatarFallback>{(student.name || "St").charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isCurrentUser ? "text-primary" : "text-zinc-800"}`}>
                          {student.name || "Unknown Student"} {isCurrentUser && "(You)"}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-medium">Streak: {student.streak} Days</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-bold ${isCurrentUser ? "border-primary text-primary" : "text-zinc-700 bg-white"}`}>
                      {(student as any).subjectXp} XP
                    </Badge>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-zinc-100 flex justify-between items-center text-xs font-semibold text-zinc-500">
                <span>Your Rank: #{classRank}</span>
                <Link href={`/student/subjects/${subjectId}/leaderboard`} className="text-primary hover:underline">
                  Full Board
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 3. Badges Earned */}
          <Card className="bg-white shadow-sm border-zinc-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold text-zinc-800 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary" /> Badges Unlocked
                </CardTitle>
                <Link href="/student/profile" className="text-xs text-primary font-medium hover:underline">
                  View All
                </Link>
              </div>
              <CardDescription className="text-xs">Your academic and learning accomplishments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2.5">
                {userBadges.length > 0 ? (
                  userBadges.slice(0, 8).map((ub) => (
                    <div
                      key={ub.id}
                      className="aspect-square bg-zinc-50 rounded-lg flex flex-col items-center justify-center p-1.5 border border-zinc-100 group relative cursor-help"
                      title={`${ub.badge.name}: ${ub.badge.description}`}
                    >
                      <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] text-zinc-500 font-bold truncate w-full text-center mt-1">
                        {ub.badge.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 col-span-4 text-center py-4">
                    No badges unlocked yet. Keep studying!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
