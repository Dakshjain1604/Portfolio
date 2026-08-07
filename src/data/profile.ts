export type BioParagraph = {
  parts: { text: string; bold?: boolean; link?: string }[]
}

export const profile = {
  name: "Daksh Jain",
  role: "Full-Stack & AI Engineer",
  employer: { name: "NEO", url: "https://heyneo.com" },
  location: "Jaipur, India",
  tagline:
    "Building production-grade AI systems across autonomous agent orchestration, MCP tooling, and RAG pipelines.",
  avatar: "/images/profile.avif",

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
          text: ", an early-stage startup pioneering autonomous AI engineering agents. Having joined as an intern and stepped into a full-time role within three months, I actively design and ship critical agentic systems. My work here ranges from building ",
        },
        { text: "secure, multi-tenant Model Context Protocol (MCP) servers", bold: true },
        { text: " to implementing " },
        { text: "advanced RAG pipelines", bold: true },
        { text: " and " },
        { text: "multi-agent orchestration backends", bold: true },
        { text: "." },
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
    { label: "Company", value: "NEO" },
    { label: "Location", value: "Jaipur, India" },
    { label: "Focus", value: "Agent orchestration, MCP, RAG" },
    { label: "Since", value: "Oct 2025" },
  ],

  pillars: [
    "Autonomous AI Agents",
    "Secure MCP Systems",
    "Multi-Agent Orchestration",
    "Production RAG Pipelines",
  ],
} as const
