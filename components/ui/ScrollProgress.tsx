"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[9996] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(to right, var(--color-primary), var(--color-accent))",
      }}
    />
  );
}
