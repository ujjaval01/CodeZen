import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const tag = searchParams.get("tag") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { statement: { contains: search } },
      ];
    }

    if (difficulty) {
      where.difficulty = difficulty.toUpperCase();
    }

    if (tag) {
      where.tagsJson = { contains: tag };
    }

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          category: true,
          tagsJson: true,
          acceptanceRate: true,
          premium: true,
        },
        orderBy: { orderIndex: "asc" },
        skip,
        take: limit,
      }),
      prisma.problem.count({ where }),
    ]);

    return NextResponse.json({
      problems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    console.error("Fetch problems error:", e);
    return NextResponse.json({ error: "Internal server error fetching problems" }, { status: 500 });
  }
}
