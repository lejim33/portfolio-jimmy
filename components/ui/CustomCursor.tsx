"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

const TRAIL_LENGTH = 8;

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [hovered, setHovered] = useState(false);
  const [trail, setTrail] = useState(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -200, y: -200 }))
  );
  const historyRef = useRef<{ x: number; y: number }[]>([]);

  const springX = useSpring(-200, { stiffness: 500, damping: 35 });
  const springY = useSpring(-200, { stiffness: 500, damping: 35 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      setPos({ x, y });
      springX.set(x);
      springY.set(y);

      historyRef.current = [{ x, y }, ...historyRef.current].slice(0, TRAIL_LENGTH * 3);

      setTrail(
        Array.from({ length: TRAIL_LENGTH }, (_, i) => {
          const idx = Math.floor(i * 2.5);
          return historyRef.current[idx] ?? { x, y };
        })
      );
    };

    const enter = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, [data-cursor-hover]")) setHovered(true);
    };
    const leave = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, [data-cursor-hover]")) setHovered(false);
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", enter);
    document.addEventListener("mouseout", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout", leave);
    };
  }, [springX, springY]);

  return (
    <>
      {/* Trail particles */}
      {trail.map((p, i) => (
        <div
          key={i}
          className="pointer-events-none fixed z-[9997]"
          style={{
            left: p.x,
            top: p.y,
            width: Math.max(2, 7 - i),
            height: Math.max(2, 7 - i),
            borderRadius: "50%",
            background: `var(--color-primary)`,
            opacity: (1 - i / TRAIL_LENGTH) * 0.35,
            transform: "translate(-50%, -50%)",
            transition: "left 0.04s linear, top 0.04s linear",
          }}
        />
      ))}

      {/* Ring */}
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full border-2"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hovered ? 52 : 32,
          height: hovered ? 52 : 32,
          opacity: hovered ? 0.8 : 0.5,
          borderColor: hovered ? "var(--color-accent)" : "var(--color-primary)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      />

      {/* Dot */}
      <div
        className="pointer-events-none fixed z-[9999] rounded-full"
        style={{
          left: pos.x,
          top: pos.y,
          width: hovered ? 6 : 8,
          height: hovered ? 6 : 8,
          background: hovered ? "var(--color-accent)" : "var(--color-primary)",
          transform: "translate(-50%, -50%)",
          transition: "width 0.15s, height 0.15s, background 0.15s",
        }}
      />
    </>
  );
}
