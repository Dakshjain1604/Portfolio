"use client";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Building AI-Powered Applications with LangChain",
    excerpt: "A deep dive into creating intelligent applications using LangChain and OpenAI APIs for seamless AI integration.",
    date: "Coming Soon",
    readTime: "8 min read",
    tags: ["AI", "LangChain", "Python"],
    image: "/images/blog-placeholder-1.jpg",
  },
  {
    id: 2,
    title: "Modern Full Stack Architecture with Next.js 14",
    excerpt: "Exploring the latest features in Next.js 14 and how to build scalable applications with server actions.",
    date: "Coming Soon",
    readTime: "6 min read",
    tags: ["Next.js", "React", "TypeScript"],
    image: "/images/blog-placeholder-2.jpg",
  },
  {
    id: 3,
    title: "Implementing RAG Pipelines for Document Intelligence",
    excerpt: "Step-by-step guide to building Retrieval Augmented Generation systems for intelligent document processing.",
    date: "Coming Soon",
    readTime: "10 min read",
    tags: ["RAG", "AI", "Vector DB"],
    image: "/images/blog-placeholder-3.jpg",
  },
];

export function BlogSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "#0d0d14" }} id="blog">
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Latest <span className="gradient-text">Articles</span>
          </h2>
          <p className="text-neutral-400 text-sm mt-3 max-w-md mx-auto">
            Thoughts, tutorials, and insights on development
          </p>
          <div className="section-divider mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div className="relative h-48 bg-gradient-to-br from-cyan-500/20 to-cyan-500/20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/blog-placeholder.jpg')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-[10px] font-medium bg-white/10 backdrop-blur-sm rounded-full text-white border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-1 text-sm text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <span>Read more</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-neutral-500 text-sm">
            🚧 Articles coming soon! Stay tuned for technical deep-dives and tutorials.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
