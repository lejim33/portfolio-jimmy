import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "analytics.json");

function readAnalytics(): Record<string, number> {
  try {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeAnalytics(data: Record<string, number>) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = readAnalytics();
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const projectViews = Object.entries(data).filter(([k]) => k.startsWith("/projects"));
  const sorted = Object.entries(data).sort(([, a], [, b]) => b - a);

  return NextResponse.json({
    total,
    pages: sorted,
    projectCount: projectViews.length,
    data,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { page } = await req.json();
    if (!page || typeof page !== "string") return NextResponse.json({ ok: false });

    const analytics = readAnalytics();
    analytics[page] = (analytics[page] ?? 0) + 1;
    writeAnalytics(analytics);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
