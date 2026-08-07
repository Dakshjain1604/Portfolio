# 16 - Mobile springboard

`src/components/mobile/Springboard.tsx` · `AppSheet.tsx` · `StatusBar.tsx`

Everything below 1024px.

---

## Purpose

A real macOS desktop is unusable on a phone. Drag, resize, window stacking, and Dock magnification are all pointer affordances that either do not exist on touch or are actively hostile to it.

The answer is not to abandon the concept below the breakpoint. It is to switch to the **other** Apple idiom that solves the same problem: an iOS home screen with app icons and full-screen sheets. The metaphor stays unbroken, the interaction model becomes correct for the device, and every app content component is reused unchanged.

Roughly half of portfolio traffic is mobile. This branch is not a fallback, it is half the product.

---

## Data contract

| Source | Used for |
|---|---|
| `data/apps.ts` | the 9 `AppMeta` entries: title, icon, tint, dock order |
| `data/socials.ts` | the two external links in the icon grid |
| `os/store` | `open` and `close` decide which sheet is showing |

The store is still created and still used. What goes unused on this branch is geometry: `rect`, `commitRect`, `toggleMaximize`, `stack` depth, drag, resize, and Mission Control. Only one sheet is open at a time, so `stack` degenerates to a single entry.

---

## DOM structure

```
<div class="fixed inset-0 overflow-hidden">
  <Wallpaper />                       <- the same component as desktop
  <StatusBar />

  <main class="grid grid-cols-3 gap-y-6 px-6 pt-4">
    <button>                          <- one per app
      <Squircle size={62} tint={...}><Icon /></Squircle>
      <span class="label">Projects</span>
    </button>
    ... 9 apps + GitHub + LinkedIn ...
  </main>

  <nav class="dock os-glass fixed bottom-0 mx-3 mb-6 rounded-[26px]">
    4 pinned: finder · terminal · mail · preview
  </nav>

  <AnimatePresence>
    {openApp && <AppSheet id={openApp} />}
  </AnimatePresence>
</div>
```

### The icon grid

3 columns, 62px squircles, labels below at 11px with a `rgb(0 0 0 / .3)` backing for legibility over any wallpaper. Same `Squircle` primitive and same `AppMeta` tints as the desktop Dock, so the two branches look like the same operating system.

Eleven items: the nine apps plus GitHub and LinkedIn as external links. Four rows of three with the last row holding two. That is a real 11-item grid, not a 12-item grid with a hole, per the taste skill's exact-cell-count rule.

### The dock

Four pinned apps: `finder`, `terminal`, `mail`, `preview`. Chosen as the four a recruiter actually reaches for. Glass, rounded 26px, with safe-area bottom inset.

No magnification. Hover does not exist on touch, and simulating it on tap would be a lie.

---

## `AppSheet.tsx`

The container that replaces `Window` on this branch.

```
<motion.div role="dialog" aria-modal="true" aria-label={title}
            class="fixed inset-0 z-[900] bg-panel rounded-t-[--r-window]">
  <header class="h-12">
    <div class="grabber" />               <- 36x5 rounded bar, centered
    {backControl}                          <- when the app has pushed a detail view
    <h2>{title}</h2>
    <button aria-label={`Close ${title}`}><X /></button>
  </header>
  <div class="flex-1 overflow-auto overscroll-contain">
    <AppComponent />                       <- the SAME component as desktop
  </div>
</motion.div>
```

`overscroll-contain` on the scroll container is required. Without it, scrolling past the end of an app's content rubber-bands the page behind the sheet on iOS, which looks broken.

### The dismiss gesture

The interaction that makes this feel native rather than like a modal.

- Drag down anywhere in the sheet **header**, or anywhere in the body when the body is already scrolled to the top.
- The sheet follows the finger 1:1, with resistance above its resting position so it cannot be dragged upward past the top.
- Release past **120px of travel** or above **500px/s of downward velocity** dismisses. Either threshold alone, not both, so a fast flick works without a long drag.
- Below both thresholds it springs back, `{ stiffness: 400, damping: 34 }`.
- The wallpaper behind scales from `0.94` to `1` as the sheet leaves, which is the iOS depth cue.

The scroll-position condition matters. Allowing a downward drag to dismiss while the visitor is mid-scroll makes reading long content in Notes or About feel hostile.

---

## Motion spec

| Trigger | Behavior |
|---|---|
| App open | sheet springs from the tapped icon's position: `scale(0.2)` at the icon origin, to full screen. `{ stiffness: 300, damping: 30 }`. Same principle as the desktop genie, using the tapped icon rather than a Dock icon. |
| Springboard behind | scales to `0.94` and dims as the sheet rises |
| App close | reverse, landing back on the icon |
| Drag dismiss | 1:1 tracking, then spring per the thresholds above |
| Icon tap | `scale(0.92)` press feedback, released immediately |
| Grid entrance on first paint | 24ms stagger, `scale(0.86)` to 1. Once, not on every return to the springboard. |

