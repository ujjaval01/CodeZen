import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "codehub_jwt_secret_cyber_security_key";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Get Auth Token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;

    // Get User Details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get Contest
    const contest = await prisma.contest.findUnique({
      where: { id },
    });

    if (!contest) {
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    // Parse standings to check if already registered
    let standings: any[] = [];
    try {
      standings = JSON.parse(contest.standingsJson || "[]");
    } catch (e) {
      standings = [];
    }

    const isAlreadyRegistered = standings.some((s) => s.userId === userId);

    if (isAlreadyRegistered) {
      return NextResponse.json({ message: "Already registered" }, { status: 200 });
    }

    // Register user
    standings.push({
      userId: user.id,
      name: user.name,
      score: 0,
      finishTime: "--:--:--", // Initial placeholder
    });

    await prisma.contest.update({
      where: { id },
      data: {
        standingsJson: JSON.stringify(standings),
      },
    });

    return NextResponse.json({ message: "Registered successfully", standings });
  } catch (e) {
    console.error("Contest registration error:", e);
    return NextResponse.json({ error: "Internal server error during registration" }, { status: 500 });
  }
}
