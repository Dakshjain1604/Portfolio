"use client"

import { GithubLogo, ArrowSquareOut, Package, BookOpen, Star } from "@phosphor-icons/react/dist/ssr"
import { thumbOf, type Project, type ProjectLink } from "@/data/projects"
import type { PypiPackage } from "@/lib/pypi"
import { Chip } from "@/components/primitives/Chip"

const LINK_ICONS = {
  source: GithubLogo,
  live: ArrowSquareOut,
  package: Package,
  docs: BookOpen,
} as const

function LinkButton({ link }: { link: ProjectLink }) {
  const Icon = LINK_ICONS[link.icon ?? "live"]
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${link.label}, opens in a new tab`}
      className={`os-press flex items-center gap-1.5 rounded-(--r-pill) px-2.5 py-1.5 text-xs ${
        link.primary ? "bg-accent-soft text-link" : "bg-panel-3 text-text"
      }`}
    >
      <Icon size={13} weight="regular" />
      {link.label}
    </a>
  )
}

type FinderProjectDetailProps = {
  project: Project
  stars: number | null
  pypiPkg: PypiPackage | null
  /** Quick Look renders a larger hero and heading than the persistent side pane. */
  size?: "pane" | "quicklook"
  /** A project's own window already shows the screenshots at full size and
   *  carries the title in its title bar, so it asks for the facts only. */
  showHero?: boolean
}

/**
 * The one detail block, used by both Finder's persistent side pane (>=720px
 * windows) and FinderQuickLook (every width, including the mobile sheet) so
 * the two presentations of a project can never drift - the same reasoning
 * src/data/ applies at the app level, one level down.
 */
export function FinderProjectDetail({
  project,
  stars,
  pypiPkg,
  size = "pane",
  showHero = true,
}: FinderProjectDetailProps) {
  const links: ProjectLink[] =
    project.links ?? [
      ...(project.github ? [{ label: "Source", href: project.github, icon: "source" as const }] : []),
      ...(project.live ? [{ label: "Live", href: project.live, icon: "live" as const, primary: true }] : []),
    ]

  return (
    <>
      {showHero && (
        <>
          {/* `object-contain` and the baked thumb, not `object-cover` on the
              full-size hero: cover cropped the screenshot to whatever height
              the pane happened to have, which is the same square-peg problem
              the app tiles had, one size up. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbOf(project.image)}
            alt={`${project.title} screenshot`}
            loading="lazy"
            className={`mb-3 w-full rounded-(--r-card) bg-[rgb(10_10_12)] object-contain ${
              size === "quicklook" ? "max-h-72" : ""
            }`}
          />
          <h3
            className={
              size === "quicklook" ? "mb-1 text-base font-medium text-text" : "mb-1 text-sm font-medium text-text"
            }
          >
            {project.title}
          </h3>
        </>
      )}
      <p className="mb-3 max-w-[46ch] text-xs text-text-2">{project.description}</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <LinkButton key={l.href} link={l} />
        ))}
      </div>
      <dl className="space-y-1.5 text-[11px]">
        {pypiPkg && (
          <>
            <div className="flex justify-between gap-3">
              <dt className="text-text-2">Releases</dt>
              <dd className="font-medium text-text">{pypiPkg.releases}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-text-2">Latest</dt>
              <dd className="font-mono font-medium text-text">v{pypiPkg.version}</dd>
            </div>
          </>
        )}
        {project.metrics?.map((m) => (
          <div key={m.label} className="flex justify-between gap-3">
            <dt className="text-text-2">{m.label}</dt>
            <dd className="text-right font-medium text-text">{m.value}</dd>
          </div>
        ))}
        {stars ? (
          <div className="flex justify-between gap-3">
            <dt className="text-text-2">GitHub stars</dt>
            <dd className="flex items-center gap-1 font-medium text-text">
              <Star size={11} weight="fill" className="text-[var(--sys-yellow)]" />
              {stars}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-3">
          <dt className="text-text-2">Kind</dt>
          <dd className="text-text-2">{project.tags.includes("ai") ? "AI System" : "Web App"}</dd>
        </div>
      </dl>
    </>
  )
}
