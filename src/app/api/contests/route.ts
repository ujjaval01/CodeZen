import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json({ contests });
  } catch (e) {
    console.error("Contests API error:", e);
    return NextResponse.json({ error: "Internal server error fetching contests" }, { status: 500 });
  }
}
