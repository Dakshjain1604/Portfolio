import { chromium } from 'playwright';

/**
 * Measures colour cast in the window chrome, for every app, on any wallpaper.
 *
 *   node tools/e2e/glass-audit.mjs http://localhost:3000 ember
 *
 * Exists because "the windows look blue" is not something you can settle by
 * looking. Eyeballing one window on one wallpaper is how the first attempt
 * at this fix missed: the content plate was corrected and the frame, which
 * is most of what you actually see of a window, was left at 43 points of
 * chroma.
 *
 * Samples three points per window - title bar, the frame gutter between
 * panes, and the content surface - and reports how far each sits off the
 * neutral grey axis. Chroma at or under ~12 on a dark surface is
 * imperceptible; the frame measured 58 before the fix and 3 after, on the
 * most saturated wallpaper of the three.
 */

const BASE = process.argv[2] || 'http://localhost:3100';

// How far a sampled pixel sits off the neutral grey axis. 0 = perfectly
// neutral. Anything above ~6 starts reading as "the window is tinted".
function chroma([r, g, b]) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}
function hue([r, g, b]) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return '-';
  let h;
  if (mx === r) h = ((g - b) / d) % 6;
  else if (mx === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return h >= 190 && h <= 260 ? `${h}° BLUE` : `${h}°`;
}

const b = await chromium.launch({ channel: 'chrome' });
const page = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(4500);
await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });

// Optional: cycle to a named wallpaper first. ember is the worst case, the
// most saturated of the three.
const want = process.argv[3];
if (want) {
  const order = ['abyss', 'aurora', 'ember', 'mesh'];
  const steps = (order.indexOf(want) + order.length) % order.length;
  for (let k = 0; k < steps; k++) {
    await page.mouse.click(154, 14); await page.waitForTimeout(320);
    await page.locator('[role="menu"] >> text=Change Wallpaper').first().click();
    await page.waitForTimeout(1200);
  }
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
}

const dock = page.locator('nav[aria-label="Dock"] button');
const n = await dock.count();
const rows = [];

for (let i = 0; i < n; i++) {
  await page.mouse.move(720, 300);
  await dock.nth(i).click();
  await page.waitForTimeout(1300);

  const win = page.locator('[role="region"]').last();
  const label = await win.getAttribute('aria-label');
  const box = await win.boundingBox();
  if (!box) continue;

  // Sample points inside the window: titlebar, the frame gutter between
  // panes, and whatever surface sits at the middle of the content area.
  const pts = {
    titlebar: [box.x + box.width * 0.5, box.y + 12],
    gutter: [box.x + 5, box.y + box.height * 0.6],
    body: [box.x + box.width * 0.62, box.y + box.height * 0.75],
  };

  const shot = await page.screenshot({ clip: box });
  const px = await page.evaluate(async ([b64, pts, box]) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    const out = {};
    for (const [k, [x, y]] of Object.entries(pts)) {
      const d = g.getImageData(Math.round(x - box.x), Math.round(y - box.y), 1, 1).data;
      out[k] = [d[0], d[1], d[2]];
    }
    return out;
  }, [shot.toString('base64'), pts, box]);

  rows.push({ label, ...px });

  await page.evaluate(() => {
    [...document.querySelectorAll('button[aria-label^="Close "]')].pop()?.click();
  });
  await page.waitForTimeout(450);
}

console.log('\n' + 'window'.padEnd(20) + 'titlebar'.padEnd(26) + 'frame gutter'.padEnd(26) + 'content body');
console.log('-'.repeat(96));
let worst = 0;
for (const r of rows) {
  const fmt = (p) => `rgb(${p.join(',')}) c=${String(chroma(p)).padStart(2)} ${hue(p)}`;
  console.log(
    r.label.padEnd(20) + fmt(r.titlebar).padEnd(26) + fmt(r.gutter).padEnd(26) + fmt(r.body)
  );
  worst = Math.max(worst, chroma(r.titlebar), chroma(r.gutter), chroma(r.body));
}
console.log('-'.repeat(96));
console.log('worst chroma anywhere:', worst, worst > 12 ? '  <-- visibly tinted' : '  (reads neutral; <=12 on a dark surface is imperceptible)');
await b.close();
if (worst > 12) process.exitCode = 1;
