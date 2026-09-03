"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowsOut, CaretLeft, CaretRight, X } from "@phosphor-icons/react/dist/ssr"
import { fetchGithub, repoSlug, starsByRepo, type GithubResult } from "@/lib/github"
import { fetchPypi, packageFor, type PypiResult } from "@/lib/pypi"
import { projects, thumbOf } from "@/data/projects"
import { isProjectApp, projectIdOf, type AppId } from "@/data/apps"
import { Sidebar } from "@/components/primitives/Sidebar"
import { useReducedMotion } from "@/os/ReducedMotionContext"
import { FinderProjectDetail } from "./FinderProjectDetail"

/**
 * One project, opened as its own app.
 *
 * Finder answers "what has he built"; this answers "show me". It is the
 * window behind every Launchpad tile, and its whole job is to put the real
 * screenshots on screen at a size where they can actually be read - which
 * the 8px Finder row thumbnail and the 280px side pane cannot.
 *
 * Every image here was captured by tools/shots against the project running
 * locally. The caption under each one says what the reader is looking at,
 * because an uncaptioned screenshot makes the reader guess which part is
 * the claim.
 */
export function ProjectApp({ windowId }: { windowId: AppId }) {
  const project = useMemo(() => {
    if (!isProjectApp(windowId)) return null
    const id = projectIdOf(windowId)
    return projects.find((p) => p.id === id) ?? null
  }, [windowId])

  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const zoomCloseRef = useRef<HTMLButtonElement>(null)
  const heroRef = useRef<HTMLButtonElement>(null)

  // Same two live figures Finder shows, fetched the same way. A project
  // window opened straight from Launchpad never goes through Finder, so it
  // cannot inherit them - and a star count that appears in one place and
  // not the other reads as a bug.
  const [gh, setGh] = useState<GithubResult | null>(null)
  const [pypi, setPypi] = useState<PypiResult | null>(null)
  useEffect(() => {
    let alive = true
    fetchGithub().then((d) => alive && setGh(d))
    fetchPypi().then((d) => alive && setPypi(d))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (zoomed) zoomCloseRef.current?.focus()
  }, [zoomed])

  if (!project) return null

  const shots = project.shots
  const shot = shots[Math.min(index, shots.length - 1)]
  const stars = starsByRepo(gh).get(repoSlug(project.github) ?? "") ?? null

  const step = (delta: number) => setIndex((i) => (i + delta + shots.length) % shots.length)

  // Arrow keys are handled here rather than on the window, and the event is
  // stopped: useKeyboardShortcuts.ts reads an unhandled arrow as "nudge the
  // focused window", so without this, paging the gallery also walks the
  // window across the desktop - the same trap Finder's row handler
  // documents.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      if (shots.length < 2) return
      e.preventDefault()
      e.stopPropagation()
      step(e.key === "ArrowRight" ? 1 : -1)
    } else if (e.key === "Escape" && zoomed) {
      e.stopPropagation()
      setZoomed(false)
      heroRef.current?.focus()
    }
  }

  return (
    <div className="relative flex h-full gap-(--r-inset) @container" onKeyDown={onKeyDown}>
      <div className="os-plate flex min-w-0 flex-1 flex-col overflow-hidden rounded-(--r-float)">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-divider px-3">
          <p className="truncate text-xs text-text-2">{project.outcome}</p>
          {shots.length > 1 && (
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label="Previous screenshot"
                onClick={() => step(-1)}
                className="os-press flex h-6 w-6 items-center justify-center rounded-full bg-panel-3 text-text-2 hover:text-text"
              >
                <CaretLeft size={12} weight="bold" />
              </button>
              <span className="tabular-nums px-1 text-[11px] text-text-2">
                {index + 1}/{shots.length}
              </span>
              <button
                type="button"
                aria-label="Next screenshot"
                onClick={() => step(1)}
                className="os-press flex h-6 w-6 items-center justify-center rounded-full bg-panel-3 text-text-2 hover:text-text"
              >
                <CaretRight size={12} weight="bold" />
              </button>
            </div>
          )}
        </div>

        {/* The stage is deliberately darker than the window: a light
            screenshot (LLM Judge, AutoCareer) needs something to sit
            against or it bleeds into the panel and stops reading as a
            captured screen. */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[rgb(0_0_0_/_.28)] p-3">
          <AnimatePresence mode="wait">
            <motion.button
              key={shot.src}
              ref={heroRef}
              type="button"
              onClick={() => setZoomed(true)}
              aria-label={`View ${project.title} screenshot full size`}
              className="group relative flex max-h-full max-w-full cursor-zoom-in items-center justify-center"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.16 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.src}
                alt={`${project.title}: ${shot.caption}`}
                className="max-h-full max-w-full rounded-(--r-card) object-contain shadow-[var(--shadow-focused)]"
              />
              <span className="os-plate pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded-(--r-pill) px-2 py-1 text-[10px] text-text opacity-0 transition-opacity duration-(--dur-fast) group-hover:opacity-100 group-focus-visible:opacity-100">
                <ArrowsOut size={11} weight="bold" />
                Full size
              </span>
            </motion.button>
          </AnimatePresence>
        </div>

        <p className="shrink-0 border-t border-divider px-3 py-2 text-[11px] leading-relaxed text-text-2">
          {shot.caption}
        </p>

        {/* Scrolls horizontally: five thumbnails fit a default window, but the
            window resizes and some projects will grow past five. */}
        {shots.length > 1 && (
          <ul className="flex shrink-0 gap-2 overflow-x-auto border-t border-divider p-2">
            {shots.map((s, i) => (
              <li key={s.src}>
                <button
                  type="button"
                  aria-label={`Show screenshot ${i + 1}: ${s.caption}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className="block overflow-hidden rounded-(--r-control) transition-[box-shadow] duration-(--dur-fast)"
                  style={{
                    boxShadow: i === index ? "0 0 0 2px var(--os-accent)" : "0 0 0 1px var(--os-divider)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbOf(s.src)}
                    alt=""
                    loading="lazy"
                    className="h-11 w-[70px] bg-[rgb(10_10_12)] object-contain"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Sidebar as="aside" ariaLabel={`${project.title} details`} width={272} className="hidden p-4 @[760px]:block">
        <FinderProjectDetail
          project={project}
          stars={stars && stars > 0 ? stars : null}
          pypiPkg={packageFor(pypi, project.pypi)}
          showHero={false}
        />
      </Sidebar>

      <AnimatePresence>
        {zoomed && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            onClick={() => setZoomed(false)}
          >
            <div aria-hidden className="absolute inset-0" style={{ background: "rgb(11 11 14 / 0.82)" }} />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${project.title} screenshot, full size`}
              className="relative flex max-h-full max-w-full flex-col items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* The zoomed view scrolls rather than shrinking further: at
                  this point the reader has asked to read the pixels, and a
                  1440-wide capture fitted into a 700px window is exactly
                  what they were trying to escape. */}
              <div className="max-h-full overflow-auto rounded-(--r-card)">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shot.src} alt={`${project.title}: ${shot.caption}`} className="max-w-none" width={1440} />
              </div>
              <button
                ref={zoomCloseRef}
                type="button"
                onClick={() => setZoomed(false)}
                aria-label="Close full size screenshot"
                className="os-press os-plate flex items-center gap-1.5 rounded-(--r-pill) px-3 py-1.5 text-xs text-text"
              >
                <X size={12} weight="bold" />
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
