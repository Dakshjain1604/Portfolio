"use client"

import { useEffect, useRef, useState } from "react"
import { FolderSimple, FilePdf, FileText } from "@phosphor-icons/react/dist/ssr"
import { useOS } from "@/os/store"
import { readmeDesktopIcon, type AppId } from "@/data/apps"

type DesktopIconDef = { label: string; opens: AppId; icon: typeof FolderSimple }

const ICONS: DesktopIconDef[] = [
  { label: "Projects", opens: "finder", icon: FolderSimple },
  { label: "Resume.pdf", opens: "preview", icon: FilePdf },
  { label: readmeDesktopIcon.label, opens: readmeDesktopIcon.opens, icon: FileText },
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
            className="flex w-[76px] flex-col items-center gap-1 rounded-[--r-control] p-1.5"
            style={{ background: selected === i ? "var(--os-accent-soft)" : "transparent" }}
          >
            <item.icon size={32} weight="light" color="white" />
            <span
              className="rounded px-1 text-center text-[11px] leading-tight text-white"
              style={{ background: "rgb(0 0 0 / .35)" }}
            >
              {item.label}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
