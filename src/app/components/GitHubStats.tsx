"use client";
import { motion } from "framer-motion";
import { Github, GitCommit, GitPullRequest, Star, Code, Loader2 } from "lucide-react";
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

const defaultStats = [
  { label: "Repositories", value: "25+", icon: <Code size={18} /> },
  { label: "Commits", value: "500+", icon: <GitCommit size={18} /> },
  { label: "Stars Earned", value: "50+", icon: <Star size={18} /> },
  { label: "Pull Requests", value: "30+", icon: <GitPullRequest size={18} /> },
];

const defaultLanguages = [
  { name: "TypeScript", percentage: 40 },
  { name: "JavaScript", percentage: 25 },
  { name: "Python", percentage: 20 },
  { name: "Other", percentage: 15 },
];

const defaultContributions = Array.from({ length: 52 }, (_, i) => ({
  week: i,
  days: Array.from({ length: 7 }, () => Math.random() > 0.3 ? Math.floor(Math.random() * 4) : 0),
}));

const getIntensity = (level: number) => {
  switch (level) {
    case 0: return "bg-white/5";
    case 1: return "bg-cyan-900/40";
    case 2: return "bg-cyan-700/50";
    case 3: return "bg-cyan-500/60";
    default: return "bg-cyan-400";
  }
};

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
        // Use fallback data on error
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, []);

  const stats = data
    ? [
        { label: "Repositories", value: data.stats.repos.toString(), icon: <Code size={18} /> },
        { label: "Contributions", value: data.contributions.total.toString(), icon: <GitCommit size={18} /> },
        { label: "Stars Earned", value: data.stats.stars.toString(), icon: <Star size={18} /> },
        { label: "Forks", value: data.stats.forks.toString(), icon: <GitPullRequest size={18} /> },
      ]
    : defaultStats;

  const totalLangCount = data ? data.languages.reduce((acc, lang) => acc + lang.count, 0) : 0;
  const languages = data
    ? data.languages.map((lang) => ({
        name: lang.name,
        percentage: Math.round((lang.count / totalLangCount) * 100),
      }))
    : defaultLanguages;

  // Convert API data to contribution graph format
  const contributions = data
    ? data.contributions.weeks.map((week, weekIndex) => ({
        week: weekIndex,
        days: week.map((count) => {
          if (count === 0) return 0;
          if (count <= 2) return 1;
          if (count <= 5) return 2;
          if (count <= 10) return 3;
          return 4;
        }),
      }))
    : defaultContributions;

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#09090b]" id="github">
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            GitHub <span className="gradient-text">Activity</span>
          </h2>
          <div className="section_divider mt-4" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
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
                {loading ? <Loader2 size={18} className="animate-spin" /> : stat.icon}
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
          className="glass-card rounded-xl p-5 mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Github size={14} className="text-neutral-500" />
            <span className="text-xs text-neutral-500 font-medium">Contribution Graph</span>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-0.5 min-w-max">
              {contributions.map((week) => (
                <div key={week.week} className="flex flex-col gap-0.5">
                  {week.days.map((level, day) => (
                    <motion.div
                      key={`${week.week}-${day}`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.2, delay: (week.week * 0.01) + (day * 0.01) }}
                      viewport={{ once: true }}
                      className={`w-2.5 h-2.5 rounded-sm ${getIntensity(level)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="glass-card rounded-xl p-5"
        >
          <span className="text-xs text-neutral-500 font-medium mb-3 block">Most Used Languages</span>
          <div className="h-1.5 rounded-full overflow-hidden flex mb-3">
            {languages.map((lang) => (
              <motion.div
                key={lang.name}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="bg-cyan-500/60 h-full origin-left"
                style={{ width: `${lang.percentage}%` }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500/60" />
                <span className="text-xs text-neutral-400">{lang.name}</span>
                <span className="text-xs text-neutral-600">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {error && (
          <p className="text-xs text-neutral-600 text-center mt-4">
            Showing demo data. Configure GITHUB_TOKEN in .env.local for real data.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-6"
        >
          <a
            href="https://github.com/Dakshjain1604"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors group"
          >
            <Github size={14} />
            <span>View full profile</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
