import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "codehub_jwt_secret_cyber_security_key";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let userId: string | null = null;
    let decoded: any = null;

    if (token) {
      try {
        decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        // Token expired or invalid, treat as guest
      }
    }

    if (!userId) {
      // Fetch total problem counts on platform
      const totalEasy = await prisma.problem.count({ where: { difficulty: "EASY" } });
      const totalMedium = await prisma.problem.count({ where: { difficulty: "MEDIUM" } });
      const totalHard = await prisma.problem.count({ where: { difficulty: "HARD" } });

      const allBadges = await prisma.badge.findMany();
      const badgesStatus = allBadges.map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        icon: b.icon,
        isUnlocked: false,
      }));

      return NextResponse.json({
        user: {
          name: "Guest User",
          email: "guest@codehub.com",
          xp: 0,
          level: 1,
          streak: 0,
          createdAt: new Date().toISOString(),
        },
        stats: {
          solved: {
            total: 0,
            easy: 0,
            medium: 0,
            hard: 0,
            totalEasy,
            totalMedium,
            totalHard,
          },
          languageStats: [],
          heatmap: {},
        },
        recentSubmissions: [],
        badges: badgesStatus,
      });
    }

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        xp: true,
        level: true,
        streak: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch user submissions
    const submissions = await prisma.submission.findMany({
      where: { userId },
      include: {
        problem: {
          select: {
            title: true,
            slug: true,
            difficulty: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 1. Calculate solved counts by difficulty
    const solvedSubmissions = submissions.filter(s => s.status === "ACCEPTED");
    // Get unique problem IDs solved
    const solvedProblemIds = Array.from(new Set(solvedSubmissions.map(s => s.problemId)));

    // Fetch details of unique solved problems to count by difficulty
    const solvedProblems = await prisma.problem.findMany({
      where: {
        id: { in: solvedProblemIds },
      },
      select: {
        difficulty: true,
      },
    });

    const easySolved = solvedProblems.filter(p => p.difficulty === "EASY").length;
    const mediumSolved = solvedProblems.filter(p => p.difficulty === "MEDIUM").length;
    const hardSolved = solvedProblems.filter(p => p.difficulty === "HARD").length;

    // Fetch total problem counts on platform
    const totalEasy = await prisma.problem.count({ where: { difficulty: "EASY" } });
    const totalMedium = await prisma.problem.count({ where: { difficulty: "MEDIUM" } });
    const totalHard = await prisma.problem.count({ where: { difficulty: "HARD" } });

    // 2. Heatmap Calendar Calculations (number of submissions per day in last 365 days)
    const heatmap: Record<string, number> = {};
    submissions.forEach(sub => {
      const dateStr = new Date(sub.createdAt).toISOString().split("T")[0]; // YYYY-MM-DD
      heatmap[dateStr] = (heatmap[dateStr] || 0) + 1;
    });

    // 3. Language breakdown
    const languages: Record<string, number> = {};
    submissions.forEach(sub => {
      languages[sub.language] = (languages[sub.language] || 0) + 1;
    });
    const languageStats = Object.keys(languages).map(lang => ({
      name: lang.toUpperCase(),
      value: languages[lang],
    }));

    // 4. Badges (evaluate conditions dynamically)
    const allBadges = await prisma.badge.findMany();
    const badgesStatus = allBadges.map(b => {
      let isUnlocked = false;
      if (b.conditionType === "XP" && user.xp >= b.conditionValue) {
        isUnlocked = true;
      } else if (b.conditionType === "STREAK" && user.streak >= b.conditionValue) {
        isUnlocked = true;
      } else if (b.conditionType === "PROBLEMS_SOLVED" && solvedProblemIds.length >= b.conditionValue) {
        // Simple condition: check DP specific badge
        if (b.name.includes("DP")) {
          const dpSolved = solvedProblems.filter(p => p.difficulty === "DP").length; // DP tag check
          isUnlocked = dpSolved >= b.conditionValue;
        } else {
          isUnlocked = true;
        }
      }

      return {
        id: b.id,
        name: b.name,
        description: b.description,
        icon: b.icon,
        isUnlocked,
      };
    });

    return NextResponse.json({
      user,
      stats: {
        solved: {
          total: solvedProblemIds.length,
          easy: easySolved,
          medium: mediumSolved,
          hard: hardSolved,
          totalEasy,
          totalMedium,
          totalHard,
        },
        languageStats,
        heatmap,
      },
      recentSubmissions: submissions.slice(0, 8).map(s => ({
        id: s.id,
        problemTitle: s.problem.title,
        problemSlug: s.problem.slug,
        difficulty: s.problem.difficulty,
        status: s.status,
        language: s.language,
        executionTime: s.executionTime,
        memoryUsage: s.memoryUsage,
        createdAt: s.createdAt,
      })),
      badges: badgesStatus,
    });
  } catch (e) {
    console.error("Dashboard API error:", e);
    return NextResponse.json({ error: "Internal server error fetching dashboard statistics" }, { status: 500 });
  }
}
