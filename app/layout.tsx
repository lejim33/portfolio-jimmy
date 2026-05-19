import type { Metadata } from "next";
import { Inter, Syne, Montserrat } from "next/font/google";
import "./globals.css";
import fs from "fs";
import path from "path";
import { PortfolioData } from "@/types/portfolio";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import { LocaleProvider } from "@/components/ui/LocaleContext";
import { ToastProvider } from "@/components/ui/Toast";
import PageLoader from "@/components/ui/PageLoader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

function getPortfolioData(): PortfolioData {
  const filePath = path.join(process.cwd(), "data", "portfolio.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function generateMetadata(): Promise<Metadata> {
  const data = getPortfolioData();
  return {
    title: { default: data.meta.siteTitle, template: `%s — ${data.meta.siteTitle}` },
    description: data.meta.siteDescription,
    openGraph: {
      title: data.meta.siteTitle,
      description: data.meta.siteDescription,
      images: [{ url: data.meta.ogImage, width: 1200, height: 630 }],
      locale: data.meta.lang === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const data = getPortfolioData();

  if (data.maintenanceMode) {
    return (
      <html lang={data.meta.lang} suppressHydrationWarning>
        <head>
          <link rel="icon" href={data.meta.favicon} />
          <style>{`
            :root {
              --color-primary: ${data.theme.primaryColor};
              --color-accent: ${data.theme.accentColor};
            }
          `}</style>
        </head>
        <body className={`${inter.variable} ${syne.variable} ${montserrat.variable} font-body antialiased`}>
          <div className="min-h-screen flex flex-col items-center justify-center text-center px-6"
            style={{ background: "linear-gradient(135deg, #f8faff, #fff1f4)" }}>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl mb-8 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${data.theme.primaryColor}, ${data.theme.accentColor})` }}
            >
              🔧
            </div>
            <h1 className="font-heading font-black text-4xl md:text-5xl mb-4" style={{ color: data.theme.textColor }}>
              Bientôt disponible
            </h1>
            <p className="text-gray-500 text-lg max-w-md">
              Le portfolio est en cours de mise à jour. Revenez très bientôt !
            </p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang={data.meta.lang} suppressHydrationWarning>
      <head>
        <link rel="icon" href={data.meta.favicon} />
        <style>{`
          :root {
            --color-primary: ${data.theme.primaryColor};
            --color-accent: ${data.theme.accentColor};
            --color-background: ${data.theme.backgroundColor};
            --color-text: ${data.theme.textColor};
            --border-radius: ${data.theme.borderRadius};
          }
        `}</style>
      </head>
      <body className={`${inter.variable} ${syne.variable} ${montserrat.variable} font-body antialiased`}>
        <a href="#hero" className="skip-link">Aller au contenu</a>
        <PageLoader />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LocaleProvider>
            <ToastProvider>
              <ScrollProgress />
              {children}
              <BackToTop />
            </ToastProvider>
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
