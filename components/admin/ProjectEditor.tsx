"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Upload, Star } from "lucide-react";
import { Project, PortfolioData } from "@/types/portfolio";
import ImageUpload from "./ImageUpload";
import RichTextEditor from "./RichTextEditor";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  data: PortfolioData["projects"];
  onChange: (updated: PortfolioData["projects"]) => void;
}

function newProject(): Project {
  return {
    id: `projet-${Date.now()}`,
    slug: `projet-${Date.now()}`,
    title: "Nouveau projet",
    shortDescription: "",
    coverImage: "",
    tags: [],
    date: new Date().toISOString().slice(0, 7),
    client: "",
    featured: false,
    published: true,
    detail: {
      fullDescription: "",
      images: [],
      context: "",
      tools: [],
      results: "",
      link: "",
      challenge: "",
      solution: "",
      role: "",
      duration: "",
      stats: [],
      process: [],
      testimonial: null,
      color: "#6366f1",
    },
  };
}

/* ── Sortable image thumb ── */
function SortableImageThumb({
  id, url, index, onUpdate, onDelete,
}: {
  id: string; url: string; index: number;
  onUpdate: (v: string) => void; onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, resizeObserverConfig: {} });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const [editMode, setEditMode] = useState(false);

  return (
    <div ref={setNodeRef} style={style} className="relative shrink-0">
      <div className="w-28 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
        {url ? (
          <img src={url} alt={`Image ${index + 1}`} className="w-full h-20 object-cover" />
        ) : (
          <div className="w-full h-20 bg-gray-100 flex items-center justify-center text-gray-300 text-xs">Vide</div>
        )}
        <div className="flex items-center justify-between p-1.5 gap-1">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
            <GripVertical size={12} />
          </div>
          <button onClick={() => setEditMode(!editMode)} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">
            {editMode ? "OK" : "Édit"}
          </button>
          <button onClick={onDelete} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
        </div>
      </div>
      {editMode && (
        <div className="absolute z-20 top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-3">
          <ImageUpload value={url} onChange={(v) => { onUpdate(v); setEditMode(false); }} />
        </div>
      )}
    </div>
  );
}

