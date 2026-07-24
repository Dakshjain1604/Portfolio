"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Github, ExternalLink, Code2, Folder, Terminal } from "lucide-react";

interface Command {
  command: string;
  output: React.ReactNode;
}

const initialCommands: Command[] = [
  { command: "whoami", output: "daksh-jain — Full Stack & AI Engineer @ NEO" },
  { command: "cat stack.txt", output: "AI Agents · MCP Systems · Next.js · Node.js · Python" },
  { command: "echo $PASSION", output: "Orchestrating agent workflows and optimizing tool pipelines" },
  { command: "ls ./projects", output: "documind-ai/ soh-ships/ transactly/ brainly/ neoclaw/" },
  { command: "npm run status", output: "Currently scaling agent orchestration and refining evals" },
];

const projects = [
  { name: "DocuMind AI", desc: "RAG PDF assistant", url: "https://docu-mind-ai-nu.vercel.app/" },
  { name: "SOH Ships", desc: "Vessel tracking telemetry", url: "https://github.com/Dakshjain1604/SOH_Ships" },
  { name: "Interview AI", desc: "AI mock interviewer", url: "https://ai-interview-six-eosin.vercel.app" },
  { name: "AutoCareer", desc: "Autonomous job pipeline", url: "https://github.com/Dakshjain1604" },
];

const skills = [
  { category: "Agentic AI & GenAI", items: ["Autonomous Agents", "Multi-Agent Systems", "MCP Protocols", "Production RAG", "LLM Tool Calling"] },
  { category: "Backend Stack", items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "Prisma"] },
  { category: "Frontend Stack", items: ["React", "Next.js", "Tailwind", "Framer Motion"] },
  { category: "Languages", items: ["TypeScript", "JavaScript", "Python", "C++", "SQL"] },
];

const socialLinks = [
  { platform: "GitHub", url: "https://github.com/Dakshjain1604" },
  { platform: "LinkedIn", url: "https://linkedin.com/in/daksh-jain16" },
  { platform: "LeetCode", url: "https://leetcode.com/u/Daksh8816/" },
  { platform: "Hugging Face", url: "https://huggingface.co/daksh-neo" },
  { platform: "Email", url: "mailto:dakshjain080@gmail.com" },
];

