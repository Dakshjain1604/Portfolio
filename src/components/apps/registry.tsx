"use client"

import type { AppId } from "@/data/apps"
import { Finder } from "./Finder"
import { Terminal } from "./Terminal"
import { AboutThisMac } from "./AboutThisMac"
import { Notes } from "./Notes"
import { SystemSettings } from "./SystemSettings"
import { ActivityMonitor } from "./ActivityMonitor"
import { Mail } from "./Mail"
import { Preview } from "./Preview"
import { Orchestrator } from "./Orchestrator"

/** AppId -> content component. See plan/07 through plan/15. */
export const appRegistry: Record<AppId, React.ComponentType<{ windowId: AppId }>> = {
  finder: Finder,
  about: AboutThisMac,
  notes: Notes,
  settings: SystemSettings,
  activity: ActivityMonitor,
  mail: Mail,
  preview: Preview,
  terminal: Terminal,
  orchestrator: Orchestrator,
}
