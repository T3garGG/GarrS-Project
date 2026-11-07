import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const requestLimit = rateLimit(`chat:get:${getClientIp(req)}`, 30, 60_000);
  if (!requestLimit.allowed) return rateLimitResponse(requestLimit.retryAfter);

  const messages = await prisma.chatMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { username: true } } },
  });
  return NextResponse.json(messages.reverse());
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const requestLimit = rateLimit(`chat:post:${getClientIp(req)}`, 20, 60_000);
  if (!requestLimit.allowed) return rateLimitResponse(requestLimit.retryAfter);

  const perms: string[] = (session.user as any).permissions || [];
  const role = (session.user as any).role;
  const isPrivileged = role === "OWNER" || role === "ADMIN";
  if (!isPrivileged && !perms.includes("PUBLIC_CHAT")) {
    return NextResponse.json({ error: "Gak punya akses chat." }, { status: 403 });
  }

  const { content } = await req.json();
  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Pesan kosong ya gak dikirim." }, { status: 400 });
  }

  const msg = await prisma.chatMessage.create({
    data: { content: content.trim().slice(0, 1000), userId: (session.user as any).id },
  });
  return NextResponse.json(msg);
}
