# 15 - Orchestrator (the WebGL scene)

`src/components/apps/Orchestrator.tsx` and `OrchestratorScene.tsx` · `AppId: 'orchestrator'`

The only WebGL in the build. Everything else is CSS 3D.

---

## Purpose

The showpiece. An orbitable 3D graph of a multi-agent orchestration loop, where clicking a node explains what that agent does.

It earns its place on two grounds rather than one. It is the one moment of genuine depth that CSS cannot produce, and its subject matter is literally the work: the portfolio belongs to someone who builds multi-agent orchestration systems, so a rotating agent graph is the content, not a decorative sphere field. A generic 3D object here would fail the taste skill's motion-motivation rule; this does not.

Salvaged from the existing `src/components/ui/agent-orchestration-graph-3d.tsx` (88 lines), which has the right idea and none of the performance handling.

---

## Data contract

Self-contained. A local `agents` array in `OrchestratorScene.tsx`:

```ts
const agents = [
  { id: 'manager',    label: 'Manager',    role: 'Plans the task, routes work, holds the loop state.',
    position: [0, 0, 0],      size: 0.55 },
  { id: 'planner',    label: 'Planner',    role: 'Decomposes the goal into ordered, checkable steps.',
    position: [-1.9, 1.0, 0.4],  size: 0.38 },
  { id: 'researcher', label: 'Researcher', role: 'Retrieves context from docs and the codebase.',
    position: [1.9, 1.0, -0.4],  size: 0.38 },
  { id: 'coder',      label: 'Coder',      role: 'Writes and edits files, runs the test loop.',
    position: [-1.9, -1.1, -0.4], size: 0.38 },
  { id: 'tools',      label: 'MCP Tools',  role: 'Exposes typed tools over the Model Context Protocol.',
    position: [1.9, -1.1, 0.4],  size: 0.38 },
]

const edges = [['manager','planner'], ['manager','researcher'],
               ['manager','coder'],   ['manager','tools'],
               ['coder','tools'],     ['researcher','planner']]
```

Node positions and the four manager edges come from the existing component. The two peer edges (`coder` to `tools`, `researcher` to `planner`) are added because a pure star topology misrepresents how these systems actually work, and the role descriptions are drawn from the real work described in `data/experience.ts`.

---

## DOM structure

```
<div class="h-full relative bg-[#0A0A0D]">

  <Suspense fallback={<SceneSkeleton />}>
    <OrchestratorScene onSelect={setSelected} selected={selected} focused={isFocused} />
  </Suspense>

  <aside class="absolute bottom-0 inset-x-0 os-glass p-4">     <- the info panel
    <h4>{selected.label}</h4>
    <p>{selected.role}</p>
  </aside>

  <p class="absolute top-3 left-3 text-[--os-text-2]">Drag to orbit</p>
</div>
```

`OrchestratorScene.tsx` is loaded with `next/dynamic` and `ssr: false`. It is the **only** dynamic import in the app tree, and it must stay that way, since every other app is small enough that lazy loading costs more in complexity than it saves.

With nothing selected, the info panel shows the Manager by default rather than being empty, so the panel never appears as dead space.

---

## The performance contract

The existing scene has none of this. Every item below is required, not optional. This is the app most capable of making the whole site feel slow.

```tsx
<Canvas
  dpr={[1, 1.5]}                  // uncapped today. a 3x retina phone renders 9x the pixels.
  gl={{ antialias: false,         // 40% opacity background never needed it
        powerPreference: 'high-performance',
        alpha: true }}
  frameloop={focused ? 'always' : 'demand'}
  camera={{ position: [0, 0, 7], fov: 45 }}
>
```

| Requirement | Why |
|---|---|
| `dpr={[1, 1.5]}` | the current scene renders at full `devicePixelRatio` |
| `antialias: false` | free quality-for-cost trade at this geometry complexity |
| `frameloop` drops to `'demand'` when the window is unfocused | today a `useFrame` loop runs permanently, including when the hero is scrolled offscreen |
| **The Canvas unmounts entirely when the window closes** | this is the important one. Closing the window must stop the rAF loop, release the WebGL context, and free the GPU buffers. Achieved by simply not rendering the window, which the store already does. Verify it. |
| No `<Stars>` from drei | the existing scene pulls `Stars` and `Line`, and `Line` drags in meshline. 150 star points behind a graph add nothing here and the wallpaper already provides the backdrop. Drop `Stars`, keep `Line`. |
| Pause on `document.hidden` | a background tab must not render |
| `prefers-reduced-motion` freezes auto-rotation | orbit-on-drag still works, since that is direct manipulation |

Target: under 4ms per frame on integrated graphics. If it cannot hit that, cut node count before cutting anything else.

---

## Scene contents

