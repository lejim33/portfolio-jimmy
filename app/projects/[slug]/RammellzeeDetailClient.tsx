"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { Project } from "@/types/portfolio";

const STORIES = [
  { src: "/uploads/rammellzee/story/GUN.mp4", label: "GUN" },
  { src: "/uploads/rammellzee/story/perso%201%20.mp4", label: "PERSONNAGE I" },
  { src: "/uploads/rammellzee/story/PERSO%202%20.mp4", label: "PERSONNAGE II" },
];

const CAROUSEL = [
  "/uploads/rammellzee/Caroussel/SLIDE1DIAPO.png",
  "/uploads/rammellzee/Caroussel/SLIDE2DIAPO.jpg",
  "/uploads/rammellzee/Caroussel/SLIDE3DIAPO.jpg",
  "/uploads/rammellzee/Caroussel/SLIDE4DIAPO.jpg",
];

function PhoneStory({ src, label, index }: { src: string; label: string; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.18, duration: 0.7, ease: "easeOut" }}
      className="flex flex-col items-center gap-4"
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative cursor-pointer"
        style={{ width: 160, height: 290 }}
        onClick={toggle}
      >
        {/* Phone shell */}
        <div className="absolute inset-0 rounded-[2.2rem] bg-[#222] border-[3px] border-[#3d3d3d] shadow-2xl overflow-hidden"
          style={{ boxShadow: playing ? "0 0 40px rgba(230,57,70,0.3)" : "0 8px 40px rgba(0,0,0,0.7)" }}>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-[18px] bg-[#222] rounded-b-xl z-20" />
          {/* Screen */}
          <div className="absolute inset-[5px] rounded-[1.8rem] overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={src}
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Story progress bar */}
            <div className="absolute top-4 left-3 right-3 z-10">
              <div className="h-[2px] w-full rounded-full bg-white/30" />
            </div>
            <AnimatePresence>
              {!playing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40"
                >
                  <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <Play size={18} className="text-white ml-0.5" fill="white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-white/15" />
        </div>
      </motion.div>
      <span className="text-[10px] font-bold text-white/55 tracking-[0.25em] uppercase">{label}</span>
    </motion.div>
  );
}

function InstagramCarousel({ color }: { color: string }) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((i) => (i - 1 + CAROUSEL.length) % CAROUSEL.length);
  const next = () => setCurrent((i) => (i + 1) % CAROUSEL.length);

  return (
    <div className="max-w-[420px] mx-auto">
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#222]">
        {/* IG header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <div className="w-8 h-8 rounded-full p-[2px]" style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
            <div className="w-full h-full rounded-full bg-[#222] flex items-center justify-center text-xs font-bold text-white">J</div>
          </div>
          <div>
            <p className="text-white text-xs font-semibold leading-none">jimmy.bts</p>
            <p className="text-white/50 text-[10px]">CAPC Bordeaux</p>
          </div>
          <span className="ml-auto text-white/50 text-lg leading-none">···</span>
        </div>

        {/* Slide */}
        <div className="relative aspect-square bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <Image src={CAROUSEL[current]} alt={`Slide ${current + 1}`} fill className="object-contain" unoptimized />
            </motion.div>
          </AnimatePresence>

          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 backdrop-blur text-white flex items-center justify-center transition-colors hover:bg-black/80">
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 backdrop-blur text-white flex items-center justify-center transition-colors hover:bg-black/80">
            <ChevronRight size={14} />
          </button>

          <div className="absolute top-2 right-2 text-[10px] font-semibold bg-black/60 backdrop-blur text-white/60 px-2 py-0.5 rounded-full">
            {current + 1}/{CAROUSEL.length}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 py-3">
          {CAROUSEL.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrent(i)}
              animate={{ width: i === current ? 20 : 6 }}
              className="h-1.5 rounded-full transition-colors"
              style={{ background: i === current ? color : "rgba(255,255,255,0.2)" }}
            />
          ))}
        </div>

        {/* IG actions */}
        <div className="px-4 pb-4 flex items-center gap-4 text-white/60 text-xs border-t border-white/10 pt-3">
          <span>♥ 142</span>
          <span>💬 8</span>
          <span className="ml-auto">↗</span>
        </div>
      </div>
    </div>
  );
}

