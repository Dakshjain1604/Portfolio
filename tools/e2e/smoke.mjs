import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

// Read the expected copy out of the source rather than hardcoding it, so
// editing profile.ts cannot silently break this test (it already did once).
const profileSrc = readFileSync(new URL('../../src/data/profile.ts', import.meta.url), 'utf8');
const availabilityLabel = profileSrc.match(/availability:[\s\S]*?label:\s*"([^"]+)"/)[1];

// Same reasoning as availabilityLabel: read the count out of the data file
// rather than hardcoding it, so adding a project cannot silently make the
// Launchpad assertion vacuous.
const projectsSrc = readFileSync(new URL('../../src/data/projects.ts', import.meta.url), 'utf8');
const projectCount = projectsSrc.match(/export const PROJECT_IDS = \[([\s\S]*?)\] as const/)[1]
  .split(',').filter((s) => s.trim()).length;

const BASE = process.argv[2] || process.env.BASE || 'http://localhost:3000';
const fails = [];
const notes = [];
function check(name, cond, detail = '') {
  (cond ? notes : fails).push(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

const browser = await chromium.launch({ channel: 'chrome' });

// ---------------------------------------------------------------- desktop
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  const bad = [];
  page.on('response', r => {
    // /api/github returns 200 with {error:true} when GITHUB_TOKEN is unset,
    // so it never 404s and needs no exemption. The resume PDF is NOT
    // exempted: it lives in public/ and a 404 there means every download
    // path on the site is broken, which is exactly what this should catch.
    if (r.status() >= 400 && !r.url().includes('/api/github')) bad.push(r.status() + ' ' + r.url());
  });

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(4500);

  // hero / identity
  check('hero shows name', await page.locator('text=Daksh Jain').first().isVisible());
  check('hero shows availability', await page.getByText(availabilityLabel).first().isVisible(), availabilityLabel);
  check('no window auto-opens', (await page.locator('[role="region"]').count()) === 0,
    `${await page.locator('[role="region"]').count()} open`);

  // wallpaper actually loaded (not the css fallback)
  // Match the wallpaper specifically. This used to be `img[data-nimg]`,
  // which resolved to whichever project screenshot happened to come first in
  // the always-present ReaderView tree - so it passed while asserting
  // nothing about the wallpaper at all.
  const wp = await page.evaluate(() => {
    const i = [...document.querySelectorAll('img[data-nimg]')].find((el) =>
      decodeURIComponent(el.currentSrc || el.src).includes('/wallpapers/')
    );
    return i ? { ok: i.complete && i.naturalWidth > 0, src: decodeURIComponent(i.currentSrc).slice(-52) } : null;
  });
  check('wallpaper image decoded', !!wp && wp.ok, wp ? wp.src : 'no img element');

  // open every app from the dock, confirm each mounts a window with content
  //
  // Scoped to aria-label^="Open ", not every button in the Dock: the Dock
  // also holds Launchpad, which opens a full-screen overlay rather than a
  // window. An index-based selector picked it up as "app 1", and the
  // overlay's own backdrop then intercepted every later click - so this
  // matches on what an app tile actually says instead of on position, which
  // also survives the next reordering.
  const dock = page.locator('nav[aria-label="Dock"] button[aria-label^="Open "]:not([aria-label*="Launchpad"])');
  const dockCount = await dock.count();
  check('dock has 8 app icons', dockCount === 8, `${dockCount}`);

  // Launchpad is its own thing: one tile, an overlay, one tile per project.
  {
    await page.mouse.move(720, 300);
    await page.getByRole('button', { name: /Open Launchpad/ }).click();
    await page.waitForTimeout(700);
    const tiles = await page.locator('[aria-label="Launchpad"] li button').count();
    check('launchpad opens with a tile per project', tiles === projectCount, `${tiles} of ${projectCount}`);
    const shots = await page.evaluate(() =>
      [...document.querySelectorAll('[aria-label="Launchpad"] li img')].every((i) => i.complete && i.naturalWidth > 0)
    );
    check('every launchpad tile screenshot decoded', shots);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    check('launchpad closes on Escape', (await page.locator('[aria-label="Launchpad"]').count()) === 0);
  }

  // One at a time: open, assert it mounted with real content, close it via
  // its traffic light. Opening all ten at once cascades the last windows
  // over the Dock, which is correct macOS behaviour but makes the later
  // icons genuinely unclickable - a test artefact, not a bug.
  for (let i = 0; i < dockCount; i++) {
    await page.mouse.move(720, 300);            // reset Dock magnification
    await dock.nth(i).click();
    await page.waitForTimeout(850);
    const t = await page.evaluate(() => {
      const r = [...document.querySelectorAll('[role="region"]')];
      const last = r[r.length - 1];
      return last ? { label: last.getAttribute('aria-label'), text: (last.innerText || '').length } : null;
    });
    check(`app ${i} opens with content`, !!t && t.text > 20, t ? `${t.label} (${t.text} chars)` : 'no window');

    try {
      await page.locator('button[aria-label^="Close "]').last().click({ timeout: 8000 });
      await page.waitForTimeout(500);
    } catch (e) {
      check(`app ${i} close button clickable`, false, e.message.split('\n')[0]);
    }
    const left = await page.locator('[role="region"]').count();
    check(`app ${i} closes`, left === 0, `${left} left`);
    // recover so one bad app does not cascade into every later assertion
    while ((await page.locator('[role="region"]').count()) > 0) {
      await page.evaluate(() => {
        const b = [...document.querySelectorAll('button[aria-label^="Close "]')].pop();
        b?.click();
      });
      await page.waitForTimeout(300);
    }
  }

  // stacking / focus, with a count that does not reach the Dock
  for (const i of [0, 1, 2, 4]) {
    await page.mouse.move(720, 300);
    await dock.nth(i).click();
    await page.waitForTimeout(700);
  }
  check('4 windows stack', (await page.locator('[role="region"]').count()) === 4,
    `${await page.locator('[role="region"]').count()}`);

  // mission control
  await page.keyboard.press('F3');
  await page.waitForTimeout(1200);
  check('Mission Control entered', await page.evaluate(() => document.body.dataset.mode !== 'reader'));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);

  // close the rest through the menu bar, the path that always works
  while ((await page.locator('[role="region"]').count()) > 0) {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[aria-label^="Close "]')].pop();
      b?.click();
    });
    await page.waitForTimeout(350);
  }
  check('all windows closed', (await page.locator('[role="region"]').count()) === 0);

  // hero returns after closing
  check('hero visible again after close', await page.getByText(availabilityLabel).first().isVisible());

  check('no console errors (desktop)', errors.length === 0, errors.slice(0, 3).join(' | '));
  check('no failed requests (desktop)', bad.length === 0, bad.slice(0, 3).join(' | '));
  await ctx.close();
}

