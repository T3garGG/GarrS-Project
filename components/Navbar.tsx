"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({
  role,
  username,
  displayName,
  permissions,
}: {
  role: string;
  username: string;
  displayName?: string;
  permissions: string[];
}) {
  const isPrivileged = role === "OWNER" || role === "ADMIN";

  const links = [
    { href: "/dashboard", label: "Home", show: true },
    { href: "/dashboard/downloader/tiktok", label: "TikTok", show: isPrivileged || permissions.includes("TIKTOK_DL") },
    { href: "/dashboard/downloader/instagram", label: "Instagram", show: isPrivileged || permissions.includes("INSTAGRAM_DL") },
    { href: "/dashboard/downloader/youtube", label: "YouTube", show: isPrivileged || permissions.includes("YOUTUBE_DL") },
    { href: "/dashboard/chat", label: "Chat", show: isPrivileged || permissions.includes("PUBLIC_CHAT") },
    { href: "/dashboard/bot/whatsapp", label: "WhatsApp Bot", show: isPrivileged || permissions.includes("WHATSAPP_BOT") },
    { href: "/dashboard/bot/telegram", label: "Telegram Bot", show: isPrivileged || permissions.includes("TELEGRAM_BOT") },
    { href: "/admin", label: "Admin Panel", show: isPrivileged },
  ];

  return (
    <nav className="panel navbar">
      <div className="nav-links">
        <Link href="/dashboard" className="nav-brand">
          <span className="nav-brand-mark">◆</span>
          <span>Garrs Hub</span>
        </Link>
        {links.filter((l) => l.show).map((l) => (
          <Link key={l.href} href={l.href} className="nav-link">
            {l.label}
          </Link>
        ))}
        <Link href="/dashboard/profile" className="nav-link">Profil</Link>
      </div>
      <div className="nav-actions">
        <span className="badge"><span>{displayName || username}</span><span>·</span><span>{role}</span></span>
        <ThemeToggle />
        <button className="btn-outline" onClick={() => signOut({ callbackUrl: "/login" })}>Keluar</button>
      </div>
    </nav>
  );
}
