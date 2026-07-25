"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, ExternalLink, Github, Sparkles, Code2, Bot, FileText, Compass } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Project {
  id: string;
  title: string;
  outcome: string;
  description: string;
  image: string;
  tech: string[];
  github?: string;
  live?: string;
  isAi?: boolean;
  builtWithNeo?: boolean;
  tier: "hero" | "compact";
  codeSnippet?: {
    language: string;
    code: string;
  };
}



const projects: Project[] = [
  {
    id: "documind_ai",
    title: "DocuMind AI",
    outcome: "RAG document Q&A system for instant chat with PDFs.",
    description:
      "Chat with your documents using a RAG pipeline — upload PDFs and get intelligent, cited answers instantly. Full-stack AI assistant built with LangChain and ChromaDB.",
    image: "/images/projects/documind-ai.png",
    tech: ["Next.js", "LangChain", "ChromaDB", "OpenAI"],
    github: "https://github.com/Dakshjain1604/DocuMind-Ai",
    live: "https://docu-mind-ai-nu.vercel.app/",
    isAi: true,
    tier: "hero",
    codeSnippet: {
      language: "Python",
      code: `from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

def load_and_chunk_pdf(pdf_path: str):
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    return splitter.split_documents(documents)

def create_vector_store(chunks):
    embeddings = OpenAIEmbeddings()
    return Chroma.from_documents(
        chunks,
        embeddings,
        persist_directory="./chroma_db"
    )`,
    },
  },
  {
    id: "interview_ai",
    title: "Interview AI",
    outcome: "AI mock-interview simulator with performance analytics.",
    description:
      "AI-powered mock interview application that generates personalized questions and offers real-time conversational performance metrics — for both interviewer and candidate sides of the table.",
    image: "/images/projects/ai-interview.png",
    tech: ["React.js", "Node.js", "OpenAI API", "Redux"],
    github: "https://github.com/Dakshjain1604/Ai_Interview",
    live: "https://ai-interview-six-eosin.vercel.app",
    isAi: true,
    tier: "hero",
  },
  {
    id: "autocareer",
    title: "AutoCareer",
    outcome: "Autonomous job-application orchestration agent — my highest-starred repo.",
    description:
      "A browser agent that autonomously searches, filters, and applies to job listings matching a candidate profile — parsing resumes, drafting cover letters, and filling forms via OpenAI reasoning over a real Chromium session.",
    image: "/images/projects/autocareer.png",
    tech: ["Python", "Selenium", "OpenAI API", "Chromium"],
    github: "https://github.com/Dakshjain1604/Job-Application-AutoFiller-Agent",
    isAi: true,
    tier: "hero",
  },

  {
    id: "ai_coding_agent",
    title: "Ai-Coding-Agent",
    outcome: "Lightweight CLI agent that generates and edits real project files.",
    description:
      "A file-based coding CLI that creates, updates, and diffs project structures for common dev tasks — powered by local Ollama models for private, offline generation.",
    image: "/images/projects/ai-coding-agent.png",
    tech: ["TypeScript", "Ollama", "CLI", "Opencode"],
    github: "https://github.com/Dakshjain1604/Ai-coding-Agent",
    isAi: true,
    tier: "compact",
  },
  {
    id: "bioscript",
    title: "BioScript",
    outcome: "AI drug-repurposing research dashboard for fibrotic disease discovery.",
    description:
      "A research workbench that scores FDA-approved drug candidates against fibrotic pathways using real-time PubMed literature retrieval and LLM-based reasoning, with a transparent, auditable pipeline.",
    image: "/images/projects/bioscript.png",
    tech: ["Python", "Streamlit", "PubMed API", "LLM Reasoning"],
    github: "https://github.com/Dakshjain1604/AI-Powered-Drug-Repurposing-Platform",
    isAi: true,
    builtWithNeo: true,
    tier: "compact",
  },
  {
    id: "llm_response_judge",
    title: "LLM Response Judge",
    outcome: "Auto-grades LLM app outputs against customizable quality rubrics.",
    description:
      "Evaluate customer-support or agent responses at scale — batch scoring across Claude, GPT-4, Gemini, and local Ollama models with an analytics dashboard for regressions.",
    image: "/images/projects/llm-response-judge.png",
    tech: ["React", "FastAPI", "Docker", "Multi-LLM"],
    github: "https://github.com/Dakshjain1604/LLM-response-Judge",
    isAi: true,
    builtWithNeo: true,
    tier: "compact",
  },
  {
    id: "soh_ships",
    title: "SOH Ships",
    outcome: "Real-time maritime vessel tracking & AIS telemetry system.",
    description:
      "A real-time vessel tracking and maritime intelligence platform monitoring ship coordinates, AIS telemetry streams, route vectors, and operational health metrics.",
    image: "/images/projects/soh-ships.png",
    tech: ["TypeScript", "Node.js", "React", "WebSockets", "Leaflet"],
    github: "https://github.com/Dakshjain1604/SOH_Ships",
    tier: "compact",
  },
];

