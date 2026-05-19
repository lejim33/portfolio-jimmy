"use client";
import { motion } from "framer-motion";

interface MarqueeProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
  accent?: boolean;
}

export default function Marquee({ items, speed = 40, reverse = false, accent = false }: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden py-5 border-y select-none"
      style={{
        borderColor: accent ? "var(--color-accent)" : "var(--color-primary)",
        background: accent ? "var(--color-accent)" : "var(--color-primary)",
      }}
    >
      <motion.div
        className="flex gap-0 whitespace-nowrap"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 px-6 font-heading font-bold text-sm uppercase tracking-widest text-white/90"
          >
            {item}
            <span className="text-white/40 text-lg">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
