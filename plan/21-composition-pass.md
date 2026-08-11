# 21 — Composition pass

Status: implemented.

Prior phases (01–20) built the machine: a window manager, a token system
derived from Apple's published system colours, three glass tiers, a
concentric radius scale, reduced-motion and reduced-transparency paths, a
Reader view for no-JS and SEO. Phase 20 refined the material.

None of that is what a visitor sees in the first second.

This phase changes no architecture. It is entirely about what is on screen
before anyone interacts, benchmarked against a peer build of the same
concept (a macOS-desktop portfolio, `jsmfolio.netlify.app`) which is behind
this one on capability — its windows do not resize, drag, stack, or
minimise — and ahead of it on first impression. Every item below is a gap
that comparison made legible.

---

## 1. The wallpaper was the largest single surface and the weakest

`Wallpaper.tsx` shipped one option, `mesh`: four CSS radial gradients in
teal, indigo and brown over `--os-void`. Two failures.

**It muddied.** The brown lobe (`rgb(150 92 58 / .34)`) and the lower teal
(`rgb(40 96 92 / .42)`) both sat over near-black and composited to a flat
dark sludge across the bottom 40% of the screen — the region with no
windows in it, so the largest uninterrupted area a visitor sees.

**It gave the glass nothing to refract.** Phase 20's note that the mesh had
been "brightened hard" so the material had something to sample was treating
the symptom. A four-lobe radial gradient has no structure at any scale
below the lobes themselves, so `backdrop-filter: blur(30px)` over it
returns approximately the same colour it started with.

**Resolution.** Three generated images in `public/wallpapers/`, with `mesh`
kept as the no-network fallback and last entry in the cycle.

Generated, not sourced. That is a licensing answer, but more importantly it
is a control answer: the tonal distribution is a chosen constraint rather
than whatever a stock photo happens to have. Each image is a domain-warped
fbm field ramped through a six-stop palette at 2880×1800, and each holds:

| | mean L | brightest 5% | white text on that |
|---|---|---|---|
| abyss | 12.3% | 31% | 8.3:1 |
| aurora | 13.9% | 29% | 9.1:1 |
| ember | 11.8% | 29% | 9.1:1 |

Dark enough that white chrome text clears AA anywhere on the image with
margin, bright enough and — critically — *structured* enough at the 20–200px
scale that the blur has real variation to work with.

Two tuning notes worth keeping, since both were arrived at by being wrong
first. Five octaves of fbm reads as marble or camouflage, not cloth: a
wallpaper wants a handful of large calm features, so the generator runs
three octaves at gain 0.5 with roughly one noise period across the frame.
And the ramp needs `gamma > 1` (1.45 here) to keep most of the canvas in
the dark end and reserve the bright stops for the few crests near the light
— without it the image lifts to a uniform mid-tone haze, which is the same
failure as the mesh it replaced.

Baked grain is deliberately zero. `Wallpaper.tsx` already composites SVG
noise at 0.035 over whatever is behind it, which is what defeats 8-bit
banding, and grain in the source file is what makes a smooth dark gradient
expensive to JPEG. At quality 88 each image is ~260KB.

## 2. Nobody's name was on the screen

The single largest gap, and not a visual one.

Boot ended with `open("finder")`. The landing view was therefore a file
browser belonging to nobody: no name, no role, no context. A visitor who
did not already know whose site this was had to go looking.

**Resolution.** Two changes.

`BootSequence` now opens nothing. The landing view is the desktop itself.

`DesktopHero` puts the name on the wallpaper, in the wallpaper layer,
beneath windows. It recedes rather than vanishing when anything is open
(opacity 0.16 plus a 3px blur — dropping opacity alone leaves crisp
letterforms reading through a translucent window, which looks like a
rendering bug where defocusing them reads as depth), and it is
`pointer-events-none` throughout so it never intercepts a desktop
right-click or an icon drag. It is scenery, not chrome.

