"use client"

import { profile } from "@/data/profile"
import { socials } from "@/data/socials"
import { useOS } from "@/os/store"
import { Chip } from "@/components/primitives/Chip"

export function AboutThisMac() {
  const open = useOS((s) => s.open)

  return (
    <article className="os-plate h-full overflow-auto rounded-(--r-float) p-8">
      <div className="flex flex-col items-center gap-4 min-[520px]:flex-row min-[520px]:items-start min-[520px]:gap-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={profile.avatar} alt={profile.name} className="h-[100px] w-[100px] shrink-0 rounded-full object-cover min-[520px]:h-[120px] min-[520px]:w-[120px]" />
        <div className="text-center min-[520px]:text-left">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">{profile.name}</h2>
          <p className="text-sm text-text-2">
            {profile.role} at{" "}
            <a href={profile.employer.url} target="_blank" rel="noopener noreferrer" className="text-text underline">
              {profile.employer.name}
            </a>
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2 min-[520px]:justify-start">
            {profile.pillars.map((p) => (
              <li key={p}>
                <Chip>{p}</Chip>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <dl className="my-7 space-y-2">
        {profile.specs.map((spec) => (
          <div key={spec.label} className="flex gap-4 text-xs">
            <dt className="w-[92px] shrink-0 text-right text-text-2">{spec.label}</dt>
            <dd className="text-text">{spec.value}</dd>
          </div>
        ))}
      </dl>

      <div className="max-w-[62ch] space-y-4 text-[13px] leading-[1.65] text-text-2">
        {profile.bio.map((para, i) => (
          <p key={i}>
            {para.parts.map((part, j) =>
              part.link ? (
                <a key={j} href={part.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-text underline">
                  {part.text}
                </a>
              ) : part.bold ? (
                <strong key={j} className="font-semibold text-text">
                  {part.text}
                </strong>
              ) : (
                <span key={j}>{part.text}</span>
              )
            )}
          </p>
        ))}
      </div>

      <footer className="mt-7 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => open("activity")}
          className="os-press rounded-(--r-pill) bg-panel-3 px-3 py-1.5 text-xs text-text"
        >
          System Report
        </button>
        <button
          type="button"
          onClick={() => open("settings")}
          className="os-press rounded-(--r-pill) bg-panel-3 px-3 py-1.5 text-xs text-text"
        >
          Skills
        </button>
        <a
          href={socials.resume}
          onClick={(e) => {
            e.preventDefault()
            open("preview")
          }}
          className="os-press rounded-(--r-pill) bg-accent-soft px-3 py-1.5 text-xs text-accent"
        >
          Resume
        </a>
      </footer>
    </article>
  )
}
