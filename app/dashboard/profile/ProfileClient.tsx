"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function ProfileClient({ currentUsername }: { currentUsername: string }) {
  const [username, setUsername] = useState(currentUsername);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, currentPassword, newPassword: newPassword || undefined }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setMsg("Berhasil diubah. Login ulang pake data baru dalam 3 detik...");
    setTimeout(() => signOut({ callbackUrl: "/login" }), 3000);
  }

  return (
    <div className="panel" style={{ padding: 24 }}>
      <p className="label-dim mono">EDIT PROFILE</p>
      <h1 style={{ margin: "0 0 20px", fontSize: 20 }}>Akun Saya</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
        <div>
          <label className="label-dim" htmlFor="username">Username</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", marginTop: 6 }} required />
        </div>

        <div>
          <label className="label-dim" htmlFor="newPassword">Password baru (kosongin kalo gak mau ganti)</label>
          <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: "100%", marginTop: 6 }} placeholder="min 8 karakter" />
        </div>

        <div>
          <label className="label-dim" htmlFor="currentPassword">Password sekarang (wajib, buat verifikasi)</label>
          <input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={{ width: "100%", marginTop: 6 }} required />
        </div>

        {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
        {msg && <p style={{ color: "var(--success)", fontSize: 13 }}>{msg}</p>}

        <button className="btn" disabled={loading}>{loading ? "Menyimpan..." : "Simpan perubahan"}</button>
      </form>
    </div>
  );
}
