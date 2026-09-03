import {
  FolderSimple,
  Info,
  NotePencil,
  GearSix,
  ChartLine,
  EnvelopeSimple,
  FilePdf,
  Terminal as TerminalGlyph,
  ImageSquare,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/dist/ssr"
import type { IconProps } from "@phosphor-icons/react"
import type { ComponentType } from "react"
import { socials } from "./socials"
import { projects, type ProjectId } from "./projects"
import type { Rect } from "@/os/types"

export type CoreAppId =
  | "finder"
  | "about"
  | "notes"
  | "settings"
  | "activity"
  | "mail"
  | "preview"
  | "terminal"

/**
 * One app per project.
 *
 * The prefix is what keeps a project id from ever colliding with a core
 * app id, and what lets `isProjectApp` recover the project from a window
 * id without a lookup table.
 */
export type ProjectAppId = `project.${ProjectId}`
export type AppId = CoreAppId | ProjectAppId

export const isProjectApp = (id: AppId): id is ProjectAppId => id.startsWith("project.")
export const projectIdOf = (id: ProjectAppId): ProjectId => id.slice("project.".length) as ProjectId

export type AppMeta = {
  id: AppId
  title: string
  /** The dock/desktop tile draws its own composition in AppGlyph.tsx; this
   *  is the fallback mark and what Reader view and the mobile grid label
   *  themselves with. */
  icon: ComponentType<IconProps>
  /** Two-stop gradient for the squircle tile, keyed to the equivalent real
   *  macOS app icon rather than picked to taste: Mail is systemBlue, Notes
   *  is paper-white, Terminal is near-black, Settings is graphite. */
  tint: [string, string]
  defaultRect: Rect
  minSize: { w: number; h: number }
  onDesktop?: string
  dockOrder: number
}

const coreApps: Record<CoreAppId, AppMeta> = {
  finder: {
    id: "finder",
    title: "Projects",
    icon: FolderSimple,
    tint: ["#4da2ff", "#0a6fe8"],
    defaultRect: { x: 120, y: 64, w: 940, h: 600 },
    minSize: { w: 640, h: 400 },
    onDesktop: "Projects",
    dockOrder: 0,
  },
  about: {
    id: "about",
    title: "About This Mac",
    icon: Info,
    tint: ["#d5d7db", "#9a9ea6"],
    defaultRect: { x: 180, y: 88, w: 620, h: 520 },
    minSize: { w: 520, h: 440 },
    dockOrder: 1,
  },
  notes: {
    id: "notes",
    title: "Experience",
    icon: NotePencil,
    tint: ["#fdfdfb", "#eceae2"],
    defaultRect: { x: 220, y: 72, w: 820, h: 560 },
    minSize: { w: 560, h: 400 },
    dockOrder: 2,
  },
  settings: {
    id: "settings",
    title: "Skills",
    icon: GearSix,
    tint: ["#8e9298", "#4d5157"],
    defaultRect: { x: 200, y: 96, w: 780, h: 560 },
    minSize: { w: 600, h: 420 },
    dockOrder: 4,
  },
  activity: {
    id: "activity",
    title: "Activity Monitor",
    icon: ChartLine,
    tint: ["#3a3f45", "#22262b"],
    defaultRect: { x: 240, y: 80, w: 720, h: 500 },
    minSize: { w: 560, h: 380 },
    dockOrder: 5,
  },
  mail: {
    id: "mail",
    title: "Contact",
    icon: EnvelopeSimple,
    tint: ["#3fa4ff", "#0a6ae8"],
    defaultRect: { x: 260, y: 104, w: 680, h: 540 },
    minSize: { w: 520, h: 420 },
    dockOrder: 6,
  },
  preview: {
    id: "preview",
    title: "Resume.pdf",
    icon: FilePdf,
    tint: ["#fdfdfd", "#e8e8ec"],
    defaultRect: { x: 300, y: 56, w: 700, h: 780 },
    minSize: { w: 480, h: 500 },
    onDesktop: "Resume.pdf",
    dockOrder: 7,
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    icon: TerminalGlyph,
    tint: ["#3a3a3c", "#111113"],
    defaultRect: { x: 160, y: 140, w: 720, h: 460 },
    minSize: { w: 480, h: 300 },
    dockOrder: 8,
  },
}

/**
 * Project apps, derived rather than written out.
 *
 * Everything a project window needs is already in data/projects.ts, so
 * duplicating a title and a rect per project here would just be a second
 * place to forget to update. `dockOrder` is deliberately past the core
 * apps' range and unused: these never appear in the Dock (ten more tiles
 * would bury the eight that orient a visitor), they live in Launchpad -
 * which is exactly where macOS puts the apps that are not pinned.
 */
export const projectApps = Object.fromEntries(
  projects.map((p, i): [ProjectAppId, AppMeta] => [
    `project.${p.id}`,
    {
      id: `project.${p.id}`,
      title: p.title,
      icon: ImageSquare,
      // Never actually painted - a project tile is its own screenshot, so
      // AppGlyph returns before the gradient shows. Kept non-null because
      // AppMeta requires it and because it is the honest fallback colour
      // if a shot ever fails to load.
      tint: ["#3b3f47", "#22252b"],
      defaultRect: { x: 140, y: 60, w: 1000, h: 660 },
      minSize: { w: 520, h: 420 },
      dockOrder: 100 + i,
    },
  ])
) as Record<ProjectAppId, AppMeta>

export const apps: Record<AppId, AppMeta> = { ...coreApps, ...projectApps }

/** The Dock. Core apps only - see the note on projectApps above. */
export const appOrder: CoreAppId[] = Object.values(coreApps)
  .sort((a, b) => a.dockOrder - b.dockOrder)
  .map((a) => a.id as CoreAppId)

/** Launchpad's grid, in the same ranked order data/projects.ts uses. */
export const projectAppOrder: ProjectAppId[] = projects.map((p) => `project.${p.id}` as ProjectAppId)

/** The `README.txt` desktop icon has no window of its own; it opens `about`. */
export const readmeDesktopIcon = { label: "README.txt", opens: "about" as AppId }

export type LinkId = "github" | "linkedin"

export type DockLink = {
  id: LinkId
  label: string
  href: string
  icon: React.ComponentType<IconProps>
  /** Same contract as AppMeta.tint. Both of these used to share one grey
   *  (#3a3a3e -> #232326), which is why they read as two blank chips at the
   *  end of the Dock rather than as icons. These are the brands' own tile
   *  colours: GitHub ships a near-black mark, LinkedIn is #0a66c2. */
  tint: [string, string]
}

export const dockLinks: DockLink[] = [
  { id: "github", label: "GitHub", href: socials.github, icon: GithubLogo, tint: ["#3d444d", "#1c2128"] },
  { id: "linkedin", label: "LinkedIn", href: socials.linkedin, icon: LinkedinLogo, tint: ["#3e94dd", "#0a66c2"] },
]
