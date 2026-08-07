export type ProjectTag = "ai" | "web" | "neo"

export type Project = {
  id: string
  title: string
  outcome: string
  description: string
  image: string
  tech: string[]
  github?: string
  live?: string
  tags: ProjectTag[]
}

export const projects: Project[] = [
  {
    id: "documind_ai",
    title: "DocuMind AI",
    outcome: "RAG document Q&A system for instant chat with PDFs.",
    description:
      "Chat with your documents using a RAG pipeline. Upload PDFs and get intelligent, cited answers instantly. Full-stack AI assistant built with LangChain and ChromaDB.",
    image: "/images/projects/documind-ai.png",
    tech: ["Next.js", "LangChain", "ChromaDB", "OpenAI"],
    github: "https://github.com/Dakshjain1604/DocuMind-Ai",
    live: "https://docu-mind-ai-nu.vercel.app/",
    tags: ["ai"],
  },
  {
    id: "interview_ai",
    title: "Interview AI",
    outcome: "AI mock-interview simulator with performance analytics.",
    description:
      "AI-powered mock interview application that generates personalized questions and offers real-time conversational performance metrics, for both interviewer and candidate sides of the table.",
    image: "/images/projects/ai-interview.png",
    tech: ["React.js", "Node.js", "OpenAI API", "Redux"],
    github: "https://github.com/Dakshjain1604/Ai_Interview",
    live: "https://ai-interview-six-eosin.vercel.app",
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
    id: "ai_coding_agent",
    title: "Ai-Coding-Agent",
    outcome: "Lightweight CLI agent that generates and edits real project files.",
    description:
      "A file-based coding CLI that creates, updates, and diffs project structures for common dev tasks, powered by local Ollama models for private, offline generation.",
    image: "/images/projects/ai-coding-agent.png",
    tech: ["TypeScript", "Ollama", "CLI", "Opencode"],
    github: "https://github.com/Dakshjain1604/Ai-coding-Agent",
    tags: ["ai"],
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
