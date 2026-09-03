"use client"

import { Fragment, useRef, useState } from "react"

import { motion, useMotionValue } from "framer-motion"
import { appOrder, dockLinks, type DockLink } from "@/data/apps"
import { useOS } from "@/os/store"
import { useReducedMotion } from "@/os/ReducedMotionContext"
import { useDockMagnify, DOCK_ICON_VARIANTS } from "@/os/useDockMagnify"
import { squircleBase, SQUIRCLE_GLASS, SQUIRCLE_RADIUS } from "@/components/primitives/Squircle"
import { LinkGlyph } from "@/components/primitives/AppGlyph"
import { projects, projectIconSrc } from "@/data/projects"
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


/**
 * Launchpad's tile, made of the projects it opens.
 *
 * macOS draws Launchpad as a grid of miniature app icons, and here the apps
 * are the projects - so the tile is a 3x3 mosaic of the first nine real
 * screenshots rather than a rocket. It says what is behind it before the
 * tooltip does, and it is the one Dock tile that changes when the work
 * changes.
 *
 * The only place a project is still shown as a square. Nine cells at ~14px
 * each are texture, not content: nobody reads them, so cropping a 16:10
 * screenshot to fit costs nothing here. Everywhere a project tile is meant
 * to be legible it is drawn at the screenshot's own aspect ratio instead.
 */
function DockLaunchpadIcon({ mouseX }: { mouseX: ReturnType<typeof useMotionValue<number>> }) {
  const ref = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()
  const { size, lift, depth } = useDockMagnify(ref, mouseX, reducedMotion)
  const mode = useOS((s) => s.mode)
  const setMode = useOS((s) => s.setMode)
  const [showTooltip, setShowTooltip] = useState(false)
  const open = mode === "launchpad"

  return (
    <motion.li variants={DOCK_ICON_VARIANTS} className="relative flex flex-col items-center">
      {showTooltip && (
        <div
          role="tooltip"
          className="os-plate pointer-events-none absolute bottom-full mb-2 whitespace-nowrap rounded-(--r-pill) px-2.5 py-1 text-xs text-text"
        >
          Launchpad
        </div>
      )}
      <motion.button
        ref={ref}
        type="button"
        aria-label={open ? "Close Launchpad" : "Open Launchpad, all projects"}
        aria-expanded={open}
        onClick={() => setMode(open ? "desktop" : "launchpad")}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        style={{ width: size, height: size, translateY: lift, translateZ: depth, ...squircleBase(["#5a5f68", "#2b2e34"]) }}
        className="relative flex shrink-0 items-center justify-center focus-visible:outline-offset-4"
      >
        <span
          aria-hidden
          className="absolute inset-[14%] grid grid-cols-3 gap-[6%] overflow-hidden"
          style={{ borderRadius: "16%" }}
        >
          {projects.slice(0, 9).map((p) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={p.id} src={projectIconSrc(p.id)} alt="" className="h-full w-full rounded-[3px] object-cover" />
          ))}
        </span>
        <span aria-hidden className="pointer-events-none absolute inset-0" style={{ ...SQUIRCLE_GLASS, borderRadius: SQUIRCLE_RADIUS }} />
      </motion.button>
      <div
        className="mt-1 h-[3.5px] w-[3.5px] rounded-full"
        style={{ background: open ? "var(--os-accent)" : "transparent" }}
        aria-hidden
      />
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
        {/* Launchpad sits immediately after Finder, where macOS puts it -
            and where a visitor who has just read "Projects" finds the
            thing that shows them. */}
        {appOrder.map((id) => (
          <Fragment key={id}>
            <DockIcon id={id} mouseX={mouseX} />
            {id === "finder" && <DockLaunchpadIcon mouseX={mouseX} />}
          </Fragment>
        ))}
        <li role="separator" aria-hidden className="mx-1 h-[40%] w-px self-center bg-divider" />
        {dockLinks.map((link) => (
          <DockExternalIcon key={link.id} link={link} mouseX={mouseX} />
        ))}
      </motion.ul>
    </nav>
  )
}
