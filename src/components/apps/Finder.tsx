"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { GithubLogo, ArrowSquareOut, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"
import { projects, type ProjectTag } from "@/data/projects"
import { Chip } from "@/components/primitives/Chip"
import { EmptyState } from "@/components/primitives/EmptyState"
import { Sidebar } from "@/components/primitives/Sidebar"

type Source = { id: "all" | ProjectTag; label: string }
const SOURCES: Source[] = [
  { id: "all", label: "All Projects" },
  { id: "ai", label: "AI Systems" },
  { id: "web", label: "Web" },
  { id: "neo", label: "Built with NEO" },
]

function norm(s: string) {
  return s.toLowerCase().replace(/[\s.\-_]/g, "")
}

export function Finder() {
  const [source, setSource] = useState<Source["id"]>("all")
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState(projects[0].id)

  const bySource = useMemo(
    () => (source === "all" ? projects : projects.filter((p) => p.tags.includes(source))),
    [source]
  )

  const filtered = useMemo(() => {
    if (!query.trim()) return bySource
    const q = norm(query)
    return bySource.filter(
      (p) =>
        norm(p.title).includes(q) ||
        norm(p.description).includes(q) ||
        p.tech.some((t) => norm(t).includes(q))
    )
  }, [bySource, query])

  const selected = filtered.find((p) => p.id === selectedId) ?? filtered[0]

  const counts = {
    all: projects.length,
    ai: projects.filter((p) => p.tags.includes("ai")).length,
    web: projects.filter((p) => p.tags.includes("web")).length,
    neo: projects.filter((p) => p.tags.includes("neo")).length,
  }

  return (
    <div className="flex h-full gap-(--r-inset) @container">
      {/* @container query, not a viewport media query: this window can be
          resized narrower than 560/720px while the browser stays wide,
          and a viewport-based breakpoint would miss that entirely.
          See plan/07-app-finder.md and plan/18-preflight.md section D. */}
      <Sidebar
        ariaLabel="Project categories"
        width={176}
        className="hidden @[560px]:block"
      >
        <h3 className="px-2 pb-1 pt-1 text-[10px] font-medium uppercase tracking-wide text-text-2">Favorites</h3>
        {SOURCES.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={source === s.id}
            onClick={() => setSource(s.id)}
            className="flex w-full items-center justify-between rounded-(--r-control) px-2 py-1.5 text-left text-xs"
            style={{
              background: source === s.id ? "var(--os-accent-soft)" : "transparent",
              color: source === s.id ? "var(--os-text)" : "var(--os-text-2)",
            }}
          >
            <span>{s.label}</span>
            <span className="text-text-3">{counts[s.id]}</span>
          </button>
        ))}
      </Sidebar>

      <div className="os-plate flex min-w-0 flex-1 flex-col overflow-hidden rounded-(--r-float)">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-divider px-3">
          <MagnifyingGlass size={13} className="text-text-3" weight="light" />
          <label htmlFor="finder-search" className="sr-only">
            Search projects
          </label>
          <input
            id="finder-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-xs text-text placeholder:text-text-2 focus:outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={MagnifyingGlass}
            title="No matching projects"
            body={`Nothing matches "${query}".`}
            actions={
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded-(--r-control) bg-panel-3 px-3 py-1.5 text-xs text-text"
              >
                Clear
              </button>
            }
          />
        ) : (
          <motion.ul role="listbox" aria-label="Projects" className="flex-1 overflow-auto p-1">
            {filtered.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected?.id === p.id}
                  onClick={() => setSelectedId(p.id)}
                  onDoubleClick={() => window.open(p.live ?? p.github, "_blank", "noopener,noreferrer")}
                  className="flex w-full items-center gap-3 rounded-(--r-control) px-2 py-1.5 text-left"
                  style={{ background: selected?.id === p.id ? "var(--os-accent-soft)" : "transparent" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={`${p.title} screenshot`} className="h-8 w-8 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-text">{p.title}</p>
                    <p className="truncate text-[11px] text-text-2">{p.outcome}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-text-3">{p.tech.length} tech</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </div>

      {selected && (
        <Sidebar as="aside" live ariaLabel="Project details" width={280} className="hidden p-4 @[720px]:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selected.image} alt={`${selected.title} screenshot`} className="mb-3 w-full rounded-(--r-card) object-cover" />
          <h3 className="mb-1 text-sm font-medium text-text">{selected.title}</h3>
          <p className="mb-3 max-w-[46ch] text-xs text-text-2">{selected.description}</p>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {selected.tech.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {selected.github && (
              <a
                href={selected.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${selected.title} source on GitHub, opens in a new tab`}
                className="flex items-center gap-1.5 rounded-(--r-control) bg-panel-3 px-2.5 py-1.5 text-xs text-text"
              >
                <GithubLogo size={13} weight="light" />
                Source
              </a>
            )}
            {selected.live && (
              <a
                href={selected.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${selected.title} live demo, opens in a new tab`}
                className="flex items-center gap-1.5 rounded-(--r-control) bg-accent-soft px-2.5 py-1.5 text-xs text-accent"
              >
                <ArrowSquareOut size={13} weight="light" />
                Live
              </a>
            )}
          </div>
          <dl className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <dt className="text-text-2">Kind</dt>
              <dd className="text-text-2">{selected.tags.includes("ai") ? "AI System" : "Web App"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-2">Tech</dt>
              <dd className="text-text-2">{selected.tech.length} technologies</dd>
            </div>
          </dl>
        </Sidebar>
      )}
    </div>
  )
}
