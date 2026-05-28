"use client";

import { Button } from "@/components/ui/button";
import { HardDrive, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";

export function ConnectDriveButton({ isConnected = false }: { isConnected?: boolean }) {
  const handleConnect = () => {
    signIn("google", { callbackUrl: "/faculty/dashboard" }, {
      prompt: "consent",
      access_type: "offline",
      scope: "openid email profile https://www.googleapis.com/auth/drive.file"
    });
  };

  if (isConnected) {
    return (
      <Button 
        variant="outline" 
        disabled
        className="border-green-500 text-green-600 bg-green-50 flex items-center gap-2 opacity-100"
      >
        <CheckCircle2 className="w-4 h-4" />
        Google Drive Connected
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleConnect}
      className="border-primary text-primary hover:bg-primary/5 flex items-center gap-2"
    >
      <HardDrive className="w-4 h-4" />
      Connect Google Drive
    </Button>
  );
}
