# End-to-end smoke test

One script, no framework. Drives a real Chrome against a running build and
asserts the things a type-checker cannot: that every app actually mounts
with content, that closing works, that the no-JS Reader tree renders, and
that the mobile branch renders.

```sh
npm run build && npx next start -p 3100     # test the production bundle
npm i -D playwright                         # not an app dependency
node tools/e2e/smoke.mjs http://localhost:3100
```

Exits non-zero on any failure and prints every check either way.

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
