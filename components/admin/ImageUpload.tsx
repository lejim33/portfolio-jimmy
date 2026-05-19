"use client";
import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (res.ok) {
      const { url } = await res.json();
      onChange(url);
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden min-h-[120px] flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <div className="relative w-full h-40">
            <Image src={value} alt="Aperçu" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              aria-label="Supprimer l'image"
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400 py-6">
            {uploading ? (
              <span className="text-sm">Upload en cours...</span>
            ) : (
              <>
                <Upload size={24} />
                <span className="text-sm">Glisser-déposer ou cliquer pour uploader</span>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ou saisir une URL..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-indigo-400"
        />
        {value && (
          <a href={value} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg border border-gray-200 flex items-center">
            <ImageIcon size={16} className="text-gray-400" />
          </a>
        )}
      </div>
    </div>
  );
}
