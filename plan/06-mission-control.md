# 06 - Mission Control

`src/components/shell/MissionControl.tsx`

---

## Purpose

Show every open window at once and let the visitor jump to any of them. It is also the payoff moment for the 3D layer: the one interaction where the shared `perspective` becomes obvious, because a dozen windows fan into depth simultaneously.

Motivation, in one sentence per the taste skill's motion rule: it communicates **hierarchy**, by making the full set of open windows and their stacking order visible in a single glance.

---

## Data contract

| Source | Used for |
|---|---|
| `os/store` `stack` | which windows exist, and in what depth order |
| `os/store` `windows` | each window's live rect, used to compute its aspect ratio in the grid |
| `data/apps.ts` | title and icon for each card's label |

No content of its own. Cards render a **live** window, not a screenshot.

---

## DOM structure

```
<div role="dialog" aria-modal="true" aria-label="Mission Control"
     class="fixed inset-0 z-[1200]">
  <div class="backdrop" />                    <- wallpaper, blurred and darkened
  <ul class="grid" style="perspective: 1600px">
    <li>                                       <- one per open window
      <button aria-label={`Show ${title}`}>
        <div class="card">  {live window content, scaled}  </div>
        <span class="label">  {icon} {title}  </span>
      </button>
    </li>
  </ul>
</div>
```

### Grid

Columns by window count, so cards stay large with few windows and do not become postage stamps with many:

| Open windows | Columns |
|---|---|
| 1 to 2 | 2 |
| 3 to 4 | 2 |
| 5 to 6 | 3 |
| 7 to 9 | 3 |

Each card keeps its window's real aspect ratio, so a tall Preview and a wide Finder stay visually distinguishable. Cards are capped at 460px wide.

### Live content, not screenshots

Cards render the actual `Window` subtree inside a `transform: scale(k)` wrapper with `pointer-events: none`, where `k` is the card width divided by the window width. A Terminal in Mission Control shows its real scrollback; Activity Monitor shows its real numbers.

This is cheap because nothing re-renders, it is the same React tree with a CSS transform applied. It also sidesteps the alternative entirely: rasterizing DOM to canvas, which needs a heavy library, breaks on cross-origin images, and produces a worse result.

`pointer-events: none` on the inner content is required, otherwise links inside a card become clickable at a wrong scale.

---

## Motion spec

### Enter

Each card animates from its window's **actual on-screen position** to its grid slot. Motion's `layout` prop handles this: the same component identity, two positions, one FLIP transition.

```
from:  the window's live rect
to:    its grid slot
plus:  rotateX(-14deg) translateZ(-120px)
spring { stiffness: 260, damping: 30 }
stagger 40ms, ordered from the top of the stack downward
```

The `rotateX(-14deg)` tilts the whole field away from the viewer, and `translateZ(-120px)` pushes it back. Combined with `perspective: 1600px` on the grid, cards toward the top of the screen recede more than those at the bottom, which is exactly the effect that makes it read as a physical fan rather than a scaled-down grid.

Stagger order matters: the focused window (top of stack) moves first, so the eye follows the thing it was already looking at.

### Hover

The hovered card lifts forward, `translateZ(40px)` with `rotateX` easing to `-4deg`, over `--dur-fast`. Its label brightens from `--os-text-2` to `--os-text`. Neighbors are untouched. Do not dim the others, which produces a spotlight effect that reads as a modal rather than as a workspace.

### Exit

Reverse of enter. Clicking a card focuses that window and exits, so the selected card animates back into its window position while every other card animates back to its own. Because Motion drives this from real geometry, the selected window lands exactly where it will live, with no snap at the end.

### Backdrop

Wallpaper `blur(20px) brightness(0.55)` fading in over `--dur-base`. The blur is on a **fixed** element, per the performance rule in `18-preflight.md`.

### Reduced motion

Grid appears instantly at final positions. No fan, no tilt, no stagger, no `translateZ`. Backdrop dims without blurring. Everything remains fully operable.

---

## Triggers and exit

| Action | Result |
|---|---|
| `F3` | toggle |
| `View > Mission Control` menu item | enter |
| Desktop right-click, `Mission Control` | enter |
| Click a card | focus that window, exit |
| Click the backdrop | exit, focus unchanged |
| `Esc` | exit, focus unchanged |
| Arrow keys | move selection between cards |
| `Enter` | focus the selected card's window, exit |

Disabled with fewer than 2 open windows. The trigger renders disabled rather than hidden, so the menu does not reflow. Fanning out a single window communicates nothing.

Minimized windows are **excluded**. They are already represented in the Dock and including them would misrepresent what is on screen.

---

## Mobile behavior

Does not render below 1024px. The equivalent affordance on the springboard is simply the home screen, since only one sheet is open at a time there and the app grid already shows everything. No app-switcher is built. This is a deliberate scope cut, not an omission.

---

## Accessibility contract

- `role="dialog"` with `aria-modal="true"` and `aria-label="Mission Control"`. Unlike windows, this **is** modal, so it traps focus.
- Focus moves to the first card on enter and returns to the previously focused element on exit.
- Each card is a `<button>` with `aria-label={`Show ${title}`}`, in a `<ul>`.
- Card inner content is `aria-hidden`, because it duplicates content already exposed by the live window underneath. Screen readers get the card's label, not two copies of the Terminal buffer.
- Arrow key navigation follows the visual grid, not DOM order, when they differ.
- `Esc` always exits. There is no state in which the visitor can become trapped.
- The backdrop is `aria-hidden` and `pointer-events` are handled by an explicit click target rather than by relying on bubbling.

---

## Done checklist

- [ ] Cards animate from their real window positions, not from a generic center point
- [ ] Cards show live content, and a Terminal card displays its actual scrollback
- [ ] Card inner content has `pointer-events: none`
- [ ] Cards preserve each window's aspect ratio
- [ ] The fan reads as depth: cards higher on screen visibly recede more than lower ones
- [ ] Stagger begins with the focused window
- [ ] Clicking a card lands its window exactly in place, with no snap at the end of the transition
- [ ] `Esc`, backdrop click, and `F3` all exit; none of them changes focus except a card click
- [ ] Disabled with fewer than 2 open windows, rendered disabled rather than hidden
- [ ] Minimized windows are excluded
- [ ] Focus is trapped while open and restored on exit
- [ ] Under reduced motion, the grid appears instantly and stays fully operable
- [ ] The backdrop blur is on a fixed element
