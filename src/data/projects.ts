export type ProjectTag = "ai" | "web" | "neo"

/**
 * Every project id, as a literal union.
 *
 * Declared separately rather than inferred from the array below because a
 * `Project[]` annotation widens each `id` back to `string`, and the whole
 * point is that `AppId` in data/apps.ts can include one app per project
 * without anything being typed as a bare string. Adding a project means
 * adding its id here first - TypeScript then refuses the entry until it is.
 */
export const PROJECT_IDS = [
  "neo_mcp",
  "documind_ai",
  "autocareer",
  "llm_response_judge",
  "bioscript",
  "interview_ai",
  "ai_coding_agent",
  "soh_ships",
  "bloomberg_terminal",
  "website_cloner",
] as const

export type ProjectId = (typeof PROJECT_IDS)[number]

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

/**
 * One real screenshot of the project running.
 *
 * Every entry is produced by `tools/shots`, which starts the project's own
 * dev servers and photographs the result with Playwright - see
 * tools/shots/README.md. Nothing in here is a mockup or a render, which is
 * a change: the images this replaced included a fabricated AutoCareer
 * "dashboard" that did not correspond to any screen the project has.
 *
 * `caption` says what the reader is looking at, because a screenshot with
 * no caption makes the reader guess which part is the claim.
 */
export type ProjectShot = {
  src: string
  caption: string
}

