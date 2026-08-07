"use client"

import type { AppId } from "@/data/apps"
import { apps } from "@/data/apps"

/**
 * AppId -> content component. Phase 2 scaffold: every app renders a plain
 * placeholder so the window manager (drag, resize, stack, Mission Control)
 * is independently testable before any app exists. Phase 4 replaces each
 * entry below with its real component from plan/07 through plan/15,
 * one import swap per app, this file's shape does not change.
 */
function Placeholder({ id }: { id: AppId }) {
  const meta = apps[id]
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
      <meta.icon size={28} weight="light" className="text-text-2" />
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-2">{meta.title}</p>
      <p className="max-w-[32ch] text-xs text-text-3">Content lands in phase 4.</p>
    </div>
  )
}

export const appRegistry: Record<AppId, React.ComponentType<{ windowId: AppId }>> = {
  finder: () => <Placeholder id="finder" />,
  about: () => <Placeholder id="about" />,
  notes: () => <Placeholder id="notes" />,
  settings: () => <Placeholder id="settings" />,
  activity: () => <Placeholder id="activity" />,
  mail: () => <Placeholder id="mail" />,
  preview: () => <Placeholder id="preview" />,
  terminal: () => <Placeholder id="terminal" />,
  orchestrator: () => <Placeholder id="orchestrator" />,
}
