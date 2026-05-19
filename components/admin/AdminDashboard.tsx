"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette, User, FolderOpen, Info, MessageSquare,
  Search, Navigation, Footprints, Save, Eye,
  LogOut, Check, AlertCircle, History, RotateCcw, Columns, BarChart2,
  Image as ImageIcon, GripVertical, LayoutGrid, Wrench,
} from "lucide-react";
import { PortfolioData } from "@/types/portfolio";
import ThemeEditor from "./ThemeEditor";
import SectionEditor from "./SectionEditor";
import ProjectEditor from "./ProjectEditor";
import AboutEditor from "./AboutEditor";
import AnalyticsPanel from "./AnalyticsPanel";
import MediaLibrary from "./MediaLibrary";
import { useRouter } from "next/navigation";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Tab =
  | "theme" | "hero" | "projects" | "about"
  | "contact" | "meta" | "navbar" | "footer" | "versions" | "analytics"
  | "media" | "sections" | "maintenance";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "theme", label: "Thème", icon: <Palette size={18} /> },
  { id: "hero", label: "Hero", icon: <User size={18} /> },
  { id: "projects", label: "Projets", icon: <FolderOpen size={18} /> },
  { id: "about", label: "À propos", icon: <Info size={18} /> },
  { id: "contact", label: "Contact", icon: <MessageSquare size={18} /> },
  { id: "meta", label: "SEO / Meta", icon: <Search size={18} /> },
  { id: "navbar", label: "Navbar", icon: <Navigation size={18} /> },
  { id: "footer", label: "Footer", icon: <Footprints size={18} /> },
  { id: "sections", label: "Ordre sections", icon: <LayoutGrid size={18} /> },
  { id: "media", label: "Médias", icon: <ImageIcon size={18} /> },
  { id: "versions", label: "Historique", icon: <History size={18} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
  { id: "maintenance", label: "Maintenance", icon: <Wrench size={18} /> },
];

type SaveStatus = "idle" | "saving" | "success" | "error";

interface Version {
  filename: string;
  timestamp: number;
  label: string;
}

