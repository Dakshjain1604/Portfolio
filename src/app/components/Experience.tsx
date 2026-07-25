"use client";
import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, ExternalLink, Zap, Settings, Brain } from "lucide-react";

interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string; // Mono dates, flagged as [VERIFY] if unconfirmed
  description: string;
  bullets: string[];
  tech: string[];
  logo: React.ReactNode;
}

const experiences: ExperienceItem[] = [
  {
    title: "Full-Stack & AI Engineer",
    company: "NEO",
    location: "Remote",
    period: "Oct 2025 – Present",
    description:
      "Responsible for end-to-end feature delivery, migrating system modules, and integrating advanced orchestration pipelines at NEO.",
    bullets: [
      "Built production-ready MCP servers solo to enable secure, multi-tenant agent tool invocation.",
      "Developed RAG pipelines utilizing LangChain and the Claude API for complex contextual question answering.",
      "Engineered multi-channel agent orchestration systems and internal developer utilities.",
    ],
    tech: ["Next.js", "Node.js", "LangChain", "Claude API", "PostgreSQL"],
    logo: <Zap size={15} className="text-sky-400" />,
  },
  {
    title: "Data Science Intern",
    company: "Celebal Technologies",
    location: "Jaipur",
    period: "Oct 2024 – Feb 2025",
    description:
      "Explored machine learning systems, natural language processing (NLP), and generative AI applications.",
    bullets: [
      "Built and evaluated ML models and NLP pipelines for semantic analysis and text processing tasks.",
      "Worked with prompt engineering, LLM embeddings, and vector similarity search for AI workflows.",
      "Preprocessed complex datasets, performed feature extraction, and benchmarked model performance.",
    ],
    tech: ["Python", "Machine Learning", "NLP", "Generative AI", "PyTorch", "Pandas"],
    logo: <Brain size={15} className="text-text-muted" />,
  },
  {
    title: "Backend Intern",
    company: "Celebal Technologies",
    location: "Jaipur",
    period: "Jun 2024 – Aug 2024",
    description:
      "Built scalability modules and optimized REST interfaces for a high-traffic e-commerce platform.",
    bullets: [
      "Developed Node.js and Express backend API layers with robust CRUD routes.",
      "Integrated JWT authentication and designed GraphQL schema queries.",
      "Documented payment and user APIs using Swagger UI, and containerized the workspace with Docker.",
    ],
    tech: ["Node.js", "Express", "GraphQL", "MongoDB", "Docker"],
    logo: <Settings size={15} className="text-text-muted" />,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function Experience() {
  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden bg-background border-t border-hairline"
      id="experience"
    >
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-accent/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] font-mono tracking-widest text-accent uppercase">
            activity_log
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mt-2">
            Professional <span className="text-accent">Experience</span>
          </h2>
          <div className="section-divider mt-4" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="relative"
        >
          {/* Vertical connecting line */}
          <div className="absolute left-[15px] sm:left-[19px] md:left-[23px] top-0 bottom-0 w-[1px]">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="w-full bg-gradient-to-b from-accent/30 via-hairline to-transparent"
            />
          </div>

          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="relative pl-11 sm:pl-14 md:pl-16 pb-10 sm:pb-12 last:pb-0"
            >
              {/* Timeline Indicator Node */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
                viewport={{ once: true }}
                className="absolute -left-1 sm:left-0 md:left-1 top-1 z-10"
              >
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-surface border border-hairline flex items-center justify-center shadow-md">
                    {exp.logo}
                  </div>
                  {idx === 0 && (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 rounded-lg border border-accent/40"
                    />
                  )}
                </div>
              </motion.div>

              {/* Card Body */}
              <div className="glass-card rounded-xl p-4 sm:p-5 md:p-6 border border-hairline hover:border-sky-500/30 transition-all duration-350 bg-surface">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold font-sans text-white">
                      {exp.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] sm:text-xs font-mono">
                      <p className="text-sky-400 font-semibold">{exp.company}</p>
                      <span className="text-hairline">•</span>
                      <p className="text-text-muted flex items-center gap-1">
                        <MapPin size={10} />
                        {exp.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-text-muted bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded w-fit flex items-center gap-1.5 h-fit">
                    <Calendar size={10} className="text-sky-400" />
                    {exp.period}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-text-muted leading-relaxed mb-4 font-sans font-light">
                  {exp.description}
                </p>

                {/* Bullets List */}
                <ul className="space-y-2 mb-5 pl-4 border-l-2 border-hairline/60">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="text-xs text-text-muted leading-relaxed font-sans font-light list-none relative">
                      <span className="absolute -left-4 text-sky-400 font-mono text-[9px]">&gt;</span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded bg-surface-2 border border-hairline text-[9px] font-mono text-text-muted"
                    >
                      {t.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://www.linkedin.com/in/daksh-jain16/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-accent transition-colors group cursor-pointer"
          >
            <Briefcase size={12} />
            <span>query_linkedin_career_log</span>
            <ExternalLink size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-accent" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
