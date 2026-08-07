# MacOS.md

**The core revamp brief. Read this end to end before opening `plan/`.**

This document says what the portfolio becomes, what changes, in what order, and why. The `plan/` directory holds one implementation spec per unit of work. If this document and a `plan/` file disagree on a decision, `plan/00-architecture.md` is the tiebreaker.

Project: `/Users/dakshjain/Documents/CODES/Portfolio/Portfolio`
Stack stays: Next.js 16 App Router, React 19, Tailwind v4 CSS-first, Motion, R3F.

---

## 1. What this becomes

The portfolio becomes a macOS desktop.

A wallpaper. A menu bar with working menus. A Dock with magnification. Windows you drag, resize, minimize, maximize, and stack in real depth. Each window is an app, and each app holds exactly one bucket of real content. Underneath all of it, always present in the DOM, is a plain semantic HTML document that search engines and screen readers read directly and that any visitor can switch to from the menu bar.

Below 1024px it becomes an iOS home screen: an app grid on the wallpaper, where tapping an icon springs open a full-screen sheet you dismiss by dragging down. Same apps, same content, correct interaction model for the device.

The concept only works if the windows feel native. That is why `plan/02-window-manager.md` is specified before any app, and why the 3D interaction layer is treated as the product rather than as decoration.

### The app map

| App | Content | Why this container |
|---|---|---|
| **Finder** | the 7 projects | Finder is genuinely the right UI for browsing a small collection where each item has a thumbnail, a name, and metadata |
| **Terminal** | a working REPL | ported from the existing `TerminalSection.tsx`, the best component in the current codebase |
| **About This Mac** | profile and bio | a portrait, a name, and a specification table is exactly the shape of a professional profile |
| **Notes** | the 3 roles | the content is genuinely prose, and three notes reads as complete where three timeline entries reads as sparse |
| **System Settings** | the 5 skill groups | its native shape is a category sidebar plus a pane of labeled rows, which is what a grouped skill list is |
| **Activity Monitor** | live GitHub data | macOS's live-data window, and the data genuinely is activity over time |
| **Mail** | contact | a pre-addressed compose window closes the gap between "I should email him" and "I am typing an email to him" |
| **Preview** | the resume PDF | macOS's document viewer, and the content is a document |
| **Orchestrator** | the 3D showpiece | an orbitable multi-agent graph. The subject matter is literally the work. |

Dock order: Finder, About This Mac, Notes, System Settings, Activity Monitor, Mail, Preview, Terminal, Orchestrator, then GitHub and LinkedIn as external links.

---

## 2. Why the rewrite

Two findings from the audit. Either alone would justify major work; together they rule out a restyle.

### It does not differentiate

Dark background, sky-blue accent, glass cards, an eyebrow label above every section, a hero with a rotating word. That combination is the exact signature every AI-assisted portfolio ships in 2026. For an engineer whose positioning is AI systems work, looking like the default output of an AI tool is the failure mode.

### Over half the code is unreachable

| Measure | Current |
|---|---|
| Source files in `src/` | 85 |
| Total LOC in `src/` | 7,535 |
| LOC with no importer | ~3,450 (52% of component code) |
| Dead files in `src/components/ui/` | 23 of 29 |
| Dead files in `src/app/components/` | 9 of 17 |
| Files that survive the rewrite | **7** |
| Dependencies with zero imports | 5 |

Specifically: `gsap`, `styled-components`, `class-variance-authority`, `react-icons`, and `tailwind-animate` are installed and imported nowhere. `tailwind.config.js` is a v3-shape config that is inert under v4, with `content` globs pointing at three directories that do not exist. `design-system/MASTER.md` specifies a light theme with entirely different fonts from the shipped dark one.

And one live bug: **`clsx` is imported by `src/lib/utils.ts` and is not in `package.json`.** It resolves today only because it is hoisted as a transitive dependency. A clean install with a different resolver, or any hoisting change, breaks the build.

### Three content problems worth naming

