"use client"

import { useEffect, useState } from "react"
import { DownloadSimple, ArrowSquareOut, FileX } from "@phosphor-icons/react/dist/ssr"
import { socials } from "@/data/socials"
import { useOS } from "@/os/store"
import { EmptyState } from "@/components/primitives/EmptyState"

function MissingResume() {
  const open = useOS((s) => s.open)
  return (
    <div className="os-plate h-full overflow-hidden rounded-(--r-float)">
      <EmptyState
        icon={FileX}
        title="Resume not available"
        body="The PDF is not published yet. Reach out and Daksh will send it directly."
        actions={
          <>
            <button
              type="button"
              onClick={() => open("mail")}
              className="rounded-(--r-control) bg-accent-soft px-3 py-1.5 text-xs text-accent"
            >
              Contact
            </button>
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-(--r-control) bg-panel-3 px-3 py-1.5 text-xs text-text"
            >
              View GitHub
            </a>
          </>
        }
      />
    </div>
  )
}

export function Preview() {
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Deliberate: navigator is unavailable during SSR, and Safari on iOS
    // does not render PDFs inside <object>, so this can only be resolved
    // client-side. See plan/14-app-preview.md.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsIOS(/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1))
  }, [])

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-(--r-float)" style={{ background: "#141416" }}>
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-divider px-3">
        <span className="truncate text-xs text-text-2">DakshJain_Resume.pdf</span>
        <div className="flex gap-3">
          <a
            href={socials.resume}
            download
            className="flex items-center gap-1 text-xs text-text-2 hover:text-text"
          >
            <DownloadSimple size={13} weight="light" />
            Download
          </a>
          <a
            href={socials.resume}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open resume, opens in a new tab"
            className="flex items-center gap-1 text-xs text-text-2 hover:text-text"
          >
            <ArrowSquareOut size={13} weight="light" />
            Open
          </a>
        </div>
      </div>

      <div className="flex-1">
        {isIOS ? (
          <MissingResume />
        ) : (
          <object data={`${socials.resume}#view=FitH&toolbar=0`} type="application/pdf" aria-label="Resume of Daksh Jain" className="h-full w-full">
            <MissingResume />
          </object>
        )}
      </div>
    </div>
  )
}
