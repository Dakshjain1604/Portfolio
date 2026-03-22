"use client";
import { motion } from "framer-motion";
import { AzureIcon } from "../icons/AzureIcon";
import { Cssicon } from "../icons/css";
import { DockerIcon } from "../icons/DockerIcon";
import { Github } from "../icons/github";
import { GitIcon } from "../icons/GitIcon";
import { GraphhQL } from "../icons/GraphQl";
import { HtmlIcon } from "../icons/Html";
import { JavaScript } from "../icons/JavaScript";
import { MongoDbIcon } from "../icons/MongoDb";
import { MySqlIcon } from "../icons/MySqlIcon";
import { NextjsIcon } from "../icons/Nextjsicon";
import { NodejsIcon } from "../icons/nodejs";
import { PostgreSQL } from "../icons/Postgre";
import { PostManIcon } from "../icons/PostManIcon";
import { PrismIcon } from "../icons/primsaicon";
import { PythonIcon } from "../icons/PythonIcon";
import { Reactlogo } from "../icons/ReactIcon";
import { RedisIcon } from "../icons/RedisIcon";
import { SwaggerIcon } from "../icons/SwaggerIcon";
import { TailwindIcon } from "../icons/Tailwindcss";
import { TypeScriptIcon } from "../icons/TypeScriptIcon";
import { ZodIcon } from "../icons/ZodIcon";
import { 
  Brain, Link2, Database, Server, Code, Wrench, 
  TerminalSquare, Sparkles, MessageSquareCode, 
  Network, DatabaseZap, Globe, MonitorSmartphone
} from "lucide-react";

export function Skills() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#09090b]" id="skills">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full opacity-30 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Technical <span className="gradient-text">Arsenal</span>
          </h2>
          <div className="section-divider mt-6" />
        </motion.div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-4 md:gap-6">
          
          {/* TILE 1: AI & GenAI (Large, 2x2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 lg:row-span-2 glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden group border border-white/10 hover:border-cyan-500/50 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white">AI & GenAI Engineering</h3>
              </div>
              
              <p className="text-sm text-neutral-400 mb-8 leading-relaxed max-w-sm">
                Building intelligent, production-ready AI systems, RAG pipelines, and autonomous agents.
              </p>

              <div className="mt-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: "LangChain", icon: <Link2 size={24} className="text-blue-400" /> },
                  { name: "RAG Pipelines", icon: <Network size={24} className="text-purple-400" /> },
                  { name: "Claude API", icon: <MessageSquareCode size={24} className="text-orange-400" /> },
                  { name: "OpenAI API", icon: <Brain size={24} className="text-emerald-400" /> },
                  { name: "AI Agents", icon: <TerminalSquare size={24} className="text-pink-400" /> },
                  { name: "ChromaDB", icon: <DatabaseZap size={24} className="text-cyan-400" /> },
                ].map((skill) => (
                  <div key={skill.name} className="flex flex-col gap-2 items-start p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
                    {skill.icon}
                    <span className="text-xs md:text-sm font-medium text-neutral-300">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* TILE 2: Backend Architecture (Tall, 1x2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="col-span-1 lg:col-span-1 row-span-1 lg:row-span-2 glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/10 hover:border-emerald-500/30 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Server size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">Backend</h3>
              </div>
              
              <div className="flex flex-col gap-3 mt-auto">
                {[
                  { name: "Node.js", icon: <NodejsIcon /> },
                  { name: "Express.js", icon: <Server size={18} className="text-neutral-500" /> },
                  { name: "PostgreSQL", icon: <PostgreSQL /> },
                  { name: "MongoDB", icon: <MongoDbIcon /> },
                  { name: "Redis", icon: <RedisIcon /> },
                  { name: "GraphQL", icon: <GraphhQL /> },
                  { name: "Prisma", icon: <PrismIcon /> },
                ].map((skill) => (
                  <div key={skill.name} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                    <div className="w-6 h-6 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">{skill.icon}</div>
                    <span className="text-sm font-medium text-neutral-400 group-hover:text-neutral-200">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* TILE 3: Cloud & DevOps (Normal, 1x1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="col-span-1 lg:col-span-1 row-span-1 glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/10 hover:border-blue-500/30 transition-colors"
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <Globe size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">Cloud</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-auto">
                {[
                  { name: "AWS", icon: <Globe size={18} className="text-amber-500" /> },
                  { name: "Docker", icon: <DockerIcon /> },
                  { name: "Azure", icon: <AzureIcon /> },
                  { name: "CI/CD", icon: <Github height={18} width={18} /> },
                ].map((skill) => (
                  <div key={skill.name} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-black/20 hover:bg-white/5 transition-colors border border-white/5">
                    <div className="w-6 h-6 flex items-center justify-center">{skill.icon}</div>
                    <span className="text-xs font-medium text-neutral-400">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* TILE 4: Languages (Normal, 1x1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="col-span-1 lg:col-span-1 row-span-1 glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/10 hover:border-yellow-500/30 transition-colors"
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400">
                  <Code size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">Languages</h3>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {[
                  { name: "TypeScript", icon: <TypeScriptIcon /> },
                  { name: "JavaScript", icon: <JavaScript /> },
                  { name: "Python", icon: <PythonIcon /> },
                  { name: "C++", icon: <Code size={16} className="text-blue-500" /> },
                  { name: "SQL", icon: <Database size={16} className="text-neutral-400" /> },
                ].map((skill) => (
                  <div key={skill.name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5">
                    <div className="w-4 h-4 flex items-center justify-center">{skill.icon}</div>
                    <span className="text-xs font-medium text-neutral-300">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* TILE 5: Frontend Development (Wide, 2x1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden group border border-white/10 hover:border-pink-500/30 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
                  <MonitorSmartphone size={20} />
                </div>
                <h3 className="text-xl font-semibold text-white">Frontend</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-auto">
                {[
                  { name: "React.js", icon: <Reactlogo /> },
                  { name: "Next.js (SSR)", icon: <NextjsIcon /> },
                  { name: "Tailwind CSS", icon: <TailwindIcon /> },
                  { name: "Redux", icon: <Globe size={20} className="text-purple-500" /> },
                  { name: "Framer Motion", icon: <Sparkles size={20} className="text-pink-400" /> },
                ].map((skill) => (
                  <div key={skill.name} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/item">
                    <div className="w-6 h-6 flex items-center justify-center grayscale group-hover/item:grayscale-0 transition-all">{skill.icon}</div>
                    <span className="text-sm font-medium text-neutral-300">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* TILE 6: Tools & Practices (Wide, 2x1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden group border border-white/10 hover:border-neutral-500/30 transition-colors"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-neutral-500/20 text-neutral-300">
                  <Wrench size={20} />
                </div>
                <h3 className="text-xl font-semibold text-white">Tools & Practices</h3>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {["REST APIs", "JWT", "OAuth 2.0", "Git", "Swagger", "Postman", "Jest", "Zod", "Claude Code (AI-Assisted Dev)", "Cursor"].map((tool) => (
                  <span key={tool} className="px-4 py-2 text-xs sm:text-sm font-medium text-neutral-400 bg-black/30 rounded-full border border-white/5 hover:text-white hover:border-white/20 transition-colors tracking-wide">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
