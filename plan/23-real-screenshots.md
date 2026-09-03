# 23 — Real screenshots, and a project app for each of them

Every project on this site now has an app icon made from a photograph of
that project running, and a window that shows the photographs at a size
worth looking at. Two halves: capture, then surface.

## 1. Capture

`tools/shots/` starts each project's own dev servers and photographs the
result with Playwright. `tools/shots/README.md` has the per-project notes
(ports, backends, the one repo that had to be cloned); this section is only
about why the pass happened.

`plan/00-architecture.md` said of `public/images/projects/*.png`: *"keep all
7. they are the real project screenshots."* That was not true of all of
them. `autocareer.png` was a generated mockup — an invented user, garbled
body copy, a Vercel careers page whose text does not parse as English — of a
dashboard whose real version looks nothing like it. `neo-mcp.png` was an
architecture diagram, which is fine as a diagram and misleading as evidence.

The problem was not that those images were ugly. It was that the tree gave a
reader no way to tell a capture from a drawing. Now it does: everything in
`public/images/projects/<id>/` was produced by a command in
`tools/shots/manifest.mjs` or `tools/shots/terminal-manifest.mjs`, and the
terminal shots ship their full untrimmed transcripts alongside.

Where a project genuinely has no screen, it is not given a fake one.
neo-mcp is a stdio MCP server with a private repo; it is photographed as
`pip show` plus a live query against PyPI's JSON API, and the diagram is
kept as a *second* shot whose caption says it is a diagram.

## 2. Surface

`data/projects.ts` gained `shots` (hero first, each with a caption) and
`icon` (the square crop the Dock mosaic needs), plus `projectThumbSrc` /
`projectIconSrc` for the two baked assets. `data/apps.ts` gained one app
per project: `AppId` is now `CoreAppId | \`project.${ProjectId}\``, so every
project window is a real window — draggable, minimizable, in Mission
Control, in the Window menu, addressable from Terminal's `open` — with no
change to the window manager, the store, or the menu bar.

**Why not the Dock.** Ten more tiles beside the eight that orient a visitor
buries both sets. macOS's own answer for apps that are not pinned is
Launchpad, so that is what `shell/Launchpad.tsx` is: one Dock tile (itself a
3×3 mosaic of the first nine screenshots), a full-screen grid, type-to-
filter, `F4`. It also scales — the eleventh project costs a grid cell and
nothing else.

**Why the tiles are landscape cards, not square icons.** Four attempts, and
each failure taught the next.

1. *Zoom 2.4–2.8× on the screenshot.* Unreadable — at that magnification the
   crop lands inside a paragraph, and body text at 72px is noise.
2. *Back off to scale ≈1, the whole screen in a square.* Legible as
   **composition** but nothing in any tile could be read, and it still looked
   soft.
3. *Crop to the identity region, bake it at 512px, draw it at 112px.* Much
   sharper — the softness turned out to be a ~40:1 browser downscale done in
   one filtering step, which `tools/shots/icons.mjs` fixed by resampling once
   through Lanczos instead. Still cropped, though.
4. *Stop forcing a square.* Every shot is 16:10 or wider. A square tile has
   to discard a third of it, and rounds 1–3 were only ever choosing **which**
   third — a better crop cannot solve a shape mismatch. Each project is now
   drawn at the screenshot's own aspect ratio: a 16:10 card, `object-contain`
   over a near-black stage so the two wider-than-16:10 terminal captures
   letterbox rather than clip. Nothing is cut anywhere.

Launchpad is a 5-column grid of ~230px cards — all ten on one screen, no
scrolling, and the UI inside each is genuinely readable rather than merely
recognisable. Finder rows, the detail pane, Quick Look, the mobile grid, and
the project window's thumbnail strip all draw the same uncropped
`thumb.png`.

One square survives: the Dock's Launchpad tile is a 3×3 mosaic of `icon.png`
crops, where nine cells at ~14px each are texture rather than something
anyone reads. That is the only place `icon: { cx, cy, size }` still matters.

