"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const guestOff = searchParams.get("denied") === "guest-off";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { username, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Username atau password salah.");
      return;
    }
    router.push("/welcome");
  }

  return (
    <main className="login-shell">
      <form onSubmit={handleSubmit} className="panel login-card">
        <div className="login-brand"><span className="nav-brand-mark">◆</span><span>Garrs Hub</span></div>
        <p className="label-dim">Welcome back</p>
        <h1>Masuk ke workspace.</h1>
        <p className="login-subtitle">Akses downloader, chat, bot control, dan tools kamu dari satu tempat.</p>

        <div className="form-stack">
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input id="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {guestOff && <p style={{ color: "var(--warning, #f5a524)", fontSize: 13, margin: 0 }}>Guest mode sedang dinonaktifkan admin. Silakan login.</p>}
        {error && <p style={{ color: "var(--danger)", fontSize: 13, margin: 0 }} role="alert">{error}</p>}
          <button className="btn" type="submit" disabled={loading}>{loading ? "Memeriksa..." : "Masuk ke dashboard"}</button>
          <button className="btn-outline" type="button" onClick={() => router.push("/dashboard/tools")}>Coba tanpa login (guest)</button>
        </div>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
