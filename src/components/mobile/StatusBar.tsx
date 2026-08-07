"use client"

import { useEffect, useState } from "react"
import { BookOpen } from "@phosphor-icons/react/dist/ssr"
import { useOS } from "@/os/store"

export function StatusBar() {
  const [now, setNow] = useState<Date | null>(null)
  const setMode = useOS((s) => s.setMode)

  useEffect(() => {
    // Deliberate: Date() differs between server and client, and would
    // otherwise cause a hydration mismatch. See MenuBar's identical clock.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 10_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="relative z-10 flex h-11 items-center justify-between px-5 text-white"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <time
        dateTime={now?.toISOString()}
        className="font-mono text-[13px] font-medium"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {now ? new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(now) : ""}
      </time>
      <button
        type="button"
        onClick={() => setMode("reader")}
        aria-label="Switch to Reader view"
        className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px]"
      >
        <BookOpen size={12} weight="light" />
        Reader
      </button>
    </div>
  )
}
