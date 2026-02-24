"use client";
import { motion } from "framer-motion";
import { BottomBar } from "./BottomBar";
import { Spotlight } from "@/components/ui/spotlight";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { MagicButton } from "@/components/ui/magic-button";
import { ChevronDown, Sparkles, Code2, Rocket, Zap, Brain } from "lucide-react";
import { StarsBackground } from "@/components/ui/stars-background";
import { useState, useEffect } from "react";
import { Reactlogo } from "../icons/ReactIcon";
import { NextjsIcon } from "../icons/Nextjsicon";
import { NodejsIcon } from "../icons/nodejs";
import { DockerIcon } from "../icons/DockerIcon";
import { AzureIcon } from "../icons/AzureIcon";

const roles = ["Full Stack Developer", "AI Engineer", "Cloud Enthusiast", "Problem Solver"];

const techIcons = [
  { icon: <Reactlogo />, name: "React" },
  { icon: <NextjsIcon />, name: "Next.js" },
  { icon: <Brain size={18} className="text-cyan-400" />, name: "AI/ML" },
  { icon: <AzureIcon />, name: "Cloud" },
  { icon: <DockerIcon />, name: "Docker" },
  { icon: <NodejsIcon />, name: "Node.js" },
];

const floatingElements = [
  { icon: <Code2 size={20} />, x: "10%", y: "20%", delay: 0 },
  { icon: <Rocket size={18} />, x: "85%", y: "15%", delay: 0.5 },
  { icon: <Zap size={16} />, x: "15%", y: "70%", delay: 1 },
  { icon: <Brain size={22} />, x: "80%", y: "75%", delay: 1.5 },
];

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 50%, #0f0f11 0%, #09090b 70%)" }}
      id="home"
    >
      <StarsBackground className="opacity-40" />
      <ShootingStars />
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(34, 211, 238, 0.06)" />

      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-cyan-500/3 rounded-full blur-[100px] pointer-events-none" />

      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute text-neutral-700 pointer-events-none hidden md:block"
          style={{ left: el.x, top: el.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ delay: el.delay + 1, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {el.icon}
          </motion.div>
        </motion.div>
      ))}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-4 pt-24 max-w-4xl mx-auto relative z-10 w-full text-center"
      >
        <motion.div variants={item} className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-neutral-400 text-xs font-medium">
            <Sparkles size={12} className="text-cyan-400" />
            <span className="text-white">{displayText}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-cyan-400"
            >
              |
            </motion.span>
          </div>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
        >
          <span className="gradient-text">Daksh Jain</span>
        </motion.h1>

        <motion.div variants={item} className="flex justify-center gap-2 mb-6 flex-wrap">
          {techIcons.map((tech) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-sm [&>svg]:w-4 [&>svg]:h-4"
            >
              {tech.icon}
              <span className="text-neutral-500 hidden sm:inline">{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={item}
          className="text-center text-base md:text-lg text-neutral-400 max-w-lg mx-auto leading-relaxed"
        >
          Building modern web applications and AI-powered solutions.
          Passionate about creating elegant, scalable software.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <a href="#projects">
            <MagicButton
              title="View Projects"
              icon={<Sparkles className="w-4 h-4" />}
              position="right"
            />
          </a>
          <a
            href="#contact"
            className="inline-flex h-12 w-full md:w-44 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-neutral-300 hover:text-white hover:border-cyan-500/20 transition-all duration-300"
          >
            Get in Touch
          </a>
        </motion.div>

        <motion.div variants={item} className="flex justify-center mt-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              <motion.video
                drag
                dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                src="/images/hero-video.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="relative rounded-2xl w-[260px] md:w-[380px] cursor-grab active:cursor-grabbing"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-12 left-0 right-0 z-20">
        <BottomBar />
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-neutral-500 hover:text-white transition-colors"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-xs text-neutral-600">Scroll</span>
          <ChevronDown size={18} />
        </motion.div>
      </motion.a>
    </div>
  );
}
