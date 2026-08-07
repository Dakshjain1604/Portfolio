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

const EDGE_STYLE: Record<Edge, React.CSSProperties> = {
  n: { top: -3, left: 14, right: 14, height: 6 },
  s: { bottom: -3, left: 14, right: 14, height: 6 },
  e: { right: -3, top: 14, bottom: 14, width: 6 },
  w: { left: -3, top: 14, bottom: 14, width: 6 },
  nw: { top: -4, left: -4, width: 14, height: 14 },
  ne: { top: -4, right: -4, width: 14, height: 14 },
  sw: { bottom: -4, left: -4, width: 14, height: 14 },
  se: { bottom: -4, right: -4, width: 14, height: 14 },
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
