"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(loadTimer);
    };
  }, []);

  const codeLines = [
    "const developer = {",
    "  name: \"Daksh Jain\",",
    "  role: \"Full Stack + AI\",",
    "  passion: \"Building cool stuff\",",
    "};",
  ];

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#0a0a0f] flex flex-col items-center justify-center"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 font-mono text-sm md:text-base"
          >
            {codeLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 + 0.3 }}
                className="text-neutral-400"
              >
                <span className="text-cyan-400 mr-4 select-none">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-cyan-400">{"  "}</span>
                {line.includes("name") || line.includes("role") || line.includes("passion") ? (
                  <>
                    <span className="text-cyan-300">{line.split("&quot;")[0]}&quot;</span>
                    <span className="text-green-400">{line.split('"')[1]}</span>
                    <span className="text-cyan-300">&quot;{line.split('"')[2] || ""}</span>
                  </>
                ) : line.includes("const") ? (
                  <>
                    <span className="text-cyan-400">const</span>
                    <span className="text-white"> developer = </span>
                    <span className="text-yellow-400">{"{"}</span>
                  </>
                ) : line.includes("};") ? (
                  <span className="text-yellow-400">{"};"}</span>
                ) : (
                  line
                )}
              </motion.div>
            ))}
          </motion.div>

          <div className="w-64 mt-12 relative z-10">
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-pink-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-neutral-500 text-xs mt-3 font-mono"
            >
              {progress < 100 ? "Initializing..." : "Ready!"}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 text-neutral-600 text-xs"
          >
            Press any key to skip
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
