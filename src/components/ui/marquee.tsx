"use client";
import { motion } from "framer-motion";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  speed = 20,
  direction = "left",
  pauseOnHover = true,
  className = "",
}: MarqueeProps) {
  const baseVelocity = direction === "left" ? -speed : speed;

  return (
    <div className={`overflow-hidden whitespace-nowrap flex ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: `${direction === "left" ? -50 : 50}%` }}
        transition={{
          duration: Math.abs(baseVelocity),
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        whileHover={pauseOnHover ? { animationPlayState: "paused" } : undefined}
      >
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

const techStack = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "MongoDB", 
  "PostgreSQL", "Docker", "Azure", "OpenAI", "GraphQL", "Tailwind CSS",
  "Prisma", "Redis", "FastAPI", "LangChain", "RAG", "Vector DB"
];

export function MarqueeSection() {
  return (
    <section className="py-8 relative overflow-hidden" style={{ background: "#0a0a0f" }}>
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />
      
      <Marquee speed={40} className="py-4">
        <div className="flex items-center gap-8">
          {techStack.map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-2 rounded-full border border-white/5 bg-white/5"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500/50" />
              <span className="text-sm text-neutral-400 font-medium">{tech}</span>
            </div>
          ))}
        </div>
      </Marquee>
      
      <Marquee speed={30} direction="right" className="py-4">
        <div className="flex items-center gap-8">
          {techStack.reverse().map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-2 rounded-full border border-white/5 bg-white/5"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500/50" />
              <span className="text-sm text-neutral-400 font-medium">{tech}</span>
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
}
