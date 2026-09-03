"use client"

import { projectAppOrder, type AppId, type ProjectAppId } from "@/data/apps"
import { Finder } from "./Finder"
import { Terminal } from "./Terminal"
import { AboutThisMac } from "./AboutThisMac"
import { Notes } from "./Notes"
import { SystemSettings } from "./SystemSettings"
import { ActivityMonitor } from "./ActivityMonitor"
import { Mail } from "./Mail"
import { Preview } from "./Preview"
import { ProjectApp } from "./ProjectApp"

/**
 * AppId -> content component. See plan/07 through plan/15.
 *
 * Every project app maps to the same component; it reads which project it
 * is from its own `windowId`. Spread rather than listed so adding a project
 * to data/projects.ts is the only edit needed - and the Record's
 * exhaustiveness check is what fails the build if that ever stops being
 * true.
 */
type AppComponent = React.ComponentType<{ windowId: AppId }>

// `Object.fromEntries` widens to an index signature, which contributes no
// known keys - spreading it straight into the literal below left every
// project id missing and failed the exhaustiveness check. Asserted once,
// here, with `projectAppOrder` as the single source of the key set.
const projectRegistry = Object.fromEntries(
  projectAppOrder.map((id) => [id, ProjectApp])
) as Record<ProjectAppId, AppComponent>

export const appRegistry: Record<AppId, AppComponent> = {
  ...projectRegistry,
  finder: Finder,
  about: AboutThisMac,
  notes: Notes,
  settings: SystemSettings,
  activity: ActivityMonitor,
  mail: Mail,
  preview: Preview,
  terminal: Terminal,
}
