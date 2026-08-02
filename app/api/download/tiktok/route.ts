import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// STUB: sambungkan ke extractor beneran di sini.
// TikTok/IG: lib kayak "btch-downloader" atau API pihak ketiga.
// YouTube: yt-dlp lewat child_process, atau ytdl-core.
// Taruh output-nya (link file / stream) sebagai downloadUrl.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const perms: string[] = (session.user as any).permissions || [];
  const role = (session.user as any).role;
  const isPrivileged = role === "OWNER" || role === "ADMIN";
  if (!isPrivileged && !perms.includes("TIKTOK_DL")) {
    return NextResponse.json({ error: "Gak punya akses fitur ini." }, { status: 403 });
  }

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Link kosong, ngapain lu submit." }, { status: 400 });
  }

  // ganti bagian ini dengan pemanggilan extractor asli
  return NextResponse.json({
    downloadUrl: null,
    error: "Extractor tiktok belum dipasang — ini masih stub API. Sambungkan ke lib/service pilihan lu di route.ts.",
  }, { status: 501 });
}
