"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadModuleButtonProps {
  moduleId: string;
}

export function DownloadModuleButton({ moduleId }: DownloadModuleButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await fetch(`/api/student/export-module/${moduleId}`);
      
      if (!response.ok) {
        throw new Error("Failed to export module data");
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `module-${moduleId}.zip`;
      if (contentDisposition && contentDisposition.indexOf("filename=") !== -1) {
        const matches = /filename="([^"]*)"/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting module:", error);
      alert("Failed to export module data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      className="bg-zinc-900 text-white hover:bg-zinc-800"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      Download Module (ZIP)
    </Button>
  );
}
