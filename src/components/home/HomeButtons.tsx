"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export function HeroButtons() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoaded = status !== "loading";

  const handleAction = () => {
    if (!isLoaded) return;
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      if (role === "faculty") router.push("/faculty/dashboard");
      else router.push("/student/dashboard");
    } else {
      signIn("google");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
      <Button 
        onClick={handleAction}
        size="lg" 
        className="bg-white text-primary hover:bg-zinc-100 font-bold px-8 h-14 text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all"
      >
        {status === "authenticated" ? "Go to Dashboard" : "Start Learning Now"}
      </Button>
      <Button 
        onClick={handleAction}
        size="lg" 
        variant="outline" 
        className="text-white border-white hover:bg-white/10 font-bold px-8 h-14 text-lg bg-transparent"
      >
        Explore Learning Paths
      </Button>
    </div>
  );
}

export function FooterButtons() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoaded = status !== "loading";

  const handleAction = () => {
    if (!isLoaded) return;
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      if (role === "faculty") router.push("/faculty/dashboard");
      else router.push("/student/dashboard");
    } else {
      signIn("google");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Button 
        onClick={handleAction}
        size="lg" 
        className="bg-primary hover:bg-primary/90 text-white px-8 h-14 text-lg"
      >
        {status === "authenticated" ? "Go to Dashboard" : "Create Student Account"}
      </Button>
      <Button 
        onClick={handleAction}
        size="lg" 
        variant="outline" 
        className="border-zinc-600 text-white hover:bg-zinc-800 hover:text-white px-8 h-14 text-lg bg-transparent"
      >
        {status === "authenticated" ? "Resume Learning" : "Sign In to Dashboard"}
      </Button>
    </div>
  );
}
