import { chromium } from 'playwright';
import path from 'path';

const W = 2880, H = 1800;

// Shared geometry. Only seed / angle / palette change between the three,
// so the set reads as one family rather than three unrelated images.
const G = {
  scale: 1.0, bands: 2.2, gamma: 1.45, warp: 0.65, oct: 3, gain: 0.5, phase: 0.9,
  mix: 0.68, lightR: 1.4, liftBy: 0.22, sheen: 0.05, vignette: 0.40,
  // Grain is 0 here on purpose: Wallpaper.tsx already composites an SVG
  // noise layer at 0.035 over whatever is behind it, and baked grain is
  // what makes a smooth dark gradient expensive to JPEG.
  grain: 0,
};

const SPECS = [
  {
    ...G, name: 'abyss', seed: 9001, angle: 0.14, light: [0.22, 0.16],
    stops: [[0.00, '#04050c'], [0.30, '#0a1230'], [0.55, '#123566'],
            [0.78, '#1f5aa8'], [0.92, '#3f86d8'], [1.00, '#84b4f0']],
  },
  {
    ...G, name: 'aurora', seed: 24601, angle: 0.68, light: [0.18, 0.14],
    stops: [[0.00, '#03090a'], [0.30, '#07201f'], [0.55, '#0d4a40'],
            [0.78, '#137a63'], [0.92, '#2bab8b'], [1.00, '#74d8b6']],
  },
  {
    ...G, name: 'ember', seed: 31415, angle: -0.92, light: [0.78, 0.14],
    stops: [[0.00, '#08050e'], [0.30, '#190e26'], [0.55, '#3d1a54'],
            [0.78, '#6c2c8e'], [0.92, '#9d55bd'], [1.00, '#c894e2']],
  },
];

// Light-appearance companions, same identities (abyss/aurora/ember), same
// seed/angle/light-position per pair so the structure is recognizably the
// same image - only the tonal direction inverts.
//
// First pass here (gamma 0.68, stops never darker than ~#c7d8ef) treated
// "the wallpaper's darkest 5% must be near-white" as the constraint, on the
// assumption that --wp-text needed a near-white floor to clear 4.5:1. It
// does not: --wp-text is black at 85% *alpha*, not solid black, so the
// rendered pixel is already ~85% of the way to black regardless of what is
// behind it (rgb(0 0 0 / .85) over white composites to ~38,38,38; over a
// mid-tone background around srgb 140 it still composites to ~21,21,21).
// Measured contrast stays above 4.5:1 down to roughly srgb 120 for the
// background - so the real floor is "not too dark," not "barely off-white."
// The first pass left most of that headroom on the table and shipped a
// wallpaper with almost no visible structure - "can't see anything there."
// `gamma` 0.85 (vs. the dark set's 1.45, still the same inverted-shape
// relationship, just less extreme) and ramps that start at a real muted
// mid-tone of the hue, not a pastel, are what use that headroom.
const GL = { ...G, gamma: 0.85, vignette: 0.12 };

const LIGHT_SPECS = [
  {
    ...GL, name: 'abyss-light', seed: 9001, angle: 0.14, light: [0.22, 0.16],
    stops: [[0.00, '#6681ab'], [0.30, '#7996c2'], [0.55, '#a3bfe0'],
            [0.78, '#c9dcf0'], [0.92, '#e8f0fa'], [1.00, '#ffffff']],
  },
  {
    ...GL, name: 'aurora-light', seed: 24601, angle: 0.68, light: [0.18, 0.14],
    stops: [[0.00, '#5c9886'], [0.30, '#6cab97'], [0.55, '#9bc9b8'],
            [0.78, '#c3e2d7'], [0.92, '#e6f4ef'], [1.00, '#ffffff']],
  },
  {
    ...GL, name: 'ember-light', seed: 31415, angle: -0.92, light: [0.78, 0.14],
    stops: [[0.00, '#9b7bb5'], [0.30, '#a888c2'], [0.55, '#c4aed8'],
            [0.78, '#dfd1ea'], [0.92, '#f2ecf7'], [1.00, '#ffffff']],
  },
];

const outDir = process.argv[2];
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1200, height: 800 } });
await p.goto('file://' + path.resolve(import.meta.dirname, 'generator.html'));

for (const spec of [...SPECS, ...LIGHT_SPECS]) {
  await p.evaluate(([s, w, h]) => window.render(s, w, h), [spec, W, H]);
  await (await p.$('#c')).screenshot({ path: path.join(outDir, spec.name + '.png') });
  const stats = await p.evaluate(() => {
    const c = document.getElementById('c');
    const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let sum = 0, n = 0; const hist = new Array(101).fill(0);
    for (let i = 0; i < g.length; i += 4 * 37) {
      const L = 0.2126 * g[i] + 0.7152 * g[i + 1] + 0.0722 * g[i + 2];
      sum += L; hist[Math.round(L / 255 * 100)]++; n++;
    }
    let acc = 0, p95 = 0;
    for (let i = 0; i <= 100; i++) { acc += hist[i]; if (acc > n * 0.95) { p95 = i; break; } }
    let acc5 = 0, p5 = 100;
    for (let i = 100; i >= 0; i--) { acc5 += hist[i]; if (acc5 > n * 0.95) { p5 = i; break; } }
    // Two worst cases, reported for every image regardless of intended
    // text color: white text over the brightest 5% (the dark-wallpaper
    // case, --wp-text dark) and --wp-text light (black at .85 alpha, not
    // solid black) over the darkest 5% (the light-wallpaper case). Proper
    // sRGB linearization both ways, and the black case composites the
    // real alpha rather than assuming pure black - assuming pure black is
    // what made the first light-wallpaper pass over-correct for a contrast
    // floor that was never actually that strict.
    const toLin = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
    const p95srgb = (p95 / 100) * 255, p5srgb = (p5 / 100) * 255;
    const Lbg95 = toLin(p95srgb), Lbg5 = toLin(p5srgb);
    const textOnDark = toLin(255 * 0.92); // --wp-text dark: white at .92 alpha over near-black
    const textOnLight = toLin(p5srgb * (1 - 0.85)); // --wp-text light: black at .85 alpha, composited
    return {
      mean: (sum / n / 255 * 100).toFixed(1), p5, p95,
      contrastWhite: ((Math.max(textOnDark, Lbg95) + 0.05) / (Math.min(textOnDark, Lbg95) + 0.05)).toFixed(1),
      contrastBlack: ((Math.max(textOnLight, Lbg5) + 0.05) / (Math.min(textOnLight, Lbg5) + 0.05)).toFixed(1),
    };
  });
  console.log(spec.name.padEnd(14), 'meanL', stats.mean + '%', ' p5', stats.p5 + '%', ' p95', stats.p95 + '%',
              ' white-on-brightest', stats.contrastWhite + ':1', ' black-on-darkest', stats.contrastBlack + ':1');
}
await b.close();
