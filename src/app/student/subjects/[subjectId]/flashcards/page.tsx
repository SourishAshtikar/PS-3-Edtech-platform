import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { FlashcardDeck } from "@/components/student/FlashcardDeck";

export const dynamic = "force-dynamic";

export default async function FlashcardsPage() {
  const flashcards = await prisma.flashcard.findMany({
    orderBy: { createdAt: 'asc' }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">Revision</Badge>
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center justify-center">
          <BookOpen className="w-8 h-8 mr-3 text-primary" />
          Interactive Flashcards
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">
          Revise critical Human-Computer Interaction concepts and rules at your own pace.
        </p>
      </div>

      <FlashcardDeck flashcards={flashcards} />
    </div>
  );
}

