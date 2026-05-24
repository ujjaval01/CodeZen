import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "nexuscode_jwt_secret_cyber_security_key";

export async function POST(req: NextRequest) {
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

    // Get body parameters
    const body = await req.json();
    const {
      title, slug, difficulty, category, statement, constraints,
      examples, hints, timeComplexity, spaceComplexity,
      companies, tags, premium, testCases
    } = body;

    if (!title || !slug || !difficulty || !statement || !testCases || testCases.length === 0) {
      return NextResponse.json({ error: "Missing required fields (title, slug, difficulty, statement, testCases)" }, { status: 400 });
    }

    // Check if slug is unique
    const existingProblem = await prisma.problem.findUnique({
      where: { slug },
    });

    if (existingProblem) {
      return NextResponse.json({ error: "Slug must be unique. A problem already exists with this slug." }, { status: 409 });
    }

    // Parse and stringify fields
    const examplesJson = JSON.stringify(examples || []);
    const hintsJson = JSON.stringify(hints || []);
    const companiesJson = JSON.stringify(companies || []);
    const tagsJson = JSON.stringify(tags || []);

    // Create problem & test cases atomic transaction
    const newProblem = await prisma.$transaction(async (tx) => {
      const prob = await tx.problem.create({
        data: {
          title,
          slug,
          difficulty: difficulty.toUpperCase(),
          category: category || "DSA",
          statement,
          constraints,
          examplesJson,
          hintsJson,
          editorial: "Editorial for this question is under review.",
          timeComplexity: timeComplexity || "O(N)",
          spaceComplexity: spaceComplexity || "O(1)",
          companiesJson,
          tagsJson,
          premium: !!premium,
          acceptanceRate: 100.0,
        },
      });

      for (const tc of testCases) {
        await tx.testCase.create({
          data: {
            problemId: prob.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isSample: !!tc.isSample,
          },
        });
      }

      return prob;
    });

    return NextResponse.json({
      message: "Problem created successfully",
      problem: newProblem,
    });
  } catch (e: any) {
    console.error("Create problem admin error:", e);
    return NextResponse.json({ error: e.message || "Internal server error creating problem" }, { status: 500 });
  }
}
