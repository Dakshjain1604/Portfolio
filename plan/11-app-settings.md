# 11 - System Settings (Skills)

`src/components/apps/SystemSettings.tsx` · `AppId: 'settings'` · window title `Skills`

---

## Purpose

The capability list. Five groups, roughly thirty skills.

System Settings is the right container because its native shape is exactly a category sidebar plus a pane of labeled rows, which is what a grouped skill list is. It also solves the problem that the current `Skills.tsx` has: a bento grid where one card spans full width and the rest are equal, which the taste skill flags twice (uneven bento rhythm, and equal-card feature rows).

The strong temptation here is to render proficiency bars or percentages. **Do not.** See section 5.

---

## Data contract

Imports `skills` from `@/data/skills`. Five groups, verbatim from the current `Skills.tsx`.

| Group id | Label | Count |
|---|---|---|
| `ai` | Agentic AI & GenAI | 8 |
| `backend` | Backend | 6 |
| `frontend` | Frontend | 4 |
| `languages` | Languages | 5 |
| `cloud` | Cloud & Tools | 10 |

`ai` is first in the sidebar and is the default selection, because it is the specialization and it is what the whole portfolio is positioned around.

---

## DOM structure

```
<div class="flex h-full">

  <nav class="w-[196px] bg-panel-2 p-2" aria-label="Skill categories">
    <button aria-pressed="true">
      <Squircle tint={...}><Sparkle /></Squircle>
      Agentic AI & GenAI
    </button>
    ... 5 total ...
  </nav>

  <div class="flex-1 overflow-auto px-6 py-5">
    <h3>Agentic AI & GenAI</h3>
    <ul class="rounded-[--r-card] bg-panel-2 divide-y divide-[--os-divider]">
      <li class="flex items-center gap-3 h-11 px-3">
        <img src="https://cdn.simpleicons.org/langchain/98989D" width="18" height="18" alt="" />
        <span>LangChain & LangGraph</span>
      </li>
      ...
    </ul>
  </div>

</div>
```

Sidebar items carry a small squircle with a Phosphor glyph, matching how System Settings renders its categories. Selected item is `--os-accent-soft` with `--os-text`.

### The grouped-rows panel

Rows sit inside one rounded panel with dividers **between** rows only, never a border above the first or below the last. This is the macOS grouped-list convention and it is also the compliant reading of the taste skill's rule: it bans `border-t` **and** `border-b` on every row, and requires that dividers be sparse. One divider between adjacent rows inside a single contained group is a real organizing structure, not decoration.

The ten-item `Cloud & Tools` group splits into two subgroups with a small caption each (`Infrastructure`, `Developer tools`) rather than running as a ten-row list. The taste skill requires grouping into two or three chunks past that length.

### Brand logos

Per the taste skill's logo rule, real SVG logos rather than hand-rolled marks or plain text:

```
https://cdn.simpleicons.org/{slug}/98989D
```

Rendered at 18px with explicit `width` and `height` so nothing shifts on load, `loading="lazy"`, and `alt=""` because the skill name sits directly beside it and duplicating it would make a screen reader say everything twice.

Skills with no Simple Icons entry get a Phosphor glyph in `--os-text-2` instead:

| Skill | Glyph |
|---|---|
| Autonomous Agent Workflows | `TreeStructure` |
| Multi-Agent Orchestration | `GraphIcon` |
| Model Context Protocol (MCP) | `Plugs` |
| Production RAG & Vector Search | `MagnifyingGlass` |
| LLM Tool & Function Calling | `Function` |
| Prompt Engineering & Evals | `Ruler` |
| REST | `ArrowsLeftRight` |
| CI/CD | `ArrowsClockwise` |

One consistent stroke weight across every Phosphor glyph in the app. Mixing weights is one of the fastest ways to make an icon set look assembled rather than designed.

If `cdn.simpleicons.org` is unreachable, the `<img>` fails silently to whitespace at a fixed 18px box, so the row never reflows. Acceptable degradation; no fallback logic needed.

