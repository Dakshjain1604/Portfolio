"use client"

import { useEffect, useRef, useState } from "react"
import { FolderSimple, FilePdf, FileText } from "@phosphor-icons/react/dist/ssr"
import { useOS } from "@/os/store"
import { readmeDesktopIcon, type AppId } from "@/data/apps"
import { SQUIRCLE_GLYPH } from "@/components/primitives/Squircle"

type DesktopIconDef = { label: string; opens: AppId; icon: typeof FolderSimple; color: string }

/**
 * Filled, coloured and 44px, not 32px outlines in white.
 *
 * macOS desktop icons are small pieces of artwork: the folder is the one
 * saturated blue object on the desktop, and documents are white pages whose
 * type shows through as a cut-out. Rendering all three as `weight="light"`
 * white strokes - which is what this did - is the same mistake AppGlyph.tsx
 * documents for the Dock, and it read as a generic icon set rather than as
 * a desktop.
 */
const ICONS: DesktopIconDef[] = [
  { label: "Projects", opens: "finder", icon: FolderSimple, color: "#54a8ff" },
  { label: "Resume.pdf", opens: "preview", icon: FilePdf, color: "#f2f2f4" },
  { label: readmeDesktopIcon.label, opens: readmeDesktopIcon.opens, icon: FileText, color: "#f2f2f4" },
]

export function DesktopIcons() {
  const open = useOS((s) => s.open)
  const [selected, setSelected] = useState<number | null>(null)
  const rootRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (selected === null) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setSelected(null)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [selected])

  return (
    <ul
      ref={rootRef}
      className="absolute right-4 top-10 z-10 flex flex-col gap-3"
      onKeyDown={(e) => {
        const current = selected ?? 0
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelected((current + 1) % ICONS.length)
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelected((current - 1 + ICONS.length) % ICONS.length)
        } else if (e.key === "Enter" && selected !== null) {
          e.preventDefault()
          open(ICONS[selected].opens)
        }
      }}
    >
      {ICONS.map((item, i) => (
        <li key={item.label}>
          <button
            type="button"
            onClick={() => setSelected(i)}
            onDoubleClick={() => open(item.opens)}
            className="flex w-[84px] flex-col items-center gap-1.5 rounded-(--r-control) p-1.5 transition-[background] duration-(--dur-fast)"
            style={{ background: selected === i ? "var(--os-accent-soft)" : "transparent" }}
          >
            {/* Desktop file icons stay bare glyphs rather than becoming
                squircles - macOS reserves the tile for apps. The shadow is
                what makes them sit ON the wallpaper instead of being
                printed into it. */}
            <item.icon size={44} weight="fill" color={item.color} style={SQUIRCLE_GLYPH} />
            {/* No pill. macOS shows a solid label background only while the
                icon is selected; the resting state is text with a shadow,
                and three dark chips stacked down the edge of the screen
                read as UI where they should read as filenames. */}
            <span
              className="rounded-[5px] px-1.5 text-center text-[11px] leading-tight text-white"
              style={
                selected === i
                  ? { background: "var(--os-accent-fill)" }
                  : { textShadow: "0 1px 3px rgb(0 0 0 / .8), 0 0 12px rgb(0 0 0 / .5)" }
              }
            >
              {item.label}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
