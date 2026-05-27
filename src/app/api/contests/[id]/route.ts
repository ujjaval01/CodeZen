import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const contest = await prisma.contest.findUnique({
      where: { id },
    });

    if (!contest) {
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    let problemIds: string[] = [];
    try {
      problemIds = JSON.parse(contest.problemsJson || "[]");
    } catch (e) {
      console.error("Failed to parse contest problemsJson");
    }

    let problems: any[] = [];
    if (problemIds.length > 0) {
      problems = await prisma.problem.findMany({
        where: { id: { in: problemIds } },
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          acceptanceRate: true,
        },
      });
      // Sort to maintain the order defined in problemsJson if possible, or leave as is
      problems.sort((a, b) => problemIds.indexOf(a.id) - problemIds.indexOf(b.id));
    }

    return NextResponse.json({
      contest,
      problems,
    });
  } catch (e) {
    console.error("Fetch contest error:", e);
    return NextResponse.json({ error: "Internal server error fetching contest" }, { status: 500 });
  }
}
