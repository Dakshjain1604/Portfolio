"use client";
import React from "react";
import { motion } from "framer-motion";
import { Cpu, Server, Layout, FileCode2, Cloud } from "lucide-react";

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  isAi?: boolean;
  skills: string[];
}

const skillGroups: SkillCategory[] = [
  {
    title: "agentic_ai_&_genai",
    icon: <Cpu size={16} />,
    isAi: true,
    skills: [
      "Autonomous Agent Workflows",
      "Multi-Agent Orchestration",
      "Model Context Protocol (MCP)",
      "Production RAG & Vector Search",
      "LLM Tool & Function Calling",
      "Prompt Engineering & Evals",
      "LangChain & LangGraph",
      "Claude & OpenAI APIs",
    ],
  },
  {
    title: "backend_stack",
    icon: <Server size={16} />,
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "Prisma"],
  },
  {
    title: "frontend_stack",
    icon: <Layout size={16} />,
    skills: ["React", "Next.js", "Tailwind", "Framer Motion"],
  },
  {
    title: "languages",
    icon: <FileCode2 size={16} />,
    skills: ["TypeScript", "JavaScript", "Python", "C++", "SQL"],
  },
  {
    title: "cloud_&_tools",
    icon: <Cloud size={16} />,
    skills: ["AWS", "Docker", "CI/CD", "Git", "REST", "JWT", "OAuth2", "Zod", "Claude Code", "Cursor"],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

interface SkillsProps {
  selectedSkill: string | null;
  onSelectSkill: (skill: string) => void;
}

export function Skills({ selectedSkill, onSelectSkill }: SkillsProps) {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background border-t border-hairline" id="skills">
      {/* Subtle background glow for the prominent AI section */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-accent/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase">
            capability_registry
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mt-2">
            Technical <span className="text-sky-400">Arsenal</span>
          </h2>
          <div className="section-divider mt-6" />
        </motion.div>

        {/* Bento/Tidy Grid Layout */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillGroups.map((group, idx) => (
            <motion.div
              key={group.title}
              variants={item}
              className={`glass-card rounded-xl p-5 md:p-6 border transition-all duration-350 ${
                group.isAi
                  ? "border-sky-500/30 bg-sky-500/5 hover:border-sky-500/50 md:col-span-2 lg:col-span-3 shadow-[0_0_20px_rgba(56,189,248,0.06)]"
                  : "border-hairline bg-surface hover:border-sky-500/30"
              }`}
            >
              {/* Category Eyebrow Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-hairline/60">
                <div className="flex items-center gap-2.5">
                  <span className={group.isAi ? "text-sky-400" : "text-text-muted"}>
                    {group.icon}
                  </span>
                  <span className={`text-xs font-mono uppercase tracking-wider ${group.isAi ? "text-sky-400 font-bold" : "text-text-primary"}`}>
                    {group.title}
                  </span>
                </div>
                {group.isAi && (
                  <span className="text-[8px] font-mono border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 rounded text-sky-300 uppercase tracking-widest animate-pulse">
                    core_specialization
                  </span>
                )}
              </div>

              {/* Skills Tags Area */}
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => {
                  const isSelected = selectedSkill?.toLowerCase() === skill.toLowerCase();
                  return (
                    <motion.button
                      key={skill}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectSkill(skill)}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-white text-black border border-white font-semibold shadow-sm"
                          : group.isAi
                          ? "bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 hover:border-sky-500/40"
                          : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                      }`}
                    >
                      {skill.toLowerCase()}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
