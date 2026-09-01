import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { quoteRequests } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  if (!db) return NextResponse.json({ ok: false, message: "Database unavailable." }, { status: 503 });

  const status = req.nextUrl.searchParams.get("status")?.trim();
  const items = await db
    .select()
    .from(quoteRequests)
    .where(status ? eq(quoteRequests.status, status) : undefined)
    .orderBy(desc(quoteRequests.createdAt));

  return NextResponse.json({ ok: true, items });
}
