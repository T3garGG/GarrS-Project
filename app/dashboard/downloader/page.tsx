import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGuestConfig } from "@/lib/guest-config";

const DOWNLOADERS = [
  { href: "/dashboard/downloader/tiktok", title: "TikTok Downloader", description: "Unduh video TikTok tanpa watermark.", icon: "TT" },
  { href: "/dashboard/downloader/instagram", title: "Instagram Downloader", description: "Simpan reels, post, dan story.", icon: "IG" },
  { href: "/dashboard/downloader/youtube", title: "YouTube Downloader", description: "Unduh video atau audio dari YouTube.", icon: "YT" },
];

export default async function DownloaderHubPage() {
  const [session, config] = await Promise.all([
    getServerSession(authOptions),
    getGuestConfig(),
  ]);
  const isGuest = !session;
  const guestDownloadsOff = isGuest && config.guestDownloadLimit <= 0;

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Downloader hub</p>
          <h1>Tools Download.</h1>
          <p>Satu tempat untuk semua downloader. Pilih platform di bawah, tempel link, unduh.</p>
        </div>
        <div className="hero-actions">
          {isGuest
            ? <span className="badge">{guestDownloadsOff ? "Guest: download dinonaktifkan" : `Guest: ${config.guestDownloadLimit}x download/jam`}</span>
            : <span className="badge">Akses penuh</span>}
          {isGuest && <Link href="/login" className="btn">Masuk</Link>}
        </div>
      </section>

      {isGuest && guestDownloadsOff && (
        <div className="panel" style={{ padding: 16 }} role="alert">
          Guest download sedang dinonaktifkan admin. <Link href="/login">Login</Link> untuk pakai downloader.
        </div>
      )}
      {isGuest && !guestDownloadsOff && (
        <div className="panel" style={{ padding: 16 }}>
          Kamu masuk sebagai guest: maksimal <strong>{config.guestDownloadLimit} download per jam</strong>.{" "}
          <Link href="/login">Login</Link> untuk tanpa batas dan akses semua fitur.
        </div>
      )}

      <section>
        <div className="section-heading">
          <div><h2>Platform</h2><p>Downloader yang tersedia.</p></div>
          <span className="label-dim">{DOWNLOADERS.length} tersedia</span>
        </div>
        <div className="feature-grid">
          {DOWNLOADERS.map((d) => (
            <Link key={d.href} href={d.href} className="panel feature-card" aria-label={d.title} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="feature-icon">{d.icon}</div>
              <h3>{d.title}</h3>
              <p>{d.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel" style={{ padding: 22 }}>
        <p className="label-dim">Lainnya</p>
        <h2 style={{ margin: "8px 0" }}>Productivity tools gratis</h2>
        <p style={{ color: "var(--text-dim)", margin: "0 0 16px", lineHeight: 1.6 }}>
          QR generator, converter, hash, dan lainnya — semuanya jalan di browser.
        </p>
        <Link href="/dashboard/tools" className="btn-outline">Lihat productivity tools</Link>
      </section>
    </main>
  );
}
