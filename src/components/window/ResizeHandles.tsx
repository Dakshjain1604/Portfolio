"use client"

import type { Edge } from "@/os/useWindowResize"

type ResizeHandlesProps = {
  onStart: (edge: Edge, e: React.PointerEvent<HTMLElement>) => void
}

const EDGE_CURSOR: Record<Edge, string> = {
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
  nw: "nwse-resize",
  se: "nwse-resize",
  ne: "nesw-resize",
  sw: "nesw-resize",
}

// Corner boxes are sized to --r-window (20px) so they cover the whole
// curve, and the edge handles start exactly where the corners end. At the
// old 14px sizing the two left a 4px dead strip on each side that looked
// like a broken hit target. The frame clips overflow, so the negative
// offsets only widen the grab area inward.
const EDGE_STYLE: Record<Edge, React.CSSProperties> = {
  n: { top: -3, left: 18, right: 18, height: 6 },
  s: { bottom: -3, left: 18, right: 18, height: 6 },
  e: { right: -3, top: 18, bottom: 18, width: 6 },
  w: { left: -3, top: 18, bottom: 18, width: 6 },
  nw: { top: -2, left: -2, width: 20, height: 20 },
  ne: { top: -2, right: -2, width: 20, height: 20 },
  sw: { bottom: -2, left: -2, width: 20, height: 20 },
  se: { bottom: -2, right: -2, width: 20, height: 20 },
}

const EDGES: Edge[] = ["n", "s", "e", "w", "nw", "ne", "sw", "se"]
const CORNERS = new Set<Edge>(["nw", "ne", "sw", "se"])

export function ResizeHandles({ onStart }: ResizeHandlesProps) {
  return (
    <>
      {EDGES.map((edge) => (
        <div
          key={edge}
          onPointerDown={(e) => onStart(edge, e)}
          className="absolute"
          style={{
            ...EDGE_STYLE[edge],
            cursor: EDGE_CURSOR[edge],
            zIndex: CORNERS.has(edge) ? 2 : 1,
            touchAction: "none",
          }}
          aria-hidden
        />
      ))}
    </>
  )
}
