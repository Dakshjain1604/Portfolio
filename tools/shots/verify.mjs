import { chromium } from "playwright"
const BASE = process.env.BASE || "http://127.0.0.1:3200"
const OUT = process.argv[2] || "/tmp/verify"
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()
const errs = []
page.on("pageerror", (e) => errs.push(e.message))
page.on("console", (m) => m.type() === "error" && errs.push(m.text()))
await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 120000 })
await page.waitForTimeout(6000)
await page.screenshot({ path: `${OUT}/1-desktop.png` })

// Launchpad
await page.getByRole("button", { name: /Open Launchpad/ }).click()
await page.waitForTimeout(1200)
await page.screenshot({ path: `${OUT}/2-launchpad.png` })

// open a project
await page.getByRole("button", { name: /^Open SOH Ships/ }).click()
await page.waitForTimeout(1600)
await page.screenshot({ path: `${OUT}/3-project.png` })

console.log("errors:", errs.slice(0, 6))
await browser.close()
