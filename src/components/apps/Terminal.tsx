"use client"

import { useEffect, useRef, useState } from "react"
import { profile } from "@/data/profile"
import { projects, ingestSnippet } from "@/data/projects"
import { experience } from "@/data/experience"
import { skills } from "@/data/skills"
import { socials } from "@/data/socials"
import { useOS } from "@/os/store"
import type { AppId } from "@/data/apps"

type Line = { kind: "input" | "output"; text: string; links?: { text: string; href: string }[] }

const INTRO: Line[] = [
  { kind: "input", text: "whoami" },
  {
    kind: "output",
    text: `${profile.name} - ${profile.role} @ NEO\nBuilding agent orchestration, MCP tooling, and RAG pipelines.\n\ntype 'help' for commands`,
  },
]

function help() {
  return [
    "help          list commands",
    "whoami        who I am",
    "ls            top-level listing",
    "ls projects   the 7 projects",
    "cat ingest.py print the DocuMind RAG snippet",
    "skills        capability groups",
    "experience    work history",
    "contact       email, linkedin, github",
    "resume        open the resume",
    "open <app>    open a window (e.g. open finder)",
    "neoclaw       ?",
    "clear         clear the screen",
  ].join("\n")
}

const APP_ALIASES: Record<string, AppId> = {
  finder: "finder",
  projects: "finder",
  about: "about",
  notes: "notes",
  experience: "notes",
  settings: "settings",
  skills: "settings",
  activity: "activity",
  mail: "mail",
  contact: "mail",
  preview: "preview",
  resume: "preview",
  terminal: "terminal",
}

/** Fuzzy resolver: scores each candidate by keyword overlap with the input,
 *  highest score wins, minimum score 1 to match at all. See
 *  plan/08-app-terminal.md. */
const KEYWORD_MAP: { keywords: string[]; command: string }[] = [
  { keywords: ["hi", "hello", "hey", "yo"], command: "__greeting" },
  { keywords: ["about", "daksh", "who", "bio"], command: "whoami" },
  { keywords: ["project", "built", "made", "work", "portfolio"], command: "projects" },
  { keywords: ["skill", "stack", "tech", "language"], command: "skills" },
  { keywords: ["experience", "job", "role", "career"], command: "experience" },
  { keywords: ["contact", "reach", "email", "phone", "social", "linkedin", "github"], command: "contact" },
  { keywords: ["resume", "pdf", "cv"], command: "resume" },
  { keywords: ["neoclaw", "agent", "pulse"], command: "neoclaw" },
  { keywords: ["help", "menu", "command"], command: "help" },
]

function fuzzyResolve(input: string): string | null {
  let best: { command: string; score: number } | null = null
  for (const entry of KEYWORD_MAP) {
    const score = entry.keywords.filter((k) => input.includes(k)).length
    if (score > 0 && (!best || score > best.score)) best = { command: entry.command, score }
  }
  return best?.command ?? null
}

