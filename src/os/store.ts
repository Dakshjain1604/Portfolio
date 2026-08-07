"use client"

import { create } from "zustand"
import { apps, type AppId } from "@/data/apps"
import { MENUBAR_H, DOCK_H, TITLEBAR_H, type Rect, type WindowState, type OSMode } from "./types"

const CASCADE_STEP = 28
const CASCADE_MOD = 6
const MODE_KEY = "os-mode"

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

type OSStore = {
  windows: Partial<Record<AppId, WindowState>>
  stack: AppId[]
  mode: OSMode
  booted: boolean
  wallpaper: string

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
  cycleFocus: (dir: 1 | -1) => void
}

export const useOS = create<OSStore>((set, get) => ({
  windows: {},
  stack: [],
  mode: initialMode,
  booted: false,
  wallpaper: "mesh",

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
