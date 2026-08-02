import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== "OWNER" && role !== "ADMIN")) return null;
  return session;
}

// GET single user + permissions (for edit form prefill)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, username: true, displayName: true, role: true, permissions: true },
  });
  if (!user) return NextResponse.json({ error: "User gak ketemu." }, { status: 404 });
  return NextResponse.json(user);
}

// PATCH: update role, permissions, displayName, password
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });

  const body = await req.json();
  const { role, features, password, displayName } = body;

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) return NextResponse.json({ error: "User gak ketemu." }, { status: 404 });

  const data: any = {};

  if (displayName !== undefined && displayName !== null && displayName !== "") {
    data.displayName = displayName;
  }

  if (role === "ADMIN" || role === "MEMBER") {
    data.role = role;
  }

  if (Array.isArray(features)) {
    // sync permissions
    await prisma.permission.deleteMany({ where: { userId: params.id } });
    await prisma.permission.createMany({
      data: features.map((f: string) => ({ userId: params.id, feature: f as any })),
    });
  }

  if (password) {
    if (password.length < 8) {
      return NextResponse.json({ error: "Password minimal 8 karakter." }, { status: 400 });
    }
    data.passwordHash = await bcrypt.hash(password, 10);
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, username: true, displayName: true, role: true, permissions: true },
  });

  return NextResponse.json(updated);
}

// DELETE: hapus akun
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });

  const requesterId = (session.user as any).id;
  if (params.id === requesterId) {
    return NextResponse.json({ error: "Gak boleh hapus akun sendiri." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "User gak ketemu." }, { status: 404 });

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
