"use client"

import { useEffect, useState } from "react"
import { GithubLogo, LinkedinLogo, BookOpen } from "@phosphor-icons/react/dist/ssr"
import { useOS } from "@/os/store"
import { apps, type AppId } from "@/data/apps"
import { socials } from "@/data/socials"
import { MENUBAR_H } from "@/os/types"
import { Menu, type MenuItemDef } from "./Menu"
import { WALLPAPERS } from "./Wallpaper"
import { cn } from "@/lib/utils"

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    // Deliberate: rendering a clock server-side produces a hydration
    // mismatch against the client's actual time, per
    // plan/03-shell-menubar.md. Starts null, fills in post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 10_000)
    return () => clearInterval(id)
  }, [])
  return now
}

function downloadResume() {
  const a = document.createElement("a")
  a.href = socials.resume
  a.download = "DakshJain_Resume.pdf"
  a.click()
}

export function MenuBar() {
  const stack = useOS((s) => s.stack)
  const windows = useOS((s) => s.windows)
  const wallpaper = useOS((s) => s.wallpaper)
  const open = useOS((s) => s.open)
  const close = useOS((s) => s.close)
  const closeAll = useOS((s) => s.closeAll)
  const minimize = useOS((s) => s.minimize)
  const minimizeAll = useOS((s) => s.minimizeAll)
  const bringAllToFront = useOS((s) => s.bringAllToFront)
  const toggleMaximize = useOS((s) => s.toggleMaximize)
  const focus = useOS((s) => s.focus)
  const setMode = useOS((s) => s.setMode)
  const setWallpaper = useOS((s) => s.setWallpaper)
  const menuBarSolid = useOS((s) => s.menuBarSolid)
  const setMenuBarSolid = useOS((s) => s.setMenuBarSolid)

  const [openMenu, setOpenMenu] = useState<null | "id" | "file" | "view" | "window">(null)
  const now = useClock()

  const focused = stack[stack.length - 1] as AppId | undefined
  const openCount = stack.length
  const focusedTitle = focused ? apps[focused].title : "Finder"

  const menuOrder: ("id" | "file" | "view" | "window")[] = ["id", "file", "view", "window"]
  const requestNeighbor = (current: typeof openMenu) => (dir: 1 | -1) => {
    const idx = menuOrder.indexOf(current!)
    setOpenMenu(menuOrder[(idx + dir + menuOrder.length) % menuOrder.length])
  }

  const identityItems: MenuItemDef[] = [
    { kind: "action", label: "About This Mac", onSelect: () => open("about") },
    { kind: "action", label: "Skills", onSelect: () => open("settings") },
    { kind: "action", label: "Activity Monitor", onSelect: () => open("activity") },
    { kind: "separator" },
    { kind: "action", label: "Reader view", onSelect: () => setMode("reader") },
  ]

  const fileItems: MenuItemDef[] = [
    { kind: "action", label: "Open Resume", onSelect: () => open("preview") },
    { kind: "action", label: "Download Resume", onSelect: downloadResume },
    { kind: "separator" },
    {
      kind: "action",
      label: "Close Window",
      shortcut: "⌘W",
      disabled: !focused,
      onSelect: () => focused && close(focused),
    },
  ]

  const viewItems: MenuItemDef[] = [
    {
      kind: "action",
      label: "Mission Control",
      shortcut: "F3",
      disabled: openCount < 2,
      onSelect: () => setMode("missionControl"),
    },
    { kind: "separator" },
    {
      kind: "action",
      label: "Change Wallpaper",
      onSelect: () => {
        const idx = WALLPAPERS.indexOf(wallpaper as (typeof WALLPAPERS)[number])
        setWallpaper(WALLPAPERS[(idx + 1) % WALLPAPERS.length])
      },
    },
    {
      kind: "checkbox",
      label: "Show Menu Bar Background",
      checked: menuBarSolid,
      onSelect: () => setMenuBarSolid(!menuBarSolid),
    },
    { kind: "separator" },
    { kind: "action", label: "Reader view", onSelect: () => setMode("reader") },
  ]

  const windowItems: MenuItemDef[] = [
    {
      kind: "action",
      label: "Minimize",
      shortcut: "⌘M",
      disabled: !focused,
      onSelect: () => focused && minimize(focused),
    },
    { kind: "action", label: "Zoom", disabled: !focused, onSelect: () => focused && toggleMaximize(focused) },
    { kind: "separator" },
    { kind: "action", label: "Bring All to Front", disabled: openCount < 2, onSelect: bringAllToFront },
    { kind: "action", label: "Minimize All", disabled: openCount < 1, onSelect: minimizeAll },
    { kind: "action", label: "Close All", disabled: openCount < 1, onSelect: closeAll },
    ...(stack.length > 0
      ? ([{ kind: "separator" }] as MenuItemDef[]).concat(
          stack
            .slice()
            .reverse()
            .map(
              (id): MenuItemDef => ({
                kind: "radio",
                label: apps[id].title,
                checked: id === focused,
                onSelect: () => focus(id),
              })
            )
        )
      : []),
  ]

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[1000] flex items-center justify-between rounded-none px-2 transition-[background,backdrop-filter] duration-200",
        menuBarSolid ? "os-glass" : "os-glass-clear"
      )}
      style={{
        height: MENUBAR_H,
        // Real Tahoe's transparent bar is text floating on the wallpaper -
        // the shadow is what keeps it legible over bright regions instead
        // of a filled surface. Not needed once there's real glass behind it.
        textShadow: menuBarSolid ? undefined : "0 1px 3px rgb(0 0 0 / 0.45)",
      }}
      role="menubar"
    >
      <div className="flex items-center gap-1">
        <Menu
          label={<span className="px-1 font-semibold">dj</span>}
          ariaLabel="dj"
          items={identityItems}
          isOpen={openMenu === "id"}
          onOpenChange={(v) => setOpenMenu(v ? "id" : null)}
          onRequestNeighbor={requestNeighbor("id")}
        />
        <span className="px-1 text-xs font-semibold text-text">{focusedTitle}</span>
        <Menu
          label="File"
          ariaLabel="File"
          items={fileItems}
          isOpen={openMenu === "file"}
          onOpenChange={(v) => setOpenMenu(v ? "file" : null)}
          onRequestNeighbor={requestNeighbor("file")}
        />
        <Menu
          label="View"
          ariaLabel="View"
          items={viewItems}
          isOpen={openMenu === "view"}
          onOpenChange={(v) => setOpenMenu(v ? "view" : null)}
          onRequestNeighbor={requestNeighbor("view")}
        />
        <Menu
          label="Window"
          ariaLabel="Window"
          items={windowItems}
          isOpen={openMenu === "window"}
          onOpenChange={(v) => setOpenMenu(v ? "window" : null)}
          onRequestNeighbor={requestNeighbor("window")}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMode("reader")}
          aria-label="Switch to Reader view"
          className="flex items-center gap-1 rounded-[--r-control] px-2 py-0.5 text-xs text-text-2 hover:bg-panel-3 hover:text-text"
        >
          <BookOpen size={13} weight="light" />
          Reader view
        </button>
        <a
          href={socials.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub, opens in a new tab"
          className="text-text-2 hover:text-text"
        >
          <GithubLogo size={14} weight="light" />
        </a>
        <a
          href={socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn, opens in a new tab"
          className="text-text-2 hover:text-text"
        >
          <LinkedinLogo size={14} weight="light" />
        </a>
        <time
          dateTime={now?.toISOString()}
          className="font-mono text-xs text-text-2"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {now
            ? new Intl.DateTimeFormat(undefined, {
                weekday: "short",
                hour: "numeric",
                minute: "2-digit",
              }).format(now)
            : ""}
        </time>
      </div>
    </header>
  )
}
