"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, Target, Users, GraduationCap, Briefcase, Download, Quote } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PortfolioData } from "@/types/portfolio";

const valueIconMap: Record<string, React.ReactNode> = {
  zap: <Zap size={22} />,
  target: <Target size={22} />,
  users: <Users size={22} />,
};

function StatCounter({ value, label, color }: { value: string; label: string; color: string }) {
  const ref = useRef<HTMLSpanElement>(null);
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
        setDisplayed(prefix + Math.round((1 - Math.pow(1 - p, 3)) * numeric) + suffix);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span ref={ref} className="font-heading font-black text-3xl md:text-4xl" style={{ color }}>{displayed}</span>
      <span className="text-xs text-gray-400 font-medium">{label}</span>
    </div>
  );
}

/* ── Animated skill bar ── */
function SkillBar({ name, level, index }: { name: string; level: number; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); observer.disconnect(); }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-gray-400 font-mono">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: visible ? `${level}%` : 0 }}
          transition={{ duration: 1.2, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))" }}
        />
      </div>
    </div>
  );
}

/* ── Timeline entry ── */
function TimelineItem({
  entry,
  index,
  isLast,
}: {
  entry: { year: string; title: string; subtitle: string; type: "education" | "work" };
  index: number;
  isLast: boolean;
}) {
  const color = entry.type === "education" ? "var(--color-primary)" : "var(--color-accent)";
  const icon = entry.type === "education" ? <GraduationCap size={16} /> : <Briefcase size={16} />;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex gap-4 relative"
    >
      {/* Line */}
      {!isLast && (
        <div
          className="absolute left-[19px] top-10 w-0.5 h-full -bottom-2"
          style={{ background: `linear-gradient(to bottom, ${color}60, transparent)` }}
        />
      )}
      {/* Dot */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 z-10 shadow-md"
        style={{ background: color }}
      >
        {icon}
      </div>
      <div className="pb-6">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
            {entry.year}
          </span>
        </div>
        <h4 className="font-heading font-bold text-base leading-snug">{entry.title}</h4>
        <p className="text-sm text-gray-500">{entry.subtitle}</p>
      </div>
    </motion.div>
  );
}

