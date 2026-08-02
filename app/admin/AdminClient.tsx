"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Tambahkan import useRouter untuk tombol kembali

const FEATURES = ["TIKTOK_DL", "INSTAGRAM_DL", "YOUTUBE_DL", "PUBLIC_CHAT", "WHATSAPP_BOT", "TELEGRAM_BOT"];

export default function AdminClient() {
  const router = useRouter(); // Inisialisasi router

  const [users, setUsers] = useState<any[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [form, setForm] = useState({ username: "", password: "", role: "MEMBER", features: [] as string[] });
  const [splashUrl, setSplashUrl] = useState("");
  const [splashFile, setSplashFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [currentSplashUrl, setCurrentSplashUrl] = useState<string>("");
  const [msg, setMsg] = useState("");

  async function loadAll() {
    const [u, b, s] = await Promise.all([fetch("/api/admin/users"), fetch("/api/admin/bots"), fetch("/api/admin/splash")]);
    if (u.ok) setUsers(await u.json());
    if (b.ok) setBots(await b.json());
    if (s.ok) { const data = await s.json(); setCurrentSplashUrl(data.splashVideoUrl || "/splash-default.mp4"); }
  }

  useEffect(() => { loadAll(); }, []);

  function toggleFeature(f: string) {
    setForm((s) => ({
      ...s,
      features: s.features.includes(f) ? s.features.filter((x) => x !== f) : [...s.features, f],
    }));
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error); return; }
    setForm({ username: "", password: "", role: "MEMBER", features: [] });
    setMsg(`Akun "${data.username}" dibuat.`);
    loadAll();
  }

  // FUNGSI BARU: Hapus Akun
  async function deleteUser(id: string, username: string) {
    if (!confirm(`Yakin ingin menghapus akun ${username}?`)) return;
    setMsg("");
    
    // Asumsi route API delete ada di /api/admin/users/[id]
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
    });
    
    if (res.ok) {
      setMsg(`Akun "${username}" berhasil dihapus.`);
      loadAll(); // Refresh data tabel
    } else {
      const data = await res.json();
      setMsg(data.error || "Gagal menghapus akun.");
    }
  }

  async function updateSplash(e: React.FormEvent) {
    e.preventDefault();
    if (!splashUrl) return;
    setMsg("");
    const res = await fetch("/api/admin/splash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ splashVideoUrl: splashUrl }),
    });
    const data = await res.json();
    setMsg(res.ok ? "Splash video di-update." : data.error);
  }

  async function uploadSplashFile(e: React.FormEvent) {
    e.preventDefault();
    if (!splashFile) return;
    setMsg("");
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", splashFile);

    return new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      });
      xhr.addEventListener("load", () => {
        const data = JSON.parse(xhr.responseText);
        setUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadProgress(100);
          setSplashFile(null);
          setMsg("Splash video berhasil diupload dan di-update.");
          loadAll();
        } else {
          setUploadProgress(null);
          setMsg(data.error || "Upload gagal.");
        }
        resolve();
      });
      xhr.addEventListener("error", () => {
        setUploading(false);
        setUploadProgress(null);
        setMsg("Gagal konek ke server.");
        resolve();
      });
      xhr.open("POST", "/api/admin/splash/upload");
      xhr.send(formData);
    });
  }

  async function createBot(type: string) {
    const res = await fetch("/api/admin/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, label: `${type}-1` }),
    });
    if (res.ok) loadAll();
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* BAGIAN HEADER DENGAN TOMBOL KEMBALI */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <button 
          className="btn-outline" 
          onClick={() => router.back()}
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          &larr; Kembali
        </button>
        <div>
          <p className="label-dim mono" style={{ margin: 0 }}>ADMIN PANEL</p>
          <h1 style={{ margin: 0 }}>Kontrol Sistem</h1>
        </div>
      </div>

      {msg && <p className="panel" style={{ padding: 12 }}>{msg}</p>}

      <section className="panel" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Buat akun baru</h2>
        <form onSubmit={createUser} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
          <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input placeholder="Password (min 8 karakter)" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="MEMBER">MEMBER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <div>
            <p className="label-dim" style={{ marginBottom: 6 }}>Fitur yang bisa diakses</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {FEATURES.map((f) => (
                <label key={f} className="badge" style={{ cursor: "pointer", background: form.features.includes(f) ? "var(--accent)" : "transparent", color: form.features.includes(f) ? "#fff" : "var(--text-dim)" }}>
                  <input type="checkbox" checked={form.features.includes(f)} onChange={() => toggleFeature(f)} style={{ display: "none" }} />
                  {f}
                </label>
              ))}
            </div>
          </div>
          <button className="btn">Buat akun</button>
        </form>
      </section>

      <section className="panel" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Daftar akun</h2>
        <table className="mono" style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--text-dim)" }}>
              <th style={{ padding: 6 }}>Username</th>
              <th>Role</th>
              <th>Fitur</th>
              <th>Aksi</th> {/* TAMBAHAN KOLOM AKSI */}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: 6 }}>{u.username}</td>
                <td><span className="badge">{u.role}</span></td>
                <td>{u.permissions?.map((p: any) => p.feature).join(", ") || "-"}</td>
                <td>
                  {/* TAMBAHAN TOMBOL HAPUS */}
                  <button 
                    onClick={() => deleteUser(u.id, u.username)}
                    className="btn-outline" 
                    style={{ borderColor: "#ef4444", color: "#ef4444", padding: "4px 8px", fontSize: 12 }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Splash video login</h2>

        <p className="label-dim" style={{ marginBottom: 6 }}>Upload dari komputer</p>

        {/* Styled file picker: tombol "Pilih File" + nama file yang dipilih */}
        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="splash-file-input"
            className="btn-outline mono"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 16px" }}
          >
            Pilih File
          </label>
          <input
            id="splash-file-input"
            type="file"
            accept="video/*"
            onChange={(e) => { const f = e.target.files?.[0] || null; setSplashFile(f); setUploadProgress(null); }}
            style={{ display: "none" }}
          />
          {splashFile ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginLeft: 12, fontSize: 13 }}>
              <span className="label-dim">{splashFile.name}</span>
              <span className="label-dim">({(splashFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
              <button
                type="button"
                className="btn-outline"
                style={{ padding: "2px 8px", fontSize: 11 }}
                onClick={() => { setSplashFile(null); setUploadProgress(null); }}
              >
                Batal
              </button>
            </div>
          ) : (
            <span className="label-dim" style={{ marginLeft: 12, fontSize: 13 }}>
              Belum ada file dipilih
            </span>
          )}
        </div>

        <form onSubmit={uploadSplashFile} style={{ display: "flex", gap: 8, maxWidth: 480, marginBottom: 20 }}>
          <button className="btn" disabled={!splashFile || uploading}>
            {uploading ? (uploadProgress !== null ? `Mengupload ${uploadProgress}%...` : "Mengupload...") : "Upload"}
          </button>
        </form>

        {uploadProgress === 100 && (
          <p style={{ color: "var(--success)", fontSize: 13, marginBottom: 12 }}>Upload selesai!</p>
        )}

        {/* Preview video yang sedang aktif */}
        {currentSplashUrl && currentSplashUrl !== "/splash-default.mp4" && (
          <div style={{ marginBottom: 16 }}>
            <p className="label-dim" style={{ marginBottom: 6, fontSize: 12 }}>Video splash yang sedang aktif</p>
            <video
              key={currentSplashUrl}
              src={currentSplashUrl}
              controls
              muted
              style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, border: "1px solid var(--border)" }}
            />
            <p className="label-dim" style={{ fontSize: 11, marginTop: 4, wordBreak: "break-all" }}>{currentSplashUrl}</p>
          </div>
        )}

        <p className="label-dim" style={{ marginBottom: 6 }}>Atau pakai URL video</p>
        <form onSubmit={updateSplash} style={{ display: "flex", gap: 8, maxWidth: 480 }}>
          <input placeholder="URL video (.mp4)" value={splashUrl} onChange={(e) => setSplashUrl(e.target.value)} style={{ flex: 1 }} />
          <button className="btn-outline">Update</button>
        </form>
      </section>

      <section className="panel" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Koneksi Bot</h2>
        <p className="label-dim" style={{ marginBottom: 12 }}>
          Bot beneran (Baileys WA / Telegraf) jalan di VPS lu sendiri — buat koneksi di sini buat dapet webhook key-nya, terus taruh key itu di config bot lu.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button className="btn-outline" onClick={() => createBot("whatsapp")}>+ Buat koneksi WhatsApp</button>
          <button className="btn-outline" onClick={() => createBot("telegram")}>+ Buat koneksi Telegram</button>
        </div>
        <table className="mono" style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--text-dim)" }}>
              <th style={{ padding: 6 }}>Tipe</th><th>Status</th><th>Webhook key</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((b) => (
              <tr key={b.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: 6 }}>{b.type}</td>
                <td style={{ color: b.connected ? "var(--success)" : "var(--text-dim)" }}>{b.connected ? "connected" : "belum connect"}</td>
                <td>{b.webhookKey}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}