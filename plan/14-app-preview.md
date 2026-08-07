# 14 - Preview (Resume)

`src/components/apps/Preview.tsx` · `AppId: 'preview'` · window title `Resume.pdf`

---

## Purpose

Show the resume PDF inline, without sending the visitor to a browser download or a new tab. Preview.app is the exact right container: it is macOS's document viewer, and the content genuinely is a PDF document.

This is the shortest app in the build and the one with the highest ratio of recruiter value to implementation cost. It is also the one with an unfilled dependency.

---

## The blocker

**`public/DakshJain_Resume.pdf` does not exist.**

It is currently linked from three places in the live site, all of which 404:

| File | Reference |
|---|---|
| `HeroSection.tsx` | the primary `view_résumé` CTA |
| `topBar.tsx` | `navLinks` entry, external and highlighted |
| `TerminalSection.tsx` | the `resume` command, twice, including a `window.open` |

After the revamp, the same path is referenced from six places: this app, the `Resume.pdf` desktop icon, the Dock, `File > Open Resume`, `File > Download Resume`, and Terminal's `resume` command. All route through `socials.resume`, so filling the gap is a single file drop with no code change.

**Action required: place the PDF at `public/DakshJain_Resume.pdf`.**

Until then, the app ships a real empty state and nothing is broken. But an unfilled resume link on an engineer's portfolio is the single most costly gap in this document, ahead of any visual polish item.

---

## Data contract

Imports `socials` from `@/data/socials` for `socials.resume`, and `profile` for the name used in the empty state's Contact call.

No other data. The PDF is the content.

---

## DOM structure

```
<div class="h-full flex flex-col bg-[#141416]">

  <div class="toolbar">                     <- lives in the window titlebar row
    <span class="filename">DakshJain_Resume.pdf</span>
    <div>
      <a download href={socials.resume}><DownloadSimple /> Download</a>
      <a target="_blank" href={socials.resume}><ArrowSquareOut /> Open</a>
    </div>
  </div>

  <div class="flex-1">
    <object data={`${socials.resume}#view=FitH&toolbar=0`}
            type="application/pdf"
            aria-label="Resume of Daksh Jain">
      <EmptyState ... />                    <- native fallback content
    </object>
  </div>

</div>
```

### Why `<object>` and not `<iframe>` or a PDF library

`<object>` has one property nothing else does: its **children render automatically** when the resource fails to load or the browser cannot display it. That single behavior handles the missing-file case, the unsupported-browser case, and the iOS case with no JavaScript and no error handling.

`react-pdf` or `pdf.js` would add roughly 300kb to render a document the browser already renders natively. Not justified.

`#view=FitH&toolbar=0` fits the page width and hides the browser's own PDF chrome, since the app supplies its own toolbar. Support varies by browser; where it is ignored the document still renders correctly, so it is a progressive enhancement.

The background is `#141416`, slightly darker than `--os-panel`, so the white PDF page reads as a document sitting on a surface rather than a white rectangle bleeding into the window.

---

## States

### Document present

The PDF renders. The toolbar shows the filename, Download, and Open.

### Document missing (current state)

The `<object>` fallback renders `primitives/EmptyState.tsx`:

```
[ FileX glyph ]

Resume not available

The PDF is not published yet. Reach out and Daksh will send it directly.

[ Contact ]        [ View GitHub ]
```

`Contact` calls `open('mail')`. `GitHub` opens `socials.github`.

The copy is direct and does not pretend a file is coming. No `Oops`, no exclamation mark, no `Coming soon!`. This state is designed to be genuinely useful rather than apologetic, because with the file missing it is what a recruiter actually sees.

### iOS

Safari on iOS does not render PDFs inside `<object>`. Detect via a `matchMedia('(pointer: coarse)')` plus a UA check and render a document-card instead: a filename, a file glyph, and prominent Download and Open buttons. This is what iOS Files does, so it is idiomatic rather than a fallback.

---

## Motion spec

Almost none, deliberately. It is a document viewer.

| Trigger | Behavior |
|---|---|
| Window open | the standard genie from `02-window-manager.md` |
| Toolbar button hover | background lift over `--dur-fast` |
| Toolbar button press | `scale(0.98)` |
| Document load | no fade. Fading in a PDF makes a fast load look slow. |

No page-turn animation, no zoom controls, no thumbnail rail. The browser's own PDF viewer already provides scrolling and zoom, and reimplementing them would be worse than what is already there.

---

## Mobile behavior

In `AppSheet`, the iOS path from the States section is the default:

- Document card with a large `FilePdf` glyph, filename, and two full-width 48px buttons.
- No inline render attempted, since it does not work.
- The sheet is shorter than full height, since a document card does not need the full screen.

---

## Accessibility contract

- `<object>` carries `aria-label="Resume of Daksh Jain"`. Without it, the embedded document is announced as an unlabeled region.
- The fallback content inside `<object>` is fully accessible markup, not an image of text. When the file is missing, the empty state is a real heading, real paragraph, and real buttons.
- `Download` is an `<a download>`. `Open` is an `<a target="_blank">` with an accessible name ending in `opens in a new tab`. Neither is a button, because both have URLs.
- The filename in the toolbar is real text, not part of an image.
- A PDF embedded in a page is a known accessibility weak point regardless of markup. **`ReaderView` carries the full resume content as real HTML** (`17-reader-view.md`), so no information in the PDF is reachable only through the PDF. That is the actual mitigation; the `aria-label` is just hygiene.
- Contrast in the empty state uses `--os-text` for the heading and `--os-text-2` for the body, both clearing AA on `#141416`.

---

## Done checklist

- [ ] The app uses `<object>` with real fallback children, not `<iframe>`, and no PDF library is added
- [ ] With the PDF present, it renders inline and fits to width
- [ ] With the PDF absent, the empty state renders automatically with no JavaScript error handling
- [ ] Empty-state copy is direct, with no `Oops`, no exclamation mark, and no `Coming soon`
- [ ] `Contact` in the empty state opens the Mail window
- [ ] Download and Open both work and are real anchors
- [ ] iOS shows the document card rather than a blank embed
- [ ] The `<object>` has a real `aria-label`
- [ ] All six references to the resume path resolve through `socials.resume`, with zero hardcoded paths
- [ ] **The PDF is placed at `public/DakshJain_Resume.pdf`.** This is the one item on this list that requires action outside the code.
