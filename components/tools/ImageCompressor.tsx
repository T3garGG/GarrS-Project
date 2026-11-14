"use client";

import { useRef, useState } from "react";

const MAX_GUEST_BYTES = 5 * 1024 * 1024; // 5 MB untuk guest
const MAX_USER_BYTES = 20 * 1024 * 1024; // 20 MB untuk user login

export default function ImageCompressor({ isGuest }: { isGuest: boolean }) {
  const maxBytes = isGuest ? MAX_GUEST_BYTES : MAX_USER_BYTES;
  const inputRef = useRef<HTMLInputElement>(null);
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("compressed.jpg");

  async function handleFile(file: File) {
    setError("");
    setResultUrl("");
    if (!file.type.startsWith("image/")) return setError("File harus gambar.");
    if (file.size > maxBytes) {
      return setError(`Ukuran maksimum ${isGuest ? "guest" : "user"} adalah ${maxBytes / 1024 / 1024} MB. File kamu ${(file.size / 1024 / 1024).toFixed(1)} MB.${isGuest ? " Login untuk upload lebih besar." : ""}`);
    }
    setOriginalSize(file.size);
    setFileName(file.name.replace(/\.\w+$/, "") + "-compressed.jpg");

    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
    );
    if (!blob) return setError("Gagal mengompres gambar.");
    setResultUrl(URL.createObjectURL(blob));
    setResultSize(blob.size);
  }

  return (
    <main className="page-stack">
      <section className="panel hero">
        <div>
          <p className="label-dim">Guest tool</p>
          <h1>Image Compressor</h1>
          <p>Kompres gambar ke JPEG langsung di browser. Gambarnya tidak pernah di-upload ke server.</p>
        </div>
      </section>

      <section className="panel" style={{ padding: 22 }}>
        <p className="label-dim" style={{ marginTop: 0 }}>
          Batas ukuran file: {maxBytes / 1024 / 1024} MB ({isGuest ? "guest" : "user login"})
        </p>
        <label className="label-dim">Kualitas: {Math.round(quality * 100)}%
          <input type="range" min={0.1} max={0.95} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ marginLeft: 8 }} />
        </label>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => inputRef.current?.click()}>Pilih gambar</button>
        </div>
        {error && <p style={{ color: "var(--danger, #e5484d)", marginTop: 10 }}>{error}</p>}
        {resultUrl && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            <p style={{ margin: 0 }}>
              {(originalSize / 1024).toFixed(0)} KB → <strong>{(resultSize / 1024).toFixed(0)} KB</strong>{" "}
              <span className="label-dim">(-{Math.round((1 - resultSize / originalSize) * 100)}%)</span>
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultUrl} alt="Gambar hasil kompresi" style={{ maxWidth: "100%", borderRadius: 8 }} />
            <a className="btn-outline" href={resultUrl} download={fileName}>Download</a>
          </div>
        )}
      </section>
    </main>
  );
}
