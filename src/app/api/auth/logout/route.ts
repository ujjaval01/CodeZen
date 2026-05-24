import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      expires: new Date(0),
      path: "/",
    });
    return NextResponse.json({ message: "Logged out successfully" });
  } catch (e) {
    console.error("Logout API error:", e);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
