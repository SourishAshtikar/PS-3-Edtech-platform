import { Trophy, Medal, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function FacultyGlobalLeaderboardPage() {
  const currentUser = await getOrCreateUser();
  if (!currentUser || currentUser.role !== "faculty") redirect("/sign-in");

  const dbUsers = await prisma.user.findMany({
    where: { role: "student" },
    orderBy: { xp: "desc" }
  });

  const leaderboardData = dbUsers.map((u, index) => ({
    id: u.id,
    rank: index + 1,
    name: u.name,
    xp: u.xp,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${(u.name || "Student").replace(/\s+/g, "")}`,
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/faculty/dashboard" className="flex items-center text-sm font-medium text-zinc-500 hover:text-primary mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="mb-8 text-center max-w-2xl mx-auto">
        <Badge className="mb-2 bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">Global Rankings</Badge>
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center justify-center">
          <Trophy className="w-8 h-8 mr-3 text-amber-500" />
          Global Leaderboard
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">
          View the top performing students across all subjects on the platform.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
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
              return (
                <TableRow key={student.id}>
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
                        <p className="font-semibold text-zinc-900">
                          {student.name}
                        </p>
                        {student.rank <= 3 && <p className="text-xs text-amber-600 font-medium">Top Performer</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-zinc-700 bg-zinc-50">
                      {student.xp} XP
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
