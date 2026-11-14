"use client";

import { useState } from "react";
import { useGuestQuota } from "@/lib/use-guest-quota";
import { GuestLimitBanner } from "@/components/GuestLimitBanner";

export default function UuidGenerator({ isGuest }: { isGuest: boolean }) {
  const { remaining, limited, resetIn, consume } = useGuestQuota("uuid", isGuest, 20);
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [error, setError] = useState("");

  function generate() {
    setError("");
    if (!consume()) return;
    if (count < 1 || count > 10) return setError("Jumlah harus 1-10.");
    const list: string[] = [];
    for (let i = 0; i < count; i++) list.push(crypto.randomUUID());
    setUuids(list);
  }

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest tool</p>
          <h1>UUID Generator</h1>
          <p>Bikin UUID v4 kriptografis (crypto.randomUUID). Batch 1-10 sekaligus.</p>
        </div>
      </section>

      <GuestLimitBanner limited={limited} remaining={remaining} max={20} resetIn={resetIn} />

      <section className="panel" style={{ padding: 22 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <label className="label-dim">Jumlah</label>
          <select className="input" value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {[1, 2, 3, 5, 10].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <button className="btn" onClick={generate}>Generate</button>
          {uuids.length > 1 && <button className="btn-outline" onClick={() => navigator.clipboard.writeText(uuids.join("\n"))}>Copy semua</button>}
        </div>
        {error && <p style={{ color: "var(--danger, #e5484d)", marginTop: 10 }}>{error}</p>}
        {uuids.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
            {uuids.map((u, i) => (
              <div key={u + i} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <code className="input" style={{ flex: 1, minWidth: 220, wordBreak: "break-all" }}>{u}</code>
                <button className="btn-outline" onClick={() => navigator.clipboard.writeText(u)}>Copy</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
