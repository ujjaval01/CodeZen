import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "codehub_jwt_secret_cyber_security_key";

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const { slug } = params;

    // Fetch problem details
    const problem = await prisma.problem.findUnique({
      where: { slug },
      include: {
        testCases: {
          select: {
            id: true,
            input: true,
            expectedOutput: true,
            isSample: true,
          },
        },
      },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Try to fetch user notes if logged in
    let notes = "";
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded?.userId) {
          const userNote = await prisma.note.findUnique({
            where: {
              userId_problemId: {
                userId: decoded.userId,
                problemId: problem.id,
              },
            },
          });
          if (userNote) {
            notes = userNote.content;
          }
        }
      } catch (err) {
        // Ignore token errors and proceed with empty notes
      }
    }

    return NextResponse.json({ problem, notes });
  } catch (e) {
    console.error("Fetch problem details error:", e);
    return NextResponse.json({ error: "Internal server error fetching problem details" }, { status: 500 });
  }
}
