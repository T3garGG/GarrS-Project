import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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
