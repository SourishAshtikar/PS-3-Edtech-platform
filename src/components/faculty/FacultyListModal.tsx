"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, X } from "lucide-react";

export function FacultyListCard({ totalFaculty, facultyMembers }: { totalFaculty: number, facultyMembers: { id: string, name: string | null, email: string | null }[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card className="border-zinc-200 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all" onClick={() => setIsOpen(true)}>
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Total Faculty</p>
            <h3 className="text-2xl font-bold">{totalFaculty}</h3>
            <p className="text-xs text-blue-500 mt-1">View Names</p>
          </div>
        </CardContent>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100">
              <h3 className="text-lg font-bold text-zinc-900">Faculty Members</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0">
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {facultyMembers.map((faculty) => (
                  <div key={faculty.id} className="flex flex-col p-4 hover:bg-zinc-50 rounded-lg transition-colors border-b border-zinc-50 last:border-0">
                    <span className="font-semibold text-zinc-800">{faculty.name || "Unknown"}</span>
                    <span className="text-sm text-zinc-500">{faculty.email}</span>
                  </div>
                ))}
                {facultyMembers.length === 0 && (
                  <div className="p-8 text-center text-zinc-500">No faculty members found.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
