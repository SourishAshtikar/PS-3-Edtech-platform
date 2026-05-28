"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface MarkCompletedButtonProps {
  subtopicId: string;
  moduleId: string;
  isInitiallyCompleted: boolean;
}

export function MarkCompletedButton({ subtopicId, moduleId, isInitiallyCompleted }: MarkCompletedButtonProps) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(isInitiallyCompleted);
  const router = useRouter();

  const toggleCompleted = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subtopicId,
          moduleId,
          completed: !completed,
        }),
      });

      if (res.ok) {
        setCompleted(!completed);
        router.refresh();
      } else {
        console.error("Failed to update progress");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant={completed ? "default" : "secondary"}
      onClick={toggleCompleted}
      disabled={loading}
      className={`ml-auto text-sm font-bold h-11 px-6 shadow-sm ${
        completed 
          ? "bg-green-600 hover:bg-green-700 text-white" 
          : "text-green-750 bg-green-50 hover:bg-green-100 border border-green-200"
      }`}
    >
      <CheckCircle2 className={`w-5 h-5 mr-2 ${completed ? "text-white" : "text-green-600"}`} /> 
      {completed ? "Completed" : "Mark Completed"}
    </Button>
  );
}
