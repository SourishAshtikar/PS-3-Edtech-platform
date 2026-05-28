import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModuleCard } from "@/components/cards/ModuleCard";
import { SimulationCard } from "@/components/cards/SimulationCard";
import { modules } from "@/data/modules";
import { simulations } from "@/data/simulations";
import { BookOpen, Gamepad2, Trophy, Flame, Target, Users, GraduationCap, ChevronRight, BellRing } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const featuredModules = modules.slice(0, 3);
  const featuredSimulations = simulations.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-[#8a0000] to-zinc-900 text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Badge className="bg-white/20 text-white hover:bg-white/30 px-4 py-1 text-sm mb-4 backdrop-blur-sm border-none">
              New: Interactive Learning Portal Active
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Level Up Your Knowledge through <span className="text-amber-400">Gamified</span> Learning
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto font-medium">
              An interactive educational experience featuring structured learning modules, hands-on virtual simulations, and friendly leaderboard competition.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/sign-up">
                <Button size="lg" className="bg-white text-primary hover:bg-zinc-100 font-bold px-8 h-14 text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all">
                  Start Learning Now
                </Button>
              </Link>
              <Link href="/student/modules">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 font-bold px-8 h-14 text-lg bg-transparent">
                  Explore Learning Paths
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-zinc-200 py-10 relative -mt-6 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl border border-zinc-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-zinc-100">
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl font-extrabold text-primary mb-2">5+</span>
              <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Active Paths</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl font-extrabold text-primary mb-2">20+</span>
              <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Interactive Simulators</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl font-extrabold text-primary mb-2">500+</span>
              <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Active Students</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl font-extrabold text-amber-500 mb-2">10k+</span>
              <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider">XP Awarded</span>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-8 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start sm:items-center space-x-4">
            <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
              <BellRing className="w-5 h-5 text-blue-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-blue-900 font-semibold text-sm">Platform Announcement</h3>
              <p className="text-blue-800 text-sm mt-1">
                New interactive challenges and sandboxes have been unlocked. Maintain your daily streak to earn double XP on learning activities this week!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Learning Modules */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">Curriculum</Badge>
              <h2 className="text-3xl font-bold text-zinc-900">Explore Learning Modules</h2>
              <p className="text-zinc-500 mt-2">Comprehensive syllabus covering core subject chapters and resource materials.</p>
            </div>
            <Link href="/student/modules" className="hidden sm:flex items-center text-primary font-medium hover:underline">
              View all {modules.length} modules <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredModules.map(module => (
              <ModuleCard key={module.id} module={module} href={`/student/modules/${module.id}`} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" className="w-full">View all modules</Button>
          </div>
        </div>
      </section>

      {/* Syllabus-based Simulations */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">Interactive</Badge>
              <h2 className="text-3xl font-bold text-zinc-900">Syllabus-based Simulations</h2>
              <p className="text-zinc-500 mt-2">Learn by doing. Apply theoretical concepts in virtual sandbox environments.</p>
            </div>
            <Link href="/student/simulations" className="hidden sm:flex items-center text-primary font-medium hover:underline">
              View all {simulations.length} simulations <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSimulations.map(sim => (
              <SimulationCard key={sim.id} simulation={sim} href={`/student/simulations/${sim.id}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Gamified Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-2 bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">Platform Features</Badge>
            <h2 className="text-3xl font-bold text-zinc-900">Gamified Learning Experience</h2>
            <p className="text-zinc-500 mt-4 text-lg">Stay motivated and track your progress with our integrated gamification mechanics.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 text-center border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-blue-100">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-zinc-800">XP Points</h3>
              <p className="text-zinc-500 text-sm">Earn experience points by completing modules, quizzes, and simulations.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-amber-100">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-zinc-800">Badges</h3>
              <p className="text-zinc-500 text-sm">Unlock special achievements for mastering specific learning topics.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-orange-100">
                <Flame className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-zinc-800">Streaks</h3>
              <p className="text-zinc-500 text-sm">Maintain a daily study streak to multiply your XP gains.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-purple-100">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-zinc-800">Leaderboard</h3>
              <p className="text-zinc-500 text-sm">Compete with your peers and climb to the top of the class rankings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Learning Journey CTA */}
      <section className="py-24 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-3xl rounded-full transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <GraduationCap className="w-16 h-16 mx-auto text-primary mb-6 animate-pulse" />
          <h2 className="text-4xl font-bold mb-6">Begin Your Learning Journey Today</h2>
          <p className="text-xl text-zinc-300 mb-10">Join your peers in the most engaging way to study courses, solve assessments, and top the leaderboard.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 h-14 text-lg">
                Create Student Account
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="border-zinc-600 text-white hover:bg-zinc-800 hover:text-white px-8 h-14 text-lg bg-transparent">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
