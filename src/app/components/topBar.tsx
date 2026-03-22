"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "GitHub", href: "#github" },
  { name: "Contact", href: "#contact" },
  {
    name: "Resume",
    href: "https://drive.google.com/drive/folders/17dRozDJ1YzoZLawDuOlTiMQDqodHz8Ed?usp=sharing",
    external: true,
    highlight: true,
  },
];

export function Headerbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ["home", "about", "skills", "projects", "experience", "github", "contact"];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-4 px-4">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`flex items-center justify-between py-2.5 px-6 rounded-full border transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0f]/90 border-white/10 shadow-lg shadow-cyan-500/5 backdrop-blur-xl"
            : "bg-white/5 border-white/5 backdrop-blur-md"
        }`}
      >
        

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-3 py-1.5 text-sm transition-all duration-300 ${
                link.highlight
                  ? "ml-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-cyan-500/20 border border-cyan-500/30 text-white hover:border-cyan-500/50"
                  : activeSection === link.name.toLowerCase()
                  ? "text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {link.highlight && <Sparkles size={12} className="inline mr-1" />}
              {link.name}
              {!link.highlight && activeSection === link.name.toLowerCase() && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-x-1 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-cyan-500 to-cyan-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.a>
          ))}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-neutral-300 hover:text-white transition-colors p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-4 right-4 md:hidden rounded-2xl border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl p-4 shadow-xl shadow-cyan-500/5"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                    link.highlight
                      ? "bg-gradient-to-r from-cyan-500/20 to-cyan-500/20 border border-cyan-500/30 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.highlight && <Sparkles size={12} className="inline mr-2" />}
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
