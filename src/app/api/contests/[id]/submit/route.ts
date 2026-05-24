import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "nexuscode_jwt_secret_cyber_security_key";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

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

    const body = await req.json();
    const { problemId, pointsEarned } = body;

    if (!problemId) {
      return NextResponse.json({ error: "Missing problemId" }, { status: 400 });
    }

    // Get Contest
    const contest = await prisma.contest.findUnique({
      where: { id },
    });

    if (!contest) {
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    // Check if within contest timeframe
    const now = new Date();
    if (now < new Date(contest.startTime) || now > new Date(contest.endTime)) {
      return NextResponse.json({ error: "Contest is not active" }, { status: 400 });
    }

    // Parse problems to ensure problem is part of contest
    let problemIds: string[] = [];
    try {
      problemIds = JSON.parse(contest.problemsJson || "[]");
    } catch (e) {}

    if (!problemIds.includes(problemId)) {
      return NextResponse.json({ error: "Problem is not part of this contest" }, { status: 400 });
    }

    // Parse standings and update
    let standings: any[] = [];
    try {
      standings = JSON.parse(contest.standingsJson || "[]");
    } catch (e) {
      standings = [];
    }

    const participantIndex = standings.findIndex((s) => s.userId === userId);

    if (participantIndex === -1) {
      return NextResponse.json({ error: "User is not registered for this contest" }, { status: 400 });
    }

    // Optionally check if already solved (prevent double points). We would need to store solved problems per user in contest.
    // For simplicity, we just add points (assume the frontend only calls this on first Accepted).
    // Or we track solved inside standings. Let's add 'solvedProblems' to standings.
    const participant = standings[participantIndex];
    if (!participant.solvedProblems) {
      participant.solvedProblems = [];
    }

    if (!participant.solvedProblems.includes(problemId)) {
      participant.solvedProblems.push(problemId);
      participant.score += (pointsEarned || 100);
      
      // Update finish time to now
      const start = new Date(contest.startTime);
      const diffMs = now.getTime() - start.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
      participant.finishTime = `${diffHours.toString().padStart(2, "0")}:${diffMins.toString().padStart(2, "0")}:${diffSecs.toString().padStart(2, "0")}`;

      standings[participantIndex] = participant;

      // Sort standings by score desc, then finish time asc
      standings.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.finishTime.localeCompare(b.finishTime);
      });

      // Update ranks
      standings.forEach((s, idx) => {
        s.rank = idx + 1;
      });

      await prisma.contest.update({
        where: { id },
        data: {
          standingsJson: JSON.stringify(standings),
        },
      });

      return NextResponse.json({ message: "Score updated successfully", standings });
    } else {
      return NextResponse.json({ message: "Already solved", standings }, { status: 200 });
    }
  } catch (e) {
    console.error("Contest submit error:", e);
    return NextResponse.json({ error: "Internal server error during submit" }, { status: 500 });
  }
}