export function Terminal() {
  const [buffer, setBuffer] = useState<Line[]>([])
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [introDone, setIntroDone] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const open = useOS((s) => s.open)

  useEffect(() => {
    // Session-scoped (sessionStorage, matching BootSequence's gate), not a
    // component ref: a real window close+reopen creates a brand new mount,
    // so a ref could never satisfy "does not replay on reopen within a
    // session" per plan/08-app-terminal.md regardless of Strict Mode. A
    // ref guard here previously also broke under React Strict Mode's dev
    // double-invoke (setup -> cleanup -> setup): the ref stayed true
    // across the second setup, so no interval ever started and the intro
    // never rendered at all outside production.
    if (sessionStorage.getItem("terminal-intro-played") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBuffer(INTRO)
      setIntroDone(true)
      return
    }
    sessionStorage.setItem("terminal-intro-played", "1")

    let i = 0
    const timer = setInterval(() => {
      // Read the line into a const BEFORE the updater closes over anything.
      //
      // This previously did `setBuffer((b) => [...b, INTRO[i]])` and then
      // `i++`. State updaters must be pure, and React is free to invoke one
      // more than once for a single update - when it did, the second
      // invocation ran after `i++` and appended `INTRO[2]`, i.e. undefined.
      // The next render then hit `line.kind` on undefined and took down the
      // entire tree: not just Terminal, but the Dock, menu bar and every
      // other window with it. Nothing catches it, because there is no error
      // boundary between an app and the shell.
      const next = INTRO[i]
      i++
      if (!next) {
        clearInterval(timer)
        setIntroDone(true)
        return
      }
      setBuffer((b) => [...b, next])
      if (i >= INTRO.length) {
        clearInterval(timer)
        setIntroDone(true)
      }
    }, 260)
    const skip = () => {
      clearInterval(timer)
      setBuffer(INTRO)
      setIntroDone(true)
    }
    window.addEventListener("keydown", skip, { once: true })
    return () => {
      clearInterval(timer)
      window.removeEventListener("keydown", skip)
    }
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
    if (atBottom) el.scrollTop = el.scrollHeight
  }, [buffer])

  const push = (lines: Line[]) => setBuffer((b) => [...b, ...lines].slice(-300))

  function run(raw: string) {
    const cmd = raw.trim()
    const lower = cmd.toLowerCase()
    push([{ kind: "input", text: cmd }])

    if (!cmd) return
    if (lower === "clear") {
      setBuffer([])
      return
    }
    if (lower === "help") return push([{ kind: "output", text: help() }])
    if (lower === "whoami")
      return push([
        {
          kind: "output",
          text: `${profile.name} - ${profile.role} @ NEO\nEngineering agent orchestration loops, custom MCP tools, and production-ready RAG interfaces.`,
        },
      ])
    if (lower === "ls")
      return push([{ kind: "output", text: "projects/  skills/  experience/  resume.pdf  contact.txt" }])
    if (lower === "ls projects")
      return push([{ kind: "output", text: projects.map((p) => p.id).join("  ") }])
    if (lower === "cat ingest.py") return push([{ kind: "output", text: ingestSnippet }])
    if (lower === "skills" || fuzzyResolve(lower) === "skills")
      return push([
        {
          kind: "output",
          text: skills.map((g) => `${g.label}: ${g.skills.map((s) => s.name).join(", ")}`).join("\n"),
        },
      ])
    if (lower === "experience" || fuzzyResolve(lower) === "experience")
      return push([
        {
          kind: "output",
          text: experience.map((r) => `${r.title} @ ${r.org}  ${r.start} to ${r.end}`).join("\n"),
        },
      ])
    if (lower === "projects" || fuzzyResolve(lower) === "projects")
      return push([{ kind: "output", text: projects.map((p) => `${p.id}  ${p.outcome}`).join("\n") }])
    if (lower === "contact" || fuzzyResolve(lower) === "contact")
      return push([
        {
          kind: "output",
          text: "email, linkedin, github",
          links: [
            { text: socials.email, href: `mailto:${socials.email}` },
            { text: "linkedin", href: socials.linkedin },
            { text: "github", href: socials.github },
          ],
        },
      ])
    if (lower === "resume" || fuzzyResolve(lower) === "resume") {
      open("preview")
      return push([{ kind: "output", text: "opening resume.pdf" }])
    }
    if (lower === "neoclaw" || fuzzyResolve(lower) === "neoclaw")
      return push([
        {
          kind: "output",
          text: "[neoclaw: pulse_cycle_active]\n> initializing message bridges (telegram, whatsapp)\n> connecting orchestrator main_loop\n> manager_agent > researching_docs > code_synthesis > test_execution > commit_changes\n> [status: successful_loop_resolved]",
        },
      ])
    if (lower.startsWith("open ")) {
      const target = lower.slice(5).trim()
      const appId = APP_ALIASES[target]
      if (appId) {
        open(appId)
        return push([{ kind: "output", text: `opening ${target}` }])
      }
    }

    const resolved = fuzzyResolve(lower)
    if (resolved === "__greeting") return push([{ kind: "output", text: "hello. type help to explore." }])
    if (resolved === "help") return push([{ kind: "output", text: help() }])

    push([{ kind: "output", text: `command not found: ${cmd}\ntry help` }])
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.trim()) {
        run(input)
        setHistory((h) => [...h, input])
      } else {
        push([{ kind: "input", text: "" }])
      }
      setHistoryIndex(-1)
      setInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length === 0) return
      const idx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(idx)
      setInput(history[idx])
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex === -1) return
      const idx = historyIndex + 1
      if (idx >= history.length) {
        setHistoryIndex(-1)
        setInput("")
      } else {
        setHistoryIndex(idx)
        setInput(history[idx])
      }
    } else if (e.key === "l" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setBuffer([])
    } else if (e.key === "Tab") {
      e.preventDefault()
      const names = ["help", "whoami", "ls", "skills", "experience", "contact", "resume", "clear"]
      const match = names.find((n) => n.startsWith(input.toLowerCase()))
      if (match) setInput(match)
    }
  }

  return (
    <div
      className="h-full overflow-auto rounded-(--r-float) p-3 font-mono text-[13px] leading-[1.55]"
      style={{ background: "#0E0E11" }}
      onClick={() => inputRef.current?.focus()}
      ref={scrollRef}
    >
      <output aria-live="polite" aria-atomic="false" className="block">
        {buffer.map((line, i) =>
          line.kind === "input" ? (
            <div key={i} className="flex gap-2 text-text-2">
              <span aria-hidden>daksh@neo ~ %</span>
              <span className="text-text">{line.text}</span>
            </div>
          ) : (
            <div key={i} className="mb-3 whitespace-pre-wrap text-text-2">
              {line.text}
              {line.links?.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="block text-link underline">
                  {l.text}
                </a>
              ))}
            </div>
          )
        )}
      </output>
      {introDone && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex gap-2"
        >
          <label htmlFor="terminal-input" className="sr-only">
            Terminal input
          </label>
          <span aria-hidden className="text-text-2">
            daksh@neo ~ %
          </span>
          <input
            id="terminal-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="off"
            className="flex-1 bg-transparent text-text caret-accent outline-none"
          />
        </form>
      )}
    </div>
  )
}
