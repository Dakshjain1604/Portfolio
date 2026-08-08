"use client"

import { useEffect, useRef, useState } from "react"
import { motion, type MotionValue } from "framer-motion"
import { useOS } from "@/os/store"
import { apps, type AppId } from "@/data/apps"
import { setDockIconCenter } from "@/os/dockIconRects"
import { useReducedMotion } from "@/os/ReducedMotionContext"
import { useDockMagnify, DOCK_ICON_VARIANTS } from "@/os/useDockMagnify"

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
          className="os-glass pointer-events-none absolute bottom-full mb-2 whitespace-nowrap rounded-(--r-control) px-2 py-1 text-xs text-text"
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
          borderRadius: "22.5%",
          // Same specular-sheen layering as Squircle.tsx - see the comment
          // there. DockIcon can't use the Squircle component directly
          // because the magnification motion values (size/lift/depth) need
          // to bind to this element's own style, not a child's.
          background: `linear-gradient(135deg, rgb(255 255 255 / .22) 0%, transparent 32%, transparent 68%, rgb(255 255 255 / .08) 100%), linear-gradient(135deg, ${meta.tint[0]}, ${meta.tint[1]})`,
          boxShadow: "inset 0 1px 0 rgb(255 255 255 / .3), inset 0 -1px 0 rgb(0 0 0 / .12)",
        }}
        className="flex shrink-0 items-center justify-center focus-visible:outline-offset-4"
      >
        {/* Bounce lives on its own element: mixing a style-bound translateY
            (magnification lift) with an animate-driven y target on the SAME
            motion component targets the same transform channel and hangs,
            per the box-shadow lesson in Window.tsx (plan/02). */}
        <motion.div
          animate={bouncing ? { y: [0, -14, 0] } : { y: 0 }}
          transition={bouncing ? { duration: 0.4, times: [0, 0.5, 1] } : { duration: 0 }}
          onAnimationComplete={() => setBouncing(false)}
        >
          <meta.icon size={REST * 0.55} weight="light" color="white" />
        </motion.div>
      </motion.button>
      <div
        className="mt-1 h-[3.5px] w-[3.5px] rounded-full"
        style={{ background: running ? "var(--os-accent)" : "transparent" }}
        aria-hidden
      />
    </motion.li>
  )
}