---

## 5. No proficiency indicators

No percentage, no five-dot rating, no `Advanced` / `Intermediate` label, no bar.

Three independent reasons, all of which point the same way:

1. **They are invented data.** Nothing in the source material assigns a number to any skill. Generating one is fabrication, and the taste skill bans fake-precise values outright.
2. **The taste skill bans filled-track progress bars specifically**, as dashboard clutter on a non-dashboard page.
3. **They are not credible.** A self-assigned 90% in TypeScript communicates nothing to an engineer reading it, and slightly damages the page by inviting the reader to disagree.

The list itself is the claim. The projects and the experience are the evidence. That division of labor is the correct one.

---

## Interaction

| Action | Result |
|---|---|
| Click a category | switch pane |
| `ArrowUp` / `ArrowDown` in sidebar | move category |
| Click a skill row | opens Finder with that skill preset as the search query, if any project's `tech[]` contains it. Inert otherwise. |

That last one replaces the current cross-component skill filter, which prop-drills `selectedSkill` and `onSelectSkill` through `page.tsx` into two components and smooth-scrolls between sections. Here it is one call to `useOS.getState().open('finder')` with a query, and it works from any window position.

Rows with no matching project are not interactive at all: rendered as plain `<li>`, not a disabled button. A control that looks clickable and does nothing is worse than plain text.

---

## Motion spec

| Trigger | Behavior |
|---|---|
| Category switch | pane cross-fades over `--dur-fast` with a 4px upward slide |
| Row hover (interactive rows only) | background `--os-panel-3`, instant |
| Sidebar selection | `--os-accent-soft` background fades in over `--dur-fast` |
| Logo load | no fade. Images popping in after a fade reads as slow. |

No stagger on the rows. Thirty rows cascading in would take most of a second and communicate nothing.

Under reduced motion, the pane swaps instantly.

---

## Mobile behavior

In `AppSheet`, an iOS Settings navigation stack:

- The sheet opens on the **category list**, full width, 52px rows with a chevron.
- Tapping a category pushes its skill pane with a back control.
- Rows go to 48px for touch.
- The grouped-panel style is unchanged; it is already the iOS Settings idiom.

---

## Accessibility contract

- Sidebar is `<nav>` with `<button>` items and `aria-pressed`, plus `aria-controls` pointing at the pane.
- The pane has `aria-live="polite"` so a category change is announced.
- Skill rows are `<li>` inside a `<ul>`. Interactive rows wrap their content in a `<button>`; non-interactive rows do not.
- Brand logos use `alt=""` and are decorative, since the adjacent text carries the name.
- Phosphor glyphs are `aria-hidden`.
- Group captions inside `Cloud & Tools` are real `<h4>` elements, so the subgrouping survives without visual layout.
- Contrast: skill names are `--os-text` on `--os-panel-2`. Captions use `--os-text-2`, which clears AA. `--os-text-3` is not used in this app.

---

## Done checklist

- [ ] All five groups render with their exact skills from the audit, nothing added or renamed
- [ ] `Agentic AI & GenAI` is first and selected by default
- [ ] Brand logos load from `cdn.simpleicons.org` at a fixed 18px box with no layout shift
- [ ] Skills without a Simple Icons slug show a Phosphor glyph at one consistent stroke weight
- [ ] `Cloud & Tools` is split into two captioned subgroups, not a ten-row list
- [ ] Dividers appear between rows only, never above the first or below the last
- [ ] **Zero** proficiency bars, percentages, dot ratings, or level labels anywhere
- [ ] Rows with a matching project open Finder with that search query preset
- [ ] Rows without a matching project are plain `<li>`, not disabled buttons
- [ ] The old `page.tsx` skill-filter prop drilling is not reproduced in any form
- [ ] Pane announces on category change
- [ ] Mobile pushes a detail pane with a working back control
