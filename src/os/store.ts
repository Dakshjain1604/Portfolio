"use client"

import { create } from "zustand"
import { apps, type AppId } from "@/data/apps"
import { MENUBAR_H, DOCK_H, TITLEBAR_H, type Rect, type WindowState, type OSMode } from "./types"

const CASCADE_STEP = 28
const CASCADE_MOD = 6
const MODE_KEY = "os-mode"
const MENUBAR_SOLID_KEY = "os-menubar-solid"
const ACCENT_TINT_KEY = "os-accent-tint"
const GLASS_CLEAR_KEY = "os-glass-clear"
const THEME_KEY = "os-theme"

// Unlike `mode` below, these three are safe to read synchronously here at
// store-creation time: nothing ReaderView or any other server-rendered
// component depends on menuBarSolid/accentTint/glassClear, and MenuBar
// itself never renders during SSR or the client's first paint (it lives
// under DesktopShellInner, which returns null until isDesktop resolves
// post-mount, regardless of these values) - so there is no server/client
// first-render disagreement possible, which is the specific failure mode
// that made `mode`'s synchronous read a real bug.
function initialMenuBarSolid(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(MENUBAR_SOLID_KEY) === "1"
}
function initialAccentTint(): AccentTint {
  if (typeof window === "undefined") return "blue"
  const saved = localStorage.getItem(ACCENT_TINT_KEY)
  return saved && saved in ACCENT_TINTS ? (saved as AccentTint) : "blue"
}
function initialGlassClear(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(GLASS_CLEAR_KEY) === "1"
}
function initialTheme(): ThemePreference {
  if (typeof window === "undefined") return "auto"
  const saved = localStorage.getItem(THEME_KEY)
  return saved === "light" || saved === "dark" || saved === "auto" ? saved : "auto"
}

/** Exported so DesktopShellInner can re-apply the restored preference in a
 *  post-mount effect - see the comment there for why this must not run at
 *  module-evaluation time (it did, briefly, and caused a real hydration
 *  mismatch on <html>'s style attribute, a stricter check than "does any
 *  component render different output"). */
export function applyAccentTint(tint: AccentTint) {
  if (typeof document === "undefined") return
  document.documentElement.style.setProperty("--os-accent", ACCENT_TINTS[tint])
}
export function applyGlassClear(clear: boolean) {
  if (typeof document === "undefined") return
  if (clear) document.documentElement.dataset.glass = "clear"
  else delete document.documentElement.dataset.glass
}
/** "auto" removes the attribute entirely rather than writing it, so the
 *  `@media (prefers-color-scheme: light) { :root:not([data-theme]) ... }`
 *  guard in globals.css picks it up - see the THEME block there. This is
 *  the whole mechanism: Auto needs no JS beyond "don't set the attribute,"
 *  and the OS preference is tracked live by the media query with no
 *  listener required. */
export function applyTheme(theme: ThemePreference) {
  if (typeof document === "undefined") return
  if (theme === "auto") delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = theme
}

// Deliberately always "desktop" here, on both server and client, even
// though this module only ever runs in the browser. The tempting
// shortcut - read localStorage synchronously at store-creation time - was
// tried and produced a real hydration mismatch: 'use client' components
// still render on the server for the initial HTML, where localStorage
// does not exist, so the server always sees "desktop" while the client's
// first render would see the real saved value. DesktopShellInner itself
// tolerates that fine (it gates on isDesktop resolving first regardless),
// but ReaderReturnBar reads `mode` too and renders actual content only
// when it is 'reader' - server null vs. client content is exactly a
// hydration mismatch. The saved preference is restored instead via a
// post-mount effect in DesktopShellInner, the same pattern already used
// for isDesktop and the clock. See plan/17-reader-view.md.
const initialMode: OSMode = "desktop"

export function clampToViewport(rect: Rect): Rect {
  if (typeof window === "undefined") return rect
  const vw = window.innerWidth
  const vh = window.innerHeight
  const maxX = Math.max(0, vw - 120)
  const maxY = Math.max(MENUBAR_H, vh - DOCK_H - TITLEBAR_H)
  return {
    ...rect,
    x: Math.min(Math.max(rect.x, -(rect.w - 120)), maxX),
    y: Math.min(Math.max(rect.y, MENUBAR_H), maxY),
  }
}

/** Preset accent tints for System Settings > Appearance, per
 *  plan/19-liquid-glass-modernization.md phase D - Tahoe's cited
 *  "personalize icons and widgets... tinted... clear look."
 *
 *  Each value is a `var(--sys-*)` reference, not a literal hex - every one
 *  of these six already matched an existing --sys-* token in globals.css
 *  exactly (blue/purple/pink/orange/green/gray), and referencing them
 *  rather than duplicating their hex means the swatch, and the
 *  `--os-accent` assignment in applyAccentTint below, both resolve
 *  through the same light/dark cascade those tokens already carry - no
 *  separate light-appearance tint map needed, and it stays correct live
 *  if the OS preference changes mid-session under Auto, with no listener
 *  required. */
export const ACCENT_TINTS = {
  blue: "var(--sys-blue)",
  purple: "var(--sys-purple)",
  pink: "var(--sys-pink)",
  orange: "var(--sys-orange)",
  green: "var(--sys-green)",
  graphite: "var(--sys-gray)",
} as const
export type AccentTint = keyof typeof ACCENT_TINTS
export type ThemePreference = "auto" | "light" | "dark"

