# 12 - Activity Monitor (GitHub)

`src/components/apps/ActivityMonitor.tsx` · `AppId: 'activity'` · window title `Activity Monitor`

---

## Purpose

Live GitHub telemetry. Contributions, repositories, language breakdown.

This is the only app whose content comes from the network, which makes it the only app that needs real loading, empty, and error states. Activity Monitor is the right container because it is macOS's live-data window, and because the data genuinely is activity over time.

---

## The `MOCK_DATA` problem (fix this first)

`src/app/api/github/route.ts` currently returns a `MOCK_DATA` object whenever `GITHUB_TOKEN` is unset **or** the upstream request fails. That object contains invented values:

```
contributions.total: 1248
stats: { repos: 38, stars: 124, forks: 42 }
pinned: transactly_frontend 32 stars / DocuMind-Ai 45 stars / SOH_Ships 24 stars
```

Two things are wrong with this. The failure mode presents fabricated numbers as real data, which is the most serious content problem in the codebase. And because the route never fails, the existing `GitHubStats.tsx` "telemetry offline" state is unreachable dead code that has never once rendered.

### The fix

```ts
// no token configured, or upstream failed
return NextResponse.json({ error: true, reason: 'unavailable' }, { status: 200 })
```

Status 200 with an `error` flag rather than a 5xx, so the client treats it as a known state rather than a thrown request. Keep `export const revalidate = 3600`. Keep the `GITHUB_TOKEN` and `GITHUB_USERNAME` env handling exactly as it is.

Delete the entire `MOCK_DATA` constant. Do not replace it with a smaller mock.

---

## Data contract

| Source | Used for |
|---|---|
| `GET /api/github` | everything in this app |
| `data/socials.ts` | the `View on GitHub` link |

Response shape when healthy:

```ts
{
  contributions: { total: number; weeks: { days: { count: number; date: string }[] }[] }
  stats: { repos: number; stars: number; forks: number }
  languages: { name: string; count: number }[]
  pinned: { name: string; description: string; stars: number; forks: number; url: string }[]
}
```

Fetched once on first open with a plain `useEffect`, cached in a module-scope variable so reopening the window does not refetch. No TanStack Query. One endpoint, one consumer, no invalidation requirements.

---

## DOM structure

```
<div class="h-full flex flex-col">

  <div role="tablist" class="tabs">
    <button role="tab" aria-selected="true">Contributions</button>
    <button role="tab">Repositories</button>
    <button role="tab">Languages</button>
  </div>

  <div role="tabpanel" class="flex-1 overflow-auto p-5">
    ... per tab ...
  </div>

  <footer class="statusbar">
    <span>{username}</span>
    <a href={socials.github}>View on GitHub</a>
  </footer>

</div>
```

### Contributions tab

A contribution heatmap: 53 columns of 7 cells, 10px each with 3px gaps. Five intensity steps from `--os-panel-3` through `--os-accent` at increasing opacity. Real GitHub data, so no invented density.

Above it, three figures in Geist Mono with `tabular-nums`: total contributions, current streak, longest streak. All computed from the returned `weeks` array, none hardcoded.

Cell hover shows a tooltip: `4 contributions on 12 Mar`. Singular when the count is 1.

The heatmap is the one visual in the app and it earns its place: it is the standard representation of this exact data, so it is legible without explanation.

### Repositories tab

The pinned repositories as rows: name, description, then star and fork counts with Phosphor glyphs, right-aligned, tabular-nums. Each row links to the repo.

Whatever the API returns is what renders. If the token is configured, these are real pinned repos with real counts.

### Languages tab

A horizontal proportional bar (one segment per language, width by share) plus a legend listing each language with its repo count and percentage.

**This is the one bar allowed in the build**, and it is worth being explicit about why, since `11-app-settings.md` bans bars outright. The difference is that this is a real proportion of a real total, where the bar encodes the data and no separate track exists. The banned pattern is a filled track representing an invented self-assessment. Here there is no track, only segments summing to 100%.

Colors: five steps of `--os-accent` opacity plus `--os-text-3` for `Other`. Not five different hues, which would break the one-accent rule.

---

## States

