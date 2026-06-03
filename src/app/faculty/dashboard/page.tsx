import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Users, BookOpen, Target, Gamepad2, PlusCircle, Activity, HardDrive, GraduationCap, Trophy, Sparkles } from "lucide-react";
import { WhitelistFacultyForm } from "@/components/faculty/WhitelistFacultyForm";
import { CreateSubjectForm } from "@/components/faculty/CreateSubjectForm";
import { ConnectDriveButton } from "@/components/faculty/ConnectDriveButton";
import { DeleteSubjectButton } from "@/components/faculty/DeleteSubjectButton";
import { FacultyListCard } from "@/components/faculty/FacultyListModal";
import { getOrCreateUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FacultyDashboardPage() {
  const user = await getOrCreateUser();
  if (!user || user.role !== "faculty") redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  const isDriveConnected = !!dbUser?.googleRefreshToken;

  const subjects = await prisma.subject.findMany({
    include: {
      _count: {
        select: { modules: true, enrollments: true },
      },
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalStudents = await prisma.user.count({ where: { role: 'student' } });
  const totalSubjects = subjects.length;
  const facultyMembers = await prisma.user.findMany({ 
    where: { role: 'faculty' },
    select: { id: true, name: true, email: true }
  });
  const totalFaculty = facultyMembers.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Faculty Dashboard</h1>
          <p className="text-zinc-500 mt-1">Manage subjects, content, and monitor student progress.</p>
        </div>
        <ConnectDriveButton isConnected={isDriveConnected} />
      </div>
 
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-zinc-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Total Students</p>
              <h3 className="text-2xl font-bold">{totalStudents}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Total Subjects</p>
              <h3 className="text-2xl font-bold">{totalSubjects}</h3>
            </div>
          </CardContent>
        </Card>
        <FacultyListCard totalFaculty={totalFaculty} facultyMembers={facultyMembers} />
        <Link href="/faculty/leaderboard">
          <Card className="border-zinc-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer h-full bg-gradient-to-br from-white to-amber-50">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-700">View Rankings</p>
                <h3 className="text-xl font-bold text-zinc-900">Global Leaderboard</h3>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Subjects List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900">Your Subjects</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <Link key={subject.id} href={`/faculty/subjects/${subject.id}/modules`}>
                  <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full border-zinc-200 relative">
                    <DeleteSubjectButton subjectId={subject.id} />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-primary">{subject.name}</CardTitle>
                      <CardDescription className="line-clamp-2 min-h-[40px]">{subject.description || "No description provided."}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {subject._count.modules} Modules</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {subject._count.enrollments} Enrolled</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 p-8 text-center border border-dashed border-zinc-300 rounded-lg bg-zinc-50">
                <p className="text-zinc-500">No subjects created yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions & Forms */}
        <div className="space-y-6">
          {/* Create Subject */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create New Subject</CardTitle>
              <CardDescription>Start a new learning path.</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateSubjectForm />
            </CardContent>
          </Card>

          {/* Admin Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admin Controls</CardTitle>
              <CardDescription>Whitelist emails for faculty access.</CardDescription>
            </CardHeader>
            <CardContent>
              <WhitelistFacultyForm />
            </CardContent>
          </Card>

          {/* Live Link Editor */}
          <Card className="border-indigo-200 bg-gradient-to-br from-white to-indigo-50/20 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-indigo-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Live Link Editor</span>
              </CardTitle>
              <CardDescription>Instantly change subtopic videos and notes URLs.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/quick-update">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 shadow-sm transition-colors">
                  Open Editor Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

