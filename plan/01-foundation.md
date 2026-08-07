# 01 - Foundation

Phase 1 of the build. Nothing in `plan/02` onward can start until this is done, because everything downstream imports from `src/data/` and styles against the tokens defined here.

---

## 1. Deletion list

Run this first. Deleting before building prevents the rewrite from quietly reusing a dead component.

### Delete entirely

| Path | Files | LOC | Why safe |
|---|---|---|---|
| `src/components/ui/` | 29 | 3,041 | 23 have zero importers. The 6 live ones (`magnetic-button`, `custom-cursor`, `loading-screen`, `scroll-progress`, `flip-words`, `agent-orchestration-graph-3d`) are all replaced by shell components. Salvage the R3F geometry first. |
| `src/app/components/` | 17 | 3,212 | 9 have zero importers. The 8 live ones are the page sections being replaced by apps. Salvage the terminal resolver first. |
| `src/app/subComponents/` | 4 | 361 | 3 have zero importers. `Title.tsx` (BlurText) is only used by the hero being deleted. |
| `src/app/icons/` | 28 | 245 | Hand-rolled SVGs, mostly 2-line stubs. Replaced by Phosphor glyphs and Simple Icons brand logos. |
| `design-system/` | 1 | 203 | `MASTER.md` specifies a light theme (`#F8FAFC` bg, `#2563EB` primary, Playfair Display). The shipped code is dark with different fonts. Fully diverged. It is a stale spec, not a source of truth. This `plan/` directory replaces it. |
| `tailwind.config.js` | 1 | 19 | v3-shape config, inert under Tailwind v4 since `globals.css` has no `@config`. Its `content` globs point at `./app`, `./pages`, `./components`, none of which exist. It also imports `Playfair_Display` into an unused variable. Deleting it changes zero rendered pixels. |
| `components.json` | 1 | 23 | shadcn config pointing at the deleted `tailwind.config.js` and declaring a `@/hooks` alias for a folder that does not exist. No shadcn component is installed or planned. |

**Total: 81 files removed, 6,859 LOC of it from `src/`.**

`src/` currently holds **85** source files totalling **7,535** LOC. After this phase, **7 survive**: `layout.tsx`, `page.tsx`, `globals.css`, `api/github/route.ts`, `sitemap.ts`, `robots.ts`, `lib/utils.ts`. That is 676 LOC to build on.

### Delete from `public/`

```
next.svg  vercel.svg  file.svg  globe.svg  window.svg          Next.js starter defaults, unused
images/hero-video.mp4        images/DakshVidNew.mp4       images/emoji-movie.mp4
images/Documind.png          images/transactly.png        images/live-tracking.png
images/Website_Cloner.avif   images/experience-image.png  images/cartoon-laptop.png
images/chatgpt-image.png     images/cursor.png            images/thinking.png
images/excalidraw-sample.png images/brainlyImages/        (3 files)
images/projects/website-cloner.png                        orphaned, no matching project
```

Keep: `images/og-image.jpg`, `images/profile.avif`, and the 7 real screenshots in `images/projects/`.

### Also fix while here

- `.DS_Store` and `tsconfig.tsbuildinfo` are committed at the repo root. Add both to `.gitignore` and `git rm --cached` them.
- `tsconfig.json` `include` lists `tailwind.config.js`, which is being deleted. Remove that entry.

---

## 2. Dependencies

### Remove

| Package | Reason |
|---|---|
| `gsap` | zero imports in `src/`. Never wired up. |
| `styled-components` | zero imports. No registry, no `compiler.styledComponents` in `next.config.ts`. Under React 19 + Next 16 App Router it would need an explicit style registry that was never written. |
| `class-variance-authority` | zero imports |
| `react-icons` | zero imports |
| `tailwind-animate` | duplicate of `tailwindcss-animate`, neither is needed |
| `tailwindcss-animate` | v3-era plugin. All animation moves to Motion and CSS tokens. |
| `react-syntax-highlighter` + `@types/react-syntax-highlighter` | one import site, in the largest component. Bundles Prism language packs. The one code snippet moves to Terminal as `cat ingest.py`, where unhighlighted mono is the authentic rendering. |
| `lucide-react` | replaced by Phosphor (see below) |

