import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";
import { parseProductFields } from "@/lib/admin-products";
import { nextProductId } from "@/lib/product-id";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!db) return NextResponse.json({ ok: false, message: "Database unavailable." }, { status: 503 });

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = 10;

  const conditions = [];
  if (search) conditions.push(ilike(products.name, `%${search}%`));
  if (category) conditions.push(eq(products.categorySlug, category));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, [{ count }]] = await Promise.all([
    db
      .select()
      .from(products)
      .where(where)
      .orderBy(desc(products.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ count: sql<number>`count(*)::int` }).from(products).where(where),
  ]);

  return NextResponse.json({ ok: true, items, total: count, page, pageSize });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!db) return NextResponse.json({ ok: false, message: "Database unavailable." }, { status: 503 });

  const body = await req.json();
  const name = String(body?.name ?? "").trim();
  const categorySlug = String(body?.categorySlug ?? "").trim();
  if (!name || !categorySlug) {
    return NextResponse.json(
      { ok: false, message: "Name and category are required." },
      { status: 400 }
    );
  }

  let slug = slugify(name);
  const [existing] = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const categoryIdRows = await db
    .select({ productId: products.productId })
    .from(products)
    .where(eq(products.categorySlug, categorySlug));
  const productId = nextProductId(
    categorySlug,
    categoryIdRows.map((r) => r.productId).filter((id): id is string => id !== null)
  );

  const [created] = await db
    .insert(products)
    .values({
      slug,
      productId,
      name,
      categorySlug,
      ...parseProductFields(body),
    })
    .returning();

  return NextResponse.json({ ok: true, item: created }, { status: 201 });
}
