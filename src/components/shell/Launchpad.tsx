"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MagnifyingGlass, X } from "@phosphor-icons/react/dist/ssr"
import { useOS } from "@/os/store"
import { projectAppOrder, projectIdOf, type ProjectAppId } from "@/data/apps"
import { projects, thumbOf } from "@/data/projects"
import { useReducedMotion } from "@/os/ReducedMotionContext"

/**
 * The grid, split out from the overlay so it mounts and unmounts with the
 * overlay itself.
 *
 * That is not cosmetic: keeping `query` up in Launchpad meant the search
 * text survived a close, and clearing it took a `setQuery` inside an
 * effect - the cascading-render pattern the lint rule exists to stop.
 * Owning the state one level down resets it for free, the way React
 * intends.
 */
function LaunchpadGrid({ onLaunch }: { onLaunch: (id: ProjectAppId) => void }) {
  const [query, setQuery] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    // Real Launchpad puts the caret in the search field on open, and a
    // visitor's first instinct in front of a grid is to type.
    searchRef.current?.focus()
  }, [])

  const q = query.trim().toLowerCase()
  const visible: ProjectAppId[] = q
    ? projectAppOrder.filter((id) => {
        const p = projects.find((x) => x.id === projectIdOf(id))
        if (!p) return false
        return (
          p.title.toLowerCase().includes(q) ||
          p.outcome.toLowerCase().includes(q) ||
          p.tech.some((t) => t.toLowerCase().includes(q))
        )
      })
    : projectAppOrder

  return (
    <div className="pointer-events-none relative flex h-full flex-col items-center justify-center gap-8 px-10 pt-10 pb-24">
      {/*
        The ring is on the pill, not on the <input>.
        globals.css carries a global `:focus-visible { outline: 2px solid
        var(--os-accent) }`, which a Tailwind `focus:outline-none` does not
        beat - it targets :focus, and the global rule wins for :focus-visible
        regardless. The result was an accent-coloured rectangle drawn *inside*
        the rounded pill, which read as a rendering bug rather than as focus.
        Suppressing it on the input and lifting it to the wrapper keeps the
        indicator (it is the same 2px accent ring) and puts it on the shape
        the user actually sees.
      */}
      <div
        className="os-plate pointer-events-auto flex w-[min(440px,70vw)] items-center gap-3 rounded-(--r-pill) px-4 py-2.5 transition-[box-shadow] duration-(--dur-fast) has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-(--os-accent)"
        style={{ boxShadow: "0 8px 28px -10px rgb(0 0 0 / .55)" }}
      >
        <MagnifyingGlass size={17} weight="regular" className="shrink-0 text-text-2" />
        <label htmlFor="launchpad-search" className="sr-only">
          Search projects
        </label>
        <input
          id="launchpad-search"
          ref={searchRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects"
          autoComplete="off"
          spellCheck={false}
          className="focus-ring-on-wrapper w-full bg-transparent text-[15px] leading-6 text-text placeholder:text-text-2"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="os-press flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-panel-3 text-text-2 hover:text-text"
          >
            <X size={11} weight="bold" />
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="pointer-events-auto text-sm text-wp-text" style={{ textShadow: "var(--wp-label-shadow)" }}>
          Nothing matches &ldquo;{query}&rdquo;.
        </p>
      ) : (
        /*
          Landscape cards, not square tiles.

          Every project shot is 16:10 or wider; a square tile has to throw a
          third of that away, and three rounds of crop-tuning only ever moved
          which third. Drawing each project at its own aspect ratio is the
          only version where nothing is cut - and at ~290px wide the UI in
          the shot is genuinely readable rather than merely recognisable.

          `object-contain` over a near-black stage rather than `object-cover`:
          the two terminal captures are wider than 16:10, and cover would
          start clipping them again at the sides. They letterbox against a
          backdrop close to their own chrome, so the bars do not read as bars.

          Five across, so all ten fit two rows on a 900px-tall screen without
          scrolling - at four columns the last row sat under the Dock, which
          reads as "cut off" no matter that it scrolls. The column centres as
          a whole and the grid scrolls only once it outgrows the screen, so an
          eleventh project degrades gracefully instead of hiding.

          Title only, no outcome line: at 230px a one-line summary truncates
          to about thirty characters, which is noise rather than information.
          It is on the aria-label, and it is the header of the window one
          click away.
        */
        <div className="pointer-events-auto max-h-full min-h-0 w-full overflow-y-auto">
          <ul className="mx-auto grid max-w-[1300px] grid-cols-2 gap-x-6 gap-y-7 py-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((id, i) => {
              const project = projects.find((p) => p.id === projectIdOf(id))
              if (!project) return null
              return (
                <motion.li
                  key={id}
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: reducedMotion ? "tween" : "spring",
                    stiffness: 320,
                    damping: 26,
                    delay: reducedMotion ? 0 : Math.min(i, 12) * 0.025,
                  }}
                >
                  <motion.button
                    type="button"
                    onClick={() => onLaunch(id)}
                    className="group block w-full text-left focus-visible:outline-offset-4"
                    aria-label={`Open ${project.title} — ${project.outcome}`}
                    whileHover={reducedMotion ? undefined : { y: -4 }}
                    whileTap={reducedMotion ? undefined : { scale: 0.985 }}
                    transition={{ type: "spring", stiffness: 400, damping: 26 }}
                  >
                    <div
                      className="relative aspect-[16/10] w-full overflow-hidden rounded-(--r-card) bg-[rgb(10_10_12)] transition-shadow duration-(--dur-fast)"
                      style={{ boxShadow: "0 10px 30px -12px rgb(0 0 0 / .75), inset 0 0 0 .5px rgb(255 255 255 / .16)" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbOf(project.image)}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <p
                      className="mt-2.5 truncate text-center text-[12.5px] font-medium leading-tight text-wp-text"
                      style={{ textShadow: "var(--wp-label-shadow)" }}
                    >
                      {project.title}
                    </p>
                  </motion.button>
                </motion.li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

/**
 * Every project, as an app icon.
 *
 * This exists because the Dock could not absorb them. Ten more tiles next
 * to the eight that orient a visitor buries both sets, and macOS already
 * has the answer for apps that are not pinned: Launchpad. It also scales -
 * the eleventh project costs a grid cell here and nothing anywhere else.
 *
 * The cards are the real screenshots, uncropped, so the grid is a readable
 * contact sheet of the work before a single window is opened. Clicking one
 * opens that project's own window, which is where the full-resolution
 * captures live.
 *
 * Modelled on MissionControl.tsx: same transient `mode` value, same
 * backdrop-as-a-button dismissal, same Escape handling and focus restore.
 */
export function Launchpad() {
  const mode = useOS((s) => s.mode)
  const setMode = useOS((s) => s.setMode)
  const open = useOS((s) => s.open)
  const reducedMotion = useReducedMotion()
  const active = mode === "launchpad"
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    previouslyFocused.current = document.activeElement as HTMLElement
    return () => previouslyFocused.current?.focus()
  }, [active])

  const launch = (id: ProjectAppId) => {
    setMode("desktop")
    open(id)
  }

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Launchpad"
          className="fixed inset-0 z-[1200]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.2 }}
        >
          <button
            aria-label="Close Launchpad"
            onClick={() => setMode("desktop")}
            className="absolute inset-0 h-full w-full"
            // A theme-aware tint, not `brightness()`. The filter darkened the
            // wallpaper in both themes while the labels on top kept following
            // the theme, so Light rendered near-black text on a dark surface -
            // 2.74:1, measured by tools/e2e/contrast.mjs. `--os-scrim` flips
            // with the theme, and being a colour rather than a filter it also
            // makes the result independent of which wallpaper is loaded.
            style={{ background: "var(--os-scrim)", backdropFilter: "blur(28px) saturate(140%)" }}
          />
          <LaunchpadGrid onLaunch={launch} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
