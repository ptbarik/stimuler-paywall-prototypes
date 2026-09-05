/**
 * The whole 5000ms sequence, as one constant.
 *
 * The frame is the exports' own **370×330 card**, so every coordinate here is
 * lifted straight out of `~/Desktop/conversation/Conversation *.svg` — measured
 * off real path bounds rather than estimated, with no offset and no rescaling.
 *
 * Everything is derived from one rAF clock. Nothing is scheduled with
 * `setTimeout`, chained off `onAnimationComplete`, or handed to a layout
 * animation — see the note on `spring()` for why that last one matters, and
 * the README for why the particles in particular have to work this way.
 */

export const DURATION = 5000
export const CARD = { w: 370, h: 330, r: 20 }

// ── the ms table ──────────────────────────────────────────────────
export const T = {
  // A — recording
  pillIn: 150,
  pillInDur: 500,
  /** the chat rides up to make room for the pill — the exports move Sarah's
   *  bubble from y 140.357 to y 89.486 the moment it appears */
  scrollUp: 150,
  scrollUpDur: 520,
  waveFrom: 400,
  waveTo: 1400,

  // B — speech becomes text
  contract: 1400,
  contractDur: 350,
  pillChromeOut: 1400,
  pillChromeOutDur: 100,
  dotsIn: 1500,
  dotsInDur: 250,
  dotPhase: 160,
  expand: 2150,
  expandDur: 400,
  replyText: 2300,
  replyTextDur: 220,
  iconRow: 2400,
  iconRowDur: 200,

  // C — error mark
  underline: 2500,
  underlineDur: 250,

  // D — star flight
  burst: 2700,
  scatterDur: 150,
  flyFrom: 2850,
  flyStagger: 120,
  /** three land, on these beats; the rest fade out mid-flight */
  fills: [2950, 3150, 3350],
  fillPop: 420,

  // E — the feedback affordance
  glow: 3700,
  glowDur: 400,
  glowPulses: 2,

  // F — the panel
  panel: 4150,
  panelDur: 380,
  chatOut: 4150,
  chatOutDur: 200,
  tabs: 4300,
  tabsDur: 200,
  redRow: 4400,
  redRowDur: 240,
  connector: 4550,
  connectorDur: 220,
  greenRow: 4550,
  greenRowDur: 240,

  // loop
  fadeOut: 4820,
  fadeOutDur: 180,
}

/** Beat markers for the readout and the jump buttons. */
export const BEATS = [
  { id: 'A', name: 'A · Recording', from: 0 },
  { id: 'B', name: 'B · Speech → text', from: T.contract },
  { id: 'C', name: 'C · Error mark', from: T.underline },
  { id: 'D', name: 'D · Star flight', from: T.burst },
  { id: 'E', name: 'E · Icon glow', from: T.glow },
  { id: 'F', name: 'F · Feedback panel', from: T.panel },
]

export function beatAt(ms) {
  let i = 0
  for (let n = 0; n < BEATS.length; n++) if (ms >= BEATS[n].from) i = n
  return i
}

/** Reduced motion: six static holds of ~830ms, sampled mid-beat, cut instantly. */
export const REDUCED_SAMPLE = [900, 1900, 2650, 3450, 3900, 4700]
export const REDUCED_HOLD = DURATION / 6

/**
 * ── Springs, evaluated rather than animated ───────────────────────
 *
 * The brief's springs, solved in closed form so each is a pure function of
 * elapsed ms. Motion's `layout` measures the DOM every render and projects the
 * delta, which is both expensive under a 60fps parent and impossible to scrub
 * honestly. Evaluated here, every box is just a number.
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

export const SPRING = {
  pillIn: { k: 300, c: 24 },
  expand: { k: 320, c: 28 },
  fillPop: { k: 420, c: 16 }, // visible overshoot, on purpose
  panel: { k: 300, c: 26 },
}

/** Cubic-bezier, evaluated. Newton on x, then read y. */
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
  /** pill contract */
  standard: bezier(0.4, 0, 0.2, 1),
  /** star flight — the two axes deliberately disagree, which is what bends it */
  flyX: bezier(0.22, 1, 0.36, 1),
  flyY: bezier(0.34, 1.2, 0.64, 1),
  exit: bezier(0.4, 0, 1, 1),
  enter: bezier(0.22, 1, 0.36, 1),
}

/**
 * Tokens.
 *
 * Names from the brief, values from the exports — the two disagree on most of
 * them, and the rule carried over is that the SVG wins on visual design. The
 * brief's value is noted beside each.
 */