// ----------------------------------------------------------------- reader
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(1200);
  const txt = await page.evaluate(() => document.body.innerText);
  check('no-JS: name present', txt.includes('Daksh Jain'));
  const skillsTxt = await page.evaluate(() => {
    const h = document.getElementById('skills-h');
    return h ? h.parentElement.innerText : '';
  });
  check('no-JS: trimmed skills gone from Skills section',
    !/\bJWT\b|\bOAuth2\b|\bCI\/CD\b|\bGit\b/.test(skillsTxt), skillsTxt.slice(0, 120));
  check('no-JS: h1 exactly one', (await page.locator('h1').count()) === 1, `${await page.locator('h1').count()}`);
  await ctx.close();
}

// ----------------------------------------------------------------- mobile
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(4000);
  check('mobile: widget shows name', await page.locator('header').getByText('Daksh Jain').first().isVisible());
  const tiles = await page.$$('main button, main a');
  const expectedTiles = 8 + 2 + projectCount;
  check(
    `mobile: ${expectedTiles} tiles (8 apps + 2 links + ${projectCount} projects)`,
    tiles.length === expectedTiles,
    `${tiles.length}`
  );
  // The projects section is below the fold and the springboard now scrolls,
  // so a tile can exist in the DOM and still never be reachable.
  const lastProjectVisible = await page
    .locator('main button')
    .last()
    .scrollIntoViewIfNeeded()
    .then(() => page.locator('main button').last().isVisible())
    .catch(() => false);
  check('mobile: last project tile is reachable by scrolling', lastProjectVisible);
  check('mobile: no page errors', errors.length === 0, errors.slice(0, 2).join(' | '));
  await ctx.close();
}

await browser.close();

console.log('\n' + notes.join('\n'));
if (fails.length) {
  console.log('\n================ FAILURES ================');
  console.log(fails.join('\n'));
  process.exitCode = 1;
} else {
  console.log('\n================ ALL CHECKS PASSED ================');
}
