"use client"

import { profile } from "@/data/profile"
import { socials } from "@/data/socials"
import { useOS } from "@/os/store"
import { Chip } from "@/components/primitives/Chip"
import { squircleBase, SQUIRCLE_GLASS } from "@/components/primitives/Squircle"

export function AboutThisMac() {
  const open = useOS((s) => s.open)

  return (
    <article className="os-plate h-full overflow-auto rounded-(--r-float) p-8">
      <div className="flex flex-col items-center gap-4 min-[520px]:flex-row min-[520px]:items-start min-[520px]:gap-7">
        {/* A mark, not a headshot. Two reasons, and the second is the real
            one: dev portfolios overwhelmingly don't carry a photo, and -
            more to the point - the actual About This Mac shows the machine,
            never a person. A monogram is what this panel wanted all along.
            Same construction as the menu bar mark and the Dock tiles, so
            the identity reads as one system. */}
        <div
          aria-hidden
          className="relative grid h-[100px] w-[100px] shrink-0 place-items-center min-[520px]:h-[120px] min-[520px]:w-[120px]"
          style={squircleBase(["#4a4a4f", "#1f1f22"])}
        >
          <span className="relative text-[2.4rem] leading-none font-bold tracking-[-0.06em] text-white min-[520px]:text-[2.9rem]">
            dj
          </span>
          <span className="pointer-events-none absolute inset-0" style={SQUIRCLE_GLASS} />
        </div>
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

      {/* Availability, given a row of its own rather than buried in specs:
          it is the field a recruiter scans for first. */}
      <div className="mt-6 flex items-start gap-2.5 rounded-(--r-card) bg-panel-3/60 px-3.5 py-2.5">
        <span
          aria-hidden
          className="mt-[5px] inline-block h-[7px] w-[7px] shrink-0 rounded-full"
          style={{
            background:
              profile.availability.status === "open"
                ? "var(--sys-green)"
                : profile.availability.status === "selective"
                  ? "var(--sys-orange)"
                  : "var(--os-text-3)",
            boxShadow:
              profile.availability.status === "open" ? "0 0 10px var(--sys-green)" : undefined,
          }}
        />
        <div>
          <p className="text-xs font-medium text-text">{profile.availability.label}</p>
          <p className="mt-0.5 text-[11px] text-text-2">{profile.availability.detail}</p>
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
          className="os-press rounded-(--r-pill) bg-accent-soft px-3 py-1.5 text-xs text-link"
        >
          Resume
        </a>
      </footer>
    </article>
  )
}
