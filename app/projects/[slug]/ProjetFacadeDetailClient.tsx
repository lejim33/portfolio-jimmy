"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types/portfolio";

const COPPER = "#C9846A";
const COPPER_LIGHT = "#D19374";
const COPPER_DARK = "#A5624D";
const DARK = "#2C2A28";
const CREAM = "#F6F0EA";
const GARET = "'Garet', sans-serif";
const QUICKSAND = "'Quicksand', sans-serif";

const PALETTE = [
  { name: "Cuivre principal", hex: "#C9846A", cmjn: "C0 M45 J50 N20", usage: "Logo · Titres · Accents" },
  { name: "Cuivre clair", hex: "#D9A88C", cmjn: "C0 M35 J40 N10", usage: "Fonds · Dégradés" },
  { name: "Anthracite", hex: "#2C2A28", cmjn: "C65 M60 J60 N55", usage: "Textes · Fond sombre" },
  { name: "Blanc cassé", hex: "#F6F0EA", cmjn: "C2 M3 J5 N0", usage: "Fond principal · Respiration" },
  { name: "Blanc pur", hex: "#FFFFFF", cmjn: "C0 M0 J0 N0", usage: "Logo blanc · Superpositions" },
];

const TYPO = [
  { role: "Titre principal", family: "Garet", weight: "700 — Bold", specimen: "Pro'Jet Façade", font: GARET, fontWeight: 700, note: "Titres, logotype, panneaux" },
  { role: "Corps de texte", family: "Quicksand", weight: "400 — Regular", specimen: "Traitement de façades à Bordeaux.", font: QUICKSAND, fontWeight: 400, note: "Corps, descriptions, devis" },
  { role: "Labels & Overlines", family: "Quicksand", weight: "700 — Bold", specimen: "CHARTE GRAPHIQUE · 2025", font: QUICKSAND, fontWeight: 700, note: "Sous-titres, étiquettes, codes" },
];

function ColorSwatch({ name, hex, cmjn, usage, index }: {
  name: string; hex: string; cmjn: string; usage: string; index: number;
}) {
  const isDark = hex === "#2C2A28";
  const textCol = isDark ? "#F6F0EA" : "#2C2A28";
  const subCol = isDark ? "rgba(246,240,234,0.5)" : "rgba(44,42,40,0.45)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="rounded-2xl overflow-hidden shadow-md flex flex-col"
      style={{ background: hex, border: hex === "#FFFFFF" ? "1px solid rgba(44,42,40,0.1)" : "none" }}
    >
      <div className="h-36" />
      <div className="p-5 flex flex-col gap-1">
        <p style={{ color: textCol, fontFamily: QUICKSAND, fontWeight: 600, fontSize: "0.875rem", lineHeight: 1.3 }}>{name}</p>
        <p style={{ color: textCol, fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 600 }}>{hex}</p>
        <p style={{ color: subCol, fontSize: "0.625rem", marginTop: "0.25rem", fontFamily: QUICKSAND }}>{cmjn}</p>
        <p style={{ color: subCol, fontSize: "0.625rem", fontFamily: QUICKSAND }}>{usage}</p>
      </div>
    </motion.div>
  );
}

