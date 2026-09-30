/**
 * The whole 5000ms sequence, as one constant.
 *
 * The frame is the exports' own **370×330 card**, so every coordinate in this
 * file is lifted straight out of `~/Desktop/lesson/Lessons *.svg` with no
 * offset and no rescaling — measured off real path bounds rather than
 * estimated. That is also what makes beats C and D work: the timeline block is
 * 338 tall inside a 330 card, so row 3 really is cropped off the bottom and
 * the pan really does reveal it.
 *
 * Everything is derived from one rAF clock. Nothing is scheduled with
 * `setTimeout`, chained off `onAnimationComplete`, or handed to a layout
 * animation — see the note on `spring()` for why that last one matters.
 */

export const DURATION = 5000
export const CARD = { w: 370, h: 330, r: 16 }

// ── the ms table ──────────────────────────────────────────────────
export const T = {
  // A — fan out
  sceneIn: 0,
  sceneInDur: 260,
  fanOut: 250,
  fanStagger: 110,
  fanHold: 1380,

  // B — morph to the roleplay card.
  // The siblings retreat *into* the morph rather than finishing before it —
  // overlapping the two is what stops the hand-off reading as two events.
  sideExit: 1420,
  sideExitDur: 340,
  sideExitStagger: 80,
  morph: 1540,
  /** The tutor portrait clears *before* the still arrives. Crossfading two
   *  photographs of the same person over each other double-exposes her face;
   *  dipping through the card's own fill for a beat reads as a transition. */
  tutorOut: 1620,
  tutorOutDur: 240,
  stillIn: 1780,
  stillInDur: 260,
  chromeIn: 1980,
  chromeInDur: 320,
  shimmer: 2300,
  shimmerDur: 400,

  // C — collapse into the timeline
  collapse: 2700,
  /** same idea at the collapse — the roleplay chrome is gone before the row
   *  content lands, so the card is briefly just its own fill mid-flight */
  collapseClear: 180,
  collapseContent: 2900,
  collapseContentDur: 300,
  railDraw: 2820,
  railDrawDur: 420,
  node1: 3060,
  row2In: 3100,
  row2InDur: 320,

  // D — camera pan. Starts while the collapse is on its last 1% of travel,
  // for the same reason: overlap reads smoother than a gap.
  pan: 3420,
  panDur: 640,
  node2: 3560,
  node3: 3720,

  // E — resolve
  praise: 4350,
  praiseDur: 220,
  praiseResolve: 4550,
  praiseResolveDur: 220,
  praiseSparkle: 4640,
  praiseSparkleDur: 240,

  // loop
  fadeOut: 4800,
  fadeOutDur: 200,
}

/** Beat markers for the readout and the jump buttons. */
export const BEATS = [
  { id: 'A', name: 'A · Fan out', from: 0 },
  { id: 'B', name: 'B · Lesson card', from: T.sideExit },
  { id: 'C', name: 'C · Collapse to timeline', from: T.collapse },
  { id: 'D', name: 'D · Camera pan', from: T.pan },
  { id: 'E', name: 'E · Resolve', from: T.praise },
]

export function beatAt(ms) {
  let i = 0
  for (let n = 0; n < BEATS.length; n++) if (ms >= BEATS[n].from) i = n
  return i
}

/** Reduced motion: five 1000ms holds, sampled mid-beat, cut instantly. */
export const REDUCED_SAMPLE = [1300, 2450, 3250, 4100, 4750]

/**
 * ── Springs, evaluated rather than animated ───────────────────────
 *
 * These are the brief's springs, solved in closed form so they are a pure
 * function of elapsed ms.
 *
 * That is the fix for the morph and the collapse reading jerky. They used to
 * run on Motion's `layout`, which measures the DOM on every render and
 * projects the delta. With a parent re-rendering at 60fps that is expensive,
 * and once the camera starts translating it is actively wrong — the pan reads
 * as a layout change and the two fight each other. Evaluated here the box is
 * just a number: nothing measures, nothing projects, and scrubbing to any ms
 * shows exactly the frame playback would.
 *
 * Unit mass, 0 to 1, starting at rest.
 */
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

