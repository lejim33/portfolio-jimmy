"use client";
import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Props {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  onClick?: () => void;
  strength?: number;
  [key: string]: unknown;
}

export default function MagneticButton({
  children,
  className = "",
  style,
  href,
  onClick,
  strength = 0.4,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = href ? "a" : "button";

  return (
    <div ref={ref} onMouseMove={handleMouse} onMouseLeave={reset} className="inline-block">
      <motion.div style={{ x: springX, y: springY }}>
        <Tag
          href={href}
          onClick={onClick}
          className={className}
          style={style}
          {...rest}
        >
          {children}
        </Tag>
      </motion.div>
    </div>
  );
}
