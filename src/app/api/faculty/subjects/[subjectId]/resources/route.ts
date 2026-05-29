import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subjectId } = await params;

    const resources = await prisma.resource.findMany({
      where: { subjectId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("GET /api/faculty/subjects/[subjectId]/resources Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    const user = await getOrCreateUser();
    // In a real app, you would also verify user.role === "faculty" here
    if (!user || user.role !== "faculty") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subjectId } = await params;
    const body = await req.json();
    const { title, type, link, detail } = body;

    if (!title || !type || !link) {
      return NextResponse.json(
        { error: "Title, type, and link are required" },
        { status: 400 }
      );
    }

    const newResource = await prisma.resource.create({
      data: {
        title,
        type,
        link,
        detail,
        subjectId,
      },
    });

    return NextResponse.json(newResource);
  } catch (error) {
    console.error("POST /api/faculty/subjects/[subjectId]/resources Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