export default function ProjetFacadeDetailClient({ project, allProjects }: { project: Project; allProjects: Project[] }) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
      style={{ background: CREAM, color: DARK, fontFamily: QUICKSAND }}
    >

      {/* ── HERO ── */}
      <div className="relative h-screen overflow-hidden flex items-center justify-center" style={{ background: CREAM }}>
        <motion.div style={{ y: heroY }} className="absolute inset-0 -top-24 -bottom-24 opacity-[0.08]">
          <div className="w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${COPPER} 0px, ${COPPER} 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, ${COPPER} 0px, ${COPPER} 1px, transparent 1px, transparent 60px)`,
          }} />
        </motion.div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${COPPER}, transparent)` }} />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
            <Link href="/#projects">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-black/5 transition-colors border"
                style={{ borderColor: `${DARK}15`, color: `${DARK}99`, fontFamily: QUICKSAND, fontSize: "0.875rem", fontWeight: 500 }}>
                <ArrowLeft size={15} />
                Retour aux projets
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6 mb-10"
          >
            <div className="w-28 h-28 relative flex items-center justify-center">
              <Image src="/uploads/projet-facade/picto.png" alt="Picto Pro'Jet Façade" fill className="object-contain" unoptimized />
            </div>

            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ color: COPPER, fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.55em", textTransform: "uppercase", marginBottom: "1rem" }}
              >
                Alternance · La Belle Finition · Bordeaux
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: GARET, fontWeight: 700, color: DARK, lineHeight: 1.15 }}
                className="text-4xl md:text-6xl"
              >
                <span style={{ color: COPPER }}>PRO&apos;JET</span><br />
                Façade
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              style={{ color: `${DARK}99`, opacity: 0.7, fontFamily: QUICKSAND, fontSize: "1rem", lineHeight: 1.7 }}
              className="max-w-md mx-auto"
            >
              {project.shortDescription}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[`Client : ${project.client}`, `Durée : ${project.detail.duration}`, `Rôle : ${project.detail.role}`].map((pill) => (
              <span key={pill} className="px-4 py-1.5 rounded-full border"
                style={{ borderColor: `${COPPER}50`, color: COPPER_DARK, background: `${COPPER}10`, fontFamily: QUICKSAND, fontSize: "0.75rem", fontWeight: 600 }}>
                {pill}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span style={{ color: `${DARK}55`, fontSize: "0.625rem", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: QUICKSAND }}>Défiler</span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-px h-10" style={{ background: `linear-gradient(to bottom, ${DARK}40, transparent)` }} />
        </motion.div>
      </div>

      {/* ── LOGO & PICTO ── */}
      <section className="py-28 px-6" style={{ background: CREAM }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p style={{ color: COPPER, fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Identité de marque</p>
            <h2 style={{ fontFamily: GARET, fontWeight: 700, color: DARK }} className="text-4xl md:text-5xl">Logo & Picto</h2>
            <p style={{ fontFamily: QUICKSAND, fontSize: "0.875rem", opacity: 0.6, maxWidth: "32rem", marginTop: "0.75rem", lineHeight: 1.7 }}>
              Trois déclinaisons du logo pour s&apos;adapter à tous les supports.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Logo couleur */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-3xl p-12 flex flex-col items-center justify-center gap-8 border"
              style={{ borderColor: `${COPPER}20`, background: "#FFFFFF" }}>
              <div className="relative w-56 h-56">
                <Image src="/uploads/projet-facade/logo.png" alt="Logo Pro'Jet Façade couleur" fill className="object-contain" unoptimized />
              </div>
              <div className="text-center">
                <p style={{ fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.35em", textTransform: "uppercase", opacity: 0.4 }}>Version couleur</p>
                <p style={{ fontFamily: QUICKSAND, fontSize: "0.75rem", opacity: 0.5, marginTop: "0.25rem" }}>Fond clair — usage digital & print</p>
              </div>
            </motion.div>

            {/* Logo noir */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-3xl p-12 flex flex-col items-center justify-center gap-8 border"
              style={{ borderColor: `${COPPER}20`, background: "#FFFFFF" }}>
              <div className="relative w-56 h-56">
                <Image src="/uploads/projet-facade/logo projet facade black.png" alt="Logo Pro'Jet Façade noir" fill className="object-contain" unoptimized />
              </div>
              <div className="text-center">
                <p style={{ fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.35em", textTransform: "uppercase", opacity: 0.4 }}>Version monochrome noir</p>
                <p style={{ fontFamily: QUICKSAND, fontSize: "0.75rem", opacity: 0.5, marginTop: "0.25rem" }}>Impression N&B · Tampon · Gravure</p>
              </div>
            </motion.div>
          </div>

          {/* Logo blanc — présenté sur cartouche cuivré */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-6 rounded-3xl p-10 flex flex-col sm:flex-row items-center justify-between gap-8"
            style={{ background: `linear-gradient(135deg, ${COPPER} 0%, ${COPPER_LIGHT} 100%)` }}>
            <div className="relative w-56 h-40">
              <Image src="/uploads/projet-facade/LOGO PROJET FACADE white.png" alt="Logo Pro'Jet Façade blanc" fill className="object-contain" unoptimized />
            </div>
            <div className="text-right sm:max-w-xs">
              <p style={{ fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "0.5rem" }}>Version monochrome blanc</p>
              <p style={{ fontFamily: GARET, fontWeight: 700, color: "white", fontSize: "1rem" }}>Fond sombre · Panneaux · Véhicules</p>
              <p style={{ fontFamily: QUICKSAND, fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginTop: "0.25rem", lineHeight: 1.6 }}>Utilisée sur fond anthracite ou cuivré. Ne pas placer sur fond clair.</p>
            </div>
          </motion.div>

          {/* Picto seul */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-6 rounded-3xl p-10 flex flex-col sm:flex-row items-center gap-10 border"
            style={{ borderColor: `${COPPER}20`, background: "#FFFFFF" }}>
            <div className="relative w-24 h-24">
              <Image src="/uploads/projet-facade/picto.png" alt="Picto seul" fill className="object-contain" unoptimized />
            </div>
            <div className="flex-1">
              <p style={{ fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.35em", textTransform: "uppercase", opacity: 0.4, marginBottom: "0.5rem" }}>Pictogramme seul</p>
              <p style={{ fontFamily: GARET, fontWeight: 700, fontSize: "1.125rem", color: DARK }}>Favicon · App icon · Tampon</p>
              <p style={{ fontFamily: QUICKSAND, fontSize: "0.875rem", opacity: 0.55, marginTop: "0.25rem", lineHeight: 1.7 }}>La silhouette double-maison est utilisable seule dès 24 px. Espace de protection = 1× la hauteur du toit.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PALETTE ── */}
      <section className="py-28 px-6" style={{ background: "#FBF7F3" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p style={{ color: COPPER, fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Identité chromatique</p>
            <h2 style={{ fontFamily: GARET, fontWeight: 700, color: DARK }} className="text-4xl md:text-5xl">Palette de couleurs</h2>
            <p style={{ fontFamily: QUICKSAND, fontSize: "0.875rem", color: `${DARK}99`, opacity: 0.7, maxWidth: "32rem", marginTop: "0.75rem", lineHeight: 1.7 }}>
              Une palette chaude et professionnelle ancrée dans les teintes cuivrées — évoquant la pierre, la façade et l&apos;artisanat d&apos;excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {PALETTE.map((c, i) => <ColorSwatch key={c.hex} {...c} index={i} />)}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10 grid md:grid-cols-3 gap-4">
            {[
              { rule: "Jamais deux fonds colorés adjacents", detail: "Toujours séparer par blanc cassé ou anthracite." },
              { rule: "Ratio texte minimum 4.5:1", detail: "Anthracite sur blanc cassé : ratio 12:1. Cuivre sur blanc : 3.8:1 — réservé grands titres." },
              { rule: "Dégradé autorisé uniquement en fond", detail: "Les dégradés cuivre → cuivre clair restent réservés aux arrière-plans, jamais au texte." },
            ].map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl border" style={{ borderColor: `${COPPER}25`, background: "#fff" }}>
                <div className="w-5 h-5 rounded-full mb-3" style={{ background: COPPER }} />
                <p style={{ fontFamily: QUICKSAND, fontWeight: 600, fontSize: "0.875rem", color: DARK, marginBottom: "0.25rem" }}>{r.rule}</p>
                <p style={{ fontFamily: QUICKSAND, fontSize: "0.6875rem", color: `${DARK}99`, opacity: 0.6, lineHeight: 1.6 }}>{r.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TYPOGRAPHIE ── */}
      <section className="py-28 px-6" style={{ background: CREAM }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p style={{ color: COPPER, fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Système typographique</p>
            <h2 style={{ fontFamily: GARET, fontWeight: 700, color: DARK }} className="text-4xl md:text-5xl">Typographies</h2>
          </motion.div>

          <div className="flex flex-col gap-6">
            {TYPO.map((t, i) => (
              <motion.div key={t.role}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="rounded-3xl p-8 md:p-12 border flex flex-col md:flex-row md:items-center gap-6"
                style={{ borderColor: `${COPPER}20`, background: "#fff" }}>
                <div className="md:w-48 shrink-0">
                  <p style={{ color: COPPER, fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "0.25rem" }}>{t.role}</p>
                  <p style={{ fontFamily: QUICKSAND, fontWeight: 600, fontSize: "0.875rem", color: DARK }}>{t.family}</p>
                  <p style={{ fontFamily: QUICKSAND, fontSize: "0.75rem", opacity: 0.45 }}>{t.weight}</p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p style={{
                    fontFamily: t.font,
                    fontWeight: t.fontWeight,
                    color: DARK,
                    lineHeight: 1.1,
                    fontSize: i === 0 ? "clamp(2rem, 5vw, 4rem)" : i === 2 ? "0.75rem" : "1.25rem",
                    letterSpacing: i === 2 ? "0.4em" : undefined,
                  }}>
                    {t.specimen}
                  </p>
                </div>
                <div className="md:w-44 shrink-0 text-right">
                  <p style={{ fontFamily: QUICKSAND, fontSize: "0.625rem", opacity: 0.45, lineHeight: 1.6 }}>{t.note}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRINT ── */}
      <section className="py-28 px-6" style={{ background: CREAM }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p style={{ color: COPPER, fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Supports imprimés</p>
            <h2 style={{ fontFamily: GARET, fontWeight: 700, color: DARK }} className="text-4xl md:text-5xl">Print & Prospection</h2>
            <p style={{ fontFamily: QUICKSAND, fontSize: "0.875rem", opacity: 0.6, maxWidth: "32rem", marginTop: "0.75rem", lineHeight: 1.7 }}>
              Dépliant A3 plié A4 et flyer A5 dédié à la prospection terrain — déclinaison cohérente de l&apos;identité visuelle.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl overflow-hidden border shadow-xl"
            style={{ borderColor: `${COPPER}20`, background: "#fff" }}
          >
            <div className="relative w-full aspect-[4/3]">
              <Image
                src="/uploads/projet-facade/PRINT PROJET FACADE.jpeg"
                alt="Print Pro'Jet Façade — dépliant A3 et flyer A5"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="p-6 rounded-2xl border" style={{ borderColor: `${COPPER}20`, background: "#fff" }}>
              <p style={{ color: COPPER, fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Dépliant</p>
              <p style={{ fontFamily: GARET, fontWeight: 700, fontSize: "1.125rem", color: DARK }}>A3 ouvert · A4 fermé</p>
              <p style={{ fontFamily: QUICKSAND, fontSize: "0.875rem", opacity: 0.6, marginTop: "0.25rem", lineHeight: 1.7 }}>
                Plaquette commerciale détaillée présentant les services, le savoir-faire et les références de l&apos;entreprise.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl border" style={{ borderColor: `${COPPER}20`, background: "#fff" }}>
              <p style={{ color: COPPER, fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Flyer</p>
              <p style={{ fontFamily: GARET, fontWeight: 700, fontSize: "1.125rem", color: DARK }}>A5 — Prospection terrain</p>
              <p style={{ fontFamily: QUICKSAND, fontSize: "0.875rem", opacity: 0.6, marginTop: "0.25rem", lineHeight: 1.7 }}>
                Format compact distribué en porte-à-porte et boîtes aux lettres pour générer des contacts qualifiés.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SITE WEB ── */}
      <section className="py-28 px-6" style={{ background: CREAM }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p style={{ color: COPPER, fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Site internet</p>
            <h2 style={{ fontFamily: GARET, fontWeight: 700, color: DARK }} className="text-4xl md:text-5xl">Site web</h2>
            <p style={{ fontFamily: QUICKSAND, fontSize: "0.875rem", color: `${DARK}99`, maxWidth: "34rem", marginTop: "0.75rem", lineHeight: 1.7, opacity: 0.7 }}>
              Conception et réalisation complète du site vitrine — vitrine commerciale alignée sur l&apos;identité visuelle de la marque.
            </p>

            <a
              href="https://www.projetfacade.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full border-2 transition-colors hover:bg-black/5"
              style={{ borderColor: COPPER, color: COPPER_DARK, fontFamily: QUICKSAND, fontWeight: 600, fontSize: "0.875rem" }}
            >
              www.projetfacade.fr
              <ExternalLink size={15} />
            </a>
          </motion.div>

          {/* Browser mockup — screen 1 large */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden shadow-xl border"
            style={{ borderColor: `${COPPER}25`, background: "#fff" }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: `${DARK}10`, background: "#f3ede6" }}>
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
              </div>
              <div className="flex-1 mx-4 px-3 py-1.5 rounded-md flex items-center gap-2"
                style={{ background: "#fff", border: `1px solid ${DARK}10`, fontFamily: QUICKSAND, fontSize: "0.75rem", color: `${DARK}99` }}>
                <span style={{ color: COPPER }}>●</span>
                www.projetfacade.fr
              </div>
            </div>
            <div className="relative w-full" style={{ aspectRatio: "16/10", background: "#fff" }}>
              <Image
                src="/uploads/projet-facade/mock up site/screen site 1.png"
                alt="Site Pro'Jet Façade — page d'accueil"
                fill
                className="object-cover object-top"
                unoptimized
              />
            </div>
          </motion.div>

          {/* Other screens grid */}
          <div className="grid sm:grid-cols-2 gap-5 mt-6">
            {[2, 3, 4, 5].map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="rounded-xl overflow-hidden border shadow-md"
                style={{ borderColor: `${COPPER}25`, background: "#fff" }}
              >
                <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ borderColor: `${DARK}10`, background: "#f3ede6" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "#ff5f57" }} />
                  <span className="w-2 h-2 rounded-full" style={{ background: "#febc2e" }} />
                  <span className="w-2 h-2 rounded-full" style={{ background: "#28c840" }} />
                </div>
                <div className="relative w-full" style={{ aspectRatio: "16/10", background: "#fff" }}>
                  <Image
                    src={`/uploads/projet-facade/mock up site/screen site ${n}.png`}
                    alt={`Site Pro'Jet Façade — capture ${n}`}
                    fill
                    className="object-cover object-top"
                    unoptimized
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DÉFI / SOLUTION ── */}
      <section className="py-28 px-6" style={{ background: "#FBF7F3" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p style={{ color: COPPER, fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Contexte du projet</p>
            <h2 style={{ fontFamily: GARET, fontWeight: 700, color: DARK }} className="text-4xl md:text-5xl">La mission</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="p-8 rounded-3xl border" style={{ borderColor: `${DARK}15`, background: "#fff" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-5" style={{ background: `${COPPER}20` }}>
                <div className="w-3 h-3 rounded-full" style={{ background: "#f97316" }} />
              </div>
              <p style={{ fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.15em", textTransform: "uppercase", color: `${DARK}80`, opacity: 0.55, marginBottom: "0.75rem" }}>Le défi</p>
              <p style={{ fontFamily: QUICKSAND, color: DARK, opacity: 0.85, lineHeight: 1.75 }}>{project.detail.challenge}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl border" style={{ borderColor: `${COPPER}40`, background: `${COPPER}10` }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-5" style={{ background: `${COPPER}25` }}>
                <div className="w-3 h-3 rounded-full" style={{ background: COPPER }} />
              </div>
              <p style={{ fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.15em", textTransform: "uppercase", color: COPPER_DARK, marginBottom: "0.75rem" }}>La solution</p>
              <p style={{ fontFamily: QUICKSAND, color: DARK, opacity: 0.85, lineHeight: 1.75 }}>{project.detail.solution}</p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-3 gap-4">
            {project.detail.stats?.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl text-center border" style={{ borderColor: `${COPPER}35`, background: "#fff" }}>
                <p style={{ fontFamily: GARET, fontWeight: 700, color: COPPER, marginBottom: "0.5rem" }} className="text-3xl md:text-4xl">{stat.value}</p>
                <p style={{ fontFamily: QUICKSAND, fontSize: "0.6875rem", color: `${DARK}99`, opacity: 0.65, lineHeight: 1.4 }}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROCESSUS ── */}
      <section className="py-28 px-6" style={{ background: CREAM }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p style={{ color: COPPER, fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Méthodologie</p>
            <h2 style={{ fontFamily: GARET, fontWeight: 700, color: DARK }} className="text-4xl md:text-5xl">Processus de création</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-7 top-6 bottom-6 w-px" style={{ background: `linear-gradient(to bottom, ${COPPER}, ${COPPER}15)` }} />
            <div className="flex flex-col gap-8">
              {project.detail.process.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                  className="flex gap-7 items-start">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 z-10 shadow-lg"
                    style={{ background: COPPER, fontFamily: GARET, fontWeight: 700, fontSize: "0.875rem" }}>
                    {step.step}
                  </div>
                  <div className="pt-3 pb-2 flex-1 border-b" style={{ borderColor: `${DARK}12` }}>
                    <h4 style={{ fontFamily: GARET, fontWeight: 700, fontSize: "1.125rem", color: DARK, marginBottom: "0.25rem" }}>{step.title}</h4>
                    <p style={{ fontFamily: QUICKSAND, opacity: 0.6, lineHeight: 1.7, fontSize: "0.875rem" }}>{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-14 p-7 rounded-2xl border flex flex-wrap gap-3 items-center" style={{ borderColor: `${COPPER}25`, background: "#fff" }}>
            <p style={{ fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.4, width: "100%", marginBottom: "0.25rem" }}>Outils utilisés</p>
            {project.detail.tools.map((tool) => (
              <span key={tool} className="px-4 py-1.5 rounded-full border"
                style={{ borderColor: `${COPPER}45`, color: COPPER_DARK, background: `${COPPER}10`, fontFamily: QUICKSAND, fontSize: "0.875rem", fontWeight: 600 }}>
                {tool}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TÉMOIGNAGE ── */}
      {project.detail.testimonial && (
        <section className="py-28 px-6" style={{ background: "#FBF7F3" }}>
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <div style={{ fontSize: "4rem", color: COPPER, opacity: 0.45, marginBottom: "1.5rem", fontFamily: GARET }}>&ldquo;</div>
              <blockquote style={{ fontFamily: GARET, fontWeight: 700, color: DARK, fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", lineHeight: 1.6, marginBottom: "2rem" }}>
                {project.detail.testimonial.quote}
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-px" style={{ background: COPPER }} />
                <div className="text-center">
                  <p style={{ fontFamily: GARET, fontWeight: 700, fontSize: "0.875rem", color: DARK }}>{project.detail.testimonial.author}</p>
                  <p style={{ fontFamily: QUICKSAND, fontSize: "0.75rem", color: COPPER_DARK }}>{project.detail.testimonial.role}</p>
                </div>
                <div className="w-10 h-px" style={{ background: COPPER }} />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── NAV PROJETS ── */}
      <section className="py-20 px-6" style={{ background: CREAM }}>
        <div className="max-w-5xl mx-auto">
          <Link href="/#projects">
            <motion.span
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 cursor-pointer mb-14"
              style={{ borderColor: COPPER, color: COPPER, fontFamily: QUICKSAND, fontWeight: 600 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <ArrowLeft size={16} />
              Tous les projets
            </motion.span>
          </Link>

          {(prevProject || nextProject) && (
            <div className="border-t pt-10" style={{ borderColor: `${DARK}15` }}>
              <p style={{ fontFamily: QUICKSAND, fontWeight: 700, fontSize: "0.625rem", opacity: 0.35, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1.5rem", textAlign: "center" }}>Autres projets</p>
              <div className="grid md:grid-cols-2 gap-4">
                {prevProject ? (
                  <Link href={`/projects/${prevProject.slug}`}>
                    <motion.div whileHover={{ x: -4 }} className="flex items-center gap-4 p-5 rounded-2xl border transition-all group"
                      style={{ borderColor: `${DARK}15`, background: "#fff" }}>
                      <ArrowLeft size={20} className="shrink-0 opacity-30 group-hover:opacity-60 transition-opacity" />
                      <div>
                        <p style={{ fontFamily: QUICKSAND, fontSize: "0.625rem", opacity: 0.4, marginBottom: "0.25rem" }}>Précédent</p>
                        <p style={{ fontFamily: GARET, fontWeight: 700, fontSize: "0.875rem", color: DARK }}>{prevProject.title}</p>
                      </div>
                    </motion.div>
                  </Link>
                ) : <div />}
                {nextProject ? (
                  <Link href={`/projects/${nextProject.slug}`}>
                    <motion.div whileHover={{ x: 4 }} className="flex items-center justify-end gap-4 p-5 rounded-2xl border transition-all group"
                      style={{ borderColor: `${DARK}15`, background: "#fff" }}>
                      <div className="text-right">
                        <p style={{ fontFamily: QUICKSAND, fontSize: "0.625rem", opacity: 0.4, marginBottom: "0.25rem" }}>Suivant</p>
                        <p style={{ fontFamily: GARET, fontWeight: 700, fontSize: "0.875rem", color: DARK }}>{nextProject.title}</p>
                      </div>
                      <ArrowRight size={20} className="shrink-0 opacity-30 group-hover:opacity-60 transition-opacity" />
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
