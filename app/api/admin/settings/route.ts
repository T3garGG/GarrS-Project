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

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });
  const settings = await prisma.appSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json({ guestMode: settings?.guestMode ?? true, guestToolLimit: settings?.guestToolLimit ?? 10 });
}

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });

  const { guestMode, guestToolLimit } = await req.json();
  if (guestToolLimit !== undefined && (!Number.isInteger(guestToolLimit) || guestToolLimit < 1 || guestToolLimit > 1000)) {
    return NextResponse.json({ error: "Limit harus angka 1-1000." }, { status: 400 });
  }

  await prisma.appSettings.upsert({
    where: { id: "singleton" },
    update: {
      ...(guestMode !== undefined && { guestMode: Boolean(guestMode) }),
      ...(guestToolLimit !== undefined && { guestToolLimit }),
    },
    create: { id: "singleton" },
  });

  return NextResponse.json({ ok: true });
}
