"use client";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  const toggle = () => {
    const btn = btnRef.current;
    if (!btn || !document.startViewTransition) {
      setTheme(isDark ? "light" : "dark");
      return;
    }

    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.startViewTransition(() => {
      setTheme(isDark ? "light" : "dark");
    });

    const style = document.createElement("style");
    style.textContent = `
      ::view-transition-new(root) {
        clip-path: circle(${radius}px at ${x}px ${y}px);
        animation: expand-clip 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      ::view-transition-old(root) { animation: none; }
      @keyframes expand-clip {
        from { clip-path: circle(0px at ${x}px ${y}px); }
        to   { clip-path: circle(${radius}px at ${x}px ${y}px); }
      }
    `;
    document.head.appendChild(style);
    setTimeout(() => style.remove(), 600);
  };

  return (
    <button
      ref={btnRef}
      onClick={toggle}
      aria-label="Basculer le thème"
      className="relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:scale-110"
      style={{
        borderColor: "var(--color-primary)",
        color: "var(--color-primary)",
        background: "transparent",
      }}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
