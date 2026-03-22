"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Github, ExternalLink, Code2, Folder } from "lucide-react";

interface Command {
  command: string;
  output: React.ReactNode;
}

const initialCommands: Command[] = [
  { command: "whoami", output: "daksh-jain — Full Stack + AI Engineer" },
  { command: "cat skills.txt", output: "Full Stack · AI/ML · Cloud · DevOps" },
  { command: "echo $PASSION", output: "Building innovative AI-powered solutions" },
  { command: "ls ./projects", output: "documind-ai/ transactly/ brainly/ website-cloner/" },
  { command: "npm run status", output: "Currently building RAG pipelines & AI agents" },
];

const projects = [
  { name: "Documind AI", desc: "RAG-powered document chat", url: "https://docu-mind-ai-nu.vercel.app/" },
  { name: "AI Website Cloner", desc: "AI-powered website cloning", url: "https://github.com/Dakshjain1604/website_cloner" },
  { name: "Transactly", desc: "Real-time payment platform", url: "https://transactly.vercel.app/" },
  { name: "Brainly", desc: "AI-powered second brain", url: "https://brainly-ai.vercel.app/" },
];

const skills = [
  { category: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "FastAPI", "Python", "PostgreSQL"] },
  { category: "AI/ML", items: ["LangChain", "OpenAI", "Vector Databases", "RAG"] },
  { category: "Cloud", items: ["AWS", "Docker", "Vercel", "Railway"] },
];

const socialLinks = [
  { platform: "GitHub", url: "https://github.com/Dakshjain1604" },
  { platform: "LinkedIn", url: "https://linkedin.com/in/daksh-jain16" },
  { platform: "LeetCode", url: "https://leetcode.com/u/Daksh8816/" },
  { platform: "Email", url: "mailto:dakshjain8816@gmail.com" },
];

