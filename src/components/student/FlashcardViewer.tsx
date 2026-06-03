"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface FlashcardViewerProps {
  cards: Flashcard[];
  deckId: string;
  moduleId: string;
  subtopicId: string | null;
  subjectId: string;
  isInitiallyCompleted?: boolean;
}

export function FlashcardViewer({ cards, deckId, moduleId, subtopicId, subjectId, isInitiallyCompleted = false }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(isInitiallyCompleted);
  const [completing, setCompleting] = useState(false);

  if (!cards || cards.length === 0) {
    return <div className="text-center py-10 text-zinc-500">No flashcards available in this deck.</div>;
  }

  const handleNext = () => {
    setIsFlipped(false);
    // Add a slight delay to allow flip animation to reset before changing content
    setTimeout(() => {
      setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : prev));
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }, 150);
  };

  const handleFinish = async () => {
    if (completed) return;
    
    setCompleting(true);
    try {
      const res = await fetch("/api/student/flashcards/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deckId,
          moduleId,
          subtopicId,
          subjectId
        })
      });

      if (res.ok) {
        toast.success("Deck completed! +25 XP", { icon: "🎉" });
        setCompleted(true);
      } else {
        toast.error("Failed to mark deck as completed.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setCompleting(false);
    }
  };

  const handleRestart = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(0);
    }, 150);
  };

  const progressPercent = ((currentIndex + 1) / cards.length) * 100;
  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col items-center">
      {/* Progress Tracker */}
      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-2 text-sm font-bold text-zinc-500">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span className="text-primary">{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2 bg-zinc-200" />
      </div>

      {/* 3D Flip Card */}
      <div 
        className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-w-2xl cursor-pointer group perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className={`w-full h-full relative preserve-3d transition-transform duration-500 ease-in-out ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front (Question) */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white border-2 border-zinc-200 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 sm:p-12 text-center group-hover:border-primary/50 transition-colors">
            <span className="absolute top-4 left-6 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Question
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800 leading-snug">
              {currentCard.question}
            </h2>
            <span className="absolute bottom-6 text-xs text-zinc-400 font-medium flex items-center">
              <RotateCcw className="w-3 h-3 mr-1" /> Click anywhere to flip
            </span>
          </div>

          {/* Back (Answer) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-primary border-2 border-primary rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 sm:p-12 text-center text-white">
            <span className="absolute top-4 left-6 text-xs font-bold uppercase tracking-widest text-white/90 bg-white/20 px-3 py-1 rounded-full">
              Answer
            </span>
            <div className="text-xl sm:text-2xl font-medium leading-relaxed overflow-y-auto max-h-[80%] custom-scrollbar pr-2">
              {currentCard.answer}
            </div>
            <span className="absolute bottom-6 text-xs text-white/60 font-medium flex items-center">
              <RotateCcw className="w-3 h-3 mr-1" /> Click to flip back
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between w-full max-w-2xl mt-8">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="w-32 border-zinc-300 text-zinc-700 font-bold hover:bg-zinc-100 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Previous
        </Button>

        {currentIndex === cards.length - 1 ? (
          completed ? (
            <Button 
              size="lg" 
              onClick={handleRestart}
              className="w-48 bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Restart
            </Button>
          ) : (
            <Button 
              size="lg" 
              onClick={handleFinish}
              disabled={completing}
              className="w-48 bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-md"
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Finish & Claim XP
            </Button>
          )
        ) : (
          <Button 
            size="lg" 
            onClick={handleNext}
            className="w-32 bg-primary hover:bg-primary/95 text-white font-bold shadow-md"
          >
            Next <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        )}
      </div>

      {/* CSS for 3D Transform - Next.js/Tailwind doesn't have these by default without plugins */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}
