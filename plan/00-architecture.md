# 00 - Architecture

The contract every other document in `plan/` defers to. When two documents disagree, this one wins.

---

## 1. The concept in one paragraph

The portfolio becomes a macOS desktop. A wallpaper, a menu bar, a Dock, and windows you can drag, resize, minimize, maximize, and stack. Each window is an app, and each app holds exactly one bucket of real content. Finder holds the projects. Terminal is a working REPL. About This Mac is the profile. Underneath all of it, always present in the DOM, is a plain semantic HTML document that search engines and screen readers read directly, and that a visitor can switch to at any time from the menu bar.

The concept only works if the windows feel native. That is why the 3D interaction layer is specified in `02-window-manager.md` before any app is specified.

---

## 2. Target file tree

```
src/
  app/
    layout.tsx                  server. fonts, metadata, JSON-LD. no chrome.
    page.tsx                    server. <ReaderView /> + <DesktopShell />
    globals.css                 tokens, base, one glass utility
    api/github/route.ts         KEEP, one edit (see 12-app-activity.md)
    sitemap.ts                  KEEP unchanged
    robots.ts                   KEEP unchanged

  data/                         plain TS. no 'use client'. server-importable.
    profile.ts
    projects.ts
    experience.ts
    skills.ts
    socials.ts
    apps.ts                     AppId union + the app registry

  os/                           the window manager. no JSX.
    types.ts
    store.ts                    zustand
    useWindowDrag.ts
    useWindowResize.ts
    useKeyboardShortcuts.ts

  components/
    shell/
      DesktopShell.tsx          'use client'. the only client entry point.
      MenuBar.tsx
      Menu.tsx                  one dropdown, used by MenuBar
      Dock.tsx
      DockIcon.tsx
      Desktop.tsx
      Wallpaper.tsx
      DesktopIcons.tsx
      ContextMenu.tsx
      BootSequence.tsx
      MissionControl.tsx
    window/
      Window.tsx
      TrafficLights.tsx
      ResizeHandles.tsx
    apps/
      Finder.tsx
      Terminal.tsx
      AboutThisMac.tsx
      Notes.tsx
      SystemSettings.tsx
      ActivityMonitor.tsx
      Mail.tsx
      Preview.tsx
      Orchestrator.tsx
      OrchestratorScene.tsx     the R3F canvas, lazy, ssr:false
      registry.tsx              AppId -> component. the one lazy-import map.
    mobile/
      Springboard.tsx
      AppSheet.tsx
      StatusBar.tsx
    reader/
      ReaderView.tsx            server component
    primitives/
      Squircle.tsx              the app-icon tile
      Chip.tsx                  tech tags, everywhere
      EmptyState.tsx            offline, no-document, no-results

  lib/
    utils.ts                    KEEP unchanged. cn().
```

**50 files.** Nothing else. If implementation wants a 51st, it needs a reason recorded here first.

The current `src/` holds 85 files and 7,535 LOC. The target is 50 files and roughly 3,400 LOC, which is an average of about 68 lines per file. The win is not fewer files, it is that every file is small, focused, and reachable. Today 78 of the 85 are deleted outright and 52% of the component LOC has no importer at all.

---

## 3. Data flow

One direction, no exceptions.

```
src/data/*.ts
   |
   |  imported directly, no props threading, no context
   |
   +---> src/components/reader/ReaderView.tsx      (server, always rendered)
   |
   +---> src/components/apps/*.tsx                 (client leaves)
   |
   +---> src/data/apps.ts ---> os/store.ts         (registry drives the window manager)
```

Rules:

- **App components never receive content as props.** They import from `src/data/` themselves. The only props an app gets are `windowId` and, on mobile, `onClose`.
- **The store never holds content.** It holds window geometry and mode. Nothing else.
- **`ReaderView` and the apps read the same modules.** There is no second copy of any string, anywhere. This is the whole reason `src/data/` exists.

### Cross-app actions

Some apps open other apps (Terminal's `open finder`, About's "System Report" button, a Finder project link). They do it by calling `useOS.getState().open('activity')`. No prop callbacks, no event bus.

---

## 4. The rendering architecture (the piece that makes this viable)

A client-side OS simulation with no server-rendered content is invisible to search. The fix is structural, not a workaround.

```tsx
// src/app/page.tsx   -- SERVER COMPONENT, no 'use client'
export default function Page() {
  return (
    <>
      <ReaderView />     {/* real semantic HTML. always in the DOM. server-rendered. */}
      <DesktopShell />   {/* 'use client'. position: fixed; inset: 0. mounts over it. */}
    </>
  )
}
```

