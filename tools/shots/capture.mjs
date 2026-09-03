/**
 * Run each project for real, then photograph it.
 *
 *   node tools/shots/capture.mjs              # every target in the manifest
 *   node tools/shots/capture.mjs soh_ships    # just these
 *   KEEP=1 node tools/shots/capture.mjs x     # leave services running to debug
 *
 * Writes public/images/projects/<id>/<shot>.png plus a shots.json index of
 * what actually succeeded. A target that fails to start is reported and
 * skipped - it never leaves a stale or invented image behind.
 */
import { chromium } from "playwright"
import { spawn, spawnSync } from "node:child_process"
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs"
import { createHash } from "node:crypto"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { targets, byId } from "./manifest.mjs"

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, "..", "..")
const OUT = join(REPO, "public", "images", "projects")
const INDEX = join(OUT, "shots.json")

const VIEWPORT = { width: 1440, height: 900 }
const SCALE = 2
const START_TIMEOUT = 180_000

const wanted = process.argv.slice(2)
const list = wanted.length ? wanted.map((id) => byId[id] ?? die(`unknown target: ${id}`)) : targets

function die(msg) {
  console.error(msg)
  process.exit(1)
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Spawned in its own process group so killing it takes the whole tree -
 *  `npx vite` and `next dev` both fork children that outlive a plain kill. */
function start(svc, root) {
  const child = spawn("sh", ["-c", svc.cmd], {
    cwd: join(root, svc.cwd ?? "."),
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, BROWSER: "none", FORCE_COLOR: "0" },
  })
  const log = []
  const keep = (b) => {
    log.push(b.toString())
    if (log.length > 200) log.shift()
  }
  child.stdout.on("data", keep)
  child.stderr.on("data", keep)
  child.on("error", (e) => log.push(String(e)))
  return { child, log, name: svc.name }
}

function stop(proc) {
  if (!proc?.child?.pid) return
  try {
    process.kill(-proc.child.pid, "SIGKILL")
  } catch {
    try {
      proc.child.kill("SIGKILL")
    } catch {}
  }
}

async function waitReady(url, deadline, proc) {
  while (Date.now() < deadline) {
    if (proc.child.exitCode !== null) return false
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) })
      if (res.status < 500) return true
    } catch {}
    await sleep(1000)
  }
  return false
}

const results = {}
const summary = []

const browser = await chromium.launch()

for (const t of list) {
  console.log(`\n=== ${t.id}  (${t.root})`)
  // A target whose `prepare` clones its own checkout starts with no root at
  // all - the directory is the thing prepare creates. Only skip when there
  // is nothing that could create it.
  if (!existsSync(t.root)) {
    if (!t.prepare?.length) {
      summary.push(`SKIP  ${t.id} — checkout not found`)
      continue
    }
    mkdirSync(t.root, { recursive: true })
  }

  const running = []
  let ok = true
  try {
    // Declared, idempotent fixups a checkout needs to run outside its own
    // container. Kept here rather than done by hand so re-running the
    // harness on a fresh clone still works, and so nothing is quietly
    // mutated in a repo without it being visible in the manifest.
    for (const cmd of t.prepare ?? []) {
      const r = spawnSync("sh", ["-c", cmd], { cwd: t.root, encoding: "utf8" })
      console.log(`  prepare: ${cmd}${r.status ? ` (exit ${r.status}) ${r.stderr?.trim()}` : ""}`)
    }

    for (const svc of t.services) {
      const proc = start(svc, t.root)
      running.push(proc)
      process.stdout.write(`  ${svc.name}: starting… `)
      const up = await waitReady(svc.ready, Date.now() + START_TIMEOUT, proc)
      if (up) {
        console.log("up")
      } else if (svc.optional) {
        console.log("did not start (optional, continuing)")
        console.log(indent(proc.log.join("").slice(-800)))
      } else {
        console.log("FAILED")
        console.log(indent(proc.log.join("").slice(-2000)))
        summary.push(`FAIL  ${t.id} — service "${svc.name}" never became ready`)
        ok = false
        break
      }
    }
    if (!ok) continue

    const ctx = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: SCALE,
      colorScheme: "dark",
      reducedMotion: "reduce",
    })
    const page = await ctx.newPage()
    const errors = []
    page.on("pageerror", (e) => errors.push(e.message))

    mkdirSync(join(OUT, t.id), { recursive: true })
    const shots = []
    for (const s of t.shots) {
      const url = t.base + s.path
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 })
      } catch (e) {
        summary.push(`FAIL  ${t.id}/${s.name} — ${e.message.split("\n")[0]}`)
        continue
      }
      if (s.waitFor) await page.waitForSelector(s.waitFor, { timeout: 30_000 }).catch(() => {})
      for (const a of s.actions ?? []) await a(page).catch(() => {})
      await page.waitForTimeout(s.settle ?? 4000)

      const file = join(OUT, t.id, `${s.name}.png`)
      await page.screenshot({ path: file, fullPage: false })
      const bytes = readFileSync(file)
      const kb = Math.round(bytes.length / 1024)

      // An action that silently misses - a renamed button, a modal that never
      // opened - produces a shot identical to the one before it, and a
      // gallery of duplicates is worse than a gallery with a gap. `actions`
      // deliberately swallow their own errors so one bad selector cannot
      // abort a whole target, so this is the check that notices.
      const hash = createHash("sha1").update(bytes).digest("hex")
      const dupe = shots.find((x) => x.hash === hash)
      if (dupe) {
        console.log(`  shot ${s.name} → IDENTICAL to "${dupe.name}" — its actions did not change the page`)
        summary.push(`DUPE  ${t.id}/${s.name} — same pixels as ${dupe.name}`)
      } else {
        console.log(`  shot ${s.name} → ${file.replace(REPO + "/", "")} (${kb} KB)`)
      }
      shots.push({ name: s.name, src: `/images/projects/${t.id}/${s.name}.png`, url, hash })
    }
    if (errors.length) console.log(`  page errors: ${errors.slice(0, 3).join(" | ")}`)
    await ctx.close()

    if (shots.length) {
      results[t.id] = {
        title: t.title,
        capturedAt: new Date().toISOString(),
        shots: shots.map(({ hash, ...rest }) => rest),
      }
      summary.push(`OK    ${t.id} — ${shots.length} shot(s)`)
    } else {
      summary.push(`FAIL  ${t.id} — no shots captured`)
    }
  } finally {
    if (!process.env.KEEP) running.forEach(stop)
  }
}

await browser.close()

// Merge into the index rather than replacing it, so capturing one target
// does not erase the record of the others.
const prev = existsSync(INDEX) ? JSON.parse(readFileSync(INDEX, "utf8")) : {}
writeFileSync(INDEX, JSON.stringify({ ...prev, ...results }, null, 2) + "\n")

console.log("\n---- summary")
summary.forEach((l) => console.log(l))
const failed = summary.filter((l) => l.startsWith("FAIL") || l.startsWith("DUPE")).length
process.exit(failed ? 1 : 0)

function indent(s) {
  return s
    .split("\n")
    .map((l) => "    | " + l)
    .join("\n")
}
