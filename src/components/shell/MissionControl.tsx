"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useOS } from "@/os/store"
import { apps } from "@/data/apps"
import { appRegistry } from "@/components/apps/registry"
import { useReducedMotion } from "@/os/ReducedMotionContext"

/**
 * SCOPE NOTE vs plan/06-mission-control.md: the spec's most literal reading
 * scales the Desktop's actual mounted <Window> instances into a grid via
 * imperative MotionValue animation, so a card is bit-for-bit the same DOM
 * node as the real window. That requires threading an override-rect
 * concept through useWindowDrag/useWindowResize and is a substantial
 * addition on its own. This implementation renders the same registry app
 * components (same windowId, same live data/state source) inside
 * lightweight cards instead - genuinely live content, not a screenshot,
 * but a second mounted instance rather than the literal same node while
 * open. Documented here as a deliberate, scoped simplification.
 */
export function MissionControl() {
  const mode = useOS((s) => s.mode)
  const stack = useOS((s) => s.stack)
  const windows = useOS((s) => s.windows)
  const setMode = useOS((s) => s.setMode)
  const focus = useOS((s) => s.focus)
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const openIds = stack.filter((id) => windows[id]?.status !== "minimized").slice().reverse()
  const active = mode === "missionControl"
  const cols = openIds.length <= 4 ? 2 : 3

  useEffect(() => {
    if (!active) return
    previouslyFocused.current = document.activeElement as HTMLElement
    // scoped to card buttons specifically - the backdrop's own close
    // button is also a <button> and precedes the cards in DOM order
    containerRef.current?.querySelector<HTMLElement>('button[aria-label^="Show "]')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMode("desktop")
        return
      }
      const buttons = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>('button[aria-label^="Show "]') ?? []
      )
      const idx = buttons.indexOf(document.activeElement as HTMLElement)
      if (idx === -1) return
      if (e.key === "ArrowRight") {
        e.preventDefault()
        buttons[(idx + 1) % buttons.length]?.focus()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        buttons[(idx - 1 + buttons.length) % buttons.length]?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      previouslyFocused.current?.focus()
    }
  }, [active, setMode])

  const selectAndExit = (id: (typeof openIds)[number]) => {
    focus(id)
    setMode("desktop")
  }

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Mission Control"
          ref={containerRef}
          className="fixed inset-0 z-[1200]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.24 }}
        >
          <button
            aria-label="Close Mission Control"
            onClick={() => setMode("desktop")}
            className="absolute inset-0 h-full w-full"
            style={{ backdropFilter: "blur(20px) brightness(0.55)" }}
          />

          <ul
            className="pointer-events-none relative grid h-full items-center justify-items-center gap-8 p-16"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 460px))`, perspective: reducedMotion ? undefined : 1600 }}
          >
            {openIds.map((id, i) => {
              const meta = apps[id]
              const AppContent = appRegistry[id]
              return (
                <motion.li
                  key={id}
                  className="pointer-events-auto w-full"
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, rotateX: -14, z: -120, scale: 0.9 }}
                  animate={{ opacity: 1, rotateX: 0, z: 0, scale: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, rotateX: -14, z: -120, scale: 0.9 }}
                  transition={{
                    type: reducedMotion ? "tween" : "spring",
                    stiffness: 260,
                    damping: 30,
                    delay: reducedMotion ? 0 : i * 0.04,
                  }}
                  whileHover={reducedMotion ? undefined : { z: 40, rotateX: -4 }}
                >
                  <button
                    type="button"
                    aria-label={`Show ${meta.title}`}
                    onClick={() => selectAndExit(id)}
                    className="group w-full text-left"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-[--r-window] border border-edge bg-panel shadow-[var(--shadow-focused)]">
                      <div aria-hidden className="pointer-events-none h-full w-full origin-top-left" style={{ transform: "scale(0.42)", width: "238%", height: "238%" }}>
                        <AppContent windowId={id} />
                      </div>
                    </div>
                    <span className="mt-2 flex items-center gap-1.5 text-xs text-text-2 group-hover:text-text">
                      <meta.icon size={12} weight="light" />
                      {meta.title}
                    </span>
                  </button>
                </motion.li>
              )
            })}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
