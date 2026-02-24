"use client";
import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";

const experiences = [
  {
    title: "Data Science Intern",
    company: "Celebal Technologies",
    location: "Remote",
    period: "Oct 2024 – Feb 2025",
    description:
      "Developed machine learning models for predictive analytics and designed interactive data visualizations. Optimized data preprocessing pipelines with Python, Pandas, and NumPy. Researched and implemented Transformer models and NLP techniques for AI applications.",
    highlights: [
      "ML Models & Predictive Analytics",
      "Python, Pandas, NumPy",
      "Transformer & NLP Research",
    ],
    tech: ["Python", "TensorFlow", "Pandas", "NumPy", "Scikit-learn"],
    logo: "🧠",
    color: "from-cyan-500 to-pink-500",
  },
  {
    title: "Backend Development Intern",
    company: "Celebal Technologies",
    location: "Remote",
    period: "June 2024 – Aug 2024",
    description:
      "Built backend systems for an e-commerce platform using Node.js and Express, significantly improving API performance. Integrated JWT authentication, implemented GraphQL APIs, and documented REST APIs with Swagger UI. Containerized the application with Docker for streamlined deployment.",
    highlights: [
      "Node.js & Express Backend",
      "JWT Auth & GraphQL APIs",
      "Docker Containerization",
    ],
    tech: ["Node.js", "Express", "GraphQL", "MongoDB", "Docker"],
    logo: "⚙️",
    color: "from-cyan-500 to-blue-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const item = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export function Experience() {
  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "#0a0a0f" }}
      id="experience"
    >
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-8">
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
            className="inline-block px-4 py-1 rounded-full text-xs font-medium text-green-300 bg-green-500/10 border border-green-500/20 mb-4"
          >
            Career journey
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-neutral-400 text-sm mt-3 max-w-md mx-auto">
            My journey in the tech industry and key milestones
          </p>
          <div className="section-divider mt-4" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          <div className="absolute left-[19px] md:left-[27px] top-0 bottom-0 w-[2px]">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="w-full bg-gradient-to-b from-cyan-500/50 via-cyan-500/30 to-transparent"
            />
          </div>

          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="relative pl-14 md:pl-16 pb-12 last:pb-0"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                viewport={{ once: true }}
                className="absolute left-0 md:left-1.5 top-1 z-10"
              >
                <div className="relative">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center text-xl shadow-lg`}>
                    {exp.logo}
                  </div>
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: idx * 0.5,
                    }}
                    className={`absolute inset-0 rounded-xl border border-cyan-500/30`}
                  />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="glass-card rounded-2xl p-5 md:p-6 group hover:border-cyan-500/20 transition-all duration-500 relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${exp.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {exp.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-cyan-400 font-medium">{exp.company}</p>
                      <span className="text-neutral-600">•</span>
                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <MapPin size={10} />
                        {exp.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono bg-white/5 px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit">
                    <Calendar size={10} />
                    {exp.period}
                  </span>
                </div>

                <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white/5 border border-white/10 text-neutral-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {exp.highlights.map((highlight) => (
                    <motion.span
                      key={highlight}
                      whileHover={{ scale: 1.05 }}
                      className={`px-3 py-1 rounded-full text-[10px] font-medium bg-gradient-to-r ${exp.color} bg-opacity-10 border border-cyan-500/20 text-cyan-300 uppercase tracking-wider`}
                    >
                      {highlight}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href="https://www.linkedin.com/in/daksh-jain16/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors group"
          >
            <Briefcase size={16} />
            <span>View full experience on LinkedIn</span>
            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
