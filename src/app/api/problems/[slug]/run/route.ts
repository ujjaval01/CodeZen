import { NextRequest, NextResponse } from "next/server";
import { executeCode } from "@/lib/compiler";

export async function POST(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const { slug } = params;
    const { language, code, input } = await req.json();

    if (!language || !code) {
      return NextResponse.json({ error: "Language and code are required fields" }, { status: 400 });
    }

    // Execute code
    const result = await executeCode(language, code, input || "");

    return NextResponse.json({ result });
  } catch (e) {
    console.error("Run code API error:", e);
    return NextResponse.json({ error: "Internal server error during code execution" }, { status: 500 });
  }
}
