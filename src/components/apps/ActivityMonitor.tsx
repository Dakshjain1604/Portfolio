"use client"

import { useEffect, useState } from "react"
import { CloudSlash, GithubLogo, Star, GitFork } from "@phosphor-icons/react/dist/ssr"
import { socials } from "@/data/socials"
import { EmptyState } from "@/components/primitives/EmptyState"

type Day = { count: number; date: string }
type ApiData = {
  contributions: { total: number; weeks: { days: Day[] }[] }
  stats: { repos: number; stars: number; forks: number }
  languages: { name: string; count: number }[]
  pinned: { name: string; description: string; url: string; stars: number; forks: number }[]
}
type ApiResult = ApiData | { error: true }

let cached: ApiResult | null = null
let inflight: Promise<ApiResult> | null = null

function fetchOnce(): Promise<ApiResult> {
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

function computeStreaks(weeks: { days: Day[] }[]) {
  const days = weeks.flatMap((w) => w.days)
  let current = 0
  let longest = 0
  let running = 0
  for (const d of days) {
    if (d.count > 0) {
      running++
      longest = Math.max(longest, running)
    } else {
      running = 0
    }
  }
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current++
    else break
  }
  return { current, longest }
}

function intensity(count: number) {
  if (count === 0) return "rgb(255 255 255 / .06)"
  if (count < 2) return "rgb(62 123 250 / .3)"
  if (count < 4) return "rgb(62 123 250 / .5)"
  if (count < 8) return "rgb(62 123 250 / .75)"
  return "var(--os-accent)"
}

function Skeleton() {
  return (
    <div className="os-plate h-full animate-pulse space-y-4 overflow-hidden rounded-(--r-float) p-5" aria-busy="true">
      <div className="flex gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-10 w-24 rounded bg-panel-3" />
        ))}
      </div>
      <div className="grid grid-cols-[repeat(53,1fr)] gap-[3px]">
        {Array.from({ length: 53 * 7 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-[1px] bg-panel-3" />
        ))}
      </div>
    </div>
  )
}

export function ActivityMonitor() {
  const [tab, setTab] = useState<"contributions" | "repositories" | "languages">("contributions")
  const [data, setData] = useState<ApiResult | "loading">("loading")

  useEffect(() => {
    fetchOnce().then(setData)
  }, [])

  if (data === "loading") return <Skeleton />

  if ("error" in data) {
    return (
      <div className="os-plate h-full overflow-hidden rounded-(--r-float)">
        <EmptyState
          icon={CloudSlash}
          title="GitHub data unavailable"
          body="The connection failed. Repository activity is on GitHub."
          live
          actions={
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-(--r-control) bg-panel-3 px-3 py-1.5 text-xs text-text"
            >
              <GithubLogo size={13} weight="light" />
              View on GitHub
            </a>
          }
        />
      </div>
    )
  }

  const streaks = computeStreaks(data.contributions.weeks)
  const totalLangCount = data.languages.reduce((a, l) => a + l.count, 0)

  return (
    <div className="os-plate flex h-full flex-col overflow-hidden rounded-(--r-float)">
      <div role="tablist" className="flex gap-1 border-b border-divider px-3 pt-2">
        {(["contributions", "repositories", "languages"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            onClick={() => setTab(t)}
            onKeyDown={(e) => {
              const order = ["contributions", "repositories", "languages"] as const
              const idx = order.indexOf(t)
              if (e.key === "ArrowRight") setTab(order[(idx + 1) % 3])
              if (e.key === "ArrowLeft") setTab(order[(idx - 1 + 3) % 3])
            }}
            className="rounded-t-(--r-control) px-3 py-1.5 text-xs capitalize"
            style={{
              color: tab === t ? "var(--os-text)" : "var(--os-text-2)",
              borderBottom: tab === t ? "2px solid var(--os-accent)" : "2px solid transparent",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-5">
        {tab === "contributions" && (
          <div id="panel-contributions" role="tabpanel" aria-labelledby="tab-contributions">
            <div className="mb-4 flex gap-6 font-mono text-sm" style={{ fontVariantNumeric: "tabular-nums" }}>
              <div>
                <p className="text-lg text-text">{data.contributions.total}</p>
                <p className="text-[10px] uppercase tracking-wide text-text-2">Contributions</p>
              </div>
              <div>
                <p className="text-lg text-text">{streaks.current}</p>
                <p className="text-[10px] uppercase tracking-wide text-text-2">Current streak</p>
              </div>
              <div>
                <p className="text-lg text-text">{streaks.longest}</p>
                <p className="text-[10px] uppercase tracking-wide text-text-2">Longest streak</p>
              </div>
            </div>
            <div
              role="img"
              aria-label={`${data.contributions.total} contributions in the last year`}
              className="grid gap-[3px]"
              style={{ gridTemplateColumns: `repeat(${data.contributions.weeks.length}, minmax(10px, 1fr))` }}
            >
              {data.contributions.weeks.map((week, wi) => (
                <div key={wi} className="grid gap-[3px]">
                  {week.days.map((day, di) => (
                    <div
                      key={di}
                      aria-hidden
                      title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                      className="aspect-square rounded-[1px]"
                      style={{ background: intensity(day.count) }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "repositories" && (
          <ul id="panel-repositories" role="tabpanel" aria-labelledby="tab-repositories" className="space-y-1">
            {data.pinned.length === 0 && (
              <EmptyState icon={CloudSlash} title="No pinned repositories" body="Nothing is pinned on GitHub yet." />
            )}
            {data.pinned.map((repo) => (
              <li key={repo.name}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-(--r-control) px-2 py-2 hover:bg-panel-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-text">{repo.name}</p>
                    <p className="truncate text-[11px] text-text-2">{repo.description}</p>
                  </div>
                  <div
                    className="flex shrink-0 items-center gap-3 font-mono text-[11px] text-text-2"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    <span className="flex items-center gap-1">
                      <Star size={11} weight="light" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={11} weight="light" />
                      {repo.forks}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}

        {tab === "languages" && (
          <div id="panel-languages" role="tabpanel" aria-labelledby="tab-languages">
            <div
              role="img"
              aria-label={data.languages.map((l) => `${l.name} ${Math.round((l.count / totalLangCount) * 100)}%`).join(", ")}
              className="mb-4 flex h-2 overflow-hidden rounded-(--r-chip)"
            >
              {data.languages.map((l, i) => (
                <div
                  key={l.name}
                  style={{
                    width: `${(l.count / totalLangCount) * 100}%`,
                    background: i === data.languages.length - 1 ? "var(--os-text-3)" : `rgb(62 123 250 / ${1 - i * 0.18})`,
                  }}
                />
              ))}
            </div>
            <ul className="space-y-1.5">
              {data.languages.map((l) => (
                <li key={l.name} className="flex items-center justify-between text-xs">
                  <span className="text-text">{l.name}</span>
                  <span className="font-mono text-text-2" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {Math.round((l.count / totalLangCount) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <footer className="flex items-center justify-between border-t border-divider px-3 py-1.5 text-[11px] text-text-2">
        <span>Dakshjain1604</span>
        <a href={socials.github} target="_blank" rel="noopener noreferrer" className="underline">
          View on GitHub
        </a>
      </footer>
    </div>
  )
}
