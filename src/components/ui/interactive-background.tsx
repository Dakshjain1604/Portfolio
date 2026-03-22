"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface GlowOrbProps {
  color: string;
  size: number;
  initialX: number;
  initialY: number;
  speed: number;
}

function GlowOrb({ color, size, initialX, initialY, speed }: GlowOrbProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * speed,
        y: prev.y + (mousePosition.y - prev.y) * speed,
      }));
    }, 16);
    return () => clearInterval(interval);
  }, [mousePosition, speed]);

  return (
    <motion.div
      className="pointer-events-none fixed"
      animate={{
        x: position.x - size / 2,
        y: position.y - size / 2,
      }}
      transition={{ type: "spring", damping: 30, stiffness: 50 }}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(40px)",
      }}
    />
  );
}

export function InteractiveBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <GlowOrb
        color="rgba(34, 211, 238, 0.15)"
        size={400}
        initialX={typeof window !== "undefined" ? window.innerWidth / 3 : 0}
        initialY={typeof window !== "undefined" ? window.innerHeight / 3 : 0}
        speed={0.02}
      />
      <GlowOrb
        color="rgba(34, 211, 238, 0.1)"
        size={350}
        initialX={typeof window !== "undefined" ? (window.innerWidth * 2) / 3 : 0}
        initialY={typeof window !== "undefined" ? (window.innerHeight * 2) / 3 : 0}
        speed={0.015}
      />
      <GlowOrb
        color="rgba(236, 72, 153, 0.08)"
        size={300}
        initialX={typeof window !== "undefined" ? window.innerWidth / 2 : 0}
        initialY={typeof window !== "undefined" ? window.innerHeight / 2 : 0}
        speed={0.01}
      />
    </div>
  );
}
