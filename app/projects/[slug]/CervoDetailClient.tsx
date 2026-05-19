"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ExternalLink,
  ChevronLeft, ChevronRight,
  Code2, Database, Lock, GitBranch, Globe, Cpu,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Project } from "@/types/portfolio";

const TECH_STACK = [
  {
    icon: Code2,
    name: "Next.js",
    desc: "Framework React — rendu serveur & routing",
    color: "#111111",
    bg: "#f4f4f5",
    border: "#e4e4e7",
  },
  {
    icon: Cpu,
    name: "Claude Code",
    desc: "IA Anthropic — assistance au développement",
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    icon: GitBranch,
    name: "GitHub",
    desc: "Versionnement & collaboration",
    color: "#6d28d9",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    icon: Globe,
    name: "Vercel",
    desc: "Déploiement continu — CI/CD automatique",
    color: "#047857",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    icon: Database,
    name: "Neon",
    desc: "Base de données PostgreSQL serverless",
    color: "#0e7490",
    bg: "#ecfeff",
    border: "#a5f3fc",
  },
  {
    icon: Lock,
    name: "Supabase Auth",
    desc: "Authentification sécurisée des utilisateurs",
    color: "#15803d",
    bg: "#f0fdf4",
    border: "#86efac",
  },
];

const SCREENS = [
  "/uploads/CERVO/carroussel%20app/CARROUSSEL%201.png",
  "/uploads/CERVO/carroussel%20app/CARROUSSEL%202.png",
  "/uploads/CERVO/carroussel%20app/CARROUSSEL%203.png",
  "/uploads/CERVO/carroussel%20app/CARROUSSEL%204.png",
  "/uploads/CERVO/carroussel%20app/CARROUSSEL%205.png",
  "/uploads/CERVO/carroussel%20app/CARROUSSEL%206.png",
  "/uploads/CERVO/carroussel%20app/CARROUSSEL%207.png",
  "/uploads/CERVO/carroussel%20app/CARROUSSEL%208.png",
];

const COVER        = "/uploads/CERVO/CERVO%20COVER.png";
const LOGO         = "/uploads/CERVO/LOGO%20CERVO.png";
const MASCOTTE     = "/uploads/CERVO/MASCOTTE%20Original.png";
const EVOLUTION     = "/uploads/CERVO/CERVO%20Evolution.png";
const PROCESS_COVER = "/uploads/CERVO/Process%20crea%20cover.png";
const PROCESS_LOGO  = "/uploads/CERVO/Process%20crea%20logo.png";

