"use client"

/**
 * One fetch of /api/pypi, shared and cached for the life of the page - the
 * same shape as lib/github.ts, for the same reason: the data is immutable
 * once loaded (the route revalidates hourly on the server), so there is
 * nothing to subscribe to and no re-render to schedule.
 */

export type PypiPackage = {
  version: string
  releases: number
  requiresPython: string | null
  license: string | null
}

export type PypiResult = Record<string, PypiPackage> | { error: true }

let cached: PypiResult | null = null
let inflight: Promise<PypiResult> | null = null

export function fetchPypi(): Promise<PypiResult> {
  if (cached) return Promise.resolve(cached)
  if (!inflight) {
    inflight = fetch("/api/pypi")
      .then((r) => r.json())
      .catch(() => ({ error: true as const }))
      .then((data) => {
        cached = data
        return data
      })
  }
  return inflight
}

export function packageFor(data: PypiResult | null, name: string | undefined): PypiPackage | null {
  if (!data || !name || "error" in data) return null
  return data[name] ?? null
}
