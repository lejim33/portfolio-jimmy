"use client";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Copy, Check } from "lucide-react";
import { useState } from "react";
import SocialIcon from "@/components/ui/SocialIcon";
import { PortfolioData } from "@/types/portfolio";
import { useToast } from "@/components/ui/Toast";

type Status = "idle" | "loading" | "success" | "error";

function CopyableContact({
  icon,
  label,
  value,
  href,
  color,
  copyValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string | null;
  color: string;
  copyValue?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = copyValue ?? value;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast(`${label} copié !`, "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ x: 4 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm group relative"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 transition-transform group-hover:rotate-6"
        style={{ background: color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</p>
        {href ? (
          <a href={href} className="text-sm font-semibold hover:underline truncate block" style={{ color: "var(--color-text)" }}>
            {value}
          </a>
        ) : (
          <p className="text-sm font-semibold truncate">{value}</p>
        )}
      </div>
      {copyValue && (
        <motion.button
          onClick={handleCopy}
          aria-label={`Copier ${label}`}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0"
          style={{ background: copied ? "#22c55e10" : "var(--color-primary)10", color: copied ? "#22c55e" : "var(--color-primary)" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </motion.button>
      )}
    </motion.div>
  );
}

/* Floating label input */
function FloatField({
  field,
  value,
  onChange,
  isTextarea = false,
  isEmail = false,
}: {
  field: string;
  value: string;
  onChange: (v: string) => void;
  isTextarea?: boolean;
  isEmail?: boolean;
}) {
  const id = `contact-${field.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="float-label-group">
      {isTextarea ? (
        <textarea
          id={id}
          placeholder=" "
          required
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 pt-6 pb-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] text-sm transition-colors resize-none bg-transparent"
        />
      ) : (
        <input
          id={id}
          type={isEmail ? "email" : "text"}
          placeholder=" "
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 pt-6 pb-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] text-sm transition-colors bg-transparent"
        />
      )}
      <label htmlFor={id}>{field}</label>
    </div>
  );
}

export default function ContactSection({ data }: { data: PortfolioData["contact"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, to: data.email }),
      });
      if (res.ok) {
        setStatus("idle");
        setFormData({});
        toast("Message envoyé avec succès !", "success");
      } else {
        setStatus("idle");
        toast("Erreur lors de l'envoi. Réessayez.", "error");
      }
    } catch {
      setStatus("idle");
      toast("Erreur lors de l'envoi. Réessayez.", "error");
    }
  };

  const contactItems = [
    { icon: <Mail size={20} />, label: "Email", value: data.email, href: `mailto:${data.email}`, color: "var(--color-primary)", copyValue: data.email },
    { icon: <Phone size={20} />, label: "Téléphone", value: data.phone, href: `tel:${data.phone}`, color: "var(--color-accent)", copyValue: data.phone },
    { icon: <MapPin size={20} />, label: "Localisation", value: data.location, href: null, color: "var(--color-text)", copyValue: undefined },
  ];

  return (
    <section id="contact" className="py-24 bg-gray-50/50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 relative"
        >
          <span
            className="absolute -top-6 left-0 font-heading font-black text-[8rem] leading-none select-none pointer-events-none opacity-[0.04]"
            style={{ color: "var(--color-accent)" }}
          >
            ✉
          </span>
          <div className="flex items-end gap-6 mb-4">
            <h2 className="font-heading font-black text-4xl md:text-6xl leading-none">{data.sectionTitle}</h2>
            <div className="hidden md:block flex-1 h-[3px] mb-3 rounded-full" style={{ background: "linear-gradient(to right, var(--color-primary), transparent)" }} />
          </div>
          <p className="text-gray-500 text-lg max-w-xl">{data.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-3">
              {contactItems.map((item) => (
                <CopyableContact key={item.label} {...item} />
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Retrouvez-moi sur</p>
              <div className="flex gap-3">
                {data.socialLinks.map((social) => (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all"
                    style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
                    whileHover={{ scale: 1.1, background: "var(--color-primary)", color: "#fff" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SocialIcon icon={social.icon} size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability card */}
            {data.availabilityVisible !== false && (
              <motion.div
                className="p-6 rounded-2xl text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
                <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10" />
                <p className="font-heading font-black text-xl relative z-10">
                  {data.availabilityTitle || "Disponible pour"}
                </p>
                <p className="text-white/80 text-sm mt-1 relative z-10">
                  {data.availabilitySubtitle || "Stages, alternances & projets freelance"}
                </p>
                {data.availabilityStatus && (
                  <div className="mt-3 flex items-center gap-2 relative z-10">
                    <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                    <span className="text-xs text-white/80 font-medium">{data.availabilityStatus}</span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Right: form */}
          {data.formEnabled && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="font-heading font-black text-xl mb-6">Envoyer un message</h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Honeypot anti-spam */}
                  <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

                  {data.formFields.map((field) => (
                    <FloatField
                      key={field}
                      field={field}
                      value={formData[field] || ""}
                      onChange={(v) => handleChange(field, v)}
                      isTextarea={field.toLowerCase() === "message"}
                      isEmail={field.toLowerCase() === "email"}
                    />
                  ))}

                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white mt-2 disabled:opacity-60"
                    style={{ background: "var(--color-primary)" }}
                    whileHover={{ scale: status === "loading" ? 1 : 1.03, boxShadow: "0 10px 30px rgba(99,102,241,0.35)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {status === "loading" ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Envoyer le message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
