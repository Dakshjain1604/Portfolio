"use client"

import type { CSSProperties, ComponentType } from "react"
import type { IconProps } from "@phosphor-icons/react"
import type { AppId } from "@/data/apps"
import { AppGlyph } from "./AppGlyph"

type SquircleProps = {
  /** Fallback mark, used when no appId is given (the Dock's external
   *  links, which have no composed artwork of their own). */
  icon: ComponentType<IconProps>
  tint: [string, string]
  size?: number
  /** When set, AppGlyph draws that app's real composition instead of a
   *  centred outline glyph. */
  appId?: AppId
}

/** Apple's superellipse approximated as a percentage radius so it scales
 *  correctly at any tile size, per plan/00-architecture.md section 6. */
export const SQUIRCLE_RADIUS = "22.5%"

/**
 * Tahoe's app icons are described as "multiple layers of glass," and the
 * depth is the point: a single tinted gradient with one sheen on top
 * reads as a flat chip, which is what this shipped as before.
 *
 * Three real layers, exported as one recipe so DockIcon and Springboard
 * cannot drift from it. DockIcon in particular cannot render <Squircle>
 * itself, because its magnification motion values have to bind to its own
 * element's style rather than a child's - so it takes these objects
 * instead of duplicating the gradient strings by hand, which is what it
 * used to do.
 *
 *   1. base   the tint, plus a bottom-edge darkening so the tile has a
 *             lit-from-above direction rather than a flat ramp
 *   2. glass  a specular sweep and a rim that is bright at the top and
 *             fades by the bottom - the actual "sheet of glass over
 *             color" impression
 *   3. glyph  a soft drop shadow so the symbol floats above the glass
 *             instead of being printed on it
 */
export function squircleBase(tint: [string, string]): CSSProperties {
  return {
    borderRadius: SQUIRCLE_RADIUS,
    background: `radial-gradient(120% 80% at 50% 118%, rgb(0 0 0 / .28), transparent 62%), linear-gradient(160deg, ${tint[0]}, ${tint[1]})`,
    boxShadow: "inset 0 -1px 2px rgb(0 0 0 / .22), 0 2px 6px -1px rgb(0 0 0 / .45)",
  }
}

/** Absolutely positioned over the base. `inset: 0` plus the same radius. */
export const SQUIRCLE_GLASS: CSSProperties = {
  borderRadius: SQUIRCLE_RADIUS,
  background:
    "linear-gradient(150deg, rgb(255 255 255 / .38) 0%, rgb(255 255 255 / .1) 26%, transparent 52%)",
  boxShadow:
    "inset 0 1px 0 rgb(255 255 255 / .45), inset 0 0 0 .5px rgb(255 255 255 / .16)",
}

export const SQUIRCLE_GLYPH: CSSProperties = {
  filter: "drop-shadow(0 1px 1.5px rgb(0 0 0 / .35))",
}

export function Squircle({ icon: Icon, tint, size = 52, appId }: SquircleProps) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size, ...squircleBase(tint) }}
    >
      {appId ? (
        <AppGlyph id={appId} size={size} />
      ) : (
        <Icon size={size * 0.52} weight="fill" color="white" style={SQUIRCLE_GLYPH} />
      )}
      <span aria-hidden className="pointer-events-none absolute inset-0" style={SQUIRCLE_GLASS} />
    </div>
  )
}
