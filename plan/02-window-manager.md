# 02 - Window manager

The core. Every app document references the `Window` contract defined here. Build this before any app.

---

## Purpose

Own window geometry, stacking, focus, and mode. Provide the drag, resize, and 3D transform behavior that makes a `<div>` feel like a native window. Hold no content.

---

## 1. The one performance rule

**During a drag or a resize, React state is never touched.**

Position and size are driven by Motion `useMotionValue` bound directly to the element. The store is written exactly once, on pointer-up, through `commitRect`.

Consequences, which are the reason this rule is stated before anything else:

- The store mutates only on discrete user events (open, close, focus, minimize, drag-end). Nine windows means at most nine store writes per interaction, not sixty per second per window.
- No `React.memo`, no `useCallback` dependency puzzles, no selector-granularity tuning anywhere in the tree. The naive implementation is already fast.
- A window being dragged does not re-render its own content, so a Terminal with 200 lines of scrollback drags exactly as smoothly as an empty window.

The failure mode this avoids: `onDrag` calling `setPosition`, which re-renders the window, which re-renders its app, sixty times a second. That is the default way to write this and it is why most browser-OS demos stutter. If a future change makes drag update state, the whole design degrades and no amount of memoization fully recovers it.

---

## 2. `src/os/types.ts`

```ts
import type { AppId } from '@/data/apps'

export type Rect = { x: number; y: number; w: number; h: number }

export type WindowStatus = 'open' | 'minimized' | 'maximized'

export type WindowState = {
  id: AppId
  rect: Rect
  status: WindowStatus
  prevRect?: Rect        // restore target when un-maximizing
  openedAt: number       // for cascade offset and mission control ordering
}

export type OSMode = 'desktop' | 'missionControl' | 'reader'
```

---

## 3. `src/os/store.ts`

```ts
type OSStore = {
  windows: Partial<Record<AppId, WindowState>>   // only open apps are present
  stack: AppId[]                                 // index === depth, last === focused
  mode: OSMode
  booted: boolean
  wallpaper: string

  open(id: AppId): void
  close(id: AppId): void
  focus(id: AppId): void
  minimize(id: AppId): void
  restore(id: AppId): void
  toggleMaximize(id: AppId): void
  commitRect(id: AppId, rect: Rect): void
  closeAll(): void
  minimizeAll(): void
  setMode(mode: OSMode): void
  setWallpaper(src: string): void
  cycleFocus(dir: 1 | -1): void
}
```

### Behavior notes

**`open`** If the window exists and is minimized, `restore` instead. If it exists and is open, `focus` instead. Otherwise create it from `AppMeta.defaultRect` with a cascade offset, push onto `stack`.

**Cascade offset.** Two windows opened in sequence must not stack exactly. Offset each new window by `(n % 6) * 28` px on both axes, where `n` is the count of currently open windows. Clamp so the result stays inside the viewport minus the menu bar and Dock.

**`focus`** Move `id` to the end of `stack`. That is the entire implementation. `z-index` is derived from stack position, never stored.

**`close`** Delete from `windows`, splice from `stack`. If it was focused, the new last entry in `stack` becomes focused automatically since focus is positional.

**`minimize`** Set status, but **leave it in `stack`**. Minimized windows keep their depth so restoring returns them to the same layer rather than jumping to the front. `Window` renders `null` visually but keeps its Dock indicator.

**`toggleMaximize`** Store the current rect in `prevRect`, then set rect to the full available area: `{ x: 0, y: MENUBAR_H, w: vw, h: vh - MENUBAR_H - DOCK_H }`. Toggling back restores `prevRect`. macOS never truly fullscreens a window over the menu bar in this mode, and neither does this.

**`cycleFocus`** Rotates `stack` by one, skipping minimized windows. Backs `Cmd+~`.

**No persistence.** Window positions are not written to `localStorage`. A returning visitor gets the clean default layout, which is the right first impression. This is a deliberate simplification, not an omission.

### Viewport constants

