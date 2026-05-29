"use client";

import React from "react";
import toast from "react-hot-toast";

interface ResourceLinkTrackerProps {
  children: React.ReactNode;
  subtopicId: string;
  moduleId: string;
  resourceType: string;
}

export function ResourceLinkTracker({ children, subtopicId, moduleId, resourceType }: ResourceLinkTrackerProps) {
  const handleClick = () => {
    // Fire and forget progress tracking
    fetch("/api/student/progress/resource", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtopicId, moduleId, resourceType }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.xpEarned > 0) {
          toast.success(`+${data.xpEarned} XP Earned!`);
        }
      })
      .catch((err) => console.error("Failed to track resource progress:", err));
  };

  return (
    <div onClick={handleClick} className="inline-block">
      {children}
    </div>
  );
}
