export type Skill = {
  name: string
  /** Simple Icons slug for `cdn.simpleicons.org/{slug}`. Undefined skills fall back to a
   *  Phosphor glyph (see SystemSettings.tsx's PHOSPHOR_FALLBACK map) or plain text. */
  slug?: string
}

export type SkillGroup = {
  id: string
  label: string
  skills: Skill[]
}

/**
 * Order is sidebar order. `ai` is first and selected by default.
 *
 * Grouped the way the resume groups them, which is a better structure than
 * the frontend/backend/languages split this had: pulling **Retrieval** out
 * as its own group is the single most differentiating thing on the list,
 * and it was previously buried inside a generic "Agentic AI" bucket.
 *
 * Still kept short. Git, GitHub, REST, SQL, CI/CD, JWT and OAuth2 all appear
 * on the resume - correctly, a resume is scanned by keyword - but a
 * portfolio skills list is read as a claim about level, and every obvious
 * entry dilutes the non-obvious one beside it. "Git" next to "Model Context
 * Protocol" does not add Git; it subtracts from MCP.
 */
export const skills: SkillGroup[] = [
  {
    id: "ai",
    label: "AI & LLM Systems",
    skills: [
      { name: "Model Context Protocol (MCP)" },
      { name: "Agent Orchestration" },
      { name: "Tool & Function Calling" },
      { name: "Structured Outputs" },
      { name: "Model Evaluation & LLM Tracing" },
      { name: "Prompt Engineering" },
      { name: "Claude API", slug: "anthropic" },
      { name: "OpenAI API", slug: "openai" },
      { name: "LangChain & LangGraph", slug: "langchain" },
    ],
  },
  {
    id: "retrieval",
    label: "Retrieval",
    skills: [
      { name: "Production RAG" },
      { name: "Hybrid Search (vector + BM25)" },
      { name: "ChromaDB" },
      { name: "FAISS" },
      { name: "SentenceTransformers" },
      { name: "OCR (Tesseract)" },
    ],
  },
  {
    id: "backend",
    label: "Backend & APIs",
    skills: [
      { name: "Node.js", slug: "nodedotjs" },
      { name: "Express", slug: "express" },
      { name: "FastAPI", slug: "fastapi" },
      { name: "MongoDB", slug: "mongodb" },
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "Redis", slug: "redis" },
      { name: "Prisma", slug: "prisma" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React", slug: "react" },
      { name: "Next.js", slug: "nextdotjs" },
      { name: "Redux Toolkit", slug: "redux" },
      { name: "Tailwind", slug: "tailwindcss" },
      { name: "Framer Motion", slug: "framer" },
    ],
  },
  {
    id: "languages",
    label: "Languages",
    skills: [
      { name: "TypeScript", slug: "typescript" },
      { name: "Python", slug: "python" },
      { name: "C++", slug: "cplusplus" },
    ],
  },
  {
    id: "delivery",
    label: "Tooling & Delivery",
    skills: [
      { name: "Docker", slug: "docker" },
      { name: "AWS", slug: "amazonaws" },
      { name: "Vercel", slug: "vercel" },
      { name: "Jest", slug: "jest" },
      { name: "Playwright", slug: "playwright" },
      { name: "Claude Code", slug: "anthropic" },
      { name: "Cursor", slug: "cursor" },
    ],
  },
]
