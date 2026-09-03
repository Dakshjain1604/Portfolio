/**
 * Measured contrast for every piece of text that sits on the wallpaper.
 *
 *   node tools/e2e/contrast.mjs http://localhost:3105
 *
 * Not a token audit. Everything checked here sits on a `backdrop-filter`
 * surface — the Launchpad and Mission Control scrims, the desktop, the
 * mobile springboard — so the colour behind the text depends on the
 * wallpaper, the blur, and the scrim, and cannot be derived from CSS. This
 * screenshots the real page, samples the pixels actually behind each label,
 * composites the text colour over them, and reports the WCAG ratio.
 *
 * It found a real one: `--wp-text` is near-black in the light theme, but the
 * Launchpad and Mission Control scrims were a fixed `brightness(0.45..0.55)`,
 * so light-theme labels were dark ink on a permanently darkened backdrop -
 * 2.74:1 and 1.05:1 measured.
 *
 * Selectors here have to be exact. An early version used `li span` for the
 * Mission Control label, which matched a span inside the card's *live app
 * content* instead, and cheerfully reported an unchanged number across a fix
 * that had actually landed.
 *
 * Both themes are exercised, because that is exactly the axis the bug lived
 * on. Exits non-zero if anything is under the 4.5:1 body-text floor.
 */
import { chromium } from "playwright"
import { readFileSync, unlinkSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import sharp from "sharp"

const BASE = process.argv[2] || process.env.BASE || "http://localhost:3105"
const MIN = 4.5

const srgb = (c) => {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
/** `color` may carry alpha; text is painted over whatever is behind it. */
const over = (fg, bg) => fg.slice(0, 3).map((c, i) => Math.round(c * fg[3] + bg[i] * (1 - fg[3])))

function parseColor(css) {
  const n = css.match(/[\d.]+/g).map(Number)
  return [n[0], n[1], n[2], n.length > 3 ? n[3] : 1]
}

const results = []
const browser = await chromium.launch()

/**
 * Setting `document.documentElement.dataset.theme` after load does not work,
 * and the first version of this file did exactly that and silently measured
 * the light theme twice. DesktopShell re-applies the *store's* preference in
 * a post-mount effect, and the default preference is "auto", whose apply
 * step deletes the attribute. So the preference has to be seeded the way a
 * returning visitor would have it - in localStorage, before any script runs.
 * `colorScheme` is matched too so the media-query path agrees with it.
 */
async function newThemedContext(theme, viewport, dpr, mobile = false) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: dpr,
    colorScheme: theme,
    ...(mobile ? { isMobile: true, hasTouch: true } : {}),
  })
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem("os-theme", t)
    } catch {}
  }, theme)
  return ctx
}

/**
 * Samples the strip immediately below a label rather than the label's own
 * box: the box is mostly text pixels, and averaging those gives the ink
 * back, not the background. The gap under a line of text is the same
 * composited surface with nothing drawn on it.
 */
async function measure(page, { name, selector, theme }) {
  const el = page.locator(selector).first()
  if (!(await el.count())) {
    results.push({ name, theme, ratio: null, note: "not found" })
    return
  }
  const box = await el.boundingBox()
  const color = parseColor(await el.evaluate((n) => getComputedStyle(n).color))

  const file = join(tmpdir(), `contrast-${Date.now()}.png`)
  await page.screenshot({ path: file })
  const img = sharp(file)
  const { width, height } = await img.metadata()
  const dpr = width / page.viewportSize().width

  const strip = {
    left: Math.max(0, Math.round(box.x * dpr)),
    top: Math.min(height - 4, Math.round((box.y + box.height + 2) * dpr)),
    width: Math.max(4, Math.min(Math.round(box.width * dpr), width - Math.round(box.x * dpr))),
    height: Math.max(3, Math.round(4 * dpr)),
  }
  const { data, info } = await sharp(file).extract(strip).raw().toBuffer({ resolveWithObject: true })
  unlinkSync(file)

  let r = 0, g = 0, b = 0
  const px = info.width * info.height
  for (let i = 0; i < px; i++) {
    r += data[i * info.channels]
    g += data[i * info.channels + 1]
    b += data[i * info.channels + 2]
  }
  const bg = [r / px, g / px, b / px]
  results.push({ name, theme, ratio: contrast(over(color, bg), bg), bg: bg.map(Math.round) })
}

for (const theme of ["dark", "light"]) {
  const ctx = await newThemedContext(theme, { width: 1440, height: 900 }, 2)
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: "domcontentloaded" })
  await page.waitForTimeout(4500)

  await measure(page, { name: "desktop icon label", selector: "ul li button > span", theme })

  await page.getByRole("button", { name: /Open Launchpad/ }).click()
  await page.waitForTimeout(1400)
  await measure(page, { name: "launchpad card label", selector: '[aria-label="Launchpad"] li p', theme })
  await page.keyboard.press("Escape")
  await page.waitForTimeout(600)

  // Mission Control needs two windows before it will show anything.
  await page.getByRole("button", { name: "Open Projects" }).click()
  await page.waitForTimeout(700)
  await page.getByRole("button", { name: "Open Terminal" }).click()
  await page.waitForTimeout(900)
  await page.keyboard.press("F3")
  await page.waitForTimeout(1200)
  // `li span` matched a span *inside* the card, which renders a live app and
  // is full of them - so this silently measured a panel, not the label, and
  // reported the same 1.05 before and after the scrim was fixed. The label is
  // the direct span child of the card's role="button".
  await measure(page, {
    name: "mission control label",
    selector: '[aria-label="Mission Control"] div[role="button"] > span',
    theme,
  })

  await ctx.close()
}

// mobile springboard labels sit on the wallpaper with no scrim at all
for (const theme of ["dark", "light"]) {
  const ctx = await newThemedContext(theme, { width: 400, height: 860 }, 3, true)
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: "domcontentloaded" })
  await page.waitForTimeout(4500)
  await measure(page, { name: "springboard project label", selector: "main ul li button span", theme })
  await ctx.close()
}

await browser.close()

console.log(`\n  ${"surface".padEnd(28)} ${"theme".padEnd(7)} ratio   background`)
console.log("  " + "-".repeat(62))
let failed = 0
for (const r of results) {
  if (r.ratio === null) {
    console.log(`  ${r.name.padEnd(28)} ${r.theme.padEnd(7)} —       ${r.note}`)
    continue
  }
  const ok = r.ratio >= MIN
  if (!ok) failed++
  console.log(
    `  ${r.name.padEnd(28)} ${r.theme.padEnd(7)} ${r.ratio.toFixed(2).padStart(5)}   rgb(${r.bg.join(" ")})  ${ok ? "PASS" : "FAIL"}`
  )
}
console.log(`\n  floor ${MIN}:1 — ${failed ? `${failed} FAILING` : "all pass"}\n`)
process.exit(failed ? 1 : 0)
