"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Gamepad2, LayoutDashboard, Target, Trophy, LogOut, GraduationCap, Shield, User } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

export function MainNavbar() {
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated";
  const isLoaded = status !== "loading";
  const userRole = (session?.user as any)?.role;

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center group-hover:bg-primary/90 transition-all shadow-md">
            <GraduationCap className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-zinc-900 leading-none tracking-tight">Gamified Learning Platform</span>
            <span className="text-xs font-semibold text-primary mt-1">Somaiya EdTech Portal</span>
          </div>
        </Link>
        
        {/* Navigation Links for Authenticated Users */}
        {isLoaded && isSignedIn && (
          <div className="hidden lg:flex items-center space-x-8 font-medium text-zinc-600">
            {userRole === 'faculty' ? (
               <Link href="/faculty/dashboard" className="flex items-center space-x-2 hover:text-primary transition-colors">
                 <Shield className="w-4 h-4" /> <span>Faculty Dashboard</span>
               </Link>
            ) : (
               <>
                <Link href="/student/dashboard" className="flex items-center space-x-2 hover:text-primary transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> <span>Dashboard</span>
                </Link>
                <Link href="/student/profile" className="flex items-center space-x-2 hover:text-primary transition-colors">
                  <User className="w-4 h-4" /> <span>Profile</span>
                </Link>
                <Link href="/student/global-leaderboard" className="flex items-center space-x-2 hover:text-primary transition-colors">
                  <Trophy className="w-4 h-4" /> <span>Global Leaderboard</span>
                </Link>
               </>
            )}
          </div>
        )}

        {/* Auth action buttons */}
        <div className="flex items-center space-x-4">
          {isLoaded && !isSignedIn && (
            <Button onClick={() => signIn('google')} className="bg-primary hover:bg-primary/90 text-white shadow-md flex items-center space-x-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
              <span>Sign In with Google</span>
            </Button>
          )}
          
          {isLoaded && isSignedIn && (
            <Button onClick={() => signOut({ callbackUrl: '/' })} variant="outline" className="border-zinc-200 text-zinc-700 hover:text-primary hover:bg-zinc-50 flex items-center space-x-2">
              <LogOut className="w-4 h-4" /> <span>Sign Out</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
