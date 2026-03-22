"use client";
import { motion } from "framer-motion";
import { Github } from "../icons/github";
import { Gmail } from "../icons/Gmail";
import { Leetcode } from "../icons/Leetcode";
import { Linkedin } from "../icons/Linkedin";
import { ArrowUp, Heart, Code, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const socials = [
  {
    icon: <Linkedin />,
    href: "https://www.linkedin.com/in/daksh-jain16/",
    label: "LinkedIn",
    hoverColor: "hover:text-blue-400 hover:border-blue-400/30",
  },
  {
    icon: <Github height={36} width={36} />,
    href: "https://github.com/Dakshjain1604",
    label: "GitHub",
    hoverColor: "hover:text-white hover:border-white/30",
  },
  {
    icon: <Leetcode />,
    href: "https://leetcode.com/u/Daksh8816/",
    label: "LeetCode",
    hoverColor: "hover:text-amber-400 hover:border-amber-400/30",
  },
  {
    icon: <Gmail />,
    href: "mailto:dakshjain8816@gmail.com",
    label: "Email",
    hoverColor: "hover:text-red-400 hover:border-red-400/30",
  },
];

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export default function Footer() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="relative pt-20 pb-8 overflow-hidden"
      style={{ background: "#0d0d14" }}
      id="contacts"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-block"
            >
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-3">
                Daksh Jain
              </h2>
            </motion.div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs mb-4">
              Full-stack developer passionate about building exceptional digital
              experiences. Let&apos;s create something amazing together.
            </p>
            <div className="space-y-2">
              <a
                href="tel:+917627056978"
                className="text-sm text-neutral-500 hover:text-white transition-colors flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                +91 7627056978
              </a>
              <a
                href="mailto:dakshjain8816@gmail.com"
                className="text-sm text-neutral-500 hover:text-white transition-colors flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                dakshjain8816@gmail.com
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
              {quickLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  viewport={{ once: true }}
                  className="text-sm text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-neutral-600 group-hover:bg-cyan-500 transition-colors" />
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">
              Connect
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {socials.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-neutral-400 p-2 rounded-lg border border-white/5 bg-white/5 ${social.hoverColor} transition-all duration-300 flex items-center justify-center`}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-4 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10"
            >
              <p className="text-xs text-neutral-400 flex items-center gap-2">
                <Sparkles size={12} className="text-cyan-400" />
                Open to opportunities
              </p>
            </motion.div>
          </motion.div>
        </div>

        <div className="h-px bg-white/5 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-neutral-500 flex items-center gap-1"
          >
            © {new Date().getFullYear()} Daksh Jain. Built with{" "}
            <Heart size={10} className="text-red-400 fill-red-400 mx-0.5" />{" "}
            using{" "}
            <Code size={10} className="text-cyan-400 mx-0.5" />
            Next.js & Framer Motion
          </motion.p>
          
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors group relative"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-cyan-500/30 transition-colors">
                <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <svg className="absolute inset-0 w-8 h-8 -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="rgba(34, 211, 238, 0.3)"
                  strokeWidth="1"
                  strokeDasharray={`${scrollProgress * 0.88} 100`}
                />
              </svg>
            </div>
            <span className="hidden sm:inline">Back to top</span>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
