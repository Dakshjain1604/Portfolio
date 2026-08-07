"use client"

import { useEffect, useRef } from "react"
import { useMotionValue, useVelocity, useTransform, useSpring, type MotionValue } from "framer-motion"
import type { AppId } from "@/data/apps"
import { useOS, clampToViewport } from "./store"
import type { Rect } from "./types"

const TILT_RANGE_PX_S = 1400
const TILT_MAX_DEG = 5
const TILT_SPRING = { stiffness: 260, damping: 26, mass: 0.6 }

export function useWindowDrag(
  id: AppId,
  rect: Rect,
  reducedMotion: boolean
): {
  x: MotionValue<number>
  y: MotionValue<number>
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void
} {
  const x = useMotionValue(rect.x)
  const y = useMotionValue(rect.y)
  const dragging = useRef(false)
  const start = useRef({ px: 0, py: 0, x: 0, y: 0 })

  const vx = useVelocity(x)
  const vy = useVelocity(y)

  const rotateYRaw = useTransform(vx, [-TILT_RANGE_PX_S, TILT_RANGE_PX_S], [-TILT_MAX_DEG, TILT_MAX_DEG], {
    clamp: true,
  })
  const rotateXRaw = useTransform(vy, [-TILT_RANGE_PX_S, TILT_RANGE_PX_S], [TILT_MAX_DEG, -TILT_MAX_DEG], {
    clamp: true,
  })
  const rotateY = useSpring(rotateYRaw, TILT_SPRING)
  const rotateX = useSpring(rotateXRaw, TILT_SPRING)

  // keep motion values in sync when the store's rect changes for a reason other
  // than this hook (resize commit, maximize, cascade on open)
  useEffect(() => {
    if (dragging.current) return
    if (x.get() !== rect.x) x.set(rect.x)
    if (y.get() !== rect.y) y.set(rect.y)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rect.x, rect.y])

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return
    useOS.getState().focus(id)
    if (reducedMotion) return

    dragging.current = true
    start.current = { px: e.clientX, py: e.clientY, x: x.get(), y: y.get() }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

    const onMove = (ev: PointerEvent) => {
      if (!dragging.current) return
      const dx = ev.clientX - start.current.px
      const dy = ev.clientY - start.current.py
      const nextX = start.current.x + dx
      const nextY = start.current.y + dy

      const clamped = clampToViewport({ x: nextX, y: nextY, w: rect.w, h: rect.h })
      x.set(clamped.x)
      y.set(clamped.y)
    }

    const onUp = () => {
      dragging.current = false
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      useOS.getState().commitRect(id, { x: x.get(), y: y.get(), w: rect.w, h: rect.h })
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  return { x, y, rotateX, rotateY, onPointerDown }
}