export function TerminalSection() {
  const [displayedCommands, setDisplayedCommands] = useState<Command[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [phase, setPhase] = useState<"typing" | "interactive">("typing");
  const [animIndex, setAnimIndex] = useState(0);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isActive, setIsActive] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phase !== "typing") return;

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

    if (currentText.length < cmd.command.length) {
      animRef.current = setTimeout(() => {
        setCurrentText((prev) => cmd.command.slice(0, prev.length + 1));
      }, 30 + Math.random() * 20);
      return () => {
        if (animRef.current) clearTimeout(animRef.current);
      };
    }

    animRef.current = setTimeout(() => {
      setDisplayedCommands((prev) => [...prev, cmd]);
      setAnimIndex((prev) => prev + 1);
      setCurrentText("");
    }, 400);
    return () => {
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, [phase, animIndex, currentText]);

  useEffect(() => {
    if (phase === "interactive" && isActive) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [phase, isActive]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedCommands, currentText, isActive]);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output: React.ReactNode = "";

    const resolve = (input: string): string => {
      if (!input || input === "clear") return input;

      const exactCmds = ["help", "whoami", "projects", "stack", "skills", "contact", "social", "resume", "neoclaw"];
      if (exactCmds.includes(input)) return input;

      const has = (...keywords: string[]) => keywords.some((k) => input.includes(k));

      if (has("hi", "hello", "hey", "yo")) return "__greeting";
      if (has("about", "daksh", "who")) return "whoami";
      if (has("project", "built", "made", "work")) return "projects";
      if (has("skills", "stack", "tech", "languages")) return "stack";
      if (has("contact", "reach", "email", "phone", "social", "linkedin", "github")) return "contact";
      if (has("resume", "pdf", "cv")) return "resume";
      if (has("neoclaw", "agent", "pulse")) return "neoclaw";
      if (has("help", "menu", "command")) return "help";
      if (has("clear", "cls")) return "clear";

      return "__unknown";
    };

    const resolved = resolve(trimmed);

    switch (resolved) {
      case "__greeting":
        output = (
          <div className="space-y-1">
            <p className="text-white">Connection active. Hello. 👋</p>
            <p className="text-text-muted">Type <span className="text-accent underline cursor-pointer" onClick={() => handleCommand("help")}>help</span> to explore query commands.</p>
          </div>
        );
        break;
      case "help":
        output = (
          <div className="space-y-1 text-text-muted font-mono">
            <p className="text-white font-medium mb-1">Available commands:</p>
            <p><span className="text-accent font-semibold">whoami</span>    — Query bio details</p>
            <p><span className="text-accent font-semibold">projects</span>  — Query registered projects</p>
            <p><span className="text-accent font-semibold">stack</span>     — List capability grid</p>
            <p><span className="text-accent font-semibold">contact</span>   — Fetch communication channels</p>
            <p><span className="text-accent font-semibold">resume</span>    — Retrieve resume resource</p>
            <p><span className="text-accent font-semibold">clear</span>     — Reset console screen logs</p>
            <p className="text-text-muted/50 mt-1 text-xs">💡 Custom prompts parsed: &quot;who is daksh&quot; or &quot;neoclaw&quot;</p>
          </div>
        );
        break;
      case "whoami":
        output = (
          <div className="space-y-1.5 font-mono">
            <p className="text-white font-bold">Daksh Jain</p>
            <p className="text-accent">Full-Stack & AI Engineer @ NEO</p>
            <p className="text-text-muted font-light leading-relaxed">
              Engineering agent orchestration loops, custom MCP tools, and production-ready RAG interfaces.
            </p>
          </div>
        );
        break;
      case "projects":
        output = (
          <div className="space-y-2.5">
            {projects.map((project) => (
              <div key={project.name} className="flex items-start gap-2">
                <Folder size={12} className="text-text-muted mt-1 shrink-0" />
                <div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-accent hover:underline flex items-center gap-1 w-fit"
                  >
                    {project.name.toLowerCase()}/
                    <ExternalLink size={10} className="text-text-muted/40" />
                  </a>
                  <p className="text-text-muted text-xs font-light mt-0.5">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );
        break;
      case "stack":
      case "skills":
        output = (
          <div className="space-y-1.5">
            {skills.map((skill) => (
              <div key={skill.category} className="text-xs">
                <span className="text-white font-medium">{skill.category.toLowerCase()}:</span>{" "}
                <span className="text-text-muted">{skill.items.join(", ").toLowerCase()}</span>
              </div>
            ))}
          </div>
        );
        break;
      case "contact":
      case "social":
        output = (
          <div className="space-y-1.5">
            {socialLinks.map((link) => (
              <div key={link.platform} className="flex items-center gap-2 text-xs">
                <ExternalLink size={11} className="text-text-muted/50" />
                <span className="text-white w-20">{link.platform.toLowerCase()}:</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-accent transition-colors underline"
                >
                  {link.url.replace("https://", "").replace("mailto:", "")}
                </a>
              </div>
            ))}
          </div>
        );
        break;
      case "resume":
        output = (
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">Opening resume:</span>
            <a
              href="/DakshJain_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline flex items-center gap-1 font-semibold"
            >
              DakshJain_Resume.pdf
              <ExternalLink size={11} />
            </a>
          </div>
        );
        // Automatically open in new tab
        if (typeof window !== "undefined") {
          window.open("/DakshJain_Resume.pdf", "_blank");
        }
        break;
      case "neoclaw":
        output = (
          <div className="space-y-1 font-mono text-accent text-xs">
            <p className="font-bold text-white">[neoclaw: pulse_cycle_active]</p>
            <p>&gt; initializing message bridges (telegram, whatsapp)</p>
            <p>&gt; connecting orchestrator main_loop</p>
            <p>&gt; manager_agent &gt; researching_docs &gt; code_synthesis &gt; test_execution &gt; commit_changes</p>
            <p>&gt; [status: successful_loop_resolved]</p>
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
          <span className="text-text-muted">
            Command not found: &quot;{trimmed}&quot;. Type <span className="text-white underline cursor-pointer" onClick={() => handleCommand("help")}>help</span> for directives.
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
    } else if (e.key === "Escape") {
      // Escape to exit/deactivate terminal prompt focus
      e.preventDefault();
      setIsActive(false);
      inputRef.current?.blur();
    }
  };

  const handleTerminalClick = () => {
    setIsActive(true);
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 10);
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background border-t border-hairline" id="terminal">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-[10px] font-mono tracking-widest text-accent uppercase">
            shell_interface
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mt-2">
            Interactive <span className="text-accent">Console</span>
          </h2>
          <p className="text-text-muted text-sm mt-3 font-sans font-light">
            Query the systems directory. Type <span className="text-white font-mono bg-surface px-1.5 py-0.5 rounded border border-hairline">help</span> or press <span className="text-white font-mono bg-surface px-1.5 py-0.5 rounded border border-hairline text-[10px]">ESC</span> to close focus.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="glass-card rounded-xl overflow-hidden border border-hairline shadow-lg bg-surface/30 cursor-text"
          onClick={handleTerminalClick}
        >
          {/* Top Header bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-surface-2 border-b border-hairline select-none">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
            <span className="ml-4 text-[10px] text-text-muted font-mono uppercase tracking-wider">
              daksh@orchestration-server:~ {isActive ? "%" : "~ [paused]"}
            </span>
          </div>

          {/* Terminal input/output log body */}
          <div
            ref={terminalRef}
            className="p-6 font-mono text-xs md:text-sm min-h-[300px] max-h-[400px] overflow-y-auto bg-surface/40 text-text-primary leading-relaxed"
          >
            {phase === "typing" ? (
              <>
                {displayedCommands.map((cmd, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4"
                  >
                    <div className="flex items-center gap-2 text-text-muted">
                      <span className="text-accent">&gt;</span>
                      <span className="text-text-muted">$</span>
                      <span className="text-text-primary">{cmd.command}</span>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="ml-5 text-text-muted mt-1"
                    >
                      {cmd.output}
                    </motion.div>
                  </motion.div>
                ))}

                {/* Currently animated loading line */}
                {animIndex < initialCommands.length && (
                  <div className="flex items-center gap-2 text-text-muted">
                    <span className="text-accent">&gt;</span>
                    <span className="text-text-muted">$</span>
                    <span className="text-text-primary">{currentText}</span>
                    <span className="text-accent animate-pulse">▋</span>
                  </div>
                )}
              </>
            ) : (
              <>
                {displayedCommands.length === 0 && (
                  <div className="mb-4 text-text-muted text-xs leading-relaxed font-light select-none">
                    <p className="text-white font-medium mb-1 uppercase tracking-wider">[telemetry_terminal_session_open]</p>
                    <p>
                      Type <span className="text-accent hover:underline cursor-pointer" onClick={() => handleCommand("help")}>help</span> to list query hooks, or write queries naturally.
                    </p>
                  </div>
                )}

                {displayedCommands.map((cmd, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex items-center gap-2 text-text-muted">
                      <span className="text-accent">&gt;</span>
                      <span className="text-text-muted">$</span>
                      <span className="text-text-primary">{cmd.command}</span>
                    </div>
                    <div className="ml-5 text-text-muted mt-1 leading-relaxed">{cmd.output}</div>
                  </div>
                ))}

                {/* Input line */}
                {isActive ? (
                  <div className="flex items-center gap-2 text-text-muted">
                    <span className="text-accent">&gt;</span>
                    <span className="text-text-muted">$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent border-none outline-none text-text-primary focus:ring-0 caret-accent font-mono text-xs md:text-sm p-0"
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="describe_query..."
                    />
                  </div>
                ) : (
                  <div className="text-[10px] text-text-muted/40 font-mono select-none uppercase tracking-wider py-1 border-t border-hairline/60">
                    [session_inactive: click_inside_or_press_enter_to_resume_focus]
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
