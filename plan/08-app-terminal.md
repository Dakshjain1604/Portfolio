# 08 - Terminal

`src/components/apps/Terminal.tsx` · `AppId: 'terminal'` · window title `Terminal`

---

## Purpose

A working REPL. Ported and simplified from the current `TerminalSection.tsx` (438 lines), which is the single best component in the existing codebase and the one piece of it that belongs in a desktop metaphor without modification to its concept.

The taste skill bans fake terminal windows built from styled divs. This is a **documented exception** and a narrow one: it accepts input, resolves commands, maintains history, and can open other windows. It is a real interface, not a screenshot of one.

---

## Data contract

| Source | Used for |
|---|---|
| `data/profile.ts` | `whoami` output |
| `data/projects.ts` | `ls projects` and `open <project>` |
| `data/skills.ts` | `skills` |
| `data/socials.ts` | `contact`, `resume` |
| `os/store` | `open <app>` calls `useOS.getState().open(...)` |

The current file carries its **own** copies of projects, skills, and socials, worded differently from `FeaturedProjects.tsx` and `Skills.tsx`. Those duplicates are deleted. Terminal reads the same modules everything else reads, which is the entire point of `src/data/`.

---

## Command set

| Command | Output |
|---|---|
| `help` | the command list |
| `whoami` | name, role, employer, one line on current work, from `profile` |
| `ls` | the pseudo-listing: `projects/  skills/  experience/  resume.pdf  contact.txt` |
| `ls projects` | the 7 project ids, columnar |
| `cat ingest.py` | the DocuMind RAG snippet (see below) |
| `skills` | the 5 groups with their members, one group per block |
| `experience` | the 3 roles as `title @ org  ·  dates`, one per line |
| `contact` | email, LinkedIn, GitHub as real clickable links |
| `resume` | opens the `preview` window and prints a confirmation line |
| `open <app>` | opens that window. Accepts any `AppId` plus the aliases `projects` (finder) and `about`. |
| `neoclaw` | the orchestration easter egg, kept verbatim from the current implementation |
| `clear` | empties the buffer |
| `date`, `pwd`, `echo <text>` | small authenticity commands, cheap to implement |

Unknown input falls through the fuzzy resolver before erroring.

### The fuzzy resolver

Salvage the existing keyword-matching approach from `TerminalSection.tsx`. A visitor typing `what do you do` or `show me your work` gets a sensible answer rather than `command not found`. It is the detail that makes people actually type a second command instead of one.

Simplify the implementation: a flat array of `{ keywords: string[], command: string }`, scored by how many keywords appear in the normalized input, highest score wins, ties broken by array order, and a minimum score of 1 to match at all. Roughly 25 lines. The current version is more elaborate than it needs to be.

On a genuine miss:

```
command not found: xyzzy
try `help`
```

Lowercase, no exclamation mark, no "Oops".

### `cat ingest.py`

This is where the DocuMind Python snippet lands, moved out of `projects.ts`. Printing it as plain mono text in a terminal is more authentic than syntax-highlighting it in a card, and it is why `react-syntax-highlighter` gets removed in `01-foundation.md`. Content is the existing `codeSnippet.code` verbatim: the `PyPDFLoader` / `RecursiveCharacterTextSplitter` / `Chroma` loading and chunking functions.

Terminals do not colorize `cat` output. Rendering it uncolored is correct, not a shortcut.

---

## DOM structure

```
<div class="h-full bg-[#0E0E11] font-mono text-[13px] leading-[1.55] p-3 overflow-auto"
     onClick={focusInput}>
  <output aria-live="polite" aria-atomic="false">
    {buffer.map(line => <div>{line}</div>)}
  </output>
  <form>
    <label class="sr-only" for="tty">Terminal input</label>
    <span aria-hidden>daksh@neo ~ %</span>
    <input id="tty" autocomplete="off" spellcheck="false" autocapitalize="off" />
  </form>
</div>
```

Prompt: `daksh@neo ~ %`. Shortened from the current `daksh@orchestration-server:~ %`, which wraps at narrow window widths and pushes the caret to a second line.

The background is slightly darker than `--os-panel`, matching how Terminal.app is darker than a Finder window. It is the one app with its own surface value, and that is faithful rather than inconsistent.

Clicking anywhere in the body focuses the input, which is what every real terminal does.

---

## Interaction

