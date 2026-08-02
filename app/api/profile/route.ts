import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const userId = (session.user as any).id;
  const { username, displayName, currentPassword, newPassword } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Akun gak ketemu." }, { status: 404 });

  // wajib verifikasi password lama sebelum ubah apapun, biar gak sembarangan
  if (!currentPassword) {
    return NextResponse.json({ error: "Masukin password sekarang buat verifikasi." }, { status: 400 });
  }
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return NextResponse.json({ error: "Password sekarang salah." }, { status: 403 });

  const data: any = {};

  if (displayName !== undefined && displayName !== null && displayName !== user.displayName) {
    data.displayName = displayName || null;
  }

  if (username && username !== user.username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return NextResponse.json({ error: "Username udah dipake orang lain." }, { status: 409 });
    data.username = username;
  }

  if (newPassword) {
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password baru minimal 8 karakter." }, { status: 400 });
    }
    data.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Gak ada yang diubah." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: { username: true, displayName: true },
  });
  return NextResponse.json(updated);
}
