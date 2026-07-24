"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { name: "home", href: "#home" },
  { name: "work", href: "#projects" },
  { name: "about", href: "#about" },
  { name: "experience", href: "#experience" },
  { name: "contact", href: "#contact" },
  {
    name: "résumé",
    href: "/DakshJain_Resume.pdf",
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
      setScrolled(window.scrollY > 40);

      // Map active sections based on scroll offset
      const sections = ["home", "projects", "about", "experience", "contact"];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 140) {
            // Map "projects" element back to "work" link name
            setActiveSection(section === "projects" ? "work" : section);
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
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`flex items-center justify-between py-2 px-5 rounded-lg border transition-all duration-300 ${
          scrolled
            ? "bg-surface/85 border-hairline backdrop-blur-md shadow-lg"
            : "bg-surface/40 border-hairline/60 backdrop-blur-sm"
        }`}
      >
        {/* Logo Mark: My initials in mono */}
        <div className="flex items-center gap-2 mr-6 select-none border-r border-hairline pr-4">
          <span className="font-mono text-xs text-accent font-bold tracking-tighter">dj</span>
          <span className="font-mono text-[9px] text-text-muted/40 uppercase tracking-widest">[sys]</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              whileTap={{ scale: 0.98 }}
              className={`relative px-3 py-1.5 text-xs font-mono transition-all duration-200 z-10 cursor-pointer select-none ${
                link.highlight
                  ? "ml-3 px-3 py-1.5 rounded bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20"
                  : activeSection === link.name
                  ? "text-accent font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {link.name}
              {link.highlight && <ArrowUpRight size={10} className="inline ml-1" />}
              {!link.highlight && activeSection === link.name && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded bg-accent/5 border border-accent/10 -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
            </motion.a>
          ))}
        </div>

        {/* Mobile Nav Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-text-muted hover:text-white transition-colors p-1 cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </motion.nav>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed top-16 left-4 right-4 md:hidden rounded-lg border border-hairline bg-surface/95 backdrop-blur-md p-4 shadow-xl"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 text-xs font-mono rounded transition-all duration-200 cursor-pointer ${
                    link.highlight
                      ? "bg-accent/10 border border-accent/20 text-accent flex items-center justify-between"
                      : "text-text-muted hover:text-white hover:bg-surface-2"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.highlight && <ArrowUpRight size={12} />}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
