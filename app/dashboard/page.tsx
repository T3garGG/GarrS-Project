import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const TILES = [
  { key: "TIKTOK_DL", title: "TikTok Downloader", href: "/dashboard/downloader/tiktok", desc: "Unduh video TikTok tanpa watermark" },
  { key: "INSTAGRAM_DL", title: "Instagram Downloader", href: "/dashboard/downloader/instagram", desc: "Unduh reels, post, story" },
  { key: "YOUTUBE_DL", title: "YouTube Downloader", href: "/dashboard/downloader/youtube", desc: "Unduh video/audio YouTube" },
  { key: "PUBLIC_CHAT", title: "Public Chat", href: "/dashboard/chat", desc: "Obrolan bareng semua pengguna" },
  { key: "ADMIN_PANEL", title: "Admin Panel", href: "/admin", desc: "Kelola akun, role, splash, bot" },
];

export default async function DashboardPage({ searchParams }: { searchParams: { denied?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = (session.user as any).role;
  const perms: string[] = (session.user as any).permissions || [];
  const isPrivileged = role === "OWNER" || role === "ADMIN";
  const visibleTiles = TILES.filter((t) => isPrivileged || perms.includes(t.key));

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <p className="label-dim mono">DASHBOARD</p>
          <h1 style={{ margin: 0 }}>Halo, {session.user?.name} <span className="badge">{role}</span></h1>
        </div>
        <ThemeToggle />
      </div>

      {searchParams?.denied && (
        <p className="panel" style={{ padding: 12, color: "var(--danger)", marginBottom: 20 }}>
          Akun lu gak punya akses ke fitur itu. Minta admin kasih permission dulu.
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {visibleTiles.length === 0 && (
          <p className="label-dim">Belum ada fitur yang di-assign ke akun lu. Hubungi admin.</p>
        )}
        {visibleTiles.map((t) => (
          <Link key={t.key} href={t.href} className="panel" style={{ padding: 20, textDecoration: "none", color: "var(--text)" }}>
            <p style={{ fontWeight: 600, margin: "0 0 6px" }}>{t.title}</p>
            <p className="label-dim" style={{ margin: 0, textTransform: "none", letterSpacing: 0 }}>{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
