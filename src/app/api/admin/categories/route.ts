import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!db) return NextResponse.json({ ok: false, message: "Database unavailable." }, { status: 503 });

  const items = await db.select().from(categories).orderBy(categories.name);
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!db) return NextResponse.json({ ok: false, message: "Database unavailable." }, { status: 503 });

  const body = await req.json();
  const name = String(body?.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ ok: false, message: "Name is required." }, { status: 400 });
  }

  let slug = String(body?.slug ?? "").trim() || slugify(name);
  slug = slugify(slug);
  const [existing] = await db
    .select({ slug: categories.slug })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  if (existing) {
    return NextResponse.json(
      { ok: false, message: `Slug "${slug}" is already in use.` },
      { status: 409 }
    );
  }

  const [created] = await db
    .insert(categories)
    .values({
      slug,
      name,
      count: Number(body?.count ?? 0) || 0,
      image: body?.image ?? null,
      blurb: body?.blurb ?? null,
    })
    .returning();

  return NextResponse.json({ ok: true, item: created }, { status: 201 });
}
