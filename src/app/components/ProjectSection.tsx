"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Github, ArrowUpRight, Sparkles, Folder } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const projects = [
  {
    title: "Transactly Payments App",
    description:
      "A peer-to-peer payments application with real-time transactions, wallet management, and secure authentication.",
    image: "/images/transactly.png",
    github:
      "https://github.com/Dakshjain1604/transactly_frontend/blob/main/README.md",
    link: "https://transactly-frontend.vercel.app/signup",
    tech: ["React.js", "Node.js", "TypeScript", "MongoDB"],
    featured: true,
  },
  {
    title: "Live Tracking App",
    description:
      "Real-time location tracking application with interactive maps and live position updates.",
    image: "/images/live-tracking.png",
    github: "https://github.com/Dakshjain1604/Live-Tracking/tree/main",
    tech: ["JavaScript", "HTML", "CSS"],
    featured: false,
  },
  {
    title: "Brainly - Second Brain",
    description:
      "Personal knowledge management system for organizing links, notes, and resources efficiently.",
    image: "/images/brainlyImages/BrainlyImage.png",
    github: "https://github.com/Dakshjain1604/Brainly",
    tech: ["React.js", "Node.js", "MongoDB"],
    featured: true,
  },
  {
    title: "AI Website Cloner",
    description:
      "Clone any website instantly using AI — powered by computer vision and intelligent code generation.",
    image: "/images/Website_Cloner.avif",
    github: "https://github.com/Dakshjain1604/website_cloner.git",
    ai: true,
    tech: ["Next.js", "FastAPI", "OpenAI"],
    featured: true,
  },
  {
    title: "Documind AI",
    description:
      "Chat with your documents using RAG pipeline — upload PDFs and get intelligent answers instantly.",
    image: "/images/Documind.png",
    github: "https://github.com/Dakshjain1604/DocuMind-Ai",
    link: "https://docu-mind-ai-nu.vercel.app/",
    ai: true,
    featured: true,
    tech: ["Next.js", "FastAPI", "OpenAI", "ChromaDB"],
  },
  {
    title: "DrawSync",
    description:
      "Real-time collaborative whiteboard application with drawing tools and live collaboration features.",
    image: "/images/excalidraw-sample.png",
    github: "https://github.com/Dakshjain1604/DrawSync",
    tech: ["React.js", "Socket.io", "Canvas API"],
    featured: false,
  },
];

const techColors: Record<string, string> = {
  "React.js": "border-cyan-500/30 text-cyan-400 bg-cyan-500/5",
  "Node.js": "border-green-500/30 text-green-400 bg-green-500/5",
  TypeScript: "border-blue-500/30 text-blue-400 bg-blue-500/5",
  MongoDB: "border-green-600/30 text-green-500 bg-green-600/5",
  JavaScript: "border-yellow-500/30 text-yellow-400 bg-yellow-500/5",
  HTML: "border-orange-500/30 text-orange-400 bg-orange-500/5",
  CSS: "border-blue-400/30 text-blue-300 bg-blue-400/5",
  "Next.js": "border-white/20 text-white bg-white/5",
  FastAPI: "border-teal-500/30 text-teal-400 bg-teal-500/5",
  OpenAI: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5",
  ChromaDB: "border-amber-500/30 text-amber-400 bg-amber-500/5",
  PostgreSQL: "border-blue-600/30 text-blue-400 bg-blue-600/5",
  "Socket.io": "border-gray-400/30 text-gray-300 bg-gray-400/5",
  "Canvas API": "border-pink-500/30 text-pink-400 bg-pink-500/5",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Projects() {
  const [filter, setFilter] = useState<"all" | "ai" | "featured">("all");
  
  const filteredProjects = projects.filter((project) => {
    if (filter === "ai") return project.ai;
    if (filter === "featured") return project.featured;
    return true;
  });

  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "#0d0d14" }}
      id="projects"
    >
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full text-xs font-medium text-pink-300 bg-pink-500/10 border border-pink-500/20 mb-4"
          >
            My work
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-neutral-400 text-sm mt-3 max-w-md mx-auto">
            A collection of projects I&apos;ve built and contributed to
          </p>
          <div className="section-divider mt-4" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center gap-3 mb-10"
        >
          {(["all", "featured", "ai"] as const).map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                filter === f
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "bg-white/5 text-neutral-400 border border-white/10 hover:border-white/20"
              }`}
            >
              {f === "all" ? "All Projects" : f === "ai" ? "🤖 AI Projects" : "⭐ Featured"}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-6"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.title}
              variants={cardVariant}
              layout
              whileHover={{ y: -5 }}
              className="group glass-card rounded-2xl overflow-hidden hover:border-cyan-500/20 transition-all duration-500"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={project.image}
                  height={400}
                  width={700}
                  className="w-full h-48 md:h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={project.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent" />

                {project.ai && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm flex items-center gap-1"
                  >
                    <Sparkles size={10} />
                    AI Powered
                  </motion.div>
                )}

                {project.featured && !project.ai && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                    ⭐ Featured
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    {project.github && (
                      <Link
                        href={project.github}
                        target="_blank"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
                      >
                        <Github size={16} />
                      </Link>
                    )}
                    {project.link && (
                      <Link
                        href={project.link}
                        target="_blank"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-cyan-400 transition-all"
                      >
                        <ArrowUpRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>

                <p className="text-sm text-neutral-400 leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${techColors[tech] || "border-white/10 text-neutral-400 bg-white/5"}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/Dakshjain1604"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors group"
          >
            <Folder size={16} />
            <span>View all projects on GitHub</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
