"use client";

import { useState } from "react";
import { useGuestQuota } from "@/lib/use-guest-quota";
import { GuestLimitBanner } from "@/components/GuestLimitBanner";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

function randomInt(max: number) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function sentence() {
  const len = 6 + randomInt(10);
  const words = Array.from({ length: len }, () => WORDS[randomInt(WORDS.length)]);
  const s = words.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}

function paragraph() {
  const len = 3 + randomInt(3);
  return Array.from({ length: len }, sentence).join(" ");
}

const DEFAULT_LIMIT = 20;

export default function LoremIpsum({ isGuest, guestLimit }: { isGuest: boolean; guestLimit?: number }) {
  const { remaining, limited, resetIn, consume } = useGuestQuota("lorem", isGuest, guestLimit ?? DEFAULT_LIMIT);
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function generate() {
    setError("");
    if (!consume()) return;
    if (unit === "paragraphs") {
      setOutput(Array.from({ length: count }, paragraph).join("\n\n"));
    } else if (unit === "sentences") {
      setOutput(Array.from({ length: count }, sentence).join(" "));
    } else {
      setOutput(Array.from({ length: count }, () => WORDS[randomInt(WORDS.length)]).join(" "));
    }
  }

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest tool</p>
          <h1>Lorem Ipsum Generator</h1>
          <p>Teks placeholder untuk desain dan mockup. Pilih jumlah paragraf, kalimat, atau kata.</p>
        </div>
      </section>

      <GuestLimitBanner limited={limited} remaining={remaining} max={guestLimit ?? DEFAULT_LIMIT} resetIn={resetIn} />

      <section className="panel" style={{ padding: 22 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <label className="label-dim">Jumlah</label>
          <input className="input" type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))} style={{ width: 80 }} />
          <select className="input" value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)}>
            <option value="paragraphs">Paragraf</option>
            <option value="sentences">Kalimat</option>
            <option value="words">Kata</option>
          </select>
          <button className="btn" onClick={generate}>Generate</button>
          {output && <button className="btn-outline" onClick={() => navigator.clipboard.writeText(output)}>Copy</button>}
        </div>
        {error && <p style={{ color: "var(--danger, #e5484d)", marginTop: 10 }}>{error}</p>}
        {output && (
          <pre className="input" style={{ width: "100%", minHeight: 140, marginTop: 14, whiteSpace: "pre-wrap", overflow: "auto" }}>{output}</pre>
        )}
      </section>
    </main>
  );
}
