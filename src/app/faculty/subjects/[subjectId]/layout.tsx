"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { ChevronLeft, LayoutDashboard, FolderOpen, Gamepad2, Brain, Activity, Layers } from "lucide-react";

export default function FacultySubjectLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [subjectName, setSubjectName] = useState("Subject Loading...");

  useEffect(() => {
    // Fetch subject name just for the header context
    fetch(`/api/faculty/modules?subjectId=${subjectId}`)
      .then(res => res.json())
      .then(data => {
        // We only really need to know we fetched successfully, 
        // the API doesn't return subject name directly if it's returning modules.
        // In a real app we'd fetch the subject details explicitly.
        setSubjectName("Subject Management");
      })
      .catch(() => setSubjectName("Subject Management"));
  }, [subjectId]);

  const navLinks = [
    { name: "Modules & Subtopics", href: `/faculty/subjects/${subjectId}/modules`, icon: LayoutDashboard },
    { name: "Resources", href: `/faculty/subjects/${subjectId}/resources`, icon: FolderOpen },
    { name: "Simulations", href: `/faculty/subjects/${subjectId}/simulations`, icon: Gamepad2 },
    { name: "Quizzes", href: `/faculty/subjects/${subjectId}/quizzes`, icon: Brain },
    { name: "Flashcards", href: `/faculty/subjects/${subjectId}/flashcards`, icon: Layers },
    { name: "Analytics", href: `/faculty/subjects/${subjectId}/analytics`, icon: Activity },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50">
      {/* Top Header / Breadcrumbs */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/faculty/dashboard" 
              className="text-zinc-500 hover:text-primary transition-colors flex items-center text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <div className="h-4 w-[1px] bg-zinc-300 hidden sm:block"></div>
            <h1 className="text-lg font-bold text-zinc-900 hidden sm:block">{subjectName}</h1>
          </div>
          
          <nav className="flex space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-white">
        {children}
      </main>
    </div>
  );
}
