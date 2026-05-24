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
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }

    if (!decoded.userId) {
      return NextResponse.json({ error: "Unauthorized: Invalid token payload" }, { status: 401 });
    }

    // Fetch user from DB to get latest stats (XP, streak, level)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        xp: true,
        level: true,
        streak: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (e) {
    console.error("Fetch current user error:", e);
    return NextResponse.json({ error: "Internal server error fetching user profile" }, { status: 500 });
  }
}
