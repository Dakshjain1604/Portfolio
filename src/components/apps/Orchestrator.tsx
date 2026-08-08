"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { AppId } from "@/data/apps"
import { useOS } from "@/os/store"
import { useReducedMotion } from "@/os/ReducedMotionContext"
import { AGENTS } from "./OrchestratorScene"

const Scene = dynamic(() => import("./OrchestratorScene").then((m) => m.OrchestratorScene), {
  ssr: false,
  loading: () => <div className="h-full w-full" style={{ background: "#0A0A0D" }} />,
})

export function Orchestrator({ windowId }: { windowId: AppId }) {
  const focused = useOS((s) => s.stack[s.stack.length - 1] === windowId)
  const reducedMotion = useReducedMotion()
  const [selected, setSelected] = useState(AGENTS[0].id)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  const active = AGENTS.find((a) => a.id === selected) ?? AGENTS[0]

  return (
    <div className="relative h-full overflow-hidden rounded-(--r-float)" style={{ background: "#0A0A0D" }}>
      {visible && (
        <Scene selected={selected} onSelect={setSelected} focused={focused} reducedMotion={reducedMotion} />
      )}

      <p className="absolute left-3 top-3 text-xs text-text-2">Drag to orbit</p>

      <div
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key !== "Tab") return
          e.preventDefault()
          const idx = AGENTS.findIndex((a) => a.id === selected)
          const dir = e.shiftKey ? -1 : 1
          setSelected(AGENTS[(idx + dir + AGENTS.length) % AGENTS.length].id)
        }}
        aria-label="Cycle orchestration agents"
        className="absolute inset-0 outline-none"
      />

      <div aria-live="polite" className="os-glass absolute inset-x-0 bottom-0 p-4">
        <h4 className="text-sm font-medium text-text">{active.label}</h4>
        <p className="text-xs text-text-2">{active.role}</p>
      </div>

      <div
        role="img"
        aria-label={`Multi-agent orchestration graph. Manager routes work to Planner, Researcher, Coder, and MCP Tools.`}
        className="sr-only"
      >
        <ul>
          {AGENTS.map((a) => (
            <li key={a.id}>
              {a.label}: {a.role}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