function PhoneCarousel({ color }: { color: string }) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((i) => (i - 1 + SCREENS.length) % SCREENS.length);
  const next = () => setCurrent((i) => (i + 1) % SCREENS.length);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: 280, height: 580 }}>
        {/* Phone shell */}
        <div
          className="absolute inset-0 rounded-[3rem] bg-[#1a1a1a] border-[5px] border-[#333] overflow-hidden"
          style={{ boxShadow: `0 30px 80px ${color}30, 0 8px 30px rgba(0,0,0,0.15)` }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[26px] bg-[#1a1a1a] rounded-b-2xl z-20" />
          {/* Side buttons */}
          <div className="absolute -left-[5px] top-24 w-[3px] h-10 rounded-l-md bg-[#333]" />
          <div className="absolute -left-[5px] top-40 w-[3px] h-16 rounded-l-md bg-[#333]" />
          <div className="absolute -right-[5px] top-32 w-[3px] h-20 rounded-r-md bg-[#333]" />
          {/* Screen */}
          <div className="absolute inset-[6px] rounded-[2.5rem] overflow-hidden bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image src={SCREENS[current]} alt={`Écran ${current + 1}`} fill className="object-cover" unoptimized />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/20 z-30" />
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-colors flex items-center justify-center text-slate-500"
          aria-label="Précédent"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1.5">
          {SCREENS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrent(i)}
              animate={{ width: i === current ? 24 : 6 }}
              className="h-1.5 rounded-full transition-colors"
              style={{ background: i === current ? color : "#cbd5e1" }}
              aria-label={`Aller à l'écran ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-colors flex items-center justify-center text-slate-500"
          aria-label="Suivant"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <span className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">
        Écran {current + 1} / {SCREENS.length}
      </span>
    </div>
  );
}

export default function CervoDetailClient({
  project,
  allProjects,
}: {
  project: Project;
  allProjects: Project[];
}) {
  const { scrollY } = useScroll();
  const heroY       = useTransform(scrollY, [0, 600], [0, 130]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject  = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject  = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;
  const color        = project.detail.color;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f7f8fc] text-slate-900"
    >
      {/* ── HERO ── */}
      <div className="relative h-screen overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: heroY }} className="absolute inset-0 -top-24 -bottom-24">
          <Image src={COVER} alt="Cervo cover" fill className="object-cover" unoptimized priority />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/30 to-[#f7f8fc]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
            <Link href="/#projects">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-white px-3 py-1.5 rounded-full backdrop-blur-sm bg-black/30 hover:bg-black/50 transition-colors">
                <ArrowLeft size={16} />
                Retour aux projets
              </span>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/80 mb-5"
          >
            Application mobile · Micro-apprentissage gamifié
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-black text-6xl md:text-9xl leading-none mb-6 uppercase text-white"
            style={{ textShadow: `0 0 80px ${color}80` }}
          >
            {project.title}
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="text-white/90 text-lg max-w-xl mx-auto"
          >
            {project.shortDescription}
          </motion.p>

          {project.detail.link && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-8">
              <a
                href={project.detail.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-lg transition-transform hover:scale-105"
                style={{ background: color, boxShadow: `0 10px 40px ${color}70` }}
              >
                Visiter l&apos;application
                <ExternalLink size={16} />
              </a>
            </motion.div>
          )}

          <motion.div style={{ opacity: heroOpacity }} className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-white/60 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent"
            />
          </motion.div>
        </div>
      </div>

      {/* ── MASCOTTE ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-2">Identité · Personnage</p>
            <h2 className="font-heading font-black text-4xl md:text-6xl mb-6" style={{ color }}>
              Cervo, la mascotte
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-4">
              Cervo joue un rôle central dans l&apos;identité de l&apos;application. Il
              accompagne l&apos;utilisateur, donne des conseils, célèbre ses victoires et
              évolue avec lui au fil de sa progression.
            </p>
            <p className="text-slate-500 leading-relaxed">
              Son évolution visuelle symbolise celle de l&apos;utilisateur : plus il apprend
              et complète de quêtes, plus Cervo progresse. Il rend l&apos;expérience plus
              humaine, attachante et moins scolaire.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="relative aspect-square rounded-3xl overflow-hidden"
            style={{ background: `radial-gradient(circle at center, ${color}18, ${color}05 70%)` }}
          >
            <Image src={MASCOTTE} alt="Mascotte Cervo" fill className="object-contain p-8" unoptimized />
          </motion.div>
        </div>
      </section>

      {/* ── ÉVOLUTION ── */}
      <section className="py-16 px-6 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-2">
              Progression · Niveaux
            </p>
            <h3 className="font-heading font-black text-3xl md:text-4xl text-slate-900">
              Cervo grandit avec toi
            </h3>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
              Plus l&apos;utilisateur complète de quêtes, plus Cervo évolue — 10 formes pour symboliser la progression.
            </p>
          </motion.div>

          {/* Mockup "écran large" incliné */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1000 }}
          >
            <motion.div
              whileHover={{ scale: 1.02, rotateX: -2 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow: `0 30px 80px ${color}25, 0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px ${color}20`,
              }}
            >
              {/* Barre de fenêtre */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ background: `${color}f0`, borderColor: `${color}30` }}>
                <div className="w-3 h-3 rounded-full bg-white/40" />
                <div className="w-3 h-3 rounded-full bg-white/30" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <span className="ml-3 text-[11px] font-semibold text-white/80 tracking-wide">Cervo — Évolution de la mascotte</span>
              </div>
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={EVOLUTION}
                  alt="Évolution de Cervo — 7 niveaux de progression"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Étiquettes niveaux */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex justify-center gap-2 flex-wrap"
          >
            {["Niveau 1", "Niveau 2", "Niveau 3", "Niveau 4", "Niveau 5", "Niveau 6", "Niveau 7", "Niveau 8", "Niveau 9", "Niveau 10"].map((lvl, i) => (
              <span
                key={lvl}
                className="px-3 py-1 rounded-full text-xs font-semibold border"
                style={{
                  borderColor: `${color}${Math.round(30 + i * 10).toString(16)}`,
                  color,
                  background: `${color}${Math.round(8 + i * 4).toString(16).padStart(2, "0")}`,
                  opacity: 0.5 + i * 0.07,
                }}
              >
                {lvl}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LOGO ── */}
      <section className="py-24 px-6 bg-[#f7f8fc]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="relative aspect-square rounded-3xl overflow-hidden order-2 md:order-1 shadow-xl"
          >
            <Image src={LOGO} alt="Logo Cervo" fill className="object-cover" unoptimized />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 md:order-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-2">Branding · Logo</p>
            <h2 className="font-heading font-black text-4xl md:text-6xl mb-6" style={{ color }}>
              Un logo expressif
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-4">
              Le logo reprend les traits expressifs de la mascotte : grandes lunettes, sourire
              malicieux, regard curieux. Il incarne l&apos;esprit ludique et bienveillant de
              l&apos;application.
            </p>
            <p className="text-slate-500 leading-relaxed">
              Des formes arrondies, une typographie épaisse et un bleu vif pour traduire
              l&apos;énergie d&apos;une expérience pensée pour donner envie d&apos;apprendre
              sans pression.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── PROCESS CRÉA ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-2">Coulisses · Recherches</p>
            <h2 className="font-heading font-black text-4xl md:text-6xl text-slate-900">Process de création</h2>
            <p className="text-slate-500 mt-3 text-sm">Des premières esquisses au rendu final</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { src: PROCESS_COVER, alt: "Process création cover", label: "Étape · Cover", title: "Construction visuelle de la cover" },
              { src: PROCESS_LOGO,  alt: "Process création logo",  label: "Étape · Logo",  title: "Itérations sur le logo Cervo" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-3xl overflow-hidden border border-slate-100 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3]">
                  <Image src={item.src} alt={item.alt} fill className="object-cover" unoptimized />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                  <p className="text-slate-800 font-medium">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP SCREENS ── */}
      <section className="py-24 px-6" style={{ background: `linear-gradient(to bottom, #f7f8fc, ${color}10, #f7f8fc)` }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-2">UI · Écrans</p>
            <h2 className="font-heading font-black text-4xl md:text-6xl text-slate-900">L&apos;application en main</h2>
            <p className="text-slate-500 mt-3 text-sm">{SCREENS.length} écrans à parcourir — humeur du jour, quêtes, progression</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <PhoneCarousel color={color} />
          </motion.div>

          {project.detail.link && (
            <div className="mt-12 text-center">
              <a
                href={project.detail.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold border-2 transition-transform hover:scale-105"
                style={{ borderColor: color, color }}
              >
                Tester l&apos;application en ligne
                <ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── CONTEXTE ── */}
      <section className="py-24 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto">

          {/* Défi / Solution */}
          {(project.detail.challenge || project.detail.solution) && (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-6 mb-16">
              {project.detail.challenge && (
                <div className="p-7 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Le défi</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{project.detail.challenge}</p>
                </div>
              )}
              {project.detail.solution && (
                <div className="p-7 rounded-2xl border" style={{ borderColor: `${color}30`, background: `${color}06` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>La solution</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{project.detail.solution}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Description */}
          {project.detail.fullDescription && (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="font-heading font-black text-2xl text-slate-900 mb-4">Description</h2>
              <p className="text-slate-600 leading-relaxed text-lg">{project.detail.fullDescription}</p>
            </motion.div>
          )}

          {/* Stats */}
          {project.detail.stats.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-3 gap-4 mb-16">
              {project.detail.stats.map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 text-center">
                  <p className="font-heading font-black text-3xl md:text-4xl mb-1" style={{ color }}>{stat.value}</p>
                  <p className="text-slate-500 text-xs uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Processus */}
          {project.detail.process.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="font-heading font-black text-2xl text-slate-900 mb-8">Processus</h2>
              <div className="relative">
                <div className="absolute left-7 top-4 bottom-4 w-px" style={{ background: `linear-gradient(to bottom, ${color}, ${color}20)` }} />
                <div className="flex flex-col gap-8">
                  {project.detail.process.map((step, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-heading font-black text-sm text-white shrink-0 z-10 shadow-md" style={{ background: color }}>
                        {step.step}
                      </div>
                      <div className="pt-2">
                        <h4 className="font-heading font-bold text-lg text-slate-900 mb-1">{step.title}</h4>
                        <p className="text-slate-500 leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Stack technique */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="font-heading font-black text-2xl text-slate-900 mb-2">Stack technique</h2>
            <p className="text-slate-500 text-sm mb-8">De la ligne de code au déploiement — les outils qui font tourner l&apos;application.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {TECH_STACK.map((tech, i) => {
                const Icon = tech.icon;
                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-5 rounded-2xl border flex flex-col gap-3 cursor-default"
                    style={{ background: tech.bg, borderColor: tech.border }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${tech.color}15`, color: tech.color }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm" style={{ color: tech.color }}>{tech.name}</p>
                      <p className="text-slate-500 text-xs leading-relaxed mt-0.5">{tech.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Outils design */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 mb-16">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Outils design</h3>
            <div className="flex flex-wrap gap-2">
              {project.detail.tools
                .filter((t) => !TECH_STACK.map((s) => s.name).some((n) => t.startsWith(n)))
                .map((tool) => (
                  <span key={tool} className="px-3 py-1.5 rounded-full text-sm font-medium border" style={{ borderColor: `${color}40`, color, background: `${color}08` }}>
                    {tool}
                  </span>
                ))}
            </div>
          </motion.div>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 mb-24">
            <Link href="/#projects">
              <motion.span
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold border-2 cursor-pointer"
                style={{ borderColor: color, color }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              >
                <ArrowLeft size={16} />
                Tous les projets
              </motion.span>
            </Link>
            {project.detail.link && (
              <a href={project.detail.link} target="_blank" rel="noopener noreferrer">
                <motion.span
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white cursor-pointer"
                  style={{ background: color }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                >
                  Voir le site
                  <ExternalLink size={16} />
                </motion.span>
              </a>
            )}
          </div>

          {/* Prev / Next */}
          {(prevProject || nextProject) && (
            <div className="border-t border-slate-100 pt-10">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mb-6 text-center">Autres projets</p>
              <div className="grid md:grid-cols-2 gap-4">
                {prevProject ? (
                  <Link href={`/projects/${prevProject.slug}`}>
                    <motion.div whileHover={{ x: -4 }} className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group">
                      <ArrowLeft size={20} className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-400 mb-1">Précédent</p>
                        <p className="font-heading font-bold text-sm text-slate-800">{prevProject.title}</p>
                      </div>
                    </motion.div>
                  </Link>
                ) : <div />}
                {nextProject ? (
                  <Link href={`/projects/${nextProject.slug}`}>
                    <motion.div whileHover={{ x: 4 }} className="flex items-center justify-end gap-4 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 mb-1">Suivant</p>
                        <p className="font-heading font-bold text-sm text-slate-800">{nextProject.title}</p>
                      </div>
                      <ArrowRight size={20} className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                    </motion.div>
                  </Link>
                ) : <div />}
              </div>
            </div>
          )}
        </div>
      </section>
    </motion.main>
  );
}
