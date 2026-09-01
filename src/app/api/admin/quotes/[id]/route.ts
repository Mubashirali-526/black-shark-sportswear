import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { quoteRequests } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["new", "viewed", "replied"];

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!db) return NextResponse.json({ ok: false, message: "Database unavailable." }, { status: 503 });

  const { id } = await params;
  const body = await req.json();
  const status = String(body?.status ?? "").trim();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ ok: false, message: "Invalid status." }, { status: 400 });
  }

  const [updated] = await db
    .update(quoteRequests)
    .set({ status })
    .where(eq(quoteRequests.id, id))
    .returning();

  if (!updated) return NextResponse.json({ ok: false, message: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, item: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!db) return NextResponse.json({ ok: false, message: "Database unavailable." }, { status: 503 });

  const { id } = await params;
  const deleted = await db.delete(quoteRequests).where(eq(quoteRequests.id, id)).returning();
  if (!deleted.length) return NextResponse.json({ ok: false, message: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
