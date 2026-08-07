"use client"

import { useEffect, useRef } from "react"
import { useMotionValue, type MotionValue } from "framer-motion"
import type { AppId } from "@/data/apps"
import { useOS } from "./store"
import type { Rect } from "./types"

export type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"

/**
 * Takes the same x/y motion values useWindowDrag owns, because resizing from
 * a top or left edge must anchor the opposite edge in place, which means
 * writing position as well as size. Returning only w/h (as plan/02's
 * abbreviated signature shows) would leave "drag the top edge, window moves
 * instead of resizing" unsolved. See plan/02-window-manager.md section 5.
 */
export function useWindowResize(
  id: AppId,
  rect: Rect,
  minSize: { w: number; h: number },
  x: MotionValue<number>,
  y: MotionValue<number>
): {
  w: MotionValue<number>
  h: MotionValue<number>
  startResize: (edge: Edge, e: React.PointerEvent<HTMLElement>) => void
} {
  const w = useMotionValue(rect.w)
  const h = useMotionValue(rect.h)
  const resizing = useRef(false)
  const start = useRef({ px: 0, py: 0, x: 0, y: 0, w: 0, h: 0 })

  useEffect(() => {
    if (resizing.current) return
    if (w.get() !== rect.w) w.set(rect.w)
    if (h.get() !== rect.h) h.set(rect.h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rect.w, rect.h])

  const startResize = (edge: Edge, e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return
    useOS.getState().focus(id)

    resizing.current = true
    start.current = { px: e.clientX, py: e.clientY, x: x.get(), y: y.get(), w: w.get(), h: h.get() }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

    const affectsN = edge.includes("n")
    const affectsS = edge.includes("s")
    const affectsE = edge.includes("e")
    const affectsW = edge.includes("w")

    const onMove = (ev: PointerEvent) => {
      if (!resizing.current) return
      const dx = ev.clientX - start.current.px
      const dy = ev.clientY - start.current.py

      let nextW = start.current.w
      let nextH = start.current.h
      let nextX = start.current.x
      let nextY = start.current.y

      if (affectsE) nextW = Math.max(minSize.w, start.current.w + dx)
      if (affectsS) nextH = Math.max(minSize.h, start.current.h + dy)
      if (affectsW) {
        nextW = Math.max(minSize.w, start.current.w - dx)
        nextX = start.current.x + (start.current.w - nextW)
      }
      if (affectsN) {
        nextH = Math.max(minSize.h, start.current.h - dy)
        nextY = start.current.y + (start.current.h - nextH)
      }

      w.set(nextW)
      h.set(nextH)
      x.set(nextX)
      y.set(nextY)
    }

    const onUp = () => {
      resizing.current = false
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      useOS.getState().commitRect(id, { x: x.get(), y: y.get(), w: w.get(), h: h.get() })
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  return { w, h, startResize }
}
