import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!db) return NextResponse.json({ ok: false, message: "Database unavailable." }, { status: 503 });

  const body = await req.json();
  const categorySlug = String(body?.categorySlug ?? "").trim();
  const name = String(body?.name ?? "").trim();

  if (!categorySlug || !name) {
    return NextResponse.json(
      { ok: false, message: "categorySlug and name are required." },
      { status: 400 }
    );
  }

  const updated = await db
    .update(products)
    .set({ subCategory: null })
    .where(and(eq(products.categorySlug, categorySlug), eq(products.subCategory, name)))
    .returning({ id: products.id });

  return NextResponse.json({ ok: true, updated: updated.length });
}
