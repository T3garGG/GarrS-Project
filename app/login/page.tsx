"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} className="panel" style={{ width: 360, padding: 32 }}>
        <p className="label-dim mono" style={{ marginBottom: 4 }}>AUTH</p>
        <h1 style={{ margin: "0 0 24px", fontSize: 22 }}>Masuk ke Dashboard</h1>

        <label className="label-dim" htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", margin: "6px 0 16px" }}
          required
        />

        <label className="label-dim" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", margin: "6px 0 20px" }}
          required
        />

        {error && <p style={{ color: "var(--danger)", fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <button className="btn" type="submit" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Memeriksa..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
