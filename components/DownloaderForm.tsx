"use client";
import { useState } from "react";

export default function DownloaderForm({ platform, apiPath }: { platform: string; apiPath: string }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ downloadUrl?: string; error?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setResult(res.ok ? { downloadUrl: data.downloadUrl } : { error: data.error });
    } catch {
      setResult({ error: "Gagal konek ke server." });
    }
    setLoading(false);
  }

  return (
    <div className="panel" style={{ padding: 24, maxWidth: 560 }}>
      <p className="label-dim mono">{platform.toUpperCase()} DOWNLOADER</p>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={`Tempel link ${platform} di sini`}
          style={{ flex: 1 }}
          required
        />
        <button className="btn" disabled={loading}>{loading ? "Memproses..." : "Unduh"}</button>
      </form>

      {result?.error && <p style={{ color: "var(--danger)", marginTop: 12 }}>{result.error}</p>}
      {result?.downloadUrl && (
        <a href={result.downloadUrl} className="btn" style={{ display: "inline-block", marginTop: 12 }} target="_blank">
          Simpan file
        </a>
      )}
    </div>
  );
}
