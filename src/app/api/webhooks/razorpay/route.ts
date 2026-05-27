import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || "YOUR_TEST_KEY_SECRET";

    // Create the expected signature
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // Payment is successful and verified
      
      // Update the user to Premium
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
          // Store the payment ID for future reference
          razorpaySubscriptionId: razorpay_payment_id, 
        }
      });

      return NextResponse.json({ success: true, message: "Payment verified successfully, Premium activated!" });
    } else {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