It carries no `<h1>`. ReaderView owns the document heading and is always in
the DOM as a sibling; a second one in the shell would compete with it.

The trade is real and worth stating: the work is now one interaction away
instead of zero. The desktop icons and Dock are the affordance, and the
hero closes with an explicit hint because a desktop metaphor is only
self-evident to people who already hold it.

## 3. Icons read as a generic icon set, not as a desktop

`AppGlyph.tsx` already documents this failure mode for the Dock — "one thin
outline glyph, `weight="light"`, white, centred… nine of those in a row is
why the Dock read as a generic flat icon set" — and fixed it there. Three
places had not been brought along.

**The Dock's external links.** GitHub and LinkedIn shared one grey tint
(`#3a3a3e → #232326`) and drew `weight="light"` outlines, so they read as
two blank chips at the end of the row. They now use the brands' own tile
colours and solid marks, via a shared `LinkGlyph`. LinkedIn is set as the
"in" wordmark rather than Phosphor's `LinkedinLogo`, which is the full
rounded-square badge and would nest one tile inside another.

Also fixed while there: the rail is `items-end` and every `DockIcon` ends
in a running-state dot, so without a matching spacer these two tiles
baselined 7px below the app row. And the glass sheet was painted *under*
the mark here and *over* it everywhere else.

**The Springboard grid.** Same two icons, same construction, duplicated.
Both now render `LinkGlyph`, so they cannot drift again.

**Desktop file icons.** 32px `weight="light"` white outlines. Now 44px and
filled, with the folder as the one saturated blue object on the desktop —
which is what it is on macOS.

Label pills went too, in both places. macOS and iOS show a solid label
background only while an icon is *selected*; the resting state is text with
a shadow. Three (desktop) and eleven (springboard) dark chips read as UI
chrome where they should read as filenames.

## 4. Menu bar detail

- `dj` was plain semibold text, which put it in the same visual class as the
  app name beside it and made it read as a stray label rather than the menu
  everything hangs off. It is now a mark — the Apple menu is the one item
  in the bar you identify by shape.
- The clock read `Tue 16:18`. macOS shows the date. Now
  `Tue 11 Aug, 16:38`, and set in the UI sans rather than mono, which is
  what the system uses; `tabular-nums` is the part that actually mattered.
- The GitHub and LinkedIn marks were `weight="light"` at 14px — legible as
  "an icon" but not as *which* icon. Filled, 15px.

## 5. Window elevation

`--shadow-rest` and `--shadow-focused` were each a single large soft
shadow. That is the standard web approximation and it is wrong in a
specific way: a uniform grey halo with no contact point, so the window
looks pasted onto the wallpaper rather than lifted off it. Against a dark
wallpaper the bottom edge of a dark window dissolved entirely.

Both tokens are now three layers, matching what macOS actually stacks:

1. **hairline** — a near-opaque half-pixel ring that defines the silhouette
   even where the wallpaper behind it is dark
2. **contact** — tight and dark, directly under the frame; this is the layer
   that reads as "off the surface"
3. **ambient** — wide, soft, offset downward; the light-source cue

## 6. Mobile

The Springboard grid ended a third of the way down the screen, leaving the
rest empty — the same dead-space problem as the desktop, and the same
missing identity.

Both are solved by one element: a home screen *widget* carrying name, role
and tagline. Authentic to iOS, and it fills the space by belonging there
rather than by padding.

---

## Not changed, deliberately

- **The token system.** `globals.css` derives everything from Apple's
  published dark-appearance colours with the reasoning written down. It is
  more rigorous than the build this pass was measured against. Only the two
  shadow tokens changed, and only their layer count.
- **Dark-locked.** The reference is light-mode Sequoia. Matching it would
  mean unwinding every surface, text and glass value to chase a look that
  is more common, not better. A light mode remains a real option (plan/19
  phase D anticipates the plumbing); it is not a prerequisite for polish.
- **Every app, and the window manager.** Untouched. They were never the gap.
