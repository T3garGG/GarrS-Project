import Link from "next/link";

const PUBLIC_TOOLS = [
  { title: "QR Generator", description: "Buat QR dari URL atau teks.", status: "Segera hadir", icon: "QR" },
  { title: "JSON Formatter", description: "Rapikan dan validasi JSON di browser.", status: "Segera hadir", icon: "{}" },
  { title: "Text Toolkit", description: "Hitung kata, ubah case, dan bersihkan teks.", status: "Segera hadir", icon: "Aa" },
  { title: "Password Generator", description: "Buat password acak tanpa menyimpan hasilnya.", status: "Segera hadir", icon: "••" },
  { title: "Image Compressor", description: "Kompres gambar langsung di browser.", status: "Segera hadir", icon: "IMG" },
];

export default function ToolsPage() {
  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest workspace</p>
          <h1>Tools gratis, tanpa login.</h1>
          <p>Gunakan productivity tools tanpa membuat akun. Akun hanya diperlukan untuk fitur yang menyimpan data atau memakai layanan server.</p>
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
          {PUBLIC_TOOLS.map((tool) => (
            <article key={tool.title} className="panel feature-card" aria-label={`${tool.title}, ${tool.status}`}>
              <div className="feature-icon">{tool.icon}</div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <span className="badge" style={{ marginTop: 16 }}>{tool.status}</span>
            </article>
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
