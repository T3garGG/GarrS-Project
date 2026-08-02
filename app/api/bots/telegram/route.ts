import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// External bot process (Telegraf for Telegram, running on your own VPS)
// calls this endpoint with header "x-webhook-key" to:
// - mark itself connected / push events
// - send incoming messages, bot info, status updates
// Vercel serverless can't hold a persistent bot connection — the bot itself must run elsewhere
// and just talk to this API.
export async function POST(req: Request) {
  const key = req.headers.get("x-webhook-key");
  if (!key) return NextResponse.json({ error: "Missing webhook key." }, { status: 401 });

  const bot = await prisma.botConnection.findUnique({
    where: { webhookKey: key },
    include: { botEvents: true },
  });
  if (!bot) return NextResponse.json({ error: "Webhook key gak valid." }, { status: 403 });

  // mark as connected if not already
  if (!bot.connected) {
    await prisma.botConnection.update({ where: { id: bot.id }, data: { connected: true } });
  }

  const body = await req.json().catch(() => ({}));

  // Handle different event types from the bot process
  const { eventType, payload } = body;

  if (eventType && payload) {
    // Store the event in the database
    await prisma.botEvent.create({
      data: {
        botId: bot.id,
        eventType,
        payload: typeof payload === "string" ? payload : JSON.stringify(payload),
      },
    });

    // Handle specific events
    if (eventType === "bot_info" && typeof payload === "object") {
      await prisma.botConnection.update({
        where: { id: bot.id },
        data: { botInfo: JSON.stringify(payload) },
      });
    }

    // For Telegram, handle incoming webhook updates from Telegram itself
    if (body.update_id && body.message) {
      await prisma.botEvent.create({
        data: {
          botId: bot.id,
          eventType: "incoming_message",
          payload: JSON.stringify({
            from: body.message.from?.username || body.message.from?.id,
            content: body.message.text || "[media message]",
            messageId: body.message.message_id,
            timestamp: new Date(body.message.date * 1000).toISOString(),
          }),
        },
      });
    }

    return NextResponse.json({ ok: true, eventStored: true });
  }

  // Legacy: just acknowledge
  return NextResponse.json({ ok: true, received: body });
}
