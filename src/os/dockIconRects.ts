import type { AppId } from "@/data/apps"

/**
 * Dock icon screen positions, written by Dock.tsx on every layout pass,
 * read by Window.tsx to compute the genie transformOrigin. A plain module
 * -level map rather than store state: it changes on scroll/resize/hover
 * far more often than any window cares to re-render for, so it is read
 * imperatively at the moment a window opens or closes, not subscribed to.
 */
const rects = new Map<AppId, { x: number; y: number }>()

export function setDockIconCenter(id: AppId, center: { x: number; y: number }) {
  rects.set(id, center)
}

export function getDockIconCenter(id: AppId): { x: number; y: number } | undefined {
  return rects.get(id)
}
