# Screenshot harness

Starts each project for real and photographs it. Nothing in
`public/images/projects/` is a mockup, a render, or a hand-drawn
approximation of a screen — every file is either a Playwright capture of the
project running, or a terminal transcript of the project's own output.

`playwright` and `sharp` are devDependencies — tooling only, nothing here
reaches the browser bundle.

```sh
node tools/shots/capture.mjs          # every browser target
node tools/shots/capture.mjs soh_ships llm_response_judge
node tools/shots/terminal.mjs         # the command-line projects

node tools/shots/icons.mjs            # bake the app tiles from the heroes
node tools/shots/icon-sheet.mjs /tmp/tiles.png   # judge them at real sizes
node tools/shots/verify.mjs /tmp/out             # desktop → Launchpad → a project window
```

**Rerun `icons.mjs` after re-capturing a hero shot or editing an `icon`
crop** — the app draws tiles from `<id>/icon.png`, not from the hero, so a
new screenshot does not reach the Dock or Launchpad until it is baked. It
is fast and idempotent.

`capture.mjs` reads `manifest.mjs`, `terminal.mjs` reads
`terminal-manifest.mjs`. Both write into `public/images/projects/<id>/` and
merge an index into `public/images/projects/shots.json`. `terminal.mjs` also
writes the full untrimmed transcript to `tools/shots/transcripts/<id>.txt`,
so any shot can be checked against what the command actually printed.

## Several views per project, not one

40 shots across ten projects — two to five each, whatever the project
actually has. One screenshot shows that a thing exists; it does not show
what it does. So the manifests drive the apps: open the detection log and
filter it to dark contacts, page the terminal's chart to five years and
overlay RSI/MACD, walk AutoCareer's four tabs and its settings modal, sign
up and sign in to reach DocuMind's studio behind its JWT gate.

**Duplicate detection is what makes that safe.** `actions` deliberately
swallow their own errors so one dead selector cannot abort a whole target —
which means a missed click produces a screenshot of the *previous* screen
and no error at all. `capture.mjs` hashes each shot and reports any that is
byte-identical to an earlier one in the same target, then exits non-zero.
It caught four real misses in one run:

| shot | why it silently did nothing |
|---|---|
| `soh_ships/dark-vessels` | matched the "3 DARK VESSELS" banner, not the filter tab (`aria-label="Filter: DARK"`) |
| `llm_response_judge/dark-mode` | the toggle is in a `<nav>`, not a `<header>` |
| `interview_ai/how-it-works` | the landing page is 1018px tall; both scroll targets clamped to the same bottom |
| `documind_ai/pipeline` | same — the real scroll extent is 997px, not 2400 |

**One thing worth knowing about the DocuMind shot.** Reaching `/Dashboard`
means signing up, and that checkout's `.env` points `MONGODB_URI` at a real
database — so the first working version of it would have written a harness
account into live data. The manifest now starts that server with
`MONGODB_URI=` so `lib/userStore.ts` falls back to a local JSON file. A
screenshot should not write to anything it does not own.

## The two baked assets, and why

`icons.mjs` emits both, per project:

- **`thumb.png`** — the whole hero, uncropped, resampled to 1200px wide.
  This is what every project tile in the UI draws. Screenshots are 16:10 or
  wider; a square tile has to discard a third of one, and no amount of
  crop-tuning fixes that, it only picks which third to lose. Also cuts what
  Launchpad pulls on open from ~4 MB of full-size heroes to a few hundred KB.
- **`icon.png`** — a 512px square crop of the `icon: { cx, cy, size }`
  region. Only the Dock's Launchpad mosaic still needs a square, and there
  nine cells at ~14px each are texture, not content.

Both are baked rather than cropped in CSS because a 40:1 downscale done by
the browser looks like a 40:1 downscale done by the browser: Chromium gets
one filtering step and the output is visibly soft. Lanczos, once, offline.

`icon-sheet.mjs` renders every square tile at 52/72/96/112/132px so a crop
can be judged at the sizes it is used — how two bad ones (headlines clipping
mid-word, AutoCareer framing an empty form) got caught before shipping.

## Why it exists

The images this replaced were not all screenshots. `autocareer.png` was a
generated mockup of a dashboard — garbled body copy, an invented user named
"Olivia Martin", a Vercel careers page that does not read as English. The
real AutoCareer dashboard looks nothing like it. `plan/00-architecture.md`
said "keep all 7, they are the real project screenshots"; that was true of
some of them and not of others, and there was no way to tell which from the
tree. Now there is: if it is in this directory, a command in one of these
manifests produced it.

## What each project needed

Most of it is ports. Nearly every project defaults to 3000 / 5173 / 8000 and
several collide, so the manifest overrides the port and the harness binds
`127.0.0.1` explicitly — `--host` matters because Vite prints
`http://localhost:PORT` while listening on `::1`, and a readiness probe
against `127.0.0.1` then never succeeds.

Beyond that:

- **SOH Ships** — the Vite proxy hardcodes `localhost:8000`, so the API
  cannot be moved. With the API down the map renders but reads
  `0 SIMULATED VESSELS · feed unavailable`; with it up, 2,780.
- **LLM Response Judge** — a blocking API-key modal opens on load, and the
  welcome screen has nothing on it until something is evaluated. The shot
  worth having is demo mode, which needs the backend, whose
  `/api/demo-results` resolves `backend/app/api/../../data/` — a path that
  only exists because `docker-compose` bind-mounts `./data` there. The
  manifest's `prepare` step recreates that as a symlink. Reversible:
  `rm LLM-response-Judge/backend/data`.
- **AutoCareer** — the only project with no local checkout, so the harness
  clones it into `.checkouts/` (gitignored) on demand; the directory is the
  thing `prepare` creates, so the "does the root exist" guard has to run
  after it, not before. Only the dashboard is started. The Selenium applier
  sits behind endpoints this never calls, so photographing the project — all
  five views of it — applies to no jobs.
- **Website Cloner** — two views, and that is all it has. Its backend
  constructs an OpenAI client at import time, so it will not start without a
  key, not even to serve `/docs`; the attempt just photographs a browser
  error page, which is worse than an honest gap.
- **neo-mcp** — a stdio MCP server with a private repo. The first attempt
  photographed its PyPI page and got a Fastly bot challenge, correctly
  served to a headless browser and not something to work around. It is
  captured as terminal output instead: the installed package, and PyPI's
  own JSON API answering live.
- **Ai-Coding-Agent** — a CLI. Runs for real against the local Ollama
  provider chain with no API key set, which is why the cost line in the shot
  reads `$0.000000`. It resolves the model tag `qwen2.5-coder:latest`;
  `ollama cp qwen2.5-coder:3b qwen2.5-coder:latest` is enough to satisfy it
  without a 5 GB download.

## Known bug found while capturing

**BloombergTerminal's gateway rejects 100% of requests.**
`backend-node/src/server.js` builds its limiter as

```js
new RateLimiterRedis({ points: 100, duration: 15 * 60, redis: { host, port } })
```

`rate-limiter-flexible` expects `storeClient`, not `redis`. With `redis`,
`this.client` is never a client, every `consume()` throws
`this.client.multi is not a function`, and the `onRequest` hook's catch
returns `429 Too Many Requests` — for every route, including `/health`,
on the very first request. The frontend falls back to its simulated feed,
which is why every panel in the shot is badged `SIM` and the chart is empty.

Not fixed here: it is a different repo and was not part of this task. The
one-line change is `storeClient: new Redis({ host, port })`.
