# 05 - Shell: desktop, wallpaper, icons, boot

`Desktop.tsx` · `Wallpaper.tsx` · `DesktopIcons.tsx` · `ContextMenu.tsx` · `BootSequence.tsx`

---

## Purpose

The ground everything else sits on. Owns the wallpaper, the desktop icon grid, the right-click menu, and the first-visit boot sequence. Also establishes the `perspective` that the entire 3D window layer depends on.

---

## Data contract

| Source | Used for |
|---|---|
| `data/apps.ts` | entries with `onDesktop` set, giving icon label and target |
| `os/store` `wallpaper`, `booted`, `mode` | current wallpaper, whether boot has run |

---

## 1. `Desktop.tsx`

The root of the desktop branch. Structure:

```
<div class="fixed inset-0 overflow-hidden"
     style="perspective: 1400px; transform-style: preserve-3d">
  <Wallpaper />          z 0
  <DesktopIcons />       z 10
  {stack.map(id => <Window key={id} id={id} />)}   z 100..899
  <Dock />               z 900
  <MenuBar />            z 1000
  <ContextMenu />        z 1100
  <MissionControl />     z 1200
  <BootSequence />       z 1300
</div>
```

`perspective` lives here and nowhere else. Setting it on a child breaks the shared vanishing point and windows stop sharing one 3D space.

Clicking bare desktop deselects any selected desktop icon and closes any open menu. It does **not** unfocus the current window, matching macOS.

---

## 2. `Wallpaper.tsx`

### The honest position

Every OS ships an abstract gradient wallpaper. This is the one place on the site where a pure CSS gradient is the correct answer rather than a shortcut, and it is documented as such so it does not get flagged in the pre-flight.

### Default: CSS mesh plus grain

Three overlapping radial gradients at low opacity over `--os-void`, in muted teal, indigo, and warm gray. Deliberately **not** the purple-to-blue diagonal that is the AI-design fingerprint. Plus a fixed grain overlay:

```
<div class="fixed inset-0 pointer-events-none opacity-[0.035]"
     style="background-image: url(data:image/svg+xml;...feTurbulence...)" />
```

An inline SVG `feTurbulence` data URI, roughly 300 bytes, no network request. Grain is what stops a large flat gradient reading as sterile.

The overlay is `position: fixed` and `pointer-events: none`. Never attached to a scrolling container, which would force continuous repaints.

### Real images when available

`setWallpaper` accepts a path. The switcher lists whatever is present in `public/wallpapers/`, plus the CSS default. If images exist, the active one renders through `next/image` with `priority` and `fill`, since the wallpaper is the LCP element.

> **Gap:** `public/wallpapers/` does not exist yet. The CSS mesh is a genuinely good default and nothing is broken without images, but 2 or 3 real wallpaper JPGs would noticeably lift the finish. Dropping files into that folder is the only step required. See also `00-architecture.md` section 11.

### Vignette

A radial `inset` shadow at the edges, roughly `inset 0 0 200px rgb(0 0 0 / .35)`. It pulls focus toward the center and makes the Dock's glass read as glass by giving it something with tonal variation to sit against.

---

## 3. `DesktopIcons.tsx`

Three icons, top-right, in a vertical column with 76px pitch. Top-right is the macOS convention; top-left reads as Windows.

| Label | Opens | Glyph |
|---|---|---|
| `Projects` | `finder` | Phosphor `FolderSimple`, folder-blue tint |
| `Resume.pdf` | `preview` | Phosphor `FilePdf`, document-white tint |
| `README.txt` | `about` | Phosphor `FileText`, document-white tint |

Behavior:

- Single click selects. Selection is a `--os-accent-soft` rounded rect behind the icon plus a stronger label background.
- Double click opens. `Enter` opens the selected icon.
- Arrow keys move selection between icons.
- Labels sit below the glyph, 11px, center-aligned, with a `rgb(0 0 0 / .35)` rounded backing so they stay legible over any wallpaper. Two-line wrap maximum, then ellipsis.
- Icons are **not** draggable. Free-positioning them adds persistence, collision, and grid-snapping logic for no benefit, and the three icons are already reachable from the Dock. This is a deliberate scope cut.

---

## 4. `ContextMenu.tsx`

Right-click on bare desktop opens it at the pointer. Reuses `Menu.tsx` from `03-shell-menubar.md`, so the visual language is identical.

| Item | Action |
|---|---|
| Change Wallpaper | cycles to the next available wallpaper |
| Mission Control | `setMode('missionControl')`, disabled with fewer than 2 windows |
| separator | |
| Open Projects | `open('finder')` |
| Reader view | `setMode('reader')` |

Flip the panel's origin when it would overflow the viewport right or bottom edge. `Esc` and click-outside both close it, and focus returns to the desktop.

