"use client";
import { motion } from "framer-motion";
import { Github } from "../icons/github";
import { Gmail } from "../icons/Gmail";
import { Leetcode } from "../icons/Leetcode";
import { Linkedin } from "../icons/Linkedin";
import { ArrowUp, Heart, Code, Sparkles, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

const socials = [
  {
    icon: <Linkedin />,
    href: "https://www.linkedin.com/in/daksh-jain16/",
    label: "LinkedIn",
    hoverColor: "hover:text-accent hover:border-accent/40",
  },
  {
    icon: <Github height={36} width={36} />,
    href: "https://github.com/Dakshjain1604",
    label: "GitHub",
    hoverColor: "hover:text-accent hover:border-accent/40",
  },
  {
    icon: <Leetcode />,
    href: "https://leetcode.com/u/Daksh8816/",
    label: "LeetCode",
    hoverColor: "hover:text-accent hover:border-accent/40",
  },
  {
    icon: <Gmail />,
    href: "mailto:dakshjain080@gmail.com",
    label: "Email",
    hoverColor: "hover:text-accent hover:border-accent/40",
  },
];

const quickLinks = [
  { name: "home", href: "#home" },
  { name: "about", href: "#about" },
  { name: "skills", href: "#skills" },
  { name: "projects", href: "#projects" },
  { name: "experience", href: "#experience" },
  { name: "contact", href: "#contact" },
];

export default function Footer() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
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
      className="relative pt-20 pb-8 overflow-hidden bg-background border-t border-hairline"
      id="footer"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            {/* Initials Mark Logo */}
            <div className="flex items-center gap-2 select-none mb-3">
              <span className="font-mono text-lg text-accent font-bold tracking-tighter">dj</span>
              <span className="font-mono text-[9px] text-text-muted/40 uppercase tracking-widest">[sys]</span>
            </div>
            
            <p className="text-sm text-text-muted leading-relaxed max-w-xs mb-4 font-sans font-light">
              AI System Architect & Full-Stack Engineer. Passionate about orchestrating high-performance systems and deploying production agent workflows.
            </p>
            <div className="space-y-2 font-mono text-xs text-text-muted">
              <a
                href="mailto:dakshjain080@gmail.com"
                className="hover:text-accent transition-colors flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted/40" />
                email: dakshjain080@gmail.com
              </a>
              <a
                href="tel:+917627056978"
                className="hover:text-accent transition-colors flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                phone: +91 7627056978
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted mb-4">
              quick_links
            </h3>
            <div className="flex flex-col gap-2">
              {quickLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.03 }}
                  viewport={{ once: true }}
                  className="text-xs font-mono text-text-muted hover:text-accent hover:translate-x-0.5 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span className="w-1 h-1 rounded-full bg-hairline group-hover:bg-accent transition-colors" />
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted mb-4">
              connect
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {socials.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`text-text-muted p-2 rounded border border-hairline bg-surface/50 ${social.hoverColor} transition-all flex items-center justify-center cursor-pointer`}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-4 p-2.5 rounded border border-hairline bg-surface/30"
            >
              <p className="text-[10px] font-mono text-text-muted flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles size={10} className="text-accent" />
                ready_for_ops
              </p>
            </motion.div>
          </motion.div>
        </div>

        <div className="h-px bg-hairline mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono text-text-muted uppercase tracking-wider"
          >
            © {new Date().getFullYear()} daksh jain. all rights reserved.
          </motion.p>
          
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-white transition-colors group relative cursor-pointer"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center group-hover:border-accent/40 transition-colors">
                <ArrowUp size={10} className="group-hover:-translate-y-0.5 transition-transform text-accent" />
              </div>
              <svg className="absolute inset-0 w-8 h-8 -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.2"
                  strokeDasharray={`${scrollProgress * 0.88} 100`}
                  className="opacity-40"
                />
              </svg>
            </div>
            <span className="hidden sm:inline">back_to_top</span>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
