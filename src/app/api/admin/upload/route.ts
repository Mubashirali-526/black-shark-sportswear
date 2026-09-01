import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const SAFE_FOLDER = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/;

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "No file provided." }, { status: 400 });
  }
  if (!folder || !SAFE_FOLDER.test(folder)) {
    return NextResponse.json({ ok: false, message: "Invalid folder." }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { ok: false, message: "Only PNG, JPEG, or WebP images are allowed." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { ok: false, message: "File exceeds the 10MB limit." },
      { status: 400 }
    );
  }

  const filename = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", folder);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return NextResponse.json({ ok: true, url: `/${folder}/${filename}` });
}
