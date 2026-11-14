"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { useGuestQuota } from "@/lib/use-guest-quota";
import { GuestLimitBanner } from "@/components/GuestLimitBanner";

const DEFAULT_LIMIT = 10;

export default function QrGenerator({ isGuest, guestLimit }: { isGuest: boolean; guestLimit?: number }) {
  const { remaining, limited, resetIn, consume } = useGuestQuota("qr", isGuest, guestLimit ?? DEFAULT_LIMIT);
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  async function generate() {
    setError("");
    if (!text.trim()) return setError("Isi teks atau URL dulu.");
    if (!consume()) return;
    try {
      const url = await QRCode.toDataURL(text, { width: size, margin: 2 });
      setDataUrl(url);
    } catch {
      setError("Gagal generate QR. Coba teks lain.");
    }
  }

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest tool</p>
          <h1>QR Generator</h1>
          <p>Buat QR code dari URL atau teks. Di-generate di browser kamu, tidak dikirim ke server.</p>
        </div>
      </section>

      <GuestLimitBanner limited={limited} remaining={remaining} max={guestLimit ?? DEFAULT_LIMIT} resetIn={resetIn} />

      <section className="panel" style={{ padding: 22 }}>
        <label className="label-dim" htmlFor="qr-text">Teks / URL</label>
        <textarea
          id="qr-text"
          className="input"
          style={{ width: "100%", minHeight: 90, marginTop: 6 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://contoh.com"
        />
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
          <label className="label-dim">Ukuran</label>
          <select className="input" value={size} onChange={(e) => setSize(Number(e.target.value))}>
            <option value={128}>128px</option>
            <option value={256}>256px</option>
            <option value={512}>512px</option>
          </select>
          <button className="btn" onClick={generate}>Generate QR</button>
        </div>
        {error && <p style={{ color: "var(--danger, #e5484d)", marginTop: 10 }}>{error}</p>}
        {dataUrl && (
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt="QR code hasil generate" width={Math.min(size, 256)} height={Math.min(size, 256)} style={{ borderRadius: 8 }} />
            <a className="btn-outline" href={dataUrl} download="qr-code.png">Download PNG</a>
          </div>
        )}
      </section>
    </main>
  );
}
