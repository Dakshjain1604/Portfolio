"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import { useGlassPointer } from "@/os/useGlassPointer"

type SidebarProps = {
  width: number
  children: React.ReactNode
  /** Finder's categories are navigation, its preview pane is complementary
   *  content, and Notes' pane is neither - the listbox inside already
   *  carries the semantics, so wrapping it in a second labelled landmark
   *  would just make a screen reader say "Roles" twice. Callers keep the
   *  semantics they already had; this primitive only owns the material. */
  as?: "nav" | "aside" | "div"
  /** Required for the landmark variants, meaningless on a plain div. */
  ariaLabel?: string
  className?: string
  /** Finder's preview pane swaps its whole contents when the selection
   *  changes, and a screen reader needs to hear that. */
  live?: boolean
}

/**
 * Tahoe's floating sidebar: detached from the window wall, inset inside
 * the frame with its own concentric radius, and translucent enough that
 * the wallpaper reads through it. Replaces the flush
 * `border-r border-divider bg-panel-2` pane, which is the Big Sur through
 * Sonoma shape and the single most dated thing about the old layout.
 *
 * Uses the clear tier rather than regular: it sits directly on the
 * window's own glass, and two regular-tier surfaces stacked would double
 * the blur - the thing Apple's GlassEffectContainer exists to avoid. See
 * plan/20-tahoe-refinement.md.
 */
export function Sidebar({ width, children, as = "nav", ariaLabel, className, live }: SidebarProps) {
  const ref = useRef<HTMLElement>(null)
  useGlassPointer(ref)

  const props = {
    "aria-label": ariaLabel,
    "aria-live": live ? ("polite" as const) : undefined,
    style: { width },
    className: cn("os-glass-clear shrink-0 overflow-auto rounded-(--r-float) p-2", className),
  }

  // One ref, three possible host elements. RefObject is invariant in TS so
  // the div branch needs a narrowing assertion; all three hosts are real
  // HTMLElements, which is all useGlassPointer requires.
  if (as === "aside") return <aside ref={ref} {...props}>{children}</aside>
  if (as === "div") {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} {...props}>
        {children}
      </div>
    )
  }
  return <nav ref={ref} {...props}>{children}</nav>
}
