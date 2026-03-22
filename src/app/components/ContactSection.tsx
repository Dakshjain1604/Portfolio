"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Mail, User, MessageSquare, MapPin, Phone, Loader2, Check } from "lucide-react";

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: "", email: "", subject: "", message: "" });
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#09090b]" id="contact">
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <div className="section-divider mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-neutral-400 leading-relaxed text-sm">
              I&apos;m open to discussing new projects, creative ideas, or opportunities. Feel free to reach out!
            </p>

            <div className="space-y-3">
              <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Mail className="text-neutral-500 group-hover:text-cyan-400 transition-colors" size={16} />
                </div>
                <div>
                  <p className="text-xs text-neutral-600">Email</p>
                  <a href="mailto:dakshjain8816@gmail.com" className="text-sm text-neutral-300 hover:text-white transition-colors">
                    dakshjain8816@gmail.com
                  </a>
                </div>
              </motion.div>

              <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Phone className="text-neutral-500 group-hover:text-cyan-400 transition-colors" size={16} />
                </div>
                <div>
                  <p className="text-xs text-neutral-600">Phone</p>
                  <a href="tel:+917627056978" className="text-sm text-neutral-300 hover:text-white transition-colors">
                    +91 7627056978
                  </a>
                </div>
              </motion.div>

              <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin className="text-neutral-500 group-hover:text-cyan-400 transition-colors" size={16} />
                </div>
                <div>
                  <p className="text-xs text-neutral-600">Location</p>
                  <span className="text-sm text-neutral-300">Jaipur, India</span>
                </div>
              </motion.div>
            </div>

            <div className="glass-card rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-neutral-500">Available for opportunities</span>
              </div>
              <p className="text-xs text-neutral-600">
                Open to full-time roles, internships, and freelance projects.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-5 md:p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={14} />
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/5 rounded-lg text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/30 transition-colors"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={14} />
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/5 rounded-lg text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/30 transition-colors"
                  />
                </div>
              </div>

              <input
                type="text"
                name="subject"
                value={formState.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/5 rounded-lg text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/30 transition-colors"
              />

              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-neutral-600" size={14} />
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Message"
                  rows={4}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/5 rounded-lg text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/30 transition-colors resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-medium flex items-center justify-center gap-2 hover:bg-cyan-500/30 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Sending...
                  </>
                ) : submitted ? (
                  <>
                    <Check size={14} className="text-green-400" />
                    Sent!
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
