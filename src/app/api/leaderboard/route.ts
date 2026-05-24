import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Query users ranked by XP
    const users = await prisma.user.findMany({
      orderBy: { xp: "desc" },
      select: {
        id: true,
        name: true,
        role: true,
        xp: true,
        level: true,
        streak: true,
        submissions: {
          where: { status: "ACCEPTED" },
          select: { problemId: true },
        },
      },
      take: 50, // limit to top 50
    });

    // Format results to count unique solved problems
    const rankedUsers = users.map((u, index) => {
      const solvedProblemIds = Array.from(new Set(u.submissions.map(s => s.problemId)));
      return {
        rank: index + 1,
        id: u.id,
        name: u.name,
        role: u.role,
        xp: u.xp,
        level: u.level,
        streak: u.streak,
        solvedCount: solvedProblemIds.length,
      };
    });

    return NextResponse.json({ leaderboard: rankedUsers });
  } catch (e) {
    console.error("Leaderboard API error:", e);
    return NextResponse.json({ error: "Internal server error fetching leaderboard" }, { status: 500 });
  }
}
