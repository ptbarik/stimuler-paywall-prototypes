/**
 * The whole 5000ms reveal, as one constant.
 *
 * The frame is the export's own **370×330 card**, so every coordinate here is
 * lifted straight out of `Report.svg` — measured off real path bounds rather
 * than estimated, with no offset and no rescaling.
 *
 * Loops. Nothing is scheduled with `setTimeout` or
 * chained off `onAnimationComplete`; one rAF clock drives `ms` and every beat
 * is a pure function of it. See `useProgress` for why the gauge in particular
 * has to work this way.
 */

export const DURATION = 5000
export const CARD = { w: 370, h: 330, r: 20 }

// ── the ms table ──────────────────────────────────────────────────
export const T = {
  // A — the frame
  bezelIn: 0,
  bezelInDur: 250,

  // B — tick labels, laid down along the arc ahead of the sweep
  ticksFrom: 250,
  tickStagger: 90,
  tickDur: 250,

  scoreLabel: 400,
  scoreLabelDur: 260,

  // A — the sweep. One value drives the arc, the tip, the counter and the glow.
  sweep: 450,
  /** One continuous decelerating climb into the target — no overshoot, no
   *  snap back. It used to run past to 49 and spring down to 47, which read
   *  as a stumble at the end rather than as a needle settling. */
  sweepTo: 2300,

  // C — the delta row. Restrained on purpose: no bounce anywhere in here.
  arrow: 2450,
  arrowDur: 180,
  deltaText: 2500,
  deltaTextDur: 220,
  seeWhy: 2650,
  seeWhyDur: 150,

  // D/E — stat cards. Each box comes up, and its outline lights immediately
  // behind it and *stays* lit. So the beat is read card by card — box, then
  // outline, then the next box — rather than three boxes appearing and a
  // separate highlight touring them afterwards.
  cards: 2900,
  /** wide enough that each box clearly finishes arriving before the next
   *  starts; at 130 the three ran together and the outlines overlapped */
  cardStagger: 260,
  countDur: 600,
  /** the outline follows the box rather than drawing with it */
  outlineDelay: 120,
  outlineDur: 560,

  hold: 4100,
  /** the loop: everything fades before the wrap so the restart is not a cut */
  fadeOut: 4800,
  fadeOutDur: 200,
}

/** Beat markers for the readout and the jump buttons. */
export const BEATS = [
  { id: 'A', name: 'A · Gauge sweep', from: T.sweep },
  { id: 'B', name: 'B · Tick labels', from: T.ticksFrom },
  { id: 'C', name: 'C · Delta row', from: T.arrow },
  { id: 'D', name: 'D · Stat cards', from: T.cards },
  { id: 'E', name: 'E · Third card', from: T.cards + 2 * T.cardStagger },
]

/** Ordered for the jump row, which reads left to right in time. */
export const JUMPS = [
  { id: 'A', at: T.sweep },
  { id: 'B', at: T.ticksFrom },
  { id: 'C', at: T.arrow },
  { id: 'D', at: T.cards },
  { id: 'E', at: T.cards + 2 * T.cardStagger },
]

export function beatAt(ms) {
  if (ms >= T.cards + 2 * T.cardStagger) return 4
  if (ms >= T.cards) return 3
  if (ms >= T.arrow) return 2
  if (ms >= T.sweep) return 0
  return 1
}

/** An ease-in-out, for the outline drawing itself around a card. */
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

/** Reduced motion: the final state, with one 200ms fade-in over the top. */
export const REDUCED_FADE = 200

// ── easing ────────────────────────────────────────────────────────
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  return (x) => {
    const u = clamp01(x)
    let t = u
    for (let i = 0; i < 6; i++) {
      const fx = ((ax * t + bx) * t + cx) * t - u
      const d = (3 * ax * t + 2 * bx) * t + cx
      if (Math.abs(d) < 1e-6) break
      t -= fx / d
    }
    t = clamp01(t)
    return ((ay * t + by) * t + cy) * t
  }
}

export const EASE = {
  /**
   * The sweep.
   *
   * `cubic-bezier(0.16, 1, 0.3, 1)` — the brief's — puts 99% of the travel in
   * the first third of the window, so the number rockets to the target and
   * then sits there. This is an ease-out cubic instead: it keeps climbing
   * through the whole window and decelerates into the number, reading roughly
   * 35 at 40% of the way, 45 at 70%, and 47 at the end.
   */
  sweep: bezier(0.22, 0.61, 0.36, 1),
  tick: bezier(0.4, 0, 0.2, 1),
  out: bezier(0.16, 1, 0.3, 1),
  /** symmetric, so each card breathes rather than snapping */
  highlight: bezier(0.4, 0, 0.6, 1),
}

/** Springs, solved in closed form so each is a pure function of elapsed ms. */
export function spring(elapsed, { k, c }, mass = 1) {
  if (elapsed <= 0) return 0
  const t = elapsed / 1000
  const w0 = Math.sqrt(k / mass)
  const zeta = c / (2 * Math.sqrt(k * mass))
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta)
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t)
}

