"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X } from "@phosphor-icons/react/dist/ssr"
import type { Project } from "@/data/projects"
import type { PypiPackage } from "@/lib/pypi"
import { useReducedMotion } from "@/os/ReducedMotionContext"
import { FinderProjectDetail } from "./FinderProjectDetail"

type FinderQuickLookProps = {
  project: Project
  /** `transformOrigin`, precomputed by Finder.tsx from the triggering row's
   *  live rect relative to the Finder window's own container - same trick
   *  Window.tsx uses for the Dock-icon genie, one level down. */
  origin: string
  stars: number | null
  pypiPkg: PypiPackage | null
  onClose: () => void
}

/**
 * macOS's actual answer to "make selecting something feel alive": Quick
 * Look. Zooms the selected project into a large floating card, genie-style,
 * from wherever it sat in the list. Unlike the persistent side pane (hidden
 * below a 720px window width), this overlay works identically at every
 * width, including inside the mobile AppSheet - see plan/07-app-finder.md
 * and the Finder interactivity plan for why this is the fix rather than a
 * bespoke narrow-width layout.
 */
export function FinderQuickLook({ project, origin, stars, pypiPkg, onClose }: FinderQuickLookProps) {
  const reducedMotion = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const cardTransition = reducedMotion
    ? { duration: 0.14 }
    : { type: "spring" as const, stiffness: 280, damping: 28 }
  const cardHidden = reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.2 }
  const cardRest = reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.14 }}
      onClick={onClose}
    >
      <div aria-hidden className="absolute inset-0" style={{ background: "rgb(11 11 14 / 0.6)" }} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} quick look`}
        className="os-plate relative max-h-full w-full max-w-md overflow-auto rounded-(--r-float) p-5"
        style={{ transformOrigin: origin }}
        initial={cardHidden}
        animate={cardRest}
        exit={cardHidden}
        transition={cardTransition}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation()
            onClose()
          }
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={`Close ${project.title} quick look`}
          className="os-press absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-panel-3"
        >
          <X size={13} weight="bold" />
        </button>
        <FinderProjectDetail project={project} stars={stars} pypiPkg={pypiPkg} size="quicklook" />
      </motion.div>
    </motion.div>
  )
}
