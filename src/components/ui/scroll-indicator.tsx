"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ScrollIndicatorProps {
  showProgress?: boolean;
}

export function ScrollIndicator({ showProgress = true }: ScrollIndicatorProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showIndicator, setShowIndicator] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (currentScrollY / totalHeight) * 100;
      
      setScrollProgress(progress);
      setShowIndicator(currentScrollY < window.innerHeight);
      setScrollDirection(currentScrollY > lastScrollY ? "down" : "up");
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!showIndicator) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2"
    >
      {showProgress && (
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${scrollProgress * 1.256} 100`}
              initial={{ strokeDasharray: "0 100" }}
              animate={{ strokeDasharray: `${scrollProgress * 1.256} 100` }}
              transition={{ duration: 0.1 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-xs text-neutral-400 font-mono"
              key={Math.round(scrollProgress)}
            >
              {Math.round(scrollProgress)}%
            </motion.span>
          </div>
        </div>
      )}
      
      <motion.div
        animate={{ y: scrollDirection === "down" ? [0, 5, 0] : [0, -5, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-neutral-500"
      >
        {scrollDirection === "down" ? (
          <ArrowDown size={16} />
        ) : (
          <ArrowUp size={16} />
        )}
      </motion.div>
    </motion.div>
  );
}
