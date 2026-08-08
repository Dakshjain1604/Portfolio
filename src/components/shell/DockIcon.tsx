"use client"

import { useEffect, useRef, useState } from "react"
import { motion, type MotionValue } from "framer-motion"
import { useOS } from "@/os/store"
import { apps, type AppId } from "@/data/apps"
import { setDockIconCenter } from "@/os/dockIconRects"
import { useReducedMotion } from "@/os/ReducedMotionContext"
import { useDockMagnify, DOCK_ICON_VARIANTS } from "@/os/useDockMagnify"
import { squircleBase, SQUIRCLE_GLASS } from "@/components/primitives/Squircle"
import { AppGlyph } from "@/components/primitives/AppGlyph"

export function DockIcon({ id, mouseX }: { id: AppId; mouseX: MotionValue<number> }) {
  const meta = apps[id]
  const ref = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()

  const state = useOS((s) => s.windows[id])
  const stack = useOS((s) => s.stack)
  const open = useOS((s) => s.open)
  const focus = useOS((s) => s.focus)
  const minimize = useOS((s) => s.minimize)
  const restore = useOS((s) => s.restore)

  const running = !!state
  const focused = stack[stack.length - 1] === id

  const [showTooltip, setShowTooltip] = useState(false)
  const [bouncing, setBouncing] = useState(false)
  const wasRunning = useRef(running)

  const { size, lift, depth, REST } = useDockMagnify(ref, mouseX, reducedMotion)

  useEffect(() => {
    if (!wasRunning.current && running && !reducedMotion) {
      setBouncing(true)
    }
    wasRunning.current = running
  }, [running, reducedMotion])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const report = () => {
      const r = el.getBoundingClientRect()
      setDockIconCenter(id, { x: r.x + r.width / 2, y: r.y })
    }
    // ResizeObserver catches magnification changing this icon's own size
    // (which shifts its screen position); window resize catches the
    // bottom-anchored Dock's position moving with the viewport. Neither
    // the desktop nor Springboard root ever actually scrolls (both are
    // `fixed inset-0 overflow-hidden`), so a scroll listener here would
    // only ever fire from an app's own internal scroll bubbling up - a
    // real cost for zero benefit, and the pattern plan/18-preflight.md's
    // mechanical check bans outright.
    report()
    const ro = new ResizeObserver(report)
    ro.observe(el)
    window.addEventListener("resize", report)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", report)
    }
  }, [id])

  const handleClick = () => {
    if (!state) {
      open(id)
      return
    }
    if (state.status === "minimized") {
      restore(id)
      return
    }
    if (focused) {
      minimize(id)
      return
    }
    focus(id)
  }

  const label = running ? `${meta.title}, running` : `Open ${meta.title}`

  return (
    <motion.li variants={DOCK_ICON_VARIANTS} className="relative flex flex-col items-center">
      {showTooltip && (
        <div
          role="tooltip"
          // .os-plate, not .os-glass: this floats directly over the Dock's
          // own glass, and stacking two blurs is what Apple's
          // GlassEffectContainer rule exists to prevent.
          className="os-plate pointer-events-none absolute bottom-full mb-2 whitespace-nowrap rounded-(--r-pill) px-2.5 py-1 text-xs text-text"
        >
          {meta.title}
        </div>
      )}
      <motion.button
        ref={ref}
        type="button"
        aria-label={label}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        style={{
          width: size,
          height: size,
          translateY: lift,
          translateZ: depth,
          // The layer recipe is shared with Squircle.tsx rather than
          // duplicated here. DockIcon still can't render <Squircle>
          // directly, because the magnification motion values
          // (size/lift/depth) have to bind to this element's own style
          // rather than a child's - so it takes the style objects instead.
          ...squircleBase(meta.tint),
        }}
        className="relative flex shrink-0 items-center justify-center focus-visible:outline-offset-4"
      >
        {/* Bounce lives on its own element: mixing a style-bound translateY
            (magnification lift) with an animate-driven y target on the SAME
            motion component targets the same transform channel and hangs,
            per the box-shadow lesson in Window.tsx (plan/02). */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={bouncing ? { y: [0, -14, 0] } : { y: 0 }}
          transition={bouncing ? { duration: 0.4, times: [0, 0.5, 1] } : { duration: 0 }}
          onAnimationComplete={() => setBouncing(false)}
        >
          <AppGlyph id={id} size={REST} />
        </motion.div>
        {/* Above the artwork: the glass sheet is over the icon, not under
            it, which is what "multiple layers of glass" actually means. */}
        <span aria-hidden className="pointer-events-none absolute inset-0" style={SQUIRCLE_GLASS} />
      </motion.button>
      <div
        className="mt-1 h-[3.5px] w-[3.5px] rounded-full"
        style={{ background: running ? "var(--os-accent)" : "transparent" }}
        aria-hidden
      />
    </motion.li>
  )
}
