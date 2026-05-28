import Link from "next/link";
import { getOrCreateUser } from "@/lib/auth";
import { MarkCompletedButton } from "@/components/student/MarkCompletedButton";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, PlayCircle, FileText, CheckCircle2, Gamepad2, Target, Download, Book, BrainCircuit, CreditCard, Link as LinkIcon, HelpCircle } from "lucide-react";
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
      subtopics: {
        orderBy: { subtopicNo: 'asc' },
        include: {
          simulations: true,
          quizzes: true
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
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">{module.title}</h1>
        <p className="text-lg text-zinc-600">{module.description}</p>
      </div>

      <h2 className="text-2xl font-bold text-zinc-800 mb-6">Subtopics</h2>
      <div className="space-y-4">
        {module.subtopics.map((subtopic, index) => (
          <Card key={subtopic.id} className="overflow-hidden hover:border-primary/30 transition-colors bg-white">
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

                {/* Buttons row directly under the video player */}
                <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-5 mt-auto">
                  {/* Notes */}
                  {subtopic.notesUrl && (
                    <div className="flex gap-2">
                      <a href={subtopic.notesUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                          <FileText className="w-5 h-5 mr-2 text-primary" /> Preview Notes
                        </Button>
                      </a>
                      {subtopic.notesDownloadUrl && (
                        <a href={subtopic.notesDownloadUrl} download target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                            <Download className="w-5 h-5 mr-2 text-green-600" /> Download
                          </Button>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Mind Map */}
                  {subtopic.mindMapUrl && (
                    <div className="flex gap-2">
                      <a href={subtopic.mindMapUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                          <BrainCircuit className="w-5 h-5 mr-2 text-primary" /> Mind Map
                        </Button>
                      </a>
                      {subtopic.mindMapDownloadUrl && (
                        <a href={subtopic.mindMapDownloadUrl} download target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm" aria-label="Download Mind Map">
                            <Download className="w-5 h-5 text-green-600" />
                          </Button>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Flash Cards */}
                  {subtopic.flashCardsUrl && (
                    <div className="flex gap-2">
                      <a href={subtopic.flashCardsUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                          <CreditCard className="w-5 h-5 mr-2 text-primary" /> Flash Cards
                        </Button>
                      </a>
                      {subtopic.flashCardsDownloadUrl && (
                        <a href={subtopic.flashCardsDownloadUrl} download target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm" aria-label="Download Flash Cards">
                            <Download className="w-5 h-5 text-green-600" />
                          </Button>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Reference Content */}
                  {subtopic.referenceUrl && (
                    <div className="flex gap-2">
                      <a href={subtopic.referenceUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                          <Book className="w-5 h-5 mr-2 text-primary" /> Reference
                        </Button>
                      </a>
                      {subtopic.referenceDownloadUrl && (
                        <a href={subtopic.referenceDownloadUrl} download target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm" aria-label="Download Reference">
                            <Download className="w-5 h-5 text-green-600" />
                          </Button>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Quiz File */}
                  {subtopic.quizFileUrl && (
                    <div className="flex gap-2">
                      <a href={subtopic.quizFileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                          <HelpCircle className="w-5 h-5 mr-2 text-primary" /> Quiz File
                        </Button>
                      </a>
                      {subtopic.quizFileDownloadUrl && (
                        <a href={subtopic.quizFileDownloadUrl} download target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm" aria-label="Download Quiz File">
                            <Download className="w-5 h-5 text-green-600" />
                          </Button>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Other File */}
                  {subtopic.otherUrl && (
                    <div className="flex gap-2">
                      <a href={subtopic.otherUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                          <LinkIcon className="w-5 h-5 mr-2 text-primary" /> Other Resource
                        </Button>
                      </a>
                      {subtopic.otherDownloadUrl && (
                        <a href={subtopic.otherDownloadUrl} download target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm" aria-label="Download Other File">
                            <Download className="w-5 h-5 text-green-600" />
                          </Button>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Simulation Link */}
                  {subtopic.simulationUrl && (
                    <a href={subtopic.simulationUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                        <Gamepad2 className="w-5 h-5 mr-2 text-primary" /> External Simulation
                      </Button>
                    </a>
                  )}

                  {/* Interactive Simulation (DB) */}
                  {subtopic.simulations && subtopic.simulations.length > 0 && (
                    <Link href={`/student/subjects/${subjectId}/simulations/${subtopic.simulations[0].id}`}>
                      <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                        <Gamepad2 className="w-5 h-5 mr-2 text-blue-600" /> Play Simulation
                      </Button>
                    </Link>
                  )}

                  {/* Interactive Quizzes (DB) */}
                  {(subtopic.id in module1Quizzes || subtopic.id in module2Quizzes) ? (
                    <Link href={`/student/subjects/${subjectId}/quizzes/${subtopic.id}`}>
                      <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                        <Target className="w-5 h-5 mr-2 text-primary" /> Attempt Quiz
                      </Button>
                    </Link>
                  ) : subtopic.quizzes && subtopic.quizzes.length > 0 ? (
                    <Link href={`/student/subjects/${subjectId}/quizzes/${subtopic.quizzes[0].id}`}>
                      <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                        <Target className="w-5 h-5 mr-2 text-primary" /> Attempt Quiz
                      </Button>
                    </Link>
                  ) : null}
                  <MarkCompletedButton 
                    subtopicId={subtopic.id} 
                    moduleId={id} 
                    isInitiallyCompleted={completedSubtopics.includes(subtopic.id)} 
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
