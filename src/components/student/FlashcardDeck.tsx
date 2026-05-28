"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCw, Lightbulb } from "lucide-react";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface FlashcardDeckProps {
  flashcards: Flashcard[];
}

export function FlashcardDeck({ flashcards }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === "ArrowRight") {
        handleNext();
      } else if (e.code === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, flashcards.length]);

  if (flashcards.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto border-zinc-200 text-center p-8 shadow-sm">
        <p className="text-zinc-500">No flashcards available at the moment. Check back later!</p>
      </Card>
    );
  }

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 3D Flip Card Container */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-80 cursor-pointer group [perspective:1000px] select-none"
      >
        <div 
          className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front Side: Question */}
          <Card className="absolute w-full h-full backface-hidden border-2 border-zinc-200 shadow-md hover:border-primary/40 hover:shadow-lg transition-all rounded-2xl flex flex-col justify-between p-8 bg-white [backface-visibility:hidden]">
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-400">
              <span className="flex items-center">
                <Lightbulb className="w-4 h-4 mr-1 text-primary" /> HCI Concept Card
              </span>
              <span>Card {currentIndex + 1} of {flashcards.length}</span>
            </div>
            
            <div className="flex-1 flex items-center justify-center text-center px-4">
              <h2 className="text-2xl font-bold text-zinc-800 leading-tight">
                {currentCard.question}
              </h2>
            </div>

            <div className="flex items-center justify-center text-xs text-zinc-400 font-semibold space-x-1.5 hover:text-primary transition-colors">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Click card to reveal answer</span>
            </div>
          </Card>

          {/* Back Side: Answer */}
          <Card className="absolute w-full h-full border-2 border-primary/20 shadow-lg rounded-2xl flex flex-col justify-between p-8 bg-zinc-50 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-400">
              <span className="text-primary font-bold">Answer</span>
              <span>Card {currentIndex + 1} of {flashcards.length}</span>
            </div>

            <div className="flex-1 flex items-center justify-center text-center px-4">
              <p className="text-xl font-medium text-zinc-700 leading-relaxed">
                {currentCard.answer}
              </p>
            </div>

            <div className="flex items-center justify-center text-xs text-zinc-400 font-semibold space-x-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Click card to flip back</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center px-2">
        <Button 
          onClick={handlePrev} 
          variant="outline" 
          className="border-zinc-300 bg-white hover:bg-zinc-50 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
          Spacebar to flip • Arrow keys to navigate
        </span>
        <Button 
          onClick={handleNext} 
          variant="outline" 
          className="border-zinc-300 bg-white hover:bg-zinc-50 shadow-sm"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
