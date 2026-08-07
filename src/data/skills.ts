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

/** Order is sidebar order. `ai` is first and selected by default. */
export const skills: SkillGroup[] = [
  {
    id: "ai",
    label: "Agentic AI & GenAI",
    skills: [
      { name: "Autonomous Agent Workflows" },
      { name: "Multi-Agent Orchestration" },
      { name: "Model Context Protocol (MCP)" },
      { name: "Production RAG & Vector Search" },
      { name: "LLM Tool & Function Calling" },
      { name: "Prompt Engineering & Evals" },
      { name: "LangChain & LangGraph", slug: "langchain" },
      { name: "Claude & OpenAI APIs", slug: "openai" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js", slug: "nodedotjs" },
      { name: "Express", slug: "express" },
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "MongoDB", slug: "mongodb" },
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
      { name: "Tailwind", slug: "tailwindcss" },
      { name: "Framer Motion", slug: "framer" },
    ],
  },
  {
    id: "languages",
    label: "Languages",
    skills: [
      { name: "TypeScript", slug: "typescript" },
      { name: "JavaScript", slug: "javascript" },
      { name: "Python", slug: "python" },
      { name: "C++", slug: "cplusplus" },
      { name: "SQL" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & Tools",
    skills: [
      { name: "AWS", slug: "amazonaws" },
      { name: "Docker", slug: "docker" },
      { name: "CI/CD" },
      { name: "Git", slug: "git" },
      { name: "REST" },
      { name: "JWT", slug: "jsonwebtokens" },
      { name: "OAuth2" },
      { name: "Zod", slug: "zod" },
      { name: "Claude Code" },
      { name: "Cursor", slug: "cursor" },
    ],
  },
]
