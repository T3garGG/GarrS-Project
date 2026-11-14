import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const TILES = [
  { key: "TOOLS", title: "Productivity Tools", href: "/dashboard/tools", desc: "12 tools gratis: QR, converter, hash, dan lainnya.", icon: "✦" },
  { key: "TIKTOK_DL", title: "TikTok Downloader", href: "/dashboard/downloader/tiktok", desc: "Unduh video tanpa watermark.", icon: "TT" },
  { key: "INSTAGRAM_DL", title: "Instagram Downloader", href: "/dashboard/downloader/instagram", desc: "Simpan reels, post, dan story.", icon: "IG" },
  { key: "YOUTUBE_DL", title: "YouTube Downloader", href: "/dashboard/downloader/youtube", desc: "Unduh video atau audio.", icon: "YT" },
  { key: "PUBLIC_CHAT", title: "Public Chat", href: "/dashboard/chat", desc: "Ngobrol bareng pengguna lain.", icon: "••" },
  { key: "ADMIN_PANEL", title: "Admin Panel", href: "/admin", desc: "Kelola user, bot, dan settings.", icon: "◆" },
];

export default async function DashboardPage({ searchParams }: { searchParams: { denied?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = (session.user as any).role;
  const perms: string[] = (session.user as any).permissions || [];
  const isPrivileged = role === "OWNER" || role === "ADMIN";
  const visibleTiles = TILES.filter((tile) => tile.key === "TOOLS" || isPrivileged || perms.includes(tile.key));
  const username = session.user?.name || "there";

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Workspace pribadi</p>
          <h1>Halo, {username}.</h1>
          <p>Satu ruang buat semua tools yang sering kamu pakai. Pilih fitur, tempel link, selesai.</p>
        </div>
        <div className="hero-actions">
          <span className="badge">{role} access</span>
          <Link href="/dashboard/profile" className="btn-outline">Pengaturan profil</Link>
        </div>
      </section>

      {searchParams?.denied && (
        <div className="panel" style={{ padding: 16, color: "var(--danger)" }} role="alert">
          Akun kamu belum punya akses ke fitur itu. Minta admin memberi permission.
        </div>
      )}

      <section>
        <div className="stats-grid">
          <div className="panel stat-card"><p className="label-dim">Tools aktif</p><div className="stat-value">{visibleTiles.length}</div><div className="stat-note">Siap dipakai sekarang</div></div>
          <div className="panel stat-card"><p className="label-dim">Role</p><div className="stat-value">{role}</div><div className="stat-note">Akses akun kamu</div></div>
          <div className="panel stat-card"><p className="label-dim">Mode</p><div className="stat-value">Live</div><div className="stat-note">Terhubung ke workspace</div></div>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div><h2>Semua tools</h2><p>Pilih workflow yang mau kamu jalankan.</p></div>
          <span className="label-dim">{visibleTiles.length} tersedia</span>
        </div>
        <div className="feature-grid">
          {visibleTiles.length === 0 && <p className="label-dim">Belum ada fitur yang di-assign. Hubungi admin.</p>}
          {visibleTiles.map((tile) => (
            <Link key={tile.key} href={tile.href} className="panel feature-card">
              <div className="feature-icon">{tile.icon}</div>
              <h3>{tile.title}</h3>
              <p>{tile.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
