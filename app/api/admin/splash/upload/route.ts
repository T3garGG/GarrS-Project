import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

// Requires Vercel Blob storage enabled on the project (auto-provides BLOB_READ_WRITE_TOKEN).
// Vercel dashboard > Storage > Create Database > Blob.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== "OWNER" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Gak ada file yang diupload." }, { status: 400 });
  if (!file.type.startsWith("video/")) {
    return NextResponse.json({ error: "Harus file video (.mp4, .webm, dst)." }, { status: 400 });
  }
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "File kegedean, maksimal 50MB." }, { status: 400 });
  }

  let blob;
  try {
    blob = await put(`splash/${Date.now()}-${file.name}`, file, { access: "public" });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Upload gagal — Vercel Blob storage belum diaktifin di project ini. Lihat README." },
      { status: 500 }
    );
  }

  const updated = await prisma.appSettings.upsert({
    where: { id: "singleton" },
    update: { splashVideoUrl: blob.url },
    create: { id: "singleton", splashVideoUrl: blob.url },
  });
  return NextResponse.json(updated);
}
