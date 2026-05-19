"use client";
import { Plus, Trash2 } from "lucide-react";
import { PortfolioData } from "@/types/portfolio";
import ImageUpload from "./ImageUpload";

interface Props {
  section: "hero" | "navbar" | "footer" | "meta" | "contact";
  data: PortfolioData;
  onChange: (updated: PortfolioData) => void;
}

const Input = ({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 resize-y"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-indigo-400"
      />
    )}
  </div>
);

export default function SectionEditor({ section, data, onChange }: Props) {
  const update = (path: string[], value: unknown) => {
    const updated = JSON.parse(JSON.stringify(data)) as PortfolioData;
    let obj: Record<string, unknown> = updated as unknown as Record<string, unknown>;
    for (let i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]] as Record<string, unknown>;
    }
    obj[path[path.length - 1]] = value;
    onChange(updated);
  };

  if (section === "hero") {
    const hero = data.hero;
    return (
      <div className="flex flex-col gap-4">
        <Input label="Phrase d'accueil" value={hero.greeting} onChange={(v) => update(["hero", "greeting"], v)} />
        <Input label="Nom complet" value={hero.name} onChange={(v) => update(["hero", "name"], v)} />
        <Input label="Titre / rôle" value={hero.title} onChange={(v) => update(["hero", "title"], v)} />
        <Input label="Sous-titre" value={hero.subtitle} onChange={(v) => update(["hero", "subtitle"], v)} textarea />
        <Input label="CTA principal — label" value={hero.ctaPrimary.label} onChange={(v) => update(["hero", "ctaPrimary", "label"], v)} />
        <Input label="CTA principal — lien" value={hero.ctaPrimary.href} onChange={(v) => update(["hero", "ctaPrimary", "href"], v)} />
        <Input label="CTA secondaire — label" value={hero.ctaSecondary.label} onChange={(v) => update(["hero", "ctaSecondary", "label"], v)} />
        <Input label="CTA secondaire — lien" value={hero.ctaSecondary.href} onChange={(v) => update(["hero", "ctaSecondary", "href"], v)} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avatar</label>
          <ImageUpload value={hero.avatar} onChange={(v) => update(["hero", "avatar"], v)} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Liens sociaux</label>
          {hero.socialLinks.map((link, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                value={link.platform}
                onChange={(e) => {
                  const links = [...hero.socialLinks];
                  links[i] = { ...links[i], platform: e.target.value };
                  update(["hero", "socialLinks"], links);
                }}
                placeholder="Plateforme"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => {
                  const links = [...hero.socialLinks];
                  links[i] = { ...links[i], url: e.target.value };
                  update(["hero", "socialLinks"], links);
                }}
                placeholder="URL"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none col-span-2"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
            Stats (bande sous le hero)
          </label>
          {(hero.stats ?? []).map((stat, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={stat.value}
                onChange={(e) => {
                  const stats = [...(hero.stats ?? [])];
                  stats[i] = { ...stats[i], value: e.target.value };
                  update(["hero", "stats"], stats);
                }}
                placeholder="2+"
                className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold focus:outline-none"
              />
              <input
                value={stat.label}
                onChange={(e) => {
                  const stats = [...(hero.stats ?? [])];
                  stats[i] = { ...stats[i], label: e.target.value };
                  update(["hero", "stats"], stats);
                }}
                placeholder="Libellé"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
              />
              <button
                onClick={() => update(["hero", "stats"], (hero.stats ?? []).filter((_, j) => j !== i))}
                aria-label="Supprimer"
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => update(["hero", "stats"], [...(hero.stats ?? []), { value: "", label: "" }])}
            className="text-sm text-indigo-500 hover:text-indigo-700 flex items-center gap-1"
          >
            <Plus size={14} /> Ajouter une stat
          </button>
        </div>
      </div>
    );
  }

  if (section === "navbar") {
    const navbar = data.navbar;
    return (
      <div className="flex flex-col gap-4">
        <Input label="Logo / Nom" value={navbar.logo} onChange={(v) => update(["navbar", "logo"], v)} />
        <Input label="CTA — label" value={navbar.ctaLabel} onChange={(v) => update(["navbar", "ctaLabel"], v)} />
        <Input label="CTA — lien" value={navbar.ctaHref} onChange={(v) => update(["navbar", "ctaHref"], v)} />
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Liens de navigation</label>
          {navbar.links.map((link, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => {
                  const links = [...navbar.links];
                  links[i] = { ...links[i], label: e.target.value };
                  update(["navbar", "links"], links);
                }}
                placeholder="Label"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => {
                  const links = [...navbar.links];
                  links[i] = { ...links[i], href: e.target.value };
                  update(["navbar", "links"], links);
                }}
                placeholder="Lien (ex: #about)"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === "footer") {
    return (
      <div className="flex flex-col gap-4">
        <Input label="Texte du footer" value={data.footer.text} onChange={(v) => update(["footer", "text"], v)} />
      </div>
    );
  }

  if (section === "meta") {
    const titleDisplay = data.meta.siteTitle.slice(0, 60);
    const descDisplay = data.meta.siteDescription.slice(0, 160);
    const titleOver = data.meta.siteTitle.length > 60;
    const descOver = data.meta.siteDescription.length > 160;

    return (
      <div className="flex flex-col gap-4">
        <Input label="Titre du site" value={data.meta.siteTitle} onChange={(v) => update(["meta", "siteTitle"], v)} />
        <Input label="Description SEO" value={data.meta.siteDescription} onChange={(v) => update(["meta", "siteDescription"], v)} textarea />
        <Input label="OG Image URL" value={data.meta.ogImage} onChange={(v) => update(["meta", "ogImage"], v)} />
        <Input label="Favicon URL" value={data.meta.favicon} onChange={(v) => update(["meta", "favicon"], v)} />
        <Input label="Langue (ex: fr)" value={data.meta.lang} onChange={(v) => update(["meta", "lang"], v)} />

        {/* Google snippet preview */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Aperçu Google</p>
          <div className="p-4 rounded-xl border border-gray-200 bg-white font-sans">
            <p className="text-[13px] text-gray-400 mb-0.5 truncate">
              portfoliojim.vercel.app
            </p>
            <p className={`text-lg font-medium leading-snug mb-1 ${titleOver ? "text-red-500" : "text-blue-700"}`}>
              {titleDisplay || "Titre du site"}{titleOver ? " ✂ trop long" : ""}
            </p>
            <p className={`text-sm leading-relaxed ${descOver ? "text-red-500" : "text-gray-600"}`}>
              {descDisplay || "Description SEO..."}
              {descOver ? " ✂ trop long" : ""}
            </p>
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              <span>Titre : {data.meta.siteTitle.length}/60 {titleOver ? "⚠️" : "✅"}</span>
              <span>Desc : {data.meta.siteDescription.length}/160 {descOver ? "⚠️" : "✅"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === "contact") {
    const contact = data.contact;
    return (
      <div className="flex flex-col gap-4">
        <Input label="Titre de la section" value={contact.sectionTitle} onChange={(v) => update(["contact", "sectionTitle"], v)} />
        <Input label="Sous-titre" value={contact.subtitle} onChange={(v) => update(["contact", "subtitle"], v)} />
        <Input label="Email" value={contact.email} onChange={(v) => update(["contact", "email"], v)} />
        <Input label="Téléphone" value={contact.phone} onChange={(v) => update(["contact", "phone"], v)} />
        <Input label="Localisation" value={contact.location} onChange={(v) => update(["contact", "location"], v)} />
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Formulaire activé</label>
          <button
            onClick={() => update(["contact", "formEnabled"], !contact.formEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${contact.formEnabled ? "bg-indigo-500" : "bg-gray-200"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${contact.formEnabled ? "translate-x-7" : "translate-x-1"}`}
            />
          </button>
        </div>

        {/* Availability card */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Carte de disponibilité</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Afficher la carte</label>
              <button
                onClick={() => update(["contact", "availabilityVisible"], !contact.availabilityVisible)}
                className={`relative w-12 h-6 rounded-full transition-colors ${contact.availabilityVisible !== false ? "bg-indigo-500" : "bg-gray-200"}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${contact.availabilityVisible !== false ? "translate-x-7" : "translate-x-1"}`}
                />
              </button>
            </div>
            <Input
              label="Titre (ex: Disponible pour)"
              value={contact.availabilityTitle ?? "Disponible pour"}
              onChange={(v) => update(["contact", "availabilityTitle"], v)}
            />
            <Input
              label="Sous-titre (ex: Stages, alternances...)"
              value={contact.availabilitySubtitle ?? "Stages, alternances & projets freelance"}
              onChange={(v) => update(["contact", "availabilitySubtitle"], v)}
            />
            <Input
              label="Statut (ligne avec point vert, laisser vide pour masquer)"
              value={contact.availabilityStatus ?? "Actuellement en alternance"}
              onChange={(v) => update(["contact", "availabilityStatus"], v)}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
