"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { apps, type AppId } from "@/data/apps"
import { useOS } from "@/os/store"
import { useWindowDrag } from "@/os/useWindowDrag"
import { useWindowResize } from "@/os/useWindowResize"
import { useReducedMotion } from "@/os/ReducedMotionContext"
import { getDockIconCenter } from "@/os/dockIconRects"
import { appRegistry } from "@/components/apps/registry"
import { TrafficLights } from "./TrafficLights"
import { ResizeHandles } from "./ResizeHandles"

type WindowProps = { id: AppId }

/**
 * Two nested motion elements, deliberately not one, because framer-motion
 * cannot mix a style-bound MotionValue and an `animate`-driven target on the
 * same transform key.
 *
 * The OUTER element is a bare physics wrapper: x, y, width, height, tilt
 * (rotateX/rotateY) as raw MotionValues per the no-state-during-drag rule
 * in plan/02-window-manager.md section 1. It carries no visible chrome of
 * its own, so it is fully invisible and non-interactive while minimized -
 * an earlier version put the border/shadow here, which left a static empty
 * outline on screen after minimizing since only the inner content faded.
 *
 * The INNER element owns every visible pixel (border, shadow, background,
 * rounded clipping) plus the discrete genie open/close/minimize transition
 * via `initial`/`animate`/`exit`, using scale + opacity rather than the
 * spec's compound rotateX so it never collides with the outer's tilt.
 */
export function Window({ id }: WindowProps) {
  const meta = apps[id]
  const state = useOS((s) => s.windows[id])
  const stackIndex = useOS((s) => s.stack.indexOf(id))
  const stackLength = useOS((s) => s.stack.length)
  const reducedMotion = useReducedMotion()

  const close = useOS((s) => s.close)
  const minimize = useOS((s) => s.minimize)
  const toggleMaximize = useOS((s) => s.toggleMaximize)
  const focus = useOS((s) => s.focus)

  const rect = state?.rect ?? meta.defaultRect
  const focused = stackIndex === stackLength - 1
  const minimized = state?.status === "minimized"

  const drag = useWindowDrag(id, rect, reducedMotion)
  const resize = useWindowResize(id, rect, meta.minSize, drag.x, drag.y)

  // will-change is set only while actively dragging or resizing, per
  // plan/02-window-manager.md section 6: leaving it on for nine persistent
  // windows costs more compositor memory than it saves.
  const [interacting, setInteracting] = useState(false)
  useEffect(() => {
    const onUp = () => setInteracting(false)
    window.addEventListener("pointerup", onUp)
    return () => window.removeEventListener("pointerup", onUp)
  }, [])

  const genieOrigin = useMemo(() => {
    const icon = getDockIconCenter(id)
    if (!icon) return "50% 100%"
    const originX = ((icon.x - rect.x) / rect.w) * 100
    const originY = ((icon.y - rect.y) / rect.h) * 100
    return `${originX}% ${originY}%`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!state) return null

  const depth = reducedMotion ? 0 : stackIndex * 3
  const shadow = focused ? "var(--shadow-focused)" : "var(--shadow-rest)"
  const shadowTransition = "box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1)"

  // boxShadow deliberately does NOT go through framer's `animate` - framer
  // cannot interpolate a box-shadow value that is a var(...) reference (it
  // needs concrete numeric shadow syntax to tween), and silently hangs the
  // entire animation on that motion component when given one. A plain CSS
  // transition on box-shadow has no such limitation and needs no spring.
  const genieTransition = reducedMotion
    ? { duration: 0.14 }
    : { type: "spring" as const, stiffness: 200, damping: 24 }

  const genieRest = reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
  const genieHidden = reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.06 }

  return (
    <motion.div
      role="region"
      aria-label={meta.title}
      aria-hidden={minimized}
      onPointerDownCapture={() => focus(id)}
      className="absolute"
      style={{
        x: drag.x,
        y: drag.y,
        width: resize.w,
        height: resize.h,
        rotateX: drag.rotateX,
        rotateY: drag.rotateY,
        // explicit per plan/00-architecture.md's z-index scale (100 + depth,
        // capped at 799): DesktopIcons carries an explicit z-10, and CSS
        // treats z-index:auto siblings as z-0 for stacking purposes
        // regardless of DOM order, so an unset z-index here would let
        // desktop icons paint over every window.
        zIndex: 100 + Math.min(stackIndex, 699),
        pointerEvents: minimized ? "none" : "auto",
        willChange: interacting ? "transform" : "auto",
      }}
      animate={{ translateZ: depth }}
      transition={{ duration: 0.14, ease: [0.32, 0.72, 0, 1] }}
    >
      <motion.div
        className="h-full w-full overflow-hidden rounded-[--r-window] bg-panel"
        style={{
          transformOrigin: genieOrigin,
          border: "1px solid var(--os-edge)",
          boxShadow: shadow,
          transition: shadowTransition,
        }}
        initial={genieHidden}
        animate={minimized ? genieHidden : genieRest}
        transition={genieTransition}
        exit={genieHidden}
      >
        <div
          aria-hidden={minimized}
          className="flex h-full flex-col"
          style={{ pointerEvents: minimized ? "none" : "auto" }}
        >
          <header
            onPointerDown={(e) => {
              setInteracting(true)
              drag.onPointerDown(e)
            }}
            className="os-glass relative flex h-[38px] shrink-0 items-center justify-center px-3"
            style={{ cursor: "grab", borderRadius: 0 }}
          >
            <div className="absolute left-3">
              <TrafficLights
                title={meta.title}
                focused={focused}
                onClose={() => close(id)}
                onMinimize={() => minimize(id)}
                onMaximize={() => toggleMaximize(id)}
              />
            </div>
            <h2
              className="truncate text-xs font-medium"
              style={{ color: focused ? "var(--os-text)" : "var(--os-text-2)" }}
            >
              {meta.title}
            </h2>
          </header>

          <div className="flex-1 overflow-auto">
            {(() => {
              const AppContent = appRegistry[id]
              return <AppContent windowId={id} />
            })()}
          </div>
        </div>

        <ResizeHandles
          onStart={(edge, e) => {
            setInteracting(true)
            resize.startResize(edge, e)
          }}
        />
      </motion.div>
    </motion.div>
  )
}