type OSStore = {
  windows: Partial<Record<AppId, WindowState>>
  stack: AppId[]
  mode: OSMode
  booted: boolean
  wallpaper: string
  /** Liquid Glass modernization, phase B: real Tahoe defaults to a
   *  transparent menu bar; this mirrors its actual Settings toggle,
   *  "Show menu bar background." */
  menuBarSolid: boolean
  accentTint: AccentTint
  glassClear: boolean
  theme: ThemePreference

  open: (id: AppId) => void
  close: (id: AppId) => void
  focus: (id: AppId) => void
  minimize: (id: AppId) => void
  restore: (id: AppId) => void
  toggleMaximize: (id: AppId) => void
  commitRect: (id: AppId, rect: Rect) => void
  closeAll: () => void
  minimizeAll: () => void
  bringAllToFront: () => void
  setMode: (mode: OSMode) => void
  setBooted: (booted: boolean) => void
  setWallpaper: (src: string) => void
  setMenuBarSolid: (solid: boolean) => void
  setAccentTint: (tint: AccentTint) => void
  setGlassClear: (clear: boolean) => void
  setTheme: (theme: ThemePreference) => void
  cycleFocus: (dir: 1 | -1) => void
}

export const useOS = create<OSStore>((set, get) => ({
  windows: {},
  stack: [],
  mode: initialMode,
  booted: false,
  wallpaper: "abyss",
  menuBarSolid: initialMenuBarSolid(),
  accentTint: initialAccentTint(),
  glassClear: initialGlassClear(),
  theme: initialTheme(),

  open: (id) => {
    const { windows, stack } = get()
    const existing = windows[id]
    if (existing?.status === "minimized") {
      get().restore(id)
      return
    }
    if (existing) {
      get().focus(id)
      return
    }

    const meta = apps[id]
    const openCount = Object.keys(windows).length
    const offset = (openCount % CASCADE_MOD) * CASCADE_STEP
    const rect = clampToViewport({
      ...meta.defaultRect,
      x: meta.defaultRect.x + offset,
      y: meta.defaultRect.y + offset,
    })

    set({
      windows: {
        ...windows,
        [id]: { id, rect, status: "open", openedAt: Date.now() },
      },
      stack: [...stack, id],
    })
  },

  close: (id) => {
    const { windows, stack } = get()
    const next = { ...windows }
    delete next[id]
    set({ windows: next, stack: stack.filter((w) => w !== id) })
  },

  focus: (id) => {
    const { stack, windows } = get()
    if (!windows[id]) return
    set({ stack: [...stack.filter((w) => w !== id), id] })
  },

  minimize: (id) => {
    const { windows } = get()
    const w = windows[id]
    if (!w) return
    set({ windows: { ...windows, [id]: { ...w, status: "minimized" } } })
  },

  restore: (id) => {
    const { windows } = get()
    const w = windows[id]
    if (!w) return
    set({ windows: { ...windows, [id]: { ...w, status: "open" } } })
    get().focus(id)
  },

  toggleMaximize: (id) => {
    const { windows } = get()
    const w = windows[id]
    if (!w) return

    if (w.status === "maximized" && w.prevRect) {
      set({ windows: { ...windows, [id]: { ...w, status: "open", rect: w.prevRect, prevRect: undefined } } })
      return
    }

    const vw = typeof window !== "undefined" ? window.innerWidth : 1440
    const vh = typeof window !== "undefined" ? window.innerHeight : 900
    const fullRect: Rect = { x: 0, y: MENUBAR_H, w: vw, h: vh - MENUBAR_H - DOCK_H }

    set({
      windows: {
        ...windows,
        [id]: { ...w, status: "maximized", prevRect: w.rect, rect: fullRect },
      },
    })
    get().focus(id)
  },

  commitRect: (id, rect) => {
    const { windows } = get()
    const w = windows[id]
    if (!w) return
    set({ windows: { ...windows, [id]: { ...w, rect: clampToViewport(rect) } } })
  },

  closeAll: () => set({ windows: {}, stack: [] }),

  minimizeAll: () => {
    const { windows } = get()
    const next: typeof windows = {}
    for (const [id, w] of Object.entries(windows)) {
      next[id as AppId] = { ...w, status: "minimized" }
    }
    set({ windows: next })
  },

  bringAllToFront: () => {
    const { windows } = get()
    const next: typeof windows = {}
    for (const [id, w] of Object.entries(windows)) {
      next[id as AppId] = { ...w, status: w.status === "maximized" ? "maximized" : "open" }
    }
    set({ windows: next })
  },

  setMode: (mode) => {
    // Only 'desktop' and 'reader' are a persistent choice; missionControl
    // is a transient overlay and is deliberately never written here.
    if (mode === "desktop" || mode === "reader") {
      localStorage.setItem(MODE_KEY, mode)
    }
    set({ mode })
  },
  setBooted: (booted) => set({ booted }),
  setWallpaper: (wallpaper) => set({ wallpaper }),

  setMenuBarSolid: (solid) => {
    localStorage.setItem(MENUBAR_SOLID_KEY, solid ? "1" : "0")
    set({ menuBarSolid: solid })
  },
  setAccentTint: (tint) => {
    localStorage.setItem(ACCENT_TINT_KEY, tint)
    applyAccentTint(tint)
    set({ accentTint: tint })
  },
  setGlassClear: (clear) => {
    localStorage.setItem(GLASS_CLEAR_KEY, clear ? "1" : "0")
    applyGlassClear(clear)
    set({ glassClear: clear })
  },
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme)
    applyTheme(theme)
    set({ theme })
  },

  cycleFocus: (dir) => {
    const { stack, windows } = get()
    const openable = stack.filter((id) => windows[id]?.status !== "minimized")
    if (openable.length < 2) return
    const focused = openable[openable.length - 1]
    const idx = openable.indexOf(focused)
    const nextIdx = (idx + dir + openable.length) % openable.length
    get().focus(openable[nextIdx])
  },
}))
