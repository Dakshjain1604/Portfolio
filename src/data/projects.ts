export type ProjectTag = "ai" | "web" | "neo"

/**
 * An explicitly labelled link.
 *
 * The `github`/`live` pair below covers the common case, but it hardcodes
 * two labels - "Source" and "Live" - and neither is right for every project.
 * neo-mcp ships on PyPI: calling a package page "Live" is wrong, and it has
 * a docs site and a homepage that the pair has nowhere to put. When `links`
 * is present it replaces the default buttons entirely.
 */
export type ProjectLink = {
  label: string
  href: string
  /** Renders as the accent-filled button. At most one per project. */
  primary?: boolean
  icon?: "source" | "live" | "package" | "docs"
}

export type Project = {
  id: string
  title: string
  outcome: string
  description: string
  image: string
  tech: string[]
  /** Public repo. Also the key for the live star count, so it is kept even
   *  when `links` overrides what is rendered. */
  github?: string
  live?: string
  /** Overrides the default Source/Live buttons when present. */
  links?: ProjectLink[]
  /** PyPI package name. Drives live release/version figures via /api/pypi. */
  pypi?: string
  tags: ProjectTag[]
  /**
   * The number that makes the project believable. Latency, scale, accuracy,
   * throughput, adoption - whatever the actual constraint was.
   *
   * Optional, and every entry is currently empty on purpose: these are yours
   * to fill and I will not invent them. A fabricated metric is worse than no
   * metric, because the one thing a portfolio cannot survive is a reader
   * catching a number that is not true. The detail pane renders this section
   * only when it is present, so the UI stays clean until you have real ones.
   *
   * Shape it like the thing you measured:
   *   metrics: [
   *     { label: "Median answer", value: "1.4s" },
   *     { label: "Corpus tested",  value: "200-page PDFs" },
   *     { label: "Citation accuracy", value: "94%" },
   *   ]
   */
  metrics?: { label: string; value: string }[]
}

/**
 * Order is display order, and it is ranked rather than chronological:
 * strongest evidence first. AutoCareer leads because it is the most-starred
 * repo, which is the one claim on this page a reader can verify without
 * taking my word for it. A visitor who reads exactly one entry should hit
 * the best one.
 */
