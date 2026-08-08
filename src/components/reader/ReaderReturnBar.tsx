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
    <div className="os-glass sticky top-0 z-10 flex h-9 items-center justify-between px-4">
      <span className="text-xs font-semibold text-text">dj</span>
      <button
        type="button"
        onClick={() => setMode("desktop")}
        className="rounded-(--r-control) bg-panel-3 px-3 py-1 text-xs text-text"
      >
        Back to desktop
      </button>
    </div>
  )
}
