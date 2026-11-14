"use client";

import { useState } from "react";
import { useGuestQuota } from "@/lib/use-guest-quota";
import { GuestLimitBanner } from "@/components/GuestLimitBanner";

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

async function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

const DEFAULT_LIMIT = 20;

export default function HashGenerator({ isGuest, guestLimit }: { isGuest: boolean; guestLimit?: number }) {
  const { remaining, limited, resetIn, consume } = useGuestQuota("hash", isGuest, guestLimit ?? DEFAULT_LIMIT);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{ algo: string; hex: string }[]>([]);
  const [error, setError] = useState("");

  async function generate() {
    setError("");
    if (!consume()) return;
    if (!input) return setError("Masukkan teks dulu.");
    const data = new TextEncoder().encode(input);
    const list: { algo: string; hex: string }[] = [];
    for (const algo of ALGOS) {
      const digest = await crypto.subtle.digest(algo, data);
      list.push({ algo, hex: await toHex(digest) });
    }
    setResults(list);
  }

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest tool</p>
          <h1>Hash Generator</h1>
          <p>Hash SHA-1/256/384/512 via Web Crypto. Input tidak pernah dikirim ke server.</p>
        </div>
      </section>

      <GuestLimitBanner limited={limited} remaining={remaining} max={guestLimit ?? DEFAULT_LIMIT} resetIn={resetIn} />

      <section className="panel" style={{ padding: 22 }}>
        <label className="label-dim" htmlFor="hash-in">Teks</label>
        <textarea
          id="hash-in"
          className="input"
          style={{ width: "100%", minHeight: 90, marginTop: 6, fontFamily: "monospace" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Teks yang mau di-hash..."
        />
        <button className="btn" style={{ marginTop: 12 }} onClick={generate}>Generate hash</button>
        {error && <p style={{ color: "var(--danger, #e5484d)", marginTop: 10 }}>{error}</p>}
        {results.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {results.map((r) => (
              <div key={r.algo}>
                <p className="label-dim" style={{ margin: "0 0 6px" }}>{r.algo}</p>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <code className="input" style={{ flex: 1, minWidth: 220, wordBreak: "break-all" }}>{r.hex}</code>
                  <button className="btn-outline" onClick={() => navigator.clipboard.writeText(r.hex)}>Copy</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