export const projects: Project[] = [
  {
    id: "neo_mcp",
    title: "neo-mcp",
    outcome: "Open-source MCP server on PyPI that puts NEO inside Claude Code, Cursor, VS Code, Zed and Codex.",
    description:
      "The surface that brings NEO, an autonomous AI engineer for ML, LLM and data workflows, into every major agentic coding editor. Owns the tool schemas, structured outputs, function calling, auth and error contracts behind a single MCP interface, so one protocol covers model evals, prompt testing, RAG debugging, benchmarks, fine-tuning and output analysis. MIT licensed, Python 3.11+, shipped continuously since launch.",
    image: "/images/projects/neo-mcp.png",
    tech: ["Python", "MCP", "PyPI", "Claude API", "Tool Calling", "Structured Outputs"],
    pypi: "neo-mcp",
    /**
     * Explicit links, because the default Source/Live pair gets this one
     * wrong twice over.
     *
     * There is no GitHub link on purpose. PyPI's metadata points at
     * NeoResearchAI/MCPServer, which is private - a "Source" button that
     * 404s is worse than no button, and worse still next to the words "open
     * source". The MIT-licensed source ships as an sdist on PyPI, so
     * "Source (sdist)" points where the source actually is.
     */
    links: [
      { label: "PyPI", href: "https://pypi.org/project/neo-mcp/", icon: "package", primary: true },
      { label: "Docs", href: "https://docs.heyneo.com/neo-mcp", icon: "docs" },
      { label: "Source (sdist)", href: "https://pypi.org/project/neo-mcp/#files", icon: "source" },
    ],
    tags: ["ai"],
    /**
     * Release count and version are NOT hardcoded here. The resume said "45
     * releases in 4 months"; by the time this was wired up PyPI was already
     * at 46, which is exactly how a portfolio metric quietly becomes a false
     * one. Finder reads both live from /api/pypi.
     */
    metrics: [
      { label: "Editors supported", value: "5" },
      { label: "License", value: "MIT" },
      { label: "Requires", value: "Python 3.11+" },
    ],
  },
  {
    id: "autocareer",
    title: "AutoCareer",
    outcome: "Autonomous job-application orchestration agent, my highest-starred repo.",
    description:
      "A browser agent that autonomously searches, filters, and applies to job listings matching a candidate profile, parsing resumes, drafting cover letters, and filling forms via OpenAI reasoning over a real Chromium session.",
    image: "/images/projects/autocareer.png",
    tech: ["Python", "Selenium", "OpenAI API", "Chromium"],
    github: "https://github.com/Dakshjain1604/Job-Application-AutoFiller-Agent",
    tags: ["ai"],
  },
  {
    id: "documind_ai",
    title: "DocuMind AI",
    outcome: "RAG document Q&A system for instant chat with PDFs.",
    description:
      "A full-stack document-intelligence platform for Q&A, summarisation and quiz generation over PDFs, backed by an async FastAPI microservice. Hybrid retrieval pairs ChromaDB dense vector search over SentenceTransformers embeddings with BM25 lexical search, so answers hold up for both keyword lookups and open-ended questions. OCR ingestion handles scanned PDFs; DiskCache cuts token cost on repeat queries.",
    image: "/images/projects/documind-ai.png",
    tech: ["Next.js 15", "React 19", "FastAPI", "LangChain", "ChromaDB", "MongoDB"],
    metrics: [
      { label: "Retrieval", value: "Hybrid \u2014 dense + BM25" },
      { label: "Ingestion", value: "OCR via Tesseract" },
    ],
    github: "https://github.com/Dakshjain1604/DocuMind-Ai",
    live: "https://docu-mind-ai-nu.vercel.app/",
    tags: ["ai"],
  },
  {
    id: "llm_response_judge",
    title: "LLM Response Judge",
    outcome: "Auto-grades LLM app outputs against customizable quality rubrics.",
    description:
      "Evaluate customer-support or agent responses at scale, batch scoring across Claude, GPT-4, Gemini, and local Ollama models with an analytics dashboard for regressions.",
    image: "/images/projects/llm-response-judge.png",
    tech: ["React", "FastAPI", "Docker", "Multi-LLM"],
    github: "https://github.com/Dakshjain1604/LLM-response-Judge",
    tags: ["ai", "neo"],
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
    tags: ["ai", "neo"],
  },
  {
    id: "interview_ai",
    title: "Interview AI",
    outcome: "AI mock-interview simulator with performance analytics.",
    description:
      "A technical interview platform that parses resumes, generates LLM-tailored questions across difficulty tiers and auto-scores responses. Timed assessments carry crash-safe session recovery, so a candidate who loses their browser mid-interview resumes at the same question instead of starting over.",
    image: "/images/projects/ai-interview.png",
    tech: ["React", "TypeScript", "Redux Toolkit", "OpenAI API"],
    github: "https://github.com/Dakshjain1604/Ai_Interview",
    live: "https://ai-interview-six-eosin.vercel.app",
    tags: ["ai"],
  },
  {
    id: "ai_coding_agent",
    title: "Ai-Coding-Agent",
    outcome: "Lightweight CLI agent that generates and edits real project files.",
    description:
      "A Node.js CLI that turns a plain-English task into a real file tree on disk - Express and JWT backends, React components, configs - with diff-based updates and non-destructive skip behaviour. Runs fully offline on local Ollama models with no API keys.",
    image: "/images/projects/ai-coding-agent.png",
    tech: ["Node.js", "Ollama", "CLI", "Claude Code"],
    metrics: [
      { label: "Cold start", value: "38ms" },
      { label: "Dependencies", value: "12" },
      { label: "Memory", value: "under 50MB" },
    ],
    github: "https://github.com/Dakshjain1604/Ai-coding-Agent",
    tags: ["ai"],
  },
  {
    id: "soh_ships",
    title: "SOH Ships",
    outcome: "Real-time maritime vessel tracking and AIS telemetry system.",
    description:
      "A real-time vessel tracking and maritime intelligence platform monitoring ship coordinates, AIS telemetry streams, route vectors, and operational health metrics.",
    image: "/images/projects/soh-ships.png",
    tech: ["TypeScript", "Node.js", "React", "WebSockets", "Leaflet"],
    github: "https://github.com/Dakshjain1604/SOH_Ships",
    tags: ["web"],
  },
]

/** The DocuMind RAG ingestion snippet, ported to Terminal's `cat ingest.py`. See plan/08-app-terminal.md. */
export const ingestSnippet = `from langchain_community.document_loaders import PyPDFLoader
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
    )`
