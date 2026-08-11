"use client"

import { AnimatePresence, motion } from "framer-motion"
import { appOrder, apps, dockLinks, type AppId } from "@/data/apps"
import { useOS } from "@/os/store"
import { profile } from "@/data/profile"
import { Squircle, squircleBase, SQUIRCLE_GLASS } from "@/components/primitives/Squircle"
import { LinkGlyph } from "@/components/primitives/AppGlyph"
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

      {/* An iOS home screen widget, which is both the authentic way to put
          non-icon content on a springboard and the fix for two problems at
          once: the grid ended a third of the way down the screen and left
          the rest empty, and - as on the desktop before DesktopHero - the
          visitor's name appeared nowhere on the landing view. */}
      <header className="os-glass relative z-10 mx-4 mt-2 rounded-(--r-window) px-5 py-4">
        <p className="text-[1.65rem] leading-tight font-semibold tracking-[-0.03em] text-text">
          {profile.name}
        </p>
        <p className="mt-1.5 font-mono text-[10px] tracking-[0.16em] text-link uppercase">
          {profile.role}
          <span className="text-text-3">{" // "}</span>
          {profile.employer.name}
        </p>
        <p className="mt-2.5 text-[13px] leading-snug text-balance text-text-2">{profile.tagline}</p>
      </header>

      <main className="relative z-10 grid grid-cols-3 gap-x-4 gap-y-5 px-6 pt-6">
        {appOrder.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => open(id)}
            className="flex flex-col items-center gap-1"
          >
            <Squircle icon={apps[id].icon} tint={apps[id].tint} size={62} appId={id} />
            <span
              /* No pill, matching DesktopIcons: iOS labels its icons with
                 shadowed text, and eleven dark chips in a grid read as UI
                 chrome rather than as names. */
              className="text-center text-[11px] leading-tight text-white"
              style={{ textShadow: "0 1px 3px rgb(0 0 0 / .85), 0 0 10px rgb(0 0 0 / .5)" }}
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
              className="relative flex h-[62px] w-[62px] items-center justify-center"
              style={squircleBase(link.tint)}
            >
              <LinkGlyph id={link.id} size={62} />
              <span aria-hidden className="pointer-events-none absolute inset-0" style={SQUIRCLE_GLASS} />
            </div>
            <span
              /* No pill, matching DesktopIcons: iOS labels its icons with
                 shadowed text, and eleven dark chips in a grid read as UI
                 chrome rather than as names. */
              className="text-center text-[11px] leading-tight text-white"
              style={{ textShadow: "0 1px 3px rgb(0 0 0 / .85), 0 0 10px rgb(0 0 0 / .5)" }}
            >
              {link.label}
            </span>
          </a>
        ))}
      </main>

      <nav
        aria-label="Dock"
        className="os-glass fixed inset-x-3 z-10 flex items-center justify-around rounded-(--r-chip) py-3"
        style={{ bottom: "max(24px, env(safe-area-inset-bottom))" }}
      >
        {PINNED.map((id) => (
          <button key={id} type="button" onClick={() => open(id)} aria-label={`Open ${apps[id].title}`}>
            <Squircle icon={apps[id].icon} tint={apps[id].tint} size={52} appId={id} />
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {openApp && <AppSheet key={openApp} id={openApp} onClose={() => close(openApp)} />}
      </AnimatePresence>
    </div>
  )
}
