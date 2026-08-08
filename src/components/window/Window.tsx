"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { apps, type AppId } from "@/data/apps"
import { useOS } from "@/os/store"
import { useWindowDrag } from "@/os/useWindowDrag"
import { useWindowResize } from "@/os/useWindowResize"
import { useGlassPointer } from "@/os/useGlassPointer"
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
 *
 * Phase 20B: the inner element is now real glass rather than an opaque
 * panel, and the app's content sits on a separate near-opaque plate
 * floating inside it - Tahoe's layered window, and the reason body copy
 * stays legible over a bright wallpaper. The title bar keeps no material
 * of its own because Apple's rule is that glass never samples glass; it
 * is simply a transparent region of the frame with a scroll edge blur
 * below it. See plan/20-tahoe-refinement.md.
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

  const frameRef = useRef<HTMLDivElement>(null)
  useGlassPointer(frameRef)

  // will-change is set only while actively dragging or resizing, per
  // plan/02-window-manager.md section 6: leaving it on for nine persistent
  // windows costs more compositor memory than it saves.
  const [interacting, setInteracting] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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

  // Unfocused windows pull their blur back rather than only dimming the
  // title. It is Tahoe's real depth cue and it doubles as the performance
  // lever: with nine windows open only the focused one pays for a 30px
  // backdrop blur. Written as an inline pair rather than in globals.css
  // because React emits both keys itself, so the Lightning CSS prefix
  // dedup that bit phase 19 cannot apply here.
  const blur = focused ? undefined : "blur(12px) saturate(140%)"

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
        ref={frameRef}
        className="os-glass h-full w-full overflow-hidden rounded-(--r-window)"
        style={{
          transformOrigin: genieOrigin,
          boxShadow: `inset 0 1px 0 var(--os-edge-inner), ${shadow}`,
          transition: shadowTransition,
          backdropFilter: blur,
          WebkitBackdropFilter: blur,
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
          {/* No material of its own: the frame's glass shows straight
              through, which is what stops two blurs stacking here. */}
          <header
            onPointerDown={(e) => {
              setInteracting(true)
              drag.onPointerDown(e)
            }}
            className="relative flex h-[38px] shrink-0 items-center justify-center px-3"
            style={{ cursor: "grab" }}
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

          {/* The gutter is what makes the plate read as floating inside
              the frame, and --r-inset is the same value --r-float is
              derived from, so the two curves stay concentric at any
              --r-window. Apps own their own surface tier: content apps
              use .os-plate, while Terminal, Preview and Orchestrator
              keep their deliberately opaque backgrounds. */}
          <div
            className="relative min-h-0 flex-1 px-(--r-inset) pb-(--r-inset)"
            // scroll does not bubble, but it does reach ancestors during
            // capture, which is the only way to observe it from here - the
            // scroll container belongs to whichever app is mounted, and
            // every app structures its own differently.
            onScrollCapture={(e) => {
              const next = (e.target as HTMLElement).scrollTop > 2
              setScrolled((prev) => (prev === next ? prev : next))
            }}
          >
            {(() => {
              const AppContent = appRegistry[id]
              return <AppContent windowId={id} />
            })()}
            {/* Tahoe's scroll edge is a response to scrolling, not a
                permanent fixture. Left always-on it would sit blurring
                Finder's static search row forever. */}
            <div
              aria-hidden
              className="os-scroll-edge os-scroll-edge-top absolute top-0 h-6 rounded-t-(--r-float) transition-opacity duration-200"
              style={{ left: "var(--r-inset)", right: "var(--r-inset)", opacity: scrolled ? 1 : 0 }}
            />
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
