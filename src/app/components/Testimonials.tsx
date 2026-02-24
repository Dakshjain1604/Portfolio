"use client";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    role: "Senior Developer at TechCorp",
    avatar: "JD",
    content: "Daksh is an exceptional developer who consistently delivers high-quality work. His problem-solving skills and attention to detail are remarkable.",
    rating: 5,
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Product Manager at StartupXYZ",
    avatar: "JS",
    content: "Working with Daksh was a pleasure. He understood our requirements perfectly and delivered a product that exceeded our expectations.",
    rating: 5,
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "CTO at InnovateTech",
    avatar: "MJ",
    content: "Daksh's technical expertise and innovative approach to problem-solving make him a valuable asset to any team. Highly recommended!",
    rating: 5,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    role: "Lead Engineer at DevHub",
    avatar: "SW",
    content: "His ability to learn new technologies quickly and apply them effectively is impressive. Great collaborator and team player.",
    rating: 5,
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "#0a0a0f" }} id="testimonials">
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            What People <span className="gradient-text">Say</span>
          </h2>
          <p className="text-neutral-400 text-sm mt-3 max-w-md mx-auto">
            Testimonials from colleagues and collaborators
          </p>
          <div className="section-divider mt-4" />
        </motion.div>

        <div className="relative">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-3xl p-8 md:p-12 max-w-3xl mx-auto relative"
          >
            <Quote className="absolute top-6 left-6 text-cyan-500/20" size={60} />
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[active].rating)].map((_, i) => (
                  <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-lg md:text-xl text-neutral-300 text-center leading-relaxed mb-8">
                &ldquo;{testimonials[active].content}&rdquo;
              </p>

              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[active].avatar}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">{testimonials[active].name}</p>
                  <p className="text-sm text-neutral-400">{testimonials[active].role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === active ? "bg-cyan-500 w-8" : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {testimonials.slice(0, 3).map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-6 cursor-pointer group"
              onClick={() => setActive(i)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/20 flex items-center justify-center text-white font-medium text-sm border border-white/10">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{testimonial.name}</p>
                  <p className="text-xs text-neutral-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-sm text-neutral-400 line-clamp-2 group-hover:text-neutral-300 transition-colors">
                {testimonial.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
