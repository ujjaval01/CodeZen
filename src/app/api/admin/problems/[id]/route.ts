import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "codehub_jwt_secret_cyber_security_key";

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;

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

    // Delete problem (Prisma cascade delete will handle testCases, submissions, etc. due to onDelete: Cascade)
    await prisma.problem.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Problem deleted successfully" });
  } catch (e: any) {
    console.error("Delete problem admin error:", e);
    return NextResponse.json({ error: e.message || "Internal server error deleting problem" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;

    // Verify admin privileges
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    if (decoded.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { title, slug, difficulty, category, statement, constraints, timeComplexity, spaceComplexity, tags, companies, premium, testCases } = body;

    // Update the problem
    await prisma.problem.update({
      where: { id },
      data: {
        title, slug, difficulty, category, statement, constraints,
        timeComplexity, spaceComplexity,
        tagsJson: tags ? JSON.stringify(tags) : undefined,
        companiesJson: companies ? JSON.stringify(companies) : undefined,
        premium
      }
    });

    // If testcases provided, replace them
    if (testCases && Array.isArray(testCases)) {
      await prisma.testCase.deleteMany({ where: { problemId: id } });
      for (const tc of testCases) {
        await prisma.testCase.create({
          data: {
            problemId: id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isSample: tc.isSample
          }
        });
      }
    }

    return NextResponse.json({ message: "Problem updated successfully" });
  } catch (e: any) {
    console.error("Update problem admin error:", e);
    return NextResponse.json({ error: e.message || "Internal server error updating problem" }, { status: 500 });
  }
}
