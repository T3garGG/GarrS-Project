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

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin, ngapain kesini." }, { status: 403 });

  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true, createdAt: true, permissions: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin, ngapain kesini." }, { status: 403 });

  const { username, displayName, password, role, features } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Username/password wajib diisi." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password minimal 8 karakter, jangan males." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return NextResponse.json({ error: "Username udah dipake." }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      displayName: displayName || null,
      passwordHash,
      role: role === "ADMIN" ? "ADMIN" : "MEMBER",
      createdById: (session.user as any).id,
      permissions: {
        create: (features || []).map((f: string) => ({ feature: f })),
      },
    },
  });
  return NextResponse.json({ id: user.id, username: user.username });
}