1. **`api/github/route.ts` returns fabricated data on failure.** When `GITHUB_TOKEN` is unset, it serves a `MOCK_DATA` object with invented star counts (`DocuMind-Ai` 45 stars, 1,248 contributions) presented as real. Because the route never fails, the "telemetry offline" state in `GitHubStats.tsx` is unreachable code that has never rendered once.
2. **`Testimonials.tsx` contains fake praise from John Doe, Jane Smith, and Mike Johnson.** `stats-widgets.tsx` invents commit counts and coding hours. Neither renders today. Neither survives the rewrite.
3. **`public/DakshJain_Resume.pdf` does not exist** and is linked from three places, all 404.

---

## 3. What survives

Not everything is wrong. These are carried forward:

| Path | Treatment |
|---|---|
| `src/app/api/github/route.ts` | keep, one edit: delete `MOCK_DATA`, return `{ error: true }` |
| `src/app/sitemap.ts`, `robots.ts` | unchanged |
| `src/lib/utils.ts` | unchanged, the standard `cn()` |
| `layout.tsx` `metadata` export | **verbatim.** It is well-formed, complete, and correct. |
| `layout.tsx` JSON-LD `Person` block | verbatim, except `sameAs` now imports from `data/socials.ts` |
| `globals.css` `@theme inline` structure | keep the mechanism, replace the values. It is well-formed Tailwind v4. |
| `TerminalSection.tsx` command resolver | salvage the fuzzy-match logic and command bodies before deleting |
| `agent-orchestration-graph-3d.tsx` | salvage node positions and edge pairs before deleting |
| `public/images/projects/*.png` | all 7. These are real product screenshots of real work. |
| `public/images/og-image.jpg`, `profile.avif` | keep |

The seven project screenshots matter more than they look. They are what lets the build satisfy the taste skill's real-images requirement without generating a single placeholder.

---

## 4. What dies

| Path | Files | LOC |
|---|---|---|
| `src/components/ui/` | 29 | 3,041 |
| `src/app/components/` | 17 | 3,212 |
| `src/app/subComponents/` | 4 | 361 |
| `src/app/icons/` | 28 | 245 |
| `design-system/` | 1 | 203 |
| `tailwind.config.js` | 1 | 19 |
| `components.json` | 1 | 23 |
| **Total** | **81** | **7,104** |

Plus 18 orphaned images and the five Next.js starter SVGs from `public/`.

Two removals worth explaining, since both look like losses:

**`CustomCursor` must go.** It applies `cursor: none !important` to every element on fine-pointer devices. The desktop depends on eight distinct native resize cursors plus `grab` on titlebars and `text` in Terminal, and those cursors carry a large share of the "this feels native" impression. It also reassigns global `console.warn` at module scope and never restores it, silencing a whole class of warnings from a file whose name gives no hint.

**`LoadingScreen` must go.** It blocks the viewport for a fixed 2000ms `setTimeout` unrelated to actual load state, which is a guaranteed 2 second LCP penalty on every single visit. Its progress bar is driven by `Math.random()`. It renders "Press any key to skip" while no keydown listener exists anywhere in `src/`. The replacement boot sequence is 900ms, gated to once per session, actually skippable, and its progress bar is a real fixed-duration transition.

---

## 5. The design system

### Palette

`#05050A` plus `#38BDF8` sky is the AI-default fingerprint. Replaced with warm-neutral graphite matching real macOS dark mode.

| Token | Value | Role |
|---|---|---|
| `--os-void` | `#0B0B0E` | behind the wallpaper, and `body` |
| `--os-chrome` | `rgb(40 40 44 / .72)` | menu bar, Dock, titlebars, always blurred |
| `--os-panel` | `#1C1C1F` | window body |
| `--os-panel-2` | `#232326` | sidebars, toolbars, inset rows |
| `--os-panel-3` | `#2A2A2E` | row hover, pressed control |
| `--os-edge` | `rgb(255 255 255 / .10)` | outer hairline |
| `--os-edge-inner` | `rgb(255 255 255 / .14)` | inner top highlight |
| `--os-text` | `#F5F5F7` | body and headings |
| `--os-text-2` | `#98989D` | labels, metadata |
| `--os-text-3` | `#6E6E73` | decoration only, never body copy |
| `--os-accent` | `#3E7BFA` | **the only accent.** focus rings, selected rows, Dock running dot. |
| `--tl-red / amber / green` | `#FF5F57 / #FEBC2E / #28C840` | traffic lights, used nowhere else |