- **Nodes.** `sphereGeometry` at `[r, 24, 24]`. The existing scene uses `[r, 32, 32]`, which is 2,048 triangles per sphere for a shape 40px wide on screen. 24 segments is visually identical here and roughly 40% cheaper.
- **Materials.** `meshStandardMaterial`, `metalness: 0.35`, `roughness: 0.4`, in `--os-accent` for the Manager and a desaturated slate for the rest. Emissive is kept low. The taste skill bans neon glows and the existing scene leans on emissive heavily.
- **Edges.** drei `<Line>`, 1.5px, `--os-edge` at low opacity. A subtle dash offset animates along manager edges to suggest message flow, which communicates direction and is the one perpetual animation in the scene.
- **Lighting.** One `ambientLight` at 0.5 plus two `pointLight`s. No shadows. Shadow maps here would cost more than the entire rest of the scene.
- **Labels.** drei `<Html>` at each node, rendering real DOM text in Geist Sans. Real DOM rather than `<Text>` geometry means the labels are selectable, styled by the same tokens, and readable by a screen reader.
- **No post-processing.** No bloom, no depth of field. `@react-three/postprocessing` is not a dependency and does not become one.

---

## Interaction

| Action | Result |
|---|---|
| Drag | orbit. Clamped to ±35deg vertical, unlimited horizontal. Free vertical orbit lets the visitor end up underneath the graph looking at nothing. |
| Click a node | select it, info panel updates, node scales to 1.15 |
| Hover a node | slight scale and cursor `pointer` |
| Idle | slow auto-rotation, roughly 0.08 rad/s, which stops on first interaction and does not resume |
| `Tab` | cycles through nodes, selecting each |

Auto-rotation stopping permanently after first interaction matters. Resuming after an idle timeout fights the visitor whenever they pause to read.

No zoom. `OrbitControls` zoom on a page tends to hijack the scroll wheel, and the graph has one useful viewing distance.

---

## Motion spec

| Element | Motion |
|---|---|
| Auto-rotation | 0.08 rad/s on Y, stops on first interaction, never resumes |
| Edge dash flow | slow offset along manager edges, communicating direction |
| Node select | `scale` to 1.15, spring, and the info panel cross-fades over `--dur-fast` |
| Node hover | `scale` to 1.06 |
| Scene mount | camera dollies from z 9 to z 7 over 700ms, `--ease-os`, once |

Motivation, per animation: the dash flow shows **direction of work** through the loop; the camera dolly is a **state transition** marking the scene becoming interactive; everything else is **feedback**. Auto-rotation exists so a visitor who does nothing still sees it is 3D, which is why it stops the moment they take over.

Under reduced motion: no auto-rotation, no dash flow, no camera dolly. Orbit-on-drag, hover, and selection all still work.

---

## Mobile behavior

WebGL on a mid-range phone is the highest-risk element in the build.

- The scene **does** render on mobile, with `dpr` hard-capped at `1`, auto-rotation off by default, and the node count unchanged (five spheres is trivial).
- Orbit works on touch with one finger. Two-finger gestures are ignored so page and sheet scrolling are never captured.
- The info panel becomes a fixed bottom card rather than an overlay.
- The `Drag to orbit` hint reads `Drag to explore` on touch.
- If the WebGL context fails to acquire, render a static fallback: the info panel with all five agents listed as rows. Never a blank canvas.

---

## Accessibility contract

- The `<canvas>` is `role="img"` with an `aria-label` describing the whole graph: `Multi-agent orchestration graph. Manager routes work to Planner, Researcher, Coder, and MCP Tools.`
- Below the canvas, visually hidden, a real `<ul>` listing all five agents with their roles. **This is the actual accessible equivalent.** A screen reader user gets the full content as text and never needs the canvas.
- Node selection is keyboard-reachable via `Tab`, which cycles nodes and updates the info panel.
- The info panel is `aria-live="polite"`.
- Labels are real DOM through drei `<Html>`, so they are selectable and inherit the font stack.
- The scene never traps focus and never captures the page scroll.
- Reduced motion is honored for every animation listed above.
- Contrast: node labels are `--os-text` on a dark canvas with a subtle text shadow for legibility over lighter nodes.

---

## Done checklist

- [ ] `dpr` capped at `[1, 1.5]` on desktop and `1` on mobile
- [ ] `antialias: false`
- [ ] `frameloop` switches to `'demand'` when the window is unfocused
- [ ] **Closing the window stops the rAF loop.** Verified by watching the frame counter flatline in DevTools Performance.
- [ ] Rendering pauses when the tab is hidden
- [ ] drei `<Stars>` is not imported
- [ ] No post-processing dependency is added
- [ ] Sphere segments are 24, not 32
- [ ] `OrchestratorScene` is the only `next/dynamic` import in the app tree
- [ ] Auto-rotation stops on first interaction and does not resume
- [ ] Vertical orbit is clamped so the graph cannot be lost
- [ ] Scroll wheel is not hijacked
- [ ] `Tab` cycles nodes and updates the info panel
- [ ] The visually hidden agent list is present and complete
- [ ] A WebGL context failure renders the static fallback, never a blank canvas
- [ ] Under reduced motion there is no auto-rotation, dash flow, or camera dolly
- [ ] Frame time is under 4ms on integrated graphics
