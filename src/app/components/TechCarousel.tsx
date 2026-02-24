"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Reactlogo } from "../icons/ReactIcon";
import { NextjsIcon } from "../icons/Nextjsicon";
import { TypeScriptIcon } from "../icons/TypeScriptIcon";
import { NodejsIcon } from "../icons/nodejs";
import { PythonIcon } from "../icons/PythonIcon";
import { MongoDbIcon } from "../icons/MongoDb";
import { PostgreSQL } from "../icons/Postgre";
import { DockerIcon } from "../icons/DockerIcon";
import { AzureIcon } from "../icons/AzureIcon";
import { GraphhQL } from "../icons/GraphQl";
import { TailwindIcon } from "../icons/Tailwindcss";
import { RedisIcon } from "../icons/RedisIcon";
import { PrismIcon } from "../icons/primsaicon";
import { Brain, Zap } from "lucide-react";

const techStack = [
  { name: "React", icon: <Reactlogo />, category: "Frontend" },
  { name: "Next.js", icon: <NextjsIcon />, category: "Frontend" },
  { name: "TypeScript", icon: <TypeScriptIcon />, category: "Language" },
  { name: "Node.js", icon: <NodejsIcon />, category: "Backend" },
  { name: "Python", icon: <PythonIcon />, category: "Language" },
  { name: "MongoDB", icon: <MongoDbIcon />, category: "Database" },
  { name: "PostgreSQL", icon: <PostgreSQL />, category: "Database" },
  { name: "Docker", icon: <DockerIcon />, category: "DevOps" },
  { name: "Azure", icon: <AzureIcon />, category: "Cloud" },
  { name: "OpenAI", icon: <Brain size={18} className="text-neutral-400" />, category: "AI/ML" },
  { name: "GraphQL", icon: <GraphhQL />, category: "API" },
  { name: "Tailwind", icon: <TailwindIcon />, category: "Frontend" },
  { name: "Redis", icon: <RedisIcon />, category: "Database" },
  { name: "Prisma", icon: <PrismIcon />, category: "ORM" },
  { name: "FastAPI", icon: <Zap size={18} className="text-neutral-400" />, category: "Backend" },
  { name: "LangChain", icon: <Brain size={18} className="text-cyan-400" />, category: "AI/ML" },
];

export function TechCarousel() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setPosition((prev) => (prev >= 100 ? 0 : prev + 0.1));
    }, 16);

    return () => clearInterval(interval);
  }, [isHovered]);

  const duplicatedStack = [...techStack, ...techStack, ...techStack];

  return (
    <section className="py-12 relative overflow-hidden bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-6 md:px-8 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-xl md:text-2xl font-bold">
            Tech <span className="gradient-text">Stack</span>
          </h2>
        </motion.div>
      </div>

      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={containerRef}
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-4"
          animate={{ x: `-${position}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
          style={{ width: "fit-content" }}
        >
          {duplicatedStack.map((tech, i) => (
            <motion.div
              key={`${tech.name}-${i}`}
              whileHover={{ scale: 1.05, y: -3 }}
              className="flex-shrink-0 glass-card rounded-xl px-5 py-3 flex items-center gap-3 cursor-default group"
              style={{ minWidth: "140px" }}
            >
              <div className="[&>svg]:w-5 [&>svg]:h-5 text-neutral-400 group-hover:text-white transition-colors">
                {tech.icon}
              </div>
              <div>
                <p className="font-medium text-neutral-300 text-sm group-hover:text-white transition-colors">
                  {tech.name}
                </p>
                <p className="text-xs text-neutral-600">{tech.category}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
