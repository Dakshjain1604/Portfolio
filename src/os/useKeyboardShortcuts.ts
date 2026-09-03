"use client"

import { useEffect } from "react"
import { useOS } from "./store"

const NUDGE = 12
const NUDGE_FINE = 1

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable
}

/** Registered once by DesktopShell, not per window. */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const os = useOS.getState()
      const mod = e.metaKey || e.ctrlKey
      const focused = os.stack[os.stack.length - 1]

      if (e.key === "F3") {
        e.preventDefault()
        os.setMode(os.mode === "missionControl" ? "desktop" : "missionControl")
        return
      }

      // F4 is Launchpad on a real keyboard, and F3 above is Mission
      // Control - the pair is muscle memory, so they are wired the same way.
      if (e.key === "F4") {
        e.preventDefault()
        os.setMode(os.mode === "launchpad" ? "desktop" : "launchpad")
        return
      }

      if (e.key === "Escape" && (os.mode === "missionControl" || os.mode === "launchpad")) {
        os.setMode("desktop")
        return
      }

      if (isTypingTarget(e.target)) return

      if (mod && e.key === "w" && focused) {
        e.preventDefault()
        os.close(focused)
        return
      }
      if (mod && e.key === "m" && focused) {
        e.preventDefault()
        os.minimize(focused)
        return
      }
      if (mod && e.ctrlKey && e.key === "f" && focused) {
        e.preventDefault()
        os.toggleMaximize(focused)
        return
      }
      if (mod && e.key === "`") {
        e.preventDefault()
        os.cycleFocus(e.shiftKey ? -1 : 1)
        return
      }

      if (focused && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        const w = os.windows[focused]
        if (!w || w.status === "maximized") return
        e.preventDefault()
        const step = e.shiftKey ? NUDGE_FINE : NUDGE
        const delta = {
          ArrowUp: { x: 0, y: -step },
          ArrowDown: { x: 0, y: step },
          ArrowLeft: { x: -step, y: 0 },
          ArrowRight: { x: step, y: 0 },
        }[e.key as "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"]
        os.commitRect(focused, { ...w.rect, x: w.rect.x + delta.x, y: w.rect.y + delta.y })
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])
}