| Action | Result |
|---|---|
| `Enter` | run the command, push both the echoed input and the output into the buffer |
| `ArrowUp` / `ArrowDown` | walk command history. Keep the current draft when returning past the newest entry. |
| `Tab` | complete the command name against the known set. Single match completes, multiple prints the candidates. |
| `Ctrl + L` | clear, same as `clear` |
| `Ctrl + C` | abandon the current line, print `^C`, new prompt |
| Click body | focus input |

Buffer caps at 300 lines, dropping from the front. Unbounded scrollback in a window that never reloads is a slow memory leak.

Auto-scroll to the bottom on new output, but **only if the visitor was already at the bottom**. Yanking the view down while someone is reading earlier output is the classic terminal-emulator bug.

### The intro

On first open in a session, auto-type a short intro at roughly 18ms per character:

```
$ whoami
Daksh Jain - Full-Stack & AI Engineer @ NEO
Building agent orchestration, MCP tooling, and RAG pipelines.

type `help` for commands
```

Trimmed from the current six-command intro, which takes several seconds before the visitor can type. Skips instantly on any keypress. Does not replay if the window is closed and reopened in the same session.

Note the attribution line uses a regular hyphen, not an em-dash. The current source uses an em-dash here and it must be changed on port.

---

## Motion spec

| Trigger | Behavior |
|---|---|
| Caret | 1.05s step blink via CSS `steps(2)`. A smooth fade is wrong; real terminal caret blink is a hard toggle. |
| Auto-typed intro | 18ms per character, skippable |
| New output | appears immediately, no fade. Terminal output that fades in reads as a chat UI. |
| Scroll to bottom | instant, not smooth |

The near-total absence of animation here is deliberate. It is the one app where restraint is the authenticity.

Under reduced motion: no auto-typing, the intro prints at once. Caret blink stops, since a blinking caret is a genuine trigger for some vestibular and attention conditions.

---

## Mobile behavior

Fully functional in `AppSheet`, with adjustments:

- Font drops to 12px, padding to 10px.
- The virtual keyboard covers the input. Handle it with `env(keyboard-inset-height)` where supported, and a `visualViewport` resize listener otherwise, keeping the prompt above the keyboard.
- `inputMode="text"`, `autocapitalize="off"`, `autocorrect="off"`, `spellcheck="false"`. Without these, iOS capitalizes every command and autocorrects `ls` into `is`.
- Add a small suggestion row above the input with 4 tappable commands (`help`, `whoami`, `ls projects`, `contact`), since typing on a phone is the real barrier to anyone trying it. This is the mobile equivalent of `Tab` completion.

---

## Accessibility contract

- Output region is `aria-live="polite"` with `aria-atomic="false"`, so each new block is announced without re-reading the whole buffer.
- The input has a visually hidden `<label>`. The prompt glyph is `aria-hidden`, since `daksh@neo ~ %` announced before every command is noise.
- Links printed by `contact` are real `<a>` elements in the buffer, tab-reachable in order.
- Color is never the sole carrier of meaning. Error lines are prefixed with the word `error`, not just tinted.
- The whole app is keyboard-native by construction. No pointer-only path exists.
- Caret blink respects reduced motion.
- Contrast: terminal text is `--os-text` on `#0E0E11`, well above AA. Dimmed output uses `--os-text-2`, not `--os-text-3`.

---

## Done checklist

- [ ] Every command in the table works
- [ ] Terminal reads from `src/data/`, with zero duplicated project, skill, or social data in this file
- [ ] The fuzzy resolver handles `what do you do` and `show me your work` sensibly, in roughly 25 lines
- [ ] `open finder` actually opens the Finder window
- [ ] `resume` opens the Preview window
- [ ] `cat ingest.py` prints the DocuMind snippet verbatim, uncolored
- [ ] Arrow-key history works and preserves the in-progress draft
- [ ] `Tab` completes command names
- [ ] Buffer caps at 300 lines
- [ ] Auto-scroll only fires when already scrolled to the bottom
- [ ] The intro is skippable and does not replay on reopen within a session
- [ ] `Cmd+W` and other global shortcuts do not fire while typing in the input
- [ ] Prompt does not wrap at the 480px minimum window width
- [ ] On iOS, the keyboard does not cover the input, and there is no autocapitalize or autocorrect
- [ ] The mobile suggestion row works
- [ ] Zero em-dashes in any output string, including the ported `whoami` line
