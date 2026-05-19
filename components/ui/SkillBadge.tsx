"use client";
import { motion } from "framer-motion";

export default function SkillBadge({ label, index = 0 }: { label: string; index?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.08 }}
      className="inline-block px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
      style={{
        borderColor: "var(--color-primary)",
        color: "var(--color-primary)",
        background: "rgba(99,102,241,0.06)",
      }}
    >
      {label}
    </motion.span>
  );
}
