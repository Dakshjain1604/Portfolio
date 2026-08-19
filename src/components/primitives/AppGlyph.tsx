"use client"

import {
  FolderSimple,
  Info,
  GearSix,
  ChartLine,
  EnvelopeSimple,
  FilePdf,
  GithubLogo,
} from "@phosphor-icons/react/dist/ssr"
import type { AppId, LinkId } from "@/data/apps"
import { SQUIRCLE_RADIUS } from "./Squircle"

/**
 * The artwork inside an app tile.
 *
 * Every icon in this build used to be the same construction: one thin
 * outline glyph, `weight="light"`, white, centred, on a two-stop
 * gradient. Nine of those in a row is why the Dock read as a generic
 * flat icon set rather than as macOS. Real Mac icons differ from each
 * other structurally - Terminal is a near-black tile with a small prompt
 * in the top-left, Notes is paper with a yellow band across the top,
 * Mail is a white envelope filling a blue tile - and that structural
 * variety is most of what makes a Dock look like a Dock.
 *
 * Glyphs still come from Phosphor. Nothing here draws an icon path by
 * hand; the compositions are library glyphs plus plain geometry. The
 * fills matter: `weight="light"` strokes vanish at Dock size, which is
 * the other half of why these read as thin and unfinished.
 *
 * Renders into a `position: relative` tile - see Squircle and DockIcon.
 */

/** Layers that must clip to the tile's superellipse sit in here. */
function Clip({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ borderRadius: SQUIRCLE_RADIUS }}
    >
      {children}
    </span>
  )
}

const LIFT = "drop-shadow(0 1px 1.5px rgb(0 0 0 / .3))"

export function AppGlyph({ id, size }: { id: AppId; size: number }) {
  const s = (f: number) => Math.round(size * f)

  switch (id) {
    // Finder's face is split light/dark down the middle. Carried as the
    // tile's own division rather than a drawn face, with the folder as
    // the content.
    case "finder":
      return (
        <>
          <Clip>
            <span className="absolute inset-y-0 left-0 w-1/2" style={{ background: "rgb(255 255 255 / .15)" }} />
          </Clip>
          <FolderSimple size={s(0.54)} weight="fill" color="white" className="relative" style={{ filter: LIFT }} />
        </>
      )

    // Notes: paper, a yellow band across the top, ruled lines under it.
    case "notes":
      return (
        <Clip>
          <span
            className="absolute inset-x-0 top-0"
            style={{ height: "28%", background: "linear-gradient(var(--sys-yellow), #f5c400)" }}
          />
          {[0.46, 0.62, 0.78].map((top, i) => (
            <span
              key={top}
              className="absolute rounded-full"
              style={{
                top: `${top * 100}%`,
                left: "20%",
                width: i === 2 ? "38%" : "60%",
                height: Math.max(1, s(0.045)),
                background: "rgb(60 60 60 / .3)",
              }}
            />
          ))}
        </Clip>
      )

    // Terminal: the prompt sits top-left with a block cursor, it is not a
    // centred glyph. That offset is the whole silhouette of the real icon.
    case "terminal":
      return (
        <Clip>
          <span
            className="absolute font-mono font-semibold leading-none"
            style={{ left: "18%", top: "22%", fontSize: s(0.3), color: "rgb(255 255 255 / .95)" }}
          >
            {">"}
          </span>
          <span
            className="absolute"
            style={{
              left: "38%",
              top: "24%",
              width: s(0.18),
              height: s(0.26),
              background: "rgb(255 255 255 / .95)",
            }}
          />
        </Clip>
      )

    // Two gears, offset, the way System Settings stacks them.
    case "settings":
      return (
        <>
          <GearSix
            size={s(0.54)}
            weight="fill"
            color="rgb(255 255 255 / .95)"
            className="relative"
            style={{ filter: LIFT, transform: `translate(${-s(0.06)}px, ${-s(0.04)}px)` }}
          />
          <GearSix
            size={s(0.3)}
            weight="fill"
            color="rgb(255 255 255 / .6)"
            className="absolute"
            style={{ right: s(0.14), bottom: s(0.15) }}
          />
        </>
      )

    // Dark instrument panel with a live green trace.
    case "activity":
      return (
        <ChartLine
          size={s(0.58)}
          weight="bold"
          color="var(--sys-green)"
          className="relative"
          style={{ filter: "drop-shadow(0 1px 3px rgb(48 209 88 / .45))" }}
        />
      )

    case "mail":
      return <EnvelopeSimple size={s(0.56)} weight="fill" color="white" className="relative" style={{ filter: LIFT }} />

    case "preview":
      return <FilePdf size={s(0.58)} weight="fill" color="var(--sys-red)" className="relative" />

    case "about":
      return <Info size={s(0.58)} weight="fill" color="rgb(28 28 28 / .8)" className="relative" />

    default:
      return null
  }
}

/**
 * The Dock's two external links. Split from AppGlyph because they are keyed
 * by LinkId, not AppId, but built to the same rules - and shared so the Dock
 * and the Springboard grid cannot drift apart, which is exactly what
 * happened when each drew its own `weight="light"` outline.
 */
export function LinkGlyph({ id, size }: { id: LinkId; size: number }) {
  const s = (f: number) => Math.round(size * f)

  if (id === "github") {
    // Solid, not outlined. A light-weight octocat at 52px is a few
    // hairlines that disappear against the tile.
    return (
      <GithubLogo size={s(0.58)} weight="fill" color="white" className="relative" style={{ filter: LIFT }} />
    )
  }

  // LinkedIn's mark is the "in" wordmark, not a glyph in a box. Phosphor's
  // LinkedinLogo is the full rounded-square badge, so dropping it into a
  // squircle would nest one tile inside another; the wordmark alone is what
  // the real icon shows.
  return (
    <span
      className="relative font-semibold leading-none text-white"
      style={{ fontSize: s(0.46), letterSpacing: "-0.04em", filter: LIFT }}
    >
      in
    </span>
  )
}
