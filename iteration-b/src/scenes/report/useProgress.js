import { EASE, SCORE, T, clamp01 } from './timeline'

/**
 * **The single shared progress value.**
 *
 * One number, 0 → 1, that the arc reads for its `stroke-dashoffset`, the
 * specular tip reads for its position, the counter reads for
 * `Math.round(v * target)`, and the glow reads for its opacity. Nothing here
 * runs three animations of equal duration and hopes they stay together.
 *
 * It is a **pure function of `ms`** rather than a library value being ticked.
 * That is what makes the acceptance criterion literally true: scrubbed to any
 * ms, or played at 0.1x, the arc and the counter cannot drift apart, because
 * there is only one number and it is recomputed from the clock every frame.
 *
 * It is **one continuous decelerating climb** into the target. It used to run
 * past to 49 and spring back down to 47, and that hitch at the end read as a
 * stumble rather than as a needle settling — so the overshoot is gone and the
 * easing does the work instead.
 *
 * The value is in *score units* and normalised at the end, so changing the
 * target from the dev panel moves the arc, the head and the counter together
 * with no other edits.
 */
export function progressAt(ms, target = SCORE.target, reduced = false) {
  if (reduced) return target / 100
  return clamp01((EASE.sweep(clamp01((ms - T.sweep) / (T.sweepTo - T.sweep))) * target) / 100)
}

/** The same value in score units, for anything that displays a number. */
export function scoreAt(ms, target = SCORE.target, reduced = false) {
  return progressAt(ms, target, reduced) * 100
}