export default function AboutSection({ data }: { data: PortfolioData["about"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const photoScale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1.02]);
  const photoY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const hasSkillLevels = data.skillLevels && Object.keys(data.skillLevels).length > 0;
  const hasTimeline = data.timeline && data.timeline.length > 0;

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* Magazine header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 relative"
        >
          <span
            className="absolute -top-8 left-0 font-heading font-black text-[8rem] md:text-[12rem] leading-none select-none pointer-events-none opacity-[0.04]"
            style={{ color: "var(--color-primary)" }}
          >
            À
          </span>
          <div className="flex items-end gap-6 mb-4">
            <h2 className="font-heading font-black text-4xl md:text-6xl leading-none">
              {data.sectionTitle}
            </h2>
            <div className="hidden md:block flex-1 h-[3px] mb-3 rounded-full" style={{ background: "linear-gradient(to right, var(--color-accent), transparent)" }} />
          </div>
          <p className="text-gray-400 text-sm uppercase tracking-[0.2em] font-medium">
            BTS Communication · Alternance · Bordeaux
          </p>
        </motion.div>

        {/* Stats strip */}
        {data.stats && data.stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-px mb-16 overflow-hidden rounded-2xl border border-gray-100"
          >
            {data.stats.map((stat, i) => (
              <div key={i} className="bg-gray-50 p-6 flex flex-col items-center gap-1 text-center">
                <StatCounter value={stat.value} label={stat.label} color="var(--color-primary)" />
              </div>
            ))}
          </motion.div>
        )}

        <div className="grid md:grid-cols-12 gap-12 items-start">
          {/* Left: photo + timeline col (5) */}
          <motion.div
            className="md:col-span-5 flex flex-col gap-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl"
              style={{ scale: photoScale, y: photoY }}
            >
              <div
                className="w-full aspect-[3/4]"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
              >
                {data.photo ? (
                  <Image src={data.photo} alt="Photo de profil" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 font-heading font-black text-8xl select-none">
                    👤
                  </div>
                )}
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 p-6 text-white"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}
              >
                <p className="font-heading font-black text-xl">{data.alternance}</p>
                <p className="text-white/70 text-sm">Alternance</p>
              </div>
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative p-6 rounded-2xl border-l-4"
              style={{ borderColor: "var(--color-accent)", background: "rgba(244,63,94,0.04)" }}
            >
              <Quote size={28} className="mb-2 opacity-30" style={{ color: "var(--color-accent)" }} />
              <p className="text-gray-600 italic leading-relaxed text-sm">{data.bio.substring(0, 120)}...</p>
            </motion.div>

            <motion.a
              href={data.cvFile}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white"
              style={{ background: "var(--color-primary)" }}
              whileHover={{ scale: 1.04, boxShadow: "0 10px 30px rgba(99,102,241,0.35)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Download size={18} />
              Télécharger mon CV
            </motion.a>

            {/* Timeline */}
            {hasTimeline && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="pt-4"
              >
                <p className="font-heading font-black text-xs uppercase tracking-widest mb-5" style={{ color: "var(--color-primary)" }}>
                  Parcours
                </p>
                <div>
                  {data.timeline!.map((entry, i) => (
                    <TimelineItem
                      key={i}
                      entry={entry}
                      index={i}
                      isLast={i === data.timeline!.length - 1}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right: content col (7) */}
          <motion.div
            className="md:col-span-7 flex flex-col gap-10"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {/* Full bio */}
            <div>
              <p className="font-heading font-black text-lg mb-1 uppercase tracking-widest text-xs" style={{ color: "var(--color-primary)" }}>
                Qui suis-je ?
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">{data.bio}</p>
            </div>

            {/* Formation + alternance cards */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div whileHover={{ y: -3 }} className="p-5 rounded-2xl border border-gray-100 bg-gray-50">
                <GraduationCap size={24} className="mb-3" style={{ color: "var(--color-primary)" }} />
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Formation</p>
                <p className="text-sm font-semibold leading-snug">{data.formation}</p>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="p-5 rounded-2xl border border-gray-100 bg-gray-50">
                <Briefcase size={24} className="mb-3" style={{ color: "var(--color-accent)" }} />
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Alternance</p>
                <p className="text-sm font-semibold leading-snug">{data.alternance}</p>
              </motion.div>
            </div>

            {/* Skills — bars if levels available, badges otherwise */}
            <div>
              <p className="font-heading font-black text-xs uppercase tracking-widest mb-5" style={{ color: "var(--color-primary)" }}>
                Compétences
              </p>
              {hasSkillLevels ? (
                <div className="flex flex-col gap-6">
                  {data.skills.map((skillCat) => (
                    <div key={skillCat.category}>
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-gray-400">
                          {skillCat.category}
                        </h4>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>
                      <div className="flex flex-col gap-3">
                        {skillCat.items.map((item, i) => {
                          const level = data.skillLevels![item];
                          return level !== undefined ? (
                            <SkillBar key={item} name={item} level={level} index={i} />
                          ) : (
                            <motion.span
                              key={item}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 }}
                              className="inline-block px-3 py-1.5 rounded-full text-sm font-medium border mr-2 mb-1"
                              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)", background: "rgba(99,102,241,0.06)" }}
                            >
                              {item}
                            </motion.span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {data.skills.map((skillCat) => (
                    <div key={skillCat.category}>
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-gray-400">{skillCat.category}</h4>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skillCat.items.map((item, i) => (
                          <motion.span
                            key={item}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.08 }}
                            className="inline-block px-3 py-1.5 rounded-full text-sm font-medium border"
                            style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)", background: "rgba(99,102,241,0.06)" }}
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Values */}
            <div>
              <p className="font-heading font-black text-xs uppercase tracking-widest mb-5" style={{ color: "var(--color-primary)" }}>
                Mes valeurs
              </p>
              <div className="grid grid-cols-1 gap-3">
                {data.values.map((value, i) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 group cursor-default"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white transition-transform group-hover:rotate-6"
                      style={{ background: "var(--color-primary)" }}
                    >
                      {valueIconMap[value.icon] ?? <Zap size={20} />}
                    </div>
                    <div>
                      <h5 className="font-heading font-bold text-base mb-0.5">{value.title}</h5>
                      <p className="text-sm text-gray-500">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
