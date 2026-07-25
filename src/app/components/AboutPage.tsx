"use client";
import { motion } from "framer-motion";
import { ExternalLink, Cpu, ShieldCheck, Layers, Zap } from "lucide-react";

const startupPillars = [
  { icon: <Cpu size={13} className="text-sky-400" />, label: "Autonomous AI Agents" },
  { icon: <ShieldCheck size={13} className="text-sky-400" />, label: "Secure MCP Systems" },
  { icon: <Layers size={13} className="text-sky-400" />, label: "Multi-Agent Orchestration" },
  { icon: <Zap size={13} className="text-sky-400" />, label: "Production RAG Pipelines" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function AboutMe() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background border-t border-hairline" id="about">
      {/* Subtle grid accent */}
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase">
            system_registry :: profile
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mt-2">
            About <span className="text-sky-400">Me</span>
          </h2>
          <div className="section-divider mt-6" />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Main Bio Content */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col justify-between"
          >
            <motion.div variants={item} className="glass-card rounded-xl p-5 sm:p-6 md:p-8 border border-hairline bg-surface/90 shadow-xl shadow-black/20">
              {/* Mono Header Line */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-hairline">
                <div className="font-mono text-[10px] sm:text-[11px] text-sky-400 uppercase tracking-wider flex items-center gap-2 max-w-full overflow-hidden">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="truncate sm:whitespace-normal">[currently: full-stack_&_ai_engineer_at_neo]</span>
                </div>
                <span className="font-mono text-[9px] sm:text-[10px] text-text-muted/60 uppercase shrink-0">
                  early-stage startup
                </span>
              </div>

              {/* Bio Paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm md:text-base text-text-muted leading-relaxed font-sans font-light">
                <p>
                  I am a software engineer focused on the intersection of <strong className="font-semibold text-white">robust full-stack systems</strong> and <strong className="font-semibold text-white">state-of-the-art AI orchestration</strong>. I enjoy building systems that are not just intelligent, but also resilient, performant, and highly reliable under production loads.
                </p>

                <p>
                  Currently, I am a <strong className="font-semibold text-white">Full-Stack & AI Engineer</strong> at{" "}
                  <a
                    href="https://heyneo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-white underline decoration-sky-400/40 hover:decoration-sky-400 hover:text-sky-400 transition-all"
                  >
                    NEO
                    <ExternalLink size={12} className="inline opacity-70" />
                  </a>
                  , an early-stage startup pioneering autonomous AI engineering agents. Having joined as an intern and stepped into a full-time role within three months, I actively design and ship critical agentic systems. My work here ranges from building <strong className="font-semibold text-white">secure, multi-tenant Model Context Protocol (MCP) servers</strong> to implementing <strong className="font-semibold text-white">advanced RAG pipelines</strong> and <strong className="font-semibold text-white">multi-agent orchestration backends</strong>.
                </p>

                <p>
                  I build production-grade solutions and <strong className="font-semibold text-white">agentic AI systems</strong> using <strong className="font-semibold text-white">Next.js, Node.js, Python, and GenAI</strong> (such as LangChain, Claude API, and custom agent toolsets). I am passionate about <strong className="font-semibold text-white">developer tooling</strong>, automation, and bridging the gap between raw model intelligence and scalable, real-world products.
                </p>
              </div>

              {/* Key Impact Metric Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 py-4 border-y border-hairline/80">
                <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800 text-center">
                  <span className="block text-base sm:text-lg md:text-xl font-bold font-mono text-white">3 Mos</span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Intern → Full-Time</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800 text-center">
                  <span className="block text-base sm:text-lg md:text-xl font-bold font-mono text-sky-400">MCP Protocol</span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Multi-Tenant Servers</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800 text-center">
                  <span className="block text-base sm:text-lg md:text-xl font-bold font-mono text-emerald-400">Production</span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-wider">RAG & AI Agents</span>
                </div>
              </div>

              {/* Startup Pillars Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {startupPillars.map((pillar, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/50 hover:bg-zinc-900 text-[11px] sm:text-xs font-mono text-zinc-200 transition-all duration-200 shadow-sm"
                  >
                    {pillar.icon}
                    <span>{pillar.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
