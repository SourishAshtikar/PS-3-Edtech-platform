"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, FileText, Book } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SubjectResourceCardProps {
  title: string;
  type: string; // e.g., "paper" or "book"
  link: string;
}

export function SubjectResourceCard({ title, type, link }: SubjectResourceCardProps) {
  // Select the appropriate icon based on the type
  const Icon = type === "book" ? Book : FileText;

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
      <Card className="hover:border-primary/30 hover:shadow-md transition-all cursor-pointer h-full border-zinc-200 group bg-white">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF1F2] flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
            <Icon className="w-8 h-8 text-[#9F1239]" strokeWidth={2.5} />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-zinc-900 font-serif tracking-tight leading-snug">
              {title}
            </h3>
            
            <p className="flex items-center justify-center text-sm font-medium text-zinc-500 group-hover:text-primary transition-colors">
              Open Drive Folder
              <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-70" />
            </p>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
