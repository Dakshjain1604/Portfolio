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
} from "@phosphor-icons/react/dist/ssr"
import type { IconProps } from "@phosphor-icons/react"
import { skills, type Skill } from "@/data/skills"
import { projects } from "@/data/projects"
import { useOS } from "@/os/store"

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

export function SystemSettings() {
  const [groupId, setGroupId] = useState(skills[0].id)
  const group = skills.find((g) => g.id === groupId) ?? skills[0]

  const cloudInfra = group.id === "cloud" ? group.skills.filter((s) => CLOUD_INFRA.has(s.name)) : []
  const cloudTools = group.id === "cloud" ? group.skills.filter((s) => !CLOUD_INFRA.has(s.name)) : []

  return (
    <div className="flex h-full">
      <nav aria-label="Skill categories" className="w-[196px] shrink-0 border-r border-divider bg-panel-2 p-2">
        {skills.map((g) => {
          const Icon = GROUP_ICON[g.id]
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={groupId === g.id}
              aria-controls="settings-pane"
              onClick={() => setGroupId(g.id)}
              className="flex w-full items-center gap-2.5 rounded-[--r-control] px-2 py-2 text-left text-xs"
              style={{
                background: groupId === g.id ? "var(--os-accent-soft)" : "transparent",
                color: groupId === g.id ? "var(--os-text)" : "var(--os-text-2)",
              }}
            >
              <Icon size={15} weight="light" />
              {g.label}
            </button>
          )
        })}
      </nav>

      <div id="settings-pane" aria-live="polite" className="flex-1 overflow-auto px-6 py-5">
        <h3 className="mb-4 text-sm font-medium text-text">{group.label}</h3>

        {group.id === "cloud" ? (
          <div className="space-y-5">
            {[
              { caption: "Infrastructure", items: cloudInfra },
              { caption: "Developer tools", items: cloudTools },
            ].map(({ caption, items }) => (
              <div key={caption}>
                <h4 className="mb-1 px-1 text-[11px] font-medium uppercase tracking-wide text-text-3">{caption}</h4>
                <ul className="divide-y divide-divider rounded-[--r-card] bg-panel-2">
                  {items.map((s) => (
                    <SkillRow key={s.name} skill={s} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-divider rounded-[--r-card] bg-panel-2">
            {group.skills.map((s) => (
              <SkillRow key={s.name} skill={s} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
