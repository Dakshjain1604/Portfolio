# 09 - About This Mac (Profile)

`src/components/apps/AboutThisMac.tsx` · `AppId: 'about'` · window title `About This Mac`

---

## Purpose

The identity app. Who Daksh is, what he does, where he works. It is what the `README.txt` desktop icon opens and what the `dj` menu opens, so it is the second most-reached app after Finder.

The mapping is exact rather than clever: macOS's About This Mac window is a portrait, a name, a model line, and a specification table. That is precisely the shape of a professional profile.

---

## Data contract

Imports `profile` from `@/data/profile` and `socials` from `@/data/socials`.

| Field | Used where |
|---|---|
| `avatar` | the portrait, `/images/profile.avif`, exists today |
| `name`, `role` | the heading block |
| `employer` | the role line, linked to `heyneo.com` |
| `specs[]` | the specification table |
| `bio[]` | the three paragraphs |
| `pillars[]` | the focus chips |

---

## DOM structure

```
<article class="p-8">

  <div class="flex gap-7 items-start">            <- the About This Mac header
    <img src={avatar} class="w-[120px] rounded-full" />
    <div>
      <h2 class="text-[26px] font-semibold tracking-[-0.02em]">Daksh Jain</h2>
      <p class="text-[--os-text-2]">Full-Stack & AI Engineer at <a>NEO</a></p>
      <ul class="pillars">  4 chips  </ul>
    </div>
  </div>

  <dl class="specs">                              <- the spec table
    <div><dt>Role</dt>     <dd>Full-Stack & AI Engineer</dd></div>
    <div><dt>Company</dt>  <dd>NEO</dd></div>
    <div><dt>Location</dt> <dd>Jaipur, India</dd></div>
    <div><dt>Focus</dt>    <dd>Agent orchestration, MCP, RAG</dd></div>
    <div><dt>Since</dt>    <dd>Oct 2025</dd></div>
  </dl>

  <div class="prose max-w-[62ch]">  3 paragraphs  </div>

  <footer class="flex gap-2">
    <button>System Report</button>                <- opens 'activity'
    <button>Skills</button>                       <- opens 'settings'
    <a href={socials.resume}>Resume</a>           <- opens 'preview'
  </footer>

</article>
```

### The spec table

`<dl>` with `dt` right-aligned in `--os-text-2` at a fixed 92px column, `dd` left-aligned in `--os-text`. This is the exact macOS layout and it also happens to be the correct semantic element, which is a pleasant coincidence rather than a compromise.

**No hairline under every row.** The taste skill flags `border-b` on every row of a spec table as the laziest possible layout. Rows are separated by spacing alone, 8px apart. Five rows do not need dividers to be scannable.

**No invented specs.** No "Memory: 16 GB of coffee", no "Graphics: Tailwind CSS", no "Serial Number". The joke version of this app exists on a hundred portfolios and it undercuts the content. Five real rows, all true.

### The bio

Three paragraphs, verbatim from the current `AboutPage.tsx`, at `max-w-[62ch]` with `line-height: 1.65`. Emphasis is carried by real `<strong>` elements, not by a color change, matching how the source renders it today.

The current version also has a three-metric strip (`3 Mos` / Intern to Full-Time, `MCP Protocol` / Multi-Tenant Servers, `Production` / RAG & AI Agents). It is **dropped**. Two of the three are not metrics, they are labels formatted to look like metrics, which is the fake-precision pattern the taste skill flags. The same facts are already carried by the spec table and the bio, stated plainly.

### The pillars

Four chips using `primitives/Chip.tsx`: Autonomous AI Agents, Secure MCP Systems, Multi-Agent Orchestration, Production RAG Pipelines. Neutral surface, no accent color, since they are labels rather than state.

---

## Motion spec

Minimal by design. This is a reading app.

| Trigger | Behavior |
|---|---|
| Window open | the standard genie from `02-window-manager.md`. Nothing additional. |
| Portrait | no float, no pulse, no ring animation. A slowly breathing avatar is a tell. |
| Footer buttons | background lift on hover over `--dur-fast`, `scale(0.98)` on press |
| Bio paragraphs | no scroll reveal. The window is small enough that all three are visible at once, so revealing them on scroll would animate nothing. |

Motivation check: there is no animation here that is not direct feedback, and that is the correct answer for this app. Adding entrance staggers would fail the taste skill's "motion must be motivated" rule.

---

## Mobile behavior

In `AppSheet`, single column:

- Portrait centers above the name block, dropping to 88px.
- Pillars wrap to two rows.
- The spec table keeps its `<dl>` structure but switches to stacked pairs: `dt` above `dd`, left-aligned, 12px apart. A 92px label column on a 390px screen leaves too little for the values.
- Bio paragraphs are unchanged, at `max-w-full` with the same line height.
- Footer buttons become full-width, stacked, 44px tall.

---

## Accessibility contract

- Root is `<article>`. Name is `<h2>`, the window title provides the `<h1>`-level context through `aria-label` on the window region.
- The portrait has real `alt`: `Daksh Jain`. Not `alt="profile"`, not `alt=""`, because it is a meaningful image of a person.
- The spec table is a real `<dl>` with `<dt>`/`<dd>` pairs, so the label-to-value relationship survives without visual layout.
- The NEO link has an accessible name that includes the destination, and carries `rel="noopener noreferrer"` with `target="_blank"`.
- `System Report` and `Skills` are `<button>` because they act within the page. `Resume` is an `<a>` because it has a URL. Do not make links out of buttons or buttons out of links.
- Bio text is `--os-text` on `--os-panel`. `--os-text-2` is used only for labels and the role line, both of which clear AA.
- Pillar chips are a plain `<ul>`, non-interactive, so they are not announced as controls.

---

## Done checklist

- [ ] All three bio paragraphs render verbatim with correct `<strong>` emphasis
- [ ] The spec table has five real rows and no invented ones
- [ ] No hairline border under every spec row
- [ ] The fake-metric strip from the old `AboutPage.tsx` is not carried forward
- [ ] The portrait loads from `/images/profile.avif` with real alt text
- [ ] `System Report` opens the Activity Monitor window
- [ ] `Skills` opens the System Settings window
- [ ] `Resume` opens the Preview window
- [ ] Bio is constrained to `max-w-[62ch]`
- [ ] The `<dl>` stacks correctly on mobile without a fixed label column
- [ ] No looping animation anywhere in the app
- [ ] Zero em-dashes in any string