```ts
export const MENUBAR_H = 28
export const DOCK_H = 78          // dock at REST (52px icon + padding + margin)
export const TITLEBAR_H = 38
```

`DOCK_H` is the **resting** height. Magnification grows icons to 76px, but it grows upward from a fixed baseline and only while the pointer is over the Dock, so windows are still clamped against the resting height. Clamping against the magnified height would leave a visible dead strip above the Dock at all times.

---

## 4. `src/os/useWindowDrag.ts`

```ts
function useWindowDrag(id: AppId, rect: Rect): {
  x: MotionValue<number>
  y: MotionValue<number>
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  onPointerDown: (e: React.PointerEvent) => void
}
```

### Mechanics

- Attaches to the **titlebar only**. Dragging from the window body does nothing, matching macOS.
- `setPointerCapture` on the titlebar so a fast drag that outruns the cursor does not drop.
- `x` and `y` are `useMotionValue`, seeded from `rect`, updated in `pointermove` with `x.set(...)`. No state.
- On `pointerup`: release capture, call `commitRect(id, { ...rect, x: x.get(), y: y.get() })`, spring the tilt back to zero.
- `focus(id)` fires on `pointerdown`, before any movement, so a click without a drag still raises the window.

### Clamping

A window can be dragged partly offscreen (macOS allows this) but the **titlebar must always stay reachable**:

```
x  clamped to  [ -(rect.w - 120),  vw - 120 ]
y  clamped to  [ MENUBAR_H,        vh - DOCK_H - TITLEBAR_H ]
```

Left and right allow the window to hang off, keeping 120px of titlebar grabbable. Top is hard-stopped at the menu bar. Bottom stops before the Dock so a window can never be lost behind it.

### The tilt (the effect that carries the feel)

```ts
const vx = useVelocity(x)
const vy = useVelocity(y)

// velocity in px/s -> degrees, clamped, then spring-damped
const rotateY = useSpring(useTransform(vx, [-1400, 1400], [-5, 5],  { clamp: true }),
                          { stiffness: 260, damping: 26, mass: 0.6 })
const rotateX = useSpring(useTransform(vy, [-1400, 1400], [ 5, -5], { clamp: true }),
                          { stiffness: 260, damping: 26, mass: 0.6 })
```

Sign note: dragging **down** should tip the top of the window **away**, so `rotateX` inverts relative to `vy`.

Velocity naturally decays to zero when the pointer stops, so the spring settles the window flat without any explicit reset. That is the whole trick, and it is why this reads as mass rather than as an animation.

Clamp at ±5deg. Past roughly 7deg the text inside starts to visibly shear and it stops looking like a window and starts looking like a card trick.

---

## 5. `src/os/useWindowResize.ts`

```ts
function useWindowResize(id: AppId, rect: Rect, minSize: { w: number; h: number }): {
  w: MotionValue<number>
  h: MotionValue<number>
  startResize: (edge: Edge, e: React.PointerEvent) => void
}

type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
```

Eight handles. Corners are 14x14 and sit above the edges in z-order. Edges are 6px strips. All are `position: absolute` on the window shell, outside the content flow, with `touch-action: none`.

### Native cursors (do not skip this)

| Edge | `cursor` |
|---|---|
| `n`, `s` | `ns-resize` |
| `e`, `w` | `ew-resize` |
| `nw`, `se` | `nwse-resize` |
| `ne`, `sw` | `nesw-resize` |

These are why `CustomCursor` is deleted in `01-foundation.md`. A page-wide `cursor: none` erases every one of them and the desktop instantly stops feeling real.

### Mechanics

- Resizing from `n`, `w`, `nw`, `ne`, `sw` changes **both** position and size. Getting this wrong is the classic bug where dragging the top edge moves the window instead of resizing it. Anchor the opposite edge: when dragging `n`, the bottom edge y stays constant.
- Clamp to `minSize` from `AppMeta`. Per-app minimums exist because Terminal at 300px tall is fine while Finder at 300px tall is broken.
- Motion values only, `commitRect` on pointer-up. Same rule as drag.
- No tilt during resize. Tilt is a drag affordance and applying it here reads as a glitch.

