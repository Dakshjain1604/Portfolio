# End-to-end smoke test

One script, no framework. Drives a real Chrome against a running build and
asserts the things a type-checker cannot: that every app actually mounts
with content, that closing works, that the no-JS Reader tree renders, and
that the mobile branch renders.

```sh
npm run build && npx next start -p 3100     # test the production bundle
node tools/e2e/smoke.mjs    http://localhost:3100
node tools/e2e/contrast.mjs http://localhost:3100
```

Both exit non-zero on any failure and print every check either way.
`playwright` and `sharp` are devDependencies.

## contrast.mjs

Measured WCAG contrast for every label that sits on the wallpaper, in
**both** themes. Not a token audit: all of it sits on a `backdrop-filter`
surface, so the colour behind the text depends on the wallpaper, the blur
and the scrim together and cannot be derived from the CSS. It screenshots
the real page, samples the pixels actually behind each label, composites the
text colour over them, and reports the ratio against a 4.5:1 floor.

It earned its place immediately. Launchpad and Mission Control dimmed the
wallpaper with a fixed `brightness(0.45)`/`(0.55)`, so their surface was dark
in *both* themes while the text on it followed the theme. In Light that put
near-black `--wp-text` on a darkened backdrop: **2.74:1** for Launchpad
labels and **1.05:1** for Mission Control's - text and background within a
rounding error of each other. Fixed with a `--os-scrim` token that flips with
the theme; a colour rather than a filter also means contrast no longer
depends on which wallpaper is loaded. Now 12.13 and 6.76.

## Why it exists

It found two things that `tsc`, `eslint` and `next build` all passed
cleanly:

- **Terminal crashed the entire application.** Its typewriter intro closed
  over a mutable index inside a `setState` updater. React may invoke an
  updater more than once, and when it did the second call appended
  `undefined` to the buffer; the next render dereferenced it and took down
  the Dock, the menu bar and every other window with it. There is no error
  boundary between an app and the shell, so one bad app is a white screen.
- **A layout that could never work.** `Sidebar` wrote its width as an inline
  style, which no container-query class can override, so Writing's
  narrow-window drill-down was dead on arrival. Hence the `fluid` prop.

## Test-writing notes, learned the hard way here

- **Seed the theme the way a visitor would, in `localStorage`.** Setting
  `documentElement.dataset.theme` after load does nothing: DesktopShell
  re-applies the *store's* preference post-mount, and the default, `auto`,
  deletes the attribute. The first contrast run measured the light theme
  twice and reported it as "dark" and "light".
- **A loose selector fails silently and confidently.** `li span` for the
  Mission Control label matched a span inside the card's *live app content*
  instead, and reported the same 1.05:1 before and after a fix that had
  actually landed.
- **Query the real DOM before asserting against it.** The windows are
  `div[role="region"]`, not `section` — an early version of this file used
  `section[role="region"]`, matched nothing, and every window assertion
  passed vacuously.
- **Re-resolve Dock locators each iteration.** The Dock re-renders on open,
  detaching any `ElementHandle` captured up front.
- **Resize windows by dragging a handle, not by assigning `style.width`.**
  Width is bound to a Motion value and gets rewritten on the next frame,
  which silently un-narrows the window halfway through a container-query
  test.
- **Scope selectors away from `#reader`.** The Reader tree is always in the
  DOM as a sibling of the shell, so unscoped text matches hit it first.
- **Open apps one at a time.** Ten windows cascade over the Dock and make
  the later icons genuinely unclickable — correct macOS behaviour, useless
  for a test.
