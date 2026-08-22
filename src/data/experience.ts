export type Role = {
  id: string
  title: string
  org: string
  location: string
  start: string
  end: string
  summary: string
  /** Each bullet is a list of parts, same shape as profile.ts's
   *  BioParagraph - `bold` marks the artefact, the surface it shipped on,
   *  or the number attached to it, per the comment below on why the
   *  bullets are written this specific way. Plain strings would leave
   *  that distinction invisible; a reader scanning rather than reading
   *  every word should still land on the evidence. */
  bullets: { text: string; bold?: boolean }[][]
  tech: string[]
}

/**
 * Newest first. Sourced from DakshJain_Resume_.pdf (25 Jul 2026), which is
 * also the file served at /DakshJain_Resume.pdf - so the site and the PDF a
 * recruiter downloads say the same thing. Keep them in sync when the resume
 * changes.
 *
 * The bullets are deliberately specific. The previous set ("Built
 * production-ready MCP servers solo to enable secure, multi-tenant agent
 * tool invocation") described a category of work; these name the artefact,
 * the surface it shipped on, and the number attached to it, which is the
 * difference between a claim and evidence.
 */
export const experience: Role[] = [
  {
    id: "neo",
    title: "Full-Stack & AI Engineer",
    org: "NEO",
    location: "Jaipur, India",
    start: "Oct 2025",
    end: "Present",
    summary:
      "Joined an early-stage autonomous AI engineering startup as an intern and was promoted to full-time in three months. Owns the website, the backend behind it, and the LLM features inside the product.",
    bullets: [
      [
        { text: "Built and published " },
        { text: "neo-mcp", bold: true },
        { text: ", an open-source " },
        { text: "MIT-licensed", bold: true },
        { text: " MCP server on " },
        { text: "PyPI", bold: true },
        { text: " that puts NEO inside " },
        { text: "Claude Code, Cursor, VS Code, Zed and Codex", bold: true },
        {
          text: ". I own its tool schemas, structured outputs, function calling, auth and error contracts, across ",
        },
        { text: "45 releases in 4 months", bold: true },
        { text: "." },
      ],
      [
        { text: "Architected " },
        { text: "NeoClaw", bold: true },
        {
          text: ", a messaging-first agent orchestration layer that turns one Telegram or WhatsApp message into multi-step work through subagents over MCP, with ",
        },
        { text: "50+ tools", bold: true },
        { text: " behind a single contract, loop detection, confidence-based escalation to a human, and LLM tracing." },
      ],
      [
        { text: "Shipped " },
        { text: "three production LLM features", bold: true },
        { text: " on the " },
        { text: "Claude API and LangChain", bold: true },
        { text: ": a research agent, a PDF parser and a dataset processor, plus the product's RAG pipelines." },
      ],
      [
        { text: "Open-sourced the " },
        { text: "Ornith evaluation framework", bold: true },
        {
          text: " and used it to benchmark models against each other, so output quality was measured before any model change shipped. NEO's public model comparisons were written off those benchmarks.",
        },
      ],
      [
        { text: "Led the " },
        { text: "v1-to-v2 REST API migration", bold: true },
        { text: " and " },
        { text: "full React rebuild of heyneo.com", bold: true },
        { text: " as the " },
        { text: "only engineer", bold: true },
        {
          text: ", reworking product pages, user flows and dashboards end to end, and rebuilt the developer docs at ",
        },
        { text: "docs.heyneo.com", bold: true },
        { text: " on Next.js." },
      ],
      [
        { text: "Owns the " },
        { text: "Node.js/Express and MongoDB backend", bold: true },
        { text: ": tuned hot paths with " },
        { text: "compound indexes and aggregation pipelines", bold: true },
        { text: ", added " },
        { text: "Redis caching and rate limiting", bold: true },
        { text: " so agent traffic could not overwhelm the database, and built " },
        { text: "OAuth 2.0 and JWT", bold: true },
        { text: " auth flows with Jest coverage on critical routes." },
      ],
      [{ text: "Ships every change through Git, GitHub Actions CI/CD, Docker, AWS and Vercel." }],
    ],
    tech: [
      "Python",
      "Node.js",
      "Next.js",
      "React",
      "Claude API",
      "LangChain",
      "MCP",
      "MongoDB",
      "Redis",
      "Docker",
      "AWS",
    ],
  },
  {
    id: "celebal-ds",
    title: "Data Science Intern",
    org: "Celebal Technologies",
    location: "Jaipur, India",
    start: "Oct 2024",
    end: "Feb 2025",
    summary:
      "Built machine learning and NLP projects in Python for the team's client work.",
    bullets: [
      [
        { text: "Built " },
        { text: "classification models", bold: true },
        { text: " with scikit-learn, pandas and NumPy so documents were sorted into categories automatically instead of by hand." },
      ],
      [
        { text: "Built " },
        { text: "structure extraction", bold: true },
        { text: " over unstructured documents, turning free-form text into structured fields a downstream system could read." },
      ],
    ],
    tech: ["Python", "scikit-learn", "pandas", "NumPy", "NLP"],
  },
  {
    /**
     * Not on the 2026 resumes, which are one page and cut it for space.
     * Kept here because the site has room and an earlier backend internship
     * is real history - but it is the one entry not corroborated by the PDF
     * being served, so verify the dates before relying on it.
     */
    id: "celebal-backend",
    title: "Backend Intern",
    org: "Celebal Technologies",
    location: "Jaipur, India",
    start: "Jun 2024",
    end: "Aug 2024",
    summary:
      "Built scalability modules and optimized REST interfaces for a high-traffic e-commerce platform.",
    bullets: [
      [{ text: "Developed Node.js and Express API layers with full CRUD routes." }],
      [{ text: "Integrated JWT authentication and designed GraphQL schema queries." }],
      [{ text: "Documented payment and user APIs using Swagger UI, and containerized the workspace with Docker." }],
    ],
    tech: ["Node.js", "Express", "GraphQL", "MongoDB", "Docker"],
  },
]
