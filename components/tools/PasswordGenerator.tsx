"use client";

import { useState } from "react";
import { useGuestQuota } from "@/lib/use-guest-quota";
import { GuestLimitBanner } from "@/components/GuestLimitBanner";

const CHARSETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

const DEFAULT_LIMIT = 20;

export default function PasswordGenerator({ isGuest, guestLimit }: { isGuest: boolean; guestLimit?: number }) {
  const { remaining, limited, resetIn, consume } = useGuestQuota("password", isGuest, guestLimit ?? DEFAULT_LIMIT);
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function generate() {
    setError("");
    if (!consume()) return;
    let pool = CHARSETS.lower;
    if (useUpper) pool += CHARSETS.upper;
    if (useDigits) pool += CHARSETS.digits;
    if (useSymbols) pool += CHARSETS.symbols;
    if (length < 8 || length > 64) return setError("Panjang harus 8-64 karakter.");

    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    setPassword(Array.from(values, (v) => pool[v % pool.length]).join(""));
  }

  async function copy() {
    await navigator.clipboard.writeText(password);
  }

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest tool</p>
          <h1>Password Generator</h1>
          <p>Password acak kriptografis (Web Crypto). Tidak disimpan atau dikirim ke mana pun.</p>
        </div>
      </section>

      <GuestLimitBanner limited={limited} remaining={remaining} max={guestLimit ?? DEFAULT_LIMIT} resetIn={resetIn} />

      <section className="panel" style={{ padding: 22 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <label className="label-dim">Panjang: {length}
            <input type="range" min={8} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} style={{ marginLeft: 8 }} />
          </label>
          <label><input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} /> A-Z</label>
          <label><input type="checkbox" checked={useDigits} onChange={(e) => setUseDigits(e.target.checked)} /> 0-9</label>
          <label><input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} /> Simbol</label>
          <button className="btn" onClick={generate}>Generate</button>
        </div>
        {error && <p style={{ color: "var(--danger, #e5484d)", marginTop: 10 }}>{error}</p>}
        {password && (
          <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <code className="input" style={{ flex: 1, minWidth: 220, wordBreak: "break-all" }}>{password}</code>
            <button className="btn-outline" onClick={copy}>Copy</button>
          </div>
        )}
      </section>
    </main>
  );
}
