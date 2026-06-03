"use client";

import React, { useState, useEffect } from "react";
import { 
  Play, 
  FileText, 
  Search, 
  Save, 
  Check, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  ExternalLink,
  Loader2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { useParams } from "next/navigation";

interface Subtopic {
  id: string;
  subtopicNo: string;
  title: string;
  description: string;
  videoUrl: string | null;
  notesUrl: string | null;
}

interface Module {
  id: string;
  moduleNo: number;
  title: string;
  description: string;
  subtopics: Subtopic[];
}

export default function QuickUpdatePage() {
  const params = useParams();
  const subjectId = params.subjectId as string;

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Track input values locally for each subtopic to prevent re-rendering the whole page
  const [inputStates, setInputStates] = useState<Record<string, { videoUrl: string; notesUrl: string }>>({});
  const [savingStates, setSavingStates] = useState<Record<string, "idle" | "saving" | "saved">>({});

  useEffect(() => {
    fetchModules();
  }, [subjectId]);

  const fetchModules = async () => {
    try {
      const res = await fetch(`/api/quick-update?subjectId=${subjectId}`);
      if (res.ok) {
        const data = await res.json();
        setModules(data);
        
        // Initialize inputs
        const initialInputs: Record<string, { videoUrl: string; notesUrl: string }> = {};
        data.forEach((mod: Module) => {
          mod.subtopics.forEach((st: Subtopic) => {
            initialInputs[st.id] = {
              videoUrl: st.videoUrl || "",
              notesUrl: st.notesUrl || ""
            };
          });
        });
        setInputStates(initialInputs);
      } else {
        toast.error("Failed to load modules");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while loading content");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (subtopicId: string, field: "videoUrl" | "notesUrl", value: string) => {
    setInputStates(prev => ({
      ...prev,
      [subtopicId]: {
        ...prev[subtopicId],
        [field]: value
      }
    }));
    
    // Reset save state back to idle when user types
    if (savingStates[subtopicId] === "saved") {
      setSavingStates(prev => ({ ...prev, [subtopicId]: "idle" }));
    }
  };

  const handleSaveSubtopic = async (subtopicId: string) => {
    const inputs = inputStates[subtopicId];
    setSavingStates(prev => ({ ...prev, [subtopicId]: "saving" }));

    try {
      const res = await fetch("/api/quick-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subtopicId,
          videoUrl: inputs.videoUrl,
          notesUrl: inputs.notesUrl
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSavingStates(prev => ({ ...prev, [subtopicId]: "saved" }));
        toast.success("Successfully updated subtopic links!");
        
        // Update local subtopic values with formatted response from API
        setInputStates(prev => ({
          ...prev,
          [subtopicId]: {
            videoUrl: data.subtopic.videoUrl || "",
            notesUrl: data.subtopic.notesUrl || ""
          }
        }));

        // Keep the checkmark for 3 seconds then return to idle
        setTimeout(() => {
          setSavingStates(prev => {
            if (prev[subtopicId] === "saved") {
              return { ...prev, [subtopicId]: "idle" };
            }
            return prev;
          });
        }, 3000);
      } else {
        setSavingStates(prev => ({ ...prev, [subtopicId]: "idle" }));
        toast.error(data.error || "Failed to update subtopic");
      }
    } catch (err: any) {
      setSavingStates(prev => ({ ...prev, [subtopicId]: "idle" }));
      toast.error(err.message || "Failed to connect to database");
    }
  };

  // Filter modules/subtopics based on search query
  const filteredModules = modules.map(mod => {
    const matchingSubtopics = mod.subtopics.filter(st => 
      st.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      st.subtopicNo.includes(searchQuery)
    );
    return {
      ...mod,
      subtopics: searchQuery ? matchingSubtopics : mod.subtopics
    };
  }).filter(mod => mod.subtopics.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Premium Hero Banner */}
      <div className="relative bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 py-12 px-6 shadow-lg overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-20 -translate-y-20"></div>
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-xs font-semibold backdrop-blur-md mb-3 border border-white/10 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Quick Resource Manager</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              EdTech Live Link Editor
            </h1>
            <p className="text-indigo-100 mt-2 text-sm md:text-base max-w-xl">
              Instantly update course subtopic learning resources. Paste your Google Drive video/notes URL, click save, and the result goes live on the app dynamically.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href={`/student/subjects/${subjectId}/modules`} 
              target="_blank" 
              className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-slate-100 rounded-xl text-sm font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>View Student App</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-8 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search subtopics by title or number (e.g. 1.1)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-base"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-medium">Fetching syllabus structure...</p>
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No matching subtopics found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search keywords.</p>
          </div>
        ) : (
          /* Module Cards */
          <div className="space-y-8">
            {filteredModules.map((mod) => (
              <div 
                key={mod.id} 
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Module Header */}
                <div className="bg-gradient-to-r from-slate-50 to-indigo-50/20 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      M{mod.moduleNo}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-base md:text-lg">{mod.title}</h3>
                      <p className="text-xs text-slate-500">{mod.description}</p>
                    </div>
                  </div>
                </div>

                {/* Subtopics List */}
                <div className="divide-y divide-slate-100">
                  {mod.subtopics.map((st) => {
                    const inputs = inputStates[st.id] || { videoUrl: "", notesUrl: "" };
                    const saveState = savingStates[st.id] || "idle";

                    return (
                      <div key={st.id} className="p-6 hover:bg-slate-50/40 transition-colors">
                        <div className="flex flex-col gap-4">
                          {/* Subtopic Title Info */}
                          <div className="flex items-start gap-2">
                            <span className="inline-flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-xs px-2.5 py-1 rounded-md mt-0.5">
                              {st.subtopicNo}
                            </span>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm md:text-base">
                                {st.title.replace(/^\d\.\d\s+/, '')}
                              </h4>
                              {st.description && (
                                <p className="text-xs text-slate-500 mt-0.5">{st.description}</p>
                              )}
                            </div>
                          </div>

                          {/* Inputs Row */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            {/* Video URL Input */}
                            <div className="md:col-span-5 space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                <Play className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                                <span>Google Drive Video URL (formats to preview)</span>
                              </label>
                              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                <input
                                  type="text"
                                  placeholder="Paste video view/preview/sharing URL..."
                                  value={inputs.videoUrl}
                                  onChange={(e) => handleInputChange(st.id, "videoUrl", e.target.value)}
                                  className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Notes URL Input */}
                            <div className="md:col-span-5 space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-blue-500" />
                                <span>Google Drive Notes URL</span>
                              </label>
                              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                <input
                                  type="text"
                                  placeholder="Paste notes folder/file URL..."
                                  value={inputs.notesUrl}
                                  onChange={(e) => handleInputChange(st.id, "notesUrl", e.target.value)}
                                  className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Save Button */}
                            <div className="md:col-span-2">
                              <button
                                onClick={() => handleSaveSubtopic(st.id)}
                                disabled={saveState === "saving"}
                                className={`w-full h-[38px] rounded-xl text-xs font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5
                                  ${saveState === "saving" 
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" 
                                    : saveState === "saved"
                                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10"
                                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10"
                                  }
                                `}
                              >
                                {saveState === "saving" ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Saving</span>
                                  </>
                                ) : saveState === "saved" ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Saved!</span>
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Save Link</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}
