import Link from "next/link";

const TOOLS = [
  { href: "/dashboard/tools/qr", title: "QR Generator", description: "Buat QR dari URL atau teks, download PNG.", icon: "QR", limit: "10x/jam untuk guest" },
  { href: "/dashboard/tools/password", title: "Password Generator", description: "Password acak kriptografis, tidak disimpan.", icon: "••", limit: "20x/jam untuk guest" },
  { href: "/dashboard/tools/json", title: "JSON Formatter", description: "Format, validasi, dan minify JSON.", icon: "{}", limit: "Tanpa batas" },
  { href: "/dashboard/tools/text", title: "Text Toolkit", description: "Hitung kata/karakter, ubah case, bersihkan teks.", icon: "Aa", limit: "Tanpa batas" },
  { href: "/dashboard/tools/image", title: "Image Compressor", description: "Kompres gambar ke JPEG di browser (maks 5 MB untuk guest).", icon: "IMG", limit: "Maks 5 MB untuk guest" },
];

export default function ToolsPage() {
  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest workspace</p>
          <h1>Tools gratis, tanpa login.</h1>
          <p>Semua tools di bawah berjalan di browser kamu — data tidak dikirim ke server. Guest punya batas pemakaian; login untuk akses penuh.</p>
        </div>
        <div className="hero-actions">
          <span className="badge">No account required</span>
          <Link href="/login" className="btn">Masuk</Link>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div><h2>Productivity tools</h2><p>Browser-first. Data tidak disimpan.</p></div>
          <span className="label-dim">Guest access</span>
        </div>
        <div className="feature-grid">
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="panel feature-card" aria-label={tool.title} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="feature-icon">{tool.icon}</div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <span className="badge" style={{ marginTop: 16 }}>{tool.limit}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel" style={{ padding: 22 }}>
        <p className="label-dim">Login required</p>
        <h2 style={{ margin: "8px 0" }}>Downloader, chat, bot, dan history</h2>
        <p style={{ color: "var(--text-dim)", margin: "0 0 16px", lineHeight: 1.6 }}>Fitur ini dibatasi karena memakai API, akun, permission, atau menyimpan data. Login saat kamu memang membutuhkannya.</p>
        <Link href="/login" className="btn-outline">Masuk ke dashboard</Link>
      </section>
    </main>
  );
}
