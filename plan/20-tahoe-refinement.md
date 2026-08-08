# 20. Tahoe refinement: concentric glass, floating chrome, Control Center

Follows plan/19-liquid-glass-modernization.md. Phase 19 got the *material*
right. This phase fixes the *structure*, which was still pre-Tahoe.

## Why a second pass

After 19, every window was an opaque `#1c1c1f` box with flush wall-to-wall
sidebars separated by 1px dividers, 6px rectangular buttons, and content that
hard-clipped at the title bar. That layout language is Big Sur through Sonoma.
The glass was new; the shapes underneath it were not.

## What the research actually said

Sourced from Apple's Human Interface Guidelines material documentation, the
Six Colors and Macworld macOS 26 reviews, and lapcatsoftware's window-corner
teardown. Every row is a trait the build did not have.

| Tahoe trait | Source | State before this phase |
|---|---|---|
| Windows are glass | Windows "shimmer with frosted edges"; sidebars and toolbars translucent | Only the 38px title bar was glass |
| Concentricity | "each element designed with a curvature that sits neatly within the corner radius of its container"; window radius scales with toolbar height so controls stay concentric | One flat radius list, no relationship between nested elements |
| Floating sidebars | Sidebars detach from the window wall and float inset with their own radius | `border-r border-divider` flush panes |
| Scroll edge effect | Content underlaps translucent chrome and softens beneath it | Content hard-clipped at the header |
| Capsule buttons | `.buttonBorderShape(.capsule)` is the default button shape | 6px rounded rects |
| Layered icons | Icons are "multiple layers of glass" with real depth | One tint gradient plus one sheen |
| Control Center | Rebuilt as the menu bar's headline feature | A loose row of link glyphs |
| Glass never samples glass | `GlassEffectContainer` exists so nested glass shares one sampling region | Glass title bar inside a window, glass tooltip over the glass Dock |

## Decisions

**Layered windows, not fully transparent ones.** The frame is glass, sidebars
float on it as clearer glass, and the app's content sits on a near-opaque
plate inset inside. This is what Tahoe's real Finder does, and it is what
keeps Terminal and Activity Monitor readable. Full transparency through the
content area looks more dramatic in a screenshot and fails 4.5:1 in practice.

**CSS-only refraction.** Apple's glass bends the background at the rim. On the
web that needs an SVG `feDisplacementMap` feeding `backdrop-filter`, which
ships only in Chromium, pixelates because SVG displacement has no
super-sampling, and cannot resize with an element - meaning every draggable,
resizable window would need its filter regenerated on every frame of a drag.
Rejected. Rim light, cursor-tracked specular, layered sheen and progressive
edge blur get most of the impression and behave identically in Chrome, Safari
and Firefox.

**Two control radii, not one.** Tahoe's default *button* shape is a capsule,
but its list rows, menu items and text fields stay rounded rectangles. The
audit of all 27 `--r-control` usages changed the plan rather than confirming
it: a blanket capsule would have put a 28px radius on Notes' 56px-tall sidebar
rows. `--r-pill` for buttons, `--r-control` for rows and inputs.

**Still dark-locked.** No light mode, no `dark:` variant, per plan/00.

## The concentric rule

One equation, applied everywhere:

```
inner radius = outer radius - padding
```

Encoded in `globals.css` as `calc()` rather than hand-tuned numbers, so
changing `--r-window` or `--r-inset` keeps the whole nest concentric:

```
--r-window  20px                              the frame
--r-inset   8px                               how far floating chrome sits inside
--r-float   calc(--r-window - --r-inset)      sidebars, content plate
--r-card    calc(--r-float - 4px)             cards inside a floating pane
```

## Glass tiers

| Tier | Where | Why |
|---|---|---|
| `.os-glass` | window frames, Dock, menus, Control Center | regular: moderate blur, lit rim |
| `.os-glass-clear` | floating sidebars | sits on the window's own glass, so lower blur |
| `.os-glass-none` | menu bar default | genuinely nothing; text on wallpaper with a drop shadow |
| `.os-plate` | app content areas | near-opaque; carries the contrast guarantee |

The rim is painted `border-box` from a conic gradient while every other layer
is `padding-box`, so one element gets a lit edge with no pseudo-element and no
z-index bookkeeping. `--gx`/`--gy` are written by `src/os/useGlassPointer.ts`
straight to `element.style`, never through React state.

## Two bugs found while verifying

**Every radius token was a no-op.** Tailwind v4 dropped v3's
`rounded-[--token]` shorthand for `var()`. All 59 CSS-variable utilities
across 22 files compiled to `border-radius: --r-window`, which is invalid and
computes to 0px. Windows, menus, cards and chips had been square since the
rewrite. Fixed by converting every one to v4's `rounded-(--token)` parenthesis
form. **Check the compiled chunk, not the source, when a token appears to have
no effect.**

**The wallpaper was too dark for glass to exist.** The mesh sat at .25-.35
alpha over a near-black void, so every blur, sheen and rim was sampling
nothing. A glass material is defined entirely by what is behind it. Same three
hues, raised to a luminance the glass can actually refract.

## Traps carried forward from phase 19

- **Never hand-write `-webkit-backdrop-filter`.** Lightning CSS silently drops
  the unprefixed property when both are present with identical values. Let the
  build's autoprefixer do it, and verify against the compiled chunk.
- **`rm -rf .next` before restarting the dev server** when CSS changes seem not
  to apply. Turbopack's persistent cache can serve a stale chunk under an
  unchanged content hash.
- `resize_window` does not control real `innerWidth` in the automation
  environment. Verify mobile with a temporary `page.tsx` harness, then revert
  it and confirm `git diff src/app/page.tsx` is empty before committing.

## Phases as shipped

| Phase | Commit | Scope |
|---|---|---|
| A + B | `18d98f9` | glass foundation, `useGlassPointer`, layered window shell, glass traffic lights, Tailwind v4 radius fix, wallpaper |
| C | `031962f` | `Sidebar` primitive; Finder, Notes, System Settings |
| D | `2f7df4b` | capsule buttons, segmented tabs, concentric menu highlights, `.os-press` |
| E | `afc1f71` | `ControlCenter`, menu bar right cluster |
| F | `1200f5d` | layered glass icon recipe; Dock, desktop icons, Springboard |
| G | this commit | mobile sheet, reader bar, this document, final pre-flight |

## Accessibility

- `prefers-reduced-transparency` frosts harder rather than flattening to an
  opaque panel, which is what macOS actually does. It overrides the Clear
  variants too, not just the base tiers.
- `prefers-reduced-motion` gets an explicit `transform: none` on `.os-press`.
  Zeroing the transition duration alone would snap the control to 96% and hold
  it there for the whole press, which is worse than not moving.
- The scroll edge is hidden entirely under reduced transparency; a blur
  gradient over opaque content is noise.
- Landmarks keep their names. `Sidebar` renders a plain `div` where the
  content inside already carries the semantics, so a screen reader does not
  announce "Roles" twice.
