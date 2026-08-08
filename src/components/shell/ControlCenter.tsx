"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  SlidersHorizontal,
  BookOpen,
  Check,
  Image as ImageIcon,
  Drop,
  SquaresFour,
} from "@phosphor-icons/react/dist/ssr"
import { useOS, ACCENT_TINTS, type AccentTint } from "@/os/store"
import { useReducedMotion } from "@/os/ReducedMotionContext"
import { useGlassPointer } from "@/os/useGlassPointer"
import { WALLPAPERS } from "./Wallpaper"

/** One tile on the grid. Tahoe's Control Center is a field of rounded
 *  tiles rather than a menu of text rows, which is most of why the
 *  redesigned version reads as current. */
function Tile({
  label,
  hint,
  icon: Icon,
  on,
  onClick,
  role = "button",
  wide,
}: {
  label: string
  hint?: string
  icon: React.ComponentType<{ size?: number; weight?: "light" | "bold" }>
  on?: boolean
  onClick: () => void
  role?: "button" | "switch"
  wide?: boolean
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={role === "switch" ? on : undefined}
      onClick={onClick}
      className={`os-press flex items-center gap-2.5 rounded-(--r-card) px-3 py-2.5 text-left transition-colors ${
        wide ? "col-span-2" : ""
      }`}
      style={{
        background: on ? "var(--os-accent)" : "var(--os-panel-3)",
        color: on ? "#fff" : "var(--os-text)",
      }}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ background: on ? "rgb(255 255 255 / .22)" : "rgb(255 255 255 / .08)" }}
      >
        <Icon size={15} weight="light" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium">{label}</span>
        {hint && (
          <span className="block truncate text-[11px]" style={{ opacity: 0.7 }}>
            {hint}
          </span>
        )}
      </span>
    </button>
  )
}

/**
 * Tahoe rebuilt Control Center as the menu bar's headline feature, and it
 * is the piece that most says "this is macOS 26" rather than macOS 12.
 *
 * Every control here is a new surface over state the store already owns -
 * no new state is introduced. System Settings > Appearance stays as the
 * full counterpart, exactly as macOS ships both. See plan/20-tahoe-
 * refinement.md phase E.
 */
export function ControlCenter() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()
  useGlassPointer(panelRef)

  const wallpaper = useOS((s) => s.wallpaper)
  const setWallpaper = useOS((s) => s.setWallpaper)
  const accentTint = useOS((s) => s.accentTint)
  const setAccentTint = useOS((s) => s.setAccentTint)
  const glassClear = useOS((s) => s.glassClear)
  const setGlassClear = useOS((s) => s.setGlassClear)
  const menuBarSolid = useOS((s) => s.menuBarSolid)
  const setMenuBarSolid = useOS((s) => s.setMenuBarSolid)
  const setMode = useOS((s) => s.setMode)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Control Center"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="os-press flex h-6 w-6 items-center justify-center rounded-(--r-pill) text-text-2 hover:bg-panel-3 hover:text-text"
      >
        <SlidersHorizontal size={14} weight="light" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Control Center"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.14, ease: [0.32, 0.72, 0, 1] }}
            style={{ transformOrigin: "top right" }}
            className="os-glass absolute right-0 top-full z-[1100] mt-1.5 w-[288px] rounded-(--r-float) p-2"
          >
            <div className="grid grid-cols-2 gap-2">
              <Tile
                label="Clear glass"
                hint={glassClear ? "On" : "Off"}
                icon={Drop}
                role="switch"
                on={glassClear}
                onClick={() => setGlassClear(!glassClear)}
              />
              <Tile
                label="Menu bar"
                hint={menuBarSolid ? "Solid" : "Transparent"}
                icon={SquaresFour}
                role="switch"
                on={menuBarSolid}
                onClick={() => setMenuBarSolid(!menuBarSolid)}
              />
              <Tile
                label="Wallpaper"
                hint="Change the desktop"
                icon={ImageIcon}
                wide
                onClick={() => {
                  const i = WALLPAPERS.indexOf(wallpaper as (typeof WALLPAPERS)[number])
                  setWallpaper(WALLPAPERS[(i + 1) % WALLPAPERS.length])
                }}
              />
              <Tile label="Reader view" hint="Plain, scrollable page" icon={BookOpen} wide onClick={() => setMode("reader")} />
            </div>

            <div className="mt-3 px-1">
              <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-2">Accent color</h3>
              <div role="radiogroup" aria-label="Accent color" className="flex items-center gap-2.5 pb-1">
                {(Object.keys(ACCENT_TINTS) as AccentTint[]).map((tint) => {
                  const selected = accentTint === tint
                  return (
                    <button
                      key={tint}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={tint}
                      onClick={() => setAccentTint(tint)}
                      className="os-press flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: ACCENT_TINTS[tint],
                        boxShadow: selected
                          ? "0 0 0 2px var(--os-chrome), 0 0 0 3.5px var(--os-text)"
                          : "inset 0 1px 0 rgb(255 255 255 / .3)",
                      }}
                    >
                      {selected && <Check size={12} weight="bold" color="white" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