/**
 * Softer than the brief's 320/28 (ζ 0.78, a visible bounce). The card travels
 * a long way in both morphs and that overshoot was itself reading as a snap.
 * These are ζ ≈ 0.99 — effectively critically damped, no wobble at all, ~820ms
 * to settle. Peak velocity drops by about a third against 190/26, which is
 * what makes the move feel unhurried rather than merely bounce-free.
 */
export const SPRING = {
  fan: { k: 210, c: 27 },
  morph: { k: 165, c: 25.5 },
  collapse: { k: 170, c: 25.5 },
  node: { k: 400, c: 18 }, // unchanged — the node pop *should* overshoot
}

/**
 * Tokens.
 *
 * Names from the brief, values from the exports — the two disagree on nearly
 * every one, and the rule carried over from the Sarah card is that the SVG
 * wins on visual design. The brief's value is noted beside each.
 */
export const C = {
  bg: '#0D0B10',
  text: '#FFFFFF',
  textMuted: '#ADADAD', //  brief: #9A94A3
  accent: '#EACD9C', //  brief: #F2C14E — the export's rail gold is softer
  accentSoft: 'rgba(231,206,165,0.34)',
  railBase: '#232323',

  tutorFill: '#2E2A22',
  tutorStroke: '#5D5546',
  glowWarm: '#D8B6A6',
  glowSide: '#D6D8A6',
  glowSideAlt: '#D3D8A6',

  scrimTop: 'rgba(82,53,18,0)',
  scrimBottom: '#523512',
  pillFill: 'rgba(0,0,0,0.2)',
  pillStroke: 'rgba(255,255,255,0.5)',
  ctaFill: 'rgba(255,255,255,0.12)',
  ctaStroke: '#C9C9C9',

  rowStrokeIdle: '#2B2B2B',
  /** Opaque, and always under a node. This is the export's own stacking and
   *  it is what stops the gold rail showing through and fighting the numeral. */
  nodeDisc: '#161616',
  nodeIdleStroke: '#515151',
  nodeIdleDot: '#515151',
  introIcon: '#FDF8E9',
  stepIcon: '#8A8A8A',
  stepIconAlt: '#ADADAD',
  ctaSolid: 'rgba(255,255,255,0.92)',
  ctaSolidText: '#000000',

  // see the note on sarahBubble — same change, same reason
  bubble: 'rgba(255,255,255,0.13)',
  bubbleStroke: 'rgba(255,255,255,0.30)',
  bubbleText: '#FFFFFF',
  praiseDim: '#676767',
}

/**
 * ── Beat A · the fan ──────────────────────────────────────────────
 *
 * Three tutors, exactly as the exports draw them: one centre card and two
 * siblings. `Lessons 1` to `Lessons 3` are the same composition with the side
 * cards at three x offsets, and `Lessons 4` is byte-identical to `Lessons 3`,
 * so the fan is one continuous move from `dx: 0` to `dx: 95.539` and frame 2
 * is a sample of it at 0.638 rather than a keyframe of its own.
 *
 * The right tile is a 7° rotation about its own top-left; the left one is a
 * **reflection**, its matrix lifted verbatim. In both, the portrait is rotated
 * by a *different* angle about a *different* origin than the tile that clips
 * it, so all four transforms are kept rather than merged into one.
 */
export const CENTRE = {
  x: 115.008, y: 60.9717, w: 140, h: 160, r: 27.4286, sw: 1.14286,
  img: { x: 98.75, y: 46.8467, w: 180.146, h: 320.259 },
  glow: { cx: 181.389, cy: 180.713, rx: 58.2956, ry: 30.3887, blur: 45.7143 },
}

export const FAN = 95.539

export const RIGHT = {
  rect: { x: 247.793, y: 89.2697, w: 105.87, h: 121.119, r: 20.4769, sw: 0.871358 },
  clip: { x: 247.414, y: 88.7842, w: 106.741, h: 121.99, r: 20.9126 },
  rotate: 7,
  img: { x: 255.819, y: 53.2676, w: 101.244, h: 179.997, rotate: 7.42533, ox: 167.984, oy: 53.2676 },
  glow: { cx: 286.518, cy: 185.568, rx: 44.4468, ry: 23.1695, rot: 7, blur: 34.8543 },
}

