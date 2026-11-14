"use client";

import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function format(indent: number) {
    setError("");
    setOutput("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e: any) {
      setError(e.message || "JSON tidak valid.");
    }
  }

  function minify() {
    setError("");
    setOutput("");
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
    } catch (e: any) {
      setError(e.message || "JSON tidak valid.");
    }
  }

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest tool</p>
          <h1>JSON Formatter</h1>
          <p>Rapikan, validasi, atau minify JSON. Semua diproses di browser, tidak ada upload.</p>
        </div>
      </section>

      <section className="panel" style={{ padding: 22 }}>
        <label className="label-dim" htmlFor="json-in">Input JSON</label>
        <textarea
          id="json-in"
          className="input"
          style={{ width: "100%", minHeight: 140, marginTop: 6, fontFamily: "monospace" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"status":"ok","data":[1,2,3]}'
        />
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => format(2)}>Format 2 spasi</button>
          <button className="btn-outline" onClick={() => format(4)}>Format 4 spasi</button>
          <button className="btn-outline" onClick={minify}>Minify</button>
        </div>
        {error && <p style={{ color: "var(--danger, #e5484d)", marginTop: 10, fontFamily: "monospace" }}>{error}</p>}
        {output && (
          <>
            <label className="label-dim" style={{ display: "block", marginTop: 16 }}>Hasil</label>
            <pre className="input" style={{ width: "100%", minHeight: 120, marginTop: 6, overflow: "auto", whiteSpace: "pre-wrap" }}>{output}</pre>
          </>
        )}
      </section>
    </main>
  );
}
