"use client";

import { useMemo, useState } from "react";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.trim().replace("#", "").match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export default function ColorTool() {
  const [color, setColor] = useState("#3b82f6");

  const { rgb, hsl, valid } = useMemo(() => {
    const rgb = hexToRgb(color);
    if (!rgb) return { rgb: null, hsl: null, valid: false };
    return { rgb, hsl: rgbToHsl(...rgb), valid: true };
  }, [color]);

  const formats = rgb
    ? [
        { label: "HEX", value: color.toLowerCase().replace(/^#?/, "#") },
        { label: "RGB", value: `rgb(${rgb.join(", ")})` },
        { label: "HSL", value: hsl ? `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` : "" },
      ]
    : [];

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest tool</p>
          <h1>Color Converter</h1>
          <p>Konversi warna antara HEX, RGB, dan HSL dengan preview langsung.</p>
        </div>
      </section>

      <section className="panel" style={{ padding: 22 }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <input type="color" value={valid ? color : "#000000"} onChange={(e) => setColor(e.target.value)} style={{ width: 56, height: 40, border: "none", cursor: "pointer" }} aria-label="Pilih warna" />
          <input
            className="input"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#3b82f6"
            style={{ width: 140, fontFamily: "monospace" }}
            aria-label="Nilai HEX"
          />
          {!valid && <span className="label-dim">HEX tidak valid</span>}
        </div>

        {valid && rgb && (
          <>
            <div style={{ width: "100%", height: 80, borderRadius: 10, marginTop: 16, background: color }} aria-label="Preview warna" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 16 }}>
              {formats.map((f) => (
                <div key={f.label} className="panel" style={{ padding: 14 }}>
                  <p className="label-dim" style={{ margin: 0 }}>{f.label}</p>
                  <p style={{ margin: "6px 0 10px", fontFamily: "monospace", wordBreak: "break-all" }}>{f.value}</p>
                  <button className="btn-outline" onClick={() => navigator.clipboard.writeText(f.value)}>Copy</button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
