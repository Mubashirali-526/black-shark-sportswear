import { NextRequest, NextResponse } from "next/server";
import { and, eq, isNotNull, ne } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";
import { categorySubcategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!db) return NextResponse.json({ ok: false, message: "Database unavailable." }, { status: 503 });

  const categorySlug = req.nextUrl.searchParams.get("categorySlug")?.trim();
  if (!categorySlug) {
    return NextResponse.json({ ok: false, message: "categorySlug is required." }, { status: 400 });
  }

  const rows = await db
    .selectDistinct({ subCategory: products.subCategory })
    .from(products)
    .where(
      and(
        eq(products.categorySlug, categorySlug),
        isNotNull(products.subCategory),
        ne(products.subCategory, "")
      )
    )
    .orderBy(products.subCategory);

  const dbSubs = rows.map((r) => r.subCategory).filter((v): v is string => Boolean(v));
  const staticSubs = categorySubcategories[categorySlug] ?? [];
  const items = [...new Set([...dbSubs, ...staticSubs])].sort();

  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!db) return NextResponse.json({ ok: false, message: "Database unavailable." }, { status: 503 });

  const body = await req.json();
  const categorySlug = String(body?.categorySlug ?? "").trim();
  const oldName = String(body?.oldName ?? "").trim();
  const newName = String(body?.newName ?? "").trim();

  if (!categorySlug || !oldName || !newName) {
    return NextResponse.json(
      { ok: false, message: "categorySlug, oldName and newName are required." },
      { status: 400 }
    );
  }

  const updated = await db
    .update(products)
    .set({ subCategory: newName })
    .where(and(eq(products.categorySlug, categorySlug), eq(products.subCategory, oldName)))
    .returning({ id: products.id });

  return NextResponse.json({ ok: true, updated: updated.length });
}
