# 07 - Finder (Projects)

`src/components/apps/Finder.tsx` · `AppId: 'finder'` · window title `Projects`

The most important app. It is what a hiring manager opens first, and it is the app that auto-opens after boot.

---

## Purpose

Present the seven real projects in the shape of a macOS Finder window: source list on the left, item list in the middle, preview pane on the right. The metaphor earns its place here because Finder is genuinely the right UI for browsing a small collection of things that each have a thumbnail, a name, and metadata.

---

## Data contract

Imports `projects` from `@/data/projects` and nothing else. Seven entries, verbatim from the current `FeaturedProjects.tsx`.

| Field | Used where |
|---|---|
| `title` | list row, gallery caption, preview heading |
| `outcome` | list row secondary line, one sentence |
| `description` | preview pane body |
| `image` | list thumbnail, gallery tile, preview hero |
| `tech[]` | preview pane chips |
| `github?`, `live?` | preview pane buttons |
| `tags[]` | sidebar filtering |

All seven `image` paths already exist in `public/images/projects/`. This is what satisfies the taste skill's real-images requirement without generating anything: the screenshots are genuine product shots of real work.

---

## DOM structure

```
<div class="flex h-full">

  <nav class="sidebar w-[176px] bg-panel-2">      <- source list
    <h3>Favorites</h3>
    <button data-selected>  All Projects   7  </button>
    <button>                AI Systems     6  </button>
    <button>                Web            1  </button>
    <button>                Built with NEO 2  </button>
  </nav>

  <div class="flex-1 flex flex-col">
    <div class="toolbar">                          <- 40px, in the window titlebar row
      <ViewToggle />                               <- icon / list / gallery
      <SearchField />
    </div>
    <ul class="items overflow-auto">  ...  </ul>
  </div>

  <aside class="preview w-[280px] bg-panel-2">     <- only in list and icon views
     hero image
     title
     outcome
     tech chips
     [GitHub]  [Live]
     metadata rows
  </aside>

</div>
```

Below 720px window width, the preview pane collapses and selecting an item pushes it into the item column as a detail view with a back control. The sidebar collapses below 560px into a toolbar dropdown. Both are handled with a container query on the window body, not a viewport media query, because a window can be narrow on a wide screen.

### Sidebar counts

| Source | Filter | Count |
|---|---|---|
| All Projects | none | 7 |
| AI Systems | `tags` includes `ai` | 6 |
| Web | `tags` includes `web` | 1 |
| Built with NEO | `tags` includes `neo` | 2 |

Counts render live from the data rather than being hardcoded, so adding a project cannot desync them.

`Web` holding a single item is honest and fine. Do not pad it.

### View modes

| Mode | Layout |
|---|---|
| **List** (default) | rows: 32px thumbnail, title, `outcome` in `--os-text-2`, tech count on the right. Selected row is `--os-accent-soft`. |
| **Icon** | 4-column grid of 96px thumbnails with labels below |
| **Gallery** | large hero image of the selected item across the top, filmstrip of the rest below. Preview pane hides in this mode, since the hero replaces it. |

Three modes rather than one because the taste skill flags a plain `<ul>` with `divide-y` as the lazy default for lists over five items. Here the mode toggle is also faithful to the real Finder, so the requirement and the metaphor agree.

### Preview pane contents

Hero image, then title as `<h3>`, then `outcome`, then `description` at `max-w-[46ch]`, then tech chips, then the buttons, then a small metadata block:

```
Kind      AI System
Tech      4 technologies
Source    github.com/Dakshjain1604/...
```

`Kind` derives from `tags`. No invented dates, no invented file sizes, no fake `Created` or `Modified` rows. Faking Finder metadata is exactly the kind of detail that reads as charming for one second and as fabricated for the rest of the visit.

---

## Interaction

| Action | Result |
|---|---|
| Single click a row | select, preview updates |
| Double click a row | open `live` in a new tab, or `github` if there is no live URL |
| `ArrowUp` / `ArrowDown` | move selection |
| `Enter` | same as double click |
| `Cmd/Ctrl + 1 / 2 / 3` | switch to icon / list / gallery |
| Type in search | filters on `title`, `tech`, and `description`, case-insensitive |
| No results | `EmptyState` with the query echoed and a Clear button |

The current site has a cross-component skill filter, where clicking a skill scrolls to projects and filters them. That mechanic is **dropped**. It required prop-drilling through `page.tsx` and its replacement is better: the search field does the same job locally, and `System Settings` links a skill to a filtered Finder view by calling `open('finder')` with a preset query.

---

## Motion spec

| Trigger | Behavior |
|---|---|
| Selection change | preview cross-fades over `--dur-fast`. The image swaps with opacity only, never a slide, because sliding images in a file browser reads as a carousel. |
| View mode change | Motion `layout` on the item grid, spring `{ stiffness: 300, damping: 32 }`. Items travel to their new positions rather than the list re-rendering. This is the one genuinely satisfying moment in the app. |
| Row hover | background `--os-panel-3`, no transition, matching native list behavior |
| Search filter | items animate out with `layout`, no stagger. Stagger on filtering feels slow. |
| Gallery hero change | opacity cross-fade, `--dur-base` |

Motivation: the view-mode transition communicates **state transition**, showing that the same seven items are being re-arranged rather than replaced. Everything else is feedback.

Under reduced motion, all of the above become instant.

---

## Mobile behavior

Rendered inside `AppSheet`. Layout collapses to a single column:

- Sidebar becomes a horizontal scroll-snap row of filter chips at the top.
- View toggle is removed; mobile is list-only. Icon and gallery views on a 390px screen are worse than the list.
- Tapping a row pushes a full-screen detail view with a back button in the sheet header. Standard iOS navigation-stack behavior.
- Thumbnails drop to 44px, rows to 60px tall.

---

## Accessibility contract

- Sidebar is `<nav>` with `<button>` items, `aria-pressed` on the active source.
- Item list is `role="listbox"` with `role="option"` rows and `aria-selected`. This is a selection list, not a menu.
- Roving `tabindex`: one row is tabbable, arrow keys move both selection and focus.
- Preview pane is `aria-live="polite"` so selection changes are announced, since the visual link between the list and the pane is not available to a screen reader.
- Every image has real `alt` text: `{title} screenshot`. Never `alt=""`, never `alt="image"`.
- External links carry `rel="noopener noreferrer"` and their accessible name ends in `opens in a new tab`.
- Search field has a real `<label>`, visually hidden.
- Tech chips are plain text in a `<ul>`, not interactive, so they are not announced as buttons.
- Contrast: `outcome` uses `--os-text-2` on `--os-panel`, which passes AA. `--os-text-3` is not used for any content in this app.

---

## Done checklist

- [ ] All 7 projects render with their real screenshots and no broken image paths
- [ ] Sidebar counts are computed from the data, not hardcoded
- [ ] All three view modes work and `Cmd+1/2/3` switch between them
- [ ] View-mode change animates items to new positions via `layout`, rather than re-mounting them
- [ ] Arrow keys move selection, `Enter` opens the correct URL, preferring `live` over `github`
- [ ] Search filters on title, tech, and description, and the empty state shows the query with a Clear action
- [ ] Preview pane contains no invented metadata (no fake dates, sizes, or modified timestamps)
- [ ] Preview collapses correctly below 720px window width using a container query
- [ ] Sidebar collapses correctly below 560px window width
- [ ] Every image has descriptive `alt` text
- [ ] `role="listbox"` / `role="option"` with working roving tabindex
- [ ] Preview pane announces on selection change
- [ ] Mobile sheet is list-only with a working push-detail navigation and back control