function NeoBadge() {
  return (
    <div className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-mono font-medium flex items-center gap-1">
      <Bot size={11} className="text-accent" />
      built w/ neo
    </div>
  );
}

function HeroProjectCard({
  project,
  selectedSkill,
  onSelectSkill
}: {
  project: Project;
  selectedSkill: string | null;
  onSelectSkill: (skill: string) => void;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [showCode, setShowCode] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setMousePosition({ x: 0.5, y: 0.5 });
        setShowCode(false);
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative rounded-2xl md:rounded-3xl overflow-hidden bg-surface border border-hairline"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, var(--accent-dim), transparent 50%)`,
        }}
      />

      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative overflow-hidden aspect-[16/10] bg-surface-2 p-2.5 sm:p-3 md:p-4 flex items-center justify-center">
          <div className="w-full h-full rounded-xl overflow-hidden border border-hairline/80 bg-surface shadow-2xl flex flex-col relative group/shell">
            {/* Browser Control Bar */}
            <div className="h-7 px-3 bg-surface-2/95 border-b border-hairline flex items-center justify-between gap-2 flex-shrink-0 z-20">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <div className="h-4 px-3 rounded-full bg-background/80 border border-hairline/50 text-[9px] font-mono text-text-muted/80 truncate max-w-[140px] xs:max-w-[200px] hidden xs:block">
                {project.live || project.github || project.id}
              </div>
              <div className="flex items-center gap-1">
                {project.builtWithNeo ? (
                  <NeoBadge />
                ) : (
                  project.isAi && (
                    <div className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-mono font-medium flex items-center gap-1">
                      <Sparkles size={9} className="text-accent" />
                      AI Powered
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Main Screenshot / Code View */}
            <div className="relative flex-1 overflow-hidden bg-background">
              {showCode && project.codeSnippet ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-[#1e1e1e]"
                >
                  <SyntaxHighlighter
                    language={project.codeSnippet.language.toLowerCase()}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: "0.75rem",
                      background: "transparent",
                      fontSize: "0.65rem",
                      lineHeight: "1.4",
                      height: "100%",
                      overflow: "auto",
                    }}
                    showLineNumbers
                  >
                    {project.codeSnippet.code}
                  </SyntaxHighlighter>
                </motion.div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {project.codeSnippet && (
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-surface/90 border border-hairline text-text-muted hover:text-text-primary hover:border-accent/40 transition-all backdrop-blur-sm cursor-pointer z-20"
                  aria-label="Toggle code view"
                >
                  {showCode ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.image} alt="Show image" className="w-4 h-4 object-cover rounded" />
                  ) : (
                    <Code2 size={15} />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-text-primary mb-2">
              {project.title}
            </h3>
            <p className="text-xs text-accent font-mono mb-4 font-semibold leading-relaxed">
              {project.outcome}
            </p>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6 font-sans font-light">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map((t) => {
                const isMatching = selectedSkill && (
                  selectedSkill.toLowerCase().replace(/[\s\.\-_]/g, "").includes(t.toLowerCase().replace(/[\s\.\-_]/g, "")) ||
                  t.toLowerCase().replace(/[\s\.\-_]/g, "").includes(selectedSkill.toLowerCase().replace(/[\s\.\-_]/g, ""))
                );
                return (
                  <motion.button
                    key={t}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectSkill(t)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all duration-200 cursor-pointer ${
                      isMatching
                        ? "bg-white text-black border border-white font-semibold shadow-sm"
                        : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    {t}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-surface-2 border border-hairline text-text-muted hover:text-text-primary hover:border-accent/40 transition-all cursor-pointer text-xs font-mono"
                >
                  <Github size={14} />
                  Source Code
                </motion.a>
              )}
              {project.live && (
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-accent-dim border border-accent/30 text-accent hover:brightness-110 transition-all cursor-pointer text-xs font-mono"
                >
                  <ExternalLink size={14} />
                  Live Demo
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-4 right-4 text-text-muted/50 group-hover:text-accent transition-colors pointer-events-none hidden sm:block"
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ArrowRight size={20} />
      </motion.div>
    </motion.div>
  );
}

function CompactProjectCard({
  project,
  selectedSkill,
  onSelectSkill
}: {
  project: Project;
  selectedSkill: string | null;
  onSelectSkill: (skill: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-2xl overflow-hidden bg-surface border border-hairline hover:border-accent/30 transition-colors"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2 p-2.5">
        <div className="w-full h-full rounded-xl overflow-hidden border border-hairline/80 bg-surface shadow-xl flex flex-col relative group/shell">
          {/* Browser Bar */}
          <div className="h-6 px-2.5 bg-surface-2/95 border-b border-hairline flex items-center justify-between gap-1 flex-shrink-0 z-20">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500/70" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
              <span className="w-2 h-2 rounded-full bg-green-500/70" />
            </div>
            <div className="flex items-center gap-1">
              {project.builtWithNeo ? (
                <NeoBadge />
              ) : (
                project.isAi && (
                  <div className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-mono font-medium flex items-center gap-1">
                    <Sparkles size={9} className="text-accent" />
                    AI Powered
                  </div>
                )
              )}
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h4 className="text-base font-bold font-display text-text-primary mb-1">{project.title}</h4>
        <p className="text-[11px] text-accent font-mono mb-2 font-semibold leading-relaxed">
          {project.outcome}
        </p>
        <p className="text-xs text-text-muted font-sans font-light leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => {
              const isMatching = selectedSkill && (
                selectedSkill.toLowerCase().replace(/[\s\.\-_]/g, "").includes(t.toLowerCase().replace(/[\s\.\-_]/g, "")) ||
                t.toLowerCase().replace(/[\s\.\-_]/g, "").includes(selectedSkill.toLowerCase().replace(/[\s\.\-_]/g, ""))
              );
              return (
                <motion.button
                  key={t}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelectSkill(t)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono transition-all duration-200 cursor-pointer ${
                    isMatching
                      ? "bg-white text-black border border-white font-semibold"
                      : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  {t}
                </motion.button>
              );
            })}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 self-end xs:self-auto">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded bg-surface-2 hover:bg-hairline text-text-muted hover:text-text-primary border border-hairline/80 hover:border-accent/40 transition-all cursor-pointer"
                aria-label="GitHub Repository"
              >
                <Github size={12} />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded bg-surface-2 hover:bg-hairline text-text-muted hover:text-text-primary border border-hairline/80 hover:border-accent/40 transition-all cursor-pointer"
                aria-label="Live Demo"
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ProjectsProps {
  selectedSkill: string | null;
  onClearSkill: () => void;
  onSelectSkill: (skill: string) => void;
}

export function FeaturedProjects({ selectedSkill, onClearSkill, onSelectSkill }: ProjectsProps) {
  const isMatch = (project: Project) => {
    if (!selectedSkill) return true;
    return project.tech.some(t => {
      const s = selectedSkill.toLowerCase().replace(/[\s\.\-_]/g, "");
      const p = t.toLowerCase().replace(/[\s\.\-_]/g, "");
      return s.includes(p) || p.includes(s) || (s === "react" && p === "reactjs") || (s === "reactjs" && p === "react");
    });
  };

  const filteredProjects = projects.filter(isMatch);
  const heroProjects = filteredProjects.filter((p) => p.tier === "hero");
  const compactProjects = filteredProjects.filter((p) => p.tier === "compact");

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background border-t border-hairline" id="projects">
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-accent/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] font-mono tracking-widest text-accent uppercase">
            system_registry
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mt-2">
            Featured <span className="text-accent">Projects</span>
          </h2>
          <div className="section-divider mt-6" />

          {selectedSkill && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-sm text-xs font-mono"
            >
              <span className="text-text-muted">filtering_by:</span>
              <span className="text-accent font-semibold">{selectedSkill.toLowerCase()}</span>
              <button 
                onClick={onClearSkill}
                className="ml-1 text-text-muted hover:text-accent hover:scale-110 transition-all font-bold cursor-pointer"
                title="Clear filter"
              >
                [x]
              </button>
            </motion.div>
          )}
        </motion.div>

        {filteredProjects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 border border-dashed border-hairline rounded-2xl bg-surface/50 max-w-md mx-auto"
          >
            <p className="text-sm font-mono text-text-muted">no_matching_projects_found</p>
            <button 
              onClick={onClearSkill}
              className="mt-4 px-4 py-2 text-xs font-mono bg-accent text-ink rounded hover:opacity-90 transition-all cursor-pointer font-semibold"
            >
              reset_filter
            </button>
          </motion.div>
        ) : (
          <>
            <div className="space-y-8">
              {heroProjects.map((project) => (
                <HeroProjectCard 
                  key={project.id} 
                  project={project} 
                  selectedSkill={selectedSkill}
                  onSelectSkill={onSelectSkill}
                />
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {compactProjects.map((project) => (
                <CompactProjectCard 
                  key={project.id} 
                  project={project} 
                  selectedSkill={selectedSkill}
                  onSelectSkill={onSelectSkill}
                />
              ))}
            </div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/Dakshjain1604"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-accent transition-colors group cursor-pointer"
          >
            <Github size={12} />
            <span>view_live_activity_on_github</span>
            <span className="group-hover:translate-x-0.5 transition-transform text-accent">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
