"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Github, ExternalLink, Code2, Folder } from "lucide-react";

interface Command {
  command: string;
  output: React.ReactNode;
}

const initialCommands: Command[] = [
  { command: "whoami", output: "daksh-jain" },
  { command: "cat skills.txt", output: "Full Stack, AI/ML, Cloud Computing" },
  { command: "echo $PASSION", output: "Building innovative solutions" },
  { command: "ls ./projects", output: "transactly/ documind-ai/ brainly/" },
  { command: "npm run current_focus", output: "AI-powered apps & RAG pipelines" },
];

const projects = [
  { name: "Documind AI", desc: "RAG-powered document chat", url: "https://docu-mind-ai-nu.vercel.app/" },
  { name: "AI Website Cloner", desc: "AI-powered website cloning", url: "https://github.com/Dakshjain1604/website_cloner" },
  { name: "Transactly", desc: "Real-time transaction tracking", url: "https://transactly.vercel.app/" },
  { name: "Brainly", desc: "AI-powered learning platform", url: "https://brainly-ai.vercel.app/" },
];

const skills = [
  { category: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "FastAPI", "Python", "PostgreSQL"] },
  { category: "AI/ML", items: ["LangChain", "OpenAI", "Vector Databases", "RAG"] },
  { category: "Cloud", items: ["AWS", "Docker", "Vercel", "Railway"] },
];

const socialLinks = [
  { platform: "GitHub", url: "https://github.com/Dakshjain1604" },
  { platform: "LinkedIn", url: "https://linkedin.com/in/dakshjain1604" },
  { platform: "LeetCode", url: "https://leetcode.com/dakshjain1604" },
  { platform: "Email", url: "mailto:dakshjain1604@gmail.com" },
];

