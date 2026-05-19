"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, Check, Upload, Image as ImageIcon, FileText, RefreshCw } from "lucide-react";
import Image from "next/image";

interface MediaFile {
  filename: string;
  url: string;
  size: number;
  createdAt: number;
  isPdf: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const { files: f } = await res.json();
      setFiles(f ?? []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const deleteFile = async (filename: string) => {
    if (!confirm(`Supprimer "${filename}" ?`)) return;
    await fetch("/api/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    setFiles((prev) => prev.filter((f) => f.filename !== filename));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    await fetch("/api/upload", { method: "POST", body: form });
    setUploading(false);
    load();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{files.length} fichier(s) — cliquez sur une URL pour la copier</p>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            aria-label="Actualiser"
            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-60"
          >
            <Upload size={14} />
            {uploading ? "Upload..." : "Uploader"}
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-100 aspect-square animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ImageIcon size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun fichier uploadé</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <AnimatePresence>
            {files.map((file, i) => (
              <motion.div
                key={file.filename}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                className="group relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-square flex items-center justify-center"
              >
                {file.isPdf ? (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <FileText size={32} />
                    <span className="text-xs font-medium text-center px-2 truncate w-full text-center">{file.filename}</span>
                  </div>
                ) : (
                  <Image
                    src={file.url}
                    alt={file.filename}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-2">
                  <button
                    onClick={() => copyUrl(file.url)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-gray-800 hover:bg-gray-100 transition-colors w-full justify-center"
                  >
                    {copiedUrl === file.url ? <Check size={12} /> : <Copy size={12} />}
                    {copiedUrl === file.url ? "Copié !" : "Copier URL"}
                  </button>
                  <p className="text-xs text-white/60 text-center truncate w-full">{formatSize(file.size)}</p>
                  <button
                    onClick={() => deleteFile(file.filename)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors w-full justify-center"
                  >
                    <Trash2 size={12} />
                    Supprimer
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
