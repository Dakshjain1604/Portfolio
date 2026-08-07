# 18 - Pre-flight

The last filter. Run every section before shipping. Derived from what documents 00 through 17 actually committed to, plus the binding rules from the `design-taste-frontend` and `high-end-visual-design` skills.

**If a single box cannot be honestly ticked, the build is not done.**

---

## A. Mechanical checks (run these first, they take 60 seconds)

Cheap greps that catch the most common regressions. Run before any manual review.

```bash
# 1. EM-DASH BAN. Non-negotiable. Must return zero.
grep -rn "—\|–" src/ plan/ MacOS.md

# 2. No arbitrary z-index. All z comes from the scale in 00-architecture.md.
grep -rn "z-\[" src/

# 3. Dead dependencies must be gone.
grep -rn "lucide-react\|gsap\|styled-components\|react-syntax-highlighter\|class-variance-authority\|react-icons" src/

# 4. No remote font imports. Geist via next/font only.
grep -rn "@import url" src/

# 5. No scroll listeners. IntersectionObserver, Motion useScroll, or CSS only.
grep -rn "addEventListener('scroll'\|addEventListener(\"scroll\"" src/

# 6. No window.alert anywhere.
grep -rn "window.alert\|[^.]alert(" src/

# 7. No layout-property animation in Motion configs.
grep -rn "animate=\{\{[^}]*\(top\|left\|width\|height\)" src/

# 8. The latent build break must be fixed.
grep -n '"clsx"' package.json     # must return a hit

# 9. Server-rendered content must exist.
curl -s localhost:3000 | grep -c "DocuMind"    # must be >= 1

# 10. No banned fonts.
grep -rni "inter\|roboto\|open sans\|helvetica" src/app/globals.css src/app/layout.tsx
```

- [ ] All ten commands produce the expected result

---

## B. Content

- [ ] **Zero em-dashes (`—`) and zero en-dashes (`–`)** in any visible string: window titles, menu items, Dock tooltips, button labels, body copy, empty states, error messages, alt text, terminal output.

  The current source has **16 occurrences across 3 files**, every one of which is content being ported. This is the single most likely regression in the whole build, because the strings get copied verbatim into `src/data/`. Fix them at the moment of the copy:

  | File | Count | What to do |
  |---|---|---|
  | `FeaturedProjects.tsx` | 6 | project `description` and `outcome` strings. Split into two sentences, or use a comma. Affects DocuMind, Interview AI, AutoCareer, Ai-Coding-Agent, LLM Response Judge. |
  | `TerminalSection.tsx` | 7 | the `whoami` output line and 6 help-text rows. Use a regular hyphen with spaces. |
  | `Experience.tsx` | 3 | `period` date ranges (`Oct 2025 – Present`). Becomes `Oct 2025 to Present` per `10-app-notes.md`. |

  Verify after the port with `grep -rn "—\|–" src/`, which must return zero.
- [ ] **Zero invented data.** No fabricated star counts, commit totals, coding hours, proficiency percentages, testimonial quotes, or Finder file metadata. `MOCK_DATA` is deleted from the API route.
- [ ] **`Testimonials.tsx` and `stats-widgets.tsx` content is not carried forward** in any form.
- [ ] Every string in `src/data/` matches the audited original verbatim.
- [ ] No AI copy cliches: `Elevate`, `Seamless`, `Unleash`, `Next-Gen`, `Game-changer`, `Delve`, `Revolutionize`, `In the world of`.
- [ ] No `Oops`, no exclamation marks in error or success messages, no passive voice in error copy.
- [ ] Sentence case on headings, not Title Case On Every Header.
- [ ] Copy self-audit performed: every visible string re-read for grammatical breaks, unclear referents, and forced wordplay.
- [ ] Middle dot (`·`) appears at most once per metadata line.
- [ ] No version footers, no build strings, no `v1.4.2`.
- [ ] No locale, city, timezone, or weather strips. The menu bar clock shows time and date only.

---

## C. Design system

- [ ] **One accent color** (`--os-accent`) used identically everywhere: focus rings, selected rows, Dock running dot, active tab underline. Traffic lights are the documented exception and are used nowhere else.
- [ ] **One radius system**: `--r-window` / `--r-card` / `--r-control` / `--r-chip`. Squircle icons use `22.5%`. No other radius value appears in `src/`.
- [ ] **Page theme locked dark.** No section, window, or app flips to a light surface. Terminal at `#0E0E11` and Preview at `#141416` are darker shades within the same family, which is permitted; a light surface is not.
- [ ] Grays are one warm-neutral family. No cool slate mixed in.
- [ ] No pure `#000000` anywhere.
- [ ] No neon or outer glows.
- [ ] The wallpaper is not a purple-to-blue diagonal gradient.
- [ ] Two font families only: Geist Sans and Geist Mono, both via `next/font`.
- [ ] Icons come from Phosphor at one consistent stroke weight, plus Simple Icons for brand logos. No hand-rolled decorative SVG paths.
- [ ] `--os-text-3` is used for decoration only, never for body copy.