export type Project = {
  id: ProjectId
  title: string
  outcome: string
  description: string
  /** The hero shot. Also the Finder row thumbnail and the Reader image. */
  image: string
  /** Hero first; the project's own window shows all of them in order. */
  shots: ProjectShot[]
  /**
   * Which square region of the hero shot becomes this project's *square*
   * crop - used only by the Dock's Launchpad mosaic, where nine tiny tiles
   * are texture rather than something anyone reads.
   *
   * Everywhere a project tile is meant to be legible it is drawn at the
   * screenshot's own aspect ratio instead. That is the whole lesson of the
   * three attempts below: a square tile cannot show a 16:10 screenshot
   * without discarding a third of it, and no amount of crop-tuning changes
   * that - it only chooses which third to lose.
   *
   * A whole 1440x900 screenshot is not an icon at any size - there is no
   * zoom level at which a full screen reads as a 100px square. So the tile
   * is a *region*: `cx`/`cy` say where to look (fractions of the image's
   * width and height), `size` how tight to crop (the square's side, as a
   * fraction of image height, so 1 means "the full height").
   *
   * Two earlier attempts failed, and both failures are the reason this is
   * shaped the way it is. Scale 2.4-2.8x landed the crop inside a paragraph,
   * and body text at 72px is grey noise. Backing off to the whole screen was
   * legible as *composition* but nothing in it could be read. The answer is
   * neither: crop to the one region that carries the app's identity - a
   * headline, a stat row, a ticker table, the busiest part of a map - at a
   * size where that region's own text still resolves.
   *
   * These are baked into `<id>/icon.png` at 512px by `tools/shots/icons.mjs`
   * rather than cropped in CSS. That is not tidiness: a browser asked to
   * draw a 2880px PNG into a 72px box does a 40:1 downscale in one step and
   * the result is visibly mushy, which is exactly what it looked like. A
   * 512px source resampled once, properly, is sharp at every size the tile
   * is ever drawn at.
   */
  icon: { cx: number; cy: number; size: number }
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
/**
 * The 720px-wide thumbnail baked next to any shot by tools/shots/icons.mjs.
 *
 * Every project tile and every gallery thumbnail draws one of these rather
 * than the original: uncropped, so nothing is cut (see the note on `icon`
 * above for why tiles are not squares), and small, so a 70px strip
 * thumbnail is not pulling a 1 MB PNG.
 */
export const thumbOf = (src: string) => src.replace(/\.png$/, ".thumb.png")

/** The square crop. Only the Dock's Launchpad mosaic needs one. */
export const projectIconSrc = (id: ProjectId) => `/images/projects/${id}/icon.png`

export const projects: Project[] = [
  {
    id: "neo_mcp",
    title: "neo-mcp",
    outcome: "Open-source MCP server on PyPI that puts NEO inside Claude Code, Cursor, VS Code, Zed and Codex.",
    description:
      "The surface that brings NEO, an autonomous AI engineer for ML, LLM and data workflows, into every major agentic coding editor. Owns the tool schemas, structured outputs, function calling, auth and error contracts behind a single MCP interface, so one protocol covers model evals, prompt testing, RAG debugging, benchmarks, fine-tuning and output analysis. MIT licensed, Python 3.11+, shipped continuously since launch.",
    image: "/images/projects/neo_mcp/package.png",
    shots: [
      { src: "/images/projects/neo_mcp/package.png", caption: "A stdio MCP server has no screen, so this is the checkable evidence instead: the package installed on a real machine, and PyPI's own JSON API answering live." },
      { src: "/images/projects/neo_mcp/distribution.png", caption: "What actually ships, listed by PyPI and by the local install - the MIT sdist the Finder link points at." },
      { src: "/images/projects/neo_mcp/diagram.png", caption: "An architecture diagram, not a screenshot - what the one protocol connects on each side." },
    ],
    icon: { cx: 0.16, cy: 0.3, size: 0.62 },
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
    image: "/images/projects/documind_ai/home.png",
    shots: [
      { src: "/images/projects/documind_ai/home.png", caption: "The studio landing page, served by next dev from the local checkout." },
      { src: "/images/projects/documind_ai/retrieval.png", caption: "The retrieval claim stated on the page itself: vector, BM25 and graph traversal fused with reciprocal rank fusion." },
      { src: "/images/projects/documind_ai/pipeline.png", caption: "Further down the same page - the rest of what the engine claims to do." },
      { src: "/images/projects/documind_ai/signin.png", caption: "The session gate. /Dashboard is genuinely protected: middleware.ts verifies the JWT cookie on every request." },
      { src: "/images/projects/documind_ai/dashboard.png", caption: "The studio behind that gate, reached by signing up a throwaway local account. Seven tools down the left; empty because no document is indexed and the RAG service is not running." },
    ],
    icon: { cx: 0.5, cy: 0.44, size: 0.82 },
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
    image: "/images/projects/autocareer/dashboard.png",
    shots: [
      { src: "/images/projects/autocareer/dashboard.png", caption: "The real dashboard with the FastAPI backend connected. Nothing was applied to: the Selenium applier sits behind endpoints this capture never calls." },
      { src: "/images/projects/autocareer/jobs.png", caption: "The Jobs view - where scraped listings and their fit scores land." },
      { src: "/images/projects/autocareer/draft.png", caption: "The Draft view, for the cover letter generated per role before anything is submitted." },
      { src: "/images/projects/autocareer/logs.png", caption: "The execution log the agent writes as it works." },
      { src: "/images/projects/autocareer/settings.png", caption: "Model and key configuration, and the app's own statement that the key stays in the browser." },
    ],
    icon: { cx: 0.115, cy: 0.1, size: 0.28 },
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
    image: "/images/projects/llm_response_judge/results.png",
    shots: [
      { src: "/images/projects/llm_response_judge/results.png", caption: "Demo mode: 20 pre-evaluated responses scored and charted, read live from the FastAPI backend." },
      { src: "/images/projects/llm_response_judge/response-detail.png", caption: "One response opened up - the per-dimension scores behind the number in the table." },
      { src: "/images/projects/llm_response_judge/dark-mode.png", caption: "The same dashboard in dark mode." },
      { src: "/images/projects/llm_response_judge/welcome.png", caption: "The entry screen: run the bundled dataset, or bring a key and your own responses." },
      { src: "/images/projects/llm_response_judge/api-config.png", caption: "The provider picker that opens on first load - Claude, GPT-4, Gemini or a local Ollama model." },
    ],
    icon: { cx: 0.42, cy: 0.31, size: 0.52 },
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
    image: "/images/projects/bioscript/workbench.png",
    shots: [
      { src: "/images/projects/bioscript/workbench.png", caption: "The Streamlit workbench with the fibrosis pipeline configured and ready." },
      { src: "/images/projects/bioscript/guide.png", caption: "The built-in guide, explaining the five pipeline stages before you run one." },
      { src: "/images/projects/bioscript/advanced-settings.png", caption: "Advanced settings - the retrieval and scoring knobs the run is parameterised on." },
      { src: "/images/projects/bioscript/configuration.png", caption: "The configuration sidebar: disease focus, publication window, objective, and the keys the run needs." },
    ],
    icon: { cx: 0.4, cy: 0.32, size: 0.55 },
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
    image: "/images/projects/interview_ai/home.png",
    shots: [
      { src: "/images/projects/interview_ai/home.png", caption: "The landing page: candidate and interviewer entry points." },
      { src: "/images/projects/interview_ai/features.png", caption: "The four properties the platform claims, stated on the page itself." },
      { src: "/images/projects/interview_ai/interviewee.png", caption: "Step one of the candidate flow - the resume upload the question set is generated from." },
      { src: "/images/projects/interview_ai/login.png", caption: "The interviewer sign-in. The dashboard behind it is gated by real Supabase auth, so it is not photographed here rather than faked." },
    ],
    icon: { cx: 0.5, cy: 0.44, size: 0.82 },
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
    image: "/images/projects/ai_coding_agent/cli.png",
    shots: [
      { src: "/images/projects/ai_coding_agent/cli.png", caption: "A real run against the local Ollama chain with no API key configured - which is why the cost line reads $0.000000." },
      { src: "/images/projects/ai_coding_agent/providers.png", caption: "The provider chain, printed by the agent: Ollama, OpenAI, Claude, Gemini, Groq, OpenRouter and HuggingFace, each with its own model mapping." },
      { src: "/images/projects/ai_coding_agent/memory.png", caption: "The memory subsystem - preferences and project knowledge the agent carries between sessions." },
    ],
    icon: { cx: 0.17, cy: 0.22, size: 0.55 },
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
    image: "/images/projects/soh_ships/map.png",
    shots: [
      { src: "/images/projects/soh_ships/map.png", caption: "2,780 simulated vessels across the shipping lanes, backend live on the FastAPI service." },
      { src: "/images/projects/soh_ships/detections.png", caption: "The detection log for one completed pass: 12 contacts, 3 of them dark, cross-referenced against AIS." },
      { src: "/images/projects/soh_ships/dark-vessels.png", caption: "Filtered to the dark contacts alone - the vessels the detector found with no matching AIS position." },
      { src: "/images/projects/soh_ships/new-analysis.png", caption: "Starting a new SAR pass: the scene selection the pipeline runs against." },
    ],
    icon: { cx: 0.4, cy: 0.42, size: 0.55 },
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
      "A Bloomberg-style terminal with a dual backend (Node.js/Fastify API gateway + Python/FastAPI data engine): live price streaming from Finnhub through Redis pub/sub into a 100ms batch flusher that collapses per-symbol ticks into one write instead of flooding the socket, 16 FRED macroeconomic indicators, VADER-based news sentiment scoring, and a set of technical indicator overlays. Every external API call (Finnhub, Yahoo Finance, FRED) is wrapped in a circuit breaker, so a provider outage degrades the terminal instead of taking it down. CI runs lint, the Python test suite, a frontend build, and a Docker build on every push.",
    image: "/images/projects/bloomberg_terminal/terminal.png",
    shots: [
      { src: "/images/projects/bloomberg_terminal/terminal.png", caption: "The terminal running against its own frontend: watchlist, quote panel, candlestick chart with volume, and 16 FRED macro indicators." },
      { src: "/images/projects/bloomberg_terminal/indicators.png", caption: "RSI and MACD overlaid from the indicator toolbar." },
      { src: "/images/projects/bloomberg_terminal/chart-range.png", caption: "The same instrument on the 5-year range." },
      { src: "/images/projects/bloomberg_terminal/watchlist.png", caption: "Selecting a different symbol from the watchlist repoints the quote and chart panels." },
      { src: "/images/projects/bloomberg_terminal/shortcuts.png", caption: "The keyboard map. Panels badged SIM are on the simulated feed - see the gateway bug noted in tools/shots/README.md." },
    ],
    icon: { cx: 0.15, cy: 0.22, size: 0.45 },
    tech: ["Node.js", "FastAPI", "React", "Docker"],
    metrics: [
      { label: "Backend tests", value: "25" },
      { label: "FRED indicators", value: "16" },
    ],
    github: "https://github.com/Dakshjain1604/bloomberg-terminal-clone",
    tags: ["web"],
  },
  {
    id: "website_cloner",
    title: "Website Cloner",
    /**
     * Added 2026-09-01 while wiring up real screenshots, because it is a
     * real checkout under CODES and the sweep was meant to cover all of
     * them. It is also the smallest thing on this page - a take-home
     * template (Orchids SWE intern challenge), one endpoint and one form -
     * and the outcome line says so rather than dressing it up. If the list
     * should be strictly ranked work, this is the entry to cut.
     */
    outcome: "Take-home build: scrape a URL's DOM and assets, then have an LLM re-emit it as standalone HTML.",
    description:
      "A FastAPI service that fetches a target page with a rotating user agent, parses the DOM and collected styles with BeautifulSoup, and passes the extracted context to an LLM that re-emits a single self-contained HTML file. The Next.js front end is one URL field and a preview pane.",
    image: "/images/projects/website_cloner/home.png",
    shots: [
      { src: "/images/projects/website_cloner/home.png", caption: "The whole front end: one URL field, one action. The work is on the server side." },
      { src: "/images/projects/website_cloner/url-entered.png", caption: "A target entered and ready to submit. There is no result shot: the backend constructs its OpenAI client at import time and will not start without a key." },
    ],
    icon: { cx: 0.5, cy: 0.16, size: 0.45 },
    tech: ["FastAPI", "Next.js", "BeautifulSoup", "LLM"],
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
