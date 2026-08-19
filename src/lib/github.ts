"use client"

/**
 * One fetch of /api/github, shared by every consumer.
 *
 * This used to live inside ActivityMonitor. Finder now needs the same
 * payload to label projects with their real star counts, and two components
 * each owning their own module-level cache would mean two requests for one
 * response - so the cache moved here rather than being duplicated.
 *
 * Module-level rather than a context or a store slice on purpose: the data
 * is immutable for the life of the page (the route revalidates hourly on the
 * server), so there is nothing to subscribe to and no re-render to schedule.
 */

export type Day = { count: number; date: string }

export type GithubData = {
  contributions: { total: number; weeks: { days: Day[] }[] }
  stats: { repos: number; stars: number; forks: number }
  languages: { name: string; count: number }[]
  repoStats: {
    name: string
    description: string | null
    stars: number
    forks: number
    url: string
    language: { name: string; color: string } | null
  }[]
}

export type GithubResult = GithubData | { error: true }

export function isError(r: GithubResult | null): r is { error: true } {
  return !!r && "error" in r
}

let cached: GithubResult | null = null
let inflight: Promise<GithubResult> | null = null

export function fetchGithub(): Promise<GithubResult> {
  if (cached) return Promise.resolve(cached)
  if (!inflight) {
    inflight = fetch("/api/github")
      .then((r) => r.json())
      .catch(() => ({ error: true as const }))
      .then((data) => {
        cached = data
        return data
      })
  }
  return inflight
}

/**
 * `https://github.com/owner/My-Repo` -> `my-repo`.
 *
 * Lowercased because GitHub repo names are case-insensitive for lookup but
 * case-preserving in the API response, and the project URLs in data/ were
 * not written to match the API's casing.
 */
export function repoSlug(url: string | undefined): string | null {
  if (!url) return null
  const m = url.match(/github\.com\/[^/]+\/([^/?#]+)/)
  return m ? m[1].replace(/\.git$/, "").toLowerCase() : null
}

/** name (lowercased) -> stars, for O(1) lookup from a project's github URL. */
export function starsByRepo(data: GithubResult | null): Map<string, number> {
  const map = new Map<string, number>()
  if (!data || isError(data) || !data.repoStats) return map
  for (const r of data.repoStats) map.set(r.name.toLowerCase(), r.stars)
  return map
}
