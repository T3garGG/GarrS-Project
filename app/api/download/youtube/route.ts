import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { callThirdPartyApi } from "@/lib/downloader";
import { getClientIp, rateLimitResponse, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const perms: string[] = (session.user as any).permissions || [];
  const role = (session.user as any).role;
  const isPrivileged = role === "OWNER" || role === "ADMIN";
  if (!isPrivileged && !perms.includes("YOUTUBE_DL")) {
    return NextResponse.json({ error: "Gak punya akses fitur ini." }, { status: 403 });
  }

  const requestLimit = rateLimit(`download:youtube:${getClientIp(req)}`, 10, 60_000);
  if (!requestLimit.allowed) return rateLimitResponse(requestLimit.retryAfter);

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Link kosong, ngapain lu submit." }, { status: 400 });
  }

  const result = await callThirdPartyApi("youtube", url);
  return NextResponse.json(result);
}
