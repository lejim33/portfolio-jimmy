import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) return NextResponse.json({ files: [] });

    const files = fs.readdirSync(UPLOADS_DIR)
      .filter((f) => /\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i.test(f))
      .map((filename) => {
        const stats = fs.statSync(path.join(UPLOADS_DIR, filename));
        const ext = path.extname(filename).toLowerCase();
        return {
          filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          createdAt: stats.birthtimeMs || stats.ctimeMs,
          isPdf: ext === ".pdf",
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [] });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { filename } = await req.json();
    if (!filename || typeof filename !== "string" || filename.includes("..")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
