"use client";
import { useRouter } from "next/navigation";

export default function BackButton({ label = "Kembali" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      className="btn-outline mono"
      onClick={() => router.back()}
      style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      &larr; {label}
    </button>
  );
}
