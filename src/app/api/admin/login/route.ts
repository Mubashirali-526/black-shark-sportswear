import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { ADMIN_SESSION_COOKIE, createSessionToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!db) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured in this environment." },
      { status: 503 }
    );
  }

  let email = "";
  let password = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Email and password are required." },
      { status: 400 }
    );
  }

  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return NextResponse.json(
      { ok: false, message: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = await createSessionToken({ id: admin.id, email: admin.email });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
