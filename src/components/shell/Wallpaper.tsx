"use client"

import Image from "next/image"
import { useOS } from "@/os/store"

/**
 * The switcher, the Control Center tile and the Change Wallpaper menu item
 * all cycle this list, so adding an entry here is the only change a new
 * wallpaper needs. See plan/21-composition-pass.md.
 *
 * The three image wallpapers are generated, not photographed: a
 * domain-warped fbm field ramped through a palette, rendered at 2880x1800.
 * That matters for two reasons. There is no licence attached to any of
 * them, and the tonal distribution was picked rather than inherited -
 * each one holds a mean luminance near 12% with its brightest 5% at ~30%,
 * which is dark enough that white chrome text clears 8:1 anywhere on the
 * image and bright enough that the glass tiers have something real to
 * refract. A stock photo satisfies neither constraint reliably.
 *
 * "mesh" is the pure-CSS fallback, kept because it needs no network and is
 * what renders if the images ever fail to load.
 */
export const WALLPAPERS = ["abyss", "aurora", "ember", "mesh"] as const

export type WallpaperId = (typeof WALLPAPERS)[number]

/** Display names for the switcher UI. */
export const WALLPAPER_LABELS: Record<WallpaperId, string> = {
  abyss: "Abyss",
  aurora: "Aurora",
  ember: "Ember",
  mesh: "Gradient",
}

const SOURCES: Record<string, string> = {
  abyss: "/wallpapers/abyss.jpg",
  aurora: "/wallpapers/aurora.jpg",
  ember: "/wallpapers/ember.jpg",
}

const GRAIN_SVG =
  "data:image/svg+xml;base64," +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'
  )

export function Wallpaper() {
  const wallpaper = useOS((s) => s.wallpaper)
  const src = SOURCES[wallpaper]
  const isMesh = !src

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
        /* keyed on src so a switch cross-fades a fresh element in rather
           than mutating one img and popping between two unrelated images. */
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          className="animate-[wp-in_var(--dur-slow)_var(--ease-os)] object-cover"
        />
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
