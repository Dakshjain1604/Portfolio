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
    id: "documind_ai",
    /**
     * Promoted from position 3 (2026-08-25): a hybrid-GraphRAG rebuild adds
     * a knowledge-graph retrieval leg, reranking, query rewriting, real auth,
     * and - critically - a committed, reproducible retrieval eval, which is
     * the same kind of independently-checkable evidence AutoCareer's star
     * count is. See microService/tuning/results/scoped_ablation.md in the
     * repo for the methodology behind the metrics below.
     */
    title: "DocuMind AI",
    outcome: "Hybrid GraphRAG document Q&A, with a measured +183% Recall@10 lift over naive vector search.",
    description:
      "A document-intelligence platform that builds a knowledge graph (LLM entity/relation extraction, Louvain community detection) alongside a Chroma vector index and a BM25 lexical index, then fuses all three retrieval legs with weighted reciprocal rank fusion, cross-encoder reranking, and multi-query rewriting. JWT auth with per-user document ownership and per-endpoint rate limiting; every request is traced to a queryable SQLite store with per-stage latency and token counts, surfaced in a live trace panel. 182 backend tests and a GitHub Actions CI gate.",
    image: "/images/projects/documind-ai.png",
    tech: ["Next.js 15", "FastAPI", "Hybrid Retrieval (RRF)", "Knowledge Graphs", "Cross-Encoder Rerank", "JWT Auth"],
    metrics: [
      { label: "Recall@10 vs. vector-only", value: "+183%" },
      { label: "MRR vs. vector-only", value: "+454%" },
      { label: "Backend tests", value: "182" },
    ],
    github: "https://github.com/Dakshjain1604/DocuMind-Ai",
    live: "https://docu-mind-ai-nu.vercel.app/",
    tags: ["ai"],
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
    outcome: "Literature-screening prototype that ranks FDA-approved drugs for fibrotic-disease repurposing.",
    /**
     * Reframed from "scores drug candidates against fibrotic pathways" -
     * accurate about the mechanism (LLM reasoning over retrieved papers)
     * but read as a pharmacological claim, which this doesn't have the
     * validation to back. Ranking is literature evidence, not lab or
     * clinical data, and the description now says so directly rather than
     * letting a reader assume otherwise.
     */
    description:
      "A research workbench that pairs real-time PubMed retrieval with LLM-based reasoning to rank FDA-approved drugs as repurposing candidates for fibrotic disease, with every ranking traceable back to the papers behind it. A literature-screening prototype, not a validated pharmacological or clinical tool.",
    image: "/images/projects/bioscript.png",
    tech: ["Python", "Streamlit", "PubMed API", "LLM Reasoning"],
    github: "https://github.com/Dakshjain1604/AI-Powered-Drug-Repurposing-Platform",
    tags: ["ai", "neo"],
  },
  {
    id: "interview_ai",
    title: "Interview AI",
    outcome: "Multi-agent AI interviewer with adaptive, evidence-linked scoring.",
    description:
      "A voice-first technical interview platform where nine cooperating agents turn a resume into an adaptive interview: question complexity adjusts in real time from how the candidate is answering, every dimension score cites the exact transcript turn it came from, and a recruiter dashboard reads the same Postgres rows the interview wrote, not sample data. Runs end to end against a real LLM provider chain with automatic failover to a deterministic backup so a session never dies.",
    image: "/images/projects/ai-interview.png",
    tech: ["Next.js 15", "FastAPI", "PostgreSQL", "LiteLLM"],
    github: "https://github.com/Dakshjain1604/Ai_Interview",
    tags: ["ai"],
    metrics: [
      { label: "Agent pipeline", value: "9 cooperating agents" },
      { label: "Backend tests", value: "157" },
    ],
  },
  {
    id: "ai_coding_agent",
    title: "Ai-Coding-Agent",
    outcome: "Local-first coding agent CLI with a sandboxed, permission-guarded tool layer.",
    description:
      "A mode-switching coding agent CLI that routes across a dynamic Ollama, Groq, and OpenRouter provider chain, picking a local model size from free system RAM when no API key is configured. Every write is confined to a per-task sandbox and merged back only through an explicit diff-reviewed apply step - a property I verified by live-testing it, finding a real sandbox-escape bug in the process, and fixing it with regression tests to lock it in.",
    image: "/images/projects/ai-coding-agent.png",
    tech: ["TypeScript", "oclif", "Ollama"],
    metrics: [
      { label: "Test suite", value: "82 tests" },
      { label: "Provider chain", value: "Ollama / Groq / OpenRouter" },
    ],
    github: "https://github.com/Dakshjain1604/Ai-coding-Agent",
    tags: ["ai"],
  },
  {
    id: "soh_ships",
    title: "SOH Ships",
    outcome: "Maritime domain awareness platform that detects dark, AIS-disabled vessels.",
    description:
      "A ship-detection pipeline that downloads Sentinel-1 SAR satellite scenes, runs a 6-step preprocessing chain (orbit correction, thermal noise removal, radiometric calibration, Lee speckle filtering), and applies a CA-CFAR adaptive-threshold detector - an O(N) box-filter implementation, not the naive O(N x W^2) convolution - to find vessels invisible to AIS. Every detection is cross-referenced against real AIS positions to classify it as MATCHED, UNCERTAIN, or DARK. A React/MapLibre GL frontend renders the results across 24 shipping lanes, 8 high-risk dark-vessel zones, and 13 military fleet overlays.",
    image: "/images/projects/soh-ships.png",
    tech: ["Python", "React 19", "MapLibre GL", "Docker"],
    metrics: [
      { label: "Detection algorithm", value: "CA-CFAR, O(N)" },
      { label: "Backend tests", value: "43" },
    ],
    github: "https://github.com/Dakshjain1604/SOH-Ships",
    tags: ["web"],
  },
  {
    id: "bloomberg_terminal",
    title: "BloombergTerminal",
    outcome: "Real-time financial terminal with a resilient, dual-backend architecture.",
    description:
      "A Bloomberg-style terminal with a dual backend (Node.js/Fastify API gateway + Python/FastAPI data engine): live price streaming from Finnhub through Redis pub/sub into a 100ms batch flusher that collapses per-symbol ticks into one write instead of flooding the socket, 16 FRED macroeconomic indicators, and a set of technical indicator overlays. Every external API call (Finnhub, Yahoo Finance, FRED) is wrapped in a circuit breaker, so a provider outage degrades the terminal instead of taking it down.",
    image: "/images/projects/bloomberg-terminal.png",
    tech: ["Node.js", "FastAPI", "React", "Docker"],
    metrics: [
      { label: "WebSocket batching", value: "100ms flush interval" },
      { label: "Docker services", value: "5" },
    ],
    github: "https://github.com/Dakshjain1604/bloomberg-terminal-clone",
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
