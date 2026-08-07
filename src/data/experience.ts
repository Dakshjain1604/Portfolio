export type Role = {
  id: string
  title: string
  org: string
  location: string
  start: string
  end: string
  summary: string
  bullets: string[]
  tech: string[]
}

/** Newest first. */
export const experience: Role[] = [
  {
    id: "neo",
    title: "Full-Stack & AI Engineer",
    org: "NEO",
    location: "Remote",
    start: "Oct 2025",
    end: "Present",
    summary:
      "Responsible for end-to-end feature delivery, migrating system modules, and integrating advanced orchestration pipelines at NEO.",
    bullets: [
      "Built production-ready MCP servers solo to enable secure, multi-tenant agent tool invocation.",
      "Developed RAG pipelines utilizing LangChain and the Claude API for complex contextual question answering.",
      "Engineered multi-channel agent orchestration systems and internal developer utilities.",
    ],
    tech: ["Next.js", "Node.js", "LangChain", "Claude API", "PostgreSQL"],
  },
  {
    id: "celebal-ds",
    title: "Data Science Intern",
    org: "Celebal Technologies",
    location: "Jaipur",
    start: "Oct 2024",
    end: "Feb 2025",
    summary:
      "Explored machine learning systems, natural language processing (NLP), and generative AI applications.",
    bullets: [
      "Built and evaluated ML models and NLP pipelines for semantic analysis and text processing tasks.",
      "Worked with prompt engineering, LLM embeddings, and vector similarity search for AI workflows.",
      "Preprocessed complex datasets, performed feature extraction, and benchmarked model performance.",
    ],
    tech: ["Python", "Machine Learning", "NLP", "Generative AI", "PyTorch", "Pandas"],
  },
  {
    id: "celebal-backend",
    title: "Backend Intern",
    org: "Celebal Technologies",
    location: "Jaipur",
    start: "Jun 2024",
    end: "Aug 2024",
    summary:
      "Built scalability modules and optimized REST interfaces for a high-traffic e-commerce platform.",
    bullets: [
      "Developed Node.js and Express backend API layers with robust CRUD routes.",
      "Integrated JWT authentication and designed GraphQL schema queries.",
      "Documented payment and user APIs using Swagger UI, and containerized the workspace with Docker.",
    ],
    tech: ["Node.js", "Express", "GraphQL", "MongoDB", "Docker"],
  },
]