The grays are Apple's actual warm-neutral family, not cool slate. Mixing the two is the single fastest way to make this stop reading as macOS.

### Type: four families down to two

Three loading mechanisms currently fight each other: `next/font` Geist, two render-blocking remote `@import` calls pulling Clash Display, Satoshi, and JetBrains Mono, and a `Playfair_Display` import in `tailwind.config.js` assigned to a variable that is never used.

**Geist Sans and Geist Mono only, both through `next/font`.** Geist is the closest freely-licensed analogue to SF Pro, which is precisely the register macOS chrome needs, and it is already installed and self-hosted. Both remote `@import` lines are deleted.

Four families to two. Two render-blocking round trips to zero.

### Radii, z-index, motion

One radius system: `--r-window` 12px, `--r-card` 10px, `--r-control` 6px, `--r-chip` 999px. App icons use `border-radius: 22.5%`, Apple's superellipse ratio as a percentage so it scales.

One z-index scale, declared once, no arbitrary values: wallpaper 0, desktop icons 10, windows 100 to 899, Dock 900, menu bar 1000, menus 1100, Mission Control 1200, boot 1300.

One easing curve for non-spring transitions: `cubic-bezier(0.32, 0.72, 0, 1)`. Springs are specified per interaction.

### Icons

Phosphor for all UI glyphs, at one consistent stroke weight. Simple Icons via `cdn.simpleicons.org` for brand logos in System Settings and Mail. This replaces `lucide-react` and the 28 hand-rolled SVG stubs in `src/app/icons/`, and satisfies the taste skill's ban on both Lucide-as-default and hand-rolled decorative SVG paths.

---

## 6. The 3D interaction model

Everything except one contained WebGL scene is CSS 3D transforms. The desktop root sets `perspective: 1400px` and `transform-style: preserve-3d`, and every window shares that one vanishing point.

| Interaction | Transform | What it communicates |
|---|---|---|
| Stack depth | `translateZ(stackIndex * 3px)` plus interpolated shadow | focused windows are genuinely nearer, not just higher in paint order |
| Drag tilt | `rotateY`/`rotateX` from drag velocity, clamped ±5deg, spring back on release | the window has mass |
| Focus lift | `translateZ` over `--dur-fast`, shadow deepens | focus is felt spatially |
| Genie open/close | `transformOrigin` set to the Dock icon's live screen position | windows fly out of and back into their icon |
| Dock magnification | cosine falloff on pointer distance driving scale, lift, and depth | the authentic macOS arc |
| Mission Control | `rotateX(-14deg) translateZ(-120px)`, 40ms stagger | a real Z-axis fan, not a scaled-down grid |

The drag tilt is the effect that carries most of the polished impression, and it costs nothing. Drag velocity naturally decays to zero when the pointer stops, so the spring settles the window flat with no explicit reset. That is the whole trick.

### The one rule that keeps this simple

**During a drag or resize, React state is never touched.** Position is driven by Motion `useMotionValue` bound directly to the element. The store is written exactly once, on pointer-up.

Consequences: the store mutates only on discrete events, so no memoization is needed anywhere in the tree, and a Terminal with 200 lines of scrollback drags exactly as smoothly as an empty window. The failure mode this avoids is `onDrag` calling `setState` sixty times a second, which is the default way to write this and the reason most browser-OS demos stutter.

### The one WebGL scene

`Orchestrator.app`. An orbitable 3D graph of a multi-agent loop where clicking a node explains what that agent does. It earns its place on two grounds: it is the one moment of depth CSS cannot produce, and its subject matter is literally the work, so it passes the taste skill's motion-motivation rule where a generic rotating sphere would not.

Full performance contract: `next/dynamic` with `ssr: false`, `dpr` capped at `[1, 1.5]` desktop and `1` mobile, `antialias: false`, `frameloop` dropping to `demand` when unfocused, and **the Canvas unmounting entirely on window close** so no rAF loop survives. The existing scene has none of this.

---

## 7. The SEO architecture

This is the piece that separates a viable portfolio from a clever demo nobody finds.

A client-rendered OS simulation is invisible to crawlers. The fix is structural:

