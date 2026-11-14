"use client";

import { useMemo, useState } from "react";

type Mode = "count" | "upper" | "lower" | "title" | "clean";

export default function TextToolkit() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("count");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    return {
      chars: text.length,
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      lines: text ? text.split("\n").length : 0,
      sentences: trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length : 0,
    };
  }, [text]);

  function transform(): string {
    switch (mode) {
      case "upper": return text.toUpperCase();
      case "lower": return text.toLowerCase();
      case "title": return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
      case "clean": return text.split("\n").map((l) => l.trim()).filter(Boolean).join("\n");
      default: return text;
    }
  }

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest tool</p>
          <h1>Text Toolkit</h1>
          <p>Hitung statistik teks dan transformasi umum. Tanpa login, tanpa server.</p>
        </div>
      </section>

      <section className="panel" style={{ padding: 22 }}>
        <label className="label-dim" htmlFor="text-in">Teks</label>
        <textarea
          id="text-in"
          className="input"
          style={{ width: "100%", minHeight: 140, marginTop: 6 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tempel teks di sini..."
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 12, marginTop: 16 }}>
          <div className="panel" style={{ padding: 12 }}><p className="label-dim" style={{ margin: 0 }}>Karakter</p><p style={{ margin: 4, fontWeight: 700 }}>{stats.chars}</p></div>
          <div className="panel" style={{ padding: 12 }}><p className="label-dim" style={{ margin: 0 }}>Kata</p><p style={{ margin: 4, fontWeight: 700 }}>{stats.words}</p></div>
          <div className="panel" style={{ padding: 12 }}><p className="label-dim" style={{ margin: 0 }}>Baris</p><p style={{ margin: 4, fontWeight: 700 }}>{stats.lines}</p></div>
          <div className="panel" style={{ padding: 12 }}><p className="label-dim" style={{ margin: 0 }}>Kalimat</p><p style={{ margin: 4, fontWeight: 700 }}>{stats.sentences}</p></div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => setMode("upper")}>UPPERCASE</button>
          <button className="btn-outline" onClick={() => setMode("lower")}>lowercase</button>
          <button className="btn-outline" onClick={() => setMode("title")}>Title Case</button>
          <button className="btn-outline" onClick={() => setMode("clean")}>Bersihkan baris</button>
          {mode !== "count" && (
            <button className="btn" onClick={() => { setText(transform()); setMode("count"); }}>
              Terapkan
            </button>
          )}
        </div>
        {mode !== "count" && (
          <pre className="input" style={{ width: "100%", minHeight: 80, marginTop: 12, overflow: "auto", whiteSpace: "pre-wrap" }}>{transform()}</pre>
        )}
      </section>
    </main>
  );
}
