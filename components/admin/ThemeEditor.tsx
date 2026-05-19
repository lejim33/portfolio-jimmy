"use client";
import { PortfolioData } from "@/types/portfolio";

interface Props {
  data: PortfolioData["theme"];
  onChange: (updated: PortfolioData["theme"]) => void;
}

const Field = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    {type === "color" ? (
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:border-indigo-400"
        />
      </div>
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-indigo-400"
      />
    )}
  </div>
);

export default function ThemeEditor({ data, onChange }: Props) {
  const update = (key: keyof typeof data, value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-heading font-bold text-lg mb-4">Couleurs</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Couleur primaire" value={data.primaryColor} onChange={(v) => update("primaryColor", v)} type="color" />
          <Field label="Couleur accent" value={data.accentColor} onChange={(v) => update("accentColor", v)} type="color" />
          <Field label="Arrière-plan" value={data.backgroundColor} onChange={(v) => update("backgroundColor", v)} type="color" />
          <Field label="Couleur texte" value={data.textColor} onChange={(v) => update("textColor", v)} type="color" />
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold text-lg mb-4">Typographie</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Police titres" value={data.fontHeading} onChange={(v) => update("fontHeading", v)} />
          <Field label="Police corps" value={data.fontBody} onChange={(v) => update("fontBody", v)} />
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold text-lg mb-4">Apparence</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Border radius" value={data.borderRadius} onChange={(v) => update("borderRadius", v)} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Vitesse des animations
            </label>
            <select
              value={data.animationSpeed}
              onChange={(e) => update("animationSpeed", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-indigo-400"
            >
              <option value="slow">Lente</option>
              <option value="normal">Normale</option>
              <option value="fast">Rapide</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div className="p-6 rounded-2xl border border-dashed border-gray-200">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-medium">Aperçu des couleurs</p>
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 rounded-full text-white text-sm font-semibold" style={{ background: data.primaryColor }}>
            Couleur primaire
          </div>
          <div className="px-4 py-2 rounded-full text-white text-sm font-semibold" style={{ background: data.accentColor }}>
            Accent
          </div>
          <div className="px-4 py-2 rounded-full text-sm font-semibold border" style={{ color: data.primaryColor, borderColor: data.primaryColor }}>
            Bordure
          </div>
        </div>
      </div>
    </div>
  );
}