```
        what the server sends              what the user sees
        ---------------------              ------------------
        <ReaderView>                       [ DesktopShell, fixed, opaque ]
          <h1>Daksh Jain</h1>                  menubar
          <section id="projects">              wallpaper
            <article>DocuMind AI</article>     windows
            ...                                dock
          </section>                       [ ReaderView underneath, inert ]
          <section id="experience">
          ...
        </ReaderView>
```

- Crawlers, the no-JS path, and "view source" all get the complete document.
- While `mode !== 'reader'`, `ReaderView` carries `inert` and `aria-hidden="true"`, so keyboard focus and assistive tech see only the desktop. One tree is live at a time.
- The menu bar Reader toggle sets `mode = 'reader'`, which unmounts `DesktopShell` and drops `inert`. It reveals DOM that was already there. Nothing re-fetches, nothing re-renders from scratch.
- Zero content duplication. One data source, two presentations.

`DesktopShell` is the **only** `'use client'` boundary at the top. Everything under it is client by inheritance. `layout.tsx`, `page.tsx`, and `ReaderView.tsx` stay server components. Compare with today, where `page.tsx` is `'use client'` for a single `useState`, forcing the entire tree client-side.

---

## 5. `AppId` (canonical list)

Defined in `src/data/apps.ts`. Every document that names an app uses these exact strings.

```ts
type AppId =
  | 'finder'
  | 'about'
  | 'notes'
  | 'settings'
  | 'activity'
  | 'mail'
  | 'preview'
  | 'terminal'
  | 'orchestrator'
```

Nine apps. `github` and `linkedin` appear in the Dock but are **not** `AppId` values, they are external links and open in a new tab. They are typed separately as `DockLink`.

### App registry shape

```ts
type AppMeta = {
  id: AppId
  title: string          // window titlebar and menu bar app name
  icon: PhosphorIcon     // the glyph inside the squircle
  tint: [string, string] // squircle gradient stops
  defaultRect: Rect      // where it opens on a 1440x900 desktop
  minSize: { w: number; h: number }
  onDesktop?: string     // desktop icon label, if it has one
  dockOrder: number
}
```

| id | title | default w x h | min w x h | desktop icon |
|---|---|---|---|---|
| `finder` | Projects | 940 x 600 | 640 x 400 | `Projects` |
| `about` | About This Mac | 620 x 520 | 520 x 440 | |
| `notes` | Experience | 820 x 560 | 560 x 400 | |
| `settings` | Skills | 780 x 560 | 600 x 420 | |
| `activity` | Activity Monitor | 720 x 500 | 560 x 380 | |
| `mail` | Contact | 680 x 540 | 520 x 420 | |
| `preview` | Resume.pdf | 700 x 780 | 480 x 500 | `Resume.pdf` |
| `terminal` | Terminal | 720 x 460 | 480 x 300 | |
| `orchestrator` | Orchestrator | 800 x 600 | 560 x 420 | |

Plus one non-app desktop icon: `README.txt`, which opens `about`.

Default rects are cascaded so two windows opened in sequence do not stack exactly. See `02-window-manager.md` section on cascade offset.

---

## 6. Design tokens

Full CSS in `01-foundation.md`. This is the naming contract. Any document using a token name not on this list is a defect.

### Surfaces

| Token | Value | Used for |
|---|---|---|
| `--os-void` | `#0B0B0E` | the layer behind the wallpaper, and `body` |
| `--os-chrome` | `rgb(40 40 44 / .72)` | menu bar, Dock, titlebars. always with backdrop blur. |
| `--os-panel` | `#1C1C1F` | window body |
| `--os-panel-2` | `#232326` | sidebars, inset rows, toolbars |
| `--os-panel-3` | `#2A2A2E` | hover on a row, pressed control |

### Edges (the macOS double-edge)

| Token | Value | Used for |
|---|---|---|
| `--os-edge` | `rgb(255 255 255 / .10)` | outer 1px border on chrome and windows |
| `--os-edge-inner` | `rgb(255 255 255 / .14)` | `inset 0 1px 0` top highlight. this is what makes it read as glass. |
| `--os-divider` | `rgb(255 255 255 / .06)` | hairline between rows |

### Text

| Token | Value | Used for |
|---|---|---|
| `--os-text` | `#F5F5F7` | body and headings |
| `--os-text-2` | `#98989D` | secondary, labels, metadata |
| `--os-text-3` | `#6E6E73` | decoration only. **never body copy.** fails AA on `--os-panel`. |

Apple's actual warm-neutral grays. Not cool slate. Mixing the two families is the single fastest way to make this stop looking like macOS.

### Accent (there is exactly one)

| Token | Value | Used for |
|---|---|---|
| `--os-accent` | `#3E7BFA` | focus rings, selected rows, Dock running dot, active tab underline |
| `--os-accent-soft` | `rgb(62 123 250 / .16)` | selected row background |

