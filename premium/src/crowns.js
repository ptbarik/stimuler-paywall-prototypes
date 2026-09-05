/**
 * The crown fall.
 *
 * Eighteen crowns, each a pure function of the interstitial clock. Nothing
 * here holds state, uses a keyframe or schedules a timeout — which is what
 * lets the dev panel's scrubber show the exact frame playback would, and what
 * lets a crown be asked where it is at 2400ms without ever having played.
 *
 * ── What makes it read as falling ─────────────────────────────────
 *
 * **Every crown is independent.** Own duration, own delay, own x, own spin
 * rate *and direction*, own sway phase, own layer. The instant two of them
 * move identically the whole thing reads as a sprite sheet, and the eye finds
 * that faster than it finds anything else on the screen. Randomised per
 * instance, from a **fixed seed** — so the sequence is the same every run and
 * two people reviewing it are looking at the same fall.
 *
 * **Three depth layers.** Near crowns are full size, sharp, opaque and fast,
 * and render in front of the copy; far ones are half size, blurred, dim and
 * slow, and render behind it. This is the single largest contributor to the
 * effect feeling volumetric rather than flat — more than the count, more than
 * the spin.
 *
 * **Terminal velocity, not constant acceleration.** Each crown accelerates
 * over the first ~300ms of its own fall and then holds that speed. A pure
 * `t²` gravity curve is wrong for this: real objects this light meet air
 * resistance almost immediately, and a crown still visibly gaining speed at
 * the bottom edge of a phone reads as a physics bug rather than as weight.
 *
 * **Sinusoidal sway**, 8–20px, phase-offset per crown. This is the part that
 * sells "light object falling" over "heavy object dropped".
 *
 * **Nothing fades out mid-air.** Every crown's travel ends past the bottom
 * edge, so they leave by exiting rather than by evaporating — which is the
 * difference between a fall and a dissolve.
 */

import { LAYERS, T } from './design'
import { CROWN } from './components/CrownGlyph'

/** mulberry32 — small, fast, and identical across runs from the same seed. */
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The seed. Changing it reshuffles the whole fall; it is meant to be stable. */
const SEED = 0x5721

const FRAME_W = 412
const FRAME_H = 917

/** How long each crown spends getting up to speed, before it holds it. */
const ACCEL_MS = 300

/**
 * The eighteen.
 *
 * Built once at module load. The x positions are laid out as one shuffled
 * sequence of slots across the width plus a jitter, rather than 18 independent
 * uniform draws — 18 uniform samples across 412px reliably leave a bald patch
 * somewhere, and the bald patch is the thing you notice.
 */
export const CROWNS = build()

function build() {
  const r = rng(SEED)

  const kinds = []
  for (const [name, l] of Object.entries(LAYERS)) for (let i = 0; i < l.n; i++) kinds.push(name)
  // shuffle the layer assignment so depth is not correlated with x
  for (let i = kinds.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[kinds[i], kinds[j]] = [kinds[j], kinds[i]]
  }

  const n = kinds.length
  const slot = FRAME_W / n

  return kinds.map((layer, i) => {
    const L = LAYERS[layer]
    const size = CROWN.w * L.scale
    return {
      i,
      layer,
      size,
      h: CROWN.h * L.scale,
      blur: L.blur,
      opacity: L.opacity,
      front: L.front,

      // evenly spaced slots, jittered by most of a slot in either direction
      x: slot * (i + 0.5) + (r() - 0.5) * slot * 1.7,

      // the layer's own band of the 1.4–2.6s range: far crowns take longer to
      // cross the same distance, which is what reads as distance
      dur: L.dur[0] + r() * (L.dur[1] - L.dur[0]),
      delay: T.emit[0] + r() * (T.emit[1] - T.emit[0]),

      // roughly half spin each way, at 40–150°/s
      spin: (40 + r() * 110) * (r() < 0.5 ? -1 : 1),
      turn0: r() * 360,

      sway: 8 + r() * 12,
      swayPhase: r() * Math.PI * 2,
      swayRate: 0.8 + r() * 0.7, // cycles per second
    }
  })
}

/**
 * Where crown `c` is at interstitial time `ms`.
 *
 * Returns `null` before it is emitted and after it has cleared the bottom
 * edge, so the caller can skip it entirely rather than render it transparent.
 */
export function crownAt(c, ms) {
  const t = ms - T.fall[0] - c.delay
  if (t < 0) return null

  const u = t / c.dur
  if (u > 1) return null

  // ── terminal velocity ──
  // v ramps 0→1 across the first ACCEL_MS of *this crown's* fall and holds
  // there. p is its integral, normalised so p(1) === 1 whatever the duration.
  const a = Math.min(0.9, ACCEL_MS / c.dur)
  const p = (u < a ? (u * u) / (2 * a) : a / 2 + (u - a)) / (1 - a / 2)

  // the travel: from fully above the top edge to fully past the bottom one, so
  // a crown is never on screen at either end of its own run
  const from = -c.h - 20
  const to = FRAME_H + 40

  return {
    x: c.x + Math.sin(c.swayPhase + (t / 1000) * c.swayRate * Math.PI * 2) * c.sway,
    y: from + p * (to - from),
    turn: c.turn0 + (c.spin * t) / 1000,
  }
}

/**
 * The last moment any crown is still on screen.
 *
 * Asserted against `T.fall[1]` at module load rather than trusted: the layer
 * durations and the emission window are edited independently, and the failure
 * mode if they stop adding up is a crown still falling over the paywall.
 */
export const FALL_END = Math.max(...CROWNS.map((c) => T.fall[0] + c.delay + c.dur))

if (FALL_END > T.fall[1] + 1) {
  console.warn(
    `crowns: last crown clears at ${Math.round(FALL_END)}ms, past the fall window's ${T.fall[1]}ms`,
  )
}