```tsx
// src/app/page.tsx  -- SERVER COMPONENT
export default function Page() {
  return (
    <>
      <ReaderView />     {/* server-rendered semantic HTML. always in the DOM. */}
      <DesktopShell />   {/* 'use client'. fixed inset-0. paints over it. */}
    </>
  )
}
```

- Crawlers, the no-JS path, and view-source all get the complete document: real `<h1>`, `<section>`, `<article>`, `<a>`, and `<img alt>`.
- While the desktop is active, `ReaderView` carries `inert` and `aria-hidden`, so exactly one tree is in the tab order at a time.
- The menu bar toggle unmounts the shell to reveal DOM that was already there. Nothing refetches.
- **Zero content duplication.** One data source, two presentations.

The no-JS path falls out of this for free. `DesktopShell` never mounts, so `ReaderView` is simply the page. No `<noscript>` block, no second implementation.

Reader view must also stand on its own as a genuinely good document, because for a meaningful share of visitors it is the only page they will see. It is the recruiter escape hatch, the accessibility equivalent, and the SEO payload, served by one component.

Verification that matters: `curl -s localhost:3000 | grep "DocuMind"` must return a hit.

### The data layer that makes it possible

Content today is hardcoded in 8 module-scope arrays across 6 component files. Projects and skills are **duplicated** between `FeaturedProjects.tsx` and `TerminalSection.tsx` with different wording. The social link set is repeated in 5 files, with LinkedIn appearing in two different URL forms.

`src/data/` becomes the single source of truth: `profile.ts`, `projects.ts`, `experience.ts`, `skills.ts`, `socials.ts`, `apps.ts`. Plain TypeScript, no `'use client'`, importable from server components. Every app and the reader read the same modules. No string exists in two places.

---

## 8. Build order

Seven phases. Each unlocks the next.

| Phase | Work | Done when |
|---|---|---|
| **1. Foundation** | delete 81 files, fix dependencies, rewrite `globals.css`, build `src/data/` | `tsc --noEmit` clean, `clsx` in `package.json`, zero remote font imports |
| **2. Window manager** | store, drag, resize, 3D transforms, `Window.tsx`, keyboard | Profiler records **zero renders during a drag**, all 8 resize cursors work |
| **3. Shell** | menu bar, Dock, desktop, wallpaper, boot, Mission Control | every menu item does something, the Dock arc is smooth, boot completes in ~900ms |
| **4. Apps** | the nine content components | every app renders real data, all three network states exist in Activity Monitor |
| **5. Mobile** | springboard, sheets, dismiss gesture, push-detail stack | every app works in a sheet using the same component, no horizontal scroll at 320px |
| **6. Reader** | `ReaderView`, mode toggle, `inert` handling | full document renders with JavaScript disabled |
| **7. Polish** | reduced motion, reduced transparency, contrast, perf | `plan/18-preflight.md` passes in full |

Phase 2 is the risk concentration. If the drag rule is violated there, everything downstream feels worse and no amount of later optimization fully recovers it. Verify the Profiler check before moving on.

### Expected shape at the end

| | Before | After |
|---|---|---|
| Source files | 85 | ~50 |
| LOC in `src/` | 7,535 | ~3,400 |
| Average LOC per file | 89 | ~68 |
| Dead code | ~52% | 0% |
| Runtime dependencies | 17 | 12 |
| Font families | 4, across 3 loading paths | 2, one path |
| Remote font requests | 2 blocking | 0 |
| Server-rendered content | none | the full document |

The file count barely halves while the line count drops by more than half. That is the shape you want: the win is not fewer files, it is that every remaining file is small, focused, and actually reachable.

---

## 9. Two things you need to supply

Neither blocks the build. Both ship with a real, designed empty state. Both are visible to every visitor until filled.

### `public/DakshJain_Resume.pdf`

Currently linked from three places in the live site, all 404. After the revamp, six places reference it: the Preview app, the `Resume.pdf` desktop icon, the Dock, `File > Open Resume`, `File > Download Resume`, and Terminal's `resume` command. All resolve through `socials.resume`, so filling the gap is a single file drop with no code change.

