"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { BottomBar } from "./BottomBar";
import { FlipWords } from "@/components/ui/flip-words";
import { MagicButton } from "@/components/ui/magic-button";
import { ChevronDown, Sparkles } from "lucide-react";
import BlurText from "../subComponents/Title";
import { CustomCursor } from "@/components/ui/custom-cursor";

// Dynamically import Three.js component to avoid SSR issues
const ThreeSkillsBackground = dynamic(
  () =>
    import("@/components/ui/three-skills-background").then(
      (mod) => mod.ThreeSkillsBackground
    ),
  { ssr: false }
);

const roles = [
  "Full Stack Developer",
  "AI Engineer",
  "Cloud Enthusiast",
  "Problem Solver",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function HeroSection() {
  return (
    <div className="relative w-full min-h-screen bg-[#09090b]" id="home">
      <CustomCursor />

      {/* Three.js 3D Skills Background */}
      <ThreeSkillsBackground />

      {/* Subtle radial gradient overlay for text readability */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 45%, rgba(9,9,11,0.9) 0%, rgba(9,9,11,0.5) 55%, transparent 100%)",
        }}
      />

      {/* Main Content Area */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-4 pb-24 relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center min-h-screen pt-20 md:pt-24"
      >
        <motion.div variants={item} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="text-xs font-medium text-neutral-300">
              Available for opportunities
            </span>
          </div>
        </motion.div>

        {/* Reliable Title Reveal */}
        <div className="mb-4 pt-4 drop-shadow-lg">
          <BlurText
            text="Daksh Jain"
            delay={60}
            animateBy="letters"
            direction="bottom"
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white"
          />
        </div>

        {/* Rolodex Flipping Subheader */}
        <motion.div
          variants={item}
          className="text-xl md:text-2xl lg:text-4xl text-neutral-300 drop-shadow-md mb-8 h-10 mt-2 flex items-center justify-center space-x-2"
        >
          <span>I&apos;m a</span>
          <FlipWords
            words={roles}
            duration={3000}
            className="text-cyan-400 font-medium"
          />
        </motion.div>

        {/* Short Bio */}
        <motion.p
          variants={item}
          className="text-base sm:text-lg text-neutral-400 drop-shadow-md max-w-lg mx-auto leading-relaxed mb-12 font-light"
        >
          Building modern web applications and AI-powered solutions. Passionate
          about creating elegant, scalable software that users love.
        </motion.p>

        {/* Properly Aligned CTA Buttons */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mt-4"
        >
          <a href="#projects" className="block w-full sm:w-auto shadow-xl">
            <MagicButton
              title="View Projects"
              icon={<Sparkles className="w-4 h-4" />}
              position="right"
            />
          </a>

          <a
            href="#contact"
            className="flex items-center shadow-xl justify-center h-12 w-full sm:w-44 rounded-lg border border-white/10 bg-black/40 text-sm font-medium text-neutral-200 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/20 transition-all duration-300 backdrop-blur-sm"
          >
            Get in Touch
          </a>
        </motion.div>

        <motion.div variants={item} className="mt-12 md:mt-16">
          <BottomBar />
        </motion.div>
      </motion.div>

      {/* Floating Scroll Indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-neutral-400 hover:text-white transition-colors"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 drop-shadow-lg"
        >
          <span className="text-xs font-mono tracking-widest uppercase">
            Scroll
          </span>
          <ChevronDown size={18} className="mt-1" />
        </motion.div>
      </motion.a>
    </div>
  );
}
