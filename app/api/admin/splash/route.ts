import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== "OWNER" && role !== "ADMIN")) return null;
  return session;
}

// get current settings (splash + downloader API config)
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });

  const settings = await prisma.appSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json(settings);
}

// update splash video URL via a URL (external link)
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });

  const { splashVideoUrl } = await req.json();
  if (splashVideoUrl !== undefined && !splashVideoUrl) {
    return NextResponse.json({ error: "URL video kosong." }, { status: 400 });
  }

  const updated = await prisma.appSettings.upsert({
    where: { id: "singleton" },
    update: { ...(splashVideoUrl !== undefined && { splashVideoUrl }) },
    create: { id: "singleton", splashVideoUrl: splashVideoUrl || "/splash-default.mp4" },
  });
  return NextResponse.json(updated);
}

// update downloader API config (third-party endpoints)
export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });

  const { tiktokApiUrl, instagramApiUrl, youtubeApiUrl } = await req.json();

  const updated = await prisma.appSettings.upsert({
    where: { id: "singleton" },
    update: { tiktokApiUrl, instagramApiUrl, youtubeApiUrl },
    create: {
      id: "singleton",
      tiktokApiUrl,
      instagramApiUrl,
      youtubeApiUrl,
    },
  });
  return NextResponse.json(updated);
}
