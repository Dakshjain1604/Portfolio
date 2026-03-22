"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Briefcase, FolderGit2, GraduationCap, Award, Code, Rocket, Heart } from "lucide-react";

const stats = [
  { icon: <Briefcase size={18} />, value: 2, suffix: "+", label: "Companies" },
  { icon: <FolderGit2 size={18} />, value: 10, suffix: "+", label: "Projects" },
  { icon: <GraduationCap size={18} />, value: 8.4, suffix: "", label: "CGPA" },
  { icon: <Award size={18} />, value: 3, suffix: "+", label: "Certifications" },
];

const quickFacts = [
  { icon: <Rocket size={14} />, text: "Fast Shipper" },
  { icon: <Code size={14} />, text: "AI Integrations" },
  { icon: <Briefcase size={14} />, text: "Full-Stack" },
  { icon: <Heart size={14} />, text: "High Ownership" },
];

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const isFloat = value % 1 !== 0;

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 40;
    const stepValue = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(isFloat ? Math.round(current * 10) / 10 : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value, isFloat]);

  return (
    <span className="text-2xl md:text-3xl font-bold gradient-text">
      {isFloat ? count.toFixed(1) : count}{suffix}
    </span>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function AboutMe() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#09090b]" id="about">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="section-divider mt-4" />
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-shrink-0 relative group"
          >
            <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src="/images/profile.avif"
              alt="Daksh Jain"
              className="relative rounded-full w-36 md:w-44 h-36 md:h-44 object-cover border border-white/10"
            />
          </motion.div>

          <motion.div
            ref={ref}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex-1"
          >
            <motion.div variants={item} className="glass-card rounded-xl p-5 md:p-6 mb-6">
              <div className="space-y-4 text-sm md:text-base text-neutral-400 leading-relaxed">
                <p>
                  Full-stack engineer who ships AI-powered products fast. Experienced building production Node.js, React, and GenAI systems at an early-stage startup — owning features end-to-end from API design to UI delivery.
                </p>
                <p>
                  Proficient in AI-assisted development with Claude Code, regularly shipping solo what typically takes a team. I thrive in high-ownership, fast-moving environments.
                </p>
                <p>
                  Computer Science undergraduate at{" "}
                  <span className="text-cyan-400 font-medium">JECRC University</span>, bringing a strong foundation in scalable architectures and AI-integrated systems.
                </p>
              </div>

              <motion.div variants={item} className="flex flex-wrap gap-2 mt-4">
                {quickFacts.map((fact, idx) => (
                  <motion.div
                    key={fact.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-neutral-500"
                  >
                    <span className="text-cyan-400">{fact.icon}</span>
                    {fact.text}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={item}
                  whileHover={{ y: -3 }}
                  className="glass-card rounded-lg p-4 text-center group"
                >
                  <div className="flex justify-center mb-2 text-neutral-500 group-hover:text-cyan-400 transition-colors">
                    {stat.icon}
                  </div>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={inView} />
                  <p className="text-xs text-neutral-600 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
