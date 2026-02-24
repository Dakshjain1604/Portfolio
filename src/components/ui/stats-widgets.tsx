"use client";
import { motion } from "framer-motion";
import { Star, GitCommit, GitPullRequest, CircleDot, Clock } from "lucide-react";

interface StatsProps {
  className?: string;
}

export function QuickStats({ className = "" }: StatsProps) {
  const stats = [
    { icon: <GitCommit size={16} />, value: "500+", label: "Commits" },
    { icon: <GitPullRequest size={16} />, value: "30+", label: "PRs" },
    { icon: <CircleDot size={16} />, value: "20+", label: "Issues" },
    { icon: <Star size={16} />, value: "50+", label: "Stars" },
  ];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-neutral-400"
        >
          <span className="text-cyan-400">{stat.icon}</span>
          <span className="text-sm font-medium">{stat.value}</span>
          <span className="text-xs text-neutral-500 hidden md:inline">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function ActivityFeed() {
  const activities = [
    { type: "commit", repo: "transactly_frontend", time: "2h ago", message: "Add payment integration" },
    { type: "pr", repo: "DocuMind-Ai", time: "5h ago", message: "Merged PR #12" },
    { type: "star", repo: "Brainly", time: "1d ago", message: "Starred repository" },
    { type: "issue", repo: "website_cloner", time: "2d ago", message: "Fixed bug in parser" },
  ];

  const icons = {
    commit: <GitCommit size={14} className="text-green-400" />,
    pr: <GitPullRequest size={14} className="text-cyan-400" />,
    star: <Star size={14} className="text-yellow-400" />,
    issue: <CircleDot size={14} className="text-cyan-400" />,
  };

  return (
    <div className="space-y-3">
      {activities.map((activity, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="mt-0.5">{icons[activity.type as keyof typeof icons]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{activity.message}</p>
            <p className="text-xs text-neutral-500">{activity.repo}</p>
          </div>
          <span className="text-xs text-neutral-500 shrink-0">{activity.time}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function WakaTimeStats() {
  const languages = [
    { name: "TypeScript", hours: 120, percentage: 40 },
    { name: "JavaScript", hours: 75, percentage: 25 },
    { name: "Python", hours: 60, percentage: 20 },
    { name: "Other", hours: 45, percentage: 15 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-neutral-400">
        <Clock size={16} />
        <span className="text-sm">Coding Activity (Last 30 days)</span>
      </div>
      
      <div className="space-y-3">
        {languages.map((lang, i) => (
          <div key={lang.name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-neutral-300">{lang.name}</span>
              <span className="text-neutral-500">{lang.hours}h</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${lang.percentage}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-500 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-500">Total Time</span>
          <span className="text-sm font-medium gradient-text">300+ hours</span>
        </div>
      </div>
    </div>
  );
}
