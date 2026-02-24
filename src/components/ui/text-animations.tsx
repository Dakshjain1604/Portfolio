"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlitchTextProps {
  children: string;
  className?: string;
}

export function GlitchText({ children, className = "" }: GlitchTextProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute top-0 left-0 text-cyan-400 z-0"
        animate={{
          x: [0, -2, 2, -2, 0],
          opacity: [1, 0.8, 1, 0.8, 1],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 3,
        }}
        aria-hidden
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 text-pink-400 z-0"
        animate={{
          x: [0, 2, -2, 2, 0],
          opacity: [1, 0.8, 1, 0.8, 1],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 3,
          delay: 0.1,
        }}
        aria-hidden
      >
        {children}
      </motion.span>
    </span>
  );
}

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function SplitText({ text, className = "", delay = 0 }: SplitTextProps) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
}

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
}

export function Typewriter({ text, className = "", speed = 50 }: TypewriterProps) {
  return (
    <motion.span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.05,
            delay: i * (speed / 1000),
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
