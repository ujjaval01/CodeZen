import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { executeCode } from "@/lib/compiler";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "nexuscode_jwt_secret_cyber_security_key";

export async function POST(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const { slug } = params;
    const { language, code } = await req.json();

    if (!language || !code) {
      return NextResponse.json({ error: "Language and code are required fields" }, { status: 400 });
    }

    // Get problem and testcases
    const problem = await prisma.problem.findUnique({
      where: { slug },
      include: { testCases: true },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Get authenticated user
    let userId: string | null = null;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId || null;
      } catch (err) {
        // Ignore token errors and run as guest
      }
    }

    if (problem.testCases.length === 0) {
      return NextResponse.json({ error: "No test cases configured for this problem. Contact admin." }, { status: 500 });
    }

    let finalStatus: "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | "COMPILE_ERROR" = "ACCEPTED";
    let maxTime = 0;
    let maxMemory = 0;
    let failReason = "";
    let testcaseIndex = 0;

    // Run against all test cases
    for (let i = 0; i < problem.testCases.length; i++) {
      const tc = problem.testCases[i];
      testcaseIndex = i + 1;

      const runResult = await executeCode(language, code, tc.input);

      maxTime = Math.max(maxTime, runResult.executionTime);
      maxMemory = Math.max(maxMemory, runResult.memoryUsage);

      if (runResult.status !== "ACCEPTED") {
        finalStatus = runResult.status;
        failReason = runResult.error || runResult.stderr || "Runtime error";
        break;
      }

      // Check outputs (whitespace and carriage return insensitive)
      const cleanExpected = tc.expectedOutput.replace(/\r/g, "").trim();
      const cleanActual = runResult.stdout.replace(/\r/g, "").trim();

      if (cleanExpected !== cleanActual) {
        finalStatus = "WRONG_ANSWER";
        // Show input/outputs for sample test cases, mask them for hidden ones
        if (tc.isSample) {
          failReason = `Sample Test Case failed. Input:\n${tc.input}\nExpected:\n${cleanExpected}\nActual Output:\n${cleanActual}`;
        } else {
          failReason = `Hidden Test Case ${testcaseIndex} failed. Check your logic and edge cases.`;
        }
        break;
      }
    }

    // Save submission to DB if user is logged in
    let newSubmission = null;
    let xpGained = 0;
    let leveledUp = false;
    let newLevel = 1;

    if (userId) {
      newSubmission = await prisma.submission.create({
        data: {
          userId,
          problemId: problem.id,
          code,
          language,
          status: finalStatus,
          executionTime: maxTime,
          memoryUsage: maxMemory,
          error: failReason || null,
        },
      });

      // Award XP if first time solved
      if (finalStatus === "ACCEPTED") {
        const previousSolutions = await prisma.submission.count({
          where: {
            userId,
            problemId: problem.id,
            status: "ACCEPTED",
            id: { not: newSubmission.id }, // Exclude current submission
          },
        });

        // First solve!
        if (previousSolutions === 0) {
          const xpMap: Record<string, number> = { EASY: 20, MEDIUM: 50, HARD: 100 };
          xpGained = xpMap[problem.difficulty.toUpperCase()] || 20;

          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user) {
            const updatedXp = user.xp + xpGained;
            newLevel = Math.floor(updatedXp / 500) + 1; // 500 XP per level
            leveledUp = newLevel > user.level;

            // Increment streak
            const now = new Date();
            const lastActive = new Date(user.lastActive);
            const timeDiff = now.getTime() - lastActive.getTime();
            const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            
            let newStreak = user.streak;
            if (dayDiff === 1) {
              newStreak += 1;
            } else if (dayDiff > 1) {
              newStreak = 1; // reset streak
            }

            await prisma.user.update({
              where: { id: userId },
              data: {
                xp: updatedXp,
                level: newLevel,
                lastActive: now,
                streak: newStreak,
              },
            });
          }
        }
      }
    }

    return NextResponse.json({
      status: finalStatus,
      executionTime: maxTime,
      memoryUsage: maxMemory,
      error: failReason,
      xpGained,
      leveledUp,
      newLevel,
      testCasesCount: problem.testCases.length,
    });
  } catch (e) {
    console.error("Submit code API error:", e);
    return NextResponse.json({ error: "Internal server error during code submission" }, { status: 500 });
  }
}