### Add

| Package | Why |
|---|---|
| `clsx` | **`src/lib/utils.ts` already imports it and it is not in `package.json`.** It resolves today only because it is hoisted as a transitive dependency. A clean install with a different resolver, or any hoisting change, breaks the build. This is a live latent bug and the single highest-priority fix in this document. |
| `zustand` | window manager state. ~1.2kb. Simpler than a hand-rolled context + reducer for this shape, which is the reason it beats the no-new-dep option. |
| `@phosphor-icons/react` | The taste skill bans Lucide-as-default and bans hand-rolled SVG icon paths. Phosphor's Light and Regular weights are the closest match to SF Symbols, which is the register macOS chrome needs. Import per-icon so tree-shaking works. |

### Also fix

```jsonc
"eslint-config-next": "^16"     // currently pinned 15.3.3 while Next is 16.2.1
"scripts": { "lint": "eslint ." }   // `next lint` is removed in Next 16
```

`postcss.config.mjs` currently passes a nested `theme.extend.fontFamily` object as *options* to `@tailwindcss/postcss`. That plugin accepts no such option and silently ignores it. Reduce the file to:

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

`components.json` is deleted in section 1 for the reasons given there.

Net: 17 runtime dependencies down to 12.

---

## 3. Fonts

### The current situation

Three mechanisms load fonts, and they disagree:

1. `layout.tsx` loads Geist and Geist Mono through `next/font/google` (self-hosted, no external request).
2. `globals.css` lines 1 and 2 are remote `@import url(...)` calls pulling Clash Display and Satoshi from Fontshare, and JetBrains Mono from Google. Both are render-blocking and bypass `next/font` entirely.
3. `tailwind.config.js` imports `Playfair_Display` into a variable that is never used, and declares `fontFamily.regalia = "Regalia Monarch"`, a font that appears nowhere in `src/` and has no files in `public/`.

Four families, three loading paths, two render-blocking round trips before first paint.

### The decision

**Geist Sans and Geist Mono only, both through `next/font`.**

Geist is the closest freely-licensed analogue to SF Pro, which is precisely the register macOS chrome needs. It is already installed and already self-hosted. Clash Display and Satoshi are dropped, which removes both remote `@import` lines.

| Role | Family | Applied to |
|---|---|---|
| UI | Geist Sans | menu bar, Dock labels, window titles, buttons, all app chrome and body copy |
| Mono | Geist Mono | Terminal, code, the menu bar clock, tabular numbers in Activity Monitor |

Reader view display headings use Geist Sans at large size with `tracking-[-0.03em]` and `font-weight: 600`. A separate display face is not needed and would reintroduce a loading path.

Anywhere numbers must not jitter (the clock, Activity Monitor counters), add `font-variant-numeric: tabular-nums`.

---

## 4. `src/app/globals.css` (complete replacement)

