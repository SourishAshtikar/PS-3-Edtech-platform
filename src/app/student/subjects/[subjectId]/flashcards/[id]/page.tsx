import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { FlashcardViewer } from "@/components/student/FlashcardViewer";

export default async function FlashcardDeckPage({ params }: { params: Promise<{ subjectId: string, id: string }> }) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const { subjectId, id } = await params;

  const deck = await prisma.flashcardDeck.findUnique({
    where: { id },
    include: {
      cards: true,
      module: {
        include: { subject: true }
      }
    }
  });

  if (!deck || deck.module.subjectId !== subjectId) {
    redirect(`/student/subjects/${subjectId}/flashcards`);
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 py-4">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href={`/student/subjects/${subjectId}/flashcards`} className="text-xs font-semibold text-zinc-500 hover:text-primary flex items-center mb-2 transition-colors w-fit">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Flashcards
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mr-3">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-900">{deck.title}</h1>
                <p className="text-xs text-zinc-500 font-medium">Module {deck.module.moduleNo} • {deck.cards.length} Cards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-12 max-w-5xl flex items-center justify-center">
        <FlashcardViewer 
          cards={deck.cards} 
          deckId={deck.id}
          moduleId={deck.moduleId}
          subtopicId={deck.subtopicId}
          subjectId={subjectId}
        />
      </div>
    </div>
  );
}
