"use client";
import { motion } from "framer-motion";
import { BottomBar } from "./BottomBar";
import { FlipWords } from "@/components/ui/flip-words";
import { ChevronDown, ArrowUpRight, FileText } from "lucide-react";
import BlurText from "../subComponents/Title";
import dynamic from "next/dynamic";
import { MagneticButton } from "@/components/ui/magnetic-button";

const AgentOrchestrationGraph3D = dynamic(
  () => import("@/components/ui/agent-orchestration-graph-3d").then((mod) => mod.AgentOrchestrationGraph3D),
  { ssr: false }
);

const roles = [
  "agent_orchestration",
  "mcp_server_systems",
  "production_rag_pipelines",
  "full_stack_engineering",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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

export function HeroSection() {
  return (
    <div className="relative w-full min-h-screen bg-background flex flex-col justify-between overflow-hidden" id="home">
      {/* Luminous Top Spotlight Ambient Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(56,189,248,0.18),rgba(99,102,241,0.1),transparent_100%)] pointer-events-none z-0" />

      {/* Ambient agent-orchestration graph behind headline */}
      <AgentOrchestrationGraph3D />

      {/* Coordinate grid overlay */}
      <div 
        className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none" 
      />

      {/* Main Content Area */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 pb-16 relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center min-h-screen pt-20 md:pt-28"
      >
        {/* Available Glassmorphism Pill */}
        <motion.div variants={item} className="mb-5 max-w-full">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 backdrop-blur-xl shadow-[0_0_20px_rgba(56,189,248,0.15)] max-w-full">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-sky-300 uppercase font-semibold truncate sm:whitespace-normal">
              Full-Stack & AI Engineer @ NEO
            </span>
          </div>
        </motion.div>

        {/* Name Title Reveal */}
        <h1 className="mb-2 pt-1 drop-shadow-2xl w-full flex justify-center">
          <BlurText
            text="Daksh Jain"
            delay={50}
            animateBy="letters"
            direction="bottom"
            className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-white font-display"
          />
        </h1>

        {/* Role subheader with metallic gradient */}
        <motion.div
          variants={item}
          className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold font-display uppercase tracking-tight mt-1 mb-3 bg-gradient-to-r from-sky-400 via-indigo-300 to-white bg-clip-text text-transparent"
        >
          Full-Stack & AI Engineer
        </motion.div>

        {/* Observability Console Rolodex */}
        <motion.div
          variants={item}
          className="text-[11px] xs:text-xs md:text-sm text-text-muted mb-6 min-h-6 mt-1 flex flex-wrap items-center justify-center gap-1 font-mono max-w-full px-2"
        >
          <span className="text-text-muted/70">console.exec(</span>
          <FlipWords
            words={roles}
            duration={3000}
            className="text-sky-300 font-semibold"
          />
          <span className="text-text-muted/70">)</span>
        </motion.div>

        {/* Short Bio (Thesis) */}
        <motion.p
          variants={item}
          className="text-xs sm:text-base text-text-muted max-w-xl mx-auto leading-relaxed mb-8 font-sans font-light px-2"
        >
          Building production-grade AI systems across autonomous agent orchestration, MCP tooling, and RAG pipelines.
        </motion.p>

        {/* Control Room Console Buttons */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4"
        >
          <MagneticButton
            href="#projects"
            className="flex items-center justify-center h-12 px-8 w-full sm:w-48 rounded-xl bg-white text-black text-xs font-mono font-bold tracking-tight shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:bg-sky-50 active:scale-98 transition-all duration-300"
          >
            view_work
            <ArrowUpRight size={14} className="ml-1.5" />
          </MagneticButton>

          <MagneticButton
            href="/DakshJain_Resume.pdf"
            target="_blank"
            className="flex items-center justify-center h-12 px-8 w-full sm:w-48 rounded-xl border border-sky-400/30 bg-surface-2/90 text-white text-xs font-mono font-semibold tracking-tight hover:bg-surface-2 hover:border-sky-400/80 hover:text-sky-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] active:scale-98 transition-all duration-300 backdrop-blur-xl"
          >
            view_résumé
            <FileText size={14} className="ml-1.5 text-sky-400" />
          </MagneticButton>
        </motion.div>

        {/* Social Links Row in Mono */}
        <motion.div
          variants={item}
          className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 mt-8 font-mono text-[10px] uppercase text-text-muted px-2"
        >
          <a href="https://github.com/Dakshjain1604" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">[github]</a>
          <span className="text-hairline hidden xs:inline">·</span>
          <a href="https://www.linkedin.com/in/daksh-jain16/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">[linkedin]</a>
          <span className="text-hairline hidden xs:inline">·</span>
          <a href="https://leetcode.com/u/Daksh8816/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">[leetcode]</a>
          <span className="text-hairline hidden xs:inline">·</span>
          <a href="https://huggingface.co/daksh-neo" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">[huggingface]</a>
        </motion.div>
      </motion.div>

      {/* Floating Scroll Indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-text-muted hover:text-white transition-colors cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase text-text-muted">
            scroll_to_explore
          </span>
          <ChevronDown size={14} className="mt-0.5 text-sky-400" />
        </motion.div>
      </motion.a>
    </div>
  );
}