```css
@import "tailwindcss";

/* ---------------------------------------------------------------
   TOKENS. The naming contract lives in plan/00-architecture.md.
   Dark-locked. There is no light mode and no `dark:` variant.
   --------------------------------------------------------------- */

:root {
  /* surfaces */
  --os-void:        #0B0B0E;
  --os-chrome:      rgb(40 40 44 / .72);
  --os-panel:       #1C1C1F;
  --os-panel-2:     #232326;
  --os-panel-3:     #2A2A2E;

  /* edges: outer hairline + inner top highlight = the macOS double-edge */
  --os-edge:        rgb(255 255 255 / .10);
  --os-edge-inner:  rgb(255 255 255 / .14);
  --os-divider:     rgb(255 255 255 / .06);

  /* text: Apple's warm-neutral grays. not cool slate. */
  --os-text:        #F5F5F7;
  --os-text-2:      #98989D;
  --os-text-3:      #6E6E73;   /* decoration only. never body copy. */

  /* the one accent */
  --os-accent:      #3E7BFA;
  --os-accent-soft: rgb(62 123 250 / .16);

  /* traffic lights. the only other color on the page. */
  --tl-red:   #FF5F57;
  --tl-amber: #FEBC2E;
  --tl-green: #28C840;

  /* radii */
  --r-window:  12px;
  --r-card:    10px;
  --r-control:  6px;
  --r-chip:   999px;

  /* motion */
  --ease-os:  cubic-bezier(0.32, 0.72, 0, 1);
  --dur-fast: 140ms;
  --dur-base: 240ms;
  --dur-slow: 420ms;

  /* window elevation, indexed by depth. see plan/02. */
  --shadow-rest:    0 8px 24px rgb(0 0 0 / .38);
  --shadow-focused: 0 24px 64px rgb(0 0 0 / .52);
}

@theme inline {
  --color-void:        var(--os-void);
  --color-chrome:      var(--os-chrome);
  --color-panel:       var(--os-panel);
  --color-panel-2:     var(--os-panel-2);
  --color-panel-3:     var(--os-panel-3);
  --color-edge:        var(--os-edge);
  --color-divider:     var(--os-divider);
  --color-text:        var(--os-text);
  --color-text-2:      var(--os-text-2);
  --color-text-3:      var(--os-text-3);
  --color-accent:      var(--os-accent);
  --color-accent-soft: var(--os-accent-soft);

  --radius-window:  var(--r-window);
  --radius-card:    var(--r-card);
  --radius-control: var(--r-control);

  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

/* ---------------------------------------------------------------
   BASE
   --------------------------------------------------------------- */

html {
  -webkit-tap-highlight-color: transparent;
}

body {
  background: var(--os-void);
  color: var(--os-text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;              /* the desktop does not scroll. windows scroll. */
}

/* reader mode restores document scrolling */
body[data-mode="reader"] {
  overflow: auto;
}

::selection {
  background: var(--os-accent-soft);
  color: var(--os-text);
}

/* thin overlay scrollbars, macOS style. applies inside window bodies. */
* {
  scrollbar-width: thin;
  scrollbar-color: rgb(255 255 255 / .18) transparent;
}
*::-webkit-scrollbar { width: 8px; height: 8px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb {
  background: rgb(255 255 255 / .18);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: content-box;
}
*::-webkit-scrollbar-thumb:hover { background: rgb(255 255 255 / .30); background-clip: content-box; }

/* one visible focus ring, everywhere, no exceptions */
:focus-visible {
  outline: 2px solid var(--os-accent);
  outline-offset: 2px;
  border-radius: var(--r-control);
}

/* ---------------------------------------------------------------
   GLASS
   Web frosted-glass approximation. NOT Apple Liquid Glass, which is
   an Apple-platform material with no public web CSS package.
   The double box-shadow is what sells it: outer depth + inner top edge.
   --------------------------------------------------------------- */

.os-glass {
  background: var(--os-chrome);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid var(--os-edge);
  box-shadow:
    inset 0 1px 0 var(--os-edge-inner),
    var(--shadow-rest);
}

/* ---------------------------------------------------------------
   ACCESSIBILITY OVERRIDES
   --------------------------------------------------------------- */

@media (prefers-reduced-transparency: reduce) {
  .os-glass {
    background: var(--os-panel);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### What is deliberately gone

| Removed | Why |
|---|---|
| `@plugin 'tailwindcss-animate'` | dependency removed. It was also loaded *before* `@import "tailwindcss"`, which is wrong ordering. |
| `@custom-variant dark` | declared but the `.dark` class is never applied anywhere. Dead. |
| `.custom-cursor-active { cursor: none !important }` | see section 6 |
| `.glass`, `.glass-card`, `.gradient-text`, `.section-divider` | belonged to the page-section design being replaced |
| `.text-muted`, `.text-subtle`, `.border-subtle`, `.bg-subtle` | `.text-muted` collided with the Tailwind-generated `text-muted` from `--color-muted`, which is confusing at best and a source-order bug at worst |
| `.line-clamp-2` | Tailwind has shipped `line-clamp-*` natively since v3.3 |
| `scroll-behavior: smooth` on `html` | there is no anchor scrolling on the desktop. Reader view sets it locally. |
| the shadcn-shaped alias block (`--card`, `--popover`, `--ring`, ...) | no shadcn component is installed or planned. 20 aliases pointing at nothing. |

---

## 5. `src/data/` (the single source of truth)

Plain TypeScript. No `'use client'`. No JSX. This is what makes `ReaderView` server-renderable while the same content drives the apps.

### The problem being solved

Today content is hardcoded in 8 module-scope arrays across 6 component files. Projects and skills are **duplicated** between `FeaturedProjects.tsx` and `TerminalSection.tsx` with different wording. The social link set is repeated in 5 files, and LinkedIn appears as both `https://www.linkedin.com/in/daksh-jain16/` and `https://linkedin.com/in/daksh-jain16` depending on the file. Every one of those is a place for two copies to drift.

