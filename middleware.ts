import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Rate limit halaman untuk guest (in-memory, per instance serverless).
const pageHits = new Map<string, { count: number; resetAt: number }>();
const GUEST_PAGE_LIMIT = 60;
const GUEST_PAGE_WINDOW = 60 * 60 * 1000; // 1 jam

function guestPageRateLimit(ip: string) {
  const now = Date.now();
  const current = pageHits.get(ip);
  if (!current || current.resetAt <= now) {
    pageHits.set(ip, { count: 1, resetAt: now + GUEST_PAGE_WINDOW });
    if (pageHits.size > 10_000) {
      for (const [k, v] of pageHits) if (v.resetAt <= now) pageHits.delete(k);
    }
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  return { allowed: current.count <= GUEST_PAGE_LIMIT, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
}

const FEATURE_BY_PATH: Record<string, string> = {
  "/dashboard/downloader/tiktok": "TIKTOK_DL",
  "/dashboard/downloader/instagram": "INSTAGRAM_DL",
  "/dashboard/downloader/youtube": "YOUTUBE_DL",
  "/dashboard/chat": "PUBLIC_CHAT",
  "/admin": "ADMIN_PANEL",
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Public productivity hub. Individual tools can apply their own guest limits.
  if (path === "/dashboard/tools" || path.startsWith("/dashboard/tools/")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
      const check = guestPageRateLimit(`tools:${ip}`);
      if (!check.allowed) {
        return new NextResponse("Terlalu banyak request. Coba lagi nanti atau login.", {
          status: 429,
          headers: { "Retry-After": String(check.retryAfter) },
        });
      }
    }
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const requiredFeature = Object.entries(FEATURE_BY_PATH).find(([prefix]) => path.startsWith(prefix))?.[1];
  if (requiredFeature) {
    const permissions: string[] = (token.permissions as string[]) || [];
    const isPrivileged = token.role === "OWNER" || token.role === "ADMIN";
    if (!isPrivileged && !permissions.includes(requiredFeature)) {
      return NextResponse.redirect(new URL("/dashboard?denied=1", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
