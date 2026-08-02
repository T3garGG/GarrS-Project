"use client";
import { useEffect, useState } from "react";

const FEATURES = ["TIKTOK_DL", "INSTAGRAM_DL", "YOUTUBE_DL", "PUBLIC_CHAT", "WHATSAPP_BOT", "TELEGRAM_BOT"];

export default function AdminClient() {
  const [users, setUsers] = useState<any[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [form, setForm] = useState({ username: "", password: "", role: "MEMBER", features: [] as string[] });
  const [splashUrl, setSplashUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ role: "MEMBER", features: [] as string[] });

  async function loadAll() {
    const [u, b] = await Promise.all([fetch("/api/admin/users"), fetch("/api/admin/bots")]);
    if (u.ok) setUsers(await u.json());
    if (b.ok) setBots(await b.json());
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

  function startEdit(u: any) {
    setEditingId(u.id);
    setEditForm({ role: u.role, features: u.permissions.map((p: any) => p.feature) });
    setMsg("");
  }

  function toggleEditFeature(f: string) {
    setEditForm((s) => ({
      ...s,
      features: s.features.includes(f) ? s.features.filter((x) => x !== f) : [...s.features, f],
    }));
  }

  async function saveEdit(id: string) {
    setMsg("");
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error); return; }
    setEditingId(null);
    setMsg("Akun di-update.");
    loadAll();
  }

  async function deleteUser(id: string) {
    if (!confirm("Yakin mau hapus akun ini? Gak bisa dibalikin.")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error); return; }
    loadAll();
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
      <div>
        <p className="label-dim mono">ADMIN PANEL</p>
        <h1 style={{ margin: 0 }}>Kontrol Sistem</h1>
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
              <th style={{ padding: 6 }}>Username</th><th>Role</th><th>Fitur</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: 6 }}>{u.username}</td>
                <td><span className="badge">{u.role}</span></td>
                <td>{u.permissions.map((p: any) => p.feature).join(", ") || "-"}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="btn-outline" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => startEdit(u)}>Edit</button>
                  {u.role !== "OWNER" && (
                    <button className="btn-outline" style={{ padding: "4px 10px", fontSize: 12, color: "var(--danger)" }} onClick={() => deleteUser(u.id)}>Hapus</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingId && (
          <div className="panel" style={{ padding: 16, marginTop: 16, background: "var(--bg)" }}>
            <p className="label-dim mono" style={{ marginBottom: 10 }}>EDIT AKUN</p>
            <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} style={{ marginBottom: 12 }}>
              <option value="MEMBER">MEMBER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {FEATURES.map((f) => (
                <label key={f} className="badge" style={{ cursor: "pointer", background: editForm.features.includes(f) ? "var(--accent)" : "transparent", color: editForm.features.includes(f) ? "#fff" : "var(--text-dim)" }}>
                  <input type="checkbox" checked={editForm.features.includes(f)} onChange={() => toggleEditFeature(f)} style={{ display: "none" }} />
                  {f}
                </label>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={() => saveEdit(editingId)}>Simpan</button>
              <button className="btn-outline" onClick={() => setEditingId(null)}>Batal</button>
            </div>
          </div>
        )}
      </section>

      <section className="panel" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Splash video login</h2>
        <p className="label-dim" style={{ marginBottom: 12 }}>
          Video default udah dipasang di project (`public/splash-default.mp4`). Mau ganti pake video lain? Paste URL-nya di sini.
        </p>
        <form onSubmit={updateSplash} style={{ display: "flex", gap: 8, maxWidth: 480 }}>
          <input placeholder="URL video (.mp4)" value={splashUrl} onChange={(e) => setSplashUrl(e.target.value)} style={{ flex: 1 }} />
          <button className="btn">Update</button>
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