---

## 6. The 3D layer

Desktop root:

```css
perspective: 1400px;
transform-style: preserve-3d;
```

Every transform below is `transform` or `opacity` exclusively. No `top`, `left`, `width`, or `height` is ever animated.

| Interaction | Transform | What it communicates |
|---|---|---|
| **Stack depth** | `translateZ(stackIndex * 3px)` plus shadow interpolating `--shadow-rest` to `--shadow-focused` | Focused windows are genuinely nearer the viewer, not merely higher in paint order. With `perspective: 1400px` this produces real parallax when Mission Control tilts the whole field. |
| **Drag tilt** | `rotateY` and `rotateX` from drag velocity, ±5deg, spring `{ stiffness: 260, damping: 26, mass: 0.6 }` | The window has mass. Section 4. |
| **Focus lift** | `translateZ` transitions over `--dur-fast`, shadow deepens | Focus is felt spatially, not only through chrome color change. |
| **Genie open** | `transformOrigin` set to the live screen position of the app's Dock icon, animating `scale(0.06) rotateX(28deg) opacity(0)` to identity, spring `{ stiffness: 200, damping: 24 }` | The window visibly flies out of its Dock icon. |
| **Genie close / minimize** | the same, reversed, `--dur-base` | It flies back into the icon it came from. |
| **Dock magnification** | per-icon `scale` + `translateY` + `translateZ` from a cosine falloff on pointer distance | Specified in `04-shell-dock.md`. |
| **Mission Control** | `rotateX(-14deg) translateZ(-120px)`, 40ms stagger, hover lifts one card forward in Z | Specified in `06-mission-control.md`. |

### Getting the genie origin right

The Dock icon's position is only known at runtime. `Dock.tsx` writes each icon's center into a ref map keyed by `AppId`; `Window.tsx` reads it at mount to compute `transformOrigin` in percentages relative to its own box. If the icon is not found (mobile, or Dock not yet mounted), fall back to `50% 100%`, which still reads as rising from the bottom.

### `will-change`

Set `will-change: transform` on a window **only while it is being dragged or resized**, toggled in the pointer handlers. Leaving it on permanently for nine windows forces nine composited layers to persist and costs more memory than it saves.

---

## 7. `Window.tsx`

```tsx
type WindowProps = { id: AppId }   // that is the entire prop surface
```

Everything else is read from the store and `AppMeta`. Content comes from `registry.tsx`, lazily.

### Structure

```
<section role="region" aria-label={title} data-focused={isFocused}>
  <header  onPointerDown={drag}>          <- TITLEBAR_H, cursor: grab / grabbing
    <TrafficLights />                     <- left, macOS convention
    <h2>{title}</h2>                      <- centered, truncates
    {toolbar}                             <- optional slot, right side
  </header>
  <div class="overflow-auto">             <- the ONLY scroll container
    <AppComponent />
  </div>
  <ResizeHandles />
</section>
```

### Rules

- The window shell has `overflow: hidden` and `border-radius: var(--r-window)` so app content cannot bleed past the rounded corners.
- The body is the only scroll container. `backdrop-filter` is on the **titlebar only**, never the body, because blurring a scrolling container forces continuous GPU repaints.
- Unfocused windows get `filter: saturate(0.85)` and their titlebar text drops to `--os-text-2`. This is exactly what macOS does and it is a large part of why focus reads clearly.
- Minimized windows render `null`. They stay in `stack` and keep their Dock indicator.

### `TrafficLights.tsx`

Three 12px circles, 8px apart, left-aligned in the titlebar. Glyphs (`x`, `-`, `+`) are hidden at rest and fade in on hover of the **group**, matching macOS. When the window is unfocused all three render as `rgb(255 255 255 / .18)` gray.

Each is a real `<button>` with `aria-label` (`Close Projects`, `Minimize Projects`, `Maximize Projects`), tab-reachable, with the standard focus ring. This is not optional. It is the difference between a window that keyboard users can operate and a decorative div.

