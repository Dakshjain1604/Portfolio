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
    "Full-stack engineer who builds and ships AI product features end to end, from the React frontend to the Python backend to the LLM systems behind them.",

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

  /**
   * Written to sound like a person. The previous version opened with
   * "the intersection of robust full-stack systems and state-of-the-art AI
   * orchestration" and closed on "not just intelligent, but also resilient,
   * performant, and highly reliable" - stock adjectives and a not-just-X-but-Y
   * construction, which is the register every generated bio defaults to and
   * tells a reader nothing. Say what the work actually is instead.
   */
  bio: [
    {
      parts: [
        { text: "I am a software engineer who works across the " },
        { text: "whole stack and the LLM systems behind it", bold: true },
        {
          text: ". In practice that means React and Next.js at the front, Python and Node underneath, and most of my time going into the parts in between: tool schemas, retrieval, and the failure cases that only turn up under real traffic.",
        },
      ],
    },
    {
      parts: [
        { text: "Right now I am a " },
        { text: "Full-Stack & AI Engineer", bold: true },
        { text: " at " },
        { text: "NEO", bold: true, link: "https://heyneo.com" },
        {
          text: ", an early-stage startup building autonomous AI engineering agents. I joined as an intern and was promoted to full-time within three months. I built and publish ",
        },
        { text: "neo-mcp", bold: true, link: "https://pypi.org/project/neo-mcp/" },
        {
          text: ", the open-source MCP server that puts NEO inside Claude Code, Cursor, VS Code, Zed and Codex, now past 45 releases. I architected ",
        },
        { text: "NeoClaw", bold: true },
        {
          text: ", a messaging-first orchestration layer that turns a single Telegram or WhatsApp message into multi-step work through subagents over MCP, with 50+ tools behind one contract. And I led the v1-to-v2 API migration and React rebuild of heyneo.com as the ",
        },
        { text: "only engineer", bold: true },
        { text: " on it." },
      ],
    },
    {
      parts: [
        { text: "Outside work I keep building " },
        { text: "developer tools", bold: true },
        {
          text: ", usually small ones that scratch a specific itch: a CLI coding agent that runs offline on local models, a harness for grading LLM output against a rubric, a document platform with hybrid retrieval. I like the problems where the model is the easy part and everything around it is not.",
        },
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
    period: "2022 to 2026",
    /** Explicit rather than left for the reader to infer from `period` -
     *  a closed date range reads as complete only if the reader already
     *  knows today's date is past it. */
    status: "Graduated",
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
