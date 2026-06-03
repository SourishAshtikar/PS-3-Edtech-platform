"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus, Trash2, HelpCircle, FileUp, Sparkles, Pencil } from "lucide-react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface QuestionForm {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  marks: string;
  explanation: string;
  difficulty: string;
}

export default function ManageQuizzesPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;

  const [modules, setModules] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);

  // Form states
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedSubtopicId, setSelectedSubtopicId] = useState("");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [timeLimit, setTimeLimit] = useState("");
  const [xpReward, setXpReward] = useState("100");
  const [totalQuestionsToAsk, setTotalQuestionsToAsk] = useState("");
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "A",
      marks: "1",
      explanation: "",
      difficulty: "Easy"
    }
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchModules();
    fetchQuizzes();
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

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`/api/faculty/quizzes?subjectId=${subjectId}`);
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    }
  };

  const getSubtopicsForSelectedModule = () => {
    const mod = modules.find(m => m.id === selectedModuleId);
    return mod ? mod.subtopics || [] : [];
  };

  const handleAddQuestionField = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
        marks: "1",
        explanation: "",
        difficulty: "Easy"
      }
    ]);
  };

  const handleRemoveQuestionField = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleQuestionChange = (index: number, field: keyof QuestionForm, value: string) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleDocxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // 1. Read locally using mammoth
      const arrayBuffer = await file.arrayBuffer();
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      parseTextAndSetQuestions(text);

      // 2. Upload to Google Drive via API
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/faculty/quizzes/upload-document", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setDocumentUrl(data.url);
          toast.success("Document also uploaded to Google Drive!");
        }
      } else {
        console.error("Failed to upload to Google Drive");
        toast.error("Questions parsed, but failed to upload to Google Drive.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during file processing.");
    } finally {
      setLoading(false);
      if (e.target) e.target.value = ""; // reset file input
    }
  };

  const parseTextAndSetQuestions = (text: string) => {
    if (!text.trim()) return;

    const newQuestions: QuestionForm[] = [];
    const blocks = text.split(/\n(?=\d+\.\s)/).filter(b => b.trim());

    blocks.forEach(block => {
      // Find question text: anything up to the first A) or A. 
      const qMatch = block.match(/^(?:\d+\.\s+)?([\s\S]*?)\n(?=A[\)\.])/i);
      if (!qMatch) return;
      const questionText = qMatch[1].trim();

      const optionAMatch = block.match(/A[\)\.]\s+([^\n]*)/i);
      const optionBMatch = block.match(/B[\)\.]\s+([^\n]*)/i);
      const optionCMatch = block.match(/C[\)\.]\s+([^\n]*)/i);
      const optionDMatch = block.match(/D[\)\.]\s+([^\n]*)/i);

      let answer = "A";
      let explanation = "";

      const answerMatch = block.match(/Answer:\s*([A-D])[\.\s]*(.*)/is);
      if (answerMatch) {
        answer = answerMatch[1].toUpperCase();
        explanation = answerMatch[2].trim();
      }

      if (questionText) {
        newQuestions.push({
          questionText,
          optionA: optionAMatch ? optionAMatch[1].trim() : "",
          optionB: optionBMatch ? optionBMatch[1].trim() : "",
          optionC: optionCMatch ? optionCMatch[1].trim() : "",
          optionD: optionDMatch ? optionDMatch[1].trim() : "",
          correctAnswer: answer,
          marks: "1",
          explanation: explanation,
          difficulty: difficulty
        });
      }
    });

    if (newQuestions.length > 0) {
      setQuestions([...questions.filter(q => q.questionText.trim() !== ""), ...newQuestions]);
      toast.success(`Successfully parsed ${newQuestions.length} questions from DOCX!`);
    } else {
      toast.error("Failed to parse questions. Please check the format in the DOCX file.");
    }
  };

  const handleEdit = (quiz: any) => {
    setEditingQuizId(quiz.id);
    setSelectedModuleId(quiz.moduleId);
    setSelectedSubtopicId(quiz.subtopicId || "");
    setTitle(quiz.title);
    setDifficulty(quiz.difficulty);
    setTimeLimit(quiz.timeLimit.toString());
    setXpReward(quiz.xpReward.toString());
    setTotalQuestionsToAsk(quiz.totalQuestionsToAsk ? quiz.totalQuestionsToAsk.toString() : "");
    setDocumentUrl(quiz.documentUrl || null);

    if (quiz.questions && quiz.questions.length > 0) {
      setQuestions(quiz.questions.map((q: any) => ({
        questionText: q.questionText,
        optionA: q.options?.[0] || "",
        optionB: q.options?.[1] || "",
        optionC: q.options?.[2] || "",
        optionD: q.options?.[3] || "",
        correctAnswer: q.correctAnswer,
        marks: q.marks.toString(),
        explanation: q.explanation || "",
        difficulty: q.difficulty || "Easy"
      })));
    } else {
      setQuestions([{
        questionText: "", optionA: "", optionB: "", optionC: "", optionD: "",
        correctAnswer: "A", marks: "1", explanation: "", difficulty: "Easy"
      }]);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/faculty/quizzes/${quizId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Quiz deleted successfully");
        fetchQuizzes();
        if (editingQuizId === quizId) handleCancelEdit();
      } else {
        toast.error("Failed to delete quiz");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  const handleCancelEdit = () => {
    setEditingQuizId(null);
    setTitle("");
    setTimeLimit("");
    setXpReward("100");
    setTotalQuestionsToAsk("");
    setDocumentUrl(null);
    setSelectedSubtopicId("");
    setQuestions([{
      questionText: "", optionA: "", optionB: "", optionC: "", optionD: "",
      correctAnswer: "A", marks: "1", explanation: "", difficulty: "Easy"
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedModuleId || !title || !timeLimit || !xpReward) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const validQuestions = questions.filter(q => q.questionText.trim() !== "");
    if (validQuestions.length === 0) {
      toast.error("At least one question is required.");
      setLoading(false);
      return;
    }

    try {
      const url = editingQuizId ? `/api/faculty/quizzes/${editingQuizId}` : "/api/faculty/quizzes";
      const method = editingQuizId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: selectedModuleId,
          subtopicId: selectedSubtopicId || null,
          title,
          difficulty,
          timeLimit,
          xpReward,
          documentUrl,
          totalQuestionsToAsk: totalQuestionsToAsk ? parseInt(totalQuestionsToAsk) : null,
          questions: validQuestions
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(editingQuizId ? "Quiz updated successfully!" : "Quiz created successfully!");
        handleCancelEdit();
        fetchQuizzes();
      } else {
        toast.error(data.error || "Failed to save quiz");
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
          <Target className="w-8 h-8 mr-3 text-primary" />
          Manage Course Quizzes
        </h1>
        <p className="text-zinc-500 mt-1">Create conceptual quizzes manually or upload document materials for AI generation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creator Form */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-zinc-200 shadow-md">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-xl text-zinc-900">
                {editingQuizId ? "Edit Quiz" : "Manual Quiz Builder"}
              </CardTitle>
              <CardDescription>
                {editingQuizId ? "Modify details and questions for this quiz." : "Enter details and write individual quiz questions."}
              </CardDescription>
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
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Quiz Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Usability Principles Assessment"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
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
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Time Limit (mins) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 15"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
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
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Total Questions to Ask</label>
                    <input
                      type="number"
                      placeholder="e.g. 10 (Optional)"
                      value={totalQuestionsToAsk}
                      onChange={(e) => setTotalQuestionsToAsk(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-zinc-900">Questions</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddQuestionField}
                      className="border-primary text-primary hover:bg-primary/5 flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" /> <span>Add Question</span>
                    </Button>
                  </div>

                  <div className="mb-6 p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3 relative group">
                    <h4 className="font-bold text-sm text-zinc-800 flex items-center">
                      <FileUp className="w-4 h-4 mr-2 text-primary" /> Import Questions from DOCX
                    </h4>
                    {documentUrl && (
                      <p className="text-xs text-green-600 font-semibold mb-2">
                        Document uploaded and attached successfully.
                      </p>
                    )}
                    <p className="text-xs text-zinc-500">Upload a Word Document to extract questions. Format: <br/>1. Question Text<br/>A) Option 1<br/>B) Option 2<br/>C) Option 3<br/>D) Option 4<br/>Answer: A. Explanation text...</p>
                    
                    <div className="border-2 border-dashed border-zinc-300 rounded-lg p-4 flex flex-col items-center justify-center bg-white hover:bg-zinc-50 transition-colors relative cursor-pointer">
                      <input
                        type="file"
                        accept=".docx"
                        onChange={handleDocxUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={loading}
                      />
                      <FileUp className="w-8 h-8 text-zinc-400 group-hover:text-primary transition-colors mb-2" />
                      <span className="font-semibold text-zinc-700 text-xs">
                        Click or Drag .docx File here to Upload
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {questions.map((q, index) => (
                      <div key={index} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl relative space-y-4">
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestionField(index)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-primary transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                        <div className="flex items-center space-x-2">
                          <HelpCircle className="w-4 h-4 text-primary" />
                          <h4 className="font-bold text-zinc-800 text-sm">Question #{index + 1}</h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">Question Text *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Which of the following describes Fitts' Law?"
                            value={q.questionText}
                            onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Option A *</label>
                            <input
                              type="text"
                              required
                              placeholder="Option A"
                              value={q.optionA}
                              onChange={(e) => handleQuestionChange(index, "optionA", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Option B *</label>
                            <input
                              type="text"
                              required
                              placeholder="Option B"
                              value={q.optionB}
                              onChange={(e) => handleQuestionChange(index, "optionB", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Option C *</label>
                            <input
                              type="text"
                              required
                              placeholder="Option C"
                              value={q.optionC}
                              onChange={(e) => handleQuestionChange(index, "optionC", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Option D *</label>
                            <input
                              type="text"
                              required
                              placeholder="Option D"
                              value={q.optionD}
                              onChange={(e) => handleQuestionChange(index, "optionD", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Correct Answer *</label>
                            <select
                              value={q.correctAnswer}
                              onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Marks</label>
                            <input
                              type="number"
                              value={q.marks}
                              onChange={(e) => handleQuestionChange(index, "marks", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Difficulty</label>
                            <select
                              value={q.difficulty}
                              onChange={(e) => handleQuestionChange(index, "difficulty", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            >
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">Explanation (Optional)</label>
                          <textarea
                            rows={2}
                            placeholder="Provide correct answer explanation..."
                            value={q.explanation}
                            onChange={(e) => handleQuestionChange(index, "explanation", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  {editingQuizId && (
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={loading}
                      variant="outline"
                      className="w-full border-zinc-300 text-zinc-700 font-bold h-11"
                    >
                      Cancel Edit
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-11 shadow-md transition-colors"
                  >
                    {loading ? (editingQuizId ? "Updating..." : "Creating...") : (editingQuizId ? "Update Quiz" : "Create Quiz")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>


        </div>

        {/* Existing Quizzes List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-zinc-900">Current Quizzes</h3>
          <div className="space-y-3">
            {quizzes.length > 0 ? (
              quizzes.map((q) => (
                <Card key={q.id} className="border-zinc-200 shadow-sm">
                  <CardHeader className="p-4 bg-zinc-50 border-b border-zinc-100 flex flex-col space-y-1">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        q.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        q.difficulty === "Medium" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                        "bg-purple-50 text-purple-700 border border-purple-100"
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="text-xs font-bold text-amber-600">+{q.xpReward} XP</span>
                    </div>
                    <CardTitle className="text-sm font-bold text-zinc-900 mt-1">{q.title}</CardTitle>
                    <p className="text-[10px] text-zinc-500">Module: {q.module?.title}</p>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2 text-xs text-zinc-600">
                    <div className="flex justify-between items-center text-zinc-500 font-medium">
                      <span>Questions: {q.questions?.length || 0}</span>
                      <span>Time Limit: {q.timeLimit} mins</span>
                    </div>
                    {q.questions && q.questions.length > 0 && (
                      <div className="pt-2 border-t border-zinc-100 space-y-2">
                        {q.questions.slice(0, 3).map((quest: any, i: number) => (
                          <p key={quest.id} className="truncate text-[10px] text-zinc-500">
                            Q{i + 1}: {quest.questionText}
                          </p>
                        ))}
                        {q.questions.length > 3 && (
                          <p className="text-[9px] text-zinc-400 italic text-right">
                            + {q.questions.length - 3} more questions
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(q)} className="h-8 text-xs">
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(q.id)} className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-xs text-zinc-500 italic text-center py-6">No quizzes created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
