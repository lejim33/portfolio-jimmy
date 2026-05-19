"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types/portfolio";

const BLUE = "#1a4fd6";
const BLUE_LIGHT = "#4a7bff";
const INK = "#0d0f14";
const OFF_WHITE = "#f5f6fa";
const SOFT = "#eef1f8";
const FONT_SANS = "var(--font-montserrat), 'Montserrat', sans-serif";
const FONT_HEAD = "var(--font-montserrat), 'Montserrat', sans-serif";

export default function LaBelleFinitionDetailClient({
  project,
  allProjects,
}: {
  project: Project;
  allProjects: Project[];
}) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
      style={{ background: "#ffffff", color: INK, fontFamily: FONT_SANS }}
    >
      {/* ── HERO ── */}
      <div className="relative h-screen overflow-hidden flex items-center justify-center">
        {/* Gradient bg clair */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${BLUE}22 0%, transparent 70%), linear-gradient(180deg, #ffffff 0%, ${OFF_WHITE} 100%)`,
          }}
        />

        {/* Grid lines */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 opacity-[0.07]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, ${BLUE} 0px, ${BLUE} 1px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, ${BLUE} 0px, ${BLUE} 1px, transparent 1px, transparent 80px)`,
            }}
          />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-14"
          >
            <Link href="/#projects">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border transition-colors"
                style={{
                  background: "rgba(13,15,20,0.04)",
                  borderColor: "rgba(13,15,20,0.1)",
                  color: "rgba(13,15,20,0.6)",
                  fontFamily: FONT_SANS,
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              >
                <ArrowLeft size={14} />
                Retour aux projets
              </span>
            </Link>
          </motion.div>

          {/* Logo bleu centré (sur fond clair) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-10"
          >
            <div className="relative w-72 h-20 md:w-96 md:h-28">
              <Image
                src="/uploads/la belle finition/LOGO LA BELLE FINITION - BLEU.png"
                alt="La Belle Finition — Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            style={{
              color: BLUE,
              fontFamily: FONT_SANS,
              fontSize: "0.625rem",
              letterSpacing: "0.55em",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "1.25rem",
            }}
          >
            Alternance · La Belle Finition · Bordeaux
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: FONT_HEAD, fontWeight: 700, lineHeight: 1.15, color: INK }}
            className="text-4xl md:text-6xl mb-6"
          >
            Refonte <span style={{ color: BLUE }}>identité visuelle</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            style={{
              color: "rgba(13,15,20,0.6)",
              fontFamily: FONT_SANS,
              fontWeight: 400,
              lineHeight: 1.75,
              maxWidth: "36rem",
              margin: "0 auto 2.5rem",
            }}
          >
            {project.shortDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              `Client : ${project.client}`,
              `Durée : ${project.detail.duration}`,
              `Rôle : ${project.detail.role}`,
            ].map((pill) => (
              <span
                key={pill}
                className="px-4 py-1.5 rounded-full border"
                style={{
                  borderColor: `${BLUE}40`,
                  color: BLUE,
                  background: `${BLUE}0d`,
                  fontFamily: FONT_SANS,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {pill}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span
            style={{
              color: "rgba(13,15,20,0.35)",
              fontFamily: FONT_SANS,
              fontWeight: 500,
              fontSize: "0.625rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
            }}
          >
            Défiler
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-px h-10"
            style={{ background: `linear-gradient(to bottom, ${INK}33, transparent)` }}
          />
        </motion.div>
      </div>

      {/* ── AVANT / APRÈS ── */}
      <section className="py-28 px-6" style={{ background: OFF_WHITE }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p
              style={{
                color: BLUE,
                fontFamily: FONT_SANS,
                fontWeight: 700,
                fontSize: "0.625rem",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Évolution typographique
            </p>
            <h2
              style={{ fontFamily: FONT_HEAD, fontWeight: 700, color: INK }}
              className="text-4xl md:text-5xl"
            >
              Avant · Après
            </h2>
            <p
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 400,
                fontSize: "0.875rem",
                opacity: 0.6,
                maxWidth: "32rem",
                marginTop: "0.75rem",
                lineHeight: 1.7,
                color: INK,
              }}
            >
              La version noire permet une comparaison neutre, centrée uniquement sur la
              typographie — sans l&apos;influence de la couleur.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Ancien logo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden border"
              style={{ borderColor: "rgba(13,15,20,0.08)", background: "#ffffff" }}
            >
              <div className="flex items-center justify-center p-14 min-h-52">
                <div className="relative w-64 h-32">
                  <Image
                    src="/uploads/la belle finition/ANCIEN Logo-La_Belle_Finition-Full BLACK.svg"
                    alt="Ancien logo La Belle Finition"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
              <div
                className="px-8 py-6 border-t"
                style={{ borderColor: "rgba(13,15,20,0.06)", background: "#fafafa" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="px-2.5 py-0.5 rounded-md"
                    style={{
                      background: "#f1f1f1",
                      color: "#666",
                      fontFamily: FONT_SANS,
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    AVANT
                  </span>
                  <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, color: INK, fontSize: "0.9rem" }}>
                    Logo original
                  </p>
                </div>
                <p style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: "0.8rem", opacity: 0.55, color: INK, lineHeight: 1.6 }}>
                  Typographie serif décorative — moins lisible en petit format, rendu moins contemporain.
                </p>
              </div>
            </motion.div>

            {/* Nouveau logo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden border-2"
              style={{ borderColor: BLUE, background: "#ffffff" }}
            >
              <div className="flex items-center justify-center p-14 min-h-52">
                <div className="relative w-64 h-32">
                  <Image
                    src="/uploads/la belle finition/LOGO LA BELLE FINITION black.png"
                    alt="Nouveau logo La Belle Finition noir"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
              <div
                className="px-8 py-6 border-t"
                style={{ borderColor: `${BLUE}20`, background: `${BLUE}06` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="px-2.5 py-0.5 rounded-md"
                    style={{
                      background: BLUE,
                      color: "white",
                      fontFamily: FONT_SANS,
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    APRÈS
                  </span>
                  <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, color: INK, fontSize: "0.9rem" }}>
                    Logo refondu
                  </p>
                </div>
                <p style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: "0.8rem", color: INK, opacity: 0.6, lineHeight: 1.6 }}>
                  Nouvelle typographie sans-serif géométrique — lisible à toutes les tailles, moderne et premium.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Note sur le changement */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 p-7 rounded-2xl flex gap-5 items-start border"
            style={{ borderColor: `${BLUE}25`, background: `${BLUE}08` }}
          >
            <div
              className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5"
              style={{ background: BLUE }}
            >
              <span style={{ color: "white", fontFamily: FONT_SANS, fontSize: "0.75rem", fontWeight: 700 }}>↗</span>
            </div>
            <div>
              <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, color: INK, marginBottom: "0.35rem" }}>
                L&apos;impact du changement typographique
              </p>
              <p style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: "0.875rem", color: INK, opacity: 0.65, lineHeight: 1.7 }}>
                La typographie est l&apos;élément silencieux qui définit le caractère d&apos;une marque. En passant d&apos;une police décorative à une approche sans-serif contemporaine, La Belle Finition affirme son positionnement haut de gamme tout en gagnant en polyvalence sur les supports digitaux, print et signalétique.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── DÉCLINAISONS DU LOGO ── */}
      <section className="py-28 px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p
              style={{
                color: BLUE,
                fontFamily: FONT_SANS,
                fontWeight: 700,
                fontSize: "0.625rem",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Identité de marque
            </p>
            <h2
              style={{ fontFamily: FONT_HEAD, fontWeight: 700, color: INK }}
              className="text-4xl md:text-5xl"
            >
              Les trois déclinaisons
            </h2>
            <p
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 400,
                fontSize: "0.875rem",
                color: "rgba(13,15,20,0.6)",
                maxWidth: "32rem",
                marginTop: "0.75rem",
                lineHeight: 1.7,
              }}
            >
              Chaque version du logo répond à des contraintes de support précises.
            </p>
          </motion.div>

          {/* Version bleue */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 rounded-3xl overflow-hidden border"
            style={{ background: "#ffffff", borderColor: "rgba(13,15,20,0.08)" }}
          >
            <div className="flex flex-col md:flex-row">
              <div
                className="flex-1 flex items-center justify-center p-14"
                style={{ background: SOFT }}
              >
                <div className="relative w-64 h-28">
                  <Image
                    src="/uploads/la belle finition/LOGO LA BELLE FINITION - BLEU.png"
                    alt="Logo La Belle Finition bleu"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
              <div className="md:w-72 p-8 flex flex-col justify-center">
                <p
                  style={{
                    color: BLUE,
                    fontFamily: FONT_SANS,
                    fontSize: "0.625rem",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                  }}
                >
                  Version principale
                </p>
                <h3 style={{ fontFamily: FONT_HEAD, fontWeight: 700, color: INK, fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Logo bleu
                </h3>
                <p style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: "0.8125rem", color: "rgba(13,15,20,0.6)", lineHeight: 1.7 }}>
                  Usage quotidien sur fond blanc. Site web, devis, cartes de visite, réseaux sociaux.
                </p>
                <div
                  className="mt-5 flex items-center gap-2"
                  style={{ paddingTop: "1rem", borderTop: "1px solid rgba(13,15,20,0.08)" }}
                >
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ background: BLUE, border: "1px solid rgba(13,15,20,0.06)" }}
                  />
                  <span style={{ fontSize: "0.75rem", color: "rgba(13,15,20,0.5)", fontFamily: "monospace" }}>
                    #1a4fd6
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Version noir + blanc côte à côte */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden border"
              style={{ background: "#ffffff", borderColor: "rgba(13,15,20,0.08)" }}
            >
              <div
                className="flex items-center justify-center p-12"
                style={{ background: "#f9f9f9" }}
              >
                <div className="relative w-52 h-24">
                  <Image
                    src="/uploads/la belle finition/LOGO LA BELLE FINITION black.png"
                    alt="Logo La Belle Finition noir"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
              <div className="p-7">
                <p
                  style={{
                    color: "rgba(13,15,20,0.45)",
                    fontFamily: FONT_SANS,
                    fontSize: "0.625rem",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}
                >
                  Version monochrome
                </p>
                <h3
                  style={{
                    fontFamily: FONT_HEAD,
                    fontWeight: 700,
                    color: INK,
                    fontSize: "1rem",
                    marginBottom: "0.35rem",
                  }}
                >
                  Logo noir
                </h3>
                <p style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: "0.8rem", color: "rgba(13,15,20,0.6)", lineHeight: 1.6 }}>
                  Impression N&B, tampon, gravure, broderie.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden border"
              style={{ background: "#ffffff", borderColor: "rgba(13,15,20,0.08)" }}
            >
              <div
                className="flex items-center justify-center p-12"
                style={{ background: INK }}
              >
                <div className="relative w-52 h-24">
                  <Image
                    src="/uploads/la belle finition/LOGO LA BELLE FINITION blanc.png"
                    alt="Logo La Belle Finition blanc"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
              <div className="p-7">
                <p
                  style={{
                    color: "rgba(13,15,20,0.45)",
                    fontFamily: FONT_SANS,
                    fontSize: "0.625rem",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}
                >
                  Version monochrome
                </p>
                <h3
                  style={{
                    fontFamily: FONT_HEAD,
                    fontWeight: 700,
                    color: INK,
                    fontSize: "1rem",
                    marginBottom: "0.35rem",
                  }}
                >
                  Logo blanc
                </h3>
                <p style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: "0.8rem", color: "rgba(13,15,20,0.6)", lineHeight: 1.6 }}>
                  Fond sombre, véhicules, panneaux, textile.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Version landscape */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 rounded-3xl overflow-hidden border"
            style={{ background: "#ffffff", borderColor: "rgba(13,15,20,0.08)" }}
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 flex items-center justify-center p-12" style={{ background: SOFT }}>
                <div className="relative w-full max-w-md h-32">
                  <Image
                    src="/uploads/la belle finition/lbf landscape V2.png"
                    alt="Logo La Belle Finition landscape"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
              <div className="md:w-72 p-8">
                <p
                  style={{
                    color: BLUE,
                    fontFamily: FONT_SANS,
                    fontSize: "0.625rem",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}
                >
                  Format horizontal
                </p>
                <h3
                  style={{
                    fontFamily: FONT_HEAD,
                    fontWeight: 700,
                    color: INK,
                    fontSize: "1rem",
                    marginBottom: "0.35rem",
                  }}
                >
                  Version paysage
                </h3>
                <p style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: "0.8rem", color: "rgba(13,15,20,0.6)", lineHeight: 1.6 }}>
                  Déclinaison horizontale pour en-têtes, bannières et signatures email.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── DÉFI / SOLUTION ── */}
      <section className="py-28 px-6" style={{ background: OFF_WHITE }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p
              style={{
                color: BLUE,
                fontFamily: FONT_SANS,
                fontWeight: 700,
                fontSize: "0.625rem",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Contexte du projet
            </p>
            <h2
              style={{ fontFamily: FONT_HEAD, fontWeight: 700, color: INK }}
              className="text-4xl md:text-5xl"
            >
              La mission
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl border"
              style={{ borderColor: "rgba(13,15,20,0.08)", background: "#fff" }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "#f1f5ff" }}
              >
                <div className="w-3 h-3 rounded-full" style={{ background: "#f97316" }} />
              </div>
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 700,
                  fontSize: "0.625rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(13,15,20,0.5)",
                  marginBottom: "0.75rem",
                }}
              >
                Le défi
              </p>
              <p style={{ fontFamily: FONT_SANS, fontWeight: 400, color: INK, lineHeight: 1.75, opacity: 0.8 }}>
                {project.detail.challenge}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl border-2"
              style={{ borderColor: BLUE, background: `${BLUE}06` }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${BLUE}20` }}
              >
                <div className="w-3 h-3 rounded-full" style={{ background: BLUE }} />
              </div>
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 700,
                  fontSize: "0.625rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: BLUE,
                  marginBottom: "0.75rem",
                }}
              >
                La solution
              </p>
              <p style={{ fontFamily: FONT_SANS, fontWeight: 400, color: INK, lineHeight: 1.75, opacity: 0.8 }}>
                {project.detail.solution}
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {project.detail.stats?.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl text-center border"
                style={{ borderColor: `${BLUE}25`, background: "#ffffff" }}
              >
                <p
                  style={{
                    fontFamily: FONT_HEAD,
                    fontWeight: 700,
                    color: BLUE,
                    marginBottom: "0.5rem",
                  }}
                  className="text-3xl md:text-4xl"
                >
                  {stat.value}
                </p>
                <p style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.6875rem", color: INK, opacity: 0.6, lineHeight: 1.4 }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ── */}
      <section className="py-28 px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p
              style={{
                color: BLUE,
                fontFamily: FONT_SANS,
                fontWeight: 700,
                fontSize: "0.625rem",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Méthodologie
            </p>
            <h2
              style={{ fontFamily: FONT_HEAD, fontWeight: 700, color: INK }}
              className="text-4xl md:text-5xl"
            >
              Processus de création
            </h2>
          </motion.div>

          <div className="relative">
            <div
              className="absolute left-7 top-6 bottom-6 w-px"
              style={{
                background: `linear-gradient(to bottom, ${BLUE}, ${BLUE}15)`,
              }}
            />
            <div className="flex flex-col gap-8">
              {project.detail.process.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="flex gap-7 items-start"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 z-10 shadow-lg"
                    style={{
                      background: BLUE,
                      fontFamily: FONT_HEAD,
                      fontWeight: 700,
                      fontSize: "0.875rem",
                    }}
                  >
                    {step.step}
                  </div>
                  <div
                    className="pt-3 pb-2 flex-1 border-b"
                    style={{ borderColor: "rgba(13,15,20,0.08)" }}
                  >
                    <h4
                      style={{
                        fontFamily: FONT_HEAD,
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        color: INK,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: FONT_SANS,
                        fontWeight: 400,
                        color: "rgba(13,15,20,0.6)",
                        lineHeight: 1.7,
                        fontSize: "0.875rem",
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Outils */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 p-7 rounded-2xl border flex flex-wrap gap-3 items-center"
            style={{ borderColor: `${BLUE}25`, background: `${BLUE}06` }}
          >
            <p
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 700,
                fontSize: "0.625rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(13,15,20,0.5)",
                width: "100%",
                marginBottom: "0.25rem",
              }}
            >
              Outils utilisés
            </p>
            {project.detail.tools.map((tool) => (
              <span
                key={tool}
                className="px-4 py-1.5 rounded-full border"
                style={{
                  borderColor: `${BLUE}45`,
                  color: BLUE,
                  background: "#ffffff",
                  fontFamily: FONT_SANS,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {tool}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── NAV PROJETS ── */}
      <section className="py-20 px-6" style={{ background: OFF_WHITE, borderTop: "1px solid rgba(13,15,20,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <Link href="/#projects">
            <motion.span
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 cursor-pointer mb-14"
              style={{ borderColor: BLUE, color: BLUE, fontFamily: FONT_SANS, fontWeight: 600 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <ArrowLeft size={16} />
              Tous les projets
            </motion.span>
          </Link>

          {(prevProject || nextProject) && (
            <div className="border-t pt-10" style={{ borderColor: "rgba(13,15,20,0.08)" }}>
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontWeight: 700,
                  fontSize: "0.625rem",
                  color: "rgba(13,15,20,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  marginBottom: "1.5rem",
                  textAlign: "center",
                }}
              >
                Autres projets
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {prevProject ? (
                  <Link href={`/projects/${prevProject.slug}`}>
                    <motion.div
                      whileHover={{ x: -4 }}
                      className="flex items-center gap-4 p-5 rounded-2xl border transition-all group"
                      style={{ borderColor: "rgba(13,15,20,0.08)", background: "#ffffff" }}
                    >
                      <ArrowLeft
                        size={20}
                        className="shrink-0 opacity-40 group-hover:opacity-80 transition-opacity"
                        style={{ color: BLUE }}
                      />
                      <div>
                        <p style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.625rem", color: "rgba(13,15,20,0.5)", marginBottom: "0.25rem" }}>
                          Précédent
                        </p>
                        <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "0.875rem", color: INK }}>
                          {prevProject.title}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ) : (
                  <div />
                )}
                {nextProject ? (
                  <Link href={`/projects/${nextProject.slug}`}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-end gap-4 p-5 rounded-2xl border transition-all group"
                      style={{ borderColor: "rgba(13,15,20,0.08)", background: "#ffffff" }}
                    >
                      <div className="text-right">
                        <p style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.625rem", color: "rgba(13,15,20,0.5)", marginBottom: "0.25rem" }}>
                          Suivant
                        </p>
                        <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "0.875rem", color: INK }}>
                          {nextProject.title}
                        </p>
                      </div>
                      <ArrowRight
                        size={20}
                        className="shrink-0 opacity-40 group-hover:opacity-80 transition-opacity"
                        style={{ color: BLUE }}
                      />
                    </motion.div>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </motion.main>
  );
}
