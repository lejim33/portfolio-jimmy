import { NextRequest, NextResponse } from "next/server"; // NextRequest still used in POST/DELETE
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "portfolio.json");
const HISTORY_DIR = path.join(process.cwd(), "data", "history");
const MAX_VERSIONS = 20;

function ensureHistoryDir() {
  if (!fs.existsSync(HISTORY_DIR)) fs.mkdirSync(HISTORY_DIR, { recursive: true });
}

function listVersions() {
  ensureHistoryDir();
  return fs
    .readdirSync(HISTORY_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .reverse()
    .map((f) => {
      const ts = parseInt(f.replace(".json", ""), 10);
      return {
        filename: f,
        timestamp: ts,
        date: new Date(ts).toISOString(),
        label: new Date(ts).toLocaleString("fr-FR"),
      };
    });
}

// GET — list versions
export async function GET() {
  return NextResponse.json({ versions: listVersions() });
}

// POST — create snapshot of current state
export async function POST(req: NextRequest) {
  ensureHistoryDir();

  const current = fs.readFileSync(DATA_FILE, "utf-8");
  const ts = Date.now();
  fs.writeFileSync(path.join(HISTORY_DIR, `${ts}.json`), current);

  // Prune old versions
  const versions = listVersions();
  if (versions.length > MAX_VERSIONS) {
    versions.slice(MAX_VERSIONS).forEach((v) => {
      fs.unlinkSync(path.join(HISTORY_DIR, v.filename));
    });
  }

  return NextResponse.json({ ok: true, timestamp: ts });
}

// DELETE — restore a version
export async function DELETE(req: NextRequest) {
  const { filename } = await req.json();
  if (!filename || !/^\d+\.json$/.test(filename)) {
    return NextResponse.json({ error: "Nom de fichier invalide" }, { status: 400 });
  }

  const versionPath = path.join(HISTORY_DIR, filename);
  if (!fs.existsSync(versionPath)) {
    return NextResponse.json({ error: "Version introuvable" }, { status: 404 });
  }

  // Save current state before restoring
  const current = fs.readFileSync(DATA_FILE, "utf-8");
  fs.writeFileSync(path.join(HISTORY_DIR, `${Date.now()}.json`), current);

  // Restore
  const restored = fs.readFileSync(versionPath, "utf-8");
  fs.writeFileSync(DATA_FILE, restored);

  return NextResponse.json({ ok: true });
}
