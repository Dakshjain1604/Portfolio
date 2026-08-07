"use client"

import { createContext, useContext } from "react"
import { useReducedMotion as useFramerReducedMotion } from "framer-motion"

const ReducedMotionContext = createContext(false)

/** Read once here (DesktopShell root) rather than calling framer-motion's
 *  useReducedMotion() in every window, dock icon, and shell component. */
export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const prefersReduced = useFramerReducedMotion()
  return (
    <ReducedMotionContext.Provider value={!!prefersReduced}>{children}</ReducedMotionContext.Provider>
  )
}

export function useReducedMotion() {
  return useContext(ReducedMotionContext)
}
