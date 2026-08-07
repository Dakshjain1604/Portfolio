import type { AppId } from "@/data/apps"

export type Rect = { x: number; y: number; w: number; h: number }

export type WindowStatus = "open" | "minimized" | "maximized"

export type WindowState = {
  id: AppId
  rect: Rect
  status: WindowStatus
  /** restore target when un-maximizing */
  prevRect?: Rect
  /** for cascade offset and Mission Control ordering */
  openedAt: number
}

export type OSMode = "desktop" | "missionControl" | "reader"

export const MENUBAR_H = 28
/** dock at REST (52px icon + padding + margin). magnification grows icons to 76px
 *  only while the pointer is over the Dock, so windows still clamp against rest height. */
export const DOCK_H = 78
export const TITLEBAR_H = 38
