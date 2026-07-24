"use client";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function ContactSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background border-t border-hairline" id="contact">
      {/* Background glow overlay */}
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase">
            dispatch_channel
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mt-2">
            Let&apos;s <span className="text-sky-400">Connect</span>
          </h2>
          <div className="section-divider mt-4" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="glass-card rounded-xl p-6 md:p-8 border border-hairline bg-surface text-center space-y-8"
        >
          {/* Status Eyebrow info */}
          <div className="flex flex-wrap items-center justify-center gap-4 border-b border-hairline pb-6 text-[10px] font-mono text-text-muted">
            <span className="flex items-center gap-1.5 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              status: open_to_ops
            </span>
          </div>

          <div className="space-y-4 max-w-lg mx-auto">
            <p className="text-sm md:text-base text-text-muted leading-relaxed font-sans font-light">
              I am open to full-time roles, internships, and freelance systems building. Reach out directly via email or LinkedIn. 
            </p>
          </div>

          {/* Active Action Button Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <MagneticButton
              href="mailto:dakshjain080@gmail.com"
              className="flex items-center justify-center h-11 px-8 w-full sm:w-52 rounded-lg bg-white text-black text-xs font-mono font-semibold tracking-tight hover:bg-zinc-200 active:scale-98 transition-all shadow-md shadow-white/5"
            >
              dispatch_email
              <Mail size={12} className="ml-2" />
            </MagneticButton>

            <a
              href="https://linkedin.com/in/daksh-jain16"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-11 px-8 w-full sm:w-52 rounded-lg border border-zinc-800 bg-zinc-950/80 text-white text-xs font-mono hover:bg-zinc-900 hover:border-zinc-700 active:scale-98 transition-all cursor-pointer"
            >
              linkedin_profile
              <Linkedin size={12} className="ml-2 text-zinc-400" />
            </a>
          </div>

          {/* Direct Parameters Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-hairline text-left font-mono text-xs">
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-surface border border-hairline flex items-center justify-center text-text-muted shrink-0">
                  <Mail size={12} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-text-muted">email</p>
                  <a href="mailto:dakshjain080@gmail.com" className="text-text-primary hover:text-accent transition-colors">
                    dakshjain080@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-surface border border-hairline flex items-center justify-center text-text-muted shrink-0">
                  <Phone size={12} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-text-muted">phone</p>
                  <a href="tel:+917627056978" className="text-text-primary hover:text-accent transition-colors">
                    +91 7627056978
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-surface border border-hairline flex items-center justify-center text-text-muted shrink-0">
                  <MapPin size={12} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-text-muted">location</p>
                  <span className="text-text-primary">
                    Jaipur, India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