**This is the highest-value outstanding item in the entire build, ahead of any visual polish work.** An unfilled resume link on an engineer's portfolio costs more than any amount of window physics gains.

### `public/wallpapers/*.jpg`

Two or three real wallpaper images. The default is a CSS radial mesh with a grain overlay, which is genuinely good and is the one place on the site where a gradient is the correct answer, since every OS ships an abstract wallpaper. But real imagery would noticeably lift the finish. The switcher reads whatever is in that folder with no code change.

---

## 10. Pre-flight

`plan/18-preflight.md` is the full gate. The mechanical checks run first and take about a minute:

```bash
grep -rn "—\|–" src/                              # em-dash ban. must be zero.
grep -rn "z-\[" src/                              # no arbitrary z-index
grep -rn "lucide-react\|gsap\|styled-components" src/
grep -rn "@import url" src/                       # no remote fonts
grep -rn "addEventListener('scroll'" src/         # no scroll listeners
grep -n '"clsx"' package.json                     # must return a hit
curl -s localhost:3000 | grep -c "DocuMind"       # must be >= 1
```

Then the checks that actually decide whether this shipped well:

- **Profiler records zero renders during a window drag.**
- Under `prefers-reduced-motion`, no boot, no tilt, no genie, no magnification, and drag still works.
- With JavaScript disabled, the full document renders and is navigable.
- Unplug the mouse: every app reachable, every window action performable.
- Lighthouse on the deployed build: LCP under 1.8s, INP under 200ms, CLS under 0.05.
- Zero invented numbers anywhere on the site.

### Nine documented exceptions

The taste skill bans several patterns this brief requires. Each is a conscious override recorded in its owning document so a later reader does not "fix" it: div-based product UI (the OS is the product), a working terminal (it is a real interface), the menu bar clock (the literal artifact being simulated, time and date only), one status dot (the Dock running indicator conveys real state), the Dock animating `width`/`height` (it must reflow to push neighbors aside), the CSS gradient wallpaper, the proportional bar in Activity Monitor (real proportion, no background track), grouped-list dividers in Settings, and small-caps section headings in Reader.

Everything else binds unchanged: **zero em-dashes**, one accent, one radius system, real images, no hand-rolled decorative SVG icons, no AI-purple, reduced motion honored, page theme locked, real focus rings.

---

## Document index

| File | Covers |
|---|---|
| `plan/00-architecture.md` | file tree, data flow, `AppId`, token table, z-index scale, the tiebreaker |
| `plan/01-foundation.md` | deletion list, dependencies, fonts, full `globals.css`, `src/data/` contracts |
| `plan/02-window-manager.md` | store, drag, resize, 3D transform math, `Window.tsx`, keyboard |
| `plan/03-shell-menubar.md` | menus, clock, Reader toggle |
| `plan/04-shell-dock.md` | magnification math, squircle ratio, launch bounce |
| `plan/05-shell-desktop.md` | wallpaper, desktop icons, context menu, boot sequence |
| `plan/06-mission-control.md` | the Z-staggered fan |
| `plan/07-app-finder.md` | projects, three view modes, preview pane |
| `plan/08-app-terminal.md` | the ported REPL and command set |
| `plan/09-app-about.md` | profile, spec table, bio |
| `plan/10-app-notes.md` | experience, note per role |
| `plan/11-app-settings.md` | skills, brand logos, and why there are no proficiency bars |
| `plan/12-app-activity.md` | GitHub data, the `MOCK_DATA` fix, three real states |
| `plan/13-app-mail.md` | compose window, validation, contact card |
| `plan/14-app-preview.md` | the PDF viewer and the missing-file gap |
| `plan/15-app-orchestrator.md` | the R3F scene and its performance contract |
| `plan/16-mobile-springboard.md` | the iOS branch |
| `plan/17-reader-view.md` | SEO and accessibility architecture |
| `plan/18-preflight.md` | the shipping gate |

Every app and shell document follows the same template: **Purpose, Data contract, DOM structure, Motion spec, Mobile behavior, Accessibility contract, Done checklist.**

Two intentional deviations. `05-shell-desktop.md` covers five separate components, so each carries its own structure section and the motion specs are consolidated at the end. `16-mobile-springboard.md` has no Mobile behavior section because the entire document is one.
