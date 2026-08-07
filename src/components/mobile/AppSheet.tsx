"use client"

import { useEffect, useRef } from "react"
import { motion, useDragControls, type PanInfo } from "framer-motion"
import { X } from "@phosphor-icons/react/dist/ssr"
import { apps, type AppId } from "@/data/apps"
import { appRegistry } from "@/components/apps/registry"
import { useReducedMotion } from "@/os/ReducedMotionContext"

const DISMISS_OFFSET = 120
const DISMISS_VELOCITY = 500

export function AppSheet({ id, onClose }: { id: AppId; onClose: () => void }) {
  const meta = apps[id]
  const AppContent = appRegistry[id]
  const reducedMotion = useReducedMotion()
  const dragControls = useDragControls()
  const bodyRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement
    sheetRef.current?.focus()
    return () => {
      previouslyFocused.current?.focus()
    }
  }, [])

  const startDragFromBody = (e: React.PointerEvent) => {
    if ((bodyRef.current?.scrollTop ?? 0) <= 0) dragControls.start(e)
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > DISMISS_OFFSET || info.velocity.y > DISMISS_VELOCITY) onClose()
  }

  return (
    <motion.div
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-label={meta.title}
      tabIndex={-1}
      className="fixed inset-0 z-[900] flex flex-col overflow-hidden rounded-t-[--r-window] bg-panel"
      style={{ touchAction: "none" }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.5 }}
      onDragEnd={onDragEnd}
      initial={reducedMotion ? { opacity: 0 } : { y: "100%" }}
      animate={reducedMotion ? { opacity: 1 } : { y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose()
      }}
    >
      <header
        onPointerDown={(e) => dragControls.start(e)}
        className="os-glass relative flex h-12 shrink-0 items-center justify-center rounded-none"
        style={{ touchAction: "none" }}
      >
        <div aria-hidden className="absolute top-2 h-[5px] w-9 rounded-full bg-panel-3" />
        <h2 className="text-sm font-medium text-text">{meta.title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${meta.title}`}
          className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full bg-panel-3"
        >
          <X size={13} weight="bold" />
        </button>
      </header>

      <div
        ref={bodyRef}
        onPointerDown={startDragFromBody}
        className="flex-1 overflow-auto"
        style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}
      >
        <AppContent windowId={id} />
      </div>
    </motion.div>
  )
}
