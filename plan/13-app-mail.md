# 13 - Mail (Contact)

`src/components/apps/Mail.tsx` · `AppId: 'mail'` · window title `Contact`

---

## Purpose

The conversion point. Every other app exists to get someone here.

Mail's compose window is the right container because it does something a contact section cannot: it puts the visitor's cursor in a message field that is already addressed. The gap between "I should email him" and "I am typing an email to him" is where most portfolio contact sections lose people, and a pre-addressed compose window closes it.

---

## Data contract

Imports `socials` from `@/data/socials` and `profile` from `@/data/profile`.

| Field | Used where |
|---|---|
| `socials.email` | the `To` field, and the mailto target |
| `socials.phone` | contact card |
| `socials.linkedin`, `github`, `leetcode`, `huggingface` | contact card links |
| `profile.location` | contact card |
| `profile.name` | the `To` display name |

---

## DOM structure

```
<div class="h-full flex flex-col">

  <form class="compose flex-1 flex flex-col">
    <div class="header-fields">
      <div class="field">
        <label for="to">To</label>
        <div class="token">Daksh Jain  &lt;dakshjain080@gmail.com&gt;</div>   <- read-only pill
      </div>
      <div class="field">
        <label for="from">From</label>
        <input id="from" type="email" placeholder="you@company.com" />
      </div>
      <div class="field">
        <label for="subject">Subject</label>
        <input id="subject" />
      </div>
    </div>

    <textarea id="body" class="flex-1" />

    <footer>
      <button type="submit">
        <PaperPlaneTilt />  Send
      </button>
      <span class="hint">Opens in your mail client</span>
    </footer>
  </form>

  <aside class="contact-card border-t">
    <a href="mailto:...">   <EnvelopeSimple /> dakshjain080@gmail.com </a>
    <a href="tel:...">      <Phone />          +91 7627056978        </a>
    <span>                  <MapPin />         Jaipur, India         </span>
    <div class="socials">   4 icon links                             </div>
  </aside>

</div>
```

### The `To` token

Read-only, rendered as a recipient pill exactly as Mail renders a resolved contact: a rounded chip with the name, and the address in `--os-text-2`. Not an editable input. The recipient is not a decision the visitor makes.

### Subject prefill

Prefilled with `Hello Daksh` and selected on first focus, so typing replaces it. A blank subject line is a small friction point that measurably reduces sends.

### The hint

`Opens in your mail client`, sitting beside the Send button in `--os-text-2`. This is a small honesty requirement: the button looks like it sends mail, and it does not, it hands off to `mailto:`. Setting that expectation before the click avoids the moment where the visitor thinks a message was sent and it was not.

---

## Send behavior

```ts
const href = `mailto:${socials.email}`
  + `?subject=${encodeURIComponent(subject)}`
  + `&body=${encodeURIComponent(body + '\n\n' + from)}`
window.location.href = href
```

No backend, no form service, no API route. The site has no server-side mail capability and adding one for a portfolio contact form is a maintenance burden with a spam surface. `mailto:` with prefilled fields is honest, works everywhere, and needs no infrastructure.

The `From` address is appended to the body rather than set as a header, because `mailto:` cannot set a reply-to that the visitor's client will honor.

### Validation

Client-side, inline, before the handoff:

| Condition | Message |
|---|---|
| `From` is empty or not an email shape | `Enter a valid email address so Daksh can reply.` |
| `Body` is empty | `Add a message before sending.` |

Rendered inline below the field in a desaturated red, with `aria-describedby` linking it, and `aria-invalid` on the input. Never `window.alert()`. Never a toast. Validation errors belong next to the field that caused them.

Messages are plain and active voice, per the taste skill's copy rules.

---

## The contact card

Below the compose area, separated by one hairline. Four rows plus a social strip. Every item is a real link with a real destination:

| Row | Target |
|---|---|
| Email | `mailto:dakshjain080@gmail.com` |
| Phone | `tel:+917627056978` |
| Location | plain text, not a link. There is no useful destination and a map link is noise. |
| Socials | GitHub, LinkedIn, LeetCode, Hugging Face |

Social icons come from Simple Icons at 18px, same source as `11-app-settings.md`, with real accessible names.

The current `ContactSection.tsx` has a `status: open_to_ops` line and a blurb about being open to roles. The blurb is kept, reworded into plain language. The status line is dropped: it uses the fake-terminal register that the taste skill flags, and `open_to_ops` is not a phrase a recruiter parses.

---

## Motion spec

| Trigger | Behavior |
|---|---|
| Field focus | border transitions to `--os-accent` over `--dur-fast`, plus the global focus ring |
| Send hover | background lifts, the `PaperPlaneTilt` glyph translates 2px right and 1px up. Nested icon movement inside the button, per the high-end-visual-design skill's button-in-button physics. |
| Send press | `scale(0.98)` |
| Validation error | message fades in over `--dur-fast` with no shake. Shaking a field is punitive and is a genuine problem for motion-sensitive visitors. |
| Contact row hover | background `--os-panel-3`, instant |

Motivation: every animation here is direct **feedback** on a user action. There is no entrance animation and no decoration.

Under reduced motion, the glyph does not translate and errors appear instantly.

---

## Mobile behavior

In `AppSheet`:

- Compose fields stack, labels above inputs rather than inline.
- The `textarea` gets a `min-height` of 140px and does not flex-grow, so the contact card stays reachable without scrolling past a full-screen text field.
- `inputMode="email"` on the From field, so iOS shows the `@` keyboard.
- Send button is full width, 48px.
- The keyboard covering the textarea is handled the same way as Terminal: `visualViewport` listener keeping the focused field in view.
- The contact card rows go to 48px for touch.

---

## Accessibility contract

- A real `<form>` with a real `<button type="submit">`. `Enter` in the subject field submits, which is the expected behavior.
- Every input has a real, visible `<label>` with a matching `for`. Placeholders are never used as labels.
- The `To` token is `aria-readonly` and has an accessible name that includes both the name and the address.
- Errors use `aria-invalid` on the input and `aria-describedby` pointing at the message. The message container is `role="alert"` so it is announced when it appears.
- The hint text is linked to the Send button with `aria-describedby`, so a screen reader user learns it opens a mail client before activating it.
- Focus order is `From`, `Subject`, `Body`, `Send`, then the contact card. The read-only `To` token is skipped.
- Contrast: input text is `--os-text` on `--os-panel-2`. Placeholders use `--os-text-2`, not `--os-text-3`, which is the usual failure point on forms and is called out in the pre-flight.
- The error red is desaturated to sit inside the palette, and every error is also carried by text, never by color alone.
- All external links carry `rel="noopener noreferrer"` and accessible names ending in `opens in a new tab`.

---

## Done checklist

- [ ] The `To` field is pre-addressed and read-only
- [ ] Subject is prefilled and selected on first focus
- [ ] Send builds a correct `mailto:` with encoded subject and body, and appends the From address to the body
- [ ] The `Opens in your mail client` hint is present and linked to the button with `aria-describedby`
- [ ] Validation is inline, uses `role="alert"`, and never calls `window.alert()`
- [ ] Validation copy is active voice with no exclamation marks
- [ ] Every contact row and social icon is a real link with a real destination
- [ ] Location is plain text, not a link
- [ ] The `status: open_to_ops` line is not carried forward
- [ ] Every input has a real visible label, with no placeholder-as-label anywhere
- [ ] Placeholder contrast passes AA
- [ ] `Enter` in the subject field submits the form
- [ ] On mobile the textarea does not consume the full sheet, and the contact card is reachable
- [ ] No backend, no form service, no new API route
