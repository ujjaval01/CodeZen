import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "codehub_jwt_secret_cyber_security_key";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const userId = decoded.userId;

    // 2. Initialize Razorpay
    // The user will set these in their .env, but we provide fallbacks just in case it's missed to avoid immediate 500s during dev
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "YOUR_TEST_KEY_ID",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "YOUR_TEST_KEY_SECRET",
    });

    // 3. Create an Order
    // Let's set a hardcoded premium price for now: 499 INR = 49900 paise
    const options = {
      amount: 49900, 
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: userId,
        type: "PREMIUM_UPGRADE"
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: any) {
    console.error("Razorpay Order Creation Error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
