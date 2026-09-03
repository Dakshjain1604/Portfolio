/**
 * Photograph a command-line project.
 *
 *   node tools/shots/terminal.mjs            # every session
 *   node tools/shots/terminal.mjs neo_mcp    # just these
 *
 * A CLI has no page for Playwright to open, so this runs the real binary,
 * keeps its real stdout including the ANSI colour it emitted, and renders
 * that into a terminal window which Playwright then screenshots. The text on
 * screen is transcript, never prose: `slice` may drop lines to keep a shot
 * readable, but nothing is ever rewritten or invented. Cross-check any shot
 * against tools/shots/transcripts/<id>.txt, which is written next to it.
 */
import { chromium } from "playwright"
import { spawnSync } from "node:child_process"
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { sessions } from "./terminal-manifest.mjs"

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, "..", "..")
const OUT = join(REPO, "public", "images", "projects")
const TRANSCRIPTS = join(HERE, "transcripts")

const wanted = process.argv.slice(2)
const list = wanted.length ? sessions.filter((s) => wanted.includes(s.id)) : sessions

// ---------------------------------------------------------------- ANSI -> HTML
const FG = {
  30: "#3b3f45", 31: "#ff6259", 32: "#4dd66a", 33: "#f0c14b", 34: "#5aa5ff",
  35: "#d67aff", 36: "#4fd0e0", 37: "#e6e6e6",
  90: "#8a8f98", 91: "#ff8b84", 92: "#7ee68f", 93: "#ffd97a", 94: "#8cc2ff",
  95: "#e3a5ff", 96: "#86e4ef", 97: "#ffffff",
}
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

function ansiToHtml(text) {
  let out = ""
  let open = 0
  const state = { color: null, bold: false, dim: false, italic: false }
  const reopen = () => {
    while (open > 0) { out += "</span>"; open-- }
    const style = [
      state.color ? `color:${state.color}` : "",
      state.bold ? "font-weight:600" : "",
      state.dim ? "opacity:.62" : "",
      state.italic ? "font-style:italic" : "",
    ].filter(Boolean).join(";")
    if (style) { out += `<span style="${style}">`; open++ }
  }
  // Split on CSI SGR sequences; everything else (cursor moves, spinner
  // redraws) is dropped rather than printed as mojibake.
  const parts = text.split(/\x1b\[([0-9;]*)m/)
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      out += esc(parts[i].replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "").replace(/\r/g, ""))
    } else {
      for (const raw of (parts[i] || "0").split(";")) {
        const n = Number(raw || "0")
        if (n === 0) { state.color = null; state.bold = state.dim = state.italic = false }
        else if (n === 1) state.bold = true
        else if (n === 2) state.dim = true
        else if (n === 3) state.italic = true
        else if (n === 22) state.bold = state.dim = false
        else if (n === 23) state.italic = false
        else if (n === 39) state.color = null
        else if (FG[n]) state.color = FG[n]
      }
      reopen()
    }
  }
  while (open > 0) { out += "</span>"; open-- }
  return out
}

// ---------------------------------------------------------------- page
function renderHtml(session, blocks) {
  const body = blocks
    .map(
      (b) =>
        `<div class="cmd"><span class="p">$</span> ${esc(b.display)}</div>` +
        `<pre class="out">${ansiToHtml(b.output)}</pre>`
    )
    .join("")
  return `<!doctype html><meta charset="utf-8"><style>
  :root { color-scheme: dark }
  * { box-sizing: border-box }
  body { margin:0; background:#0b0b0d; padding:34px;
         font:13.5px/1.62 ui-monospace,SFMono-Regular,"SF Mono",Menlo,monospace }
  .win { width:${session.width ?? 1180}px; border-radius:11px; overflow:hidden;
         background:#121215; border:1px solid #26262b;
         box-shadow:0 24px 70px rgba(0,0,0,.6) }
  .bar { height:38px; display:flex; align-items:center; gap:8px; padding:0 14px;
         background:linear-gradient(#2b2b30,#232328); border-bottom:1px solid #000 }
  .dot { width:12px; height:12px; border-radius:50% }
  .title { position:absolute; left:0; right:0; text-align:center; color:#a3a7ae;
           font-size:12.5px; font-weight:500; pointer-events:none }
  .barwrap { position:relative }
  .body { padding:16px 18px 20px; color:#e6e6e6 }
  .cmd { color:#e6e6e6; font-weight:600; margin:14px 0 4px }
  .cmd:first-child { margin-top:0 }
  .p { color:#4dd66a; margin-right:8px }
  pre.out { margin:0; white-space:pre-wrap; word-break:break-word; color:#cfd2d6 }
  </style>
  <div class="win"><div class="barwrap"><div class="bar">
    <span class="dot" style="background:#ff5f57"></span>
    <span class="dot" style="background:#febc2e"></span>
    <span class="dot" style="background:#28c840"></span>
    <span class="title">${esc(session.title)}</span>
  </div></div><div class="body">${body}</div></div>`
}

// ---------------------------------------------------------------- run
mkdirSync(TRANSCRIPTS, { recursive: true })
const browser = await chromium.launch()
const summary = []

for (const s of list) {
  console.log(`\n=== ${s.id}`)
  const blocks = []
  let transcript = ""
  for (const step of s.steps) {
    const r = spawnSync("sh", ["-c", step.cmd], {
      cwd: step.cwd ?? s.cwd,
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
      timeout: step.timeout ?? 300_000,
      env: { ...process.env, FORCE_COLOR: "3", TERM: "xterm-256color", CI: "" },
    })
    const raw = (r.stdout ?? "") + (r.stderr ?? "")
    transcript += `$ ${step.display ?? step.cmd}\n${raw}\n`
    const lines = raw.replace(/\n+$/, "").split("\n")
    const kept = step.slice ? step.slice(lines) : lines
    console.log(`  ${step.display ?? step.cmd} -> ${lines.length} lines, kept ${kept.length}`)
    blocks.push({ display: step.display ?? step.cmd, output: kept.join("\n") })
  }

  writeFileSync(join(TRANSCRIPTS, `${s.id}.txt`), transcript)

  const ctx = await browser.newContext({ viewport: { width: (s.width ?? 1180) + 68, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.setContent(renderHtml(s, blocks), { waitUntil: "load" })
  const el = await page.locator(".win")
  mkdirSync(join(OUT, s.id), { recursive: true })
  const file = join(OUT, s.id, `${s.name}.png`)
  await el.screenshot({ path: file })
  await ctx.close()
  console.log(`  shot -> ${file.replace(REPO + "/", "")}`)
  summary.push(`OK    ${s.id}/${s.name}`)
  // Same index capture.mjs writes, so the app reads one list regardless of
  // which harness produced a given shot.
  // Accumulate, do not overwrite: a project can have several terminal
  // sessions (neo-mcp has two, coding-agent three) and the first version of
  // this replaced the whole entry each time, so only the last one survived.
  const INDEX = join(OUT, "shots.json")
  const idx = existsSync(INDEX) ? JSON.parse(readFileSync(INDEX, "utf8")) : {}
  const entry = idx[s.id] ?? { title: s.title, shots: [] }
  entry.title = s.title
  entry.capturedAt = new Date().toISOString()
  entry.shots = [
    ...entry.shots.filter((x) => x.name !== s.name),
    { name: s.name, src: `/images/projects/${s.id}/${s.name}.png`, terminal: true },
  ]
  idx[s.id] = entry
  writeFileSync(INDEX, JSON.stringify(idx, null, 2) + "\n")
}

await browser.close()
console.log("\n---- summary")
summary.forEach((l) => console.log(l))
