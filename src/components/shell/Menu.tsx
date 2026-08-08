"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Check } from "@phosphor-icons/react/dist/ssr"
import { useReducedMotion } from "@/os/ReducedMotionContext"
import { cn } from "@/lib/utils"

export type MenuItemDef =
  | { kind: "action"; label: string; shortcut?: string; disabled?: boolean; onSelect: () => void }
  | { kind: "radio"; label: string; checked: boolean; onSelect: () => void }
  /** A standalone on/off toggle (e.g. "Show Menu Bar Background"), distinct
   *  from "radio": radio implies mutual exclusivity among sibling items
   *  (the Window menu's open-window list), a checkbox does not. */
  | { kind: "checkbox"; label: string; checked: boolean; onSelect: () => void }
  | { kind: "separator" }

type MenuProps = {
  label: React.ReactNode
  ariaLabel?: string
  items: MenuItemDef[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  /** ArrowLeft/ArrowRight while open, for the menu bar to switch to a
   *  sibling menu with no animation, per plan/03-shell-menubar.md. */
  onRequestNeighbor?: (dir: 1 | -1) => void
  align?: "left" | "right"
  triggerClassName?: string
}

/**
 * One dropdown implementation shared by MenuBar and ContextMenu, per
 * plan/03-shell-menubar.md section "Menus". Fully keyboard-operable:
 * Enter/Space/ArrowDown opens, ArrowUp/ArrowDown/Home/End move within,
 * Esc closes and returns focus to the trigger.
 */
export function Menu({
  label,
  ariaLabel,
  items,
  isOpen,
  onOpenChange,
  onRequestNeighbor,
  align = "left",
  triggerClassName,
}: MenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const selectableIndexes = items
    .map((it, i) => (it.kind === "separator" ? -1 : i))
    .filter((i) => i >= 0)

  const anyCheckable = items.some((it) => it.kind === "radio" || it.kind === "checkbox")

  useEffect(() => {
    if (!isOpen) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t)) return
      if (panelRef.current?.contains(t)) return
      onOpenChange(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [isOpen, onOpenChange])

  useEffect(() => {
    if (isOpen) {
      const first = panelRef.current?.querySelector<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])')
      first?.focus()
    }
  }, [isOpen])

  const closeAndReturnFocus = () => {
    onOpenChange(false)
    triggerRef.current?.focus()
  }

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    const focusables = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])') ?? []
    )
    const currentIndex = focusables.indexOf(document.activeElement as HTMLElement)

    if (e.key === "Escape") {
      e.preventDefault()
      closeAndReturnFocus()
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      focusables[(currentIndex + 1) % focusables.length]?.focus()
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      focusables[(currentIndex - 1 + focusables.length) % focusables.length]?.focus()
      return
    }
    if (e.key === "Home") {
      e.preventDefault()
      focusables[0]?.focus()
      return
    }
    if (e.key === "End") {
      e.preventDefault()
      focusables[focusables.length - 1]?.focus()
      return
    }
    if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && onRequestNeighbor) {
      e.preventDefault()
      onRequestNeighbor(e.key === "ArrowRight" ? 1 : -1)
    }
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => onOpenChange(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === " " || e.key === "Enter") {
            e.preventDefault()
            onOpenChange(true)
          }
        }}
        onMouseEnter={() => onRequestNeighbor && isOpen && onOpenChange(true)}
        className={triggerClassName ?? "os-press rounded-(--r-pill) px-2 py-1 text-xs text-text hover:bg-panel-3"}
      >
        {label}
      </button>

      {isOpen && (
        <motion.div
          ref={panelRef}
          role="menu"
          aria-label={ariaLabel}
          onKeyDown={onPanelKeyDown}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.14, ease: [0.32, 0.72, 0, 1] }}
          style={{ transformOrigin: align === "left" ? "top left" : "top right" }}
          className={cn(
            "os-glass absolute top-full z-[1100] mt-1.5 min-w-[210px] rounded-(--r-float) p-1.5",
            align === "left" ? "left-0" : "right-0"
          )}
        >
          {items.map((item, i) => {
            if (item.kind === "separator") {
              return <div key={i} role="separator" className="my-1 h-px bg-divider" />
            }
            const isRadio = item.kind === "radio"
            const isCheckbox = item.kind === "checkbox"
            const hasCheckState = isRadio || isCheckbox
            return (
              <button
                key={i}
                type="button"
                role={isRadio ? "menuitemradio" : isCheckbox ? "menuitemcheckbox" : "menuitem"}
                aria-checked={hasCheckState ? item.checked : undefined}
                aria-disabled={item.kind === "action" && item.disabled ? true : undefined}
                disabled={item.kind === "action" && item.disabled}
                tabIndex={-1}
                onClick={() => {
                  item.onSelect()
                  closeAndReturnFocus()
                }}
                // The highlight is inset from the panel edge rather than
                // full-bleed, so its curve sits concentrically inside the
                // panel's. Tahoe's actual menu treatment, and the clearest
                // small demonstration of the rule.
                // whitespace-nowrap: the rows are a fixed 26px, so a
                // wrapping label overflows into the row below it. macOS
                // menus never wrap - the panel widens instead, which
                // min-w-[210px] being a floor rather than a fixed width
                // already allows.
                className="flex h-[26px] w-full items-center justify-between gap-4 whitespace-nowrap rounded-(--r-control) px-2.5 text-left text-xs text-text hover:bg-accent-fill hover:text-white disabled:text-text-3 disabled:hover:bg-transparent disabled:hover:text-text-3"
              >
                <span className="flex items-center gap-2">
                  {/* The gutter is reserved for every item once any item in
                      the menu is checkable, not only for the checkable ones.
                      Otherwise labels in the same menu start at two
                      different x positions, which macOS never does. */}
                  {anyCheckable && (
                    <span className="flex w-3 justify-center">
                      {hasCheckState && item.checked && <Check size={11} weight="bold" />}
                    </span>
                  )}
                  {item.label}
                </span>
                {item.kind === "action" && item.shortcut && (
                  <span className="text-text-2">{item.shortcut}</span>
                )}
              </button>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
