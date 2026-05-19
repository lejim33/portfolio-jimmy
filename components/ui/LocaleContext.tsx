"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PortfolioData, TranslationsEn } from "@/types/portfolio";

type Locale = "FR" | "EN";

interface LocaleContextValue {
  locale: Locale;
}

const LocaleContext = createContext<LocaleContextValue>({ locale: "FR" });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("FR");

  useEffect(() => {
    const stored = localStorage.getItem("portfolio-lang");
    if (stored === "EN") setLocale("EN");

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === "EN" || detail === "FR") setLocale(detail as Locale);
    };
    window.addEventListener("portfolio-lang-change", handler);
    return () => window.removeEventListener("portfolio-lang-change", handler);
  }, []);

  return <LocaleContext.Provider value={{ locale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext).locale;
}

export function mergeTranslations(data: PortfolioData, locale: Locale): PortfolioData {
  if (locale === "FR" || !data.translations?.en) return data;
  const en = data.translations.en as TranslationsEn;
  return {
    ...data,
    hero: en.hero ? { ...data.hero, ...en.hero } : data.hero,
    projects: en.projects
      ? { ...data.projects, ...en.projects }
      : data.projects,
    about: en.about ? { ...data.about, ...en.about } : data.about,
    contact: en.contact ? { ...data.contact, ...en.contact } : data.contact,
    navbar: en.navbar ? { ...data.navbar, ...en.navbar } : data.navbar,
  };
}
