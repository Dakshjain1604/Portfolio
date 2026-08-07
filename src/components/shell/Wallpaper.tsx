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
            backgroundImage: [
              "radial-gradient(ellipse 900px 700px at 15% 10%, rgb(45 90 85 / .35), transparent 60%)",
              "radial-gradient(ellipse 800px 900px at 85% 30%, rgb(60 55 90 / .30), transparent 60%)",
              "radial-gradient(ellipse 1000px 800px at 50% 100%, rgb(70 70 65 / .25), transparent 60%)",
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
        style={{ boxShadow: "inset 0 0 200px rgb(0 0 0 / .35)" }}
      />
    </div>
  )
}
