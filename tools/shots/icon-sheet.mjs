/**
 * Contact sheet of the baked app tiles, at the sizes they are actually
 * drawn at. Run after `icons.mjs` to judge a crop before shipping it —
 * picking these by eye on one tile is how the first two attempts went
 * wrong.
 *
 *   node tools/shots/icons.mjs && node tools/shots/icon-sheet.mjs /tmp/tiles.png
 */
import { chromium } from "playwright"
import { readFileSync } from "node:fs"

const idx = JSON.parse(readFileSync("public/images/projects/icons.json", "utf8"))
const items = Object.entries(idx).map(([id, v]) => ({ id, icon: v.out }))
const SIZES = [52, 72, 96, 112, 132]

const tile = (img, size) => `
<div style="width:${size}px;height:${size}px;border-radius:22.5%;overflow:hidden;position:relative;
            box-shadow:0 2px 6px -1px rgb(0 0 0/.45)">
  <img src="${img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
  <span style="position:absolute;inset:0;border-radius:22.5%;
        box-shadow:inset 0 0 0 .5px rgb(255 255 255/.18), inset 0 -8px 14px -8px rgb(0 0 0/.5)"></span>
</div>`

const rows = items
  .map(
    (p) => `<tr><td style="color:#ddd;font:12px system-ui;padding-right:16px;white-space:nowrap">${p.id}</td>
${SIZES.map((s) => `<td style="padding:9px;vertical-align:middle">${tile(p.icon, s)}</td>`).join("")}</tr>`
  )
  .join("")
const head = `<tr><td></td>${SIZES.map(
  (s) => `<td style="color:#8a8f98;font:10px ui-monospace;text-align:center;padding-bottom:6px">${s}px</td>`
).join("")}</tr>`

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 900, height: 1400 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()
// robots.txt, not "/": the app hydrates and React immediately owns <body>.
await page.goto((process.env.BASE || "http://localhost:3000") + "/robots.txt", { waitUntil: "domcontentloaded" })
await page.setContent(
  `<!doctype html><meta charset=utf-8><body style="margin:0;background:#2c3038;padding:24px">` +
    `<table id="sheet" style="border-collapse:collapse">${head}${rows}</table></body>`,
  { waitUntil: "load" }
)
await page.waitForTimeout(1800)
await page.locator("#sheet").screenshot({ path: process.argv[2] || "/tmp/tiles.png" })
await browser.close()
console.log("ok —", items.length, "tiles")
