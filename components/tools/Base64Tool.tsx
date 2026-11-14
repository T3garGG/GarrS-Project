"use client";

import { useState } from "react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function encode() {
    setError("");
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch {
      setError("Gagal encode.");
    }
  }

  function decode() {
    setError("");
    try {
      setOutput(decodeURIComponent(escape(atob(input.trim()))));
    } catch {
      setError("Bukan Base64 yang valid.");
    }
  }

  function urlEncode() {
    setError("");
    setOutput(encodeURIComponent(input));
  }

  function urlDecode() {
    setError("");
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setError("Format URL-encoded tidak valid.");
    }
  }

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest tool</p>
          <h1>Base64 &amp; URL Encoder</h1>
          <p>Encode/decode Base64 (dukung Unicode) dan URL encoding. Diproses di browser.</p>
        </div>
      </section>

      <section className="panel" style={{ padding: 22 }}>
        <label className="label-dim" htmlFor="b64-in">Input</label>
        <textarea
          id="b64-in"
          className="input"
          style={{ width: "100%", minHeight: 110, marginTop: 6, fontFamily: "monospace" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Teks atau Base64 di sini..."
        />
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button className="btn" onClick={encode}>Encode Base64</button>
          <button className="btn-outline" onClick={decode}>Decode Base64</button>
          <button className="btn-outline" onClick={urlEncode}>URL Encode</button>
          <button className="btn-outline" onClick={urlDecode}>URL Decode</button>
        </div>
        {error && <p style={{ color: "var(--danger, #e5484d)", marginTop: 10 }}>{error}</p>}
        {output && (
          <>
            <label className="label-dim" style={{ display: "block", marginTop: 16 }}>Hasil</label>
            <textarea className="input" readOnly style={{ width: "100%", minHeight: 110, marginTop: 6, fontFamily: "monospace" }} value={output} />
            <button className="btn-outline" style={{ marginTop: 10 }} onClick={() => navigator.clipboard.writeText(output)}>Copy hasil</button>
          </>
        )}
      </section>
    </main>
  );
}
