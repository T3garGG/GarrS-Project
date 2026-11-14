import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { callThirdPartyApi } from "@/lib/downloader";
import { getClientIp, rateLimitResponse, rateLimit } from "@/lib/rate-limit";
import { getGuestConfig } from "@/lib/guest-config";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const config = await getGuestConfig();

  if (session) {
    const perms: string[] = (session.user as any).permissions || [];
    const role = (session.user as any).role;
    const isPrivileged = role === "OWNER" || role === "ADMIN";
    if (!isPrivileged && !perms.includes("YOUTUBE_DL")) {
      return NextResponse.json({ error: "Gak punya akses fitur ini." }, { status: 403 });
    }
  } else {
    if (config.guestDownloadLimit <= 0) {
      return NextResponse.json({ error: "Login dulu buat pakai downloader ini." }, { status: 401 });
    }
    const guestLimit = rateLimit(`guest-dl:${getClientIp(req)}`, config.guestDownloadLimit, 60 * 60 * 1000);
    if (!guestLimit.allowed) return rateLimitResponse(guestLimit.retryAfter);
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
