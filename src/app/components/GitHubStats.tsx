"use client";
import { motion } from "framer-motion";
import { Github, GitCommit, GitPullRequest, Star, Code, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface GitHubData {
  contributions: {
    total: number;
    weeks: Array<Array<number>>;
  };
  stats: {
    repos: number;
    stars: number;
    forks: number;
  };
  languages: Array<{ name: string; count: number }>;
}

function getLanguageColor(name: string, index: number): string {
  const key = name.toLowerCase();
  if (key.includes("typescript") || key.includes("ts")) return "#3b82f6"; // Vibrant Electric TS Blue
  if (key.includes("javascript") || key.includes("js")) return "#f1e05a"; // Bright JS Yellow
  if (key.includes("python")) return "#38bdf8"; // Bright Python Sky Blue
  if (key.includes("html")) return "#f97316"; // Bright HTML Orange
  if (key.includes("css")) return "#c084fc"; // Bright CSS Purple
  if (key.includes("shell") || key.includes("bash")) return "#34d399"; // Bright Shell Mint Green
  if (key.includes("c++") || key.includes("cpp")) return "#f43f5e"; // Bright C++ Pink
  if (key.includes("go")) return "#22d3ee"; // Bright Go Cyan
  if (key.includes("rust")) return "#fb923c"; // Bright Rust Orange

  const fallbacks = ["#3b82f6", "#f1e05a", "#38bdf8", "#f97316", "#c084fc", "#34d399"];
  return fallbacks[index % fallbacks.length];
}

export function GitHubStats() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const response = await fetch("/api/github");
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub data");
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, []);

  const totalLangCount = data ? data.languages.reduce((acc, lang) => acc + lang.count, 0) : 0;
  const languages = data
    ? data.languages.map((lang) => ({
        name: lang.name,
        percentage: Math.round((lang.count / totalLangCount) * 100),
      }))
    : [];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background border-t border-hairline" id="github">
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-accent/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase">
            telemetry_stream
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display mt-2">
            GitHub <span className="text-sky-400">Activity</span>
          </h2>
          <div className="section-divider mt-4" />
        </motion.div>

        {loading ? (
          // ── SKELETON LOADING STATE ──
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card rounded-lg p-5 border border-hairline animate-pulse">
                  <div className="h-4 w-4 bg-surface-2 rounded mb-3 mx-auto" />
                  <div className="h-6 w-16 bg-surface-2 rounded mb-2 mx-auto" />
                  <div className="h-3 w-20 bg-surface-2 rounded mx-auto" />
                </div>
              ))}
            </div>
            <div className="glass-card rounded-xl p-6 border border-hairline animate-pulse h-32" />
            <div className="glass-card rounded-xl p-6 border border-hairline animate-pulse h-28" />
          </div>
        ) : error || !data ? (
          // ── TRUTHFUL FAIL GRACEFULLY / UNCONFIGURED STATE (NO FAKE METRICS) ──
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6 md:p-8 border border-hairline bg-surface max-w-2xl mx-auto text-center"
          >
            <div className="flex justify-center mb-4 text-accent/80">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-base font-mono font-bold text-white mb-2 uppercase tracking-wide">
              [status: telemetry_offline]
            </h3>
            <p className="text-sm text-text-muted leading-relaxed font-sans font-light mb-6 max-w-md mx-auto">
              Live orchestration activity stats require a secure build token. To maintain strict data integrity, all placeholder or hardcoded metrics have been disabled. Explore the live codebase directly on GitHub:
            </p>
            <a
              href="https://github.com/Dakshjain1604"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-accent text-ink text-xs font-mono font-semibold hover:opacity-90 active:scale-98 transition-all cursor-pointer"
            >
              explore_github_profile
              <Github size={14} className="ml-2" />
            </a>
          </motion.div>
        ) : (
          // ── REAL LIVE DATA STATE ──
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "repositories", value: data.stats.repos.toString(), icon: <Code size={16} /> },
                { label: "contributions", value: data.contributions.total.toString(), icon: <GitCommit size={16} /> },
                { label: "stars_earned", value: data.stats.stars.toString(), icon: <Star size={16} /> },
                { label: "forks_count", value: data.stats.forks.toString(), icon: <GitPullRequest size={16} /> },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-lg p-5 text-center border border-hairline hover:border-accent/30 transition-colors"
                >
                  <div className="flex justify-center mb-2 text-text-muted">
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-mono font-bold text-white tracking-tight">{stat.value}</p>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="glass-card rounded-xl p-6 border border-hairline bg-surface"
            >
              <span className="text-xs font-mono font-medium text-text-muted mb-4 block">language_compilation_mix</span>
              <div className="h-3 rounded-full bg-surface-2 overflow-hidden flex mb-5 border border-hairline p-0.5 shadow-inner">
                {languages.map((lang, idx) => {
                  const color = getLanguageColor(lang.name, idx);
                  return (
                    <motion.div
                      key={lang.name}
                      initial={{ width: "0%" }}
                      whileInView={{ width: `${lang.percentage}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.08, ease: "easeOut" }}
                      viewport={{ once: true }}
                      className="h-full first:rounded-l-full last:rounded-r-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                      title={`${lang.name}: ${lang.percentage}%`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2.5">
                {languages.map((lang, idx) => {
                  const color = getLanguageColor(lang.name, idx);
                  return (
                    <div key={lang.name} className="flex items-center gap-2 font-mono text-xs">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-white font-medium">{lang.name.toLowerCase()}</span>
                      <span className="text-accent font-mono">{lang.percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-6"
            >
              <a
                href="https://github.com/Dakshjain1604"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-white transition-colors group cursor-pointer"
              >
                <Github size={12} />
                <span>view_full_github_stream</span>
                <span className="group-hover:translate-x-0.5 transition-transform text-accent">→</span>
              </a>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
