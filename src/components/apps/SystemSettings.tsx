"use client"

import { useMemo, useState } from "react"
import type { ComponentType } from "react"
import {
  Sparkle,
  Database,
  HardDrives,
  Browser,
  Code,
  CloudArrowUp,
  TreeStructure,
  Graph,
  Plugs,
  MagnifyingGlass,
  Function as FunctionIcon,
  Ruler,
  ArrowsLeftRight,
  ArrowsClockwise,
  PaintBrush,
  Check,
} from "@phosphor-icons/react/dist/ssr"
import type { IconProps } from "@phosphor-icons/react"
import { skills, type Skill } from "@/data/skills"
import { projects } from "@/data/projects"
import { useOS, ACCENT_TINTS, type AccentTint } from "@/os/store"
import { Sidebar } from "@/components/primitives/Sidebar"

/** Phase 19D: personalization, not portfolio content - deliberately kept
 *  out of src/data/skills.ts and handled as a sentinel category id here,
 *  first in the sidebar per plan/19-liquid-glass-modernization.md. */
const APPEARANCE_ID = "appearance"

/**
 * Real System Settings puts a small filled colour badge next to every
 * sidebar row, and the colour is per-category rather than one accent
 * repeated. It is the fastest way to tell the categories apart at a
 * glance and one of the pane's most recognisable details.
 */
const BADGE: Record<string, { icon: ComponentType<IconProps>; bg: string }> = {
  [APPEARANCE_ID]: { icon: PaintBrush, bg: "var(--sys-gray)" },
  ai: { icon: Sparkle, bg: "var(--sys-purple)" },
  backend: { icon: HardDrives, bg: "var(--sys-green)" },
  frontend: { icon: Browser, bg: "var(--sys-orange)" },
  languages: { icon: Code, bg: "var(--sys-blue)" },
  cloud: { icon: CloudArrowUp, bg: "var(--sys-teal)" },
}

/** Skills with no real Simple Icons brand mark. See plan/11-app-settings.md -
 *  every skill either gets a real logo or a Phosphor glyph, never a blank. */
const GLYPH_FALLBACK: Record<string, ComponentType<IconProps>> = {
  "Autonomous Agent Workflows": TreeStructure,
  "Multi-Agent Orchestration": Graph,
  "Model Context Protocol (MCP)": Plugs,
  "Production RAG & Vector Search": MagnifyingGlass,
  "LLM Tool & Function Calling": FunctionIcon,
  "Prompt Engineering & Evals": Ruler,
  REST: ArrowsLeftRight,
  "CI/CD": ArrowsClockwise,
  SQL: Database,
  OAuth2: Plugs,
  "Claude Code": Code,
}

const CLOUD_INFRA = new Set(["AWS", "Docker", "CI/CD", "REST", "JWT", "OAuth2"])

function Badge({ id, size = 20 }: { id: string; size?: number }) {
  const b = BADGE[id]
  if (!b) return null
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.29,
        background: b.bg,
        boxShadow: "inset 0 1px 0 rgb(255 255 255 / .28)",
      }}
    >
      <b.icon size={size * 0.62} weight="fill" color="white" />
    </span>
  )
}

/**
 * The grouped inset list: a sentence-case caption above a rounded card of
 * rows, hairlines between rows inset to the text column rather than
 * running the full width. This shape is System Settings. The previous
 * version used uppercase tracked captions and full-bleed dividers, which
 * is a generic web list, not this pane.
 */
function Group({ caption, children }: { caption?: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      {caption && <h4 className="mb-1.5 px-1 text-[13px] text-text-2">{caption}</h4>}
      <ul className="overflow-hidden rounded-(--r-card) bg-panel-2">{children}</ul>
    </section>
  )
}

/** Inset hairline, drawn by the row so it can start at the text column.
 *  A `border-t` cannot be inset, and `divide-y` runs the full width. */
const ROW = "relative flex h-11 items-center gap-3 px-3 before:absolute before:left-[42px] before:right-0 before:top-0 before:h-px before:bg-divider first:before:hidden"

function SkillRow({ skill }: { skill: Skill }) {
  const open = useOS((s) => s.open)
  const matchingProject = projects.find((p) => p.tech.some((t) => t.toLowerCase() === skill.name.toLowerCase()))
  const Fallback = GLYPH_FALLBACK[skill.name]
  // A slug that Simple Icons does not carry renders the browser's broken
  // image placeholder, which looks like a bug in the page. Falling back to
  // the glyph keeps plan/11's "never a blank" promise honest when the CDN
  // 404s or is blocked entirely.
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = skill.slug && !logoFailed

  const content = (
    <>
      {showLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://cdn.simpleicons.org/${skill.slug}/A0A0A6`}
          alt=""
          width={18}
          height={18}
          loading="lazy"
          onError={() => setLogoFailed(true)}
        />
      ) : Fallback ? (
        <Fallback size={16} weight="light" className="text-text-2" aria-hidden />
      ) : (
        <span className="w-[18px]" aria-hidden />
      )}
      <span className="text-[13px] text-text">{skill.name}</span>
    </>
  )

  if (matchingProject) {
    return (
      <li className={ROW}>
        <button
          type="button"
          onClick={() => open("finder")}
          className="absolute inset-0 flex items-center gap-3 px-3 hover:bg-panel-3"
        >
          {content}
        </button>
      </li>
    )
  }
  return <li className={ROW}>{content}</li>
}

