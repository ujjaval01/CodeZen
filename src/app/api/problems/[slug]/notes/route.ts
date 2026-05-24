import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "nexuscode_jwt_secret_cyber_security_key";

export async function POST(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const { slug } = params;
    const { content } = await req.json();

    // Verify user JWT token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Please log in to save notes" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized: Session expired" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Unauthorized: Invalid session" }, { status: 401 });
    }

    // Get problem ID
    const problem = await prisma.problem.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Upsert note
    const note = await prisma.note.upsert({
      where: {
        userId_problemId: {
          userId: decoded.userId,
          problemId: problem.id,
        },
      },
      update: {
        content,
      },
      create: {
        userId: decoded.userId,
        problemId: problem.id,
        content,
      },
    });

    return NextResponse.json({ message: "Notes saved successfully", note });
  } catch (e) {
    console.error("Save notes error:", e);
    return NextResponse.json({ error: "Internal server error saving notes" }, { status: 500 });
  }
}
