import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, HelpCircle, ArrowRight, Lock } from "lucide-react";

export default async function SubjectSelectionPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl flex-1 flex flex-col justify-center items-center">
      <div className="text-center mb-12 space-y-3">
        <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
          Choose your subject to learn
        </h1>
        <p className="text-zinc-500 text-lg max-w-md mx-auto">
          Select an active course from your curriculum to access modules, simulations, and assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {subjects.map((subject) => (
          <Link key={subject.id} href={`/student/subjects/${subject.id}`} className="block group">
            <Card className="border border-zinc-200 hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full cursor-pointer overflow-hidden flex flex-col justify-between bg-white">
              <div className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <BookOpen className="w-6 h-6 group-hover:animate-pulse" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-zinc-900 group-hover:text-primary transition-colors">
                    {subject.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-zinc-500 leading-relaxed">
                    {subject.description || "Explore modules, simulations, and gamified content for this subject."}
                  </CardDescription>
                </div>
              </div>
              
              <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-100 flex justify-between items-center group-hover:bg-primary/5 transition-colors">
                <span className="text-sm font-bold text-zinc-700 group-hover:text-primary transition-colors">Enter Subject</span>
                <ArrowRight className="w-4 h-4 text-zinc-450 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>
        ))}

        {subjects.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-12 text-zinc-500">
            No subjects are currently available. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
