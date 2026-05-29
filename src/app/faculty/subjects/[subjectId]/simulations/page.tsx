"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Plus, Info, Globe, Clock, CheckCircle, Edit, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function ManageSimulationsPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;

  const [modules, setModules] = useState<any[]>([]);
  const [simulations, setSimulations] = useState<any[]>([]);
  
  // Form states
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedSubtopicId, setSelectedSubtopicId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [xpReward, setXpReward] = useState("100");
  const [learningOutcome, setLearningOutcome] = useState("");
  const [frontendUrl, setFrontendUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchModules();
    fetchSimulations();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch(`/api/faculty/modules?subjectId=${subjectId}`);
      if (res.ok) {
        const data = await res.json();
        setModules(data);
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const fetchSimulations = async () => {
    try {
      const res = await fetch(`/api/faculty/simulations?subjectId=${subjectId}`);
      if (res.ok) {
        const data = await res.json();
        setSimulations(data);
      }
    } catch (err) {
      console.error("Error fetching simulations:", err);
    }
  };

  const getSubtopicsForSelectedModule = () => {
    const mod = modules.find(m => m.id === selectedModuleId);
    return mod ? mod.subtopics || [] : [];
  };

  const handleEdit = (sim: any) => {
    setEditingId(sim.id);
    setSelectedModuleId(sim.moduleId);
    setSelectedSubtopicId(sim.subtopicId || "");
    setTitle(sim.title);
    setDescription(sim.description);
    setDifficulty(sim.difficulty);
    setEstimatedTime(sim.estimatedTime || "");
    setXpReward(sim.xpReward ? sim.xpReward.toString() : "100");
    setLearningOutcome(sim.learningOutcome || "");
    setFrontendUrl(sim.frontendUrl || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this simulation?")) return;
    try {
      const res = await fetch(`/api/faculty/simulations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Simulation deleted successfully");
        fetchSimulations();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete simulation");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete simulation");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setEstimatedTime("");
    setXpReward("100");
    setLearningOutcome("");
    setFrontendUrl("");
    setSelectedModuleId("");
    setSelectedSubtopicId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedModuleId || !title || !description || !frontendUrl) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/faculty/simulations", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          subjectId,
          moduleId: selectedModuleId,
          subtopicId: selectedSubtopicId || null,
          title,
          description,
          difficulty,
          estimatedTime,
          xpReward: parseInt(xpReward),
          learningOutcome,
          frontendUrl
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(editingId ? "Simulation updated successfully!" : "Simulation created successfully!");
        cancelEdit();
        fetchSimulations();
      } else {
        toast.error(data.error || "Failed to create simulation");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
          <Gamepad2 className="w-8 h-8 mr-3 text-primary" />
          Manage Interactive Simulations
        </h1>
        <p className="text-zinc-500 mt-1">Deploy and map simulation sandboxes to syllabus subtopics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creator Form */}
        <div className="lg:col-span-2">
          <Card className="border-zinc-200 shadow-md">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-xl text-zinc-900">{editingId ? "Edit Simulation" : "Add New Simulation"}</CardTitle>
              <CardDescription>Enter details and link the deployed simulation frontend HTML page.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Target Module *</label>
                    <select
                      required
                      value={selectedModuleId}
                      onChange={(e) => {
                        setSelectedModuleId(e.target.value);
                        setSelectedSubtopicId("");
                      }}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:border-primary"
                    >
                      <option value="">Select a Module</option>
                      {modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          M{m.moduleNo} - {m.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Target Subtopic (Optional)</label>
                    <select
                      disabled={!selectedModuleId}
                      value={selectedSubtopicId}
                      onChange={(e) => setSelectedSubtopicId(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white text-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-400 focus:outline-none focus:border-primary"
                    >
                      <option value="">Map to entire module</option>
                      {getSubtopicsForSelectedModule().map((st: any) => (
                        <option key={st.id} value={st.id}>
                          {st.subtopicNo} - {st.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Simulation Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fitts' Law Experiment Sandbox"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide description of what the user does in this simulation..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Difficulty *</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:border-primary"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Est. Duration (e.g. 20 mins)</label>
                    <input
                      type="text"
                      placeholder="e.g. 15 mins"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">XP Reward *</label>
                    <input
                      type="number"
                      required
                      value={xpReward}
                      onChange={(e) => setXpReward(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Learning Outcome</label>
                  <input
                    type="text"
                    placeholder="e.g. Ability to calculate throughput based on target index of difficulty."
                    value={learningOutcome}
                    onChange={(e) => setLearningOutcome(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1 flex items-center">
                    <Globe className="w-4 h-4 mr-1 text-primary animate-pulse" /> Deployed Simulation URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://yourdomain.com/simulation.html"
                    value={frontendUrl}
                    onChange={(e) => setFrontendUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                  />
                  <span className="text-xs text-zinc-500 mt-1 block">
                    This HTML page will render inside an iframe for students to play it.
                  </span>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold h-11 shadow-md transition-colors"
                  >
                    {loading ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Simulation" : "Add Simulation")}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                      disabled={loading}
                      className="flex-1 h-11 shadow-sm border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Existing Simulations List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-zinc-900">Current Simulations</h3>
          <div className="space-y-3">
            {simulations.length > 0 ? (
              simulations.map((sim) => (
                <Card key={sim.id} className="border-zinc-200 shadow-sm">
                  <CardHeader className="p-4 bg-zinc-50 border-b border-zinc-100 flex flex-col space-y-1">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sim.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        sim.difficulty === "Intermediate" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                        "bg-purple-50 text-purple-700 border border-purple-100"
                      }`}>
                        {sim.difficulty}
                      </span>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-amber-600">+{sim.xpReward} XP</span>
                        <button type="button" onClick={() => handleEdit(sim)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(sim.id)} className="text-red-600 hover:text-red-800 transition-colors" title="Delete">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <CardTitle className="text-sm font-bold text-zinc-900 mt-1">{sim.title}</CardTitle>
                    <p className="text-[10px] text-zinc-500">Module: {sim.module?.title}</p>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3 text-xs text-zinc-600">
                    <p className="leading-relaxed">{sim.description}</p>
                    
                    {sim.estimatedTime && (
                      <div className="flex items-center space-x-1.5 text-zinc-500">
                        <Clock className="w-3.5 h-3.5" /> <span>Duration: {sim.estimatedTime}</span>
                      </div>
                    )}
                    
                    {sim.learningOutcome && (
                      <div className="flex items-start space-x-1.5 text-zinc-600 bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                        <Info className="w-3.5 h-3.5 text-zinc-400 mt-0.5" />
                        <div>
                          <span className="font-semibold block text-[10px] text-zinc-500 uppercase">Outcome:</span>
                          <p className="text-[10px] leading-normal">{sim.learningOutcome}</p>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-zinc-100 flex items-center space-x-1 text-[10px] text-zinc-400">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="truncate">URL: {sim.frontendUrl}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-xs text-zinc-500 italic text-center py-6">No simulations created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