`tools/shots/icon-sheet.mjs` renders every tile at five display sizes so a
crop can be judged where it is used; two rounds of that caught headlines
clipping mid-word ("ead documents wit") and AutoCareer framing an empty form
instead of its own wordmark.

**The search field.** Enlarged to match, and its focus ring moved onto the
pill. `globals.css` carries a global, *unlayered* `:focus-visible { outline:
2px solid var(--os-accent) }`; a Tailwind `focus-visible:outline-none` on the
input cannot beat it, because utilities are layered and unlayered CSS wins
unconditionally — a trap that file already documents higher up. The result
was an accent rectangle drawn inside the rounded pill, which read as a
rendering bug. The fix is a single unlayered opt-out class,
`.focus-ring-on-wrapper`, plus `has-[input:focus-visible]` on the pill, so
the indicator still exists and sits on the shape the user perceives.

**Contrast, measured in both themes.** `tools/e2e/contrast.mjs` screenshots
the running page and samples the pixels actually behind each wallpaper label,
because everything here sits on a `backdrop-filter` surface where the
effective background is the wallpaper, the blur and the scrim combined - not
anything a CSS audit can read off. It caught a genuine bug the moment it
existed: Launchpad and Mission Control dimmed the wallpaper with a fixed
`brightness()`, so their surface stayed dark in **both** themes while their
text kept following the theme. Light rendered near-black labels on a darkened
backdrop - 2.74:1 for Launchpad, 1.05:1 for Mission Control, which is text
and background within a rounding error of each other.

The fix is a `--os-scrim` token that flips with the theme, replacing the
filter. Being a colour rather than a filter, it also decouples contrast from
which wallpaper happens to be loaded, so changing one cannot regress it.
Mission Control's label moved from panel tokens to wallpaper tokens with a
label shadow, matching every other label on the wallpaper. All eight measured
surfaces now clear 4.5:1, worst case 5.11.

**Two to five views per project, not one.** 40 shots in total. A single
screenshot shows that a thing exists; it does not show what it does. The
manifests drive each app to the views that carry its claim — the detection
log filtered to dark contacts, the terminal's chart at five years with
RSI/MACD overlaid, AutoCareer's four tabs and its settings modal, DocuMind's
studio behind its JWT gate. Where a project genuinely has one screen
(Website Cloner) it gets two, and where a route is gated by real third-party
auth (Interview AI's interviewer dashboard, behind Supabase) it is left out
rather than faked.

That is only safe because `capture.mjs` hashes every shot and fails any that
is byte-identical to an earlier one in the same target. `actions` swallow
their own errors by design, so a dead selector otherwise yields a picture of
the previous screen and no error — it caught four real misses in one run,
each documented in `tools/shots/README.md`.

**What the window does.** `apps/ProjectApp.tsx`: the shot on a darkened
stage (a light screenshot needs something to sit against), its caption
underneath, a thumbnail strip when there is more than one, arrow keys to
page, click to zoom to full size — where it scrolls rather than shrinking
further, because a reader who asked for full size was trying to escape a
fitted image. The details rail reuses `FinderProjectDetail` with the hero
suppressed, so the facts cannot drift between Finder, Quick Look, and here.

Finder keeps Quick Look as the peek and gains an explicit button that opens
the project's app. On mobile, Springboard's grid scrolls and the projects sit
under their own heading rather than mixed in with Terminal and Contact.

## 3. What this pass deliberately did not do

- **Fix other repos.** Capturing BloombergTerminal surfaced a real bug: its
  Fastify gateway passes `redis:` to `RateLimiterRedis`, which wants
  `storeClient:`, so every request 429s and the terminal runs entirely on its
  simulated feed. Documented in `tools/shots/README.md`, not patched — it is
  a different repo and was not the task.
- **Curate the list.** `website_cloner` is a real checkout under `CODES` and
  the sweep was meant to cover all of them, so it is here, described as the
  take-home template it is. It is the smallest thing on the page. If the list
  should be strictly ranked work, it is the entry to cut — one object in
  `data/projects.ts` and one id in `PROJECT_IDS`.
