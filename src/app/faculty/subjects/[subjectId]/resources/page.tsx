"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Plus, Trash2 } from "lucide-react";
import { SubjectResourceCard } from "@/components/cards/SubjectResourceCard";

interface Resource {
  id: string;
  title: string;
  type: string;
  link: string;
  detail?: string;
}

export default function ManageResourcesPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState("paper"); // default to paper
  const [link, setLink] = useState("");

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/faculty/subjects/${subjectId}/resources`);
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (err) {
      console.error("Error fetching resources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [subjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !link) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/faculty/subjects/${subjectId}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type, link }),
      });

      if (res.ok) {
        setTitle("");
        setLink("");
        setType("paper");
        fetchResources();
      } else {
        alert("Failed to add resource.");
      }
    } catch (err) {
      console.error("Error adding resource:", err);
      alert("An error occurred while adding the resource.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Note: We don't have a DELETE API in the original plan, but we can easily add it or skip it for now.
  // We'll stick to what was approved: adding and viewing.

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
          <FolderOpen className="w-8 h-8 mr-3 text-primary" />
          Manage Subject Resources
        </h1>
        <p className="text-zinc-500 mt-1">Add reference books, previous year papers, or global subject materials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <Card className="border-zinc-200 shadow-md">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-lg">Add New Resource</CardTitle>
              <CardDescription>Link external drives or files.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Resource Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UI Previous Year Papers"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Resource Type *</label>
                  <select
                    required
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary text-sm"
                  >
                    <option value="paper">Question Papers</option>
                    <option value="book">Reference Books</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Drive Folder Link *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Adding..." : "Add Resource"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Existing Resources List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 border-b pb-2">Current Resources ({resources.length})</h3>
          
          {loading ? (
            <div className="text-zinc-500 animate-pulse text-sm">Loading resources...</div>
          ) : resources.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-300 rounded-lg bg-zinc-50">
              <p className="text-zinc-500">No resources linked to this subject yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <div key={resource.id} className="relative group">
                  <SubjectResourceCard 
                    title={resource.title}
                    type={resource.type}
                    link={resource.link}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
