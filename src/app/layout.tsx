import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Headerbar } from "./components/topBar";
import Footer from "./components/Footer";
import { Metadata, Viewport } from "next";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05050A",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-dakshjain.vercel.app"),
  title: "Daksh Jain | AI Engineer & Full-Stack Engineer",
  description: "AI Engineer at NEO building MCP servers, multi-agent orchestration, and RAG pipelines. Full-stack engineer across Next.js, Node.js, Python, and the Anthropic Claude API.",
  keywords: [
    "Daksh Jain", "Full Stack Developer", "AI Engineer", "Web Developer", "React", "Next.js", "Python", "Portfolio",
    "MCP", "Model Context Protocol", "AI Agents", "Agent Orchestration", "Tool Calling", "RAG", "Evals", "LLM", "Anthropic Claude", "LangChain"
  ],
  authors: [{ name: "Daksh Jain" }],
  creator: "Daksh Jain",
  alternates: {
    canonical: "https://portfolio-dakshjain.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio-dakshjain.vercel.app",
    title: "Daksh Jain | AI Engineer & Full-Stack Engineer",
    description: "AI Engineer at NEO building MCP servers, multi-agent orchestration, and RAG pipelines. Full-stack engineer across Next.js, Node.js, Python, and the Anthropic Claude API.",
    siteName: "Daksh Jain Portfolio",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Daksh Jain | AI Engineer & Full-Stack Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daksh Jain | AI Engineer & Full-Stack Engineer",
    description: "AI Engineer at NEO building MCP servers, multi-agent orchestration, and RAG pipelines. Full-stack engineer across Next.js, Node.js, Python, and the Anthropic Claude API.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Daksh Jain",
    "url": "https://portfolio-dakshjain.vercel.app",
    "jobTitle": "Full-Stack & AI Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "NEO",
      "url": "https://heyneo.com"
    },
    "sameAs": [
      "https://github.com/Dakshjain1604",
      "https://www.linkedin.com/in/daksh-jain16/",
      "https://leetcode.com/u/Daksh8816/",
      "https://huggingface.co/daksh-neo"
    ],
    "knowsAbout": [
      "Autonomous AI Agents",
      "Model Context Protocol (MCP)",
      "Multi-Agent Orchestration",
      "RAG Pipelines",
      "Next.js",
      "Node.js",
      "Python",
      "TypeScript"
    ]
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground antialiased font-sans">
        <LoadingScreen />
        <CustomCursor />
        <ScrollProgress />
        <Headerbar />
        <main className="relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
