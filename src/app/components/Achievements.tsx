"use client";
import { motion } from "framer-motion";
import { Trophy, Award, Code, Users, Star, Zap } from "lucide-react";

const achievements = [
  {
    icon: <Trophy size={20} />,
    title: "Microsoft Certified",
    subtitle: "Azure Fundamentals",
    year: "2024",
  },
  {
    icon: <Award size={20} />,
    title: "Microsoft Certified",
    subtitle: "Dynamics 365",
    year: "2024",
  },
  {
    icon: <Code size={20} />,
    title: "500+ Problems",
    subtitle: "LeetCode Solved",
    year: "2024",
  },
  {
    icon: <Users size={20} />,
    title: "Open Source",
    subtitle: "Active Contributor",
    year: "Ongoing",
  },
];

const stats = [
  { value: "2+", label: "Years Coding", icon: <Code size={16} /> },
  { value: "50+", label: "Projects Built", icon: <Star size={16} /> },
  { value: "10+", label: "Technologies", icon: <Zap size={16} /> },
  { value: "100+", label: "Commits/Year", icon: <Trophy size={16} /> },
];

export function Achievements() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#09090b]">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Achievements & <span className="gradient-text">Milestones</span>
          </h2>
          <div className="section-divider mt-4" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {achievements.map((achievement, i) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              className="glass-card rounded-lg p-5 relative overflow-hidden group"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3 group-hover:bg-cyan-500/20 transition-colors">
                {achievement.icon}
              </div>
              
              <h3 className="text-sm font-medium text-white mb-0.5">{achievement.title}</h3>
              <p className="text-xs text-neutral-500 mb-2">{achievement.subtitle}</p>
              <span className="text-xs text-neutral-600 font-mono">{achievement.year}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="glass-card rounded-xl p-5"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center text-neutral-500 mb-2">{stat.icon}</div>
                <p className="text-xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-neutral-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