export default function RammellzeeDetailClient({ project, allProjects }: { project: Project; allProjects: Project[] }) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 130]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;
  const color = project.detail.color;

  const electric = "#00b3ff";
  const accent = color;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen text-slate-900"
      style={{ background: "linear-gradient(180deg, #ffffff 0%, #f4faff 30%, #e6f4ff 60%, #cfeaff 100%)" }}
    >

      {/* ── HERO ── */}
      <div className="relative h-screen overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: heroY }} className="absolute inset-0 -top-24 -bottom-24">
          <Image
            src="/uploads/rammellzee/affiche%20mock.png"
            alt="Affiche Rammellzee"
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/55 to-white" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
            <Link href="/#projects">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 px-3 py-1.5 rounded-full backdrop-blur-sm bg-white/70 border border-slate-200 hover:bg-white transition-colors">
                <ArrowLeft size={16} />
                Retour aux projets
              </span>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] mb-5"
            style={{ color: electric }}
          >
            Projet scolaire · CAPC Bordeaux
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-black text-5xl md:text-8xl leading-none mb-6 uppercase"
            style={{ color: accent, textShadow: `0 4px 30px ${electric}40` }}
          >
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-slate-700 text-lg max-w-xl mx-auto"
          >
            {project.shortDescription}
          </motion.p>

          <motion.div
            style={{ opacity: heroOpacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-slate-500 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-px h-10"
              style={{ background: `linear-gradient(to bottom, ${electric}, transparent)` }}
            />
          </motion.div>
        </div>
      </div>

      {/* ── VIDÉO 3D ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-2" style={{ color: electric }}>Motion Design · After Effects</p>
            <h2 className="font-heading font-black text-4xl md:text-5xl" style={{ color: accent }}>Vidéo 3D</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white"
            style={{ boxShadow: `0 30px 80px ${electric}25` }}
          >
            <video
              src="/uploads/rammellzee/Video%203D%20after%20effect.mp4"
              controls
              loop
              muted
              playsInline
              className="w-full aspect-video block bg-black"
            />
          </motion.div>
        </div>
      </section>

      {/* ── AFFICHE ── */}
      <section className="py-16 px-6" style={{ background: `linear-gradient(to bottom, transparent, ${electric}12, transparent)` }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-2" style={{ color: electric }}>Print · Photoshop</p>
            <h2 className="font-heading font-black text-4xl md:text-5xl" style={{ color: accent }}>Affiche expo</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative max-w-md mx-auto rounded-2xl overflow-hidden bg-white"
            style={{ boxShadow: `0 40px 80px ${electric}30, 0 0 0 1px rgba(15,23,42,0.06)` }}
          >
            <Image
              src="/uploads/rammellzee/affiche%20mock.png"
              alt="Affiche mock Rammellzee"
              width={800}
              height={1100}
              className="w-full h-auto block"
              unoptimized
            />
          </motion.div>
        </div>
      </section>

      {/* ── STORIES ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mb-16 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-2" style={{ color: electric }}>Instagram · Réseaux sociaux</p>
            <h2 className="font-heading font-black text-4xl md:text-5xl" style={{ color: accent }}>Stories</h2>
            <p className="text-slate-600 mt-3 text-sm">3 visuels animés pour la campagne de l&apos;exposition</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center gap-10 md:gap-20 items-end">
            {STORIES.map((s, i) => <PhoneStory key={i} src={s.src} label={s.label} index={i} />)}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center text-slate-500 text-[10px] mt-10 tracking-widest uppercase"
          >
            Appuyez sur un téléphone pour lancer
          </motion.p>
        </div>
      </section>

      {/* ── CARROUSEL INSTAGRAM ── */}
      <section className="py-24 px-6" style={{ background: `linear-gradient(to bottom, transparent, ${electric}15, transparent)` }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mb-14 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-2" style={{ color: electric }}>Post Instagram</p>
            <h2 className="font-heading font-black text-4xl md:text-5xl" style={{ color: accent }}>Carrousel</h2>
            <p className="text-slate-600 mt-3 text-sm">4 slides pour présenter l&apos;univers Rammellzee</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <InstagramCarousel color={electric} />
          </motion.div>
        </div>
      </section>

      {/* ── CIBLE ── */}
      <section className="py-20 px-6 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-2" style={{ color: electric }}>Public visé</p>
            <h2 className="font-heading font-black text-4xl md:text-5xl" style={{ color: accent }}>La cible</h2>
            <p className="text-slate-700 mt-3 text-base max-w-2xl">
              Une campagne pensée pour parler aux <strong className="text-slate-900">étudiants</strong> et jeunes adultes
              curieux d&apos;art contemporain et de culture urbaine.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm" style={{ boxShadow: `0 10px 30px ${electric}10` }}>
              <div className="text-3xl font-heading font-black mb-2" style={{ color: electric }}>18–28</div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Tranche d&apos;âge</p>
              <p className="text-slate-700 text-sm leading-relaxed">
                Étudiants en école d&apos;art, de design ou en université, ainsi que les jeunes actifs créatifs de la
                métropole bordelaise.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm" style={{ boxShadow: `0 10px 30px ${electric}10` }}>
              <div className="text-3xl font-heading font-black mb-2" style={{ color: electric }}>📱</div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Habitudes</p>
              <p className="text-slate-700 text-sm leading-relaxed">
                Très actifs sur Instagram et TikTok, sensibles aux contenus animés et aux directions artistiques
                fortes — d&apos;où le choix du format stories + carrousel.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm" style={{ boxShadow: `0 10px 30px ${electric}10` }}>
              <div className="text-3xl font-heading font-black mb-2" style={{ color: electric }}>🎨</div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Centres d&apos;intérêt</p>
              <p className="text-slate-700 text-sm leading-relaxed">
                Street art, graffiti, hip-hop, culture digitale et expositions immersives. Un public qui connaît
                déjà l&apos;héritage de Rammellzee ou prêt à le découvrir.
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-700 text-sm leading-relaxed max-w-3xl mt-8"
          >
            La direction artistique — typographies agressives, bleu électrique, animations 3D — a été calibrée pour
            <strong className="text-slate-900"> accrocher le regard dans le feed</strong> et provoquer l&apos;envie de
            partager. L&apos;objectif&nbsp;: faire venir cette génération au CAPC, souvent perçu comme un lieu
            institutionnel, en parlant son langage visuel.
          </motion.p>
        </div>
      </section>

      {/* ── CONTEXTE ── */}
      <section className="py-24 px-6 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">

          {/* Challenge / Solution */}
          {(project.detail.challenge || project.detail.solution) && (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-6 mb-16">
              {project.detail.challenge && (
                <div className="p-7 rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Le défi</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{project.detail.challenge}</p>
                </div>
              )}
              {project.detail.solution && (
                <div className="p-7 rounded-2xl border bg-white shadow-sm" style={{ borderColor: `${electric}50` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: electric }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: electric }}>La solution</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{project.detail.solution}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Description */}
          {project.detail.fullDescription && (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="font-heading font-black text-2xl mb-4 text-slate-900">Description</h2>
              <p className="text-slate-700 leading-relaxed text-lg">{project.detail.fullDescription}</p>
            </motion.div>
          )}

          {/* Process */}
          {project.detail.process.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="font-heading font-black text-2xl mb-8 text-slate-900">Processus</h2>
              <div className="relative">
                <div className="absolute left-7 top-4 bottom-4 w-px" style={{ background: `linear-gradient(to bottom, ${electric}, ${electric}10)` }} />
                <div className="flex flex-col gap-8">
                  {project.detail.process.map((step, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-heading font-black text-sm text-white shrink-0 z-10" style={{ background: electric, boxShadow: `0 8px 24px ${electric}50` }}>
                        {step.step}
                      </div>
                      <div className="pt-2">
                        <h4 className="font-heading font-bold text-lg mb-1 text-slate-900">{step.title}</h4>
                        <p className="text-slate-600 leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tools */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm mb-16">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Outils utilisés</h3>
            <div className="flex flex-wrap gap-2">
              {project.detail.tools.map((tool) => (
                <span key={tool} className="px-3 py-1.5 rounded-full text-sm font-medium border" style={{ borderColor: `${electric}60`, color: electric, background: `${electric}10` }}>
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 mb-24">
            <Link href="/#projects">
              <motion.span
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold border-2 cursor-pointer bg-white"
                style={{ borderColor: electric, color: electric }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <ArrowLeft size={16} />
                Tous les projets
              </motion.span>
            </Link>
          </div>

          {/* Prev / Next */}
          {(prevProject || nextProject) && (
            <div className="border-t border-slate-200 pt-10">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium mb-6 text-center">Autres projets</p>
              <div className="grid md:grid-cols-2 gap-4">
                {prevProject ? (
                  <Link href={`/projects/${prevProject.slug}`}>
                    <motion.div whileHover={{ x: -4 }} className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all group">
                      <ArrowLeft size={20} className="text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 mb-1">Précédent</p>
                        <p className="font-heading font-bold text-sm text-slate-900">{prevProject.title}</p>
                      </div>
                    </motion.div>
                  </Link>
                ) : <div />}
                {nextProject ? (
                  <Link href={`/projects/${nextProject.slug}`}>
                    <motion.div whileHover={{ x: 4 }} className="flex items-center justify-end gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all group">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 mb-1">Suivant</p>
                        <p className="font-heading font-bold text-sm text-slate-900">{nextProject.title}</p>
                      </div>
                      <ArrowRight size={20} className="text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
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
