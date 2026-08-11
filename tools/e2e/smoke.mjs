import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

// Read the expected copy out of the source rather than hardcoding it, so
// editing profile.ts cannot silently break this test (it already did once).
const profileSrc = readFileSync(new URL('../../src/data/profile.ts', import.meta.url), 'utf8');
const availabilityLabel = profileSrc.match(/availability:[\s\S]*?label:\s*"([^"]+)"/)[1];

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
  const dock = page.locator('nav[aria-label="Dock"] button');
  const dockCount = await dock.count();
  check('dock has 10 app icons', dockCount === 10, `${dockCount}`);

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

    // Writing is dock index 3 - confirm a real post body rendered
    if (i === 3) {
      check('Writing app rendered a post body',
        await page.getByText('During a drag or a resize, React state is never touched').first().isVisible().catch(() => false));
    }

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

// ------------------------------------------------- writing narrow drill-down
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(4500);
  await page.locator('nav[aria-label="Dock"] button').nth(3).click();   // Writing
  await page.waitForTimeout(1200);

  // Shrink the WINDOW (not the viewport) below the 560px container
  // breakpoint by dragging its east resize handle - a real interaction.
  // Assigning style.width instead gets clobbered the moment Motion next
  // writes the bound width, which silently un-narrowed the window mid-test.
  const box = await page.locator('[role="region"]').first().boundingBox();
  await page.mouse.move(box.x + box.width - 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 440, box.y + box.height / 2, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(700);
  const nowW = (await page.locator('[role="region"]').first().boundingBox()).width;
  check('window resized below the 560px breakpoint', nowW < 560, `window is ${Math.round(nowW)}px`);

  const listW = await page.evaluate(() => {
    const nav = document.querySelector('[role="region"] nav[aria-label="Posts"]');
    return nav ? Math.round(nav.getBoundingClientRect().width) : -1;
  });
  check('narrow: post list fills the window (not a 260px rail)', listW > 300, `list is ${listW}px`);

  const articleHiddenBefore = await page.evaluate(() => {
    const a = document.querySelector('[role="region"] article');
    return !a || a.getBoundingClientRect().width === 0;
  });
  check('narrow: article hidden until a post is picked', articleHiddenBefore);

  await page.locator('nav[aria-label="Posts"] button').nth(1).click();
  await page.waitForTimeout(700);
  const afterPick = await page.evaluate(() => {
    const nav = document.querySelector('[role="region"] nav[aria-label="Posts"]');
    const a = document.querySelector('[role="region"] article');
    return { navW: nav ? nav.getBoundingClientRect().width : -1, artW: a ? a.getBoundingClientRect().width : 0 };
  });
  check('narrow: picking a post shows the article', afterPick.artW > 300, `article ${Math.round(afterPick.artW)}px`);
  check('narrow: list hides while reading', afterPick.navW === 0, `list ${Math.round(afterPick.navW)}px`);

  const backVisible = await page.getByRole('button', { name: /All posts/ }).first().isVisible().catch(() => false);
  check('narrow: back button present', backVisible);
  if (backVisible) {
    await page.getByRole('button', { name: /All posts/ }).first().click();
    await page.waitForTimeout(600);
    const backW = await page.evaluate(() => {
      const nav = document.querySelector('[role="region"] nav[aria-label="Posts"]');
      return nav ? Math.round(nav.getBoundingClientRect().width) : -1;
    });
    check('narrow: back returns to the list', backW > 300, `list ${backW}px`);
  }
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
  check('no-JS: writing section present', txt.includes('Writing'));
  check('no-JS: full post body crawlable', txt.includes('During a drag or a resize, React state is never touched'));
  check('no-JS: all 4 post titles present',
    ['drag handler', 'square for weeks', 'Liquid Glass', 'forgot to put my name'].every(s => txt.includes(s)));
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
  check('mobile: 12 tiles (10 apps + 2 links)', tiles.length === 12, `${tiles.length}`);
  // scoped to the springboard grid: an unscoped match also hits the inert
  // ReaderView tree, which is always in the DOM as a sibling
  await page.locator('main').getByText('Writing', { exact: true }).first().click();
  await page.waitForTimeout(1500);
  const sheet = await page.evaluate(() => {
    const inert = document.getElementById('reader');
    const clone = document.body.cloneNode(true);
    clone.querySelector('#reader')?.remove();
    return (clone.innerText || clone.textContent || '').includes('drag handler') && !!inert;
  });
  check('mobile: Writing sheet opens with content', sheet);
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
