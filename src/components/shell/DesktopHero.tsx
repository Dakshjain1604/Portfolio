"use client"

import { useOS } from "@/os/store"
import { profile } from "@/data/profile"

/**
 * The one thing a desktop-metaphor portfolio has to solve that a scrolling
 * one gets for free: who is this. A visitor landing on a file browser has
 * no answer, so this puts the name on the wallpaper itself, the way the
 * reference build this pass was measured against does.
 *
 * It sits in the wallpaper layer, beneath windows, and recedes rather than
 * disappearing once anything is open - a desktop you can still glimpse
 * behind your windows is the point of the metaphor. `pointer-events-none`
 * throughout, so it never intercepts a desktop right-click or an icon
 * drag: it is scenery, not chrome.
 *
 * Semantically deliberate: no <h1> here. ReaderView (plan/17) owns the
 * document heading for SEO and is always in the DOM as a sibling, so a
 * second h1 in the shell would compete with it.
 */
export function DesktopHero() {
  const busy = useOS((s) => s.stack.length > 0)

  return (
    <div
      aria-hidden={busy}
      className="pointer-events-none absolute inset-y-0 left-0 z-[1] flex max-w-[min(46rem,58vw)] flex-col justify-center pl-[clamp(2rem,6vw,6rem)] pb-24 select-none"
      style={{
        // Receding is opacity plus a touch of blur, not opacity alone.
        // Dropping opacity by itself leaves crisp letterforms reading
        // through a translucent window, which looks like a rendering bug;
        // defocusing them reads as depth.
        opacity: busy ? 0.16 : 1,
        filter: busy ? "blur(3px)" : "none",
        transition: `opacity var(--dur-slow) var(--ease-os), filter var(--dur-slow) var(--ease-os)`,
      }}
    >
      {/* One shadow for the whole block. Text on a wallpaper needs it even
          at 8:1 contrast - it is what stops the type reading as printed
          into the image rather than floating over it. */}
      <div style={{ textShadow: "0 1px 24px rgb(0 0 0 / .55), 0 1px 3px rgb(0 0 0 / .4)" }}>
        <p className="text-[clamp(1rem,1.6vw,1.35rem)] font-light text-text-2">Hi, I&rsquo;m</p>

        <p className="mt-1 text-[clamp(3rem,6.4vw,6.5rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-text">
          {profile.name}.
        </p>

        <p className="mt-5 font-mono text-[clamp(0.7rem,0.95vw,0.8rem)] tracking-[0.18em] text-link uppercase">
          {profile.role}
          <span className="text-text-3">{" // "}</span>
          {profile.employer.name}
        </p>

        <p className="mt-4 flex items-center gap-2 text-[clamp(0.8rem,1vw,0.9rem)] text-text-2">
          <span
            aria-hidden
            className="inline-block h-[7px] w-[7px] shrink-0 rounded-full"
            style={{
              background:
                profile.availability.status === "open"
                  ? "var(--sys-green)"
                  : profile.availability.status === "selective"
                    ? "var(--sys-orange)"
                    : "var(--os-text-3)",
              boxShadow:
                profile.availability.status === "open"
                  ? "0 0 10px var(--sys-green)"
                  : undefined,
            }}
          />
          {profile.availability.label}
        </p>

        <p className="mt-4 max-w-[34rem] text-[clamp(0.95rem,1.15vw,1.075rem)] leading-relaxed text-balance text-text-2">
          {profile.tagline}
        </p>
      </div>

      {/* The affordance. A desktop is only obvious to people who already
          know the metaphor, and the reference build gets away with saying
          nothing because its icons are giant labelled folders. */}
      {/* text-2, not text-3: the token comment in globals.css scopes
          --os-text-3 to decoration and explicitly bars it from body copy,
          and this is a sentence a visitor is meant to read. */}
      <p className="mt-10 flex items-center gap-2 font-mono text-[11px] tracking-wide text-text-2">
        <span
          className="rounded-[5px] px-1.5 py-0.5"
          style={{ background: "rgb(255 255 255 / .07)", boxShadow: "inset 0 0 0 1px var(--os-edge)" }}
        >
          double-click
        </span>
        an icon, or pick an app from the Dock
      </p>
    </div>
  )
}