export function TerminalSection() {
  const [displayedCommands, setDisplayedCommands] = useState<Command[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isInteractive, setIsInteractive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (isInteractive) {
      inputRef.current?.focus();
      return;
    }

    if (currentCommandIndex >= initialCommands.length) {
      const resetTimeout = setTimeout(() => {
        setDisplayedCommands([]);
        setCurrentCommandIndex(0);
        setCurrentText("");
        setIsTyping(true);
        setIsInteractive(true);
      }, 3000);
      return () => clearTimeout(resetTimeout);
    }

    const currentCommand = initialCommands[currentCommandIndex];

    if (isTyping) {
      if (currentText.length < currentCommand.command.length) {
        const typeTimeout = setTimeout(() => {
          setCurrentText(currentCommand.command.slice(0, currentText.length + 1));
        }, 50 + Math.random() * 50);
        return () => clearTimeout(typeTimeout);
      } else {
        setIsTyping(false);
        const executeTimeout = setTimeout(() => {
          setDisplayedCommands((prev) => [...prev, currentCommand]);
          setCurrentCommandIndex((prev) => prev + 1);
          setCurrentText("");
          setIsTyping(true);
        }, 500);
        return () => clearTimeout(executeTimeout);
      }
    }
  }, [currentText, currentCommandIndex, isTyping, isInteractive]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedCommands]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output: React.ReactNode = "";

    switch (trimmed) {
      case "help":
        output = (
          <div className="space-y-1">
            <p className="text-cyan-400">Available commands:</p>
            <p><span className="text-yellow-400">whoami</span>    - About me</p>
            <p><span className="text-yellow-400">projects</span>  - List all projects</p>
            <p><span className="text-yellow-400">skills</span>    - Show technical skills</p>
            <p><span className="text-yellow-400">git</span>       - GitHub profile</p>
            <p><span className="text-yellow-400">leetcode</span>  - LeetCode profile</p>
            <p><span className="text-yellow-400">social</span>    - Social links</p>
            <p><span className="text-yellow-400">clear</span>    - Clear terminal</p>
          </div>
        );
        break;
      case "whoami":
        output = (
          <div className="space-y-1">
            <p className="text-white font-bold">Daksh Jain</p>
            <p className="text-neutral-400">Full Stack Developer | AI/ML Enthusiast</p>
            <p className="text-neutral-500">Building innovative solutions with modern tech</p>
          </div>
        );
        break;
      case "projects":
        output = (
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.name} className="flex items-start gap-2">
                <Folder size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300 hover:underline"
                  >
                    {project.name}
                  </a>
                  <p className="text-neutral-500 text-xs">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );
        break;
      case "skills":
        output = (
          <div className="space-y-2">
            {skills.map((skill) => (
              <div key={skill.category}>
                <span className="text-cyan-400">{skill.category}:</span>{" "}
                <span className="text-neutral-400">{skill.items.join(", ")}</span>
              </div>
            ))}
          </div>
        );
        break;
      case "git":
      case "github":
        output = (
          <div className="flex items-center gap-2">
            <Github size={16} className="text-cyan-400" />
            <a
              href="https://github.com/Dakshjain1604"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:underline"
            >
              github.com/Dakshjain1604
            </a>
          </div>
        );
        break;
      case "leetcode":
        output = (
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-yellow-400" />
            <a
              href="https://leetcode.com/dakshjain1604"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-300 hover:underline"
            >
              leetcode.com/dakshjain1604
            </a>
          </div>
        );
        break;
      case "social":
        output = (
          <div className="space-y-1">
            {socialLinks.map((link) => (
              <div key={link.platform} className="flex items-center gap-2">
                <ExternalLink size={14} className="text-neutral-500" />
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {link.platform}
                </a>
              </div>
            ))}
          </div>
        );
        break;
      case "clear":
        setDisplayedCommands([]);
        return;
      case "":
        return;
      default:
        output = (
          <span className="text-red-400">
            Command not found: {trimmed}. Type <span className="text-yellow-400">help</span> for available commands.
          </span>
        );
    }

    setDisplayedCommands((prev) => [...prev, { command: cmd, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (input.trim()) {
        handleCommand(input);
        setHistory((prev) => [...prev, input]);
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#09090b]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Interactive <span className="gradient-text">Terminal</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card rounded-xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
            <span className="ml-4 text-xs text-neutral-600 font-mono">
              daksh@portfolio ~ {isInteractive ? "%" : "~"}
            </span>
          </div>

          <div
            ref={terminalRef}
            className="p-5 font-mono text-sm min-h-[280px] max-h-[400px] overflow-y-auto"
          >
            {!isInteractive ? (
              <>
                {displayedCommands.map((cmd, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-3"
                  >
                    <div className="flex items-center gap-2 text-neutral-400">
                      <span className="text-cyan-400">→</span>
                      <span className="text-neutral-500">$</span>
                      <span className="text-neutral-300">{cmd.command}</span>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="ml-6 text-neutral-500 mt-0.5"
                    >
                      {cmd.output}
                    </motion.div>
                  </motion.div>
                ))}

                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="text-cyan-400">→</span>
                  <span className="text-neutral-500">$</span>
                  <span className="text-neutral-300">{currentText}</span>
                  <span className={`${showCursor ? "opacity-100" : "opacity-0"} text-cyan-400`}>
                    ▋
                  </span>
                </div>
              </>
            ) : (
              <>
                {displayedCommands.map((cmd, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <span className="text-cyan-400">→</span>
                      <span className="text-neutral-500">$</span>
                      <span className="text-neutral-300">{cmd.command}</span>
                    </div>
                    <div className="ml-6 text-neutral-500 mt-0.5">{cmd.output}</div>
                  </div>
                ))}

                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="text-cyan-400">→</span>
                  <span className="text-neutral-500">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsInteractive(true)}
                    className="flex-1 bg-transparent border-none outline-none text-neutral-300 focus:ring-0"
                    autoFocus
                    autoComplete="off"
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
