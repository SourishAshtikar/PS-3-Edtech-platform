"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";

export function WhitelistFacultyForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWhitelist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/faculty/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Faculty whitelisted successfully.");
        setEmail("");
      } else {
        alert(data.error || "Failed to whitelist faculty.");
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleWhitelist} className="flex gap-2 mt-4">
      <input
        type="email"
        placeholder="faculty@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !email} className="min-w-[120px]">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
        Whitelist
      </Button>
    </form>
  );
}
