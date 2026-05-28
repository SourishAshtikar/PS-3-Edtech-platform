import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity, Star, Target, Gamepad2, Award, AlertTriangle, Trophy, Frown, BookOpen } from "lucide-react";
import { getOrCreateUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FacultyAnalyticsPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const user = await getOrCreateUser();
  if (!user || user.role !== "faculty") redirect("/sign-in");

  const { subjectId } = await params;

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId }
  });

  if (!subject) return <div>Subject not found</div>;

  // Fetch all students enrolled in this subject and their progress/attempts
  const enrollments = await prisma.subjectEnrollment.findMany({
    where: { subjectId },
    include: {
      user: {
        include: {
          quizAttempts: {
            where: { quiz: { module: { subjectId } } },
            include: { quiz: true }
          },
          simulationProgress: {
            where: { simulation: { module: { subjectId } } },
            include: { simulation: true }
          },
          userBadges: true,
        }
      }
    },
    orderBy: { xp: "desc" },
  });

  const students = enrollments.map(e => ({
    ...e.user,
    subjectXp: e.xp // Subject specific XP
  }));


  // 1. Core aggregations
  const totalStudents = students.length;
  const totalXP = students.reduce((sum, s) => sum + s.subjectXp, 0);
  const averageXP = totalStudents > 0 ? Math.round(totalXP / totalStudents) : 0;
  
  const totalQuizzesAttempted = students.reduce((sum, s) => sum + s.quizAttempts.length, 0);
  const totalSimulationsCompleted = students.reduce((sum, s) => sum + s.simulationProgress.length, 0);

  // 2. Average Quiz Scores
  let allQuizScoresSum = 0;
  let allQuizTotalMarksSum = 0;
  let totalSuccessfulAttempts = 0;

  students.forEach(s => {
    s.quizAttempts.forEach(qa => {
      allQuizScoresSum += qa.score;
      allQuizTotalMarksSum += qa.totalMarks;
      totalSuccessfulAttempts++;
    });
  });

  const averageQuizScorePercent = allQuizTotalMarksSum > 0 
    ? Math.round((allQuizScoresSum / allQuizTotalMarksSum) * 100)
    : 0;

  // 3. Leaderboard
  const allStudentsRanked = students;

  // 4. Inactive Students (XP = 0 or no quiz/sim activity)
  const inactiveStudents = students.filter(s => s.subjectXp === 0 && s.quizAttempts.length === 0 && s.simulationProgress.length === 0);

  // 5. Weak Topics Calculator
  const quizScoresMap: Record<string, { totalEarned: number; totalMarks: number; attemptsCount: number }> = {};
  
  students.forEach(s => {
    s.quizAttempts.forEach(qa => {
      const quizTitle = qa.quiz.title;
      if (!quizScoresMap[quizTitle]) {
        quizScoresMap[quizTitle] = { totalEarned: 0, totalMarks: 0, attemptsCount: 0 };
      }
      quizScoresMap[quizTitle].totalEarned += qa.score;
      quizScoresMap[quizTitle].totalMarks += qa.totalMarks;
      quizScoresMap[quizTitle].attemptsCount += 1;
    });
  });

  const weakTopics = Object.entries(quizScoresMap)
    .map(([title, data]) => {
      const avgPercent = data.totalMarks > 0 ? Math.round((data.totalEarned / data.totalMarks) * 100) : 0;
      return { title, avgPercent, attempts: data.attemptsCount };
    })
    .filter(topic => topic.avgPercent < 70)
    .sort((a, b) => a.avgPercent - b.avgPercent)
    .slice(0, 3); // Top 3 weakest topics

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Badge className="mb-2 bg-primary/10 text-primary border-none">Subject Analytics</Badge>
          <h1 className="text-3xl font-bold text-zinc-900">{subject.name}</h1>
          <p className="text-zinc-500 mt-1">Monitor class performance, identify weak areas, and view leaderboards.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-zinc-500">Avg Class XP</span>
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-800">{averageXP}</h3>
          </CardContent>
        </Card>
        
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-zinc-500">Avg Quiz Score</span>
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-800">{averageQuizScorePercent}%</h3>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-zinc-500">Quizzes Taken</span>
              <Activity className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-800">{totalQuizzesAttempted}</h3>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-zinc-500">Sims Completed</span>
              <Gamepad2 className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-800">{totalSimulationsCompleted}</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Weak Topics, Leaderboard, & Inactive Students */}
        <div className="md:col-span-1 space-y-6">
          {/* Weak Topics */}
          <Card className="border-zinc-200 shadow-md">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-base font-bold text-zinc-900 flex items-center">
                <AlertTriangle className="w-4 h-4 text-primary mr-2" /> Weak Topics (Avg &lt; 70%)
              </CardTitle>
              <CardDescription>Assessments where the class average is low.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {weakTopics.length > 0 ? (
                weakTopics.map((topic, i) => (
                  <div key={i} className="flex justify-between items-center bg-red-50/50 border border-red-100 p-3 rounded-lg">
                    <div className="truncate pr-2">
                      <p className="font-semibold text-zinc-800 text-xs truncate">{topic.title}</p>
                      <p className="text-[10px] text-zinc-500">{topic.attempts} attempts recorded</p>
                    </div>
                    <Badge className="bg-primary hover:bg-primary/95 text-white font-bold text-[10px]">
                      {topic.avgPercent}% Avg
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 italic text-center py-4">Class is performing well across all quizzes!</p>
              )}
            </CardContent>
          </Card>

          {/* Leaderboard / Top Students */}
          <Card className="border-zinc-200 shadow-md">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-base font-bold text-zinc-900 flex items-center">
                <Trophy className="w-4 h-4 text-amber-500 mr-2" /> Class Leaderboard
              </CardTitle>
              <CardDescription>Rankings based on Subject XP.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {allStudentsRanked.length > 0 ? (
                allStudentsRanked.map((stud, idx) => (
                  <div key={stud.id} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                    <div className="flex items-center space-x-2">
                      <span className={`w-5 h-5 flex items-center justify-center font-bold text-xs rounded-full ${
                        idx === 0 ? "bg-yellow-100 text-yellow-800" :
                        idx === 1 ? "bg-zinc-200 text-zinc-800" :
                        idx === 2 ? "bg-amber-100 text-amber-800" :
                        "bg-zinc-100 text-zinc-600"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="truncate max-w-[120px]">
                        <p className="font-semibold text-zinc-800 text-xs truncate">{stud.name}</p>
                        <p className="text-[9px] text-zinc-400">Streak: {stud.streak} Days</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 font-bold text-[10px]">
                      {stud.subjectXp} XP
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 italic text-center py-4">No student records available.</p>
              )}
            </CardContent>
          </Card>

          {/* Inactive Students */}
          <Card className="border-zinc-200 shadow-md">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-base font-bold text-zinc-900 flex items-center">
                <Frown className="w-4 h-4 text-zinc-500 mr-2" /> Inactive Students
              </CardTitle>
              <CardDescription>Students with 0 XP or progress.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {inactiveStudents.length > 0 ? (
                inactiveStudents.map((stud) => (
                  <div key={stud.id} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                    <div className="truncate">
                      <p className="font-semibold text-zinc-800 text-xs truncate">{stud.name}</p>
                      <p className="text-[9px] text-zinc-400 truncate">{stud.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-[9px] font-bold">Inactive</Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 italic text-center py-4">All registered students are active!</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Complete Students Progress Table */}
        <div className="md:col-span-2">
          <Card className="border-zinc-200 shadow-md overflow-hidden">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-xl">Student Progress Directory</CardTitle>
              <CardDescription>All students currently registered in {subject.name}.</CardDescription>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-zinc-600">Student</TableHead>
                  <TableHead className="text-center font-semibold text-zinc-600">XP Points</TableHead>
                  <TableHead className="text-center font-semibold text-zinc-600">Quizzes</TableHead>
                  <TableHead className="text-center font-semibold text-zinc-600">Simulations</TableHead>
                  <TableHead className="text-center font-semibold text-zinc-600">Badges</TableHead>
                  <TableHead className="text-center font-semibold text-zinc-600">Daily Streak</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8 border border-zinc-200 bg-zinc-100">
                            <AvatarFallback className="text-zinc-600 text-xs font-bold">
                              {(student.name || "St").substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-zinc-900">{student.name || "Unknown Student"}</p>
                            <p className="text-xs text-zinc-400">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 font-bold">
                          {student.subjectXp} XP
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium text-zinc-700">
                        {student.quizAttempts.length}
                      </TableCell>
                      <TableCell className="text-center font-medium text-zinc-700">
                        {student.simulationProgress.length}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center -space-x-2">
                          {student.userBadges.slice(0, 3).map(ub => (
                            <div key={ub.id} className="w-6 h-6 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-[10px]" title={ub.badge.name}>
                              {ub.badge.iconUrl}
                            </div>
                          ))}
                          {student.userBadges.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-zinc-500">
                              +{student.userBadges.length - 3}
                            </div>
                          )}
                          {student.userBadges.length === 0 && <span className="text-xs text-zinc-400">-</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium text-zinc-700">
                        {student.streak} <span className="text-orange-500">🔥</span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-zinc-500 italic">
                      No students have enrolled in this subject yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
