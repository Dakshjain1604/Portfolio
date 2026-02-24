"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, ExternalLink, Github, Sparkles, Code2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface FeaturedProjectProps {
  title: string;
  description: string;
  image: string;
  tech: string[];
  github?: string;
  link?: string;
  ai?: boolean;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export function FeaturedProject({
  title,
  description,
  image,
  tech,
  github,
  link,
  ai,
  codeSnippet,
}: FeaturedProjectProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCode, setShowCode] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setMousePosition({ x: 0.5, y: 0.5 });
        setShowCode(false);
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative rounded-3xl overflow-hidden bg-[#12121a] border border-white/10"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(34, 211, 238, 0.15), transparent 50%)`,
        }}
      />

      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative overflow-hidden aspect-video md:aspect-auto">
          {showCode && codeSnippet ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#1e1e1e]"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                <span className="ml-2 text-xs text-neutral-500 font-mono">
                  {codeSnippet.language}
                </span>
              </div>
              <SyntaxHighlighter
                language={codeSnippet.language.toLowerCase()}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  background: "transparent",
                  fontSize: "0.7rem",
                  lineHeight: "1.4",
                  height: "100%",
                  overflow: "hidden",
                }}
                showLineNumbers
              >
                {codeSnippet.code}
              </SyntaxHighlighter>
            </motion.div>
          ) : (
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#12121a] hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent md:hidden" />

          {ai && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium backdrop-blur-sm flex items-center gap-1.5">
              <Sparkles size={12} />
              AI Powered
            </div>
          )}

          {codeSnippet && (
            <button
              onClick={() => setShowCode(!showCode)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 border border-white/20 text-neutral-300 hover:text-white hover:border-white/40 transition-all backdrop-blur-sm"
            >
              {showCode ? (
                <img src={image} alt="Show image" className="w-4 h-4 object-cover rounded" />
              ) : (
                <Code2 size={16} />
              )}
            </button>
          )}
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
              {title}
            </h3>
            <p className="text-neutral-400 leading-relaxed mb-6">{description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-neutral-400"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {github && (
                <motion.a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-white/20 transition-all"
                >
                  <Github size={16} />
                  Source Code
                </motion.a>
              )}
              {link && (
                <motion.a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 hover:border-cyan-500/50 transition-all"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-4 right-4 text-neutral-600 group-hover:text-neutral-400 transition-colors"
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ArrowRight size={20} />
      </motion.div>
    </motion.div>
  );
}

const featuredProjects = [
  {
    title: "Documind AI",
    description:
      "Chat with your documents using RAG pipeline — upload PDFs and get intelligent answers instantly. Built with cutting-edge AI technology for seamless document interaction.",
    image: "/images/Documind.png",
    tech: ["Next.js", "FastAPI", "OpenAI", "ChromaDB", "LangChain"],
    github: "https://github.com/Dakshjain1604/DocuMind-Ai",
    link: "https://docu-mind-ai-nu.vercel.app/",
    ai: true,
    codeSnippet: {
      language: "Python",
      code: `from langchain_community.document_loaders import PyPDFLoader
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
    )`,
    },
  },
  {
    title: "AI Website Cloner",
    description:
      "Clone any website instantly using AI — powered by computer vision and intelligent code generation. Transform any design into production-ready code.",
    image: "/images/Website_Cloner.avif",
    tech: ["Next.js", "FastAPI", "OpenAI", "Computer Vision"],
    github: "https://github.com/Dakshjain1604/website_cloner.git",
    ai: true,
    codeSnippet: {
      language: "TypeScript",
      code: `interface ElementDetection {
  tag: string;
  x: number;
  y: number;
  width: number;
  height: number;
  styles: CSSProperties;
  content?: string;
}

async function cloneWebsite(imageData: ImageData): Promise<ElementDetection[]> {
  const response = await fetch('/api/detect', {
    method: 'POST',
    body: JSON.stringify({ image: imageData })
  });

  const elements = await response.json();
  return elements.map((el: any) => ({
    tag: el.tag,
    x: el.bounding_box.x,
    y: el.bounding_box.y,
    width: el.bounding_box.width,
    height: el.bounding_box.height,
    styles: el.styles
  }));
}`,
    },
  },
];

export function FeaturedProjects() {
  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full text-xs font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 mb-4"
          >
            ✨ AI Showcase
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold">
            Featured <span className="gradient-text">AI Projects</span>
          </h2>
          <p className="text-neutral-400 text-sm mt-3 max-w-md mx-auto">
            Cutting-edge AI applications showcasing the future of intelligent software
          </p>
          <div className="section_divider mt-4" />
        </motion.div>

        <div className="space-y-12">
          {featuredProjects.map((project) => (
            <FeaturedProject key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
