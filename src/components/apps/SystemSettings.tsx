"use client"

import { useState } from "react"
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

const GROUP_ICON: Record<string, ComponentType<IconProps>> = {
  ai: Sparkle,
  backend: HardDrives,
  frontend: Browser,
  languages: Code,
  cloud: CloudArrowUp,
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

function SkillRow({ skill }: { skill: Skill }) {
  const open = useOS((s) => s.open)
  const matchingProject = projects.find((p) => p.tech.some((t) => t.toLowerCase() === skill.name.toLowerCase()))
  const Fallback = GLYPH_FALLBACK[skill.name]

  const content = (
    <>
      {skill.slug ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`https://cdn.simpleicons.org/${skill.slug}/98989D`} alt="" width={18} height={18} loading="lazy" />
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
      <li>
        <button
          type="button"
          onClick={() => open("finder")}
          className="flex h-11 w-full items-center gap-3 px-3 hover:bg-panel-3"
        >
          {content}
        </button>
      </li>
    )
  }
  return (
    <li className="flex h-11 items-center gap-3 px-3">{content}</li>
  )
}

/** Phase 19D: personalization, not portfolio content - deliberately kept
 *  out of src/data/skills.ts and handled as a sentinel category id here,
 *  first in the sidebar per plan/19-liquid-glass-modernization.md. */
const APPEARANCE_ID = "appearance"

function AppearancePane() {
  const accentTint = useOS((s) => s.accentTint)
  const setAccentTint = useOS((s) => s.setAccentTint)
  const glassClear = useOS((s) => s.glassClear)
  const setGlassClear = useOS((s) => s.setGlassClear)

  return (
    <div className="space-y-5">
      <div>
        <h4 className="mb-1 px-1 text-[11px] font-medium uppercase tracking-wide text-text-2">Accent color</h4>
        <div role="radiogroup" aria-label="Accent color" className="flex items-center gap-3 rounded-(--r-card) bg-panel-2 p-4">
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
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: ACCENT_TINTS[tint],
                  boxShadow: selected
                    ? "0 0 0 2px var(--os-panel-2), 0 0 0 4px var(--os-text)"
                    : "inset 0 1px 0 rgb(255 255 255 / .25)",
                }}
              >
                {selected && <Check size={14} weight="bold" color="white" />}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h4 className="mb-1 px-1 text-[11px] font-medium uppercase tracking-wide text-text-2">Glass</h4>
        <div className="flex items-center justify-between gap-4 rounded-(--r-card) bg-panel-2 px-4 py-3">
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
        </div>
      </div>
    </div>
  )
}

export function SystemSettings() {
  const [groupId, setGroupId] = useState<string>(APPEARANCE_ID)
  const group = skills.find((g) => g.id === groupId)

  const cloudInfra = group?.id === "cloud" ? group.skills.filter((s) => CLOUD_INFRA.has(s.name)) : []
  const cloudTools = group?.id === "cloud" ? group.skills.filter((s) => !CLOUD_INFRA.has(s.name)) : []

  return (
    <div className="flex h-full gap-(--r-inset)">
      <Sidebar ariaLabel="Settings categories" width={196}>
        <button
          type="button"
          aria-pressed={groupId === APPEARANCE_ID}
          aria-controls="settings-pane"
          onClick={() => setGroupId(APPEARANCE_ID)}
          // Full text strength on every row, selection carried by the fill
          // alone - --os-text-2 over the clear tier measured 4.32:1 against
          // the composited background, under the 4.5:1 floor.
          className="flex w-full items-center gap-2.5 rounded-(--r-control) px-2 py-2 text-left text-xs text-text"
          style={{ background: groupId === APPEARANCE_ID ? "var(--os-accent-soft)" : "transparent" }}
        >
          <PaintBrush size={15} weight="light" />
          Appearance
        </button>
        <div className="my-2 h-px bg-divider" aria-hidden />
        {skills.map((g) => {
          const Icon = GROUP_ICON[g.id]
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={groupId === g.id}
              aria-controls="settings-pane"
              onClick={() => setGroupId(g.id)}
              className="flex w-full items-center gap-2.5 rounded-(--r-control) px-2 py-2 text-left text-xs text-text"
              style={{ background: groupId === g.id ? "var(--os-accent-soft)" : "transparent" }}
            >
              <Icon size={15} weight="light" />
              {g.label}
            </button>
          )
        })}
      </Sidebar>

      <div
        id="settings-pane"
        aria-live="polite"
        className="os-plate min-w-0 flex-1 overflow-auto rounded-(--r-float) px-6 py-5"
      >
        {group ? (
          <>
            <h3 className="mb-4 text-sm font-medium text-text">{group.label}</h3>
            {group.id === "cloud" ? (
              <div className="space-y-5">
                {[
                  { caption: "Infrastructure", items: cloudInfra },
                  { caption: "Developer tools", items: cloudTools },
                ].map(({ caption, items }) => (
                  <div key={caption}>
                    <h4 className="mb-1 px-1 text-[11px] font-medium uppercase tracking-wide text-text-2">
                      {caption}
                    </h4>
                    <ul className="divide-y divide-divider rounded-(--r-card) bg-panel-2">
                      {items.map((s) => (
                        <SkillRow key={s.name} skill={s} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-divider rounded-(--r-card) bg-panel-2">
                {group.skills.map((s) => (
                  <SkillRow key={s.name} skill={s} />
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <h3 className="mb-4 text-sm font-medium text-text">Appearance</h3>
            <AppearancePane />
          </>
        )}
      </div>
    </div>
  )
}
