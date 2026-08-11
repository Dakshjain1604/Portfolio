export type BioParagraph = {
  parts: { text: string; bold?: boolean; link?: string }[]
}

export const profile = {
  name: "Daksh Jain",
  role: "Full-Stack & AI Engineer",
  employer: { name: "NEO", url: "https://heyneo.com" },
  location: "Jaipur, India",
  /** The resume's own positioning line, which is sharper than the one that
   *  was here: it names the span (frontend to backend to the model) rather
   *  than listing capabilities. */
  tagline:
    "Full-stack engineer who builds and ships AI product features end to end \u2014 from the React frontend to the Python backend to the LLM systems behind them.",

  /**
   * Shown in the desktop hero and the About panel. Recruiters look for this
   * inside the first ten seconds and most portfolios make them guess.
   *
   * Deliberately worded as an invitation rather than a job-seeking claim,
   * because the second one is yours to make, not mine to assume. If you are
   * open to roles, say so here directly - "Open to senior AI engineering
   * roles" outperforms anything softer.
   */
  availability: {
    /** Drives the dot colour: green reads as reachable, amber as selective. */
    status: "open" as "open" | "selective" | "closed",
    label: "Open to remote work or relocation",
    detail: "Based in Jaipur, currently at NEO. Happy to talk agentic systems, MCP, or RAG.",
  },

  bio: [
    {
      parts: [
        { text: "I am a software engineer focused on the intersection of " },
        { text: "robust full-stack systems", bold: true },
        { text: " and " },
        { text: "state-of-the-art AI orchestration", bold: true },
        {
          text: ". I enjoy building systems that are not just intelligent, but also resilient, performant, and highly reliable under production loads.",
        },
      ],
    },
    {
      parts: [
        { text: "Currently, I am a " },
        { text: "Full-Stack & AI Engineer", bold: true },
        { text: " at " },
        { text: "NEO", bold: true, link: "https://heyneo.com" },
        {
          text: ", an early-stage startup building autonomous AI engineering agents. I joined as an intern and was promoted to full-time within three months. I built and publish ",
        },
        { text: "neo-mcp", bold: true, link: "https://pypi.org/project/neo-mcp/" },
        {
          text: ", the open-source MCP server that puts NEO inside Claude Code, Cursor, VS Code, Zed and Codex \u2014 45 releases in 4 months \u2014 and architected ",
        },
        { text: "NeoClaw", bold: true },
        {
          text: ", a messaging-first orchestration layer that turns a single Telegram or WhatsApp message into multi-step work through subagents over MCP, with 50+ tools behind one contract. I also led the v1-to-v2 API migration and React rebuild of heyneo.com as the ",
        },
        { text: "only engineer", bold: true },
        { text: " on it." },
      ],
    },
    {
      parts: [
        { text: "I build production-grade solutions and " },
        { text: "agentic AI systems", bold: true },
        { text: " using " },
        { text: "Next.js, Node.js, Python, and GenAI", bold: true },
        {
          text: " (such as LangChain, Claude API, and custom agent toolsets). I am passionate about ",
        },
        { text: "developer tooling", bold: true },
        { text: ", automation, and bridging the gap between raw model intelligence and scalable, real-world products." },
      ],
    },
  ] as BioParagraph[],

  specs: [
    { label: "Role", value: "Full-Stack & AI Engineer" },
    { label: "Company", value: "NEO (heyneo.com)" },
    { label: "Location", value: "Jaipur, India" },
    { label: "Focus", value: "Agent orchestration, MCP, RAG" },
    { label: "Since", value: "Oct 2025" },
    { label: "Education", value: "B.Tech CSE, JECRC University" },
    { label: "CGPA", value: "8.6 / 10" },
  ],

  /** From the resume. Shown in About This Mac under the specs table. */
  education: {
    degree: "B.Tech, Computer Science & Engineering (Cloud Computing)",
    school: "JECRC University, Jaipur",
    period: "2022 \u2013 2026",
    cgpa: "8.6/10",
    certifications: [
      "Microsoft Azure Fundamentals",
      "Azure AI Fundamentals",
      "Azure Data Fundamentals",
      "Dynamics 365 Fundamentals",
      "Data Science with Python",
    ],
  },

  pillars: [
    "Autonomous AI Agents",
    "Secure MCP Systems",
    "Multi-Agent Orchestration",
    "Production RAG Pipelines",
  ],
} as const