function VersionsPanel() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/portfolio/versions");
    const json = await res.json();
    setVersions(json.versions ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createSnapshot = async () => {
    await fetch("/api/portfolio/versions", { method: "POST" });
    load();
  };

  const restore = async (filename: string) => {
    if (!confirm("Restaurer cette version ? La version actuelle sera sauvegardée.")) return;
    setRestoring(filename);
    await fetch("/api/portfolio/versions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    setRestoring(null);
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Snapshots automatiques à chaque sauvegarde. Maximum 20 versions.</p>
        <button
          onClick={createSnapshot}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
        >
          <History size={14} />
          Créer un snapshot
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400">Chargement...</p>
      ) : versions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <History size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucune version sauvegardée</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {versions.map((v) => (
            <div key={v.filename} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
              <div>
                <p className="text-sm font-semibold">{v.label}</p>
                <p className="text-xs text-gray-400 font-mono">{v.filename}</p>
              </div>
              <button
                onClick={() => restore(v.filename)}
                disabled={restoring === v.filename}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors disabled:opacity-50"
              >
                <RotateCcw size={12} />
                {restoring === v.filename ? "Restauration..." : "Restaurer"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Sortable section row ── */
const SECTION_LABELS: Record<string, string> = {
  hero: "🦸 Hero",
  projects: "📂 Projets",
  about: "👤 À propos",
  contact: "✉️ Contact",
};

function SortableSectionRow({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, resizeObserverConfig: {} });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
        <GripVertical size={16} />
      </div>
      <span className="text-sm font-semibold">{SECTION_LABELS[id] ?? id}</span>
    </div>
  );
}

function SectionOrderPanel({ data, onChange }: { data: PortfolioData; onChange: (d: PortfolioData) => void }) {
  const order = data.sectionOrder ?? ["hero", "projects", "about", "contact"];
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = order.indexOf(active.id as string);
      const newIdx = order.indexOf(over.id as string);
      onChange({ ...data, sectionOrder: arrayMove(order, oldIdx, newIdx) });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">Glissez pour réorganiser l&apos;ordre des sections du portfolio.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {order.map((id) => <SortableSectionRow key={id} id={id} />)}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

/* ── Maintenance panel ── */
function MaintenancePanel({ data, onChange }: { data: PortfolioData; onChange: (d: PortfolioData) => void }) {
  const isOn = data.maintenanceMode ?? false;
  return (
    <div className="flex flex-col gap-6">
      <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between">
        <div>
          <p className="font-heading font-bold text-base">Mode maintenance</p>
          <p className="text-sm text-gray-500 mt-0.5">
            Affiche une page &ldquo;Bientôt disponible&rdquo; aux visiteurs. L&apos;admin reste accessible.
          </p>
        </div>
        <button
          onClick={() => onChange({ ...data, maintenanceMode: !isOn })}
          className={`relative w-14 h-7 rounded-full transition-colors shrink-0 ${isOn ? "bg-orange-500" : "bg-gray-200"}`}
        >
          <span className={`absolute top-1.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isOn ? "translate-x-8" : "translate-x-1.5"}`} />
        </button>
      </div>
      {isOn && (
        <div className="p-4 rounded-xl border border-orange-200 bg-orange-50 flex items-start gap-3">
          <Wrench size={18} className="text-orange-500 mt-0.5 shrink-0" />
          <p className="text-sm text-orange-700 font-medium">
            Le portfolio est actuellement en mode maintenance. N&apos;oubliez pas de sauvegarder et de le désactiver quand vous avez terminé.
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard({ initialData }: { initialData: PortfolioData }) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [activeTab, setActiveTab] = useState<Tab>("theme");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const router = useRouter();

  const handleSave = useCallback(async () => {
    setSaveStatus("saving");
    setErrorMsg("");
    try {
      await fetch("/api/portfolio/versions", { method: "POST" });
      const res = await fetch("/api/portfolio/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de la sauvegarde");
      }
      setSaveStatus("success");
      setPreviewKey((k) => k + 1);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setSaveStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
      setTimeout(() => setSaveStatus("idle"), 5000);
    }
  }, [data]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: "var(--color-primary)" }}>
            <Palette size={16} />
          </div>
          <h1 className="font-heading font-bold text-lg">Administration</h1>
          {data.maintenanceMode && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600">
              <Wrench size={11} />
              Maintenance ON
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === "success" && (
            <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <Check size={16} /> Sauvegardé
            </motion.span>
          )}
          {saveStatus === "error" && (
            <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
              <AlertCircle size={16} /> {errorMsg}
            </motion.span>
          )}
          <button
            onClick={() => setPreviewVisible((v) => !v)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${previewVisible ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            {previewVisible ? <Columns size={16} /> : <Eye size={16} />}
            {previewVisible ? "Masquer aperçu" : "Aperçu live"}
          </button>
          <motion.button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-60 transition-opacity"
            style={{ background: saveStatus === "success" ? "#22c55e" : "var(--color-primary)" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save size={16} />
            {saveStatus === "saving" ? "Enregistrement..." : "Enregistrer"}
          </motion.button>
          <button
            onClick={handleLogout}
            aria-label="Se déconnecter"
            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-gray-100 flex flex-col py-4 shrink-0 overflow-y-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-colors text-left ${
                activeTab === tab.id ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className={activeTab === tab.id ? "text-indigo-500" : "text-gray-400"}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Main editor */}
        <div className={`flex flex-1 overflow-hidden ${previewVisible ? "divide-x divide-gray-200" : ""}`}>
          <main className={`overflow-y-auto p-6 ${previewVisible ? "w-1/2" : "flex-1"}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="font-heading font-black text-2xl mb-6">
                  {TABS.find((t) => t.id === activeTab)?.label}
                </h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  {activeTab === "theme" && (
                    <ThemeEditor data={data.theme} onChange={(theme) => setData({ ...data, theme })} />
                  )}
                  {(activeTab === "hero" || activeTab === "navbar" || activeTab === "footer" || activeTab === "meta" || activeTab === "contact") && (
                    <SectionEditor section={activeTab} data={data} onChange={setData} />
                  )}
                  {activeTab === "projects" && (
                    <ProjectEditor data={data.projects} onChange={(projects) => setData({ ...data, projects })} />
                  )}
                  {activeTab === "about" && (
                    <AboutEditor data={data.about} onChange={(about) => setData({ ...data, about })} />
                  )}
                  {activeTab === "sections" && (
                    <SectionOrderPanel data={data} onChange={setData} />
                  )}
                  {activeTab === "media" && <MediaLibrary />}
                  {activeTab === "maintenance" && (
                    <MaintenancePanel data={data} onChange={setData} />
                  )}
                  {activeTab === "versions" && <VersionsPanel />}
                  {activeTab === "analytics" && <AnalyticsPanel />}
                </div>
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Live preview iframe */}
          {previewVisible && (
            <div className="w-1/2 flex flex-col bg-gray-100">
              <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
                <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <Eye size={12} />
                  Aperçu live — sauvegardez pour actualiser
                </span>
                <button onClick={() => setPreviewKey((k) => k + 1)} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">
                  Actualiser
                </button>
              </div>
              <iframe key={previewKey} src="/" className="flex-1 w-full border-0" title="Aperçu du portfolio" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
