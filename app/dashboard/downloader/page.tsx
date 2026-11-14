import Link from "next/link";

const DOWNLOADERS = [
  { href: "/dashboard/downloader/tiktok", title: "TikTok Downloader", description: "Unduh video TikTok tanpa watermark.", icon: "TT" },
  { href: "/dashboard/downloader/instagram", title: "Instagram Downloader", description: "Simpan reels, post, dan story.", icon: "IG" },
  { href: "/dashboard/downloader/youtube", title: "YouTube Downloader", description: "Unduh video atau audio dari YouTube.", icon: "YT" },
];

export default function DownloaderHubPage() {
  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Downloader hub</p>
          <h1>Tools Download.</h1>
          <p>Satu tempat untuk semua downloader. Pilih platform di bawah, tempel link, unduh.</p>
        </div>
        <div className="hero-actions">
          <span className="badge">Butuh login &amp; permission</span>
        </div>
      </section>

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
        <p className="label-dim">Catatan</p>
        <h2 style={{ margin: "8px 0" }}>Akses fitur downloader</h2>
        <p style={{ color: "var(--text-dim)", margin: "0 0 16px", lineHeight: 1.6 }}>
          Downloader memakai API pihak ketiga dan permission khusus. Kalau salah satu platform tidak terbuka, minta admin memberi permission di admin panel.
        </p>
        <Link href="/dashboard/tools" className="btn-outline">Lihat productivity tools</Link>
      </section>
    </main>
  );
}
