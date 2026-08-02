"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({
  role,
  username,
  permissions,
}: {
  role: string;
  username: string;
  permissions: string[];
}) {
  const isPrivileged = role === "OWNER" || role === "ADMIN";

  const links = [
    { href: "/dashboard", label: "Home", show: true },
    { href: "/dashboard/downloader/tiktok", label: "TikTok", show: isPrivileged || permissions.includes("TIKTOK_DL") },
    { href: "/dashboard/downloader/instagram", label: "Instagram", show: isPrivileged || permissions.includes("INSTAGRAM_DL") },
    { href: "/dashboard/downloader/youtube", label: "YouTube", show: isPrivileged || permissions.includes("YOUTUBE_DL") },
    { href: "/dashboard/chat", label: "Chat", show: isPrivileged || permissions.includes("PUBLIC_CHAT") },
    { href: "/admin", label: "Admin Panel", show: isPrivileged },
  ];

  return (
    <nav
      className="panel"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        marginBottom: 24,
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <Link href="/dashboard" className="mono" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none", letterSpacing: "0.05em" }}>
          ◆ DASHBOARD
        </Link>
        {links.filter((l) => l.show).map((l) => (
          <Link key={l.href} href={l.href} style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: 14 }}>
            {l.label}
          </Link>
        ))}
        <Link href="/dashboard/profile" style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: 14 }}>
          Edit Profil
        </Link>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="badge">{username} · {role}</span>
        <ThemeToggle />
        <button className="btn-outline" onClick={() => signOut({ callbackUrl: "/login" })}>
          Keluar
        </button>
      </div>
    </nav>
  );
}
