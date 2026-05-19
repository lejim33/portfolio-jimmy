"use client";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useMemo } from "react";
import { PortfolioData, Project } from "@/types/portfolio";

/* ── 3D tilt + glassmorphism card ── */
function TiltCard({ project, index, large = false }: { project: Project; index: number; large?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.08, duration: 0.55 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className="h-full"
    >
      <Link href={`/projects/${project.slug}`} className="block h-full">
        <motion.div
          className="relative group overflow-hidden rounded-2xl glass-card flex flex-col h-full"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", minHeight: large ? 380 : 280 }}
          whileHover={{ boxShadow: `0 20px 50px ${project.detail.color}30` }}
        >
          {/* Radial glow following cursor */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glowX} ${glowY}, ${project.detail.color}25, transparent 60%)`,
            }}
          />

          {/* Cover */}
          <div
            className={`relative overflow-hidden ${large ? "h-56" : "h-44"}`}
            style={{ background: `${project.detail.color}12` }}
          >
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center font-heading font-black select-none"
                style={{ fontSize: "8rem", lineHeight: 1, color: `${project.detail.color}18` }}
              >
                {project.title.charAt(0)}
              </div>
            )}
            {/* Hover overlay with info */}
            <motion.div
              className="absolute inset-0 flex flex-col items-start justify-end p-4 gap-2"
              style={{ background: `linear-gradient(to top, ${project.detail.color}e0, ${project.detail.color}40, transparent)` }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <div className="flex flex-wrap gap-1">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-semibold text-white bg-white/20 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs font-medium text-white/80">{project.date}</span>
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent dark:from-black/30" />

            {project.featured && (
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white z-10"
                style={{ background: project.detail.color }}
              >
                <Star size={10} fill="currentColor" />
                Featured
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1 gap-3">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs font-medium border"
                  style={{ borderColor: `${project.detail.color}50`, color: project.detail.color }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="font-heading font-black text-lg leading-tight">{project.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed flex-1">{project.shortDescription}</p>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400">{project.client}</span>
              <motion.div
                className="w-8 h-8 rounded-lg text-white flex items-center justify-center"
                style={{ background: project.detail.color }}
                whileHover={{ scale: 1.15, rotate: 8 }}
              >
                <ArrowUpRight size={14} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ── Featured wide card ── */
function FeaturedCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mb-8 col-span-full"
    >
      <Link href={`/projects/${project.slug}`}>
        <motion.div
          whileHover={{ y: -4, boxShadow: `0 24px 60px ${project.detail.color}30` }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative group rounded-3xl overflow-hidden glass-card flex flex-col md:flex-row"
          style={{ boxShadow: "0 6px 32px rgba(0,0,0,0.08)", minHeight: 340 }}
        >
          <div
            className="relative md:w-1/2 h-64 md:h-auto overflow-hidden"
            style={{ background: `${project.detail.color}12` }}
          >
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center font-heading font-black select-none pointer-events-none"
                style={{ fontSize: "14rem", lineHeight: 1, color: `${project.detail.color}15` }}
              >
                {project.title.charAt(0)}
              </div>
            )}
            {/* Hover overlay */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              style={{ background: `${project.detail.color}30` }}
            >
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                <ArrowUpRight size={24} style={{ color: project.detail.color }} />
              </div>
            </motion.div>
          </div>

          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center gap-4">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white w-fit"
              style={{ background: project.detail.color }}
            >
              <Star size={11} fill="currentColor" />
              Projet à la une
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs font-medium border"
                  style={{ borderColor: `${project.detail.color}50`, color: project.detail.color }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="font-heading font-black text-2xl md:text-3xl leading-tight">{project.title}</h3>
            <p className="text-gray-500 leading-relaxed">{project.shortDescription}</p>

            {project.detail.stats.length > 0 && (
              <div className="flex gap-6">
                {project.detail.stats.slice(0, 3).map((stat, i) => (
                  <div key={i}>
                    <p className="font-heading font-black text-xl" style={{ color: project.detail.color }}>{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-gray-400">{project.client} · {project.date}</span>
              <motion.div
                className="ml-auto w-10 h-10 rounded-xl text-white flex items-center justify-center"
                style={{ background: project.detail.color }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <ArrowUpRight size={18} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ── Main section ── */
export default function ProjectsSection({ data }: { data: PortfolioData["projects"] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const publishedItems = useMemo(
    () => data.items.filter((p) => p.published !== false),
    [data.items]
  );

  const allTags = useMemo(
    () => Array.from(new Set(publishedItems.flatMap((p) => p.tags))),
    [publishedItems]
  );

  const filtered = useMemo(
    () => (activeTag ? publishedItems.filter((p) => p.tags.includes(activeTag)) : publishedItems),
    [publishedItems, activeTag]
  );

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading font-black text-4xl md:text-5xl mb-4">{data.sectionTitle}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{data.sectionSubtitle}</p>
          <div className="mx-auto mt-4 w-16 h-1 rounded-full" style={{ background: "var(--color-primary)" }} />
        </motion.div>

        {/* Tag filters */}
        {allTags.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            <button
              onClick={() => setActiveTag(null)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={
                activeTag === null
                  ? { background: "var(--color-primary)", color: "#fff" }
                  : { background: "transparent", border: "1px solid #e2e8f0", color: "#64748b" }
              }
            >
              Tous
            </button>
            {allTags.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={
                  activeTag === tag
                    ? { background: "var(--color-primary)", color: "#fff" }
                    : { background: "transparent", border: "1px solid #e2e8f0", color: "#64748b" }
                }
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTag ?? "all"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto"
          >
            {featured ? (
              <>
                <FeaturedCard project={featured} />
                {rest.map((project, i) => (
                  <div
                    key={project.id}
                    className={rest.length >= 3 && i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
                  >
                    <TiltCard project={project} index={i} large={rest.length >= 3 && i === 0} />
                  </div>
                ))}
              </>
            ) : (
              filtered.map((project, i) => (
                <TiltCard key={project.id} project={project} index={i} />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-16">Aucun projet pour ce filtre.</p>
        )}
      </div>
    </section>
  );
}