export const C = {
  bg: '#0D0B10',
  surface: '#272629', //  brief: #1C1920 — Sarah's bubble
  surfaceStroke: 'rgba(255,255,255,0.07)',
  text: '#FFFFFF',
  textMuted: '#9A94A3',

  purple: '#453787', //  brief: #4A3F8F — the reply bubble
  purpleTyping: '#35286C', //  the typing bubble is its own, darker violet
  pillStroke: '#53437F',
  waveBar: '#8B72CE',
  checkFrom: '#8A78C0',
  checkTo: '#6458B1',
  dismissFill: 'rgba(71,66,97,0.73)',

  /** the underlined run is a warm cream in the export, not the brief's amber */
  markText: '#F8EAB7', //  brief accent: #F2C14E
  goldFrom: '#F5B252',
  goldTo: '#FAD643',
  starIdle: '#444444', //  brief border: #332E3A
  glowGold: '#E7CA79',

  iconFill: '#323034',
  iconStroke: '#575757',
  iconGlyph: '#E2E2E2',
  userIconStroke: 'rgba(255,255,255,0.38)',

  // ── the feedback panel ──
  panelFrom: '#272343',
  panelTo: '#000000',
  tabTrack: 'rgba(195,198,255,0.12)',
  tabFrom: '#6056CD',
  tabTo: '#775CCE',
  redCircle: '#D64957',
  redRow: 'rgba(143,145,255,0.12)',
  redText: '#FF6262',
  greenCircle: '#09A25A',
  greenRow: 'rgba(1,224,119,0.2)',
  greenText: '#64FFBC',
  greenBtn: '#1E794E',
  greenBtnStroke: '#5EA583',
  connectorFrom: '#885656',
  connectorTo: '#53724F',
}

/**
 * ── The chat ──────────────────────────────────────────────────────
 *
 * `y` is the resting position; `SCROLL` is how far the whole chat rides up
 * when the recording pill arrives. Both are the exports' own — frame 1 puts
 * Sarah's bubble at y 140.357 and every later frame at 89.4863.
 */
export const SCROLL = 50.871

/** Type sizes are solved so each line's *ink width* equals the export's
 *  measured width, and the `y` values are the ink top back-computed through
 *  Poppins' half-leading — CSS positions a line box, the export measures ink. */
export const SARAH = {
  avatar: { x: 25, y: 41.4863, w: 36.7344, h: 47.6362, imgX: 15.816, imgW: 57.523 },
  box: { x: 25, y: 89.4863, w: 258, h: 97.286, r: 11.297 },
  text: { x: 37.141, y: 102.45, w: 205.426, h: 32.883, fs: 11.26, lh: 1.98 },
  lines: ['Hi, Let’s practice ordering at a cafe in', 'London! i’m your barista, ready?'],
  icons: [
    { x: 35.9308, y: 154.713, d: 18.3043, glyph: 'translate' },
    { x: 63.548, y: 154.713, d: 18.3043, glyph: 'speaker' },
  ],
}

/**
 * The persistent speech element: recording pill → typing bubble → reply
 * bubble. Three boxes, one `<div>` — see `SpeechElement`.
 */
export const PILL = {
  box: { x: 70.0232, y: 254.835, w: 228.258, h: 46.2388, r: 23.1194 },
  check: { x: 75.8828, y: 259.519, d: 35.2296 },
  wave: { x: 119.922, y: 258.856, w: 134.33, h: 36.5541 },
  dismiss: { x: 263.055, y: 263.923, d: 26.4222 },
}

export const TYPING = { x: 272, y: 231, w: 72.886, h: 38.328, r: 10.053 }

export const REPLY = {
  box: { x: 94.8828, y: 199, w: 250, h: 101.191, r: 10.365 },
  text: { x: 110.43, y: 215.6, w: 192.75, fs: 12.1, lh: 1.67 },
  /** two runs per line so the marked span can carry its own colour and rule */
  lines: [
    [
      { t: 'Hello, I want once coffee. Also ', mark: false },
      { t: 'I', mark: true },
    ],
    [
      { t: 'want eat a sandwich.', mark: true },
      { t: ' is it good?', mark: false },
    ],
  ],
  icons: [
    { x: 110.052, y: 266.126, d: 18.8947, glyph: 'speaker' },
    { x: 135.966, y: 266.126, d: 18.8947, glyph: 'retry', gold: true },
  ],
}

/** The glow sits on the retry icon — the export's own drop shadow is a 2px
 *  deviation in #E7CA79, centred on that circle. */
export const GLOW = { cx: 145.413, cy: 275.573, r: 9.447, blur: 2 }

/**
 * ── The star streak ───────────────────────────────────────────────
 * Three stars, 28.898 apart, drawn from the export's own path.
 */
