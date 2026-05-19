"use client";
import { useEffect, useState } from "react";
import { BarChart2, Eye, MousePointer, TrendingUp, ExternalLink, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface AnalyticsData {
  total: number;
  pages: [string, number][];
  projectCount: number;
}

export default function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      setData(json);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const maxViews = data?.pages?.[0]?.[1] ?? 1;

  const stats = data
    ? [
        { label: "Pages vues totales", value: String(data.total || 0), icon: <Eye size={20} />, color: "#6366f1" },
        { label: "Pages distinctes", value: String(data.pages?.length ?? 0), icon: <TrendingUp size={20} />, color: "#f43f5e" },
        { label: "Projets visités", value: String(data.projectCount ?? 0), icon: <MousePointer size={20} />, color: "#10b981" },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Données de visites enregistrées localement.</p>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            aria-label="Actualiser"
            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          <a
            href="https://vercel.com/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <ExternalLink size={14} />
            Vercel Analytics
          </a>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl border border-gray-100 bg-gray-50 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: stat.color }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="font-heading font-black text-2xl">{stat.value}</p>
                  <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-sm text-gray-600">Pages les plus visitées</h3>
              <BarChart2 size={16} className="text-gray-300" />
            </div>
            {!data?.pages?.length ? (
              <p className="text-sm text-gray-400">Aucune visite enregistrée pour l&apos;instant.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {data.pages.slice(0, 10).map(([page, count], i) => (
                  <motion.div
                    key={page}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-xs text-gray-500 flex-1 font-mono truncate">{page}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-indigo-200 transition-all" style={{ width: `${Math.max(24, (count / maxViews) * 120)}px` }}>
                        <div className="h-full rounded-full" style={{ width: "100%", background: "var(--color-primary)" }} />
                      </div>
                      <span className="text-xs font-bold text-gray-600 w-8 text-right">{count}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
