import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Layers, ArrowLeft } from "lucide-react";

export default async function FlashcardsListPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const { subjectId } = await params;

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject) redirect("/student/dashboard");

  const flashcardDecks = await prisma.flashcardDeck.findMany({
    where: { module: { subjectId } },
    include: { module: true, cards: true },
    orderBy: { title: 'asc' }
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link href={`/student/subjects/${subjectId}`} className="text-sm font-semibold text-zinc-500 hover:text-primary flex items-center mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to {subject.name}
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
          <Layers className="w-8 h-8 mr-3 text-primary" />
          Interactive Flashcards
        </h1>
        <p className="text-zinc-500 mt-2 text-sm max-w-2xl">
          Review key terms and concepts interactively. Flip cards to reveal answers and test your memory before taking assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {flashcardDecks.map((deck) => (
          <Card key={deck.id} className="hover:border-primary/40 hover:shadow-lg transition-all duration-300 bg-white group flex flex-col">
            <CardHeader className="pb-3 border-b border-zinc-50">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-zinc-200 bg-zinc-50 text-zinc-600 font-bold">
                  Module {deck.module.moduleNo}
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-zinc-800 leading-snug group-hover:text-primary transition-colors">
                {deck.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-grow flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-sm text-zinc-500 font-medium mb-6">
                <Layers className="w-4 h-4 text-primary/70" /> 
                <span>{deck.cards?.length || 0} Terms & Concepts</span>
              </div>
              
              <Link href={`/student/subjects/${subjectId}/flashcards/${deck.id}`} className="w-full mt-auto">
                <Button className="w-full bg-primary hover:bg-primary/95 text-white shadow-sm font-bold h-10 transition-transform active:scale-[0.98]">
                  Study Deck
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        {flashcardDecks.length === 0 && (
          <div className="col-span-full py-12 text-center bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
            <Layers className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-700">No Flashcards Available</h3>
            <p className="text-sm text-zinc-500 mt-1">Check back later when your instructors upload study materials.</p>
          </div>
        )}
      </div>
    </div>
  );
}
