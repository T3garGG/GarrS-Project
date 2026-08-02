import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== "OWNER" && role !== "ADMIN")) return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });
  const bots = await prisma.botConnection.findMany();
  return NextResponse.json(bots);
}

// generates a webhook URL + secret key that your external WA (baileys) / Telegram (Telegraf) bot
// process calls to push events in (e.g. POST /api/bots/whatsapp with this key in header)
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Lu bukan admin." }, { status: 403 });

  const { type, label } = await req.json();
  if (!["whatsapp", "telegram"].includes(type)) {
    return NextResponse.json({ error: "Tipe bot cuma whatsapp/telegram." }, { status: 400 });
  }

  const bot = await prisma.botConnection.create({
    data: { type, label: label || type, webhookKey: crypto.randomBytes(24).toString("hex") },
  });
  return NextResponse.json(bot);
}
