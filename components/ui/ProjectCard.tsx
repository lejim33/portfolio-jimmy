"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types/portfolio";

export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const num = String(index + 1).padStart(2, "0");
  const color = project.detail.color;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-full"
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >
      {/* Color accent top bar */}
      <div className="h-1 w-full transition-all duration-300 group-hover:h-1.5" style={{ background: color }} />

      {/* Cover image */}
      <div className="relative h-52 overflow-hidden" style={{ background: `${color}0d` }}>
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-[0.07] flex items-center justify-center font-heading font-black select-none pointer-events-none"
              style={{ fontSize: "10rem", lineHeight: 1, color }}
            >
              {project.title.charAt(0)}
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 h-24 opacity-20"
              style={{ background: `linear-gradient(to top, ${color}, transparent)` }}
            />
          </>
        )}

        {/* Number badge */}
        <div
          className="absolute top-4 left-4 font-heading font-black text-xs px-2 py-1 rounded-lg text-white"
          style={{ background: color }}
        >
          {num}
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-4 right-4 px-2 py-1 rounded-lg text-xs font-semibold text-white backdrop-blur-sm bg-black/30">
            ⭐ Featured
          </div>
        )}

        {/* Tag overlay on hover */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/60 to-transparent"
        >
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs font-medium text-white/90 backdrop-blur-sm bg-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-heading font-bold text-lg leading-snug transition-colors"
            style={{ color: "var(--color-text)" }}
          >
            {project.title}
          </h3>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed flex-1">{project.shortDescription}</p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div>
            <p className="text-xs text-gray-400 font-medium">{project.client}</p>
            <p className="text-xs text-gray-300">{project.date}</p>
          </div>
          <Link href={`/projects/${project.slug}`}>
            <motion.div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-transform"
              style={{ background: color }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUpRight size={16} />
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Bottom color glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `0 20px 50px ${color}30` }}
      />
    </motion.div>
  );
}
