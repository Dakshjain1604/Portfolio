"use client"

import { X, Minus, ArrowsOutSimple } from "@phosphor-icons/react/dist/ssr"

type TrafficLightsProps = {
  title: string
  focused: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
}

const DOT = "relative flex h-3 w-3 items-center justify-center rounded-full transition-[background,box-shadow] duration-150"
const GLYPH = "relative opacity-0 group-hover/lights:opacity-100 text-black/60"

/** Phase 20B: Tahoe's dots are little glass beads, not flat circles. Three
 *  layers, same recipe the Squircle and .os-glass use - a top-left specular
 *  bloom, the tint itself, and an inset rim that is bright along the top
 *  edge and dark along the bottom so the bead reads as lit from above. The
 *  outer glow is what makes it look like colored glass rather than paint. */
function dotStyle(tint: string, focused: boolean): React.CSSProperties {
  if (!focused) {
    return {
      background: "rgb(255 255 255 / .16)",
      boxShadow: "inset 0 1px 0 rgb(255 255 255 / .12)",
    }
  }
  return {
    background: `radial-gradient(circle at 32% 26%, rgb(255 255 255 / .55), transparent 58%), ${tint}`,
    boxShadow: `inset 0 1px 0 rgb(255 255 255 / .35), inset 0 -1px 1px rgb(0 0 0 / .28), 0 0 6px -1px ${tint}`,
  }
}

export function TrafficLights({ title, focused, onClose, onMinimize, onMaximize }: TrafficLightsProps) {
  return (
    <div className="group/lights flex items-center gap-2">
      <button
        type="button"
        aria-label={`Close ${title}`}
        onClick={onClose}
        className={DOT}
        style={dotStyle("var(--tl-red)", focused)}
      >
        <X size={8} weight="bold" className={GLYPH} />
      </button>
      <button
        type="button"
        aria-label={`Minimize ${title}`}
        onClick={onMinimize}
        className={DOT}
        style={dotStyle("var(--tl-amber)", focused)}
      >
        <Minus size={8} weight="bold" className={GLYPH} />
      </button>
      <button
        type="button"
        aria-label={`Maximize ${title}`}
        onClick={onMaximize}
        className={DOT}
        style={dotStyle("var(--tl-green)", focused)}
      >
        <ArrowsOutSimple size={7} weight="bold" className={GLYPH} />
      </button>
    </div>
  )
}
