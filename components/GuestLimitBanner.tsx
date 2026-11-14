"use client";

import Link from "next/link";

export function GuestLimitBanner({
  limited,
  remaining,
  max,
  resetIn,
}: {
  limited: boolean;
  remaining: number | null;
  max: number;
  resetIn: number;
}) {
  if (remaining === null) return null;

  if (limited) {
    const minutes = Math.max(1, Math.ceil(resetIn / 60));
    return (
      <div className="panel" style={{ padding: 16, borderColor: "var(--border)" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>Batas guest tercapai ({max}x per jam).</p>
        <p style={{ margin: "6px 0 12px", color: "var(--text-dim)" }}>
          Coba lagi dalam ~{minutes} menit, atau login untuk pakai tanpa batas.
        </p>
        <Link href="/login" className="btn">Masuk</Link>
      </div>
    );
  }

  return (
    <p className="label-dim" style={{ margin: 0 }}>
      Sisa pemakaian guest: {remaining}/{max} per jam · <Link href="/login">login</Link> untuk tanpa batas
    </p>
  );
}
