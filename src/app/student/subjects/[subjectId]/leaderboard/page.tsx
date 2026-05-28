import { Trophy, Medal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LeaderboardPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const currentUser = await getOrCreateUser();
  if (!currentUser) redirect("/sign-in");

  const { subjectId } = await params;
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });

  const enrollments = await prisma.subjectEnrollment.findMany({
    where: { subjectId },
    include: { user: true },
    orderBy: { xp: "desc" }
  });

  const leaderboardData = enrollments.map((e, index) => ({
    id: e.userId,
    rank: index + 1,
    name: e.user.name,
    xp: e.xp,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${(e.user.name || "Student").replace(/\s+/g, "")}`,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <Badge className="mb-2 bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">{subject?.name || "Global"} Rankings</Badge>
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center justify-center">
          <Trophy className="w-8 h-8 mr-3 text-amber-500" />
          {subject?.name || "HCI"} Leaderboard
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">
          Compete with your peers by earning XP through modules, quizzes, and simulations.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="w-[100px] text-center font-bold">Rank</TableHead>
              <TableHead className="font-bold">Student</TableHead>
              <TableHead className="text-right font-bold">Total XP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((student) => {
              const isCurrentUser = student.id === currentUser.id;
              
              return (
                <TableRow key={student.id} className={`${isCurrentUser ? 'bg-primary/5 hover:bg-primary/10 font-medium' : ''}`}>
                  <TableCell className="text-center font-medium">
                    {student.rank === 1 ? (
                      <Medal className="w-6 h-6 text-yellow-500 mx-auto" />
                    ) : student.rank === 2 ? (
                      <Medal className="w-6 h-6 text-zinc-400 mx-auto" />
                    ) : student.rank === 3 ? (
                      <Medal className="w-6 h-6 text-amber-700 mx-auto" />
                    ) : (
                      <span className="text-zinc-500">#{student.rank}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 border border-zinc-200">
                        <AvatarImage src={student.avatarUrl} alt={student.name || "Student"} />
                        <AvatarFallback>{(student.name || "St").substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={`font-semibold ${isCurrentUser ? 'text-primary' : 'text-zinc-900'}`}>
                          {student.name} {isCurrentUser && "(You)"}
                        </p>
                        {student.rank <= 3 && <p className="text-xs text-amber-600 font-medium">Top Performer</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={`${isCurrentUser ? 'border-primary text-primary bg-white' : 'text-zinc-700 bg-zinc-50'}`}>
                      {student.xp} XP
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="bg-zinc-50 p-4 border-t border-zinc-200 text-center text-sm text-zinc-500">
          Rankings are updated in real-time. Keep learning to climb the leaderboard!
        </div>
      </div>
    </div>
  );
}

