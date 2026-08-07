"use client"

import { useRef } from "react"
import { motion, useMotionValue } from "framer-motion"
import { appOrder, dockLinks, type DockLink } from "@/data/apps"
import { useOS } from "@/os/store"
import { useReducedMotion } from "@/os/ReducedMotionContext"
import { useDockMagnify, DOCK_ICON_VARIANTS } from "@/os/useDockMagnify"
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
          borderRadius: "22.5%",
          background: "linear-gradient(135deg, #3a3a3e, #232326)",
          boxShadow: "inset 0 1px 0 rgb(255 255 255 / .16)",
        }}
        className="flex shrink-0 items-center justify-center focus-visible:outline-offset-4"
      >
        <link.icon size={REST * 0.5} weight="light" color="white" />
      </motion.a>
    </motion.li>
  )
}

export function Dock() {
  const mouseX = useMotionValue(Infinity)
  const booted = useOS((s) => s.booted)
  const reducedMotion = useReducedMotion()

  return (
    <nav
      aria-label="Dock"
      className="fixed bottom-2 left-1/2 z-[900] -translate-x-1/2"
      onPointerMove={(e) => mouseX.set(e.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
    >
      <motion.ul
        className="os-glass flex items-end gap-1 rounded-[--r-chip] px-2 pb-1 pt-2"
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
