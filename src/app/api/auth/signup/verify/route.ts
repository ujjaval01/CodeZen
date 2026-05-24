import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "nexuscode_jwt_secret_cyber_security_key";

export async function POST(req: NextRequest) {
  try {
    const { registrationToken, userOtp } = await req.json();

    if (!registrationToken || !userOtp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Decode and verify registration token
    let decoded: any;
    try {
      decoded = jwt.verify(registrationToken, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Verification token expired or invalid. Please request a new OTP code." }, { status: 400 });
    }

    const { name, email, passwordHash, otp } = decoded;

    if (!name || !email || !passwordHash || !otp) {
      return NextResponse.json({ error: "Invalid token structure" }, { status: 400 });
    }

    // Check OTP
    if (userOtp.trim() !== otp.toString()) {
      return NextResponse.json({ error: "Invalid OTP code. Please double check and try again." }, { status: 400 });
    }

    // Check if user already exists (just in case they signed up during verification period)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already registered. Please go to Log In." }, { status: 409 });
    }

    // Create user in DB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        xp: 0,
        level: 1,
        streak: 1,
      },
    });

    // Create JWT token for persistent login
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      message: "Registration completed successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
      },
    });
  } catch (e: any) {
    console.error("Signup OTP verification error:", e);
    return NextResponse.json({ error: "Internal server error during verification" }, { status: 500 });
  }
}