export const LEFT = {
  matrix: [-0.992546, 0.121869, 0.121869, 0.992546],
  tx: 121.771, ty: 88.834,
  clipTx: 122.586, clipTy: 88.7842,
  rect: { x: -0.379336, y: 0.485527, w: 105.87, h: 121.119, r: 20.4769, sw: 0.871358 },
  clip: { w: 106.741, h: 121.99, r: 20.9126 },
  img: { x: 8.473, y: 90.606, w: 107.774, h: 191.603, rotate: -6.77441, ox: -85.0156, oy: 73.7061 },
  glow: { cx: 83.481, cy: 185.568, rx: 44.4468, ry: 23.1695, rot: -7, blur: 34.8543 },
}

export const CAPTION = { y: 262.278, h: 16.932, fs: 21.35, text: 'Learn with 12+ AI tutors' }

/**
 * ── Beat B · the roleplay card ────────────────────────────────────
 * `Lessons 5.svg`, including the pattern-derived still position and the
 * scrim's own gradient stops.
 */
export const LESSON = {
  x: 47, y: 47, w: 276, h: 236, r: 20.9656,
  img: { x: -35.7266, y: -23.2551, w: 316.838, h: 382.393 },
  scrim: { y: 8.8809, h: 227.039, from: 0.298077, to: 0.682692, opacity: 0.8, blur: 21.84 },
  glow: { cx: 202.756, cy: 288.404, rx: 71.4592, ry: 63.139, blur: 38.4914 },
  pill: { x: 13.9766, y: 13.9766, w: 73.5748, h: 24.9885, r: 12.4943, sw: 0.873565 },
  pillLabel: { x: 38.464, fs: 9.57 },
  play: { x: 24.0234, y: 22.118 },
  icon: { x: 15.945, y: 144.58, w: 17.034, h: 14.414 },
  title: { x: 50.199, y: 144.966, h: 13.513, fs: 16.7, text: 'Learn to introduce' },
  cta: { x: 13.9766, y: 178.265, w: 248.093, h: 43.6783, r: 13.977, sw: 0.873565, fs: 14.21 },
}

/**
 * ── Beats C & D · the timeline ────────────────────────────────────
 *
 * Frames 6 and 7 are the same list scrolled by exactly 180.712px — every rail
 * end, node centre and row box in one lands on the other's once you subtract
 * it. So the pan is one number on one container.
 */
export const PAN = 180.712

export const RAIL = { x: 38.4731, top: 89.9521, bottom: 411.732, w: 6.7743 }
/** Where the gold sits at rest, and where it reaches once the pan is done. */
export const RAIL_GOLD = { from: 165.316, to: 411.732 }

/**
 * The row outline's stroke.
 *
 * Measured off the export's stroke band rather than read off an attribute:
 * Figma outlines a stroke into a filled ring, and that ring is 1.6936 thick,
 * sitting 0.8468 either side of the shape. 0.846788 — which is what this used
 * to be — is the half-outset, not the weight, so every row was drawn at half
 * the stroke it should have had.
 */
export const ROW_STROKE = 1.6936

export const NODE = { r: 15.2422, sw: 3.38715, dotR: 5.92571 }
export const NODES = [
  { n: 1, cx: 38.5017, cy: 73.5017, at: T.node1, dx: -2.869, dy: -5.106 },
  { n: 2, cx: 39.0095, cy: 253.897, at: T.node2, dx: -4.375, dy: -5.385 },
  { n: 3, cx: 39.0095, cy: 355.483, at: T.node3, dx: -4.558, dy: -5.385 },
]

export const ROWS = [
  {
    key: 'intro',
    tall: true,
    box: { x: 75.7578, y: 51.4863, w: 269.2782, h: 127.0187 },
    icon: { x: 19.476, y: 21.168, w: 22.017, h: 18.629, name: 'iconVideo', fill: C.introIcon },
    label: { x: 55.41, y: 23.572, h: 13.093, fs: 15.95, weight: 600, color: C.text },
    title: 'Introduction',
    cta: { x: 16.938, y: 67.743, w: 235.407, h: 42.3394, r: 13.5486, sw: 0.846788, fs: 13.78 },
  },
  {
    key: 'reading',
    box: { x: 75.7578, y: 218.304, w: 269.2782, h: 67.7431 },
    icon: { x: 19.203, y: 22.468, w: 22.581, h: 22.581, name: 'iconSwords', fill: C.stepIcon },
    label: { x: 55.41, y: 26.959, h: 16.569, fs: 16.7, weight: 400, color: C.textMuted },
    title: 'Reading Exercises',
    node: 2,
  },
  {
    key: 'grammar',
    box: { x: 75.7578, y: 321.611, w: 269.2782, h: 67.7431 },
    icon: { x: 19.203, y: 22.582, w: 22.581, h: 22.581, name: 'iconGrammar', fill: C.stepIconAlt },
    label: { x: 55.097, y: 26.96, h: 13.099, fs: 15.9, weight: 400, color: C.textMuted },
    title: 'Grammar Practice',
    node: 3,
  },
]

