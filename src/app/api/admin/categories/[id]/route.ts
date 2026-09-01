import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

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
  if (!name) {
    return NextResponse.json({ ok: false, message: "Name is required." }, { status: 400 });
  }
  const slug = slugify(String(body?.slug ?? "").trim() || name);

  const [updated] = await db
    .update(categories)
    .set({
      name,
      slug,
      count: Number(body?.count ?? 0) || 0,
      image: body?.image ?? null,
      blurb: body?.blurb ?? null,
    })
    .where(eq(categories.id, id))
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
  try {
    const deleted = await db.delete(categories).where(eq(categories.id, id)).returning();
    if (!deleted.length) return NextResponse.json({ ok: false, message: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Can't delete a category that still has products assigned to it.",
      },
      { status: 409 }
    );
  }
}