function AppearancePane() {
  const accentTint = useOS((s) => s.accentTint)
  const setAccentTint = useOS((s) => s.setAccentTint)
  const glassClear = useOS((s) => s.glassClear)
  const setGlassClear = useOS((s) => s.setGlassClear)

  return (
    <>
      <Group caption="Accent color">
        <li className="flex items-center gap-3 px-3 py-3.5">
          <div role="radiogroup" aria-label="Accent color" className="flex items-center gap-2.5">
            {(Object.keys(ACCENT_TINTS) as AccentTint[]).map((tint) => {
              const selected = accentTint === tint
              return (
                <button
                  key={tint}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={tint}
                  onClick={() => setAccentTint(tint)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: ACCENT_TINTS[tint],
                    boxShadow: selected
                      ? "0 0 0 2px var(--os-panel-2), 0 0 0 3.5px var(--os-text)"
                      : "inset 0 1px 0 rgb(255 255 255 / .3)",
                  }}
                >
                  {selected && <Check size={11} weight="bold" color="white" />}
                </button>
              )
            })}
          </div>
        </li>
      </Group>

      <Group caption="Glass">
        <li className="flex items-center justify-between gap-4 px-3 py-3">
          <div>
            <p className="text-[13px] text-text">Clear</p>
            <p className="text-xs text-text-2">Maximizes transparency across windows, menus, and the Dock.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={glassClear}
            aria-label="Clear glass"
            onClick={() => setGlassClear(!glassClear)}
            className="relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors"
            style={{ background: glassClear ? "var(--os-accent)" : "var(--os-panel-3)" }}
          >
            <span
              className="absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white transition-[left]"
              style={{ left: glassClear ? 18 : 2 }}
            />
          </button>
        </li>
      </Group>
    </>
  )
}

export function SystemSettings() {
  const [groupId, setGroupId] = useState<string>(APPEARANCE_ID)
  const [query, setQuery] = useState("")
  const group = skills.find((g) => g.id === groupId)

  // The search field is the first thing in the real sidebar, and it does
  // real work here rather than being chrome: it filters the category list.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return skills
    return skills.filter(
      (g) => g.label.toLowerCase().includes(q) || g.skills.some((s) => s.name.toLowerCase().includes(q))
    )
  }, [query])

  const cloudInfra = group?.id === "cloud" ? group.skills.filter((s) => CLOUD_INFRA.has(s.name)) : []
  const cloudTools = group?.id === "cloud" ? group.skills.filter((s) => !CLOUD_INFRA.has(s.name)) : []

  const rowClass = (active: boolean) =>
    `flex w-full items-center gap-2.5 rounded-(--r-control) px-2 py-[5px] text-left text-[13px] ${
      active ? "text-white" : "text-text hover:bg-panel-3"
    }`
  // Selected rows are a solid accent fill with white text, not a soft
  // tint. That is what System Settings does and it is the difference
  // between "a list with a highlighted item" and this pane.
  const rowStyle = (active: boolean) => (active ? { background: "var(--os-accent-fill)" } : undefined)

  return (
    <div className="flex h-full gap-(--r-inset)">
      <Sidebar ariaLabel="Settings categories" width={210}>
        <div className="mb-2 flex items-center gap-1.5 rounded-(--r-pill) bg-panel-3 px-2.5 py-1.5">
          <MagnifyingGlass size={12} weight="bold" className="shrink-0 text-text-2" />
          <label htmlFor="settings-search" className="sr-only">
            Search settings
          </label>
          <input
            id="settings-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-xs text-text placeholder:text-text-2 focus:outline-none"
          />
        </div>

        <button
          type="button"
          aria-pressed={groupId === APPEARANCE_ID}
          aria-controls="settings-pane"
          onClick={() => setGroupId(APPEARANCE_ID)}
          className={rowClass(groupId === APPEARANCE_ID)}
          style={rowStyle(groupId === APPEARANCE_ID)}
        >
          <Badge id={APPEARANCE_ID} />
          Appearance
        </button>
        <div className="my-2 h-px bg-divider" aria-hidden />

        {visible.map((g) => (
          <button
            key={g.id}
            type="button"
            aria-pressed={groupId === g.id}
            aria-controls="settings-pane"
            onClick={() => setGroupId(g.id)}
            className={rowClass(groupId === g.id)}
            style={rowStyle(groupId === g.id)}
          >
            <Badge id={g.id} />
            <span className="truncate">{g.label}</span>
          </button>
        ))}

        {visible.length === 0 && (
          <p className="px-2 py-3 text-xs text-text-2">No settings match &ldquo;{query}&rdquo;.</p>
        )}
      </Sidebar>

      <div
        id="settings-pane"
        aria-live="polite"
        className="os-plate min-w-0 flex-1 overflow-auto rounded-(--r-float) px-6 py-5"
      >
        {group ? (
          <>
            <h3 className="mb-4 text-[15px] font-semibold text-text">{group.label}</h3>
            {group.id === "cloud" ? (
              <>
                <Group caption="Infrastructure">
                  {cloudInfra.map((s) => (
                    <SkillRow key={s.name} skill={s} />
                  ))}
                </Group>
                <Group caption="Developer tools">
                  {cloudTools.map((s) => (
                    <SkillRow key={s.name} skill={s} />
                  ))}
                </Group>
              </>
            ) : (
              <Group>
                {group.skills.map((s) => (
                  <SkillRow key={s.name} skill={s} />
                ))}
              </Group>
            )}
          </>
        ) : (
          <>
            <h3 className="mb-4 text-[15px] font-semibold text-text">Appearance</h3>
            <AppearancePane />
          </>
        )}
      </div>
    </div>
  )
}