Motivation: the open and close animations communicate **spatial relationship**, showing which icon a sheet belongs to. The dismiss gesture is direct manipulation, not animation.

Under reduced motion: sheets fade in and out over `--dur-fast` with no scale and no origin. The drag gesture is unchanged, since it is manipulation rather than motion.

---

## Per-app mobile layouts

Each app document specifies its own mobile behavior. Summarized here so the branch can be built and verified in one pass:

| App | Mobile shape |
|---|---|
| Finder | list only, no view toggle. Filter chips scroll horizontally at the top. Tapping a row pushes a detail view. |
| Terminal | fully functional. Keyboard-inset handling, no autocapitalize or autocorrect, plus a 4-command suggestion row. |
| About | single column, portrait centered, `<dl>` stacks to label-above-value. |
| Notes | navigation stack: note list, then push the body with a back control. |
| Settings | navigation stack: category list, then push the pane with a back control. |
| Activity | segmented control for tabs. Heatmap scrolls horizontally inside its own container. |
| Mail | fields stack with labels above. Textarea capped so the contact card stays reachable. |
| Preview | document card with Download and Open. No inline PDF, which does not work on iOS. |
| Orchestrator | renders with `dpr` capped at 1, auto-rotation off, one-finger orbit. |

Three apps use a push-detail pattern (Finder, Notes, Settings). Build it once as a small `useNavStack` hook rather than three times.

---

## Touch and viewport requirements

- **Minimum 44px hit target** on every interactive element. Icons are 62px, dock icons 56px, list rows 48px minimum, buttons 44px.
- **`min-h-[100dvh]`, never `h-screen`.** `100vh` on iOS Safari includes the collapsing address bar and causes the layout to jump on first scroll.
- **Safe-area insets** on the dock and sheet headers: `env(safe-area-inset-bottom)` and `env(safe-area-inset-top)`.
- **No horizontal page scroll, ever.** Wide content (the Activity heatmap, code blocks in Terminal) scrolls inside its own `overflow-x: auto` container.
- **No hover-dependent affordance anywhere.** Every tooltip, magnification, and reveal-on-hover from the desktop branch is either removed or replaced with a persistent equivalent.
- **`touch-action: none`** only on the sheet grabber, never on scrollable content.

---

## Branch selection

`DesktopShell` chooses with a `matchMedia('(min-width: 1024px)')` listener, not a CSS-only hide:

```ts
const isDesktop = useMediaQuery('(min-width: 1024px)')
if (mode === 'reader') return <ReaderToggleOnly />
return isDesktop ? <Desktop /> : <Springboard />
```

Mounting a window manager on a phone and hiding it with CSS wastes memory and keeps rAF loops alive for windows nobody can see. The branch is a real mount decision.

Return `null` until the media query has resolved on the client, to avoid rendering the desktop branch for one frame on a phone.

---

## Accessibility contract

- Icon grid is a `<main>` containing `<button>` elements with real text labels, in a `<ul>`.
- `AppSheet` is `role="dialog"` with `aria-modal="true"` and traps focus while open. Unlike desktop windows, mobile sheets **are** modal, since only one exists at a time and the springboard behind is inert.
- Focus moves into the sheet on open and returns to the originating icon on close.
- The close button has `aria-label={`Close ${title}`}`. The grabber is `aria-hidden`, since dragging is not the accessible dismiss path; the close button is.
- The back control in push-detail views has `aria-label="Back to {list name}"`.
- Every icon label is real text, never baked into an image.
- The springboard behind an open sheet is `inert` and `aria-hidden`.
- Reader view is reachable from the status bar, so the escape hatch exists on mobile too.
- Labels over the wallpaper keep their dark backing specifically so contrast holds regardless of which wallpaper is active.

---

## Done checklist

- [ ] The springboard renders below 1024px and the window manager does not mount at all
- [ ] Nothing renders for one frame in the wrong branch on first paint
- [ ] All 9 apps plus 2 external links are in the grid, arranged as a real 11-item layout with no empty cell
- [ ] Sheets open from the tapped icon's position and close back to it
- [ ] Drag-down dismisses past 120px or 500px/s, and springs back below both
- [ ] Drag-to-dismiss does not fire while the body is scrolled away from the top
- [ ] `overscroll-contain` prevents the page behind from rubber-banding
- [ ] Every app renders correctly in a sheet using the **same** component as desktop, with zero duplicated content
- [ ] The push-detail pattern is implemented once and used by Finder, Notes, and Settings
- [ ] Every hit target is at least 44px
- [ ] `min-h-[100dvh]` everywhere, no `h-screen`
- [ ] Safe-area insets applied to the dock and sheet headers
- [ ] No horizontal page scroll at 390px, 360px, or 320px
- [ ] No hover-dependent affordance survives on this branch
- [ ] Focus is trapped in the sheet and returns to the originating icon on close
- [ ] Reader view is reachable from the status bar
