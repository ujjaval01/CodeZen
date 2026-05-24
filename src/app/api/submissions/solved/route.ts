import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "nexuscode_jwt_secret_cyber_security_key";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ solvedProblemIds: [] });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ solvedProblemIds: [] });
    }

    if (!decoded.userId) {
      return NextResponse.json({ solvedProblemIds: [] });
    }

    // Fetch unique accepted submissions
    const acceptedSubmissions = await prisma.submission.findMany({
      where: {
        userId: decoded.userId,
        status: "ACCEPTED",
      },
      select: {
        problemId: true,
      },
    });

    const solvedProblemIds = Array.from(new Set(acceptedSubmissions.map(s => s.problemId)));

    return NextResponse.json({ solvedProblemIds });
  } catch (e) {
    console.error("Fetch solved submissions error:", e);
    return NextResponse.json({ error: "Internal server error fetching solved list" }, { status: 500 });
  }
}