All three ship. This is the app that justifies `primitives/EmptyState.tsx`.

### Loading

A skeleton matching the final layout: the heatmap grid rendered as flat `--os-panel-3` cells, three shimmer blocks where the figures go. Not a spinner. The taste skill requires skeletons shaped like the content they replace.

### Error / unavailable

`EmptyState` with a Phosphor `CloudSlash` glyph and:

```
GitHub data unavailable
The connection failed. Repository activity is on GitHub.
[ View on GitHub ]
```

Direct, no `Oops`, no exclamation mark, no passive voice. This state now actually renders when the token is missing, which was not previously true.

### Empty

If the API succeeds but returns zero contributions, show the same component with `No contributions in the last year.` Unlikely, but the branch costs four lines and prevents a bare zero from reading as a bug.

---

## Motion spec

| Trigger | Behavior |
|---|---|
| Tab change | panel cross-fades over `--dur-fast`, active tab underline slides via Motion `layoutId` |
| Heatmap first paint | cells fade in with a 4ms per-column stagger, roughly 210ms total. Runs **once**, on first data arrival, never on tab return. |
| Language bar first paint | segments grow from `scaleX(0)` with `transformOrigin: left`, 500ms, `--ease-os`, staggered 60ms |
| Skeleton shimmer | a single sweeping gradient, 1.4s, `--ease-os` |
| Cell hover tooltip | opacity only, no delay |

Motivation: the heatmap stagger and the bar growth both communicate **storytelling**, revealing quantity in a way that lets the eye read the shape before the numbers. Both run once. Neither loops. The skeleton shimmer is the only loop in the app and it stops when data arrives.

Under reduced motion: no stagger, no bar growth, no shimmer. The skeleton becomes a static block and the data appears at once.

---

## Mobile behavior

In `AppSheet`:

- Tabs become a segmented control across the full width, which is the iOS idiom.
- The heatmap scrolls horizontally inside its own `overflow-x: auto` container with the year label pinned. It is not squeezed, because a 53-column grid at 390px produces unreadable 4px cells.
- Repository rows stack description below name.
- The language bar is unchanged; it is already responsive.

---

## Accessibility contract

- Real tab semantics: `role="tablist"`, `role="tab"` with `aria-selected` and `aria-controls`, `role="tabpanel"` with `aria-labelledby`. Arrow keys move between tabs, per the ARIA tabs pattern.
- The heatmap is `role="img"` with an `aria-label` summarizing it: `1,248 contributions in the last year`. Rendering 371 individually announced cells is hostile; one summary is the useful equivalent.
- Individual cells are `aria-hidden` with their data available on hover and focus for sighted users.
- The language bar is `role="img"` with an `aria-label` listing each language and share. The legend below is real text, so the information exists in two accessible forms.
- Numbers use `tabular-nums` so they do not shift as values update.
- Loading state carries `aria-busy="true"` on the panel.
- The error state is `role="status"`, so it is announced when it replaces the skeleton.
- Contrast: heatmap intensity steps are decorative, since the legend and `aria-label` carry the meaning, so the lowest step may sit below AA. Every text figure uses `--os-text`.

---

## Done checklist

- [ ] `MOCK_DATA` is fully deleted from `src/app/api/github/route.ts`
- [ ] The route returns `{ error: true }` when `GITHUB_TOKEN` is unset, and the error state actually renders
- [ ] `revalidate = 3600` and the env handling are unchanged
- [ ] Every number displayed comes from the API, with zero hardcoded values anywhere in the component
- [ ] Streak figures are computed from the returned weeks array
- [ ] Data is fetched once and cached at module scope, so reopening does not refetch
- [ ] Loading state is a layout-matching skeleton, not a spinner
- [ ] Error copy is direct, with no `Oops` and no exclamation mark
- [ ] The language bar has no background track, and uses accent opacity steps rather than five hues
- [ ] Heatmap and bar entrance animations run once and never loop
- [ ] Full ARIA tabs pattern including arrow-key navigation
- [ ] Heatmap exposes one summary `aria-label` rather than 371 announced cells
- [ ] On mobile the heatmap scrolls horizontally rather than compressing
- [ ] The page body never scrolls horizontally because of this app
