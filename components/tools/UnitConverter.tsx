"use client";

import { useMemo, useState } from "react";

type Category = "length" | "weight" | "temperature" | "speed" | "data";

const UNITS: Record<Exclude<Category, "temperature">, Record<string, number>> = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mile: 1609.344, ft: 0.3048, inch: 0.0254 },
  weight: { kg: 1, g: 0.001, ton: 1000, lb: 0.45359237, oz: 0.028349523 },
  speed: { "m/s": 1, "km/h": 1 / 3.6, mph: 0.44704, knot: 0.514444 },
  data: { MB: 1e6, GB: 1e9, KB: 1e3, TB: 1e12, MiB: 1048576, GiB: 1073741824 },
};

function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === "C") celsius = value;
  else if (from === "F") celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15;
  if (to === "C") return celsius;
  if (to === "F") return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

const CATEGORY_LABEL: Record<Category, string> = {
  length: "Panjang",
  weight: "Berat",
  temperature: "Suhu",
  speed: "Kecepatan",
  data: "Data",
};

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("km");

  function switchCategory(cat: Category) {
    setCategory(cat);
    const keys = Object.keys(UNITS[cat as Exclude<Category, "temperature">]);
    setFrom(keys[0]);
    setTo(keys[1] || keys[0]);
  }

  const units = category === "temperature" ? { C: 1, F: 1, K: 1 } : UNITS[category as Exclude<Category, "temperature">];

  const result = useMemo(() => {
    const num = Number(value);
    if (!value || isNaN(num)) return null;
    if (category === "temperature") return convertTemperature(num, from, to);
    const base = num * (UNITS[category as Exclude<Category, "temperature">][from] ?? 1);
    return base / (UNITS[category as Exclude<Category, "temperature">][to] ?? 1);
  }, [value, from, to, category]);

  const formatted = result === null ? "" : Number(result.toPrecision(10)).toString();

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest tool</p>
          <h1>Unit Converter</h1>
          <p>Konversi satuan panjang, berat, suhu, kecepatan, dan data. Tanpa batas, tanpa server.</p>
        </div>
      </section>

      <section className="panel" style={{ padding: 22 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {(Object.keys(CATEGORY_LABEL) as Category[]).map((cat) => (
            <button key={cat} className={cat === category ? "btn" : "btn-outline"} onClick={() => switchCategory(cat)}>
              {CATEGORY_LABEL[cat]}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="label-dim">Nilai</label>
            <input className="input" style={{ width: "100%" }} type="number" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div style={{ minWidth: 100 }}>
            <label className="label-dim">Dari</label>
            <select className="input" style={{ width: "100%" }} value={from} onChange={(e) => setFrom(e.target.value)}>
              {Object.keys(units).map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div style={{ minWidth: 100 }}>
            <label className="label-dim">Ke</label>
            <select className="input" style={{ width: "100%" }} value={to} onChange={(e) => setTo(e.target.value)}>
              {Object.keys(units).map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {formatted && (
          <div style={{ marginTop: 16 }}>
            <p className="label-dim" style={{ margin: 0 }}>Hasil</p>
            <p style={{ fontSize: 24, fontWeight: 700, margin: "4px 0 12px", wordBreak: "break-all" }}>{formatted} {to}</p>
            <button className="btn-outline" onClick={() => navigator.clipboard.writeText(formatted)}>Copy hasil</button>
          </div>
        )}
      </section>
    </main>
  );
}
