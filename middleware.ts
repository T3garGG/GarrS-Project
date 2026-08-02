import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const FEATURE_BY_PATH: Record<string, string> = {
  "/dashboard/downloader/tiktok": "TIKTOK_DL",
  "/dashboard/downloader/instagram": "INSTAGRAM_DL",
  "/dashboard/downloader/youtube": "YOUTUBE_DL",
  "/dashboard/chat": "PUBLIC_CHAT",
  "/admin": "ADMIN_PANEL",
};

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const token = (req as any).nextauth?.token;
    const requiredFeature = Object.entries(FEATURE_BY_PATH).find(([p]) =>
      path.startsWith(p)
    )?.[1];

    if (requiredFeature) {
      const perms: string[] = token?.permissions || [];
      const isOwnerOrAdmin = token?.role === "OWNER" || token?.role === "ADMIN";
      if (!isOwnerOrAdmin && !perms.includes(requiredFeature)) {
        return NextResponse.redirect(new URL("/dashboard?denied=1", req.url));
      }
    }
    return NextResponse.next();
  },
  { pages: { signIn: "/login" } }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