---

## D. Layout

- [ ] No `h-screen` anywhere. `min-h-[100dvh]` or explicit heights only.
- [ ] No horizontal page scroll at 1440px, 1024px, 768px, 390px, or 320px.
- [ ] Wide content (Activity heatmap, Terminal output, code blocks) scrolls inside its own `overflow-x: auto` container.
- [ ] Every multi-column layout declares its collapse explicitly, in the same component.
- [ ] Finder's preview pane and sidebar collapse via **container queries** on the window body, not viewport media queries. A window can be narrow on a wide screen.
- [ ] Body measure is capped: `62ch` in About, `64ch` in Notes, `46ch` in Finder preview, `68ch` in Reader.
- [ ] Menu bar is exactly 28px and matches `MENUBAR_H` in the store.
- [ ] The mobile icon grid holds 11 real items with no empty cell.
- [ ] Safe-area insets applied on mobile dock and sheet headers.

---

## E. Motion

- [ ] **Every animation can be justified in one sentence** naming hierarchy, storytelling, feedback, or state transition. Each app document states its own motivations; verify the implementation did not add unjustified ones.
- [ ] **Motion claimed is motion shown.** `MOTION_INTENSITY: 8` means window tilt, Dock magnification, genie open and close, and the Mission Control fan all actually work. A static build claiming 8 is a fail.
- [ ] All animation uses `transform` and `opacity` only. The Dock's `width`/`height` magnification is the single documented exception, justified in `04-shell-dock.md`.
- [ ] No `linear` or `ease-in-out` on interactive transitions. `--ease-os` or a spring.
- [ ] **No infinite loops** except: the terminal caret blink, the skeleton shimmer while loading, and the Orchestrator edge dash flow. Every one of the three stops or is bounded.
- [ ] `will-change: transform` is applied only during an active drag or resize, never permanently.
- [ ] Every `useEffect` with a listener, timer, `setInterval`, or rAF has a cleanup return.
- [ ] The click-outside listener for menus is attached only while a menu is open.
- [ ] No `window.addEventListener('scroll')`.

---

## F. Performance

- [ ] **React DevTools Profiler records zero renders during a window drag.** This is the load-bearing check for `02-window-manager.md`'s core rule.
- [ ] Zero renders while sweeping the pointer across the Dock.
- [ ] `backdrop-filter` appears only on fixed or absolutely-positioned chrome: menu bar, Dock, titlebars, sheet headers, Mission Control backdrop. **Never on a scrolling container.**
- [ ] The grain overlay is `position: fixed` and `pointer-events: none`.
- [ ] The Orchestrator Canvas unmounts on window close. Verified by watching the frame counter flatline in DevTools Performance.
- [ ] Orchestrator `dpr` is capped at `[1, 1.5]` desktop and `1` mobile, with `antialias: false`.
- [ ] `OrchestratorScene` is the only `next/dynamic` import in the app tree.
- [ ] GitHub data is fetched once and cached at module scope.
- [ ] Terminal buffer caps at 300 lines.
- [ ] Lighthouse on the deployed build: **LCP < 1.8s, INP < 200ms, CLS < 0.05.**
- [ ] Boot completes in roughly 900ms and does not render at all on the second load in a session.
- [ ] `npm run build` produces no warnings about large first-load JS.

---

## G. Accessibility

- [ ] The skip link is the **first tabbable element on the page** and becomes visible on focus.
- [ ] Every interactive element is reachable by keyboard, with a visible focus ring from the global `:focus-visible` rule. Nothing suppresses it.
- [ ] Every window action works from the keyboard: close, minimize, maximize, cycle, nudge.
- [ ] Traffic lights are real `<button>` elements with `aria-label`, tab-reachable.
- [ ] Global shortcuts do not fire while typing in Terminal or the Mail compose fields.
- [ ] Correct roles throughout: `role="menubar"` / `menu` / `menuitem` on the menu bar, `listbox` / `option` in Finder and Notes, the full ARIA tabs pattern in Activity Monitor, `dialog` + `aria-modal` on Mission Control and mobile sheets.
- [ ] Focus is trapped in Mission Control and mobile sheets, and restored on exit.
- [ ] `#reader` carries `inert` **and** `aria-hidden` while the desktop is active. Tabbing through the desktop never lands inside it.
- [ ] Every image has descriptive `alt`. No `alt="image"`. Decorative brand logos use `alt=""` and are genuinely decorative.
- [ ] Every form input has a real visible `<label>`. No placeholder used as a label.
- [ ] Form validation is inline with `aria-invalid`, `aria-describedby`, and `role="alert"`.
- [ ] The Orchestrator canvas has a visually hidden text equivalent listing all five agents.
- [ ] The Activity heatmap exposes one summary `aria-label`, not 371 announced cells.
- [ ] All body text passes WCAG AA against its surface. Placeholder text specifically passes, since it is the usual failure point.
- [ ] Color is never the sole carrier of meaning. Terminal errors are prefixed with `error`, not only tinted.
- [ ] **`prefers-reduced-motion: reduce`**: no boot, no tilt, no genie, no Dock magnification, no Mission Control fan, no stagger, no caret blink, no auto-rotation. Drag and resize still work, since they are manipulation rather than animation.
- [ ] **`prefers-reduced-transparency: reduce`**: `.os-glass` becomes solid with `backdrop-filter: none`.
- [ ] Browser zoom to 200% in reader view produces no horizontal scroll and no clipped content.
- [ ] No custom cursor anywhere. All eight native resize cursors work.

