"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Play, AlertCircle, Trophy, CheckCircle2, Eye, ShieldAlert, Sparkles } from "lucide-react";

interface SimulationContainerProps {
  simulation: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    xpReward: number;
    estimatedTime: string | null;
    learningOutcome: string | null;
    frontendUrl?: string | null;
  };
  category: string;
}

export function SimulationContainer({ simulation, category }: SimulationContainerProps) {
  const [started, setStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const params = useParams();
  const subjectId = params?.subjectId as string;

  // State for Sim 1 (Usability Audit Simulator)
  const [foundFlaws, setFoundFlaws] = useState<string[]>([]);
  const flawsList = [
    { id: "flaw1", name: "Low Contrast Placeholder", desc: "Gray text on white background makes input placeholder illegible." },
    { id: "flaw2", name: "Confusing Error Message", desc: "Error says 'Invalid Input' without specifying which field failed." },
    { id: "flaw3", name: "No Visual Step Indicators", desc: "No indication of what step of checkout the user is currently on." },
    { id: "flaw4", name: "Microscopic Checkout Button", desc: "The main call to action is too small and hard to tap on mobile." },
    { id: "flaw5", name: "Missing Labels", desc: "Input fields rely solely on placeholders, which disappear when typing." }
  ];

  const handleFlawClick = (id: string) => {
    if (foundFlaws.includes(id)) {
      setFoundFlaws(prev => prev.filter(f => f !== id));
    } else {
      setFoundFlaws(prev => [...prev, id]);
    }
  };

  const handleSubmitSimulation = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/simulations/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          simulationId: simulation.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setXpEarned(data.xpEarned);
        setCompleted(true);
      } else {
        alert(data.error || "Failed to submit simulation");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completed) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <Card className="border-zinc-200 shadow-xl overflow-hidden">
          <div className="h-2 bg-green-600" />
          <CardHeader className="pt-8 pb-4">
            <div className="mx-auto mb-4 bg-green-100 p-4 rounded-full text-green-600 w-24 h-24 flex items-center justify-center animate-bounce">
              <Trophy className="w-12 h-12" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-zinc-900">Simulation Completed!</CardTitle>
            <p className="text-zinc-500 mt-2">
              Outstanding work! You successfully finished the <strong>{simulation.title}</strong> sandbox.
            </p>
          </CardHeader>
          <CardContent className="px-8 py-4 space-y-4">
            <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 flex items-center justify-center space-x-4">
              <div className="text-center">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">XP Awarded</span>
                <span className="text-3xl font-bold text-amber-600">+{xpEarned} XP</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-zinc-50 border-t border-zinc-100 p-6">
            <Link href={subjectId ? `/student/subjects/${subjectId}/simulations` : "/student/dashboard"} className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
                Back to simulations
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (started) {
    return (
      <div className={`container mx-auto px-4 py-6 ${simulation.frontendUrl ? 'max-w-[1600px]' : 'max-w-4xl'}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{simulation.title}</h1>
            <p className="text-zinc-500 text-sm">Interactive UI Sandbox</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setStarted(false)} className="border-zinc-300">
            Exit Sandbox
          </Button>
        </div>

        {simulation.id === "sim1" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* The E-Commerce Mockup Sandbox */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-2 border-zinc-300 shadow-lg overflow-hidden">
                <div className="bg-zinc-800 text-zinc-300 px-4 py-2 text-xs font-mono flex items-center justify-between">
                  <span>http://mock-checkout.edu/cart</span>
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 block"></span>
                  </div>
                </div>
                <CardContent className="p-6 bg-white select-none">
                  {/* Flaw 3: No step indicator */}
                  <div 
                    onClick={() => handleFlawClick("flaw3")}
                    className={`p-3 rounded-lg border-2 mb-6 cursor-pointer transition-all ${
                      foundFlaws.includes("flaw3") 
                        ? "border-green-500 bg-green-50/50" 
                        : "border-zinc-200 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-2">
                      <span>Checkout Flow Step</span>
                      {foundFlaws.includes("flaw3") && <Badge className="bg-green-600 text-white border-none">Step Flaw Spotted!</Badge>}
                    </div>
                    <div className="h-2 bg-zinc-200 rounded" />
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-zinc-800">Secure Checkout</h3>
                  
                  {/* Flaw 5: Missing Labels */}
                  <div 
                    onClick={() => handleFlawClick("flaw5")}
                    className={`p-3 rounded-lg border-2 mb-4 cursor-pointer transition-all ${
                      foundFlaws.includes("flaw5") 
                        ? "border-green-500 bg-green-50/50" 
                        : "border-zinc-200 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-1">
                      <span>Customer Details</span>
                      {foundFlaws.includes("flaw5") && <Badge className="bg-green-600 text-white border-none">Missing Labels Spotted!</Badge>}
                    </div>
                    <div className="space-y-3">
                      {/* Flaw 1: Low contrast placeholders */}
                      <div 
                        onClick={(e) => { e.stopPropagation(); handleFlawClick("flaw1"); }}
                        className={`p-2 rounded border-2 transition-all ${
                          foundFlaws.includes("flaw1") 
                            ? "border-green-500 bg-green-50/50" 
                            : "border-transparent hover:border-primary/50"
                        }`}
                      >
                        <div className="flex justify-between text-[10px] text-zinc-400 mb-0.5">
                          <span>Full Name</span>
                          {foundFlaws.includes("flaw1") && <span className="text-green-600 font-bold">Contrast Flaw Spotted!</span>}
                        </div>
                        <input 
                          type="text" 
                          placeholder="John Doe" 
                          disabled 
                          className="w-full border border-zinc-200 rounded px-3 py-1.5 text-xs placeholder-zinc-100 bg-zinc-50"
                        />
                      </div>
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        disabled 
                        className="w-full border border-zinc-200 rounded px-3 py-1.5 text-xs placeholder-zinc-400 bg-zinc-50" 
                      />
                    </div>
                  </div>

                  {/* Flaw 2: Confusing Error Message */}
                  <div 
                    onClick={() => handleFlawClick("flaw2")}
                    className={`p-3 rounded-lg border-2 mb-6 cursor-pointer transition-all ${
                      foundFlaws.includes("flaw2") 
                        ? "border-green-500 bg-green-50/50" 
                        : "border-zinc-200 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 mb-1">
                      <span>Payment Info</span>
                      {foundFlaws.includes("flaw2") && <Badge className="bg-green-600 text-white border-none">Error Flaw Spotted!</Badge>}
                    </div>
                    <div className="bg-red-50 text-red-600 border border-red-200 rounded p-2.5 text-xs font-semibold flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Error: Invalid Input. Please resolve errors.</span>
                    </div>
                  </div>

                  {/* Flaw 4: Microscopic Checkout Button */}
                  <div 
                    onClick={() => handleFlawClick("flaw4")}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex justify-center ${
                      foundFlaws.includes("flaw4") 
                        ? "border-green-500 bg-green-50/50" 
                        : "border-zinc-200 hover:border-primary/50"
                    }`}
                  >
                    <div className="text-center w-full">
                      {foundFlaws.includes("flaw4") && (
                        <div className="text-xs font-bold text-green-600 mb-1">Button Size Flaw Spotted!</div>
                      )}
                      <button disabled className="bg-zinc-800 text-white text-[8px] px-2 py-0.5 rounded shadow-sm mx-auto block font-mono">
                        checkout
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checklist Panel */}
            <div className="space-y-4">
              <Card className="border-zinc-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-primary" /> Audit Checklist
                  </CardTitle>
                  <p className="text-zinc-500 text-xs">Click elements on the mockup page to identify all 5 usability errors.</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {flawsList.map((flaw) => {
                    const found = foundFlaws.includes(flaw.id);
                    return (
                      <div 
                        key={flaw.id} 
                        className={`p-3 rounded-lg border transition-all text-sm ${
                          found 
                            ? "bg-green-50 border-green-200 text-green-800" 
                            : "bg-zinc-50 border-zinc-150 text-zinc-500"
                        }`}
                      >
                        <div className="flex items-center space-x-2 font-bold mb-1">
                          <CheckCircle2 className={`w-4 h-4 ${found ? "text-green-600 fill-green-100" : "text-zinc-300"}`} />
                          <span>{flaw.name}</span>
                        </div>
                        {found && <p className="text-xs text-green-700/90 leading-relaxed">{flaw.desc}</p>}
                      </div>
                    );
                  })}
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    onClick={handleSubmitSimulation}
                    disabled={foundFlaws.length < 5 || isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
                  >
                    {isSubmitting ? "Submitting..." : foundFlaws.length < 5 ? `Spot remaining flaws (${foundFlaws.length}/5)` : "Submit Usability Audit"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : simulation.frontendUrl ? (
          /* Deployed Frontend HTML Simulation Embedded in IFrame */
          <div className="space-y-4">
            <Card className="border border-zinc-200 shadow-lg overflow-hidden bg-white">
              <div className="bg-zinc-800 text-zinc-300 px-4 py-2 text-xs font-mono flex items-center justify-between">
                <span className="truncate">{simulation.frontendUrl}</span>
                <div className="flex space-x-1.5 flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 block"></span>
                </div>
              </div>
              <div className="relative w-full h-[85vh] min-h-[700px] bg-white">
                <iframe 
                  src={simulation.frontendUrl} 
                  className="absolute inset-0 w-full h-full border-none"
                  title={simulation.title}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  allowFullScreen
                />
              </div>
            </Card>
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSubmitSimulation}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/95 text-white font-bold px-8 shadow-md"
              >
                {isSubmitting ? "Submitting..." : "Complete & Submit Sandbox"}
              </Button>
            </div>
          </div>
        ) : (
          /* Generic Simulation Simulator */
          <Card className="border-zinc-200 max-w-2xl mx-auto shadow-lg">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100 text-center py-8">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
              <CardTitle className="text-2xl font-bold text-zinc-900">{simulation.title} Sandbox</CardTitle>
              <p className="text-zinc-500 mt-2 max-w-md mx-auto">{simulation.description}</p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6">
                <h4 className="font-bold text-zinc-800 mb-3 text-sm uppercase tracking-wider">Sandbox Checklist</h4>
                <ul className="space-y-3 text-sm text-zinc-600">
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Review information architecture guidelines.</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Arrange and map nodes inside UI canvas.</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Perform layout balance validation checks.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start space-x-3 text-blue-800">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Interactive Sandbox Environment</p>
                  <p>In this sandbox, you are tasked with aligning page components to ensure ideal scanning. When ready, submit the final build to claim XP.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-zinc-50 border-t border-zinc-100 p-6 flex justify-end">
              <Button 
                onClick={handleSubmitSimulation}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white font-bold px-8"
              >
                {isSubmitting ? "Submitting..." : "Complete & Submit Sandbox"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={subjectId ? `/student/subjects/${subjectId}/simulations` : "/student/dashboard"} className="flex items-center text-sm font-medium text-zinc-500 hover:text-primary mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Simulations
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 rounded-xl aspect-video flex flex-col items-center justify-center border border-zinc-200 overflow-hidden relative shadow-lg">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <div className="z-10 text-center p-8 bg-zinc-900/80 rounded-2xl backdrop-blur-sm border border-zinc-800">
              <Play className="w-16 h-16 text-primary mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold text-white mb-2">{simulation.title}</h2>
              <p className="text-zinc-400 mb-6 max-w-md mx-auto">{simulation.description}</p>
              <Button size="lg" onClick={() => setStarted(true)} className="bg-primary hover:bg-primary/90 text-white font-bold px-8">
                Launch Sandbox
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-zinc-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Simulation Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Related Module</div>
                  <Badge variant="outline" className="text-zinc-700 bg-zinc-50">{category}</Badge>
                </div>
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Difficulty Level</div>
                  <Badge className="bg-zinc-100 text-zinc-800 hover:bg-zinc-200">{simulation.difficulty}</Badge>
                </div>
                <div>
                  <div className="text-sm text-zinc-500 mb-1">XP Reward</div>
                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">+{simulation.xpReward} XP</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 shadow-sm bg-blue-50 border-blue-100">
            <CardContent className="p-6 flex items-start space-x-3 text-blue-800">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Instructions</p>
                <p>Ensure you have completed the reading material for {category} before attempting this simulation to maximize your score.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
