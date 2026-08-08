"use client"

import { useOS } from "@/os/store"

/** Only chrome in reader mode. Not a full menu bar - see
 *  plan/17-reader-view.md "Entering". Renders nothing while the desktop
 *  is active; DesktopShell paints over this either way in that state. */
export function ReaderReturnBar() {
  const mode = useOS((s) => s.mode)
  const setMode = useOS((s) => s.setMode)

  if (mode !== "reader") return null

  return (
    // border-x-0/-t-0: .os-glass sets all four sides, and a full-bleed bar
    // does not want a hairline running down the viewport edges. Only
    // possible now that the glass tiers live in @layer components, where a
    // utility can beat them.
    <div className="os-glass sticky top-0 z-10 flex h-9 items-center justify-between rounded-none border-x-0 border-t-0 px-4">
      <span className="text-xs font-semibold text-text">dj</span>
      <button
        type="button"
        onClick={() => setMode("desktop")}
        className="os-press rounded-(--r-pill) bg-panel-3 px-3 py-1 text-xs text-text"
      >
        Back to desktop
      </button>
    </div>
  )
}