/* ── Gallery editor with multi-upload + reorder ── */
function GalleryEditor({
  images,
  onChange,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const ids = images.map((_, i) => `img-${i}`);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (res.ok) {
        const { url } = await res.json();
        urls.push(url);
      }
    }
    onChange([...images, ...urls]);
    setUploading(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) handleFiles(files);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = ids.indexOf(active.id as string);
      const newIdx = ids.indexOf(over.id as string);
      onChange(arrayMove(images, oldIdx, newIdx));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Images galerie ({images.length})
        </span>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-60"
        >
          <Upload size={12} />
          {uploading ? "Upload..." : "Ajouter images"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); }}
        />
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-200 rounded-xl p-3 hover:border-indigo-400 transition-colors min-h-[80px]"
      >
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1 text-gray-300 py-4">
            <Upload size={20} />
            <span className="text-xs">Glisser des images ici ou utiliser le bouton</span>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
              <div className="flex flex-wrap gap-2">
                {images.map((img, i) => (
                  <SortableImageThumb
                    key={`img-${i}`}
                    id={`img-${i}`}
                    url={img}
                    index={i}
                    onUpdate={(v) => {
                      const imgs = [...images];
                      imgs[i] = v;
                      onChange(imgs);
                    }}
                    onDelete={() => onChange(images.filter((_, j) => j !== i))}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

function ProjectItem({
  project, index, total, onUpdate, onDelete, onMove, onSetFeatured,
}: {
  project: Project; index: number; total: number;
  onUpdate: (p: Project) => void; onDelete: () => void; onMove: (dir: "up" | "down") => void;
  onSetFeatured: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id, resizeObserverConfig: {} });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const set = (key: keyof Project, value: unknown) => onUpdate({ ...project, [key]: value });
  const setDetail = (key: keyof Project["detail"], value: unknown) =>
    onUpdate({ ...project, detail: { ...project.detail, [key]: value } });

  return (
    <div ref={setNodeRef} style={style} className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-4 bg-gray-50">
        <div className="flex flex-col gap-1">
          <button onClick={() => onMove("up")} disabled={index === 0} aria-label="Monter" className="text-gray-400 disabled:opacity-30 hover:text-gray-700"><ChevronUp size={14} /></button>
          <button onClick={() => onMove("down")} disabled={index === total - 1} aria-label="Descendre" className="text-gray-400 disabled:opacity-30 hover:text-gray-700"><ChevronDown size={14} /></button>
        </div>
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
          <GripVertical size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm truncate">{project.title}</p>
            {project.featured && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-600">
                <Star size={10} fill="currentColor" /> À la une
              </span>
            )}
            {project.published === false && (
              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-600">Brouillon</span>
            )}
          </div>
          <p className="text-xs text-gray-400">{project.client}</p>
        </div>
        <button onClick={() => { if (confirm(`Supprimer "${project.title}" ?`)) onDelete(); }} aria-label="Supprimer" className="text-red-400 hover:text-red-600 p-1">
          <Trash2 size={16} />
        </button>
        <button onClick={() => setOpen(!open)} aria-label="Développer" className="text-gray-400 hover:text-gray-700 p-1">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              {/* Published toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                <div>
                  <p className="text-sm font-semibold">Statut</p>
                  <p className="text-xs text-gray-400">{project.published !== false ? "Publié — visible sur le portfolio" : "Brouillon — masqué du portfolio"}</p>
                </div>
                <button
                  onClick={() => set("published", project.published !== false ? false : true)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${project.published !== false ? "bg-green-500" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${project.published !== false ? "translate-x-7" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Titre</span>
                  <input value={project.title} onChange={(e) => set("title", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Slug (URL)</span>
                  <input value={project.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 font-mono" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Client</span>
                  <input value={project.client} onChange={(e) => set("client", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Date (AAAA-MM)</span>
                  <input value={project.date} onChange={(e) => set("date", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Description courte</span>
                <textarea value={project.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} rows={2} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" />
              </label>

              <RichTextEditor
                label="Description complète"
                value={project.detail.fullDescription}
                onChange={(v) => setDetail("fullDescription", v)}
                placeholder="Description détaillée du projet..."
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Rôle</span>
                  <input value={project.detail.role} onChange={(e) => setDetail("role", e.target.value)} placeholder="Ex: Designer graphique" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Durée</span>
                  <input value={project.detail.duration} onChange={(e) => setDetail("duration", e.target.value)} placeholder="Ex: 3 mois" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Contexte</span>
                  <input value={project.detail.context} onChange={(e) => setDetail("context", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Résultats</span>
                  <input value={project.detail.results} onChange={(e) => setDetail("results", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Lien live</span>
                  <input value={project.detail.link} onChange={(e) => setDetail("link", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Couleur accent</span>
                  <div className="flex gap-2">
                    <input type="color" value={project.detail.color} onChange={(e) => setDetail("color", e.target.value)} className="w-10 h-10 rounded-lg border cursor-pointer" />
                    <input value={project.detail.color} onChange={(e) => setDetail("color", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none" />
                  </div>
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Le défi</span>
                <textarea value={project.detail.challenge} onChange={(e) => setDetail("challenge", e.target.value)} rows={3} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">La solution</span>
                <textarea value={project.detail.solution} onChange={(e) => setDetail("solution", e.target.value)} rows={3} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" />
              </label>

              {/* Stats */}
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Stats</span>
                {project.detail.stats.map((stat, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={stat.value} onChange={(e) => { const s = [...project.detail.stats]; s[i] = { ...s[i], value: e.target.value }; setDetail("stats", s); }} placeholder="+40%" className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none font-bold" />
                    <input value={stat.label} onChange={(e) => { const s = [...project.detail.stats]; s[i] = { ...s[i], label: e.target.value }; setDetail("stats", s); }} placeholder="Libellé" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                    <button onClick={() => setDetail("stats", project.detail.stats.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button onClick={() => setDetail("stats", [...project.detail.stats, { value: "", label: "" }])} className="text-sm text-indigo-500 hover:text-indigo-700 flex items-center gap-1"><Plus size={14} /> Ajouter une stat</button>
              </div>

              {/* Process */}
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Processus</span>
                {project.detail.process.map((step, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                    <input value={step.step} onChange={(e) => { const p = [...project.detail.process]; p[i] = { ...p[i], step: e.target.value }; setDetail("process", p); }} placeholder="01" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                    <input value={step.title} onChange={(e) => { const p = [...project.detail.process]; p[i] = { ...p[i], title: e.target.value }; setDetail("process", p); }} placeholder="Titre" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                    <input value={step.description} onChange={(e) => { const p = [...project.detail.process]; p[i] = { ...p[i], description: e.target.value }; setDetail("process", p); }} placeholder="Description" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                    <button onClick={() => setDetail("process", project.detail.process.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button onClick={() => setDetail("process", [...project.detail.process, { step: `0${project.detail.process.length + 1}`, title: "", description: "" }])} className="text-sm text-indigo-500 hover:text-indigo-700 flex items-center gap-1"><Plus size={14} /> Ajouter une étape</button>
              </div>

              {/* Testimonial */}
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Témoignage</span>
                <div className="grid gap-2">
                  <textarea value={project.detail.testimonial?.quote ?? ""} onChange={(e) => setDetail("testimonial", e.target.value ? { ...(project.detail.testimonial ?? { author: "", role: "" }), quote: e.target.value } : null)} rows={3} placeholder="Citation (laisser vide pour désactiver)" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" />
                  {project.detail.testimonial && (
                    <div className="grid grid-cols-2 gap-2">
                      <input value={project.detail.testimonial.author} onChange={(e) => setDetail("testimonial", { ...project.detail.testimonial!, author: e.target.value })} placeholder="Auteur" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                      <input value={project.detail.testimonial.role} onChange={(e) => setDetail("testimonial", { ...project.detail.testimonial!, role: e.target.value })} placeholder="Rôle / Entreprise" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                    </div>
                  )}
                </div>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Tags (séparés par des virgules)</span>
                <input value={project.tags.join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Outils (séparés par des virgules)</span>
                <input value={project.detail.tools.join(", ")} onChange={(e) => setDetail("tools", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
              </label>

              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                <div>
                  <p className="text-sm font-semibold flex items-center gap-1.5">
                    <Star size={14} className={project.featured ? "text-amber-500" : "text-gray-300"} fill={project.featured ? "currentColor" : "none"} />
                    Projet à la une
                  </p>
                  <p className="text-xs text-gray-400">
                    {project.featured ? "Ce projet est mis en avant sur le portfolio" : "Définir comme projet principal (remplace l'actuel)"}
                  </p>
                </div>
                {project.featured ? (
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-600">Actif</span>
                ) : (
                  <button
                    onClick={onSetFeatured}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  >
                    Définir à la une
                  </button>
                )}
              </div>

              <ImageUpload label="Image de couverture" value={project.coverImage} onChange={(v) => set("coverImage", v)} />

              {/* Gallery with multi-upload + reorder */}
              <GalleryEditor
                images={project.detail.images}
                onChange={(imgs) => setDetail("images", imgs)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProjectEditor({ data, onChange }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const updateItem = (index: number, updated: Project) => {
    const items = [...data.items];
    items[index] = updated;
    onChange({ ...data, items });
  };

  const setFeatured = (index: number) => {
    const items = data.items.map((p, i) => ({ ...p, featured: i === index }));
    onChange({ ...data, items });
  };

  const deleteItem = (index: number) => {
    onChange({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  const moveItem = (index: number, dir: "up" | "down") => {
    const items = [...data.items];
    const newIndex = dir === "up" ? index - 1 : index + 1;
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    onChange({ ...data, items });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.items.findIndex((p) => p.id === active.id);
      const newIndex = data.items.findIndex((p) => p.id === over.id);
      onChange({ ...data, items: arrayMove(data.items, oldIndex, newIndex) });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4 mb-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Titre de la section</span>
          <input value={data.sectionTitle} onChange={(e) => onChange({ ...data, sectionTitle: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Sous-titre</span>
          <input value={data.sectionSubtitle} onChange={(e) => onChange({ ...data, sectionSubtitle: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
        </label>
      </div>

      {/* Featured project selector */}
      <div className="p-4 rounded-xl border border-amber-100 bg-amber-50">
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <Star size={12} fill="currentColor" /> Projet à la une
        </p>
        <div className="flex flex-wrap gap-2">
          {data.items.filter((p) => p.published !== false).map((p) => {
            const realIndex = data.items.indexOf(p);
            return (
              <button
                key={p.id}
                onClick={() => setFeatured(realIndex)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  p.featured
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-amber-300 hover:text-amber-600"
                }`}
              >
                {p.featured && <Star size={10} fill="currentColor" className="inline mr-1 mb-0.5" />}
                {p.title}
              </button>
            );
          })}
          {data.items.filter((p) => p.published !== false).length === 0 && (
            <p className="text-xs text-amber-600">Aucun projet publié.</p>
          )}
        </div>
        <p className="text-xs text-amber-600 mt-2">
          {data.items.find((p) => p.featured)
            ? `"${data.items.find((p) => p.featured)!.title}" est affiché en grand format en tête de la section projets.`
            : "Aucun projet à la une — tous les projets s'affichent en grille."}
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {data.items.map((project, i) => (
              <ProjectItem
                key={project.id}
                project={project}
                index={i}
                total={data.items.length}
                onUpdate={(p) => updateItem(i, p)}
                onDelete={() => deleteItem(i)}
                onMove={(dir) => moveItem(i, dir)}
                onSetFeatured={() => setFeatured(i)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={() => onChange({ ...data, items: [...data.items, newProject()] })}
        className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
      >
        <Plus size={18} />
        Ajouter un projet
      </button>
    </div>
  );
}
