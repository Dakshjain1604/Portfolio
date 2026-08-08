import {
  FolderSimple,
  Info,
  NotePencil,
  GearSix,
  ChartLine,
  EnvelopeSimple,
  FilePdf,
  Terminal as TerminalGlyph,
  Graph,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/dist/ssr"
import type { IconProps } from "@phosphor-icons/react"
import type { ComponentType } from "react"
import { socials } from "./socials"
import type { Rect } from "@/os/types"

export type AppId =
  | "finder"
  | "about"
  | "notes"
  | "settings"
  | "activity"
  | "mail"
  | "preview"
  | "terminal"
  | "orchestrator"

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

export const apps: Record<AppId, AppMeta> = {
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
    dockOrder: 3,
  },
  activity: {
    id: "activity",
    title: "Activity Monitor",
    icon: ChartLine,
    tint: ["#3a3f45", "#22262b"],
    defaultRect: { x: 240, y: 80, w: 720, h: 500 },
    minSize: { w: 560, h: 380 },
    dockOrder: 4,
  },
  mail: {
    id: "mail",
    title: "Contact",
    icon: EnvelopeSimple,
    tint: ["#3fa4ff", "#0a6ae8"],
    defaultRect: { x: 260, y: 104, w: 680, h: 540 },
    minSize: { w: 520, h: 420 },
    dockOrder: 5,
  },
  preview: {
    id: "preview",
    title: "Resume.pdf",
    icon: FilePdf,
    tint: ["#fdfdfd", "#e8e8ec"],
    defaultRect: { x: 300, y: 56, w: 700, h: 780 },
    minSize: { w: 480, h: 500 },
    onDesktop: "Resume.pdf",
    dockOrder: 6,
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    icon: TerminalGlyph,
    tint: ["#3a3a3c", "#111113"],
    defaultRect: { x: 160, y: 140, w: 720, h: 460 },
    minSize: { w: 480, h: 300 },
    dockOrder: 7,
  },
  orchestrator: {
    id: "orchestrator",
    title: "Orchestrator",
    icon: Graph,
    tint: ["#7d7bf0", "#5e5ce6"],
    defaultRect: { x: 340, y: 72, w: 800, h: 600 },
    minSize: { w: 560, h: 420 },
    dockOrder: 8,
  },
}

export const appOrder: AppId[] = Object.values(apps)
  .sort((a, b) => a.dockOrder - b.dockOrder)
  .map((a) => a.id)

/** The `README.txt` desktop icon has no window of its own; it opens `about`. */
export const readmeDesktopIcon = { label: "README.txt", opens: "about" as AppId }

export type DockLink = { id: "github" | "linkedin"; label: string; href: string; icon: React.ComponentType<IconProps> }

export const dockLinks: DockLink[] = [
  { id: "github", label: "GitHub", href: socials.github, icon: GithubLogo },
  { id: "linkedin", label: "LinkedIn", href: socials.linkedin, icon: LinkedinLogo },
]