Right-clicking inside a window does **not** open this menu. Let the browser's native context menu through there, since a visitor may legitimately want to copy text or open a project link in a new tab. Suppressing the native menu across the whole page is hostile.

---

## 5. `BootSequence.tsx`

### Timing

| Phase | Duration | What happens |
|---|---|---|
| Mark | 0 to 260ms | `dj` monogram fades in at center, scaling from `0.94` |
| Progress | 260 to 820ms | a 180px, 2px hairline bar fills left to right |
| Handoff | 820 to 900ms | overlay fades out, wallpaper resolves |
| Reveal | 900ms onward | Dock staggers in at 40ms per icon, `finder` auto-opens with a genie |

Roughly 900ms to interactive. Long enough to register as an intentional moment, short enough not to feel like a gate.

### Rules

- **The progress bar is a real CSS transition on a fixed duration.** The current `loading-screen.tsx` drives its bar with `Math.random()`, which is theater. If the bar cannot represent real progress, a fixed honest duration is better than a fake variable one.
- **Skippable.** Any keydown or click jumps straight to the reveal. The current implementation renders "Press any key to skip" while having **no keydown listener anywhere in `src/`**, so the affordance is a lie. This one wires it up.
- **Once per session.** Gated on `sessionStorage.getItem('booted')`. A returning visitor within the same session goes straight to the desktop.
- **Skipped entirely** under `prefers-reduced-motion`, and when `mode === 'reader'` on first load.
- Overlay is `--os-void`, fully opaque, `z-1300`.

### LCP

The current loading screen blocks the viewport for a fixed 2000ms `setTimeout` unrelated to actual load state, which is a guaranteed 2 second LCP penalty on every single visit. Cutting to 900ms and gating per session removes most of that. The LCP element becomes the wallpaper, which is either a CSS gradient (instant) or a `priority` image.

Do not render `BootSequence` at all when `sessionStorage` says it has run. Rendering it and immediately hiding it still costs a paint.

---

## Motion spec summary

| Element | Motion |
|---|---|
| Boot monogram | opacity + `scale(0.94)` to 1, 260ms, `--ease-os` |
| Boot progress | `scaleX` 0 to 1, 560ms, linear. Linear is correct here; progress that eases is misleading. |
| Boot handoff | opacity to 0, 80ms |
| Wallpaper resolve | opacity 0 to 1 plus `scale(1.04)` to 1, 600ms, `--ease-os`. A slight settle rather than a hard cut. |
| Dock reveal | per-icon `scale(0.4)` to 1, spring `{ stiffness: 320, damping: 22 }`, 40ms stagger |
| Desktop icon select | background opacity, `--dur-fast` |
| Context menu open | scale from `0.96` at pointer origin, `--dur-fast` |

---

## Mobile behavior

None of these components render below 1024px. `Springboard` supplies its own wallpaper (same `Wallpaper` component, reused), its own icon grid, and skips boot entirely, since a boot sequence on a phone reads as a slow page rather than as an OS.

---

## Accessibility contract

- Desktop icons are `<button>` elements in a `<ul>`, fully tab-reachable, `Enter` opens.
- Icon labels are real text, never baked into an image.
- The context menu follows the same `role="menu"` contract as `03-shell-menubar.md`, opens with the `contextmenu` event and also via `Shift+F10`, closes on `Esc` returning focus to the desktop.
- The grain overlay and vignette are `aria-hidden` and `pointer-events: none`.
- Boot overlay carries `role="status"` and `aria-label="Loading"`, and is removed from the DOM once complete rather than left hidden.
- Label backings guarantee icon text contrast regardless of which wallpaper is active, which is the reason they exist.

---

## Done checklist

- [ ] `perspective: 1400px` is set on the desktop root and nowhere else
- [ ] Windows share one vanishing point; dragging two windows to opposite edges tilts them toward a common center
- [ ] The wallpaper is not a purple-to-blue diagonal gradient
- [ ] Grain overlay is `position: fixed` and `pointer-events: none`
- [ ] Wallpaper switcher picks up any JPGs added to `public/wallpapers/` with no code change
- [ ] Desktop icon labels are legible against every available wallpaper
- [ ] Double click and `Enter` both open a desktop icon; arrow keys move selection
- [ ] Right-click on the desktop opens the custom menu; right-click **inside a window** shows the native browser menu
- [ ] Boot completes in roughly 900ms and any key or click skips it
- [ ] Boot runs once per session and is not rendered at all on the second load
- [ ] The progress bar is a real fixed-duration transition, with no `Math.random()` anywhere
- [ ] Under reduced motion, boot is skipped entirely and the desktop renders immediately
- [ ] Lighthouse LCP is under 1.8s on the deployed build
