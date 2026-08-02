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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin, ngapain kesini." }, { status: 403 });

  const { role, features } = await req.json();
  const target = await prisma.user.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "Akun gak ketemu." }, { status: 404 });

  if (target.role === "OWNER" && (session.user as any).role !== "OWNER") {
    return NextResponse.json({ error: "Cuma OWNER yang boleh ubah akun OWNER lain." }, { status: 403 });
  }

  // replace semua permission dengan yang baru dikirim
  await prisma.permission.deleteMany({ where: { userId: target.id } });
  await prisma.user.update({
    where: { id: target.id },
    data: {
      role: role === "ADMIN" || role === "OWNER" ? role : "MEMBER",
      permissions: { create: (features || []).map((f: string) => ({ feature: f })) },
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });

  if ((session.user as any).id === params.id) {
    return NextResponse.json({ error: "Gak bisa hapus akun sendiri." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "Akun gak ketemu." }, { status: 404 });
  if (target.role === "OWNER") {
    return NextResponse.json({ error: "Gak bisa hapus akun OWNER." }, { status: 403 });
  }

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
