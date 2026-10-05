import { ring, roundedPath } from '../paywall/starburst.js'

/**
 * A circle and the starburst are the same eighteen points.
 *
 * The badge is nine outer vertices at radius 78 alternating with nine inner
 * ones at 57.5. Pull the outer nine down to 57.5 and what is left is a circle —
 * same vertices, same order, same corner rounding. So walking one to the other
 * is a single interpolation of one number, and every frame in between is a real
 * shape rather than two shapes dissolved into each other.
 *
 * That is what lets six tabs carry six different devices and still arrive at
 * the same badge: whatever the device is, it collapses to a disc, and the disc
 * takes its points. A cross-fade would have worked at 30% and fallen apart at
 * 60, where you would be looking at a circle and a star at once.
 *
 * The *waist* stays at 57.5 the whole way. Moving both radii would have the
 * shape breathe as it transforms, which reads as a scale rather than a growth.
 */

const N = 9
const R_OUT = 78
const R_WAIST = 57.5

/** `t` 0 → a disc at the badge's waist, `t` 1 → the badge. */
export function bloomPath(t) {
  const R = R_WAIST + (R_OUT - R_WAIST) * t
  /* tips round harder while they are still shallow, or the first few frames
     show nine creases on what is supposed to still be a circle */
  return roundedPath(ring(N, R, R_WAIST), 7 + (1 - t) * 10, 17)
}

/** The keyframe set motion needs: a path `d` cannot be interpolated by the
 *  browser, so the morph is sampled and handed over as discrete frames. */
export function bloomFrames(steps = 7) {
  return Array.from({ length: steps }, (_, i) => bloomPath(i / (steps - 1)))
}

export const DISC = bloomPath(0)
export const STAR = bloomPath(1)
