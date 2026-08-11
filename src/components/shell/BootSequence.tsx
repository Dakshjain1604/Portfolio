"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useOS } from "@/os/store"
import { useReducedMotion } from "@/os/ReducedMotionContext"

const SESSION_KEY = "os-booted"
const PROGRESS_MS = 560
const HANDOFF_MS = 80

/**
 * ~900ms to interactive, once per session, always skippable. Gated on
 * sessionStorage so a returning visitor within the session goes straight
 * to the desktop with no boot render at all (not hidden - unmounted).
 * See plan/05-shell-desktop.md section 5.
 *
 * Boot deliberately opens nothing. It used to `open("finder")` on
 * completion, which meant the first thing a visitor ever saw was a file
 * browser belonging to nobody - the name appeared on screen only if they
 * went looking for it. The landing view is now the desktop itself, with
 * DesktopHero carrying the identity and the icons and Dock carrying the
 * affordance. See plan/21-composition-pass.md.
 */
export function BootSequence() {
  const reducedMotion = useReducedMotion()
  const mode = useOS((s) => s.mode)
  const setBooted = useOS((s) => s.setBooted)

  const [phase, setPhase] = useState<"pending" | "mark" | "progress" | "handoff" | "done">("pending")
  const skippedRef = useRef(false)

  const finish = () => {
    if (skippedRef.current) return
    skippedRef.current = true
    sessionStorage.setItem(SESSION_KEY, "1")
    setBooted(true)
    setPhase("done")
  }

  useEffect(() => {
    const alreadyBooted = typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1"
    if (alreadyBooted || reducedMotion || mode === "reader") {
      skippedRef.current = true
      sessionStorage.setItem(SESSION_KEY, "1")
      setBooted(true)
      // Deliberate: sessionStorage and prefers-reduced-motion are both
      // unavailable during SSR, so whether to skip the boot animation
      // entirely can only be decided post-mount, on the client.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done")
      return
    }

    setPhase("mark")
    const t1 = setTimeout(() => setPhase("progress"), 260)
    const t2 = setTimeout(() => setPhase("handoff"), 260 + PROGRESS_MS)
    const t3 = setTimeout(finish, 260 + PROGRESS_MS + HANDOFF_MS)

    const skip = () => finish()
    window.addEventListener("keydown", skip)
    window.addEventListener("pointerdown", skip)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      window.removeEventListener("keydown", skip)
      window.removeEventListener("pointerdown", skip)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence>
      {phase !== "done" && phase !== "pending" && (
        <motion.div
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[1300] flex flex-col items-center justify-center gap-6 bg-void"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "handoff" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: HANDOFF_MS / 1000 }}
        >
          <motion.span
            className="font-mono text-lg font-semibold text-text"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.26 }}
          >
            dj
          </motion.span>
          <div className="h-[2px] w-[180px] overflow-hidden rounded-full bg-panel-3">
            <div
              className="h-full bg-text-2"
              style={{
                width: phase === "progress" || phase === "handoff" ? "100%" : "0%",
                transition: phase === "progress" ? `width ${PROGRESS_MS}ms linear` : undefined,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
