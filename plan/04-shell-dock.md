# 04 - Shell: Dock

`src/components/shell/Dock.tsx` and `src/components/shell/DockIcon.tsx`

---

## Purpose

The primary navigation. Launch apps, show which are running, restore minimized windows. The magnification arc is the single most recognizable macOS interaction, so getting its math right matters more than any other polish item in the shell.

---

## Data contract

| Source | Used for |
|---|---|
| `data/apps.ts` | the 9 `AppMeta` entries, sorted by `dockOrder`, giving title, icon, tint |
| `data/socials.ts` | the two `DockLink` entries, GitHub and LinkedIn |
| `os/store` `windows` | which apps show a running indicator |
| `os/store` `stack` | which app is focused |

The Dock also **writes**: each icon reports its center coordinates into a ref map keyed by `AppId`, which `Window.tsx` reads to compute the genie `transformOrigin` (`02-window-manager.md` section 6).

---

## DOM structure

```
<nav aria-label="Dock" class="fixed bottom-2 left-1/2 -translate-x-1/2 z-[900]">
  <ul class="os-glass flex items-end gap-1 px-2 pb-1 pt-2 rounded-[--r-chip]">
    <li> <DockIcon id="finder" /> </li>
    ... 9 apps ...
    <li role="separator" />              <- 1px vertical hairline, 40% height
    <li> <DockLink href={socials.github}   /> </li>
    <li> <DockLink href={socials.linkedin} /> </li>
  </ul>
</nav>
```

Order: `finder` · `about` · `notes` · `settings` · `activity` · `mail` · `preview` · `terminal` · `orchestrator` ‖ GitHub · LinkedIn

Icons rest at 52px. `align-items: end` so magnification grows upward from a fixed baseline, which is what produces the arc rather than a bulge.

### The icon tile

`primitives/Squircle.tsx`. Apple's superellipse approximated as `border-radius: 22.5%`, a **percentage** so it scales correctly with the icon rather than breaking at 52px versus 76px. Each carries a two-stop gradient from `AppMeta.tint` and a centered Phosphor glyph at 55% of tile width, plus `inset 0 1px 0 rgb(255 255 255 / .22)` for the top-edge highlight that stops it reading as a flat square.

Tints are muted and differentiated by hue only, all at similar lightness, so the Dock reads as one family rather than a bag of skittles. No tint uses the accent blue, which stays reserved for state.

### Running indicator

A 3.5px dot in `--os-accent`, 4px below the tile, rendered only for apps present in `windows`. This is the **only** status dot on the entire site. The taste skill bans decorative status dots; this one conveys real state and is documented as the single permitted instance.

---

## Motion spec

### Magnification (the important one)

Driven entirely by Motion values off a single `mouseX` on the `<ul>`. Zero React state, so a nine-icon Dock costs nothing on pointer move.

```ts
// in Dock.tsx
const mouseX = useMotionValue(Infinity)
// onPointerMove:  mouseX.set(e.clientX)
// onPointerLeave: mouseX.set(Infinity)

// in DockIcon.tsx
const distance = useTransform(mouseX, (v) => {
  const bounds = ref.current?.getBoundingClientRect()
  if (!bounds) return Infinity
  return v - (bounds.x + bounds.width / 2)
})

const REST = 52, MAX = 76, RANGE = 130

const sizeRaw = useTransform(distance, [-RANGE, 0, RANGE], [REST, MAX, REST], { clamp: true })
const size    = useSpring(sizeRaw, { stiffness: 380, damping: 30, mass: 0.35 })

const liftRaw = useTransform(distance, [-RANGE, 0, RANGE], [0, -12, 0], { clamp: true })
const lift    = useSpring(liftRaw, { stiffness: 380, damping: 30, mass: 0.35 })

const depthRaw = useTransform(distance, [-RANGE, 0, RANGE], [0, 24, 0], { clamp: true })
const depth    = useSpring(depthRaw, { stiffness: 380, damping: 30, mass: 0.35 })
```

Applied as `width`/`height` on the motion element plus `translateY(lift) translateZ(depth)`.

Three notes that decide whether this feels right:

1. `RANGE: 130` covers roughly 2.5 icons on each side. A shorter range makes icons pop discretely instead of forming a smooth arc.
2. The linear-interpolation-then-spring order matters. Interpolating the raw distance gives the shape; the spring gives it weight and prevents jitter on fast pointer movement.
3. `width`/`height` are animated here rather than `transform: scale`, which contradicts the usual rule. It is correct in this one place because the Dock must **reflow**, pushing neighbors aside. Scaling would overlap them. The cost is bounded: eleven small elements in a single flex row, no text reflow, no effect on the rest of the page. It is the one justified exception and it is documented so nobody "fixes" it into scale.

### Other motion

| Trigger | Behavior |
|---|---|
| Launch | icon bounces up 14px and back, spring `{ stiffness: 400, damping: 14 }`, once. Not a loop. |
| Click on a running app | if focused, minimize. If not focused, focus. If minimized, restore. Same as macOS. |
| Tooltip | app title appears 8px above the tile, `os-glass`, `--r-control`, after 320ms hover, no delay when moving between icons while one is already shown |
| Dock entrance on boot | icons stagger in at 40ms intervals, each scaling from `0.4` with a spring, after the wallpaper resolves (`05-shell-desktop.md`) |

Under reduced motion: no magnification (icons stay at 52px, tooltip still appears), no bounce, no stagger.

---

## Mobile behavior

The desktop Dock does not render below 1024px. `Springboard` has its own bottom dock with 4 pinned apps (`finder`, `terminal`, `mail`, `preview`), specified in `16-mobile-springboard.md`. It uses the same `Squircle` primitive and the same `AppMeta` tints, with no magnification, since hover does not exist on touch.

---

## Accessibility contract

- `<nav aria-label="Dock">` containing a `<ul>`. Each icon is a real `<button>`; each link is a real `<a>`.
- `aria-label` states the action and the state: `Open Projects`, or `Projects, running` when a window exists.
- External links carry `target="_blank" rel="noopener noreferrer"` and an `aria-label` ending in `opens in a new tab`.
- Tab reaches every icon in visual order. Focus ring is the global `:focus-visible` rule, which needs `outline-offset: 4px` here so it clears the squircle's curve.
- The tooltip is `aria-hidden` because the accessible name already carries the title. It is purely a visual aid.
- Magnification is a pointer effect only. Keyboard focus does not magnify, since a focus ring already indicates position and a jumping layout under keyboard navigation is disorienting.
- Minimum hit target is the 52px tile, comfortably above the 44px floor.

---

## Done checklist

- [ ] The magnification arc is smooth across the whole Dock, with no discrete popping at the edges of the range
- [ ] React DevTools Profiler records zero renders while sweeping the pointer across the Dock
- [ ] Neighbors are pushed aside by magnification rather than overlapped
- [ ] The running dot appears only for apps with an open or minimized window
- [ ] Clicking a focused app minimizes it; clicking a minimized app restores it to its previous depth
- [ ] Launch bounce fires once and does not loop
- [ ] The icon-center ref map is populated before any window opens, so the first genie animation has a correct origin
- [ ] Tooltips do not re-delay when moving between adjacent icons
- [ ] Every icon is tab-reachable with a visible focus ring that clears the squircle curve
- [ ] Under reduced motion there is no magnification and no bounce, and every icon still works
- [ ] Exactly one status dot type exists on the site, and it is this one