---

## H. Architecture

- [ ] `layout.tsx`, `page.tsx`, and `ReaderView.tsx` are server components.
- [ ] `DesktopShell.tsx` is the only top-level `'use client'` boundary.
- [ ] No file under `src/data/` contains `'use client'`, and all six import cleanly from a server component.
- [ ] **Zero duplicated content.** No string appears in two places. Terminal, Finder, Settings, and Reader all read the same modules.
- [ ] App components receive no content as props. Only `windowId` and, on mobile, `onClose`.
- [ ] The store holds geometry and mode only, never content.
- [ ] Cross-app actions go through `useOS.getState().open(...)`, not prop callbacks or an event bus.
- [ ] The old `page.tsx` `selectedSkill` prop-drilling is not reproduced in any form.
- [ ] Every file under `src/` has at least one importer. Verify with `npx knip` or an equivalent sweep.
- [ ] File count is at or near 50, averaging roughly 68 LOC per file. A 51st file needs a recorded reason in `00-architecture.md`.
- [ ] `npx tsc --noEmit` is clean.
- [ ] `npm run lint` is clean and the script is `eslint .`, not `next lint`.

---

## I. Documented exceptions (verify each is still intentional)

These patterns are banned by the taste skill and permitted here for stated reasons. Re-read each and confirm it is still the right call rather than drift.

| Exception | Justification | Where |
|---|---|---|
| Div-based product UI | the OS is the product, and every window holds real selectable content | `00-architecture.md` |
| A working terminal | it accepts input and resolves commands, so it is a real interface | `08-app-terminal.md` |
| Menu bar clock | the literal artifact being simulated. Time and date only. | `03-shell-menubar.md` |
| One status dot | the Dock running indicator conveys real state | `04-shell-dock.md` |
| Dock animates `width`/`height` | the Dock must reflow to push neighbors aside; scale would overlap them | `04-shell-dock.md` |
| CSS gradient wallpaper | every OS ships an abstract wallpaper; real images are supported when present | `05-shell-desktop.md` |
| A proportional bar in Activity Monitor | real proportion of a real total, with no background track | `12-app-activity.md` |
| Dividers between grouped rows in Settings | a contained macOS grouped list, not a hairline under every row of a long table | `11-app-settings.md` |
| Small-caps section headings in Reader | five section headings in a document, not eyebrows above headlines | `17-reader-view.md` |

- [ ] All nine still hold. Any exception no longer justified has been removed.

---

## J. Final manual pass

- [ ] Open every app from the Dock. Drag, resize, minimize, restore, maximize, and close each one.
- [ ] Open six windows, enter Mission Control, select one, confirm it lands cleanly.
- [ ] Unplug the mouse. Reach every app and perform every window action with the keyboard alone.
- [ ] Emulate `prefers-reduced-motion`, then `prefers-reduced-transparency`. Walk the whole site in each.
- [ ] Test at 390x844. Open every app in a sheet, dismiss each by drag and by button.
- [ ] Disable JavaScript entirely and reload. The full document must render and be navigable.
- [ ] Toggle Reader view and read it end to end. Does it stand on its own as a good page?
- [ ] Run Lighthouse on the deployed build, not the dev server.
- [ ] **Re-read `MacOS.md` cold.** Does the shipped build match what it describes?

---

## K. The two unfilled gaps

Neither blocks the build. Both are visible to every visitor until filled.

- [ ] `public/DakshJain_Resume.pdf` is placed. Six references resolve through `socials.resume`. Until then, Preview shows its empty state. **This is the highest-value outstanding item in the entire build, ahead of any visual polish.**
- [ ] 2 or 3 wallpaper JPGs are in `public/wallpapers/`. The CSS mesh is a good default; real imagery is better. The switcher picks them up with no code change.
