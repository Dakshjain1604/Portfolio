"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { useOS } from "@/os/store"
import { Window } from "@/components/window/Window"
import { Wallpaper } from "./Wallpaper"
import { DesktopHero } from "./DesktopHero"
import { DesktopIcons } from "./DesktopIcons"
import { Dock } from "./Dock"
import { MenuBar } from "./MenuBar"
import { ContextMenu, type ContextMenuState } from "./ContextMenu"
import { MissionControl } from "./MissionControl"
import { BootSequence } from "./BootSequence"

export function Desktop() {
  const stack = useOS((s) => s.stack)
  const [menuState, setMenuState] = useState<ContextMenuState>(null)

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ perspective: 1400, transformStyle: "preserve-3d" }}
      onContextMenu={(e) => {
        // Right-click inside a window, the Dock, or the menu bar falls
        // through to the browser's native menu, per
        // plan/05-shell-desktop.md section 4 - only the bare desktop gets
        // the custom one.
        const el = e.target as HTMLElement
        if (el.closest('[role="region"], nav, header')) return
        e.preventDefault()
        setMenuState({ x: e.clientX, y: e.clientY })
      }}
    >
      <Wallpaper />
      <DesktopHero />
      <DesktopIcons />

      <AnimatePresence>
        {stack.map((id) => (
          <Window key={id} id={id} />
        ))}
      </AnimatePresence>

      <Dock />
      <MenuBar />
      <ContextMenu state={menuState} onClose={() => setMenuState(null)} />
      <MissionControl />
      <BootSequence />
    </div>
  )
}
