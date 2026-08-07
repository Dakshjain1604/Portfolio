# 17 - Reader view

`src/components/reader/ReaderView.tsx` · a **server component**

The piece that makes the whole concept viable rather than a clever demo that no recruiter ever finds.

---

## Purpose

Three jobs, served by one component:

1. **SEO.** A client-rendered OS simulation is invisible to crawlers. `ReaderView` is server-rendered, always present in the DOM, and contains every piece of content on the site as real semantic HTML.
2. **Accessibility.** It is the complete non-interactive equivalent of the desktop. A screen reader user, a keyboard-only user, or anyone who finds the desktop metaphor tiring gets the entire portfolio as a clean document.
3. **The recruiter escape hatch.** Someone with thirty seconds does not want to drive an operating system. One click in the menu bar gives them a scrollable resume.

It must stand on its own as a genuinely good page, because for a meaningful share of visitors it is the only page they will see. It is not a degraded fallback.

---

## The architecture

```tsx
// src/app/page.tsx  -- SERVER COMPONENT
export default function Page() {
  return (
    <>
      <ReaderView />     {/* server-rendered. always in the DOM. */}
      <DesktopShell />   {/* 'use client'. fixed inset-0. paints over it. */}
    </>
  )
}
```

| State | `ReaderView` | `DesktopShell` |
|---|---|---|
| Default (`mode` is `desktop`) | in the DOM, visually covered, `inert` + `aria-hidden` | mounted, opaque, interactive |
| Reader (`mode` is `reader`) | visible, interactive, `inert` removed | unmounted except for a slim return bar |
| No JavaScript | **fully visible and interactive** | never mounts |
| Crawler | fully parsed | ignored |

### Why this shape and not the alternatives

- **A separate `/resume` route** would duplicate content across two files, which is exactly the drift problem `src/data/` exists to solve, and it would leave `/` with no server-rendered content.
- **Rendering `ReaderView` only when toggled** would mean the default page has no content for crawlers, which is the entire problem.
- **`display: none` instead of `inert`** would hide content from crawlers too, since Google does index hidden content but discounts it heavily. `DesktopShell` covering it with an opaque fixed layer means the content is genuinely rendered, genuinely in the layout, and simply painted over.

The `inert` attribute (with `aria-hidden`) is what keeps exactly one tree in the tab order at a time. Without it, tabbing through the desktop would eventually walk into the invisible document underneath, which is the classic bug in this pattern.

### The no-JS path

With JavaScript disabled, `DesktopShell` never mounts, so `ReaderView` is simply the page. No `<noscript>` block is needed, no special handling, no second implementation. This falls out of the architecture rather than being built.

---

## Data contract

Imports every module in `src/data/`. That is the point: it reads the exact same content the apps read, so there is no second copy of any string on the site.

| Module | Section |
|---|---|
| `profile` | header, about |
| `experience` | experience |
| `projects` | projects |
| `skills` | skills |
| `socials` | header links, contact |

---

## DOM structure

```html
<div id="reader" class="reader" inert aria-hidden="true">
  <a href="#main" class="skip-link">Skip to content</a>

  <article id="main">
    <header>
      <h1>Daksh Jain</h1>
      <p class="role">Full-Stack &amp; AI Engineer at <a href="https://heyneo.com">NEO</a></p>
      <p class="tagline">...</p>
      <nav aria-label="Profile links"> email · GitHub · LinkedIn · Resume </nav>
    </header>

    <section aria-labelledby="about-h">
      <h2 id="about-h">About</h2>
      3 paragraphs
    </section>

    <section aria-labelledby="exp-h">
      <h2 id="exp-h">Experience</h2>
      <article> per role: h3 title, org, dates, summary, ul bullets, tech </article>
    </section>

    <section aria-labelledby="proj-h">
      <h2 id="proj-h">Projects</h2>
      <article> per project: h3 title, img, outcome, description, tech, links </article>
    </section>

    <section aria-labelledby="skills-h">
      <h2 id="skills-h">Skills</h2>
      per group: h3 label, ul of skills
    </section>

    <section aria-labelledby="contact-h">
      <h2 id="contact-h">Contact</h2>
      email, phone, location, socials
    </section>
  </article>
</div>
```

One `<h1>`. Five `<h2>` sections. `<h3>` for individual roles and projects. A real, unbroken heading outline, which is what both crawlers and screen readers navigate by.

Project images render through `next/image` with real `alt` text. They are the only images in the reader and they matter for image search.

---

## Visual design

This is a document, not a desktop. It does **not** reuse window chrome, glass, or squircles.

| Property | Value |
|---|---|
| Background | `--os-void` |
| Text | `--os-text`, secondary `--os-text-2` |
| Measure | `max-w-[68ch]`, centered, `px-6` |
| Body | Geist Sans, 16px, `line-height: 1.7` |
| `h1` | 40px, `font-weight: 600`, `tracking-[-0.03em]` |
| `h2` | 13px, uppercase, `tracking-[0.14em]`, `--os-text-2`, with a hairline above |
| `h3` | 18px, `font-weight: 500` |
| Section rhythm | 64px between sections, 32px between entries |
| Links | underlined with `text-underline-offset: 3px`. Underlined, not accent-colored, because this is a document. |

Theme is locked dark, matching the desktop. The taste skill's page-theme-lock rule applies across the whole site, and flipping to a light document mid-experience would read as walking into a different website.

The `h2` treatment is small-caps with tracking, which is the eyebrow pattern the taste skill rations. Here they are **section headings**, not eyebrows above headings, and there are exactly five of them in a long document. That is a document's table of contents, not decoration.