---

## 8. `src/os/useKeyboardShortcuts.ts`

Registered once by `DesktopShell`, not per window. Uses `metaKey || ctrlKey` so it works on both platforms.

| Keys | Action |
|---|---|
| `Cmd/Ctrl + W` | close focused window |
| `Cmd/Ctrl + M` | minimize focused window |
| `Ctrl + Cmd + F` | toggle maximize |
| `Cmd/Ctrl + ~` | cycle focus forward. add `Shift` for backward. |
| `F3` | toggle Mission Control |
| `Esc` | exit Mission Control, or close an open menu |
| `Arrow keys` | nudge focused window 12px, when the titlebar has focus. add `Shift` for 1px. |

Guard every handler with a check that the event target is not an `<input>`, `<textarea>`, or `contenteditable`, so `Cmd+W` inside Terminal or the Mail compose field does not close the window mid-typing.

Browser conflict note: `Cmd+W` closes the tab in most browsers and cannot be reliably intercepted. Call `preventDefault`, accept that it may not always win, and make sure the traffic light and the `Window > Close` menu item both work, since those are the paths that always work.

---

## 9. Reduced motion

When `prefers-reduced-motion: reduce`:

- No tilt. `rotateX` and `rotateY` are pinned to 0 and the velocity transforms are never created.
- No genie. Windows appear and disappear with an opacity change over `--dur-fast`.
- No Dock magnification. Icons stay at rest scale, hover shows only the tooltip.
- No boot sequence. See `05-shell-desktop.md`.
- Mission Control still opens, but as an instant layout change with no stagger and no Z fan.
- Drag and resize still work normally. They are direct manipulation, not animation, and removing them would break function rather than reduce motion.

Read it once with `useReducedMotion()` from Motion in `DesktopShell` and pass it down through a small context, rather than calling the hook in twelve places.

---

## 10. Mobile behavior

The window manager does not mount below 1024px. `Springboard` replaces it entirely (`16-mobile-springboard.md`). The store is still created, and `open` / `close` still drive which sheet is showing, but geometry, drag, resize, stack depth, and Mission Control are all unused on that branch.

---

## 11. Accessibility contract

- Each window is `role="region"` with `aria-label` set to its title. Not `role="dialog"`, since these are not modal and do not trap focus.
- Minimized windows are `aria-hidden` and removed from tab order.
- Tab order follows stack order, focused window first.
- Every window action is reachable by keyboard through both the shortcut table and the `Window` menu in the menu bar.
- Focus ring is the global `:focus-visible` rule from `01-foundation.md`. Nothing suppresses it.
- Titlebars are `<header>`, window titles are `<h2>`, so the document outline is real.
- Drag is pointer-based and therefore mouse-only, which is why arrow-key nudging exists. Position is not essential to reading any content, so this is an enhancement rather than a required equivalent.

---

## 12. Done checklist

- [ ] Dragging a window with 200 lines of content in it is visibly as smooth as dragging an empty one
- [ ] React DevTools Profiler records **zero** renders during a drag
- [ ] Tilt springs back to flat when the pointer stops, with no explicit reset call
- [ ] All 8 resize handles work, each shows its correct native cursor, `n`/`w` corners resize rather than translate
- [ ] A window cannot be dragged so its titlebar is unreachable, on any edge
- [ ] Minimize genies into the correct Dock icon, and restore comes back out of the same one
- [ ] Restoring a minimized window returns it to its previous depth, not the front
- [ ] Maximize stops below the menu bar and above the Dock, and un-maximize restores the exact prior rect
- [ ] Every shortcut in section 8 works, and none fires while typing in Terminal or Mail
- [ ] Traffic lights are tab-reachable with visible focus rings and correct `aria-label`s
- [ ] Under `prefers-reduced-motion`, no tilt, no genie, no stagger, and drag still works
- [ ] `grep -rn "z-\[" src/` returns nothing. All z-index comes from the scale in `00-architecture.md`.
