import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (ext !== ".pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Always save as cv.pdf in the public root for direct /cv.pdf access
    const publicPath = path.join(process.cwd(), "public", "cv.pdf");
    fs.writeFileSync(publicPath, buffer);

    // Also save a timestamped copy in uploads for the media library
    const timestampedName = `${Date.now()}-cv.pdf`;
    fs.writeFileSync(path.join(uploadsDir, timestampedName), buffer);

    return NextResponse.json({ url: "/cv.pdf" });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