### `profile.ts`

```ts
export const profile = {
  name: 'Daksh Jain',
  role: 'Full-Stack & AI Engineer',
  employer: { name: 'NEO', url: 'https://heyneo.com' },
  location: 'Jaipur, India',
  tagline: 'Building production-grade AI systems across autonomous agent orchestration, MCP tooling, and RAG pipelines.',
  avatar: '/images/profile.avif',
  bio: [ /* the 3 paragraphs, verbatim from AboutPage.tsx */ ],
  specs: [
    { label: 'Role',     value: 'Full-Stack & AI Engineer' },
    { label: 'Company',  value: 'NEO' },
    { label: 'Location', value: 'Jaipur, India' },
    { label: 'Focus',    value: 'Agent orchestration, MCP, RAG' },
    { label: 'Since',    value: 'Oct 2025' },
  ],
  pillars: ['Autonomous AI Agents', 'Secure MCP Systems',
            'Multi-Agent Orchestration', 'Production RAG Pipelines'],
} as const
```

Bio paragraphs carry `<strong>` emphasis today. Store them as plain strings with a `bold` array, or as small React fragments in the app layer. Do **not** store HTML strings and `dangerouslySetInnerHTML` them.

### `projects.ts`

Seven entries, verbatim from `FeaturedProjects.tsx`. Shape:

```ts
type Project = {
  id: string            // 'documind_ai'
  title: string
  outcome: string       // one line, shown in the Finder list
  description: string   // shown in the preview pane
  image: string         // /images/projects/*.png, all 7 exist
  tech: string[]
  github?: string
  live?: string
  tags: ('ai' | 'web' | 'neo')[]   // drives the Finder sidebar
}
```

Tag mapping from the current `isAi` / `builtWithNeo` booleans:

| Project | tags |
|---|---|
| DocuMind AI | `ai` |
| Interview AI | `ai` |
| AutoCareer | `ai` |
| Ai-Coding-Agent | `ai` |
| BioScript | `ai`, `neo` |
| LLM Response Judge | `ai`, `neo` |
| SOH Ships | `web` |

The `codeSnippet` field on DocuMind moves out of this file. It becomes the body of Terminal's `cat ingest.py` command, specified in `08-app-terminal.md`.

The `tier: 'hero' | 'compact'` field is dropped. Finder has no visual hierarchy between items, which is the point of using Finder.

### `experience.ts`

Three roles, verbatim from `Experience.tsx`, newest first. Shape:

```ts
type Role = {
  id: string
  title: string
  org: string
  location: string
  start: string; end: string    // 'Oct 2025' / 'Present'
  summary: string
  bullets: string[]
  tech: string[]
}
```

The Lucide `icon` field on each entry is dropped. Notes shows a note glyph, not a per-role icon.

### `skills.ts`

Five groups, verbatim from `Skills.tsx`. Each skill gains a `slug` for its brand logo:

```ts
type Skill = { name: string; slug?: string }   // slug -> cdn.simpleicons.org/{slug}
type SkillGroup = { id: string; label: string; skills: Skill[] }
```

Groups in sidebar order: `Agentic AI & GenAI` (default selection), `Backend`, `Frontend`, `Languages`, `Cloud & Tools`.

