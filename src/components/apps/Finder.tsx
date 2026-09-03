"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowsOutSimple, Eye, MagnifyingGlass, Star } from "@phosphor-icons/react/dist/ssr"
import { fetchGithub, repoSlug, starsByRepo, type GithubResult } from "@/lib/github"
import { fetchPypi, packageFor, type PypiResult } from "@/lib/pypi"
import { projects, thumbOf, type Project, type ProjectTag } from "@/data/projects"
import type { ProjectAppId } from "@/data/apps"
import { useOS } from "@/os/store"
import { EmptyState } from "@/components/primitives/EmptyState"
import { Sidebar } from "@/components/primitives/Sidebar"
import { FinderProjectDetail } from "./FinderProjectDetail"
import { FinderQuickLook } from "./FinderQuickLook"
import { useFinderIntent } from "@/os/finderIntent"
import { useReducedMotion } from "@/os/ReducedMotionContext"

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
  // Cross-app deep link: System Settings writes a project id here before
  // calling open("finder"), which is what mounts Finder in the first place
  // when it was not already open - so the initial value is read straight
  // into these lazy initializers rather than pushed in through an effect.
  const [source, setSource] = useState<Source["id"]>("all")
  const [query, setQuery] = useState(() => {
    const id = useFinderIntent.getState().projectId
    return id ? (projects.find((p) => p.id === id)?.title ?? "") : ""
  })
  const [selectedId, setSelectedId] = useState(() => {
    const id = useFinderIntent.getState().projectId
    return id && projects.some((p) => p.id === id) ? id : projects[0].id
  })
  const reducedMotion = useReducedMotion()
  // Opening a project's own app from here rather than duplicating the
  // gallery inside Finder: Quick Look is the peek, the app is the read.
  const openApp = useOS((s) => s.open)

  // Clears the id consumed above, then keeps listening for a later one
  // written while Finder is already mounted and open - subscribed rather
  // than read-and-effect'd so those setState calls happen inside the
  // external store's own change callback, not synchronously in the effect
  // body.
  useEffect(() => {
    if (useFinderIntent.getState().projectId) useFinderIntent.getState().setProjectId(null)
    return useFinderIntent.subscribe((state) => {
      if (!state.projectId) return
      const match = projects.find((p) => p.id === state.projectId)
      if (match) {
        setSource("all")
        setQuery(match.title)
        setSelectedId(match.id)
      }
      useFinderIntent.getState().setProjectId(null)
    })
  }, [])

  // Live star counts. The one claim on this page a reader can verify
  // without trusting me, so it is worth a request. Renders nothing at all
  // when the token is unset or GitHub is down - a project with no badge
  // just looks like a project, where a wrong number looks like a lie.
  const [gh, setGh] = useState<GithubResult | null>(null)
  useEffect(() => {
    let alive = true
    fetchGithub().then((d) => alive && setGh(d))
    return () => {
      alive = false
    }
  }, [])
  const stars = useMemo(() => starsByRepo(gh), [gh])

  // Live PyPI figures. Unlike GitHub this needs no token, so it works out
  // of the box - see the comment in app/api/pypi/route.ts for why these are
  // fetched rather than written into the data file.
  const [pypi, setPypi] = useState<PypiResult | null>(null)
  useEffect(() => {
    let alive = true
    fetchPypi().then((d) => alive && setPypi(d))
    return () => {
      alive = false
    }
  }, [])
  const starsFor = (github?: string) => {
    const n = stars.get(repoSlug(github) ?? "")
    return n && n > 0 ? n : null
  }

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

  // Quick Look: macOS's actual answer to "make selecting something feel
  // alive". Double-click, Enter, or Space zooms the row into a large
  // floating card, genie-style, from wherever it sat in the list. Unlike
  // the side pane below, this works identically at every window width,
  // including inside the mobile sheet.
  const containerRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const lastTriggerRef = useRef<HTMLDivElement | null>(null)
  const [quickLook, setQuickLook] = useState<{ project: Project; origin: string } | null>(null)

  function openQuickLook(p: Project, rowEl: HTMLDivElement | null) {
    let origin = "50% 50%"
    if (rowEl && containerRef.current) {
      const c = containerRef.current.getBoundingClientRect()
      const r = rowEl.getBoundingClientRect()
      origin = `${((r.left + r.width / 2 - c.left) / c.width) * 100}% ${((r.top + r.height / 2 - c.top) / c.height) * 100}%`
    }
    lastTriggerRef.current = rowEl
    setQuickLook({ project: p, origin })
  }

  function closeQuickLook() {
    setQuickLook(null)
    lastTriggerRef.current?.focus()
  }

  function handleRowKeyDown(e: React.KeyboardEvent<HTMLDivElement>, p: Project) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      // stopPropagation matters here: useKeyboardShortcuts.ts's global
      // window-level listener treats any arrow key as "nudge the focused
      // window" whenever a window is focused and the target isn't a text
      // input - without this, moving list selection also drags the whole
      // Finder window a few px per keystroke.
      e.preventDefault()
      e.stopPropagation()
      const idx = filtered.findIndex((x) => x.id === p.id)
      const nextIdx = e.key === "ArrowDown" ? Math.min(idx + 1, filtered.length - 1) : Math.max(idx - 1, 0)
      const next = filtered[nextIdx]
      if (next) {
        setSelectedId(next.id)
        rowRefs.current[next.id]?.focus()
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      e.stopPropagation()
      setSelectedId(p.id)
      openQuickLook(p, e.currentTarget)
    }
  }

  return (
    <div ref={containerRef} className="relative flex h-full gap-(--r-inset) @container">
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
            // Selection is carried by the fill, not by dimming the label.
            // macOS sidebars keep every row at full text strength, and
            // --os-text-2 over the clear tier measured 3.29:1 against the
            // composited background, under the 4.5:1 floor.
            className="flex w-full items-center justify-between rounded-(--r-control) px-2 py-1.5 text-left text-xs text-text"
            style={{ background: source === s.id ? "var(--os-accent-soft)" : "transparent" }}
          >
            <span>{s.label}</span>
            <span className="text-text-2">{counts[s.id]}</span>
          </button>
        ))}
      </Sidebar>

      <div className="os-plate flex min-w-0 flex-1 flex-col overflow-hidden rounded-(--r-float)">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-divider px-3">
          <MagnifyingGlass size={13} className="text-text-2" weight="light" />
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
                className="os-press rounded-(--r-pill) bg-panel-3 px-3 py-1.5 text-xs text-text"
              >
                Clear
              </button>
            }
          />
        ) : (
          <motion.ul role="listbox" aria-label="Projects" className="flex-1 overflow-auto p-1">
            {filtered.map((p) => (
              <li key={p.id}>
                {/* A `div`, not a `button`: it hosts a real nested button
                    below (Quick Look can't otherwise be its own focusable,
                    clickable target - buttons can't nest), and the ARIA
                    listbox pattern expects role="option" on a plain element
                    anyway rather than overriding a button's implicit role. */}
                <div
                  ref={(el) => {
                    rowRefs.current[p.id] = el
                  }}
                  role="option"
                  aria-selected={selected?.id === p.id}
                  tabIndex={selected?.id === p.id ? 0 : -1}
                  onClick={() => setSelectedId(p.id)}
                  onDoubleClick={(e) => openQuickLook(p, e.currentTarget)}
                  onKeyDown={(e) => handleRowKeyDown(e, p)}
                  className="flex w-full cursor-default items-center gap-3 rounded-(--r-control) px-2 py-1.5 text-left"
                  style={{ background: selected?.id === p.id ? "var(--os-accent-soft)" : "transparent" }}
                >
                  {/* 16:10, not a 32px square: cropping a screenshot to a
                      square throws away a third of it, and at this size the
                      thumbnail's only job is to be recognisable as that app. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbOf(p.image)}
                    alt={`${p.title} screenshot`}
                    loading="lazy"
                    className="h-[26px] w-[42px] shrink-0 rounded-[4px] bg-[rgb(10_10_12)] object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-text">{p.title}</p>
                    <p className="truncate text-[11px] text-text-2">{p.outcome}</p>
                  </div>
                  {starsFor(p.github) ? (
                    <span className="flex shrink-0 items-center gap-1 text-[10px] text-text-2">
                      <Star size={10} weight="fill" className="text-[var(--sys-yellow)]" />
                      {starsFor(p.github)}
                    </span>
                  ) : (
                    <span className="shrink-0 text-[10px] text-text-2">{p.tech.length} tech</span>
                  )}
                  {/* The explicit, discoverable way in: double-click and
                      Enter/Space still work, but neither is obvious from
                      looking at the row. A visible button is.
                      tabIndex={-1} keeps it out of the roving-tabindex tab
                      stop count - Enter on the row (already focused) does
                      the identical thing for keyboard users. */}
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={`Open ${p.title} screenshots`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedId(p.id)
                      openApp(`project.${p.id}` as ProjectAppId)
                    }}
                    className="os-press flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-panel-3 text-text-2 hover:text-text"
                  >
                    <ArrowsOutSimple size={12} weight="bold" />
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={`Quick look ${p.title}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedId(p.id)
                      openQuickLook(p, rowRefs.current[p.id] ?? null)
                    }}
                    className="os-press flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-panel-3 text-text-2 hover:text-text"
                  >
                    <Eye size={12} weight="bold" />
                  </button>
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </div>

      {selected && (
        <Sidebar as="aside" live ariaLabel="Project details" width={280} className="hidden p-4 @[720px]:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.14 }}
            >
              <FinderProjectDetail
                project={selected}
                stars={starsFor(selected.github)}
                pypiPkg={packageFor(pypi, selected.pypi)}
              />
            </motion.div>
          </AnimatePresence>
        </Sidebar>
      )}

      <AnimatePresence>
        {quickLook && (
          <FinderQuickLook
            project={quickLook.project}
            origin={quickLook.origin}
            stars={starsFor(quickLook.project.github)}
            pypiPkg={packageFor(pypi, quickLook.project.pypi)}
            onClose={closeQuickLook}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