export const SPRING = {
  /** softened from the brief's 300/26 — zeta 0.87 had a bounce that fought the
   *  outline drawing itself in behind it */
  card: { k: 260, c: 30 },
}

/**
 * Tokens.
 *
 * Names from the brief, values from the export — the two disagree on the
 * teals in particular, and the rule carried over is that the SVG wins on
 * visual design. The brief's value is noted beside each.
 */
export const C = {
  /** The export's card fill. **The scene renders transparent** so it can be
   *  composited over anything; this is kept for reference and for the dev
   *  panel's solid-background preview. */
  bg: '#1C1920',
  surface: '#282828', //  brief: #262229 — the stat cards
  cardStroke: '#25222C',
  track: '#888888', //  the track arc's gradient head; it fades to transparent
  dome: '#0A0911',
  bezel: '#696969',
  text: '#FFFFFF',
  textMuted: '#807F81', //  brief: #9A94A3 — the card labels
  tick: '#6E6E6E',

  arc: '#1E8282', //  brief teal: #2FB3AC
  arcTip: '#A2CCCB', //  the specular head at the leading edge
  score: '#37BEBE', //  the label and the number
  cardNumber: '#D4D4D4',

  red: '#C33649', //  brief: #F0453F
  redArrow: '#C43649',
  seeWhy: '#B3B3B3',
}

/**
 * ── The gauge ─────────────────────────────────────────────────────
 *
 * Derived from the export's own track path rather than guessed: its bounding
 * box is 161.27 wide, so r = 80.63; its leftmost point sits at x 104.98, so
 * cx = 185.61; its apex is at y 52.39, so cy = 133.02. The ends land at
 * y 153.891, which is 15° below the horizontal on each side — a **210° sweep**,
 * not the 180° the brief assumes.
 */
export const GAUGE = {
  cx: 185.61,
  cy: 133.02,
  r: 80.63,
  sw: 19.7328,
  from: 165,
  to: 375,
  /** The dial is graduated 3.0 → 9.0, and the readout is the score out of ten
   *  — so "47%" is **4.7 on the dial**, not 47% of the arc. In the export the
   *  teal stops just short of the 5.0 tick, which is exactly where 4.7 lands
   *  and nowhere near the 47%-of-sweep position past the apex. */
  scaleMin: 3,
  scaleMax: 9,
  /** The specular head, as a fraction of the whole arc. Measured off the
   *  export's own masked tip: it runs 228.75° → 230.9°, i.e. **2.15° of a 210°
   *  sweep** — a thin bright sliver on the leading edge, not the wide block a
   *  round-capped dash produces. */
  tipSpan: 0.0102,
  /** the export's bezel and dome, verbatim */
  bezel:
    'M94.5691 95.2839C113.781 45.3772 170.455 20.5751 220.907 39.9967C271.358 59.4183 296.773 115.821 277.561 165.727C277.094 166.94 276.605 168.138 276.095 169.32C273.221 175.979 266.355 179.762 259.103 179.762H113.664C106.49 179.762 99.6905 176.06 96.7474 169.518C86.5127 146.765 84.9722 120.214 94.5691 95.2839Z',
  dome:
    'M183.51 38.119C234.784 37.2579 277.037 77.6879 277.889 128.425C278.151 144.005 274.477 158.745 267.776 171.717C265.106 176.886 259.575 179.769 253.758 179.769H116.315C110.494 179.769 104.961 176.883 102.293 171.709C96.0689 159.637 92.4592 146.009 92.2162 131.543C91.364 80.806 132.24 38.9801 183.51 38.119Z',
}

/** The seven ticks, at the export's own ink positions. Ordered along the
 *  arc so the stagger runs in the direction the sweep will travel. */
export const TICKS = [
  { label: '3.0', x: 74.84, y: 159.32, w: 9.08 },
  { label: '4.0', x: 78.0, y: 92.97, w: 9.18 },
  { label: '5.0', x: 112.9, y: 41.99, w: 8.86 },
  { label: '6.0', x: 180.01, y: 18.53, w: 9.0 },
  { label: '7.0', x: 252.02, y: 40.37, w: 8.13 },
  { label: '8.0', x: 282.73, y: 92.97, w: 9.06 },
  { label: '9.0', x: 285.99, y: 159.32, w: 9.04 },
]
export const TICK_TYPE = { fs: 6.91, inkH: 4.85 }

export const SCORE = {
  label: { text: 'Overall score', x: 162.69, y: 94.75, w: 42.59, h: 5.17, fs: 6.61 },
  value: { x: 152.4, y: 115.09, w: 62.26, h: 24.51, fs: 33.64 },
  /** the counter's target, overridable from the dev panel */
  target: 47,
}

/**
 * ── The delta row ─────────────────────────────────────────────────
 * The arrow is the export's own glyph; everything else is set type.
 */
