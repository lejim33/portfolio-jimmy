"use client";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight, X, Quote, Clock, User, ArrowRight, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, type MouseEvent as ReactMouseEvent } from "react";
import { Project } from "@/types/portfolio";

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* ─── Animated counter ─── */
function Counter({ value }: { value: string }) {
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
      const duration = 1200;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayed(prefix + Math.round(eased * numeric) + suffix);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{displayed}</span>;
}

/* ─── Lightbox ─── */
function Lightbox({ images, index, onClose, onNav }: {
  images: string[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNav((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, images.length, onClose, onNav]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} aria-label="Fermer" className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
        <X size={20} />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="relative max-w-5xl max-h-[80vh] w-full mx-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-video w-full">
            <Image src={images[index]} alt={`Image ${index + 1}`} fill className="object-contain" unoptimized />
          </div>
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); onNav((index - 1 + images.length) % images.length); }} aria-label="Précédent" className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onNav((index + 1) % images.length); }} aria-label="Suivant" className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </motion.div>
  );
}

/* ─── Browser mockup gallery (CRM) ─── */
const CRM_TABS = [
  { path: "/dashboard", title: "Tableau de bord" },
  { path: "/clients", title: "Fiches clients" },
  { path: "/clients/123", title: "Détail client" },
  { path: "/planning", title: "Planning" },
  { path: "/appels", title: "Journal d'appels" },
  { path: "/chantiers", title: "Suivi chantier" },
  { path: "/demandes", title: "Demandes web" },
  { path: "/chantiers/inventaire", title: "Inventaire chantier" },
  { path: "/ia/simulation", title: "Simulation IA — client" },
  { path: "/admin/ia", title: "Simulation IA — admin" },
];

