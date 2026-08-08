"use client"

import { useEffect, type RefObject } from "react"

/**
 * Moves a glass surface's specular highlight to follow the cursor.
 *
 * Real Liquid Glass illuminates at the point of contact - "touch-point
 * illumination radiating to nearby glass" - which is most of what makes
 * it read as a material rather than a blurred rectangle. The CSS side is
 * a radial-gradient background layer positioned at var(--gx) var(--gy)
 * in .os-glass / .os-glass-clear (src/app/globals.css); this hook is the
 * only thing that writes those two variables.
 *
 * Writes straight to element.style, never to React state: this fires on
 * every pointermove across up to nine open windows, and a setState there
 * would be the exact per-frame re-render the no-state-during-drag rule in
 * plan/02-window-manager.md exists to prevent.
 *
 * No-ops entirely on coarse pointers (there is no hover to track) and
 * under prefers-reduced-motion. Both are read from matchMedia directly
 * rather than through useMediaQuery, because this hook needs no render
 * pass at all and useMediaQuery would force one.
 */
export function useGlassPointer(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia("(pointer: fine)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    let pending: { x: number; y: number } | null = null

    const flush = () => {
      frame = 0
      if (!pending) return
      el.style.setProperty("--gx", `${pending.x}%`)
      el.style.setProperty("--gy", `${pending.y}%`)
      pending = null
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      pending = {
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      }
      if (!frame) frame = requestAnimationFrame(flush)
    }

    // Back to the resting top-left highlight rather than freezing the
    // gleam wherever the cursor happened to exit.
    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      pending = null
      el.style.removeProperty("--gx")
      el.style.removeProperty("--gy")
    }

    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [ref])
}
