"use client";
import { PortfolioData } from "@/types/portfolio";
import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/ui/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import Marquee from "@/components/ui/Marquee";
import { useLocale, mergeTranslations } from "@/components/ui/LocaleContext";
import { useEffect } from "react";

const MARQUEE_ITEMS = [
  "Direction Artistique",
  "Communication Visuelle",
  "Identité de Marque",
  "Réseaux Sociaux",
  "Stratégie de Communication",
  "Création Graphique",
  "Campagnes Publicitaires",
  "UX Design",
];

export default function PortfolioContent({ rawData }: { rawData: PortfolioData }) {
  const locale = useLocale();
  const data = mergeTranslations(rawData, locale);
  const sectionOrder = data.sectionOrder ?? ["hero", "projects", "about", "contact"];

  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "/" }),
    }).catch(() => {});
  }, []);

  const sectionMap: Record<string, React.ReactNode> = {
    hero: <HeroSection key="hero" data={data.hero} />,
    projects: (
      <div key="projects">
        <Marquee items={MARQUEE_ITEMS} speed={35} />
        <ProjectsSection data={data.projects} />
        <Marquee items={MARQUEE_ITEMS} speed={45} reverse accent />
      </div>
    ),
    about: <AboutSection key="about" data={data.about} />,
    contact: <ContactSection key="contact" data={data.contact} />,
  };

  return (
    <div className="custom-cursor">
      <CustomCursor />
      <Navbar data={data.navbar} />
      <main>
        {sectionOrder.map((id) => sectionMap[id] ?? null)}
      </main>
      <Footer data={data.footer} />
    </div>
  );
}
