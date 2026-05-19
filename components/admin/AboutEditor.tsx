"use client";
import { useState, useRef } from "react";
import { Plus, Trash2, Upload, FileText, Check } from "lucide-react";
import { PortfolioData } from "@/types/portfolio";
import ImageUpload from "./ImageUpload";

interface Props {
  data: PortfolioData["about"];
  onChange: (updated: PortfolioData["about"]) => void;
}

function CvUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload/cv", { method: "POST", body: form });
    if (res.ok) {
      const { url } = await res.json();
      onChange(url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Fichier CV (PDF)</span>
      <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
          <FileText size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{value || "Aucun CV uploadé"}</p>
          {value && <p className="text-xs text-gray-400">Accessible via {value}</p>}
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-60 shrink-0"
        >
          {success ? <Check size={14} /> : <Upload size={14} />}
          {uploading ? "Upload..." : success ? "Uploadé !" : "Importer PDF"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ou saisir l'URL du CV..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-indigo-400"
        />
      </div>
    </div>
  );
}

export default function AboutEditor({ data, onChange }: Props) {
  const update = (key: keyof typeof data, value: unknown) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="flex flex-col gap-6">
      {/* Basic fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Titre de section</span>
          <input value={data.sectionTitle} onChange={(e) => update("sectionTitle", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Formation</span>
          <input value={data.formation} onChange={(e) => update("formation", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
        </label>
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Alternance</span>
          <input value={data.alternance} onChange={(e) => update("alternance", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
        </label>
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Bio</span>
          <textarea value={data.bio} onChange={(e) => update("bio", e.target.value)} rows={4} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-y" />
        </label>
      </div>

      <CvUpload value={data.cvFile} onChange={(v) => update("cvFile", v)} />

      <ImageUpload label="Photo de profil" value={data.photo} onChange={(v) => update("photo", v)} />

      {/* Skills */}
      <div>
        <h4 className="font-heading font-bold text-base mb-3">Compétences</h4>
        {data.skills.map((cat, ci) => (
          <div key={ci} className="mb-4 p-4 border border-gray-100 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <input
                value={cat.category}
                onChange={(e) => {
                  const skills = [...data.skills];
                  skills[ci] = { ...cat, category: e.target.value };
                  update("skills", skills);
                }}
                placeholder="Catégorie"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none"
              />
              <button onClick={() => update("skills", data.skills.filter((_, i) => i !== ci))} aria-label="Supprimer la catégorie" className="text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {cat.items.map((item, ii) => (
                <div key={ii} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                  <input
                    value={item}
                    onChange={(e) => {
                      const skills = [...data.skills];
                      const items = [...cat.items];
                      items[ii] = e.target.value;
                      skills[ci] = { ...cat, items };
                      update("skills", skills);
                    }}
                    className="bg-transparent text-xs w-24 focus:outline-none"
                  />
                  <button onClick={() => {
                    const skills = [...data.skills];
                    skills[ci] = { ...cat, items: cat.items.filter((_, j) => j !== ii) };
                    update("skills", skills);
                  }} aria-label="Supprimer" className="text-gray-400 hover:text-red-400">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const skills = [...data.skills];
                  skills[ci] = { ...cat, items: [...cat.items, "Nouveau"] };
                  update("skills", skills);
                }}
                className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5"
              >
                <Plus size={12} /> Ajouter
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => update("skills", [...data.skills, { category: "Nouvelle catégorie", items: [] }])}
          className="flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-700"
        >
          <Plus size={14} /> Ajouter une catégorie
        </button>
      </div>

      {/* Stats */}
      <div>
        <h4 className="font-heading font-bold text-base mb-3">Chiffres clés (bandeau stats)</h4>
        {(data.stats ?? []).map((stat, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={stat.value}
              onChange={(e) => {
                const stats = [...(data.stats ?? [])];
                stats[i] = { ...stats[i], value: e.target.value };
                update("stats", stats);
              }}
              placeholder="2+"
              className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold focus:outline-none"
            />
            <input
              value={stat.label}
              onChange={(e) => {
                const stats = [...(data.stats ?? [])];
                stats[i] = { ...stats[i], label: e.target.value };
                update("stats", stats);
              }}
              placeholder="Libellé (ex: Projets livrés)"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none"
            />
            <button
              onClick={() => update("stats", (data.stats ?? []).filter((_, j) => j !== i))}
              aria-label="Supprimer"
              className="text-red-400 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          onClick={() => update("stats", [...(data.stats ?? []), { value: "", label: "" }])}
          className="flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-700"
        >
          <Plus size={14} /> Ajouter un chiffre
        </button>
      </div>

      {/* Timeline */}
      <div>
        <h4 className="font-heading font-bold text-base mb-3">Parcours (timeline)</h4>
        {(data.timeline ?? []).map((entry, i) => (
          <div key={i} className="grid sm:grid-cols-5 gap-2 mb-3 p-3 border border-gray-100 rounded-xl">
            <input
              value={entry.year}
              onChange={(e) => {
                const timeline = [...(data.timeline ?? [])];
                timeline[i] = { ...entry, year: e.target.value };
                update("timeline", timeline);
              }}
              placeholder="Année"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none"
            />
            <input
              value={entry.title}
              onChange={(e) => {
                const timeline = [...(data.timeline ?? [])];
                timeline[i] = { ...entry, title: e.target.value };
                update("timeline", timeline);
              }}
              placeholder="Titre"
              className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
            />
            <input
              value={entry.subtitle}
              onChange={(e) => {
                const timeline = [...(data.timeline ?? [])];
                timeline[i] = { ...entry, subtitle: e.target.value };
                update("timeline", timeline);
              }}
              placeholder="Sous-titre"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
            />
            <div className="flex gap-2">
              <select
                value={entry.type}
                onChange={(e) => {
                  const timeline = [...(data.timeline ?? [])];
                  timeline[i] = { ...entry, type: e.target.value as "education" | "work" };
                  update("timeline", timeline);
                }}
                className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white"
              >
                <option value="education">Formation</option>
                <option value="work">Expérience</option>
              </select>
              <button
                onClick={() => update("timeline", (data.timeline ?? []).filter((_, j) => j !== i))}
                aria-label="Supprimer"
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => update("timeline", [...(data.timeline ?? []), { year: "", title: "", subtitle: "", type: "work" }])}
          className="flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-700"
        >
          <Plus size={14} /> Ajouter une étape
        </button>
      </div>

      {/* Skill levels */}
      <div>
        <h4 className="font-heading font-bold text-base mb-3">Niveaux de compétences (%)</h4>
        <div className="flex flex-col gap-3">
          {data.skills.flatMap((cat) => cat.items).map((skillName) => {
            const level = (data.skillLevels ?? {})[skillName] ?? 0;
            return (
              <div key={skillName} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-40 truncate shrink-0">{skillName}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${level}%`, background: "var(--color-primary)" }}
                  />
                </div>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={level}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(100, Number(e.target.value)));
                    update("skillLevels", { ...(data.skillLevels ?? {}), [skillName]: val });
                  }}
                  className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center focus:outline-none"
                />
                <span className="text-xs text-gray-400 w-6">%</span>
              </div>
            );
          })}
        </div>
        {data.skills.flatMap((c) => c.items).length === 0 && (
          <p className="text-sm text-gray-400">Ajoutez des compétences ci-dessus pour définir leurs niveaux.</p>
        )}
      </div>

      {/* Values */}
      <div>
        <h4 className="font-heading font-bold text-base mb-3">Valeurs</h4>
        {data.values.map((val, i) => (
          <div key={i} className="grid sm:grid-cols-3 gap-2 mb-3 p-3 border border-gray-100 rounded-xl">
            <input
              value={val.icon}
              onChange={(e) => {
                const values = [...data.values];
                values[i] = { ...val, icon: e.target.value };
                update("values", values);
              }}
              placeholder="Icône (ex: zap)"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
            />
            <input
              value={val.title}
              onChange={(e) => {
                const values = [...data.values];
                values[i] = { ...val, title: e.target.value };
                update("values", values);
              }}
              placeholder="Titre"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                value={val.description}
                onChange={(e) => {
                  const values = [...data.values];
                  values[i] = { ...val, description: e.target.value };
                  update("values", values);
                }}
                placeholder="Description"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
              <button onClick={() => update("values", data.values.filter((_, j) => j !== i))} aria-label="Supprimer" className="text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => update("values", [...data.values, { icon: "zap", title: "Valeur", description: "" }])}
          className="flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-700"
        >
          <Plus size={14} /> Ajouter une valeur
        </button>
      </div>
    </div>
  );
}
