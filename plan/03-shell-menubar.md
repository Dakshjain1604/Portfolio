# 03 - Shell: menu bar

`src/components/shell/MenuBar.tsx` and `src/components/shell/Menu.tsx`

---

## Purpose

The persistent top strip. It names the focused app, holds working menus, and owns the Reader view toggle. It is the only always-visible affordance that tells a first-time visitor this is an operating system rather than a decorated page.

**Every menu item in it does something.** No decorative menus. If an item has no action, it does not ship.

---

## Data contract

| Source | Used for |
|---|---|
| `os/store` `stack` | the focused `AppId`, which names the menu |
| `data/apps.ts` `AppMeta.title` | the app name shown in bold |
| `data/socials.ts` | GitHub and LinkedIn glyph links, resume path for `File > Open Resume` |

No content of its own.

---

## DOM structure

```
<header role="menubar" class="os-glass fixed top-0 inset-x-0 h-7 z-[1000]">
  <div>                              <- left cluster
    <button>  dj monogram  </button>   opens the identity menu
    <button>  {focusedAppTitle}  </button>   semibold
    <button>  File  </button>
    <button>  View  </button>
    <button>  Window  </button>
  </div>
  <div>                              <- right cluster
    <button>  Reader view  </button>
    <a href={socials.github}>   GithubLogo   </a>
    <a href={socials.linkedin}> LinkedinLogo </a>
    <time>  {clock}  </time>
  </div>
</header>
```

Height 28px, matching macOS. Full-bleed, not a floating pill. `os-glass` with no bottom radius.

### The identity mark

A `dj` monogram in Geist Sans semibold, not the Apple logo. The Apple logo is a registered trademark and reproducing it in a public portfolio is a real problem, not a pedantic one. The monogram also does more work, since it is the site's brand.

---

## Menus

`Menu.tsx` is one dropdown component used five times. Panel is `os-glass`, `--r-card`, 4px padding, items 22px tall with 10px horizontal padding, separators are `--os-divider` hairlines.

### `dj` (identity)

| Item | Action |
|---|---|
| About This Mac | `open('about')` |
| Skills | `open('settings')` |
| Activity Monitor | `open('activity')` |
| separator | |
| Reader view | `setMode('reader')` |

### `File`

| Item | Shortcut | Action |
|---|---|---|
| Open Resume | | `open('preview')` |
| Download Resume | | anchor download of `socials.resume` |
| separator | | |
| Close Window | `Cmd W` | `close(focused)`, disabled when nothing is open |

### `View`

| Item | Shortcut | Action |
|---|---|---|
| Mission Control | `F3` | `setMode('missionControl')`, disabled with fewer than 2 windows open |
| separator | | |
| Change Wallpaper | | cycles `setWallpaper` through the available list |
| separator | | |
| Reader view | | `setMode('reader')` |

### `Window`

| Item | Shortcut | Action |
|---|---|---|
| Minimize | `Cmd M` | `minimize(focused)` |
| Zoom | | `toggleMaximize(focused)` |
| separator | | |
| Bring All to Front | | no-op when fewer than 2 open; otherwise re-stacks minimized windows back to `open` |
| Minimize All | | `minimizeAll()` |
| Close All | | `closeAll()` |
| separator | | |
| *(open window list)* | | one checkable item per entry in `stack`, click focuses it. Checkmark on the focused one. |

The open-window list is what makes this menu earn its place rather than being decoration. With six windows open it is the fastest way to reach a buried one.

Disabled items render at `--os-text-3` with `aria-disabled="true"` and are skipped by keyboard navigation. They are shown rather than hidden so the menu does not reflow as state changes.

---

## The clock

`<time>` in Geist Mono, `font-variant-numeric: tabular-nums` so the width never jitters. Format: `Thu 7 Aug  2:41 PM`, using `Intl.DateTimeFormat` with the visitor's locale, updated on a `setInterval` of 10 seconds with a cleanup return.

The taste skill bans locale and time strips in headers as an agency-portfolio tell. This is a **documented exception**: a menu bar clock is the literal artifact being simulated, and a macOS menu bar without one reads as broken. The exception is narrow. Time and date only. No city, no timezone label, no weather, no build string.

Hydration note: rendering a clock server-side produces a mismatch. Render `null` until mounted, then fill in. A 28px gap for one frame is invisible; a hydration error in the console is not.

---

## Motion spec

| Trigger | Behavior |
|---|---|
| Menu open | panel scales from `0.96` with `transformOrigin: top left`, opacity 0 to 1, `--dur-fast`, `--ease-os` |
| Menu close | opacity only, 100ms. Closing should feel instant. |
| Hover between open menus | switches with **no** animation. Once one menu is open, sliding across the bar swaps panels immediately, exactly like macOS. |
| Item hover | background `--os-accent`, text white, no transition. Menu highlights in macOS are instant. |
| App name change on focus switch | cross-fade over `--dur-fast` |

Under reduced motion, all of the above become instant opacity swaps.

---

## Mobile behavior

`MenuBar` does not render below 1024px. `Springboard` provides an iOS status bar instead (`16-mobile-springboard.md`), which carries the clock and a Reader view affordance in its own idiom.

---

## Accessibility contract

- `role="menubar"` on the header, `role="menu"` on each panel, `role="menuitem"` on items, `role="separator"` on dividers.
- Full keyboard operation: `Tab` reaches the bar, `Enter` or `Space` or `ArrowDown` opens a menu, `ArrowUp` / `ArrowDown` move between items, `ArrowLeft` / `ArrowRight` move between menus with one open, `Esc` closes and returns focus to the trigger, `Home` / `End` jump to first and last.
- `aria-expanded` on each trigger, `aria-haspopup="menu"`.
- Focus returns to the trigger button on close. Focus is never lost to `<body>`.
- Checkable window-list items use `role="menuitemradio"` with `aria-checked`.
- The clock is `<time dateTime={iso}>` so it is machine-readable.
- Contrast: `--os-text` on `--os-chrome` over a dark wallpaper passes AA comfortably. `--os-text-3` is used only for disabled items, where reduced contrast carries the meaning and AA does not apply.

Click-outside closes the open menu. Implement with a single `pointerdown` listener on `document` added only while a menu is open, removed in the effect cleanup. Not a permanently attached listener.

---

## Done checklist

- [ ] Every menu item performs a real action, or is visibly disabled with a reason
- [ ] The app name updates when focus moves between windows
- [ ] The Window menu lists all open windows and clicking one focuses it
- [ ] Once a menu is open, hovering across the bar swaps panels with no animation
- [ ] `Esc` closes an open menu and returns focus to its trigger
- [ ] Full keyboard traversal works in both directions, including `Home` and `End`
- [ ] The clock does not shift width as digits change
- [ ] No hydration warning in the console on first load
- [ ] The click-outside listener is attached only while a menu is open, and is cleaned up
- [ ] Bar height is exactly 28px and matches `MENUBAR_H` in `os/store.ts`
- [ ] No Apple logo anywhere
