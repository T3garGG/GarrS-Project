import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== "OWNER" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });
  }

  const { splashVideoUrl } = await req.json();
  if (!splashVideoUrl) return NextResponse.json({ error: "URL video kosong." }, { status: 400 });

  const updated = await prisma.appSettings.upsert({
    where: { id: "singleton" },
    update: { splashVideoUrl },
    create: { id: "singleton", splashVideoUrl },
  });
  return NextResponse.json(updated);
}
