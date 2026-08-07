"use client"

import { X, Minus, ArrowsOutSimple } from "@phosphor-icons/react/dist/ssr"

type TrafficLightsProps = {
  title: string
  focused: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
}

const DOT = "relative flex h-3 w-3 items-center justify-center rounded-full transition-colors"
const GLYPH = "opacity-0 group-hover/lights:opacity-100 text-black/60"

export function TrafficLights({ title, focused, onClose, onMinimize, onMaximize }: TrafficLightsProps) {
  return (
    <div className="group/lights flex items-center gap-2">
      <button
        type="button"
        aria-label={`Close ${title}`}
        onClick={onClose}
        className={DOT}
        style={{ background: focused ? "var(--tl-red)" : "rgb(255 255 255 / .18)" }}
      >
        <X size={8} weight="bold" className={GLYPH} />
      </button>
      <button
        type="button"
        aria-label={`Minimize ${title}`}
        onClick={onMinimize}
        className={DOT}
        style={{ background: focused ? "var(--tl-amber)" : "rgb(255 255 255 / .18)" }}
      >
        <Minus size={8} weight="bold" className={GLYPH} />
      </button>
      <button
        type="button"
        aria-label={`Maximize ${title}`}
        onClick={onMaximize}
        className={DOT}
        style={{ background: focused ? "var(--tl-green)" : "rgb(255 255 255 / .18)" }}
      >
        <ArrowsOutSimple size={7} weight="bold" className={GLYPH} />
      </button>
    </div>
  )
}