Skills with no Simple Icons entry (`Autonomous Agent Workflows`, `Model Context Protocol (MCP)`, `Multi-Agent Orchestration`, `Production RAG & Vector Search`, `LLM Tool & Function Calling`, `Prompt Engineering & Evals`, `REST`, `CI/CD`) get `slug: undefined` and render a Phosphor glyph instead. See `11-app-settings.md`.

### `socials.ts`

The canonical set. Every one of the five current copies is deleted in favor of this.

```ts
export const socials = {
  github:      'https://github.com/Dakshjain1604',
  linkedin:    'https://www.linkedin.com/in/daksh-jain16/',   // pick ONE form
  leetcode:    'https://leetcode.com/u/Daksh8816/',
  huggingface: 'https://huggingface.co/daksh-neo',
  email:       'dakshjain080@gmail.com',
  phone:       '+91 7627056978',
  resume:      '/DakshJain_Resume.pdf',
} as const
```

`layout.tsx`'s JSON-LD `sameAs` array should import from here rather than repeating the URLs a sixth time.

### `apps.ts`

The `AppId` union and the `AppMeta` registry table. Both are specified in full in `00-architecture.md` sections 5.

---

## 6. Two things that must not be carried forward

### `CustomCursor`

`src/components/ui/custom-cursor.tsx` does two things that are incompatible with this build:

1. It applies `cursor: none !important` to every element on fine-pointer devices. The desktop depends on eight distinct resize cursors (`nwse-resize`, `nesw-resize`, `ns-resize`, `ew-resize`), plus `grab` on titlebars and `text` in the Terminal. Those cursors carry a large share of the "this feels native" impression. A custom cursor destroys all of it.
2. At module scope it reassigns global `console.warn` to filter `THREE.Clock` strings, and never restores it. That silences a whole class of warnings app-wide from a file whose name gives no hint it does so.

The taste skill also bans custom cursors outright as accessibility-hostile. Deleted, and noted here so it does not get re-added.

### Fabricated content

Two files hold invented data that must not survive the port:

- `Testimonials.tsx`: John Doe (Senior Developer at TechCorp), Jane Smith (Product Manager at StartupXYZ), Mike Johnson, Sarah Wilson. All five stars, generic praise. This is the textbook "Jane Doe effect". Fake social proof on a real person's portfolio is worse than no social proof.
- `stats-widgets.tsx`: `QuickStats` claiming 500+ commits, 30+ PRs, 50+ stars. `WakaTimeStats` claiming 300+ coding hours. `ActivityFeed` with invented commit messages on real repo names.

Neither is rendered today. Neither gets an app. Do not invent a replacement.

Related: `api/github/route.ts` returns `MOCK_DATA` with invented star counts (`transactly_frontend` 32 stars, `DocuMind-Ai` 45) whenever `GITHUB_TOKEN` is unset, which means the failure mode is silently fake data presented as real. Fixed in `12-app-activity.md`.

---

## 7. Done checklist

- [ ] 81 files deleted, `git status` shows no orphaned imports
- [ ] `npx tsc --noEmit` clean
- [ ] `clsx` present in `package.json` dependencies
- [ ] `gsap`, `styled-components`, `class-variance-authority`, `react-icons`, `tailwind-animate`, `tailwindcss-animate`, `react-syntax-highlighter`, `lucide-react` all absent
- [ ] `grep -rn "@import url" src/` returns nothing
- [ ] `grep -rn "lucide-react" src/` returns nothing
- [ ] `tailwind.config.js`, `components.json`, `design-system/` all gone
- [ ] `npm run lint` runs (script is `eslint .`, not `next lint`)
- [ ] `src/data/` has 6 files, none contains `'use client'`, all importable from a server component
- [ ] Every string in `src/data/` matches the audited original verbatim, with zero invented values
- [ ] `grep -rn "—\|–" src/` returns zero. The originals carry 16 dashes across `FeaturedProjects.tsx` (6), `TerminalSection.tsx` (7), and `Experience.tsx` (3). Fix each at the moment it is copied into `src/data/`, per `18-preflight.md` section B.
