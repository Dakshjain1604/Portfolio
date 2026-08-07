"use client"

import { useOS } from "@/os/store"
import { useKeyboardShortcuts } from "@/os/useKeyboardShortcuts"
import { useMediaQuery } from "@/os/useMediaQuery"
import { ReducedMotionProvider } from "@/os/ReducedMotionContext"
import { Desktop } from "./Desktop"

/**
 * The one top-level 'use client' boundary, per plan/00-architecture.md
 * section 9. Everything under it is client by inheritance.
 *
 * Below 1024px this renders Springboard (plan/16-mobile-springboard.md,
 * phase 5) instead of Desktop - not yet built, so this phase renders
 * nothing on narrow viewports rather than a broken desktop. Phase 5 swaps
 * in the real branch with no change to this file's shape.
 *
 * While mode is 'reader', this returns null entirely: ReaderView
 * (plan/17-reader-view.md, phase 6) is what's left visible underneath.
 * That pairing doesn't exist until page.tsx is rewritten in phase 6, but
 * the unmount behavior here is already correct today.
 */
function DesktopShellInner() {
  useKeyboardShortcuts()
  const mode = useOS((s) => s.mode)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  if (mode === "reader") return null
  if (isDesktop === null) return null
  if (!isDesktop) return null // phase 5: <Springboard />

  return <Desktop />
}

export function DesktopShell() {
  return (
    <ReducedMotionProvider>
      <DesktopShellInner />
    </ReducedMotionProvider>
  )
}