Nothing else on the page is colored, with one exception:

| Token | Value |
|---|---|
| `--tl-red` | `#FF5F57` |
| `--tl-amber` | `#FEBC2E` |
| `--tl-green` | `#28C840` |

Traffic lights only. Never reused as semantic colors elsewhere.

### Radii (one system, four steps)

| Token | Value | Used for |
|---|---|---|
| `--r-window` | `12px` | window shells, sheets, mission control cards |
| `--r-card` | `10px` | cards and panels inside a window |
| `--r-control` | `6px` | buttons, inputs, small controls |
| `--r-chip` | `999px` | tech chips, pills, the Dock shell |

Squircle app icons are the exception and use `border-radius: 22.5%`, Apple's superellipse ratio, which must scale with the icon rather than sit at a fixed px.

### Motion

| Token | Value | Used for |
|---|---|---|
| `--ease-os` | `cubic-bezier(0.32, 0.72, 0, 1)` | every non-spring transition |
| `--dur-fast` | `140ms` | hover, press, focus |
| `--dur-base` | `240ms` | open, close, tab change |
| `--dur-slow` | `420ms` | mission control, mode switch |

Springs are specified per interaction in `02-window-manager.md` and are not tokens.

---

## 7. z-index scale

Declared once. No arbitrary values anywhere in the codebase. `z-[9999]` is a defect.

| Layer | z-index |
|---|---|
| Wallpaper | `0` |
| Desktop icons | `10` |
| Windows | `100` to `899` (stack index + 100) |
| Dock | `900` |
| Menu bar | `1000` |
| Open menu / context menu | `1100` |
| Mission Control | `1200` |
| Boot sequence | `1300` |

Window stack index is capped at 799 in the store, which is unreachable in practice with 9 apps but prevents any path where a window can paint over the Dock.

---

## 8. Breakpoint

One. `1024px`.

```
< 1024px    Springboard    (16-mobile-springboard.md)
>= 1024px   Desktop        (03 through 06)
```

Both branches render the **same** nine app components from `src/components/apps/`. The branch decides the container, never the content. `DesktopShell` picks the branch with a `matchMedia('(min-width: 1024px)')` listener, not a CSS-only hide, because mounting a window manager on a phone wastes memory even when hidden.

Reader view is available on both.

---

## 9. Client boundary map

| File | Directive | Why |
|---|---|---|
| `layout.tsx` | server | metadata, fonts, JSON-LD |
| `page.tsx` | server | composes the two trees |
| `reader/ReaderView.tsx` | server | it is the SEO payload. it must render without JS. |
| `shell/DesktopShell.tsx` | `'use client'` | the single boundary |
| everything under `shell/`, `window/`, `apps/`, `mobile/` | client by inheritance | no directive needed, but each file that uses hooks declares `'use client'` anyway so it cannot break if an importer changes |
| `data/*.ts` | neither | plain modules, importable from both sides |
| `os/*.ts` | `'use client'` | zustand and hooks |

The existing codebase has four files under `subComponents/` that use hooks with no `'use client'` and only work because every importer happens to be a client component. That fragility does not get carried forward.

---

## 10. What is preserved from the current codebase

| Path | Treatment |
|---|---|
| `src/app/api/github/route.ts` | keep. one edit: drop `MOCK_DATA`, return `{ error: true }`. |
| `src/app/sitemap.ts` | keep unchanged |
| `src/app/robots.ts` | keep unchanged |
| `src/lib/utils.ts` | keep unchanged |
| `layout.tsx` `metadata` export | keep verbatim. it is well-formed and complete. |
| `layout.tsx` JSON-LD `Person` block | keep verbatim. update nothing but `themeColor`. |
| `globals.css` `@theme inline` structure | keep the mechanism, replace the values |
| `TerminalSection.tsx` command resolver | salvage the fuzzy-match logic and command bodies before deleting the file |
| `agent-orchestration-graph-3d.tsx` | salvage node positions and edge pairs before deleting |
| `public/images/projects/*.png` | keep all 7. they are the real project screenshots. |
| `public/images/og-image.jpg` | keep. referenced by metadata. |
| `public/images/profile.avif` | keep. used by About This Mac. |

Everything else under `src/` is deleted. See `01-foundation.md`.

---

## 11. Known gaps that ship with a designed empty state

Neither blocks the build. Both are visible until filled.

| Gap | Owner doc | Behavior until filled |
|---|---|---|
| `public/DakshJain_Resume.pdf` does not exist, and is linked from 3 places today, all 404 | `14-app-preview.md` | Preview renders a real "no document" state with a Contact button |
| No wallpaper images | `05-shell-desktop.md` | CSS mesh gradient plus grain. Switcher reads any JPGs found in `public/wallpapers/`. |
