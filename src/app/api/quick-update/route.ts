import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to format Google Drive URLs for videos
function formatVideoUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed === "") return null;

  if (trimmed.includes("drive.google.com")) {
    if (trimmed.includes("/file/d/")) {
      const parts = trimmed.split("/file/d/");
      if (parts.length > 1) {
        const fileId = parts[1].split(/[/?#]/)[0];
        if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    if (trimmed.includes("id=")) {
      try {
        const urlObj = new URL(trimmed);
        const fileId = urlObj.searchParams.get("id");
        if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
      } catch (e) {
        // ignore
      }
    }
  }
  return trimmed;
}

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      include: {
        subtopics: {
          orderBy: { subtopicNo: "asc" }
        }
      },
      orderBy: { moduleNo: "asc" }
    });
    return NextResponse.json(modules);
  } catch (error: any) {
    console.error("Error fetching modules for quick update:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subtopicId, videoUrl, notesUrl } = body;

    if (!subtopicId) {
      return NextResponse.json({ error: "Missing subtopicId" }, { status: 400 });
    }

    if (videoUrl) {
      const trimmedVideo = videoUrl.trim();
      if (trimmedVideo.includes("drive.google.com") || trimmedVideo.includes("docs.google.com")) {
        const hasFileD = trimmedVideo.includes("/file/d/");
        const hasId = trimmedVideo.includes("id=");
        if (!hasFileD && !hasId) {
          if (trimmedVideo.includes("/folders/")) {
            return NextResponse.json({ 
              error: "Google Drive Folder links cannot be streamed as video files. Please provide a link to a specific video file (e.g., https://drive.google.com/file/d/FILE_ID/view)." 
            }, { status: 400 });
          }
          return NextResponse.json({ 
            error: "Invalid Google Drive video URL format. Please provide a link to a specific video file (e.g., https://drive.google.com/file/d/FILE_ID/view)." 
          }, { status: 400 });
        }
      }
    }

    const formattedVideo = formatVideoUrl(videoUrl);
    const formattedNotes = notesUrl ? notesUrl.trim() : null;

    const updatedSubtopic = await prisma.subtopic.update({
      where: { id: subtopicId },
      data: {
        videoUrl: formattedVideo || null,
        notesUrl: formattedNotes || null
      }
    });

    return NextResponse.json({ success: true, subtopic: updatedSubtopic });
  } catch (error: any) {
    console.error("Error updating subtopic:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
