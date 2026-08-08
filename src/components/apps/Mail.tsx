"use client"

import { useState } from "react"
import {
  PaperPlaneTilt,
  EnvelopeSimple,
  Phone,
  MapPin,
  GithubLogo,
  LinkedinLogo,
  Code,
  Cube,
} from "@phosphor-icons/react/dist/ssr"
import { profile } from "@/data/profile"
import { socials } from "@/data/socials"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Mail() {
  const [from, setFrom] = useState("")
  const [subject, setSubject] = useState("Hello Daksh")
  const [body, setBody] = useState("")
  const [errors, setErrors] = useState<{ from?: string; body?: string }>({})

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!EMAIL_RE.test(from)) next.from = "Enter a valid email address so Daksh can reply."
    if (!body.trim()) next.body = "Add a message before sending."
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const href =
      `mailto:${socials.email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(`${body}\n\n${from}`)}`
    window.location.href = href
  }

  return (
    <div className="os-plate flex h-full flex-col overflow-auto rounded-(--r-float)">
      <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <div>
            <label className="mb-1 block text-[11px] text-text-2">To</label>
            <div aria-readonly className="rounded-(--r-control) bg-panel-2 px-2.5 py-1.5 text-xs text-text">
              {profile.name} <span className="text-text-2">&lt;{socials.email}&gt;</span>
            </div>
          </div>
          <div>
            <label htmlFor="mail-from" className="mb-1 block text-[11px] text-text-2">
              From
            </label>
            <input
              id="mail-from"
              type="email"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="you@company.com"
              aria-invalid={!!errors.from}
              aria-describedby={errors.from ? "mail-from-error" : undefined}
              className="w-full rounded-(--r-control) bg-panel-2 px-2.5 py-1.5 text-xs text-text outline-none focus:border-accent"
              style={{ border: "1px solid var(--os-edge)" }}
            />
            {errors.from && (
              <p id="mail-from-error" role="alert" className="mt-1 text-[11px]" style={{ color: "#e57373" }}>
                {errors.from}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="mail-subject" className="mb-1 block text-[11px] text-text-2">
              Subject
            </label>
            <input
              id="mail-subject"
              value={subject}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-(--r-control) bg-panel-2 px-2.5 py-1.5 text-xs text-text outline-none"
              style={{ border: "1px solid var(--os-edge)" }}
            />
          </div>
        </div>

        <div className="min-h-[140px] flex-1">
          <label htmlFor="mail-body" className="sr-only">
            Message
          </label>
          <textarea
            id="mail-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            aria-invalid={!!errors.body}
            aria-describedby={errors.body ? "mail-body-error" : undefined}
            className="h-full min-h-[140px] w-full resize-none rounded-(--r-control) bg-panel-2 p-2.5 text-xs text-text outline-none"
            style={{ border: "1px solid var(--os-edge)" }}
          />
          {errors.body && (
            <p id="mail-body-error" role="alert" className="mt-1 text-[11px]" style={{ color: "#e57373" }}>
              {errors.body}
            </p>
          )}
        </div>

        <footer className="flex items-center gap-2">
          <button
            type="submit"
            aria-describedby="mail-send-hint"
            className="group flex items-center gap-1.5 rounded-(--r-chip) bg-accent px-4 py-1.5 text-xs text-white"
          >
            Send
            <PaperPlaneTilt size={13} weight="light" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <span id="mail-send-hint" className="text-[11px] text-text-2">
            Opens in your mail client
          </span>
        </footer>
      </form>

      <aside className="space-y-2 border-t border-divider p-4">
        <a href={`mailto:${socials.email}`} className="flex items-center gap-2 text-xs text-text-2 hover:text-text">
          <EnvelopeSimple size={13} weight="light" />
          {socials.email}
        </a>
        <a href={`tel:${socials.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-xs text-text-2 hover:text-text">
          <Phone size={13} weight="light" />
          {socials.phone}
        </a>
        <span className="flex items-center gap-2 text-xs text-text-2">
          <MapPin size={13} weight="light" />
          {profile.location}
        </span>
        <div className="flex gap-3 pt-1">
          <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub, opens in a new tab" className="text-text-2 hover:text-text">
            <GithubLogo size={15} weight="light" />
          </a>
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn, opens in a new tab" className="text-text-2 hover:text-text">
            <LinkedinLogo size={15} weight="light" />
          </a>
          <a href={socials.leetcode} target="_blank" rel="noopener noreferrer" aria-label="LeetCode, opens in a new tab" className="text-text-2 hover:text-text">
            <Code size={15} weight="light" />
          </a>
          <a href={socials.huggingface} target="_blank" rel="noopener noreferrer" aria-label="Hugging Face, opens in a new tab" className="text-text-2 hover:text-text">
            <Cube size={15} weight="light" />
          </a>
        </div>
      </aside>
    </div>
  )
}