function BrowserMockupGallery({ images, galleryIndex, setGalleryIndex, onOpenLightbox, color, title }: {
  images: string[];
  galleryIndex: number;
  setGalleryIndex: (updater: number | ((i: number) => number)) => void;
  onOpenLightbox: () => void;
  color: string;
  title: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 4, ry: px * 6 });
  };
  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

  const tab = CRM_TABS[galleryIndex % CRM_TABS.length];
  const url = `crm.labellefinition.fr${tab.path}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
      style={{ perspective: 1400 }}
    >
      <h2 className="font-heading font-black text-2xl mb-6">Aperçu de l&apos;application</h2>

      <div
        ref={frameRef}
        onMouseMove={handleMove}
        onMouseLeave={resetTilt}
        className="relative mb-4"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 200ms ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Browser frame */}
        <div className="rounded-t-xl bg-gradient-to-b from-gray-100 to-gray-50 border border-gray-200 border-b-0 shadow-2xl shadow-black/10">
          {/* Title bar */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="hidden sm:flex items-center gap-1 ml-2 text-gray-400">
              <ChevronLeft size={16} />
              <ChevronRight size={16} />
            </div>
            <div className="flex-1 mx-2">
              <div className="flex items-center gap-2 bg-white rounded-md px-3 py-1.5 border border-gray-200 max-w-md mx-auto shadow-inner">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-xs text-gray-500 font-mono truncate">{url}</span>
              </div>
            </div>
            <span className="hidden sm:block text-[10px] uppercase tracking-wider font-bold text-gray-400">
              {tab.title}
            </span>
          </div>
          {/* Tab bar */}
          <div className="px-4 -mb-px flex items-end gap-1 overflow-x-auto">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-t-md bg-white border border-gray-200 border-b-white text-xs font-medium text-gray-700 shadow-sm"
              style={{ borderTopColor: color, borderTopWidth: 2 }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              CRM — {tab.title}
            </div>
          </div>
        </div>

        {/* Viewport */}
        <div
          className="relative aspect-video bg-white border border-gray-200 border-t-0 rounded-b-xl overflow-hidden cursor-zoom-in"
          onClick={onOpenLightbox}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={galleryIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image src={images[galleryIndex]} alt={`${title} — ${tab.title}`} fill className="object-cover object-top" unoptimized />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setGalleryIndex((i: number) => (i - 1 + images.length) % images.length); }}
                aria-label="Précédent"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setGalleryIndex((i: number) => (i + 1) % images.length); }}
                aria-label="Suivant"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Reflection */}
        <div
          className="absolute left-4 right-4 -bottom-6 h-6 rounded-full blur-2xl opacity-30"
          style={{ background: color }}
        />
      </div>

      {/* Thumbnails as mini browser windows */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setGalleryIndex(i)}
              aria-label={`Écran ${i + 1}`}
              className={`group relative shrink-0 rounded-lg overflow-hidden border-2 bg-white shadow-sm transition-all hover:-translate-y-0.5 ${i === galleryIndex ? "" : "opacity-60 hover:opacity-100"}`}
              style={{ borderColor: i === galleryIndex ? color : "#e5e7eb", width: 124 }}
            >
              <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-100">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f57]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#febc2e]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="relative w-full aspect-video bg-white">
                <Image src={img} alt="" fill className="object-cover object-top" unoptimized />
              </div>
              <div className="px-2 py-1 text-[10px] font-medium text-gray-600 truncate text-left">
                {CRM_TABS[i % CRM_TABS.length].title}
              </div>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Scroll progress bar ─── */
function ScrollProgress({ color }: { color: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
      style={{ scaleX, background: color }}
    />
  );
}

/* ─── Main component ─── */
export default function ProjectDetailClient({
  project,
  allProjects,
}: {
  project: Project;
  allProjects: Project[];
}) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = project.detail.images.filter(Boolean);

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);

  const readTime = estimateReadTime(
    [project.detail.fullDescription, project.detail.challenge, project.detail.solution, project.detail.results].join(" ")
  );

  const handleShare = async () => {
    const shareData = {
      title: project.title,
      text: project.shortDescription,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: `/projects/${project.slug}` }),
    }).catch(() => {});
  }, [project.slug]);

  return (
    <>
      <ScrollProgress color={project.detail.color} />

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNav={setLightboxIndex}
          />
        )}
      </AnimatePresence>

      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white">

        {/* ── Hero parallax ── */}
        <div ref={heroRef} className="relative h-[70vh] overflow-hidden flex items-end">
          {/* Background */}
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0 -top-20"
          >
            {project.coverImage ? (
              <Image src={project.coverImage} alt={project.title} fill className="object-cover" unoptimized />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${project.detail.color}18 0%, ${project.detail.color}40 50%, ${project.detail.color}10 100%)`,
                }}
              />
            )}
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Decorative large letter */}
          {!project.coverImage && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{ color: project.detail.color }}
            >
              <span className="font-heading font-black text-[25vw] opacity-[0.07] leading-none">
                {project.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="relative max-w-5xl mx-auto px-6 pb-14 w-full">
            <Link href="/#projects">
              <motion.span
                className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors mb-6 px-3 py-1.5 rounded-full backdrop-blur-sm bg-black/30 hover:bg-black/50 w-fit"
                whileHover={{ x: -4 }}
              >
                <ArrowLeft size={16} />
                Retour aux projets
              </motion.span>
            </Link>

            <div className="flex flex-wrap gap-2 mb-5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm"
                  style={{ background: `${project.detail.color}cc` }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="font-heading font-black text-4xl md:text-6xl text-white leading-tight mb-4"
            >
              {project.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-6 text-white/70 text-sm"
            >
              <span className="flex items-center gap-2">
                <User size={14} />
                {project.detail.role || project.client}
              </span>
              {project.detail.duration && (
                <span className="flex items-center gap-2">
                  <Clock size={14} />
                  {project.detail.duration}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Clock size={14} />
                Lecture ~{readTime} min
              </span>
              <span className="opacity-60">{project.date}</span>
              <motion.button
                onClick={handleShare}
                aria-label="Partager ce projet"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Share2 size={12} />
                Partager
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        {project.detail.stats.length > 0 && (
          <div className="border-b border-gray-100" style={{ background: project.detail.color }}>
            <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-3 gap-4">
              {project.detail.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center text-white"
                >
                  <p className="font-heading font-black text-3xl md:text-4xl">
                    <Counter value={stat.value} />
                  </p>
                  <p className="text-sm opacity-80 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="max-w-5xl mx-auto px-6 py-16">

          {/* Challenge / Solution */}
          {(project.detail.challenge || project.detail.solution) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-8 mb-16"
            >
              {project.detail.challenge && (
                <div className="p-7 rounded-2xl border border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Le défi</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{project.detail.challenge}</p>
                </div>
              )}
              {project.detail.solution && (
                <div className="p-7 rounded-2xl border-2" style={{ borderColor: `${project.detail.color}40`, background: `${project.detail.color}06` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: project.detail.color }} />
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: project.detail.color }}>La solution</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{project.detail.solution}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Gallery */}
          {images.length > 0 && (
            project.slug === "crm-btp" ? (
              <BrowserMockupGallery
                images={images}
                galleryIndex={galleryIndex}
                setGalleryIndex={setGalleryIndex}
                onOpenLightbox={() => setLightboxIndex(galleryIndex)}
                color={project.detail.color}
                title={project.title}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="font-heading font-black text-2xl mb-6">Galerie</h2>

                {/* Main image */}
                <div
                  className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 mb-3 cursor-zoom-in"
                  onClick={() => setLightboxIndex(galleryIndex)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={galleryIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0"
                    >
                      <Image src={images[galleryIndex]} alt={`${project.title} — ${galleryIndex + 1}`} fill className="object-cover" unoptimized />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 hover:opacity-100 text-white text-sm font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm transition-opacity">
                          Agrandir
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setGalleryIndex((i) => (i - 1 + images.length) % images.length); }}
                        aria-label="Précédent"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setGalleryIndex((i) => (i + 1) % images.length); }}
                        aria-label="Suivant"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        aria-label={`Image ${i + 1}`}
                        className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === galleryIndex ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
                        style={{ borderColor: i === galleryIndex ? project.detail.color : "transparent" }}
                      >
                        <Image src={img} alt="" fill className="object-cover" unoptimized />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          )}

          {/* Full description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-heading font-black text-2xl mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{project.detail.fullDescription}</p>
          </motion.div>

          {/* Updates */}
          {project.detail.updates && project.detail.updates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="font-heading font-black text-2xl mb-6">Mises à jour</h2>
              <div className="space-y-10">
                {project.detail.updates.map((update, ui) => (
                  <div key={ui} className="relative pl-6 border-l-2" style={{ borderColor: project.detail.color }}>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: project.detail.color }}
                      >
                        {update.date}
                      </span>
                      <h3 className="font-heading font-black text-xl">{update.title}</h3>
                    </div>
                    <div className="mt-5 space-y-8">
                      {update.items.map((item, ii) => (
                        <div key={ii}>
                          <h4 className="font-heading font-bold text-lg mb-2">{item.title}</h4>
                          <p className="text-gray-600 leading-relaxed mb-4">{item.description}</p>
                          {item.images && item.images.length > 0 && (
                            <div className={`grid gap-3 ${item.images.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                              {item.images.map((img, ig) => (
                                <div
                                  key={ig}
                                  className="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                                >
                                  <Image src={img} alt={item.title} fill className="object-cover" unoptimized />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Process timeline */}
          {project.detail.process.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="font-heading font-black text-2xl mb-8">Processus</h2>
              <div className="relative">
                {/* Vertical line */}
                <div
                  className="absolute left-7 top-4 bottom-4 w-0.5"
                  style={{ background: `linear-gradient(to bottom, ${project.detail.color}, ${project.detail.color}20)` }}
                />
                <div className="flex flex-col gap-8">
                  {project.detail.process.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-6 relative"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center font-heading font-black text-sm text-white shrink-0 z-10 shadow-lg"
                        style={{ background: project.detail.color }}
                      >
                        {step.step}
                      </div>
                      <div className="pt-2">
                        <h4 className="font-heading font-bold text-lg mb-1">{step.title}</h4>
                        <p className="text-gray-500 leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tools + Results grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <h3 className="font-heading font-bold text-base mb-4 uppercase tracking-wide text-gray-400 text-xs">Outils utilisés</h3>
              <div className="flex flex-wrap gap-2">
                {project.detail.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 rounded-full text-sm font-medium border"
                    style={{ borderColor: `${project.detail.color}50`, color: project.detail.color, background: `${project.detail.color}0a` }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Results */}
            {project.detail.results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl text-white"
                style={{ background: `linear-gradient(135deg, ${project.detail.color}, ${project.detail.color}cc)` }}
              >
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 opacity-80">Résultats</h3>
                <p className="font-heading font-bold text-xl leading-snug">{project.detail.results}</p>
              </motion.div>
            )}
          </div>

          {/* Testimonial */}
          {project.detail.testimonial && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 p-8 rounded-2xl border border-gray-100 bg-gray-50 relative overflow-hidden"
            >
              <Quote
                size={80}
                className="absolute -top-4 -left-4 opacity-5"
                style={{ color: project.detail.color }}
              />
              <blockquote className="relative">
                <p className="text-xl text-gray-700 leading-relaxed italic mb-4">
                  &ldquo;{project.detail.testimonial.quote}&rdquo;
                </p>
                <footer className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: project.detail.color }}
                  >
                    {project.detail.testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{project.detail.testimonial.author}</p>
                    <p className="text-xs text-gray-400">{project.detail.testimonial.role}</p>
                  </div>
                </footer>
              </blockquote>
            </motion.div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-24">
            {project.detail.link && (
              <motion.a
                href={project.detail.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white"
                style={{ background: project.detail.color }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Voir le projet live
                <ExternalLink size={16} />
              </motion.a>
            )}
            <Link href="/#projects">
              <motion.span
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold border-2"
                style={{ borderColor: project.detail.color, color: project.detail.color }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <ArrowLeft size={16} />
                Tous les projets
              </motion.span>
            </Link>
          </div>

          {/* Prev / Next navigation */}
          {(prevProject || nextProject) && (
            <div className="border-t border-gray-100 pt-10">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-6 text-center">Autres projets</p>
              <div className="grid md:grid-cols-2 gap-4">
                {prevProject ? (
                  <Link href={`/projects/${prevProject.slug}`}>
                    <motion.div
                      whileHover={{ x: -4 }}
                      className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                    >
                      <ArrowLeft size={20} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-1">Précédent</p>
                        <p className="font-heading font-bold text-sm truncate">{prevProject.title}</p>
                      </div>
                    </motion.div>
                  </Link>
                ) : <div />}
                {nextProject ? (
                  <Link href={`/projects/${nextProject.slug}`}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-end gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                    >
                      <div className="min-w-0 text-right">
                        <p className="text-xs text-gray-400 mb-1">Suivant</p>
                        <p className="font-heading font-bold text-sm truncate">{nextProject.title}</p>
                      </div>
                      <ArrowRight size={20} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                    </motion.div>
                  </Link>
                ) : <div />}
              </div>
            </div>
          )}
        </div>
      </motion.main>
    </>
  );
}
