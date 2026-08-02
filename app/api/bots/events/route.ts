import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}

// GET: fetch recent events for a specific bot type
// query: ?type=whatsapp or ?type=telegram
export async function GET(req: Request) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const url = new URL(req.url);
  const botType = url.searchParams.get("type");

  const whereClause: any = {};
  if (botType) {
    const bot = await prisma.botConnection.findFirst({ where: { type: botType } });
    if (!bot) return NextResponse.json([], { status: 200 });
    whereClause.botId = bot.id;
  }

  const events = await prisma.botEvent.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(events.reverse());
}

// POST: send a message from dashboard to the bot (bot process polls for these)
// body: { type: "whatsapp" | "telegram", content: "message text", to?: "recipient" }
export async function POST(req: Request) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const perms: string[] = (session.user as any).permissions || [];
  const role = (session.user as any).role;
  const isPrivileged = role === "OWNER" || role === "ADMIN";

  const { type, content, to } = await req.json();
  if (!type || !["whatsapp", "telegram"].includes(type)) {
    return NextResponse.json({ error: "Type wajib whatsapp atau telegram." }, { status: 400 });
  }
  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Isi pesan kosong." }, { status: 400 });
  }

  const featureMap: Record<string, string> = {
    whatsapp: "WHATSAPP_BOT",
    telegram: "TELEGRAM_BOT",
  };
  if (!isPrivileged && !perms.includes(featureMap[type])) {
    return NextResponse.json({ error: "Gak punya akses fitur ini." }, { status: 403 });
  }

  const bot = await prisma.botConnection.findFirst({ where: { type } });
  if (!bot) return NextResponse.json({ error: `Bot ${type} belum dibuat.` }, { status: 404 });

  // Store as outgoing_message — the external bot process polls GET for these
  const event = await prisma.botEvent.create({
    data: {
      botId: bot.id,
      eventType: "outgoing_message",
      payload: JSON.stringify({ content: content.trim(), to: to || null }),
    },
  });

  return NextResponse.json({ ok: true, eventId: event.id });
}

// DELETE: hapus event (clear from UI / consumed by bot)
export async function DELETE(req: Request) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const url = new URL(req.url);
  const eventId = url.searchParams.get("eventId");
  const botType = url.searchParams.get("type");

  if (eventId) {
    await prisma.botEvent.delete({ where: { id: eventId } });
    return NextResponse.json({ ok: true });
  }

  if (botType) {
    const bot = await prisma.botConnection.findFirst({ where: { type: botType } });
    if (bot) {
      await prisma.botEvent.deleteMany({
        where: { botId: bot.id, eventType: "outgoing_message" },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
