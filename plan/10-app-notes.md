# 10 - Notes (Experience)

`src/components/apps/Notes.tsx` · `AppId: 'notes'` · window title `Experience`

---

## Purpose

The work history. Three roles, each with a summary, bullets, and a tech list.

Notes is the right container because the content is genuinely prose: a title, dates, and paragraphs. The obvious alternative was Calendar, which would force real dates into a grid and make a three-entry career look sparse. The other alternative was a fourth timeline component, which the current site already has and which nothing about a desktop metaphor improves.

The Notes list-plus-body layout also solves a real problem: three roles is too few for a timeline to feel substantial, but exactly right for a note list where three items reads as complete.

---

## Data contract

Imports `experience` from `@/data/experience`. Three entries, verbatim from the current `Experience.tsx`, ordered newest first.

| Field | Used where |
|---|---|
| `title`, `org` | note list row, body heading |
| `start`, `end` | note list metadata, body date line |
| `summary` | note list preview line, body lead paragraph |
| `bullets[]` | body list |
| `tech[]` | body chips |
| `location` | body metadata |

The `icon` field on the current entries (Lucide `Zap`, `Brain`, `Settings`) is dropped. Every note shows the same note glyph, which is what Notes does, and per-role icons were decorative rather than informative.

---

## DOM structure

```
<div class="flex h-full">

  <ul class="w-[260px] bg-panel-2 overflow-auto" role="listbox">
    <li role="option" aria-selected="true">        <- one per role
      <div class="font-medium">Full-Stack & AI Engineer</div>
      <div class="text-[--os-text-2]">
        <span>Oct 2025</span>
        <span class="truncate">NEO  ·  Remote</span>
      </div>
    </li>
    ...
  </ul>

  <article class="flex-1 overflow-auto px-9 py-7">
    <header>
      <h3>Full-Stack & AI Engineer</h3>
      <p class="text-[--os-text-2]">NEO  ·  Remote  ·  Oct 2025 to Present</p>
    </header>
    <p class="lead max-w-[64ch]">{summary}</p>
    <ul class="bullets max-w-[64ch]">  3 items  </ul>
    <ul class="chips">  tech  </ul>
  </article>

</div>
```

### Note list rows

Two lines: the role title, then a metadata line with the start date and `org · location`. Selected row is `--os-accent-soft` with a left accent bar, matching Notes.app. Rows are 56px tall.

Note the middle dot. The taste skill rations it to **one per line** in metadata strips. Each line here uses exactly one, so this is compliant rather than an exception.

### Body

- Heading `<h3>`, 20px semibold, `tracking-[-0.015em]`.
- Metadata line at `--os-text-2`, using `to` rather than an en-dash for the range: `Oct 2025 to Present`. The current source writes `Oct 2025 – Present` with an en-dash, which is banned. Change it on port.
- Lead paragraph is the `summary`, at `max-w-[64ch]`.
- Bullets are a real `<ul>` with a custom marker: a 3px square in `--os-text-3` rather than a disc, at 1.7 line height. Three bullets per role, so this stays well under the five-item threshold where the taste skill requires a different component.
- Tech chips at the bottom, using `primitives/Chip.tsx`, same as Finder.

**No timeline rail, no connector line, no node dots.** The note list already carries the chronology. Drawing a vertical line down the side would be decoration that organizes nothing, which the taste skill flags directly.

---

## Interaction

| Action | Result |
|---|---|
| Click a note | select, body swaps |
| `ArrowUp` / `ArrowDown` | move selection |
| `Home` / `End` | first and last note |
| Window opens | most recent role selected by default |

No search, no editing, no new-note affordance. Three notes do not need to be searched, and a non-functional compose button would violate the rule that every control does something.

---

## Motion spec

| Trigger | Behavior |
|---|---|
| Note selection | body cross-fades over `--dur-fast` with a 6px upward slide. Small enough to register as a swap, not a page transition. |
| Row hover | background `--os-panel-3`, instant |
| Selected row accent bar | `scaleY` from 0.4 to 1 over `--dur-fast`, `transformOrigin: center` |
| Bullets | no stagger. Three items appearing in sequence is slower than useful. |

Motivation: the body cross-fade communicates **state transition**, confirming the selection changed. That is the only animation in the app that is not hover feedback.

Under reduced motion, the body swaps instantly with no slide.

---

## Mobile behavior

In `AppSheet`, an iOS navigation stack rather than a split view:

- The sheet opens on the note **list**, full width, 68px rows.
- Tapping a note pushes the body view with a back control in the sheet header showing the title `Experience`.
- Back returns to the list with the previously selected row highlighted.
- Body padding drops to 20px horizontal, `max-w-full`.

This mirrors exactly what Notes.app does on iPhone, so the mobile branch is faithful rather than a degraded fallback.

---

## Accessibility contract

- The note list is `role="listbox"` with `role="option"` rows and `aria-selected`. It is a selection list.
- Roving `tabindex`: one row is tabbable, arrows move both focus and selection.
- The body is `<article>` with `aria-live="polite"` so a selection change is announced, since the visual link between list and body is not otherwise available.
- Heading levels are consistent: `<h3>` for the role, matching Finder's preview heading level, so the document outline across apps stays coherent.
- Bullets are a real `<ul>`. The custom marker is applied with `::marker` or a `list-style-image`, not by rendering a `<span>` square, so list semantics survive.
- Tech chips are a non-interactive `<ul>`.
- Date ranges are readable as text (`Oct 2025 to Present`), not as a glyph a screen reader will skip or mispronounce.
- Contrast: `--os-text-2` on `--os-panel-2` for the list metadata clears AA. `--os-text-3` is used only for the bullet marker, which is decoration.

---

## Done checklist

- [ ] All three roles render with their real summaries, bullets, and tech
- [ ] Most recent role is selected on open
- [ ] Arrow keys, `Home`, and `End` all move selection
- [ ] Body announces on selection change
- [ ] Date ranges use `to`, with zero en-dashes or em-dashes anywhere
- [ ] Exactly one middle dot per metadata line
- [ ] No timeline rail, connector, or node dots
- [ ] Bullets use a real `<ul>` with `::marker`, not span-based fake markers
- [ ] Body text is constrained to `max-w-[64ch]`
- [ ] No non-functional controls (no search field, no compose button)
- [ ] Mobile pushes a detail view with a working back control
- [ ] Per-role Lucide icons from the old component are not carried forward
