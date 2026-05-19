import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Validate JSON structure (basic check)
    if (!body.meta || !body.hero || !body.projects) {
      return NextResponse.json({ error: "Invalid portfolio structure" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "data", "portfolio.json");
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to write portfolio data" }, { status: 500 });
  }
}
