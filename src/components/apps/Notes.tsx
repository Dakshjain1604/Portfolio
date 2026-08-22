"use client"

import { useState } from "react"
import { experience } from "@/data/experience"
import { Chip } from "@/components/primitives/Chip"
import { Sidebar } from "@/components/primitives/Sidebar"

export function Notes() {
  const [selectedId, setSelectedId] = useState(experience[0].id)
  const selected = experience.find((r) => r.id === selectedId) ?? experience[0]

  return (
    <div className="flex h-full gap-(--r-inset)">
      <Sidebar as="div" width={260} className="p-1">
        <ul role="listbox" aria-label="Roles">
          {experience.map((role) => (
            <li key={role.id}>
              <button
                type="button"
                role="option"
                aria-selected={selectedId === role.id}
                onClick={() => setSelectedId(role.id)}
                className="flex h-14 w-full flex-col justify-center gap-0.5 rounded-(--r-control) px-3 text-left"
                style={{ background: selectedId === role.id ? "var(--os-accent-soft)" : "transparent" }}
              >
                <span className="truncate text-xs font-medium text-text">{role.title}</span>
                <span className="flex gap-1.5 truncate text-[11px] text-text-2">
                  <span>{role.start}</span>
                  <span className="truncate">
                    {role.org} · {role.location}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Sidebar>

      <article aria-live="polite" className="os-plate min-w-0 flex-1 overflow-auto rounded-(--r-float) px-9 py-7">
        <header className="mb-4">
          <h3 className="text-xl font-semibold tracking-[-0.015em] text-text">{selected.title}</h3>
          <p className="text-xs text-text-2">
            {selected.org} · {selected.location} · {selected.start} to {selected.end}
          </p>
        </header>
        <p className="mb-4 max-w-[64ch] text-sm leading-relaxed text-text-2">{selected.summary}</p>
        <ul className="mb-5 max-w-[64ch] space-y-2">
          {selected.bullets.map((parts, i) => (
            <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-text-2">
              <span aria-hidden className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-text-3" />
              <span>
                {parts.map((part, j) =>
                  part.bold ? (
                    <strong key={j} className="font-semibold text-text">
                      {part.text}
                    </strong>
                  ) : (
                    <span key={j}>{part.text}</span>
                  )
                )}
              </span>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-1.5">
          {selected.tech.map((t) => (
            <li key={t}>
              <Chip>{t}</Chip>
            </li>
          ))}
        </ul>
      </article>
    </div>
  )
}
