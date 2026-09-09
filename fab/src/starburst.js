/**
 * The badge, as geometry.
 *
 * The reference is a nine-point rosette with fat lobes and softened tips,
 * faceted like cut paper — the low-poly shading is not a texture, it is one
 * triangle per half-lobe, each a slightly different lift off the same base
 * gradient. So the whole thing is generated: two radii, a corner radius and a
 * point count, and every fill downstream is a function of the same vertex ring.
 *
 * Generated rather than exported for one reason that matters at review time —
 * the same three functions draw PRO's indigo badge and PRO+'s gold one at
 * different sizes with different point counts, and the facets stay consistent
 * because they are computed from the outline instead of drawn against it.
 */

/** The 2N alternating outer/inner vertices, in order, around `cx,cy`. */
export function ring(n, R, r, cx = 0, cy = 0, phase = -Math.PI / 2) {
  const pts = []
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 ? r : R
    const a = phase + (i * Math.PI) / n
    pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)])
  }
  return pts
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const len = (v) => Math.hypot(v[0], v[1])
const walk = (from, to, d) => {
  const v = sub(to, from)
  const L = len(v) || 1
  const k = Math.min(d, L / 2) / L
  return [from[0] + v[0] * k, from[1] + v[1] * k]
}

/**
 * The vertex ring as a closed path with every corner rounded.
 *
 * Each corner is trimmed back along both of its edges and bridged with a
 * quadratic through the original vertex, which is what gives the tips their
 * pillowed look without softening the lobes' waists into a circle. Tips and
 * waists get different radii — `rTip` is small so the points stay points.
 */
export function roundedPath(pts, rTip, rWaist) {
  const n = pts.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n]
    const cur = pts[i]
    const next = pts[(i + 1) % n]
    const rad = i % 2 ? rWaist : rTip
    const a = walk(cur, prev, rad)
    const b = walk(cur, next, rad)
    d += i === 0 ? `M${a[0].toFixed(2)},${a[1].toFixed(2)}` : `L${a[0].toFixed(2)},${a[1].toFixed(2)}`
    d += `Q${cur[0].toFixed(2)},${cur[1].toFixed(2)} ${b[0].toFixed(2)},${b[1].toFixed(2)}`
  }
  return d + 'Z'
}

/**
 * One triangle per edge — centre to two adjacent vertices — with the lift
 * that shades it.
 *
 * `lift` is a signed number in roughly ±1 which the caller turns into a white
 * or black overlay. It is a cosine of the edge's own direction against a fixed
 * light angle, so the badge lights from the upper left as one solid, and
 * rotating the badge rotates its shading with it — which is the whole point,
 * because V2 spins this thing on entry.
 */
export function facets(pts, cx = 0, cy = 0, light = -2.2) {
  const n = pts.length
  return pts.map((p, i) => {
    const q = pts[(i + 1) % n]
    const mx = (p[0] + q[0]) / 2 - cx
    const my = (p[1] + q[1]) / 2 - cy
    const a = Math.atan2(my, mx)
    return {
      d: `M${cx},${cy}L${p[0].toFixed(2)},${p[1].toFixed(2)}L${q[0].toFixed(2)},${q[1].toFixed(2)}Z`,
      lift: Math.cos(a - light),
    }
  })
}

/**
 * The topographic contours behind the badge.
 *
 * The reference has faint concentric outlines that are *not* circles — they
 * are the badge's own silhouette, relaxed a little further out at each step
 * and wobbled so they read as contour lines rather than as a target. `wobble`
 * rides a second harmonic so no two rings sit parallel.
 */
export function contour(n, R, r, k, seedIdx) {
  const pts = []
  const steps = n * 2 * 6
  for (let i = 0; i < steps; i++) {
    const t = i / steps
    const a = -Math.PI / 2 + t * Math.PI * 2
    /* the star's radius as a smooth wave rather than a polygon, flattened
       toward a circle as the rings travel out */
    const wave = (Math.cos(a * n) + 1) / 2
    const base = r + (R - r) * Math.pow(wave, 0.7)
    const relax = 1 - Math.min(k, 1) * 0.55
    const rad = (base * relax + R * k * 0.62) *
      (1 + 0.018 * Math.sin(a * (n + 2) + seedIdx * 1.7))
    pts.push([rad * Math.cos(a), rad * Math.sin(a)])
  }
  return 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L') + 'Z'
}
