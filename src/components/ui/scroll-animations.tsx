"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxTextProps {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
}

export function ParallaxText({ children, baseVelocity = 5, className = "" }: ParallaxTextProps) {
  const baseX = useTransform(useScroll().scrollYProgress, (v) => `${v * baseVelocity * 100}%`);
  
  return (
    <div className="overflow-hidden whitespace-nowrap flex">
      <motion.div
        style={{ x: baseX }}
        className={`flex whitespace-nowrap ${className}`}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mr-8">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function ScrollReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);

  return (
    <motion.div ref={ref} style={{ opacity, y, scale }} className={className}>
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};
