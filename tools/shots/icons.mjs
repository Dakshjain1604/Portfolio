/**
 * Bake each project's app tile from its hero screenshot.
 *
 *   node tools/shots/icons.mjs            # all projects
 *   node tools/shots/icons.mjs soh_ships  # just these
 *
 * Emits two assets per project:
 *
 *   <name>.thumb.png  every shot, uncropped, at its own aspect ratio and
 *              720px wide. This is what every project tile and every gallery
 *              thumbnail in the UI draws. A square tile cannot show a 16:10
 *              screenshot without cutting a third of it away, so the tiles
 *              are not square - and a 70px strip thumbnail has no business
 *              pulling a 1 MB original, which is what it did before.
 *   icon.png   a square crop of the `icon: { cx, cy, size }` region. Only
 *              the Dock's Launchpad mosaic still needs a square, and there
 *              nine of them are texture rather than content.
 *
 * Why bake at all, when CSS can crop: a browser handed a 2880px PNG and
 * told to paint it into a 72px tile does a 40:1 downscale in a single
 * filtering step, and the result is visibly soft and aliased - it was the
 * whole reason the tiles read as mush. One properly resampled 512px source
 * is sharp at every size the tile is ever drawn, in the Dock mosaic and the
 * mobile grid as well as in Launchpad.
 *
 * Rerun this after re-capturing a hero shot or changing a crop. It is fast
 * and idempotent.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, "..", "..")
const OUT = join(REPO, "public", "images", "projects")

/** Square tile. Only the Dock's Launchpad mosaic uses this now - see below. */
const ICON = 512
/**
 * Landscape thumbnail width.
 *
 * These exist because the square tile was the wrong shape for the content:
 * a 16:10 screenshot cropped to a square loses a third of its width no
 * matter how carefully the crop is aimed - the choice was only ever *which*
 * third. The fix is not a better crop, it is not cropping.
 *
 * 720px covers a ~230px Launchpad card at 2x with room to spare, and turns
 * what Launchpad pulls on open from ~4 MB of full-size heroes into a few
 * hundred KB. One is baked per *shot*, not just per hero, because the
 * gallery's 70px thumbnail strip was loading the originals.
 */
const THUMB_W = 720

/**
 * The data file is TypeScript, and this is a plain node script, so the two
 * fields it needs are read out with a regex rather than by standing up a
 * transpiler for ten objects. Deliberately strict: an entry whose `image`
 * and `icon` cannot both be found is reported, not skipped silently, so a
 * renamed field fails loudly instead of quietly leaving a stale tile.
 */
function readProjects() {
  const src = readFileSync(join(REPO, "src", "data", "projects.ts"), "utf8")
  const body = src.slice(src.indexOf("export const projects"))
  const out = []
  const re = /\n  \{\n    id: "([a-z_]+)",/g
  let m
  const starts = []
  while ((m = re.exec(body))) starts.push([m.index, m[1]])
  for (let i = 0; i < starts.length; i++) {
    const chunk = body.slice(starts[i][0], starts[i + 1]?.[0] ?? body.length)
    const id = starts[i][1]
    const image = chunk.match(/\n    image: "([^"]+)"/)?.[1]
    const shots = [...chunk.matchAll(/\n      \{ src: "([^"]+)"/g)].map((m) => m[1])
    const icon = chunk.match(/\n    icon: \{ cx: ([\d.]+), cy: ([\d.]+), size: ([\d.]+) \}/)
    if (!image || !icon) {
      console.error(`  ${id}: could not read image/icon — check the field format in projects.ts`)
      continue
    }
    out.push({ id, image, shots, cx: +icon[1], cy: +icon[2], size: +icon[3] })
  }
  return out
}

const wanted = process.argv.slice(2)
const projects = readProjects().filter((p) => !wanted.length || wanted.includes(p.id))
if (!projects.length) {
  console.error("no matching projects")
  process.exit(1)
}

for (const p of projects) {
  const srcFile = join(REPO, "public", p.image)
  const img = sharp(srcFile)
  const { width: W, height: H } = await img.metadata()

  // Square side is a fraction of height, then clamped to the image so a
  // crop centred near an edge slides inward rather than throwing.
  const side = Math.round(Math.min(H, W) * Math.min(p.size, 1) * (H <= W ? 1 : W / H))
  const s = Math.max(32, Math.min(side, Math.min(W, H)))
  const left = Math.max(0, Math.min(Math.round(p.cx * W - s / 2), W - s))
  const top = Math.max(0, Math.min(Math.round(p.cy * H - s / 2), H - s))

  mkdirSync(join(OUT, p.id), { recursive: true })
  const file = join(OUT, p.id, "icon.png")
  await sharp(srcFile)
    .extract({ left, top, width: s, height: s })
    // Lanczos3, sharp's default for reductions - the point of doing this
    // here rather than in the browser.
    .resize(ICON, ICON, { kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toFile(file)

  // One thumbnail per shot, including the hero. A shot that is already a
  // static asset (neo-mcp's diagram) gets one too, so nothing in the UI has
  // to know which is which.
  let thumbKb = 0
  for (const shotSrc of p.shots.length ? p.shots : [p.image]) {
    const from = join(REPO, "public", shotSrc)
    if (!existsSync(from)) {
      console.error(`  ${p.id}: shot not found on disk — ${shotSrc}`)
      continue
    }
    const to = join(REPO, "public", shotSrc.replace(/\.png$/, ".thumb.png"))
    const meta = await sharp(from).metadata()
    await sharp(from)
      .resize({ width: Math.min(THUMB_W, meta.width), kernel: "lanczos3", withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(to)
    thumbKb += readFileSync(to).length / 1024
  }

  const kb = (f) => Math.round(readFileSync(f).length / 1024)
  console.log(
    `  ${p.id.padEnd(20)} ${W}x${H} → icon ${s}px @ ${left},${top} (${kb(file)} KB) · ${p.shots.length} thumb(s) (${Math.round(thumbKb)} KB)`
  )
}

// A tiny index so a reader can see which hero each tile was cut from
// without re-deriving it from the data file.
writeFileSync(
  join(OUT, "icons.json"),
  JSON.stringify(
    Object.fromEntries(
      projects.map((p) => [
        p.id,
        {
          from: p.image,
          crop: { cx: p.cx, cy: p.cy, size: p.size },
          icon: `/images/projects/${p.id}/icon.png`,
          thumbs: p.shots.map((x) => x.replace(/\.png$/, ".thumb.png")),
        },
      ])
    ),
    null,
    2
  ) + "\n"
)
console.log(`\nwrote ${projects.length} icon(s) at ${ICON}px and per-shot thumbs at ${THUMB_W}px`)
