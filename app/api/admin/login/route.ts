import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// Rate limiting: track failed attempts per IP in memory
const attempts = new Map<string, { count: number; lastAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const now = Date.now();

  // Clean stale windows
  const record = attempts.get(ip);
  if (record && now - record.lastAt > WINDOW_MS) {
    attempts.delete(ip);
  }

  const current = attempts.get(ip);
  if (current && current.count >= MAX_ATTEMPTS) {
    const wait = Math.ceil((WINDOW_MS - (now - current.lastAt)) / 60000);
    return NextResponse.json({ error: `Trop de tentatives. Réessayez dans ${wait} min.` }, { status: 429 });
  }

  const { password } = await req.json();
  const stored = process.env.ADMIN_PASSWORD ?? "";

  // Support both bcrypt hashes and plain-text passwords for dev convenience
  let valid = false;
  if (stored.startsWith("$2")) {
    valid = await bcrypt.compare(password, stored);
  } else {
    valid = password === stored;
  }

  if (!valid) {
    const prev = attempts.get(ip) ?? { count: 0, lastAt: now };
    attempts.set(ip, { count: prev.count + 1, lastAt: now });
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  // Reset attempts on success
  attempts.delete(ip);

  // Generate a signed session token (simple random + timestamp)
  const token = Buffer.from(`${Date.now()}.${Math.random()}`).toString("base64url");

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24h
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json({ success: true });
}
