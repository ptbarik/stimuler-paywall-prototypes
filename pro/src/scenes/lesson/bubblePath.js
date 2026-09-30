/**
 * The bubble outline as **one closed path — body and tail welded together**.
 *
 * This is how the exports draw it. `Calls with sarah feature-4.svg` carries the
 * whole speaking bubble as a single `fill-rule="evenodd"` path that walks the
 * bottom edge, detours out around the tail and carries on:
 *
 *   M307.432 286.681 L294.559 297.271 C… L289.973 286.681 H49.3853 C… Z
 *
 * Drawing the body and the tail as two shapes instead — a bordered `<div>`
 * with a `<path>` hung off it — cannot help but seam: the body's stroke runs
 * straight across the mouth of the tail, and the tail sits a fraction of a
 * pixel clear of it. Welded, there is nothing to seam.
 *
 * Figma's corners are circular arcs written as cubics with the usual 0.5523
 * handle ratio, so a plain rounded rect reproduces the export exactly — the
 * export's own control points check out against it to three decimals.
 */

const K = 0.5523

const n = (v) => Math.round(v * 1000) / 1000

/**
 * @param geom  bubble box in its own local coordinates, plus the export's
 *              tail outline (`tail.side`, `tail.d`)
 * @param tailAmount  0 = tail flat against the edge, 1 = the export's shape.
 *              Lets the tail grow out of the edge without the path ever
 *              changing structure, so there is no shape to swap mid-morph.
 */
export function outlinePath(geom, tailAmount = 1) {
  const { w, h } = geom
  const r = Math.min(geom.r, w / 2, h / 2)
  const c = r * K
  const t = geom.tail
  const top = t && t.side === 'top' ? t : null
  const bottom = t && t.side === 'bottom' ? t : null

  const p = [`M${n(r)} 0`]

  // top edge, left to right
  if (top) p.push(weld(top, tailAmount, 0, w))
  p.push(`H${n(w - r)}`)
  p.push(`C${n(w - r + c)} 0 ${n(w)} ${n(r - c)} ${n(w)} ${n(r)}`)

  // right edge, down
  p.push(`V${n(h - r)}`)
  p.push(`C${n(w)} ${n(h - r + c)} ${n(w - r + c)} ${n(h)} ${n(w - r)} ${n(h)}`)

  // bottom edge, right to left — the direction the exported tail is drawn in
  if (bottom) p.push(weld(bottom, tailAmount, h, w))
  p.push(`H${n(r)}`)
  p.push(`C${n(r - c)} ${n(h)} 0 ${n(h - r + c)} 0 ${n(h - r)}`)

  // left edge, up
  p.push(`V${n(r)}`)
  p.push(`C0 ${n(r - c)} ${n(r - c)} 0 ${n(r)} 0`)

  p.push('Z')
  return p.join(' ')
}

/**
 * Turn the export's standalone tail outline into commands that can be spliced
 * into the middle of the body outline: the opening `M` becomes an `L` (the
 * edge runs into the tail rather than jumping to it) and the closing `Z` goes.
 *
 * Every y is pulled back towards `edgeY` by `k`, which is what lets the tail
 * grow out of the edge, and every x is scaled by how wide the bubble is now
 * against the width the tail was measured on. Without that second part a tail
 * measured on the 301.5-wide speaking bubble sticks out past the right edge of
 * the 236.3-wide suggested reply for the whole of the morph.
 */
function weld(tail, k, edgeY, w) {
  const sx = tail.w ? w / tail.w : 1
  const out = []
  const re = /([MLC])([^MLCZ]*)/g
  let m
  while ((m = re.exec(tail.d)) !== null) {
    const cmd = m[1] === 'M' ? 'L' : m[1]
    const nums = (m[2].match(/-?\d*\.?\d+/g) || []).map(Number)
    for (let i = 0; i < nums.length; i += 2) nums[i] *= sx
    for (let i = 1; i < nums.length; i += 2) nums[i] = edgeY + (nums[i] - edgeY) * k
    out.push(cmd + nums.map(n).join(' '))
  }
  return out.join(' ')
}
