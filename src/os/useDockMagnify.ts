"use client"

import type { RefObject } from "react"
import { useSpring, useTransform, type MotionValue } from "framer-motion"

const REST = 52
const MAX = 76
const RANGE = 130
const SPRING = { stiffness: 380, damping: 30, mass: 0.35 }

/** Boot-entrance stagger variants shared by every Dock tile. */
export const DOCK_ICON_VARIANTS = {
  hidden: { opacity: 0, scale: 0.4 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 320, damping: 22 } },
}

/** Shared by every Dock tile (apps and external links) so the whole row
 *  magnifies as one continuous arc. See plan/04-shell-dock.md. */
export function useDockMagnify(ref: RefObject<HTMLElement | null>, mouseX: MotionValue<number>, reducedMotion: boolean) {
  const distance = useTransform(mouseX, (v) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return Infinity
    return v - (bounds.x + bounds.width / 2)
  })

  // Ranges collapse to a constant under reduced motion rather than
  // conditionally skipping useSpring, so every hook call always receives a
  // MotionValue<number> - React hooks can't branch their argument type.
  const sizeRaw = useTransform(distance, [-RANGE, 0, RANGE], reducedMotion ? [REST, REST, REST] : [REST, MAX, REST], {
    clamp: true,
  })
  const liftRaw = useTransform(distance, [-RANGE, 0, RANGE], reducedMotion ? [0, 0, 0] : [0, -12, 0], { clamp: true })
  const depthRaw = useTransform(distance, [-RANGE, 0, RANGE], reducedMotion ? [0, 0, 0] : [0, 24, 0], { clamp: true })

  const size = useSpring(sizeRaw, SPRING)
  const lift = useSpring(liftRaw, SPRING)
  const depth = useSpring(depthRaw, SPRING)

  return { size, lift, depth, REST }
}
