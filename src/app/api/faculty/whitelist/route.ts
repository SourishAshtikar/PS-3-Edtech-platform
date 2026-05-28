import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "faculty") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.role === "faculty") {
        return NextResponse.json({ message: "User is already a faculty member." }, { status: 200 });
      }
      
      await prisma.user.update({
        where: { email },
        data: { role: "faculty" },
      });
      return NextResponse.json({ message: "Existing user upgraded to faculty." }, { status: 200 });
    }

    // Pre-create the user as faculty. When they sign in via Google, NextAuth will link the account.
    await prisma.user.create({
      data: {
        email,
        role: "faculty",
        name: email.split("@")[0], // Placeholder name
      },
    });

    return NextResponse.json({ message: "Faculty member added successfully. They can now sign in." }, { status: 200 });
  } catch (error) {
    console.error("Error whitelisting faculty:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
