"use client"

import { useEffect, useState } from "react"
import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr"
import { useOS } from "@/os/store"
import { apps, type AppId } from "@/data/apps"
import { socials } from "@/data/socials"
import { MENUBAR_H } from "@/os/types"
import { Menu, type MenuItemDef } from "./Menu"
import { ControlCenter } from "./ControlCenter"
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
        "fixed inset-x-0 top-0 z-[1000] flex items-center justify-between rounded-none border-x-0 border-t-0 px-2 transition-[background,backdrop-filter] duration-200",
        menuBarSolid ? "os-glass" : "os-glass-none"
      )}
      style={{
        height: MENUBAR_H,
        // Real Tahoe's transparent bar is text floating on the wallpaper -
        // the shadow is what keeps it legible over bright regions instead
        // of a filled surface. Not needed once there's real glass behind it.
        textShadow: menuBarSolid ? undefined : "var(--wp-chrome-shadow)",
      }}
      role="menubar"
    >
      <div className="flex items-center gap-1">
        <Menu
          // The Apple menu is a mark, not a word - it is the one item in the
          // bar you identify by shape. Rendering "dj" as plain semibold text
          // put it in the same visual class as the app name beside it, so it
          // read as a stray label rather than the menu everything hangs off.
          label={
            <span
              className="grid h-[17px] w-[17px] place-items-center rounded-[5px] text-[10px] leading-none font-bold tracking-tight text-white"
              style={{
                background: "linear-gradient(160deg, #4a4a4f, #1f1f22)",
                boxShadow: "inset 0 1px 0 rgb(255 255 255 / .22), 0 1px 2px rgb(0 0 0 / .4)",
                textShadow: "none",
              }}
            >
              dj
            </span>
          }
          ariaLabel="Daksh Jain"
          items={identityItems}
          isOpen={openMenu === "id"}
          onOpenChange={(v) => setOpenMenu(v ? "id" : null)}
          onRequestNeighbor={requestNeighbor("id")}
        />
        <span className={cn("px-1 text-xs font-semibold", menuBarSolid ? "text-text" : "text-wp-text")}>
          {focusedTitle}
        </span>
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

      {/* Tahoe's menu bar consolidates its right side into Control Center
          rather than a loose row of controls. Reader view moved in there;
          GitHub and LinkedIn stay out because they are navigation, not
          system state. See plan/20-tahoe-refinement.md phase E. */}
      <div className="flex items-center gap-3">
        <ControlCenter />
        <a
          href={socials.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub, opens in a new tab"
          className={cn(
            "transition-colors",
            menuBarSolid ? "text-text-2 hover:text-text" : "text-wp-text-2 hover:text-wp-text"
          )}
        >
          {/* `light` at 14px is a few sub-pixel hairlines - at menu bar size
              these were legible as "an icon" but not as which icon. */}
          <GithubLogo size={15} weight="fill" />
        </a>
        <a
          href={socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn, opens in a new tab"
          className={cn(
            "transition-colors",
            menuBarSolid ? "text-text-2 hover:text-text" : "text-wp-text-2 hover:text-wp-text"
          )}
        >
          <LinkedinLogo size={15} weight="fill" />
        </a>
        <time
          dateTime={now?.toISOString()}
          // Sans, not mono: the macOS clock is set in the system UI face.
          // tabular-nums is the part that actually matters, so the bar does
          // not reflow every time a digit changes width.
          className={cn("text-xs", menuBarSolid ? "text-text-2" : "text-wp-text-2")}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {now
            ? new Intl.DateTimeFormat(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              }).format(now)
            : ""}
        </time>
      </div>
    </header>
  )
}