---

## The toggle

### Entering

| Path | Location |
|---|---|
| `Reader view` button | menu bar, right cluster (`03-shell-menubar.md`) |
| `View > Reader view` | menu bar (`03-shell-menubar.md`) |
| `dj > Reader view` | menu bar (`03-shell-menubar.md`) |
| Desktop right-click | context menu (`05-shell-desktop.md`) |
| Status bar control | mobile (`16-mobile-springboard.md`) |

All call `setMode('reader')`.

### Returning

A slim fixed bar at the top, 36px, `os-glass`:

```
dj                          [ Back to desktop ]
```

That is the only chrome in reader mode. Not a full menu bar, which would undercut the point of a document view.

### Side effects on entering

- `document.body.dataset.mode = 'reader'`, which flips `body` from `overflow: hidden` to `overflow: auto` via the rule in `01-foundation.md`. The desktop does not scroll; the document does.
- `inert` and `aria-hidden` are removed from `#reader`.
- Focus moves to the skip link.
- `scroll-behavior: smooth` is applied locally to `#reader`, not globally on `html`.
- Persist the choice in `localStorage`. Someone who chose the document once probably wants it again, and overriding that preference on every visit is a small hostility.

---

## Motion spec

Deliberately the quietest surface in the build. It is a document, and a document that animates while you read it is worse than one that does not.

| Trigger | Behavior |
|---|---|
| Desktop to reader | cross-fade over `--dur-slow`. No scale, no slide, no wipe. The two trees occupy the same space, so anything more reads as a glitch rather than a transition. |
| Reader to desktop | the same, reversed |
| Scroll | **no scroll-reveal, no stagger, no fade-up on any section.** This is the one place the taste skill's usual entry-animation guidance is overridden: a recruiter scanning a resume should never wait for a paragraph to fade in. |
| Link hover | underline thickens from 1px to 2px over `--dur-fast` |
| Skip link focus | slides down into view from `translateY(-100%)`, `--dur-fast` |
| Return bar | static. No hide-on-scroll, which costs a scroll listener and hides the only way out. |

Motivation: the mode cross-fade is a **state transition** confirming the switch happened. Everything else is hover feedback. There is no decorative motion in this component at all, and that is the correct answer for it.

Under reduced motion, the mode switch is instant.

---

## Mobile behavior

Identical. `ReaderView` has no breakpoint branch, which is one of its advantages: a single-column document at `max-w-[68ch]` is already correct at every width.

- `px-6` becomes `px-5` below 640px.
- `h1` drops to 32px.
- Project images go full width.
- The return bar is unchanged.

---

## SEO requirements

- `layout.tsx` `metadata` and the JSON-LD `Person` block are preserved verbatim from the current implementation, which is already well-formed and complete. Only `themeColor` changes, to `#0B0B0E`.
- JSON-LD `sameAs` imports from `data/socials.ts` rather than repeating the URLs.
- `sitemap.ts` and `robots.ts` are unchanged.
- Every project link carries `rel="noopener noreferrer"`.
- Project images have descriptive `alt`, since they are the site's only indexable images.
- `<time dateTime>` on experience date ranges, so they are machine-readable.

The verification that matters: `curl -s localhost:3000 | grep "DocuMind"` must return a hit. If it does not, the architecture has been broken somewhere and the site has no server-rendered content.

---

## Accessibility contract

- `<a href="#main" class="skip-link">` is the **first tabbable element on the page**, visually hidden until focused. This is the site's skip-to-content link and it satisfies that requirement for the whole site, not just the reader.
- One `<h1>`, a complete and unskipped heading outline beneath it.
- Real landmarks: `<article>`, `<section aria-labelledby>`, `<nav aria-label>`, `<header>`.
- `inert` plus `aria-hidden` while the desktop is active, so exactly one tree is ever in the tab order.
- All content is real text. No content exists only inside an image or a canvas.
- Link purpose is clear from the link text alone. No bare `here` or `link`.
- Body text at 16px with `line-height: 1.7` and a 68ch measure, which is comfortable rather than merely compliant.
- Contrast: `--os-text` and `--os-text-2` on `--os-void` both clear AA. `--os-text-3` is not used anywhere in the reader.
- Supports browser zoom to 200% with no horizontal scroll and no clipped content.

---

## Done checklist

- [ ] `page.tsx` is a server component with no `'use client'`
- [ ] `ReaderView` is a server component and renders without JavaScript
- [ ] `curl -s localhost:3000 | grep "DocuMind"` returns a hit
- [ ] With JavaScript disabled in DevTools, the full document renders and is navigable
- [ ] While the desktop is active, `#reader` carries both `inert` and `aria-hidden`
- [ ] Tabbing through the desktop never lands inside the hidden reader
- [ ] The skip link is the first tabbable element and becomes visible on focus
- [ ] Every string in the reader comes from `src/data/`, with zero duplicated content
- [ ] Exactly one `<h1>` and an unbroken heading outline
- [ ] Project images use `next/image` with descriptive `alt`
- [ ] `body` switches between `overflow: hidden` and `overflow: auto` correctly on mode change
- [ ] `scroll-behavior: smooth` is scoped to `#reader`, not global on `html`
- [ ] The mode choice persists in `localStorage`
- [ ] The return bar works and restores the desktop
- [ ] The reader reads as a good standalone document, not as a fallback
- [ ] Browser zoom to 200% produces no horizontal scroll
