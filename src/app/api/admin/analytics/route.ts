import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "nexuscode_jwt_secret_cyber_security_key";

export async function GET(req: NextRequest) {
  try {
    // Verify admin privileges
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized: Session expired" }, { status: 401 });
    }

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    // Gather analytics counts
    const [usersCount, problemsCount, submissionsCount] = await Promise.all([
      prisma.user.count(),
      prisma.problem.count(),
      prisma.submission.count(),
    ]);

    // Fetch problem distribution by difficulty
    const easyCount = await prisma.problem.count({ where: { difficulty: "EASY" } });
    const mediumCount = await prisma.problem.count({ where: { difficulty: "MEDIUM" } });
    const hardCount = await prisma.problem.count({ where: { difficulty: "HARD" } });

    // Fetch recent submissions
    const recentSubmissions = await prisma.submission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        problem: { select: { title: true } },
      },
    });

    return NextResponse.json({
      analytics: {
        usersCount,
        problemsCount,
        submissionsCount,
        difficultyCounts: {
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount,
        },
      },
      recentSubmissions: recentSubmissions.map(s => ({
        id: s.id,
        userName: s.user.name,
        problemTitle: s.problem.title,
        status: s.status,
        language: s.language,
        createdAt: s.createdAt,
      })),
    });
  } catch (e) {
    console.error("Admin analytics API error:", e);
    return NextResponse.json({ error: "Internal server error fetching admin statistics" }, { status: 500 });
  }
}
