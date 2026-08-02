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

// get current splash video URL
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });

  const settings = await prisma.appSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json(settings);
}

// set splash video via a URL (external link)
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });

  const { splashVideoUrl } = await req.json();
  if (!splashVideoUrl) return NextResponse.json({ error: "URL video kosong." }, { status: 400 });

  const updated = await prisma.appSettings.upsert({
    where: { id: "singleton" },
    update: { splashVideoUrl },
    create: { id: "singleton", splashVideoUrl },
  });
  return NextResponse.json(updated);
}
