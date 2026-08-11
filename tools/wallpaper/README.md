# Wallpaper generator

Produces the three images in `public/wallpapers/`. Kept in the repo so the
assets are reproducible rather than mystery binaries — change a palette or a
seed here and re-render, don't hand-edit a JPEG.

See `plan/21-composition-pass.md` section 1 for why these are generated
rather than sourced, and for the luminance constraints each one has to meet.

## Running it

Needs Playwright with a Chrome channel available. It is not a dependency of
the app, so install it ad hoc:

```sh
npm i -D playwright
node tools/wallpaper/render.mjs /tmp/wp

# 2880x1800 PNG -> JPEG q88 (~260KB each)
for f in /tmp/wp/*.png; do
  sips -s format jpeg -s formatOptions 88 "$f" --out "${f%.png}.jpg"
done
cp /tmp/wp/*.jpg public/wallpapers/
```

`render.mjs` prints mean luminance, the 95th percentile, and the resulting
contrast ratio for white text over the brightest 5% of each image. Treat
those as the acceptance check: white chrome text sits directly on the
wallpaper in the menu bar, the hero and the desktop icon labels, so an image
whose bright end climbs much above ~35% stops being safe.

## Adding one

1. Add a spec to `SPECS` in `render.mjs`. Keep the shared `G` geometry —
   only seed, angle, light position and palette should vary, so the set
   reads as one family.
2. Render, convert, drop the JPEG in `public/wallpapers/`.
3. Add its name to `WALLPAPERS` and `WALLPAPER_LABELS`, and its path to
   `SOURCES`, in `src/components/shell/Wallpaper.tsx`.

Nothing else needs touching: the View menu, the Control Center tile and the
desktop context menu all cycle that one list.

## The knobs that matter

Both of these were found by getting them wrong first.

- **`oct` / `scale`** — structure size. Five octaves reads as marble or
  camouflage. A wallpaper wants a handful of large calm features: three
  octaves, roughly one noise period across the frame.
- **`gamma`** — tonal weighting, and the difference between silk and haze.
  Below ~1.3 the whole canvas lifts to a uniform mid-tone. 1.45 keeps most
  of the frame dark and reserves the bright stops for crests near the light.
