"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function BackButton({ fallback = "/dashboard/tools" }: { fallback?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === fallback.replace(/\?.*$/, "")) return null;

  return (
    <button className="btn-outline" style={{ alignSelf: "flex-start" }} onClick={() => {
      if (window.history.length > 1) router.back();
      else router.push(fallback);
    }}>
      ← Kembali
    </button>
  );
}
