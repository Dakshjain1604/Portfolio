"use client"

import { useRef } from "react"

import { motion, useMotionValue } from "framer-motion"
import { appOrder, dockLinks, type DockLink } from "@/data/apps"
import { useOS } from "@/os/store"
import { useReducedMotion } from "@/os/ReducedMotionContext"
import { useDockMagnify, DOCK_ICON_VARIANTS } from "@/os/useDockMagnify"
import { squircleBase, SQUIRCLE_GLASS } from "@/components/primitives/Squircle"
import { LinkGlyph } from "@/components/primitives/AppGlyph"
import { useGlassPointer } from "@/os/useGlassPointer"
import { DockIcon } from "./DockIcon"

function DockExternalIcon({ link, mouseX }: { link: DockLink; mouseX: ReturnType<typeof useMotionValue<number>> }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reducedMotion = useReducedMotion()
  const { size, lift, depth, REST } = useDockMagnify(ref, mouseX, reducedMotion)

  return (
    <motion.li variants={DOCK_ICON_VARIANTS} className="flex flex-col items-center">
      <motion.a
        ref={ref}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${link.label}, opens in a new tab`}
        style={{
          width: size,
          height: size,
          translateY: lift,
          translateZ: depth,
          ...squircleBase(link.tint),
        }}
        className="relative flex shrink-0 items-center justify-center focus-visible:outline-offset-4"
      >
        <LinkGlyph id={link.id} size={REST} />
        {/* After the artwork, matching DockIcon: the glass sheet sits over
            the mark, not under it. This element had the two in the other
            order, which is why these tiles read flatter than their
            neighbours even before the tint was fixed. */}
        <span aria-hidden className="pointer-events-none absolute inset-0" style={SQUIRCLE_GLASS} />
      </motion.a>
      {/* The rail is `items-end`, and every DockIcon ends in a running-state
          dot. Without a spacer of the same height these two tiles baseline
          7px below the app row. */}
      <div className="mt-1 h-[3.5px] w-[3.5px]" aria-hidden />
    </motion.li>
  )
}

export function Dock() {
  const mouseX = useMotionValue(Infinity)
  const booted = useOS((s) => s.booted)
  const reducedMotion = useReducedMotion()
  const railRef = useRef<HTMLUListElement>(null)
  useGlassPointer(railRef)

  return (
    <nav
      aria-label="Dock"
      className="fixed bottom-2 left-1/2 z-[900] -translate-x-1/2"
      onPointerMove={(e) => mouseX.set(e.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
    >
      <motion.ul
        ref={railRef}
        // Icons sit --r-inset in from the rail on every side, so the rail's
        // own curve stays concentric with theirs no matter how far
        // magnification pushes them.
        className="os-glass flex items-end gap-1.5 rounded-(--r-chip) px-(--r-inset) pb-1.5 pt-2.5"
        initial={reducedMotion ? false : "hidden"}
        animate={reducedMotion || booted ? "show" : "hidden"}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
      >
        {appOrder.map((id) => (
          <DockIcon key={id} id={id} mouseX={mouseX} />
        ))}
        <li role="separator" aria-hidden className="mx-1 h-[40%] w-px self-center bg-divider" />
        {dockLinks.map((link) => (
          <DockExternalIcon key={link.id} link={link} mouseX={mouseX} />
        ))}
      </motion.ul>
    </nav>
  )
}
