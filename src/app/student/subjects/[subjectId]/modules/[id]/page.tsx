import Link from "next/link";
import { getOrCreateUser } from "@/lib/auth";
import { MarkCompletedButton } from "@/components/student/MarkCompletedButton";
import { ResourceLinkTracker } from "@/components/student/ResourceLinkTracker";
import { DownloadModuleButton } from "@/components/student/DownloadModuleButton";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, PlayCircle, FileText, CheckCircle2, Gamepad2, Target, Download, Book, BrainCircuit, CreditCard, Link as LinkIcon, HelpCircle, Layers, Headphones } from "lucide-react";
import { module1Quizzes } from "@/data/module1QuizData";
import { module2Quizzes } from "@/data/module2QuizData";


function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("/embed/")) return url;
  
  if (url.includes("youtube.com/watch")) {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } catch (e) {
      // ignore
    }
  }
  
  if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    if (parts.length > 1) {
      const videoId = parts[1].split(/[?#]/)[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  return url;
}

export default async function ModuleDetailPage({ params }: { params: Promise<{ id: string, subjectId: string }> }) {
  const { id, subjectId } = await params;
  const module = await prisma.module.findUnique({
    where: { id },
    include: {
      flashcardDecks: {
        where: { subtopicId: null }
      },
      subtopics: {
        orderBy: { subtopicNo: 'asc' },
        include: {
          simulations: true,
          quizzes: true,
          flashcardDecks: true
        }
      }
    }
  });

  if (!module) {
    notFound();
  }

  const user = await getOrCreateUser();
  if (!user) {
    notFound();
  }

  const progress = await prisma.studentProgress.findUnique({
    where: {
      userId_moduleId: {
        userId: user.id,
        moduleId: id,
      }
    }
  });

  const completedSubtopics = progress?.completedSubtopics || [];
  const completedResources = progress?.completedResources || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href={`/student/subjects/${subjectId}/modules`} className="flex items-center text-sm font-medium text-zinc-500 hover:text-primary mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Modules
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20">{module.id.toUpperCase()}</Badge>
          <Badge variant="secondary">{module.co}</Badge>
          <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">{module.hours} Hours</Badge>
        </div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-4">{module.title}</h1>
            <p className="text-lg text-zinc-600">{module.description}</p>
          </div>
          <DownloadModuleButton moduleId={module.id} />
        </div>
        
        {module.flashcardDecks && module.flashcardDecks.length > 0 && (
          <div className="mt-6 pt-6 border-t border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-800 mb-3 uppercase tracking-wider">Module Study Materials</h3>
            <div className="flex flex-wrap gap-3">
              {module.flashcardDecks.map((deck) => (
                <Link key={deck.id} href={`/student/subjects/${subjectId}/flashcards/${deck.id}`}>
                  <Button variant="outline" className="bg-white hover:bg-amber-50 border-amber-200 text-amber-700 text-sm font-bold shadow-sm">
                    <Layers className="w-4 h-4 mr-2" /> Study: {deck.title}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-zinc-800 mb-6">Subtopics</h2>
      <div className="space-y-4">
        {module.subtopics.map((subtopic, index) => {
          const hasNotes = !!subtopic.notesUrl;
          const hasSim = !!subtopic.simulationUrl || (subtopic.simulations && subtopic.simulations.length > 0);
          const hasQuiz = ((subtopic.id in module1Quizzes || subtopic.id in module2Quizzes) || (subtopic.quizzes && subtopic.quizzes.length > 0));
          const hasFlashcards = subtopic.flashcardDecks && subtopic.flashcardDecks.length > 0;
          const hasAudio = !!subtopic.audioUrl;

          const isNotesCompleted = !hasNotes || completedResources.includes(`${subtopic.id}-notes`);
          // We check for 'simulation' (from clicking the button) or 'sandbox_completed' (from actually submitting the sandbox)
          const isSimCompleted = !hasSim || completedResources.includes(`${subtopic.id}-simulation`) || completedResources.includes(`${subtopic.id}-sandbox_completed`);
          const isQuizCompleted = !hasQuiz || completedResources.includes(`${subtopic.id}-quiz`);
          const isFlashcardsCompleted = !hasFlashcards || completedResources.includes(`${subtopic.id}-flashcards`);
          const isAudioCompleted = !hasAudio || completedResources.includes(`${subtopic.id}-audio`);

          const canComplete = isNotesCompleted && isSimCompleted && isQuizCompleted && isFlashcardsCompleted && isAudioCompleted;

          return (
          <Card key={subtopic.id} className="border-zinc-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white">
            <div className="flex flex-col md:flex-row">
              <div className="bg-zinc-50 w-full md:w-16 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100 py-4 md:py-0 flex-shrink-0">
                <span className="text-2xl font-bold text-zinc-300">{index + 1}</span>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                {/* Header: Title and description */}
                <div className="mb-4">
                  <CardTitle className="text-xl mb-2 text-zinc-800 font-bold">{subtopic.title}</CardTitle>
                  <CardDescription className="text-base text-zinc-600">{subtopic.description}</CardDescription>
                </div>

                {/* Big Embedded Video Player */}
                {subtopic.videoUrl && (
                  <div className="w-full mb-5">
                    <div className="w-full rounded-lg overflow-hidden border border-zinc-200 bg-zinc-950 aspect-video shadow-sm max-w-3xl mx-auto">
                      <iframe
                        src={getEmbedUrl(subtopic.videoUrl) || ""}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={subtopic.title}
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Embedded Audio Player */}
                {subtopic.audioUrl && (
                  <div className="w-full mb-5 max-w-3xl mx-auto">
                    <p className="text-sm font-bold text-zinc-700 mb-2 flex items-center">
                      <Headphones className="w-4 h-4 mr-2 text-purple-600" /> Audio Lesson
                    </p>
                    <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="audio">
                      <audio 
                        controls 
                        className="w-full h-12 rounded-lg bg-zinc-50 border border-zinc-200 shadow-sm"
                        src={subtopic.audioDownloadUrl || subtopic.audioUrl}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </ResourceLinkTracker>
                    <div className="mt-2 text-right">
                       <a href={subtopic.audioUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline">
                         Open in Google Drive
                       </a>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-5 mt-auto">
                  {subtopic.notesUrl && (
                    <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="notes">
                      <a href={subtopic.notesUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="bg-white hover:bg-red-50 border-red-200 text-red-700 text-sm font-bold h-11 px-6 shadow-sm">
                          <FileText className="w-5 h-5 mr-2" /> Read Notes
                        </Button>
                      </a>
                    </ResourceLinkTracker>
                  )}

                  {/* Audio moved above */}

                  {(subtopic.simulationUrl || (subtopic.simulations && subtopic.simulations.length > 0)) && (
                    <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="simulation">
                      <Link href={
                        subtopic.simulations && subtopic.simulations.length > 0 
                          ? `/student/subjects/${subjectId}/simulations/${subtopic.simulations[0].id}`
                          : `/student/subjects/${subjectId}/modules/${id}/simulations/${subtopic.id}`
                      }>
                        <Button variant="outline" className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 text-sm font-bold h-11 px-6 shadow-sm">
                          <Gamepad2 className="w-5 h-5 mr-2" /> View Simulation
                        </Button>
                      </Link>
                    </ResourceLinkTracker>
                  )}

                  {((subtopic.id in module1Quizzes || subtopic.id in module2Quizzes) || (subtopic.quizzes && subtopic.quizzes.length > 0)) && (
                    <ResourceLinkTracker subtopicId={subtopic.id} moduleId={id} resourceType="quiz">
                      <Link href={`/student/subjects/${subjectId}/quizzes/${(subtopic.quizzes && subtopic.quizzes.length > 0) ? subtopic.quizzes[0].id : subtopic.id}`}>
                        <Button variant="outline" className="bg-white hover:bg-red-50 border-red-200 text-red-700 text-sm font-bold h-11 px-6 shadow-sm">
                          <Target className="w-5 h-5 mr-2" /> Attempt Quiz
                        </Button>
                      </Link>
                    </ResourceLinkTracker>
                  )}

                  {subtopic.flashcardDecks && subtopic.flashcardDecks.length > 0 && (
                    <Link href={`/student/subjects/${subjectId}/flashcards/${subtopic.flashcardDecks[0].id}`}>
                      <Button variant="outline" className="bg-white hover:bg-amber-50 border-amber-200 text-amber-700 text-sm font-bold h-11 px-6 shadow-sm">
                        <Layers className="w-5 h-5 mr-2" /> Study Flashcards
                      </Button>
                    </Link>
                  )}

                  <MarkCompletedButton 
                    subtopicId={subtopic.id} 
                    moduleId={id} 
                    isInitiallyCompleted={completedSubtopics.includes(subtopic.id)} 
                    canComplete={canComplete}
                  />
                </div>
              </div>
            </div>
          </Card>
          );
        })}
      </div>
    </div>
  );
}
