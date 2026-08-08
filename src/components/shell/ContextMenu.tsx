"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useOS } from "@/os/store"
import { useReducedMotion } from "@/os/ReducedMotionContext"
import { WALLPAPERS } from "./Wallpaper"
import type { MenuItemDef } from "./Menu"

export type ContextMenuState = { x: number; y: number } | null

/**
 * Same visual language as Menu.tsx (shares MenuItemDef) but positioned at
 * an arbitrary point rather than anchored under a trigger button, since a
 * right-click has no trigger element. See plan/05-shell-desktop.md section 4.
 */
export function ContextMenu({ state, onClose }: { state: ContextMenuState; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [flip, setFlip] = useState({ x: false, y: false })

  const stack = useOS((s) => s.stack)
  const wallpaper = useOS((s) => s.wallpaper)
  const setWallpaper = useOS((s) => s.setWallpaper)
  const setMode = useOS((s) => s.setMode)
  const open = useOS((s) => s.open)

  useEffect(() => {
    if (!state) return
    const el = panelRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setFlip({
      x: state.x + r.width > window.innerWidth,
      y: state.y + r.height > window.innerHeight,
    })
  }, [state])

  useEffect(() => {
    if (!state) return
    const onPointerDown = (e: PointerEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) onClose()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [state, onClose])

  useEffect(() => {
    if (state) panelRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')?.focus()
  }, [state])

  if (!state) return null

  const items: MenuItemDef[] = [
    {
      kind: "action",
      label: "Change Wallpaper",
      onSelect: () => {
        const idx = WALLPAPERS.indexOf(wallpaper as (typeof WALLPAPERS)[number])
        setWallpaper(WALLPAPERS[(idx + 1) % WALLPAPERS.length])
      },
    },
    {
      kind: "action",
      label: "Mission Control",
      disabled: stack.length < 2,
      onSelect: () => setMode("missionControl"),
    },
    { kind: "separator" },
    { kind: "action", label: "Open Projects", onSelect: () => open("finder") },
    { kind: "action", label: "Reader view", onSelect: () => setMode("reader") },
  ]

  return (
    <motion.div
      ref={panelRef}
      role="menu"
      aria-label="Desktop"
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.14, ease: [0.32, 0.72, 0, 1] }}
      style={{
        transformOrigin: `${flip.x ? "right" : "left"} ${flip.y ? "bottom" : "top"}`,
        left: flip.x ? undefined : state.x,
        right: flip.x ? window.innerWidth - state.x : undefined,
        top: flip.y ? undefined : state.y,
        bottom: flip.y ? window.innerHeight - state.y : undefined,
      }}
      className="os-glass fixed z-[1100] min-w-[210px] rounded-(--r-float) p-1.5"
      onKeyDown={(e) => {
        const focusables = Array.from(
          panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? []
        )
        const idx = focusables.indexOf(document.activeElement as HTMLElement)
        if (e.key === "ArrowDown") {
          e.preventDefault()
          focusables[(idx + 1) % focusables.length]?.focus()
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          focusables[(idx - 1 + focusables.length) % focusables.length]?.focus()
        }
      }}
    >
      {items.map((item, i) =>
        item.kind === "separator" ? (
          <div key={i} role="separator" className="my-1 h-px bg-divider" />
        ) : (
          <button
            key={i}
            type="button"
            role="menuitem"
            aria-disabled={item.kind === "action" && item.disabled ? true : undefined}
            disabled={item.kind === "action" && item.disabled}
            tabIndex={-1}
            onClick={() => {
              item.onSelect()
              onClose()
            }}
            className="flex h-[26px] w-full items-center whitespace-nowrap rounded-(--r-control) px-2.5 text-left text-xs text-text hover:bg-accent-fill hover:text-white disabled:text-text-3 disabled:hover:bg-transparent disabled:hover:text-text-3"
          >
            {item.label}
          </button>
        )
      )}
    </motion.div>
  )
}
