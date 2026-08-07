"use client"

import type { ComponentType } from "react"
import type { IconProps } from "@phosphor-icons/react"

type SquircleProps = {
  icon: ComponentType<IconProps>
  tint: [string, string]
  size?: number
}

/** Apple's superellipse approximated as a percentage radius so it scales
 *  correctly at any tile size, per plan/00-architecture.md section 6.
 *
 *  Liquid Glass modernization (plan/19): a specular sheen layer sits
 *  above the tint gradient, same multi-background-layer trick as
 *  .os-glass, so app icons read as "glass over color" rather than a flat
 *  gradient chip - Tahoe's cited "multiple layers of Liquid Glass" for
 *  icons and widgets. */
export function Squircle({ icon: Icon, tint, size = 52 }: SquircleProps) {
  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: "22.5%",
        background: `linear-gradient(135deg, rgb(255 255 255 / .22) 0%, transparent 32%, transparent 68%, rgb(255 255 255 / .08) 100%), linear-gradient(135deg, ${tint[0]}, ${tint[1]})`,
        boxShadow: "inset 0 1px 0 rgb(255 255 255 / .3), inset 0 -1px 0 rgb(0 0 0 / .12)",
      }}
    >
      <Icon size={size * 0.55} weight="light" color="white" />
    </div>
  )
}
