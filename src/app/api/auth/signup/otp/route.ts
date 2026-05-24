import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "nexuscode_jwt_secret_cyber_security_key";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 });
    }

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Print to the server terminal clearly for development
    console.log("\n=======================================================");
    console.log(`🔑 NEXUSCODE SIGNUP VERIFICATION CODE FOR ${email.toUpperCase()}:`);
    console.log(`👉 OTP CODE: ${generatedOtp}`);
    console.log("=======================================================\n");

    // Hash the password now so we don't have to do it in step 2 (saves response latency)
    const passwordHash = await bcrypt.hash(password, 10);

    // Sign registration details + generated OTP into temporary JWT token (expiring in 10 minutes)
    const registrationToken = jwt.sign(
      {
        name,
        email,
        passwordHash,
        otp: generatedOtp,
      },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    return NextResponse.json({
      message: "Verification code sent. Check server logs or copy below.",
      registrationToken,
      mockOtp: generatedOtp, // Development aid
    });
  } catch (e: any) {
    console.error("Signup OTP generation error:", e);
    return NextResponse.json({ error: "Internal server error during registration verification" }, { status: 500 });
  }
}
