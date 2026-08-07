"use client"

import { useEffect } from "react"
import { useOS, applyAccentTint, applyGlassClear } from "@/os/store"
import { useKeyboardShortcuts } from "@/os/useKeyboardShortcuts"
import { useMediaQuery } from "@/os/useMediaQuery"
import { ReducedMotionProvider } from "@/os/ReducedMotionContext"
import { Desktop } from "./Desktop"
import { Springboard } from "@/components/mobile/Springboard"

/**
 * The one top-level 'use client' boundary, per plan/00-architecture.md
 * section 9. Everything under it is client by inheritance.
 *
 * Below 1024px this renders Springboard (plan/16-mobile-springboard.md).
 *
 * While mode is 'reader', this returns null entirely, revealing
 * ReaderView (plan/17-reader-view.md) underneath - the two are composed
 * as siblings in page.tsx. The effect below is what keeps exactly one of
 * the two trees in the tab order at a time: while the desktop is active,
 * #reader (rendered by ReaderView, a server component with no way to
 * read `mode` itself) is marked inert and aria-hidden; entering reader
 * mode lifts both and moves focus onto it.
 */
function DesktopShellInner() {
  useKeyboardShortcuts()
  const mode = useOS((s) => s.mode)
  const setMode = useOS((s) => s.setMode)
  const accentTint = useOS((s) => s.accentTint)
  const glassClear = useOS((s) => s.glassClear)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Restores a saved reader-mode preference post-mount rather than at
  // store-creation time - see the comment on initialMode in os/store.ts
  // for why reading localStorage synchronously there caused a real
  // hydration mismatch.
  useEffect(() => {
    if (localStorage.getItem("os-mode") === "reader") setMode("reader")
  }, [setMode])

  // Same category of fix, found live: the store's accentTint/glassClear
  // values are safe to read synchronously (see os/store.ts), but actually
  // writing them to the DOM is not - doing that at module-evaluation time
  // set an inline style on <html> before hydration finished comparing it,
  // and React flagged a real mismatch on the root element's attributes.
  // Applying the already-correct store value here, post-mount, is the fix.
  useEffect(() => {
    applyAccentTint(accentTint)
    applyGlassClear(glassClear)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // A shell branch is actually painting over #reader only once isDesktop
  // has resolved post-mount. Before that (including the entire no-JS
  // case, which never resolves it at all), #reader must stay reachable
  // and scrollable - see the body[data-mode] rule in globals.css.
  const shellActive = mode !== "reader" && isDesktop !== null

  useEffect(() => {
    const reader = document.getElementById("reader")
    if (!reader) return

    if (mode === "reader") {
      document.body.dataset.mode = "reader"
      reader.removeAttribute("inert")
      reader.removeAttribute("aria-hidden")
      reader.querySelector<HTMLAnchorElement>("a.sr-only")?.focus()
    } else if (shellActive) {
      document.body.dataset.mode = "desktop"
      reader.setAttribute("inert", "")
      reader.setAttribute("aria-hidden", "true")
    }
  }, [mode, shellActive])

  if (!shellActive) return null

  return isDesktop ? <Desktop /> : <Springboard />
}

export function DesktopShell() {
  return (
    <ReducedMotionProvider>
      <DesktopShellInner />
    </ReducedMotionProvider>
  )
}
