/**
 * Easing, solved rather than approximated.
 *
 * Everything on the interstitial is a pure function of one clock, so none of it
 * can be a CSS animation — a `@keyframes` run cannot be asked what it looks
 * like at 2400ms. These are the same curves the CSS would use, evaluated
 * directly, which is what keeps the dev panel's scrubber honest: the frame it
 * shows is the frame playback shows.
 */

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v)

/** Progress through `[a, b]`, clamped at both ends. */
export const seg = (ms, [a, b]) => clamp((ms - a) / (b - a))

/**
 * A cubic-bezier evaluated properly: Newton on x, then read y.
 *
 * Not the usual `t³` stand-in. The reference curves are specific — the word
 * cascade's `(.22,.72,.24,1)` front-loads harder than any polynomial
 * approximation of it, and that front-loading is most of why the line reads as
 * settling rather than sliding.
 */
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const fx = (t) => ((ax * t + bx) * t + cx) * t
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx
  return (x) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 8; i++) {
      const e = fx(t) - x
      if (Math.abs(e) < 1e-6) break
      const d = dx(t)
      if (Math.abs(d) < 1e-6) break
      t -= e / d
    }
    return ((ay * t + by) * t + cy) * t
  }
}

/** The word cascade's own curve, and the general-purpose ease-out beside it. */
export const easeCascade = bezier(0.22, 0.72, 0.24, 1)
export const easeOut = bezier(0.2, 0.7, 0.2, 1)
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * A spring settle with one overshoot, in closed form.
 *
 * Used on `50% OFF` and nowhere else on the screen: two things overshooting in
 * the same second read as bounce rather than as weight.
 */
export const spring = (t) => 1 - Math.exp(-6.5 * t) * Math.cos(6.2 * t)
