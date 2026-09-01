import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";
import { parseProductFields } from "@/lib/admin-products";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!db) return NextResponse.json({ ok: false, message: "Database unavailable." }, { status: 503 });

  const { id } = await params;
  const [item] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!item) return NextResponse.json({ ok: false, message: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!db) return NextResponse.json({ ok: false, message: "Database unavailable." }, { status: 503 });

  const { id } = await params;
  const body = await req.json();
  const name = String(body?.name ?? "").trim();
  const categorySlug = String(body?.categorySlug ?? "").trim();
  if (!name || !categorySlug) {
    return NextResponse.json(
      { ok: false, message: "Name and category are required." },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(products)
    .set({
      name,
      categorySlug,
      ...parseProductFields(body),
    })
    .where(eq(products.id, id))
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
  const deleted = await db.delete(products).where(eq(products.id, id)).returning();
  if (!deleted.length) return NextResponse.json({ ok: false, message: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
