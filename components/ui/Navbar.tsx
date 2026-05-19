"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { PortfolioData } from "@/types/portfolio";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LangToggle from "@/components/ui/LangToggle";

export default function Navbar({ data }: { data: PortfolioData["navbar"] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = data.links
      .map((l) => l.href.replace("#", ""))
      .filter((id) => document.getElementById(id));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [data.links]);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.a
          href="/"
          className="font-heading font-black text-xl"
          style={{ color: "var(--color-primary)" }}
          whileHover={{ scale: 1.05 }}
        >
          {data.logo}
        </motion.a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {data.links.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium transition-colors"
                style={{ color: isActive ? "var(--color-primary)" : "var(--color-text)" }}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "var(--color-primary)" }}
                  />
                )}
              </a>
            );
          })}
          <motion.a
            href={data.ctaHref}
            className="px-5 py-2 rounded-full text-sm font-semibold text-white"
            style={{ background: "var(--color-primary)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {data.ctaLabel}
          </motion.a>
          <LangToggle />
          <ThemeToggle />
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Ouvrir le menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100"
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
              {data.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium py-2"
                  style={{ color: "var(--color-text)" }}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={data.ctaHref}
                onClick={() => setMobileOpen(false)}
                className="px-5 py-2 rounded-full text-sm font-semibold text-white text-center"
                style={{ background: "var(--color-primary)" }}
              >
                {data.ctaLabel}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