export function TerminalSection() {
  const [displayedCommands, setDisplayedCommands] = useState<Command[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [phase, setPhase] = useState<"typing" | "interactive">("typing");
  const [animIndex, setAnimIndex] = useState(0);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Typing animation using interval (Strict Mode safe) ──
  useEffect(() => {
    if (phase !== "typing") return;

    // All commands have been typed — switch to interactive
    if (animIndex >= initialCommands.length) {
      animRef.current = setTimeout(() => {
        setDisplayedCommands([]);
        setPhase("interactive");
      }, 2000);
      return () => {
        if (animRef.current) clearTimeout(animRef.current);
      };
    }

    const cmd = initialCommands[animIndex];

    // Still typing current command
    if (currentText.length < cmd.command.length) {
      animRef.current = setTimeout(() => {
        setCurrentText((prev) => cmd.command.slice(0, prev.length + 1));
      }, 55 + Math.random() * 45);
      return () => {
        if (animRef.current) clearTimeout(animRef.current);
      };
    }

    // Finished typing — execute after brief pause
    animRef.current = setTimeout(() => {
      setDisplayedCommands((prev) => [...prev, cmd]);
      setAnimIndex((prev) => prev + 1);
      setCurrentText("");
    }, 400);
    return () => {
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, [phase, animIndex, currentText]);

  // Focus input when entering interactive mode
  useEffect(() => {
    if (phase === "interactive") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [phase]);

  // Scroll terminal to bottom on new output
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedCommands, currentText]);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output: React.ReactNode = "";

    // ── Smart keyword matching for natural language ──
    const resolve = (input: string): string => {
      if (!input || input === "clear") return input;

      // Exact match first
      const exactCmds = ["help", "whoami", "projects", "skills", "git", "github", "leetcode", "social"];
      if (exactCmds.includes(input)) return input;

      // Keyword-based fuzzy matching
      const words = input.split(/\s+/);
      const has = (...keywords: string[]) => keywords.some((k) => input.includes(k));

      if (has("hi", "hello", "hey", "yo", "sup")) return "__greeting";
      if (has("about", "daksh", "who", "yourself", "tell me", "introduce")) return "whoami";
      if (has("project", "built", "portfolio", "work", "app", "made", "build", "create")) return "projects";
      if (has("skill", "tech", "stack", "language", "framework", "tool", "know")) return "skills";
      if (has("github", "repo", "repository", "code", "source", "git")) return "git";
      if (has("leet", "dsa", "competitive", "coding", "algorithm")) return "leetcode";
      if (has("social", "link", "connect", "contact", "reach", "email", "linkedin", "twitter")) return "social";
      if (has("help", "command", "what can", "how", "option", "menu")) return "help";
      if (has("clear", "cls", "reset")) return "clear";

      return "__unknown";
    };

    const resolved = resolve(trimmed);

    switch (resolved) {
      case "__greeting":
        output = (
          <div className="space-y-1">
            <p className="text-cyan-400">Hey there! 👋 I&apos;m Daksh&apos;s terminal bot.</p>
            <p className="text-neutral-400">Try these commands to learn more:</p>
            <p className="text-neutral-500">
              <span className="text-yellow-400">whoami</span> · <span className="text-yellow-400">projects</span> · <span className="text-yellow-400">skills</span> · <span className="text-yellow-400">social</span> · <span className="text-yellow-400">help</span>
            </p>
          </div>
        );
        break;
      case "help":
        output = (
          <div className="space-y-1">
            <p className="text-cyan-400">Available commands:</p>
            <p><span className="text-yellow-400">whoami</span>    — About me</p>
            <p><span className="text-yellow-400">projects</span>  — List all projects</p>
            <p><span className="text-yellow-400">skills</span>    — Show technical skills</p>
            <p><span className="text-yellow-400">git</span>       — GitHub profile</p>
            <p><span className="text-yellow-400">leetcode</span>  — LeetCode profile</p>
            <p><span className="text-yellow-400">social</span>    — Social links</p>
            <p><span className="text-yellow-400">clear</span>     — Clear terminal</p>
            <p className="text-neutral-600 mt-2 text-xs">💡 You can also type naturally, e.g. &quot;tell me about daksh&quot;</p>
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
              href="https://leetcode.com/u/Daksh8816/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-300 hover:underline"
            >
              leetcode.com/Daksh8816
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
  }, []);

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

  const handleTerminalClick = () => {
    if (phase === "interactive") {
      inputRef.current?.focus();
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
          <p className="text-neutral-500 text-sm mt-2">
            Click the terminal and type <span className="text-cyan-400 font-mono">help</span> to explore
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card rounded-xl overflow-hidden"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="ml-4 text-xs text-neutral-600 font-mono">
              daksh@portfolio ~ {phase === "interactive" ? "%" : "~"}
            </span>
          </div>

          {/* Terminal body */}
          <div
            ref={terminalRef}
            onClick={handleTerminalClick}
            className="p-5 font-mono text-sm min-h-[280px] max-h-[400px] overflow-y-auto cursor-text"
          >
            {phase === "typing" ? (
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

                {/* Currently typing line */}
                {animIndex < initialCommands.length && (
                  <div className="flex items-center gap-2 text-neutral-400">
                    <span className="text-cyan-400">→</span>
                    <span className="text-neutral-500">$</span>
                    <span className="text-neutral-300">{currentText}</span>
                    <span className="text-cyan-400 animate-pulse">▋</span>
                  </div>
                )}
              </>
            ) : (
              <>
                {displayedCommands.length === 0 && (
                  <div className="mb-4 text-neutral-500 text-xs">
                    <p className="text-cyan-400/70 mb-1">Welcome to the interactive terminal!</p>
                    <p>
                      Type <span className="text-yellow-400">help</span> to see available commands.
                    </p>
                  </div>
                )}

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
                    className="flex-1 bg-transparent border-none outline-none text-neutral-300 focus:ring-0 caret-cyan-400"
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Type a command..."
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
