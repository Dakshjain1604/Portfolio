"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github, ArrowUpRight, Sparkles, Folder, Bot, Star } from "lucide-react";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";

const projects = [
  {
    title: "DocuMind AI",
    description: "Full-stack AI document assistant with RAG pipelines. Chat with PDFs and get real-time generative answers via LangChain & ChromaDB.",
    image: "/images/Documind.png",
    github: "https://github.com/Dakshjain1604/DocuMind-Ai",
    link: "https://docu-mind-ai-nu.vercel.app/",
    ai: true,
    featured: true,
    tech: ["Next.js", "LangChain", "ChromaDB", "OpenAI"],
  },
  {
    title: "AI Interview Simulator",
    description: "An AI-powered mock interview application that generates personalized questions and offers real-time conversational performance analytics.",
    image: "/images/Website_Cloner.avif", // Using existing placeholder since no new image provided
    github: "https://github.com/Dakshjain1604", // Fallback github link
    link: "",
    ai: true,
    featured: true,
    tech: ["React.js", "Node.js", "OpenAI API", "Redux"],
  },
  {
    title: "Transactly Payments App",
    description: "A secure, robust peer-to-peer payments backend with atomic transactions, wallet management, and comprehensive REST APIs.",
    image: "/images/transactly.png",
    github: "https://github.com/Dakshjain1604/transactly_frontend/blob/main/README.md",
    link: "https://transactly-frontend.vercel.app/signup",
    tech: ["Node.js", "Express", "MongoDB", "Swagger"],
    featured: true,
  },
  {
    title: "AI Website Cloner",
    description: "Clone any website instantly using AI — powered by computer vision and intelligent code generation to build production TSX.",
    image: "/images/Website_Cloner.avif",
    github: "https://github.com/Dakshjain1604/website_cloner.git",
    ai: true,
    featured: false,
    tech: ["Next.js", "FastAPI", "OpenAI", "CV"],
  },
  {
    title: "Brainly - Second Brain",
    description: "Personal knowledge management system for organizing links, notes, and resources efficiently in the cloud.",
    image: "/images/brainlyImages/BrainlyImage.png",
    github: "https://github.com/Dakshjain1604/Brainly",
    tech: ["React.js", "Node.js", "MongoDB", "JWT"],
    featured: false,
    ai: false,
  },
  {
    title: "DrawSync",
    description: "Real-time collaborative whiteboard application with drawing tools, room syncing, and live interaction features.",
    image: "/images/excalidraw-sample.png",
    github: "https://github.com/Dakshjain1604/DrawSync",
    tech: ["React.js", "Socket.io", "Canvas API"],
    featured: false,
    ai: false,
  },
];

const techColors: Record<string, string> = {
  "React.js": "border-cyan-500/30 text-cyan-400 bg-cyan-500/5",
  "Node.js": "border-green-500/30 text-green-400 bg-green-500/5",
  "Next.js": "border-white/20 text-white bg-white/5",
  LangChain: "border-blue-500/30 text-blue-400 bg-blue-500/5",
  ChromaDB: "border-amber-500/30 text-amber-400 bg-amber-500/5",
  "OpenAI": "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
  "OpenAI API": "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
  Redux: "border-purple-500/30 text-purple-400 bg-purple-500/5",
  Express: "border-neutral-500/30 text-neutral-400 bg-neutral-500/5",
  MongoDB: "border-green-600/30 text-green-500 bg-green-600/5",
  Swagger: "border-green-400/30 text-green-300 bg-green-400/5",
  FastAPI: "border-teal-500/30 text-teal-400 bg-teal-500/5",
  CV: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5",
  JWT: "border-pink-500/30 text-pink-400 bg-pink-500/5",
  "Socket.io": "border-gray-400/30 text-gray-300 bg-gray-400/5",
  "Canvas API": "border-orange-500/30 text-orange-400 bg-orange-500/5",
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
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
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
            My Work
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-neutral-400 text-sm mt-4 max-w-lg mx-auto leading-relaxed">
            A collection of production-grade scalable systems, AI applications, and technical explorations I&apos;ve built.
          </p>
          <div className="section-divider mt-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center flex-wrap gap-3 mb-4"
        >
          {(["all", "featured", "ai"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === f
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 scale-105 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  : "bg-white/5 text-neutral-400 border border-white/10 hover:border-white/20 hover:text-neutral-200"
              }`}
            >
              {f === "all" ? "All Projects" : f === "ai" ? <><Bot size={14} className="inline mr-1" /> AI Projects</> : <><Star size={14} className="inline mr-1" /> Featured</>}
            </button>
          ))}
        </motion.div>

        {/* MASONRY 3D GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              layout
            >
              <CardContainer className="inter-var w-full p-0">
                <CardBody className="bg-[#12121a] relative group/card border border-white/10 hover:border-cyan-500/30 w-full rounded-2xl p-5 md:p-6 transition-all duration-500 h-[460px] flex flex-col shadow-xl">
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                  
                  <CardItem
                    translateZ="80"
                    className="w-full relative h-[180px] md:h-[200px] rounded-xl overflow-hidden mb-5 border border-white/5"
                  >
                    <Image
                      src={project.image}
                      width={700}
                      height={400}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
                      alt={project.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent opacity-80" />
                    
                    {/* Tags overlay */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {project.ai && (
                        <div className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-medium uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                          <Sparkles size={10} />
                          AI Powered
                        </div>
                      )}
                      {project.featured && !project.ai && (
                        <div className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-[10px] font-medium uppercase tracking-wider backdrop-blur-md shadow-lg flex items-center gap-1">
                          <Star size={10} /> Featured
                        </div>
                      )}
                    </div>
                  </CardItem>

                  <div className="flex flex-col flex-1">
                    <CardItem
                      translateZ="50"
                      className="flex items-start justify-between gap-4 mb-3 w-full"
                    >
                      <h3 className="text-xl font-bold text-white group-hover/card:text-cyan-400 transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {project.github && (
                          <Link
                            href={project.github}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-neutral-400 hover:text-cyan-300 border border-transparent hover:border-cyan-500/30 transition-all"
                          >
                            <Github size={16} />
                          </Link>
                        )}
                        {project.link && (
                          <Link
                            href={project.link}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-pink-500/20 text-neutral-400 hover:text-pink-300 border border-transparent hover:border-pink-500/30 transition-all"
                          >
                            <ArrowUpRight size={16} />
                          </Link>
                        )}
                      </div>
                    </CardItem>

                    <CardItem translateZ="60" className="w-full">
                      <p className="text-sm text-neutral-400 leading-relaxed mb-5 line-clamp-3 2xl:line-clamp-4">
                        {project.description}
                      </p>
                    </CardItem>

                    <CardItem translateZ="40" className="mt-auto w-full">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-medium border shadow-sm ${techColors[tech] || "border-white/10 text-neutral-300 bg-white/5"}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-16"
        >
          <a
            href="https://github.com/Dakshjain1604"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-neutral-300 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all group shadow-lg"
          >
            <Folder size={16} className="text-cyan-400" />
            <span className="font-medium">Explore standard repos on GitHub</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform opacity-50" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
