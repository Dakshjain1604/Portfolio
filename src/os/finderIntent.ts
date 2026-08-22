"use client"

import { create } from "zustand"

type FinderIntentStore = {
  projectId: string | null
  setProjectId(id: string | null): void
}

/**
 * Finder-local UI intent, deliberately kept out of `useOS`: that store's
 * contract is "content never lives here" (plan/00-architecture.md section
 * 3), and this is exactly content - which project a cross-app link wants
 * Finder to land on. System Settings' skill rows write here before calling
 * `useOS.getState().open("finder")`; Finder consumes and clears it once, so
 * it never fights a visitor's own subsequent typing in the search field.
 */
export const useFinderIntent = create<FinderIntentStore>((set) => ({
  projectId: null,
  setProjectId: (projectId) => set({ projectId }),
}))
