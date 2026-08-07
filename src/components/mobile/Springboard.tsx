"use client"

import { AnimatePresence, motion } from "framer-motion"
import { appOrder, apps, dockLinks, type AppId } from "@/data/apps"
import { useOS } from "@/os/store"
import { Squircle } from "@/components/primitives/Squircle"
import { Wallpaper } from "@/components/shell/Wallpaper"
import { StatusBar } from "./StatusBar"
import { AppSheet } from "./AppSheet"

const PINNED: AppId[] = ["finder", "terminal", "mail", "preview"]

export function Springboard() {
  const stack = useOS((s) => s.stack)
  const open = useOS((s) => s.open)
  const close = useOS((s) => s.close)

  const openApp = stack[stack.length - 1]

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Wallpaper />
      <StatusBar />

      <main className="relative z-10 grid grid-cols-3 gap-x-4 gap-y-6 px-6 pt-4">
        {appOrder.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => open(id)}
            className="flex flex-col items-center gap-1"
          >
            <Squircle icon={apps[id].icon} tint={apps[id].tint} size={62} />
            <span
              className="rounded px-1 text-center text-[11px] leading-tight text-white"
              style={{ background: "rgb(0 0 0 / .3)" }}
            >
              {apps[id].title}
            </span>
          </button>
        ))}
        {dockLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label}, opens in a new tab`}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="flex h-[62px] w-[62px] items-center justify-center"
              style={{
                borderRadius: "22.5%",
                background: "linear-gradient(135deg, #3a3a3e, #232326)",
                boxShadow: "inset 0 1px 0 rgb(255 255 255 / .16)",
              }}
            >
              <link.icon size={31} weight="light" color="white" />
            </div>
            <span className="rounded px-1 text-center text-[11px] leading-tight text-white" style={{ background: "rgb(0 0 0 / .3)" }}>
              {link.label}
            </span>
          </a>
        ))}
      </main>

      <nav
        aria-label="Dock"
        className="os-glass fixed inset-x-3 z-10 flex items-center justify-around rounded-[26px] py-3"
        style={{ bottom: "max(24px, env(safe-area-inset-bottom))" }}
      >
        {PINNED.map((id) => (
          <button key={id} type="button" onClick={() => open(id)} aria-label={`Open ${apps[id].title}`}>
            <Squircle icon={apps[id].icon} tint={apps[id].tint} size={52} />
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {openApp && <AppSheet key={openApp} id={openApp} onClose={() => close(openApp)} />}
      </AnimatePresence>
    </div>
  )
}