export const STREAK = {
  x: 267.281, y: 20.622, w: 21.632, h: 20.714, gap: 28.898,
  sw: 1.34946,
  /** centres, for the particles to fly at */
  centres: [
    { x: 278.097, y: 30.979 },
    { x: 306.995, y: 30.979 },
    { x: 335.894, y: 30.979 },
  ],
  path:
    'M276.774 21.5047C277.264 20.3279 278.931 20.3279 279.42 21.5047L281.693 26.9694L287.593 27.4424C288.863 27.5442 289.378 29.1297 288.41 29.9588L283.915 33.8092L285.289 39.5662C285.584 40.8059 284.236 41.7858 283.148 41.1215L278.097 38.0364L273.046 41.1215C271.959 41.7858 270.61 40.8059 270.906 39.5662L272.279 33.8092L267.784 29.9588C266.816 29.1297 267.331 27.5442 268.602 27.4424L274.501 26.9694L276.774 21.5047Z',
  /** the path's own box, so it can be used as the viewBox */
  pathBox: [267.281, 20.622, 21.632, 20.714],
}

/**
 * Six particles.
 *
 * `from` is where each is emitted around the reply bubble, `scatter` the short
 * outward kick, `to` the streak star it is absorbed by (null = it fades at
 * `fadeAt` of the journey instead — visual density, not every particle has to
 * land). Sizes, rotations and durations are all deliberately uneven.
 */
export const PARTICLES = [
  { key: 'p0', from: { x: 300, y: 205 }, scatter: { x: 14, y: -12 }, size: 15, rot: -25, to: 0, delay: 0, dur: 470, bend: 0.55 },
  { key: 'p1', from: { x: 258, y: 232 }, scatter: { x: -16, y: -8 }, size: 11, rot: 34, to: null, fadeAt: 0.62, delay: 70, dur: 430, bend: 0.3 },
  { key: 'p2', from: { x: 318, y: 254 }, scatter: { x: 18, y: 6 }, size: 13, rot: 18, to: 1, delay: 200, dur: 500, bend: 0.7 },
  { key: 'p3', from: { x: 276, y: 288 }, scatter: { x: -6, y: 18 }, size: 10, rot: -40, to: null, fadeAt: 0.55, delay: 150, dur: 460, bend: 0.42 },
  { key: 'p4', from: { x: 330, y: 218 }, scatter: { x: 20, y: -6 }, size: 16, rot: 12, to: 2, delay: 400, dur: 520, bend: 0.48 },
  { key: 'p5', from: { x: 246, y: 268 }, scatter: { x: -20, y: 10 }, size: 12, rot: 52, to: null, fadeAt: 0.6, delay: 300, dur: 440, bend: 0.36 },
]

/**
 * ── The feedback panel ────────────────────────────────────────────
 * `Conversation 8.svg`, verbatim.
 */
export const PANEL = {
  box: { x: 33, y: 37.5, w: 304, h: 255, r: 26 },
  tabTrack: { x: 53.2422, y: 61.5605, w: 263.508, h: 39.6765, r: 19.8382 },
  tabPill: { x: 56.4844, y: 64.7998, w: 70.437, h: 33.1975, r: 16.1975 },
  tabs: [
    { label: 'Grammar', x: 66.69, w: 49.1, active: true },
    { label: 'Pronunciation', x: 142.41, w: 73.55 },
    { label: 'Vocabulary', x: 242.0, w: 61.15 },
  ],
  tabText: { y: 76.68, h: 9.74, fs: 10.75 },

  redCircle: { x: 61.9453, y: 135.248, d: 19.437 },
  redBox: { x: 94.3438, y: 127.153, w: 213.713, h: 35.6255, r: 12.958 },
  redText: { x: 105.16, y: 140.36, w: 130.53, h: 9.26, fs: 11.8 },
  redRuns: [
    { t: 'I ', mark: false },
    { t: 'want eat', mark: true },
    { t: ' a sandwich.', mark: false },
  ],

  connector: { x: 71.26, y1: 164.275, y2: 200.868, sw: 1.61975 },

  greenCircle: { x: 63.9206, y: 208.104, d: 18.6271 },
  greenBox: { x: 95.9141, y: 182.216, w: 210.567, h: 70.4046, r: 12.958 },
  greenText: { x: 106.73, y: 197.43, w: 144.24, h: 9.26, fs: 11.91 },
  greenRuns: [
    { t: 'I’d ', mark: false },
    { t: 'like to eat', mark: true },
    { t: ' a sandwich', mark: false },
  ],
  greenIcons: [
    { x: 105.228, y: 221.456, d: 20.2469, glyph: 'translate' },
    { x: 137.626, y: 221.456, d: 20.2469, glyph: 'speaker' },
  ],
  divider: { x1: 58.6562, x2: 311.337, y: 271.855 },
}

// ── helpers every beat uses ───────────────────────────────────────
export function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}
export const lerp = (a, b, t) => a + (b - a) * t
export const smooth = (t) => t * t * (3 - 2 * t)

/** A 0-1 ramp across [from, from+dur], eased. Pure function of ms. */
export function ramp(ms, from, dur, ease = smooth) {
  return ease(clamp01((ms - from) / dur))
}
