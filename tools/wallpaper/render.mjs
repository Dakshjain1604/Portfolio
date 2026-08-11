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

const outDir = process.argv[2];
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1200, height: 800 } });
await p.goto('file://' + path.resolve(import.meta.dirname, 'generator.html'));

for (const spec of SPECS) {
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
    // worst case for white chrome text: the brightest 5% of the image
    const Lw = 1.0, Lb = Math.pow(p95 / 100, 2.2);
    return { mean: (sum / n / 255 * 100).toFixed(1), p95, contrastWhite: ((Lw + 0.05) / (Lb + 0.05)).toFixed(1) };
  });
  console.log(spec.name.padEnd(8), 'meanL', stats.mean + '%', ' p95', stats.p95 + '%',
              ' white-on-brightest', stats.contrastWhite + ':1');
}
await b.close();