export const ROADMAP_GLOW = { cx: 210.397, cy: 36.47, rx: 134.639, ry: 17.1086, blur: 67.743 }

/**
 * ── Beat E · the resolve ──────────────────────────────────────────
 *
 * The export draws this as plain two-line text beside the sparkles. It is in
 * the **Calls-with-Sarah bubble** instead — Padmini's standing note on this
 * line, so the tutor's voice reads the same across every prototype. The
 * export's own text coordinates are kept so it can be flipped back.
 */
export const PRAISE = {
  sparkles: { x: 31.625, y: 255.625, w: 22.75, h: 22.75 },
  text: { x: 70.44, y: 260.202, w: 240.337, h: 41.014, fs: 16.81, lh: 1.71 },
  lines: ['Nice work! Let’s jump into the', 'next lesson.'],
  bubble: {
    x: 58, y: 243.34, w: 265.2, h: 74.735, r: 15.15, padX: 12.44,
    origin: '13.7% 0%',
    // Sarah's tail, verbatim — welded into the body outline, never a separate
    // shape, or the join seams
    tail: {
      side: 'top',
      d: 'M28.342 0 L41.214 -10.59 C42.145 -11.356 43.492 -11.045 43.708 -10.016 L45.801 0 Z',
    },
  },
}

// ── helpers every beat uses ───────────────────────────────────────
export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const lerp = (a, b, t) => a + (b - a) * t
export const smooth = (t) => t * t * (3 - 2 * t)

/** A 0-1 ramp across [from, from+dur], eased. Pure function of ms. */
export function ramp(ms, from, dur, ease = smooth) {
  return ease(clamp01((ms - from) / dur))
}

/** Blend two colours given as hex or rgba(). */
export function mix(a, b, k) {
  const pa = rgba(a)
  const pb = rgba(b)
  const c = [0, 1, 2].map((i) => Math.round(lerp(pa[i], pb[i], k)))
  return `rgba(${c.join(',')},${lerp(pa[3], pb[3], k).toFixed(3)})`
}

function rgba(v) {
  if (v.startsWith('#')) return [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16)).concat(1)
  const n = v.match(/-?\d*\.?\d+/g).map(Number)
  return [n[0], n[1], n[2], n.length > 3 ? n[3] : 1]
}

/**
 * The rail's draw progress, 0-1 of its full length.
 *
 * Two segments: it draws to node 1 as the card collapses, then keeps drawing
 * as the camera travels. Derived from `ms`, so `strokeDashoffset` is a plain
 * number and the loop resets it by construction rather than by cleanup.
 */
export function railProgress(ms) {
  const toNode1 = (RAIL_GOLD.from - RAIL.top) / (RAIL.bottom - RAIL.top)
  const a = clamp01((ms - T.railDraw) / T.railDrawDur) * toNode1
  const b = ramp(ms, T.pan, T.panDur) * (1 - toNode1)
  return clamp01(a + b)
}

/** `cubic-bezier(0.32, 0.72, 0, 1)`, evaluated so the camera pan is a plain
 *  number derived from ms rather than a CSS transition. */
export function panEase(x) {
  const cx = 3 * 0.32
  const bx = 3 * (0 - 0.32) - cx
  const ax = 1 - cx - bx
  const cy = 3 * 0.72
  const by = 3 * (1 - 0.72) - cy
  const ay = 1 - cy - by
  let t = x
  for (let i = 0; i < 6; i++) {
    const fx = ((ax * t + bx) * t + cx) * t - x
    const d = (3 * ax * t + 2 * bx) * t + cx
    if (Math.abs(d) < 1e-6) break
    t -= fx / d
  }
  t = clamp01(t)
  return ((ay * t + by) * t + cy) * t
}
