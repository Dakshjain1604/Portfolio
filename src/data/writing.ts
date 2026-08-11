/**
 * Posts for the Writing app (plan/22-evidence-pass.md).
 *
 * Every one of these is adapted from a real decision recorded in `plan/`,
 * so the claims and the numbers are the ones the build actually made. When
 * adding a post, keep that rule: this reads as evidence precisely because
 * it is not generic advice.
 *
 * NOTE: the `date` on each post is the date the work was done as best it
 * could be reconstructed. Adjust them if you want exact publication dates -
 * they are the one field here not derived from the plan documents.
 */

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "code"; lang: string; text: string }
  | { kind: "quote"; text: string }
  | { kind: "list"; items: string[] }

export type Post = {
  slug: string
  title: string
  dek: string
  date: string
  readingMinutes: number
  tags: string[]
  body: Block[]
}

/** Newest first. */
export const posts: Post[] = [
  {
    slug: "drag-without-react-state",
    title: "Your drag handler is why the demo stutters",
    dek: "Every browser-OS demo judders when you drag a window. The cause is almost always the same three lines, and the fix is a rule rather than an optimisation.",
    date: "2026-06-18",
    readingMinutes: 5,
    tags: ["React", "Performance", "Motion"],
    body: [
      {
        kind: "p",
        text: "I built a window manager in React — drag, eight-handle resize, stacking, minimise, Mission Control. The thing I expected to be hard was resize geometry. The thing that actually decided whether it felt real was a single rule I wrote down before any other line of the spec.",
      },
      { kind: "quote", text: "During a drag or a resize, React state is never touched." },
      {
        kind: "p",
        text: "That is the whole performance story. Not memoisation, not selector tuning, not virtualising anything. One rule, stated first, because everything else follows from it.",
      },
      { kind: "h", text: "The default implementation" },
      {
        kind: "p",
        text: "Here is how nearly everyone writes this, and it is why nearly every browser-OS demo judders:",
      },
      {
        kind: "code",
        lang: "tsx",
        text: `const [pos, setPos] = useState({ x, y })

onPointerMove={(e) => {
  setPos({ x: e.clientX - dx, y: e.clientY - dy })
}}`,
      },
      {
        kind: "p",
        text: "At 60fps that is sixty state updates per second. Each one re-renders the window, which re-renders the app inside it. Drag a terminal with 200 lines of scrollback and you are reconciling 200 lines of scrollback sixty times a second, for a change that only ever touches a transform.",
      },
      {
        kind: "p",
        text: "The usual response is to reach for React.memo, then useCallback, then a finer-grained store selector. Each one recovers a little. None of them fix it, because the work was never necessary in the first place.",
      },
      { kind: "h", text: "Bind to the element, not to the tree" },
      {
        kind: "p",
        text: "Position and size are Motion values wired straight to the element's style. The store is written exactly once, on pointer-up:",
      },
      {
        kind: "code",
        lang: "tsx",
        text: `const x = useMotionValue(rect.x)
const y = useMotionValue(rect.y)

// pointermove
x.set(clampX(e.clientX - dx))
y.set(clampY(e.clientY - dy))

// pointerup — the only store write in the whole gesture
commitRect(id, { ...rect, x: x.get(), y: y.get() })`,
      },
      {
        kind: "p",
        text: "The store now mutates only on discrete user events: open, close, focus, minimise, drag-end. Nine open windows means at most nine writes per interaction rather than sixty per second per window. React DevTools Profiler records zero renders across an entire drag — that is the acceptance test, and it is a binary one.",
      },
      {
        kind: "p",
        text: "The pleasant consequence is that the naive implementation is already fast. There is no memo anywhere in the tree. A window being dragged does not re-render its content, so the heavy terminal drags exactly as smoothly as an empty window. That is not an optimisation I applied; it is a property of having drawn the boundary in the right place.",
      },
      { kind: "h", text: "The tilt, which is where the feel comes from" },
      {
        kind: "p",
        text: "A window that merely follows the cursor reads as a div. What makes it read as an object with mass is a small tilt driven by drag velocity:",
      },
      {
        kind: "code",
        lang: "ts",
        text: `const vx = useVelocity(x)
const vy = useVelocity(y)

const rotateY = useSpring(
  useTransform(vx, [-1400, 1400], [-5, 5], { clamp: true }),
  { stiffness: 260, damping: 26, mass: 0.6 }
)`,
      },
      {
        kind: "p",
        text: "Two details matter more than the numbers. First, rotateX inverts against vertical velocity — dragging down should tip the top of the window away from you, and getting the sign wrong is immediately, unplaceably wrong to look at.",
      },
      {
        kind: "p",
        text: "Second, and this is the part I find genuinely elegant: there is no reset. Velocity decays to zero on its own the moment the pointer stops, so the spring settles the window flat with no explicit call, no timer, no onDragEnd handler. The physics does the cleanup. That is why it reads as mass rather than as an animation someone triggered.",
      },
      {
        kind: "p",
        text: "Clamp at ±5°. I tried more. Past roughly 7° the text inside starts to visibly shear and it stops looking like a window and starts looking like a card trick.",
      },
      { kind: "h", text: "The generalisation" },
      {
        kind: "p",
        text: "Continuous input — drag, resize, scroll, pointer-tracked lighting — does not belong in React state. State is for discrete facts your tree needs to re-render against. A cursor position mid-gesture is neither discrete nor something the tree needs. Write it to the element and tell the store once, when the gesture produces a fact worth keeping.",
      },
    ],
  },
  {
    slug: "every-window-was-square",
    title: "Every window had been square for weeks",
    dek: "59 CSS-variable utilities across 22 files compiled to invalid CSS. Nothing errored, nothing warned, and I did not notice until I went looking for something else.",
    date: "2026-05-02",
    readingMinutes: 4,
    tags: ["Tailwind", "CSS", "Debugging"],
    body: [
      {
        kind: "p",
        text: "I was auditing corner radii — checking that nested elements sat concentrically inside their containers — when I realised the containers had no radius at all. None of them did. Every window, menu, card and chip in the entire build had been rendering as a hard rectangle, and I had been looking at it every day without seeing it.",
      },
      { kind: "h", text: "The bug" },
      {
        kind: "p",
        text: "Tailwind v3 let you pass a bare custom property into an arbitrary value:",
      },
      { kind: "code", lang: "html", text: `<!-- v3: works -->\n<div class="rounded-[--r-window]">` },
      {
        kind: "p",
        text: "Tailwind v4 dropped that shorthand. The same class now compiles to exactly what it says:",
      },
      {
        kind: "code",
        lang: "css",
        text: `/* what v4 emitted */
.rounded-\\[--r-window\\] {
  border-radius: --r-window;   /* not a length. invalid. */
}`,
      },
      {
        kind: "p",
        text: "`border-radius: --r-window` is not a parse error in a way anything reports — it is an invalid declaration, so the browser drops it and computes 0px. No build warning. No console message. No red squiggle. The class was still in the markup, still in the compiled stylesheet, and doing nothing.",
      },
      {
        kind: "p",
        text: "The v4 form is parentheses, which tells the compiler it is a custom property rather than an arbitrary literal:",
      },
      { kind: "code", lang: "html", text: `<!-- v4 -->\n<div class="rounded-(--r-window)">` },
      { kind: "h", text: "Why it survived so long" },
      {
        kind: "p",
        text: "Two reasons, and the second one is the useful one.",
      },
      {
        kind: "list",
        items: [
          "The design tokens were fine. `--r-window: 20px` was defined, correct, and visible in DevTools' computed styles on `:root`. Every check I would casually run said the radius scale was healthy.",
          "I was reading the source, not the output. The class was right there in the JSX. Confirming that a token exists and confirming that a token is *applied* are different checks, and I kept doing the first one.",
        ],
      },
      {
        kind: "p",
        text: "There is also a plainer reason: a 20px radius is not something you miss by its absence. You notice a wrong radius. You do not notice a missing one, because square windows still look like windows. The bug was invisible precisely because it was total — with nothing rounded, there was no inconsistency to catch the eye.",
      },
      { kind: "h", text: "What I changed about how I check" },
      {
        kind: "quote",
        text: "When a token appears to have no effect, read the compiled chunk, not the source.",
      },
      {
        kind: "p",
        text: "That is now a rule in the project's preflight document, alongside two neighbours it earned by the same route. Never hand-write `-webkit-backdrop-filter`: Lightning CSS silently drops the unprefixed property when both are present with identical values, so writing both gets you fewer, not more. And delete `.next` before trusting that a CSS change did not apply — Turbopack's persistent cache will happily serve a stale chunk under an unchanged content hash.",
      },
      {
        kind: "p",
        text: "All three failures share a shape. The source says one thing, the bytes the browser receives say another, and nothing in between raises its hand. Framework abstractions are worth their cost right up until the moment they are wrong, and the only reliable move at that point is to stop reasoning about what should have been emitted and go read what was.",
      },
    ],
  },
  {
    slug: "liquid-glass-without-displacement",
    title: "Approximating Liquid Glass without a displacement map",
    dek: "The technically correct way to refract a background in CSS ships in one browser, pixelates, and cannot resize. Here is what I did instead, and what it costs.",
    date: "2026-04-14",
    readingMinutes: 6,
    tags: ["CSS", "Design Engineering", "Accessibility"],
    body: [
      {
        kind: "p",
        text: "Apple's Liquid Glass bends the background at the rim of a surface. It is a real refraction, not a blur, and it is the single detail that separates the material from every frosted-panel approximation on the web. I wanted it. I did not ship it, and the reasoning is worth writing down because the seductive answer is a trap.",
      },
      { kind: "h", text: "Why not the correct approach" },
      {
        kind: "p",
        text: "You can genuinely displace a backdrop in CSS. An SVG `feDisplacementMap` feeding `backdrop-filter` will bend what is behind an element. Three problems, in increasing order of severity:",
      },
      {
        kind: "list",
        items: [
          "It ships in Chromium only. Safari and Firefox get nothing — and Safari is the browser most likely to be running on the hardware this is imitating.",
          "It pixelates. SVG displacement has no super-sampling, so the bent edge is visibly stair-stepped at exactly the place you were trying to make look expensive.",
          "The filter cannot resize with its element. Every window here is draggable and resizable, which means regenerating the filter on every frame of every drag — reintroducing precisely the per-frame work the rest of the architecture exists to avoid.",
        ],
      },
      {
        kind: "p",
        text: "The third one killed it. A material that degrades the interaction it decorates is not a material, it is a trade you have already lost.",
      },
      { kind: "h", text: "What actually carries the impression" },
      {
        kind: "p",
        text: "Refraction turns out not to be the load-bearing part. Four cheaper cues do most of the work, and all four behave identically in every browser:",
      },
      {
        kind: "list",
        items: [
          "A lit rim — brighter at the top, fading by the bottom, so the surface has an edge that catches light.",
          "A specular highlight that tracks the cursor, the way real Liquid Glass illuminates at the touch point.",
          "A layered sheen across the face rather than a single flat tint.",
          "Progressive edge blur where content passes beneath chrome, instead of a hard clip.",
        ],
      },
      {
        kind: "p",
        text: "The rim is the one I like most, mechanically. It is painted `border-box` from a conic gradient while every other layer is painted `padding-box`, so a single element gets a lit edge with no pseudo-element and no z-index bookkeeping:",
      },
      {
        kind: "code",
        lang: "css",
        text: `.os-glass {
  border: 1px solid transparent;
  background:
    radial-gradient(140px 110px at var(--gx, 20%) var(--gy, 0%),
                    rgb(255 255 255 / .14), transparent 72%) padding-box,
    linear-gradient(var(--os-chrome), var(--os-chrome)) padding-box,
    conic-gradient(from 210deg at 50% 50%,
                   rgb(255 255 255 / .30),
                   rgb(255 255 255 / .07) 25%,
                   rgb(255 255 255 / .20) 85%,
                   rgb(255 255 255 / .30)) border-box;
  backdrop-filter: blur(30px) saturate(190%);
}`,
      },
      {
        kind: "p",
        text: "Everything is a background layer rather than a positioned pseudo-element, because backgrounds always paint beneath an element's real children with zero stacking-order care. `--gx` and `--gy` are written straight to `element.style` by a pointer hook — never through React state, for the reasons in the drag post.",
      },
      { kind: "h", text: "Glass is defined by what is behind it" },
      {
        kind: "p",
        text: "The most expensive lesson in this whole area: I spent a while convinced the material was too weak, tuning blur radii and rim alphas, getting nowhere. The material was fine. The wallpaper was the problem — a dark gradient sitting at low alpha over a near-black background, so every blur, sheen and rim was faithfully sampling nothing at all.",
      },
      {
        kind: "p",
        text: "There was no fix available inside the glass. A material with nothing behind it has no appearance to adjust. Raising the wallpaper's luminance — and, later, replacing it with an image that has real structure at the 20–200px scale the blur samples — fixed the material without touching a single glass value.",
      },
      { kind: "h", text: "Three tiers, and one contrast guarantee" },
      {
        kind: "p",
        text: "Full transparency through a content area photographs beautifully and fails 4.5:1 in practice. So the glass is layered rather than uniform: the window frame is glass, sidebars float on it as clearer glass, and app content sits on a near-opaque plate inset inside. The plate is what carries the contrast guarantee, which means body text stays legible no matter what the visitor sets as their wallpaper.",
      },
      {
        kind: "p",
        text: "One accessibility note I got wrong the first time. Under `prefers-reduced-transparency`, the instinct is to flatten everything to an opaque panel. macOS does not do that — it frosts *harder*. The material stays a material; it just stops letting content through. Flattening removes the design; frosting preserves it while satisfying the request that was actually made.",
      },
    ],
  },
  {
    slug: "i-forgot-to-put-my-name-on-it",
    title: "I built an entire operating system and forgot to put my name on it",
    dek: "Nine apps, a window manager, a boot sequence. A visitor landing on it could not tell you whose site it was.",
    date: "2026-08-11",
    readingMinutes: 3,
    tags: ["Product", "Design"],
    body: [
      {
        kind: "p",
        text: "My portfolio boots into a macOS desktop. It has a real window manager — drag, resize, stacking, Mission Control, dock magnification — nine apps, reduced-motion and reduced-transparency paths, and a reader view for people without JavaScript. I am genuinely proud of the engineering.",
      },
      {
        kind: "p",
        text: "It also opened straight into a file browser belonging to nobody. No name. No role. Nothing. If you did not already know whose site you had landed on, you had to go looking for it.",
      },
      { kind: "h", text: "How that happens" },
      {
        kind: "p",
        text: "The boot sequence ended with one line: `open('finder')`. It was a reasonable-looking decision — show the work immediately, skip the throat-clearing. And every single time I loaded the site I already knew whose it was, so the gap was invisible to the only person who ever looked at it during development.",
      },
      {
        kind: "p",
        text: "This is the specific blind spot of building something craft-heavy: you spend months on the parts that are hard, and the parts that are merely *necessary* never come up, because difficulty is what pulls your attention and necessity is quiet.",
      },
      { kind: "h", text: "The hierarchy I use now" },
      {
        kind: "p",
        text: "A portfolio has one job — convince a stranger with about forty seconds that you can do the work, then give them a way to act. Against that, not all content is equally persuasive. Roughly, most to least:",
      },
      {
        kind: "list",
        items: [
          "Shipped things people actually use",
          "Code someone can read",
          "Writing that shows judgment — why X over Y",
          "Specific outcomes with numbers",
          "Descriptions of what you built",
        ],
      },
      {
        kind: "p",
        text: "Almost every developer portfolio lives entirely at the bottom of that list, mine included. Seven projects, each described by what the product does, not one number between them. Meanwhile the strongest evidence on the site was the site itself — and it was doing that work silently, three clicks deep, behind a window that did not say who had built it.",
      },
      { kind: "h", text: "What changed" },
      {
        kind: "p",
        text: "Boot now opens nothing. The landing view is the desktop, with the name set large on the wallpaper, receding behind windows once you open something. It cost about forty lines. It is unambiguously the highest-value change I have made to this project, and it took me a peer's site — worse than mine on capability, better on first impression — to see it.",
      },
      {
        kind: "quote",
        text: "Craft is what you notice while building. Legibility is what everyone else notices instead.",
      },
    ],
  },
]
