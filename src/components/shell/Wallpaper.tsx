"use client"

import Image from "next/image"
import { useOS } from "@/os/store"

/**
 * "mesh" is the CSS default, always available. Real files dropped into
 * public/wallpapers/ (see plan/05-shell-desktop.md and the two-item gap
 * list in MacOS.md section 9) can be added here with no other code change;
 * the switcher and Change Wallpaper menu item both read this list.
 */
export const WALLPAPERS = ["mesh"] as const

const GRAIN_SVG =
  "data:image/svg+xml;base64," +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'
  )

export function Wallpaper() {
  const wallpaper = useOS((s) => s.wallpaper)
  const isMesh = wallpaper === "mesh" || !wallpaper

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-void">
      {isMesh ? (
        <div
          className="absolute inset-0"
          style={{
            // Phase 20: brightened hard. A glass material only exists
            // relative to what is behind it, and the previous mesh sat at
            // .25-.35 alpha over a near-black void, so every window's
            // blur, sheen and rim were sampling almost nothing. These are
            // the same three hues, pushed to a luminance where the glass
            // actually has something to refract. Still dark enough that
            // white chrome text clears 4.5:1 everywhere.
            backgroundImage: [
              "radial-gradient(ellipse 1100px 850px at 12% 4%, rgb(28 118 126 / .55), transparent 62%)",
              "radial-gradient(ellipse 950px 1000px at 88% 22%, rgb(58 74 168 / .5), transparent 62%)",
              "radial-gradient(ellipse 900px 700px at 72% 92%, rgb(150 92 58 / .34), transparent 60%)",
              "radial-gradient(ellipse 1200px 900px at 34% 108%, rgb(40 96 92 / .42), transparent 62%)",
            ].join(", "),
          }}
        />
      ) : (
        <Image src={wallpaper} alt="" fill priority className="object-cover" />
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: `url(${GRAIN_SVG})` }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 260px rgb(0 0 0 / .3)" }}
      />
    </div>
  )
}
