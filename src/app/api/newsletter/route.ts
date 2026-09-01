import { NextRequest } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  if (!db) {
    return Response.json(
      { ok: false, message: "Newsletter signup is unavailable right now." },
      { status: 503 }
    );
  }

  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return Response.json(
      { ok: false, message: "Enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    await db.insert(newsletterSubscribers).values({ email }).onConflictDoNothing();
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
