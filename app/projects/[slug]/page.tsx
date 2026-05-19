import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PortfolioData } from "@/types/portfolio";
import ProjectDetailClient from "./ProjectDetailClient";
import RammellzeeDetailClient from "./RammellzeeDetailClient";
import ProjetFacadeDetailClient from "./ProjetFacadeDetailClient";
import LaBelleFinitionDetailClient from "./LaBelleFinitionDetailClient";
import CervoDetailClient from "./CervoDetailClient";

function getPortfolioData(): PortfolioData {
  const filePath = path.join(process.cwd(), "data", "portfolio.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export async function generateStaticParams() {
  const data = getPortfolioData();
  return data.projects.items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getPortfolioData();
  const project = data.projects.items.find((p) => p.slug === slug);

  if (!project) return { title: "Projet introuvable" };

  const description = project.detail.fullDescription || project.shortDescription;
  const imageUrl = project.coverImage || data.meta.ogImage;

  return {
    title: project.title,
    description,
    openGraph: {
      title: `${project.title} — ${data.meta.siteTitle}`,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: project.title }],
      type: "article",
      tags: project.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: [imageUrl],
    },
    keywords: project.tags,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getPortfolioData();
  const project = data.projects.items.find((p) => p.slug === slug);

  if (!project) notFound();

  if (slug === "cervo") {
    return <CervoDetailClient project={project} allProjects={data.projects.items} />;
  }

  if (slug === "rammellzee") {
    return <RammellzeeDetailClient project={project} allProjects={data.projects.items} />;
  }

  if (slug === "charte-graphique-projet-facade") {
    return <ProjetFacadeDetailClient project={project} allProjects={data.projects.items} />;
  }

  if (slug === "refonte-charte-lbf") {
    return <LaBelleFinitionDetailClient project={project} allProjects={data.projects.items} />;
  }

  return <ProjectDetailClient project={project} allProjects={data.projects.items} />;
}