export const DELTA = {
  /**
   * **Lifted 7.5px off the export's own y's, to even the vertical spacing.**
   * At the export's positions the block sits 28.37 below the gauge's last ink
   * (y 179.77) and only 13.26 above the cards (y 231.58) — nearly twice as far
   * from one as from the other, which reads as the sentence having drifted
   * down onto the cards. Centring it in that 51.81 gap puts its top at 200.58.
   * Every other coordinate in this file is the export's, verbatim; this is the
   * one deliberate offset, applied once in `DeltaRow`.
   */
  dy: -7.5,
  arrow: {
    x: 64.71, y: 208.23, w: 12.34, h: 8.97,
    d: 'M77.0531 217.075L76.6953 214.105C76.6834 214.007 76.5626 213.965 76.4926 214.035L75.6086 214.921L71.5642 210.878C71.4703 210.785 71.3197 210.785 71.2273 210.878L69.7097 212.394L65.5849 208.269C65.5625 208.247 65.5322 208.234 65.5006 208.234C65.4691 208.234 65.4388 208.247 65.4164 208.269L64.7456 208.943C64.7234 208.965 64.7109 208.996 64.7109 209.027C64.7109 209.059 64.7234 209.089 64.7456 209.111L69.5413 213.91C69.6337 214.004 69.7858 214.004 69.8782 213.91L71.3957 212.394L74.7663 215.763L73.8823 216.647C73.8665 216.663 73.8555 216.683 73.8505 216.705C73.8455 216.726 73.8468 216.749 73.8541 216.77C73.8614 216.791 73.8745 216.81 73.8918 216.824C73.9092 216.838 73.9302 216.847 73.9524 216.85L76.9219 217.207C76.9979 217.218 77.0635 217.152 77.0531 217.075Z',
  },
  pct: { text: '4%', x: 82.0, y: 208.29, w: 16.51, h: 9.0, fs: 12.3 },
  rest: { text: 'lower than last exercise', x: 108.09, y: 208.14, w: 140.08, h: 9.2, fs: 12.3 },
  seeWhy: { text: 'See why?', x: 257.24, y: 208.35, w: 48.33, h: 9.97, fs: 10.66 },
  rule: { x: 256.77, y: 217.11, w: 49.19, h: 0.554 },
}

/**
 * ── The stat cards ────────────────────────────────────────────────
 *
 * `4:53` is animated as **293 total seconds** and formatted on render — the
 * string is never interpolated.
 */
export const CARDS = [
  {
    key: 'messages',
    box: { x: 63.4596, y: 231.58, w: 75.4999, h: 82.2634, r: 12.4415 },
    value: 12,
    number: { y: 246.65, h: 10.38, fs: 15.4 },
    lines: ['Chat', 'Messages'],
    label: { y: 270.91, h: 27.91, fs: 10.26, lh: 1.5 },
  },
  {
    key: 'words',
    box: { x: 147.257, y: 231.58, w: 75.4999, h: 82.2634, r: 12.4415 },
    value: 120,
    number: { y: 246.65, h: 10.54, fs: 15.4 },
    lines: ['Words', 'Spoken'],
    label: { y: 271.05, h: 27.7, fs: 10.26, lh: 1.5 },
  },
  {
    key: 'minutes',
    box: { x: 231.046, y: 231.58, w: 75.4999, h: 82.2634, r: 12.4415 },
    /** 4:53 — counted as seconds, formatted on render */
    value: 293,
    seconds: true,
    number: { y: 246.65, h: 10.54, fs: 15.4 },
    lines: ['Minutes', 'Spent'],
    label: { y: 271.02, h: 27.72, fs: 10.26, lh: 1.5 },
  },
]

export const CARD_STROKE_W = 0.638028

// ── helpers ───────────────────────────────────────────────────────
export function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}
export const lerp = (a, b, t) => a + (b - a) * t
export const smooth = (t) => t * t * (3 - 2 * t)

/** A 0-1 ramp across [from, from+dur], eased. Pure function of ms. */
export function ramp(ms, from, dur, ease = smooth) {
  return ease(clamp01((ms - from) / dur))
}

/** m:ss, so the minutes card can count seconds and format on render. */
export function mmss(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * Where a score sits on the dial, 0-1 of the arc.
 *
 * `p` is the shared progress value in 0-1 of *score*, so 0.47 means 47%, means
 * 4.7 on a dial graduated 3.0 to 9.0. Anything below 3.0 pins to the start.
 */
export function arcFraction(p) {
  return clamp01((p * 10 - GAUGE.scaleMin) / (GAUGE.scaleMax - GAUGE.scaleMin))
}

/** An SVG arc from `a0` to `a1` degrees, y-down, clockwise. */
export function arcPath(cx, cy, r, a0, a1) {
  const p = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)]
  const [x0, y0] = p(a0)
  const [x1, y1] = p(a1)
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0
  const sweep = a1 > a0 ? 1 : 0
  return `M${x0} ${y0} A${r} ${r} 0 ${large} ${sweep} ${x1} ${y1}`
}
