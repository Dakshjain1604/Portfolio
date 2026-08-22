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

/** Real macOS traffic lights are almost flat: solid saturated colour, a
 *  barely-there top highlight, no outer glow, no glossy spotlight. Phase
 *  20B's "little glass bead" recipe (radial spotlight highlight + a
 *  colour-tinted outer glow) was a heavier, softer look than that -
 *  correcting the glow's blur radius made it smaller but the bead was
 *  still built from the same soft-edged ingredients. This drops the
 *  glow and the spotlight gradient entirely: a flat fill plus one
 *  hairline-thin inset highlight is what actually reads as crisp next
 *  to a real macOS reference rather than "glowing." */
function dotStyle(tint: string, focused: boolean): React.CSSProperties {
  if (!focused) {
    // A real mid-grey (Apple's systemGray, both appearances already
    // defined in globals.css), not "white at low alpha": that recipe only
    // has contrast against dark chrome, and reads as nearly invisible
    // once the titlebar itself goes light. Real macOS keeps this bead a
    // genuine grey rather than a backdrop-dependent tint.
    return { background: "var(--sys-gray)" }
  }
  return {
    background: tint,
    boxShadow: "inset 0 1px 0.5px rgb(255 255 255 / .3), inset 0 -1px 1px rgb(0 0 0 / .18)",
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
