# 22 — Evidence pass

Status: implemented. Follows plan/21, which fixed what the site *looked*
like on arrival. This one fixes what it *claims*.

## The framing

A portfolio has one job: convince a stranger with about forty seconds that
you can do the work, then give them a way to act. Against that, content is
not equally persuasive. Roughly, strongest to weakest:

1. Shipped things people actually use
2. Code someone can read
3. Writing that shows judgment — why X over Y
4. Specific outcomes with numbers
5. Descriptions of what you built

Before this pass, essentially all content here sat at (5). Seven projects,
each described by what the product does, with no number anywhere. The
strongest evidence on the site was the site itself, and it was doing that
work silently.

## 1. No photo

Removed. Two reasons, and the second is the real one: developer portfolios
overwhelmingly don't carry one, and the actual About This Mac shows the
*machine*, never a person. The headshot was the least on-metaphor element
in the entire build.

Replaced with a monogram tile using the same construction as the menu bar
mark and the Dock icons, so the identity reads as one system. The
`profile.avatar` field is gone; `public/images/profile.avif` is now
orphaned and safe to delete.

## 2. A `metrics` field on projects

`Project` gains an optional `metrics: { label, value }[]`, rendered at the
top of Finder's detail pane — the position previously occupied by "Kind: AI
System" and "Tech: 4 technologies", both of which restate what the reader
can already see from the chips directly above.

**Every entry is deliberately empty.** These are Daksh's numbers to supply.
A fabricated metric is strictly worse than no metric: the one thing a
portfolio cannot survive is a reader catching a number that isn't true. The
pane renders the section only when present, so the UI stays clean until
real values exist.

## 3. Live GitHub stars

The GraphQL route already fetched every repo with its star count and threw
all but the totals away. It now also returns `repoStats`, derived from the
same response — no extra call, no extra rate-limit cost.

Finder matches a project's `github` URL to a repo name and shows the real
count. This matters more than it looks: it is the only claim on the page a
reader can verify without trusting the author. "AutoCareer — my
highest-starred repo" was an assertion; now it carries the number.

Degrades to nothing when the token is unset or GitHub is down. A project
with no badge looks like a project; a wrong number looks like a lie.

The module-level cache moved out of ActivityMonitor into `lib/github.ts`,
since two components each owning their own would mean two requests for one
response.

> **Operational note.** This needs `GITHUB_TOKEN` in the environment. It was
> unset during this work, so Activity Monitor was rendering its offline
> state and no stars appeared anywhere. Set it in `.env.local` locally and
> in the deployment's environment variables — the feature is invisible
> without it, and invisible in a way that looks like a design choice rather
> than a misconfiguration.

## 4. Writing

A new app, and the largest addition. Every other app here shows *what* was
built; none showed judgment about it.

Four posts, each adapted from a real decision already recorded in `plan/`:

| Post | Source | Why it earns its place |
|---|---|---|
| Your drag handler is why the demo stutters | plan/02 §1, §4 | The one performance rule, and the velocity→tilt trick that needs no reset |
| Every window had been square for weeks | plan/20 | The Tailwind v4 radius no-op — 59 utilities compiling to invalid CSS, silently |
| Approximating Liquid Glass without a displacement map | plan/20 | Why `feDisplacementMap` was rejected, and what carries the impression instead |
| I built an entire operating system and forgot to put my name on it | plan/21 | Product judgment rather than technique |

The rule for anything added later: **adapt from a real decision.** These
read as evidence precisely because they are specific about tradeoffs a
generic post cannot be specific about. A post that could have been written
by someone who hadn't built this thing is worth negative space here.

Master/detail on wide windows, drill-down on narrow, on the same
`@container` query the rest of the build uses.

**Reader view carries the full bodies**, not just titles. The Writing app is
a client component behind a shell that never server-renders, so Reader is
the only route by which any of this is crawlable — and long-form technical
prose is the highest-value text on the site for search.

## 5. Availability

`profile.availability` — status, label, detail — shown in the desktop hero
with a status dot and as its own row in About This Mac. Recruiters look for
this inside the first ten seconds and most portfolios make them guess.

Worded as an invitation ("Open to interesting problems") rather than a
job-seeking claim, because the latter is Daksh's to make. If he *is* open to
roles, saying so directly outperforms anything softer.

## 6. Projects ranked, not chronological

Order is now strongest-evidence-first, with AutoCareer leading because it is
the most-starred repo. A visitor who reads exactly one entry should hit the
best one.

## 7. Skills trimmed

Cut: Git, REST, SQL, CI/CD, JWT, OAuth2, JavaScript, Zod. 33 entries down to
23.

A skills list is read as a claim about level, and every obvious entry
dilutes the non-obvious one beside it. "Git" next to "Model Context
Protocol" does not add Git — it subtracts from MCP. JavaScript went because
TypeScript implies it.

---

## 8. An end-to-end smoke test, and the two bugs it found

`tools/e2e/smoke.mjs` drives a real Chrome against a production build: opens
all ten apps and asserts each mounts with content and closes again, checks
stacking and Mission Control, exercises Writing's narrow drill-down by
actually dragging a resize handle, verifies the no-JS Reader tree carries
the full post bodies, and renders the mobile branch. 45 checks, non-zero
exit on failure.

It exists because `tsc`, `eslint` and `next build` all passed clean on two
things that were badly broken:

**Terminal crashed the entire application.** The typewriter intro did
`setBuffer((b) => [...b, INTRO[i]])` and then `i++`. State updaters must be
pure, and React is free to invoke one more than once — when it did, the
second invocation ran after the increment and appended `undefined`. The next
render dereferenced `line.kind` and took down not just Terminal but the
Dock, the menu bar and every other window with it. Pre-existing, and only
reachable on a *first* Terminal open in a session (the intro is
`sessionStorage`-gated), which is exactly the path a first-time visitor
takes and the one manual testing never repeats.

Worth noting the structural gap that made it fatal: **there is no error
boundary between an app and the shell**, so any app that throws is a white
screen. Adding one is not in this pass, but it should be.

**Writing's narrow layout could never have worked.** `Sidebar` wrote its
width as an inline style, which no container-query utility can override, so
the post list stayed a 260px rail inside a 460px window. Fixed by giving
`Sidebar` a `fluid` prop that omits the inline width and lets the caller
size it with classes.

---

## Still open

- **`public/DakshJain_Resume.pdf` does not exist.** Every resume path 404s:
  the Preview app, the Dock and desktop icons, the menu bar's Download
  Resume, and the Reader view's link. Preview degrades correctly — the
  `<object>` falls back to its `MissingResume` empty state — so nothing
  looks broken, which is precisely why this has survived. Drop the file in
  `public/`.
- **No error boundary around app content.** See §8.

- **The metrics themselves.** The field exists and renders; the values are
  empty. This remains the single highest-leverage content change available,
  and it cannot be done without Daksh.
- **`GITHUB_TOKEN` in the deployment environment.** See §3.
- **Testimonials / recognition.** No social proof beyond stars. A line from
  a lead at NEO would outweigh a project.
