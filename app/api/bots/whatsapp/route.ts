import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// External bot process (baileys for WA, Telegraf for Telegram, running on your own VPS)
// calls this endpoint with header "x-webhook-key" to mark itself connected / push events.
// Vercel serverless can't hold a persistent bot connection — the bot itself must run elsewhere
// and just talk to this API.
export async function POST(req: Request) {
  const key = req.headers.get("x-webhook-key");
  if (!key) return NextResponse.json({ error: "Missing webhook key." }, { status: 401 });

  const bot = await prisma.botConnection.findUnique({ where: { webhookKey: key } });
  if (!bot) return NextResponse.json({ error: "Webhook key gak valid." }, { status: 403 });

  await prisma.botConnection.update({ where: { id: bot.id }, data: { connected: true } });

  const body = await req.json().catch(() => ({}));
  // TODO: route body.event (e.g. incoming message) to wherever it needs to go —
  // e.g. insert into ChatMessage, or trigger a download job.

  return NextResponse.json({ ok: true, received: body });
}
