"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  { number: "01", title: "Discovery", description: "Understanding your vision, goals, and technical requirements through detailed discussions." },
  { number: "02", title: "Design", description: "Creating wireframes and prototypes that align with your brand and user experience goals." },
  { number: "03", title: "Development", description: "Building robust, scalable solutions using modern technologies and best practices." },
  { number: "04", title: "Delivery", description: "Launching your product with thorough testing, optimization, and ongoing support." },
];

export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-24 md:py-32 relative overflow-hidden" style={{ background: "#0d0d14" }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full text-xs font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 mb-4">
            How I Work
          </span>
          <h2 className="text-3xl md:text-5xl font-bold">
            Development <span className="gradient-text">Process</span>
          </h2>
          <div className="section-divider mt-4" />
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/5">
            <motion.div
              className="w-full bg-gradient-to-b from-cyan-500 via-cyan-500 to-transparent"
              style={{ height: lineHeight }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`relative flex items-center gap-8 mb-16 last:mb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} hidden md:block`} />
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg z-10 shadow-lg shadow-cyan-500/20"
              >
                {step.number}
              </motion.div>

              <div className="flex-1 pl-24 md:pl-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
