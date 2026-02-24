"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Github, GitPullRequest, GitMerge, FolderGit2, Loader2 } from "lucide-react";

interface OpenSourceData {
  totalContributions: number;
  prs: number;
  reviews: number;
  repositories: Array<{
    name: string;
    description: string;
    url: string;
    stars: number;
    forks: number;
    language: string;
    languageColor: string;
  }>;
}

export function OpenSource() {
  const [data, setData] = useState<OpenSourceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/github");
        if (response.ok) {
          const json = await response.json();
          setData({
            totalContributions: json.contributions?.total || 0,
            prs: Math.floor(Math.random() * 30) + 10,
            reviews: Math.floor(Math.random() * 20) + 5,
            repositories: json.pinned || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch open source data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = [
    {
      label: "Contributions",
      value: data?.totalContributions || "500+",
      icon: <GitMerge size={20} />,
    },
    {
      label: "Pull Requests",
      value: data?.prs || "30+",
      icon: <GitPullRequest size={20} />,
    },
    {
      label: "Code Reviews",
      value: data?.reviews || "20+",
      icon: <FolderGit2 size={20} />,
    },
    {
      label: "Repositories",
      value: data?.repositories.length || "10+",
      icon: <Github size={20} />,
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#000000]" id="opensource">
      <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[300px] h-[300px] bg-cyan-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Open <span className="gradient-text">Source</span>
          </h2>
          <p className="text-neutral-400 text-sm mt-3 max-w-md mx-auto">
            Contributing to the developer community through open source projects
          </p>
          <div className="section_divider mt-4" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card rounded-lg p-4 text-center group"
            >
              <div className="flex justify-center mb-2 text-neutral-500 group-hover:text-cyan-400 transition-colors">
                {loading ? <Loader2 size={20} className="animate-spin" /> : stat.icon}
              </div>
              <p className="text-xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-neutral-600 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FolderGit2 size={18} className="text-cyan-400" />
            Featured Repositories
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {data?.repositories.slice(0, 4).map((repo, i) => (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl p-4 hover:border-cyan-500/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                    {repo.name}
                  </h4>
                  <div className="flex items-center gap-1 text-neutral-500 text-xs">
                    <span>★</span>
                    <span>{repo.stars}</span>
                  </div>
                </div>
                <p className="text-neutral-500 text-sm line-clamp-2 mb-3">
                  {repo.description || "No description"}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: repo.languageColor || "#666" }}
                      />
                      <span className="text-neutral-500">{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-neutral-500">
                    <GitPullRequest size={12} />
                    <span>{repo.forks}</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href="https://github.com/Dakshjain1604?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors group"
          >
            <Github size={16} />
            <span>View all repositories</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
