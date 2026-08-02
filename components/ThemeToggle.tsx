"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle({ defaultTheme = "dark" }: { defaultTheme?: string }) {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || defaultTheme;
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, [defaultTheme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <button className="btn-outline mono" onClick={toggle} aria-label="Ganti tema gelap/terang">
      {theme === "dark" ? "◐ mode terang" : "◑ mode gelap"}
    </button>
  );
}
