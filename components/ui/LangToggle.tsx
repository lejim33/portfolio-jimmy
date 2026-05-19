"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "portfolio-lang";

export default function LangToggle({ langs = ["FR", "EN"] }: { langs?: string[] }) {
  const [lang, setLang] = useState("FR");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && langs.includes(stored)) setLang(stored);
  }, [langs]);

  const select = (l: string) => {
    setLang(l);
    localStorage.setItem(STORAGE_KEY, l);
    setOpen(false);
    // Update html lang attribute
    document.documentElement.lang = l.toLowerCase();
    // Dispatch custom event so other components can react
    window.dispatchEvent(new CustomEvent("portfolio-lang-change", { detail: l }));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
        style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
        aria-label="Changer la langue"
      >
        {lang}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 right-0 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 min-w-[80px]"
          >
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => select(l)}
                className={`w-full px-4 py-2.5 text-xs font-bold text-left transition-colors ${l === lang ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-50 text-gray-600"}`}
              >
                {l}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
