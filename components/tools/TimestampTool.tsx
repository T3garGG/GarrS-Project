"use client";

import { useState } from "react";

export default function TimestampTool() {
  const [ts, setTs] = useState("");
  const [unit, setUnit] = useState<"s" | "ms">("s");
  const [dateInput, setDateInput] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  function tsToDate() {
    setError("");
    setResult("");
    const num = Number(ts.trim());
    if (!ts.trim() || isNaN(num)) return setError("Masukkan angka timestamp yang valid.");
    const ms = unit === "s" ? num * 1000 : num;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return setError("Timestamp di luar jangkauan.");
    setResult(
      `${d.toLocaleString("id-ID", { dateStyle: "full", timeStyle: "medium" })}\nISO: ${d.toISOString()}\nRelative: ${Math.round((Date.now() - ms) / 1000)} detik yang lalu`
    );
  }

  function dateToTs() {
    setError("");
    setResult("");
    if (!dateInput) return setError("Pilih tanggal dulu.");
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return setError("Tanggal tidak valid.");
    const ms = d.getTime();
    setResult(`Detik: ${Math.floor(ms / 1000)}\nMilidetik: ${ms}`);
  }

  const now = () => {
    setTs(String(Math.floor(Date.now() / 1000)));
    setUnit("s");
  };

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest tool</p>
          <h1>Timestamp Converter</h1>
          <p>Konversi dua arah antara Unix timestamp dan tanggal, format Indonesia.</p>
        </div>
      </section>

      <section className="panel" style={{ padding: 22 }}>
        <p className="label-dim" style={{ marginTop: 0 }}>Timestamp → Tanggal</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input className="input" style={{ flex: 1, minWidth: 200, fontFamily: "monospace" }} value={ts} onChange={(e) => setTs(e.target.value)} placeholder="1719999999" />
          <select className="input" value={unit} onChange={(e) => setUnit(e.target.value as "s" | "ms")}>
            <option value="s">Detik</option>
            <option value="ms">Milidetik</option>
          </select>
          <button className="btn-outline" onClick={now}>Sekarang</button>
          <button className="btn" onClick={tsToDate}>Konversi</button>
        </div>

        <p className="label-dim" style={{ marginTop: 20 }}>Tanggal → Timestamp</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input className="input" type="datetime-local" style={{ flex: 1, minWidth: 200 }} value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
          <button className="btn" onClick={dateToTs}>Konversi</button>
        </div>

        {error && <p style={{ color: "var(--danger, #e5484d)", marginTop: 10 }}>{error}</p>}
        {result && (
          <pre className="input" style={{ width: "100%", marginTop: 14, whiteSpace: "pre-wrap", overflow: "auto" }}>{result}</pre>
        )}
      </section>
    </main>
  );
}
