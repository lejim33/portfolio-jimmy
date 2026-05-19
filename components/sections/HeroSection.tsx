"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Download, ArrowDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AnimatedText from "@/components/ui/AnimatedText";
import SocialIcon from "@/components/ui/SocialIcon";
import CanvasBackground from "@/components/ui/CanvasBackground";
import MagneticButton from "@/components/ui/MagneticButton";
import dynamic from "next/dynamic";
const FloatingSocial3D = dynamic(() => import("@/components/ui/FloatingSocial3D"), { ssr: false });
import { PortfolioData } from "@/types/portfolio";

function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [displayed, setDisplayed] = useState("0");

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
      if (isNaN(numeric)) { setDisplayed(value); return; }
      const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
      const suffix = value.match(/[^0-9.]+$/)?.[0] ?? "";
      const duration = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplayed(prefix + Math.round(eased * numeric) + suffix);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-1">
      <p ref={ref} className="font-heading font-black text-2xl md:text-3xl" style={{ color: "var(--color-primary)" }}>
        {displayed}
      </p>
      <p className="text-xs text-gray-500 text-center">{label}</p>
    </div>
  );
}

/* Staggered word reveal */
function SplitReveal({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: delay + i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function HeroSection({ data }: { data: PortfolioData["hero"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const avatarY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${data.backgroundValue}`}
    >
      <CanvasBackground />

      {/* Blobs */}
      <motion.div
        className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "var(--color-primary)" }}
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "var(--color-accent)" }}
        animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center w-full">
        {/* Text */}
        <motion.div className="flex flex-col gap-6" style={{ y: textY, opacity }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest w-fit border"
            style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)", background: "rgba(99,102,241,0.06)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--color-primary)" }} />
            {data.greeting}
          </motion.div>

          <h1 className="font-heading font-black text-5xl md:text-7xl leading-tight">
            <SplitReveal text={data.name} delay={0.15} />
          </h1>

          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-xl md:text-2xl font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {data.title}
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-gray-500 text-lg leading-relaxed max-w-lg"
          >
            {data.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <MagneticButton
              href={data.ctaPrimary.href}
              className="px-7 py-3 rounded-full font-semibold text-white shadow-lg inline-flex items-center"
              style={{ background: "var(--color-primary)", boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
            >
              {data.ctaPrimary.label}
            </MagneticButton>
            <MagneticButton
              href={data.ctaSecondary.href}
              className="px-7 py-3 rounded-full font-semibold border-2 flex items-center gap-2"
              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
            >
              <Download size={16} />
              {data.ctaSecondary.label}
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex gap-4"
          >
            {data.socialLinks.map((social) => (
              <motion.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.platform}
                className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors"
                style={{ borderColor: "#e2e8f0", color: "#64748b" }}
                whileHover={{ scale: 1.15, rotate: 5, borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
                whileTap={{ scale: 0.95 }}
              >
                <SocialIcon icon={social.icon} size={20} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Avatar with parallax */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.85, ease: "easeOut", delay: 0.25 }}
          style={{ y: avatarY }}
          className="flex justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.04, rotate: 2 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative"
          >
            {/* Decorative ring */}
            <div
              className="absolute -inset-3 rounded-3xl opacity-20 blur-sm"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
            />
            <div
              className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
            >
              {data.avatar ? (
                <Image src={data.avatar} alt={`Avatar de ${data.name}`} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading font-black text-white text-9xl opacity-30">{data.name.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* Floating 3D models */}
            <FloatingSocial3D />

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg px-4 py-2"
            >
              <p className="text-xs text-gray-400 font-medium">En alternance @</p>
              <p className="font-heading font-bold text-sm" style={{ color: "var(--color-primary)" }}>La Belle Finition</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats strip */}
      {data.stats && data.stats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="w-full max-w-6xl mx-auto px-6 pb-16"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm px-8 py-6 flex flex-wrap justify-center md:justify-around gap-8">
            {data.stats.map((stat, i) => (
              <StatCounter key={i} value={stat.value} label={stat.label} />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ opacity: data.stats && data.stats.length > 0 ? 0 : 1 }}
      >
        <span className="text-xs text-gray-400 uppercase tracking-widest">Scroll</span>
        <ArrowDown size={16} className="text-gray-400" />
      </motion.div>
    </section>
  );
}
