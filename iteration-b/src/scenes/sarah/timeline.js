/**
 * The whole sequence, as one constant.
 *
 * Every component reads from here — nothing is driven by chained setTimeout
 * or onAnimationComplete, so the cycle can be scrubbed, slowed and looped
 * without drift.
 *
 * All values are absolute milliseconds inside a single 5000ms cycle.
 */

export const DURATION = 5000

export const T = {
  // state 1 — calling
  sceneIn: 0,

  // connect
  connect: 750,
  connectDur: 450,
  phoneExitDur: 120,

  // state 2 — connected
  waveIn: 1200,
  waveBarStagger: 45,
  waveOut: 1850,
  waveOutDur: 150,

  // state 3 — Sarah speaks
  sarahIn: 1900,
  sarahOut: 3000,

  // state 4 — suggested reply (enters while Sarah's is still leaving).
  // The hint rides in with the bubble, not after it — it reads as part of the
  // same thought.
  userIn: 3060,
  pillIn: 3060,

  // state 5 — user speaks
  morph: 4050,
  morphDur: 300,

  // loop
  fadeOut: 4850,
  fadeOutDur: 150,
}

/** Entrances overshoot, exits never do. */
export const EASE = {
  enter: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
  ring: [0, 0, 0.2, 1],
  linear: [0, 0, 1, 1],
}

export const DUR = {
  bubbleIn: 280,
  bubbleOut: 120,
  morph: 300,
  pillIn: 280, // same beat as the bubble it belongs to
  pillCross: 200,
  fade: 250,
  /** Circle + ring geometry. Soft on purpose — this used to be a snappy
   *  450ms spring and read too sharp against the rest of the scene. */
  morphVisual: 0.72,
  morphBounce: 0.06,
}

/** Which of the five states a given ms belongs to (for the readout + reduced motion). */
export const STATE_AT = [
  { name: '1 · Calling', from: 0 },
  { name: '2 · Connected', from: T.connect },
  { name: '3 · Sarah speaks', from: T.sarahIn },
  { name: '4 · Suggested reply', from: T.userIn },
  { name: '5 · User speaks', from: T.morph },
]

export function stateAt(ms) {
  let i = 0
  for (let n = 0; n < STATE_AT.length; n++) if (ms >= STATE_AT[n].from) i = n
  return i
}

/**
 * Card geometry, lifted straight out of the five exported SVGs
 * (`Calls with sarah feature-0…4.svg`, all 370×330).
 */
export const CARD = { w: 370, h: 330, r: 16 }

/**
 * The ring centre is tracked separately from the circle: in the last state the
 * avatar stays put but the rings drop to the bottom of the card, so the pulse
 * appears to come from the person speaking rather than from Sarah.
 */
export const CIRCLE = {
  // state 1: the green call button
  calling: {
    d: 92.7066, cx: 185.01, cy: 156.878,
    rcx: 185.001, rcy: 168.153, rings: [103.793, 138.391, 172.989],
  },
  // state 2: avatar, larger and lower — no bubble competing for room yet
  connected: {
    d: 163.689, cx: 185.5, cy: 138.556,
    rcx: 185.501, rcy: 137.433, rings: [103.793, 138.391, 172.989],
  },
  // states 3–4: avatar settles smaller and higher to make room for the bubble
  settled: {
    d: 152.916, cx: 184.997, cy: 110.679,
    rcx: 184.991, rcy: 109.63, rings: [89.3977, 119.197, 148.996],
  },
  // state 5: same avatar, rings re-centre low — the user is the source now
  speaking: {
    d: 152.916, cx: 184.997, cy: 110.679,
    rcx: 184.991, rcy: 310.236, rings: [89.3977, 119.197, 148.996],
  },
}

/**
 * ── The ripple ────────────────────────────────────────────────────────────
 *
 * The rings are no longer three fixed circles that breathe. Each one is a
 * ripple that is born at the inner radius, travels outward and fades out on
 * the way — so the motion reads as something spreading from the avatar rather
 * than as a pulsing target, and nothing in the stack ever holds full strength.
 *
 * `emit` divides 5000 exactly, so the emission phase is identical either side
 * of the loop point and the wrap is invisible. `life = emit * count` puts
 * exactly `count` ripples in flight, and because they travel a constant
 * `span` per `emit` the three of them sit on the export's radii
 * (r0, r0+span, r0+2·span) every time the phase comes round.
 */
export const RIPPLE = {
  count: 3,
  emit: 1250,
  life: 3750,
  /** Peak opacity of a ripple — the whole point of the revision is that this
   *  is low. Louder while dialling, quieter once the call is connected. */
  peakCalling: 0.2,
  peakIdle: 0.13,
  /** Fade in over the first slice of the life, then fade out from `fadeFrom`
   *  to nothing at the end — so the outermost ring is always the faintest. */
  fadeIn: 0.09,
  fadeFrom: 0.4,
  /** The stroke thins as the ripple spreads. */
  strokeDecay: 0.55,
  /** A soft blurred copy sits under the crisp ring so it is not a hairline. */
  halo: 0.55,
  haloBlur: 2.4,
}

/**
 * Ring geometry as clock-derived keyframes rather than springs.
 *
 * The ripple radius has to be computed every frame from `ms`, so the centre
 * and base radius have to be available as plain numbers at that same instant.
 * Interpolating them here — pure function of `ms`, no history — keeps the
 * whole scene scrubbable: any given ms always renders identically.
 *
 * `span` is half the gap between the export's inner and outer ring, which is
 * also the distance a ripple travels per emission.
 */
export const RING_KEYS = [
  { at: 0, rcx: 185.001, rcy: 168.153, r0: 103.793, span: 34.598, sw: 0.8686 },
  { at: T.connect, rcx: 185.501, rcy: 137.433, r0: 103.793, span: 34.598, sw: 0.8686 },
  { at: T.sarahIn, rcx: 184.991, rcy: 109.63, r0: 89.3977, span: 29.7992, sw: 0.7481 },
  { at: T.morph, rcx: 184.991, rcy: 310.236, r0: 89.3977, span: 29.7992, sw: 0.7481 },
]

/** How long the ring centre takes to travel between keyframes. Matches the
 *  circle's own soft spring closely enough that they read as one move. */
export const RING_MORPH = 720

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

export function ringGeomAt(ms) {
  let i = 0
  for (let n = 0; n < RING_KEYS.length; n++) if (ms >= RING_KEYS[n].at) i = n
  const cur = RING_KEYS[i]
  if (i === 0) return cur
  const prev = RING_KEYS[i - 1]
  const k = Math.min(1, Math.max(0, (ms - cur.at) / RING_MORPH))
  const e = easeOutQuart(k)
  const mix = (a, b) => a + (b - a) * e
  return {
    rcx: mix(prev.rcx, cur.rcx),
    rcy: mix(prev.rcy, cur.rcy),
    r0: mix(prev.r0, cur.r0),
    span: mix(prev.span, cur.span),
    sw: mix(prev.sw, cur.sw),
  }
}

/**
 * Bubble boxes, taken from the real path bounds in the exports.
 * `tail` is the flag on the corner: base runs x0→x1 along the edge with the
 * point at `apex`, all in bubble-local coordinates.
 */
export const BUBBLE = {
  sarah: {
    x: 34.234, y: 212.575, w: 301.539, h: 74.735, r: 15.15, fs: 14.45,
    // `w` is the bubble width the tail was measured on, so its x can track a
    // box that is still interpolating. At rest the ratio is 1 and it is the
    // export's own outline, unchanged.
    tail: { side: 'top', w: 301.539, d: 'M28.342 0 L41.214 -10.59 C42.145 -11.356 43.492 -11.045 43.708 -10.016 L45.801 0 Z' },
    origin: '13.7% 0%',
  },
  // no tail — the "Try reading!" pill sits on the top edge where one would go
  suggest: {
    x: 68, y: 213.568, w: 236.344, h: 74.022, r: 12, fs: 14.66,
    tail: null,
    origin: '50% 0%',
  },
  speaking: {
    x: 34.234, y: 211.94, w: 301.539, h: 74.741, r: 15.15, fs: 14.66,
    tail: { side: 'bottom', w: 301.539, d: 'M273.198 74.741 L260.325 85.331 C259.395 86.096 258.047 85.786 257.832 84.757 L255.739 74.741 Z' },
    origin: '86.3% 100%',
  },
}

export const PILLS = {
  minutes: { x: 123, y: 19, w: 123.159, h: 35.802, r: 17.901, fs: 13 },
  // vertically centred on the suggested bubble's top edge
  tryReading: { x: 135.174, y: 202.362, w: 101.989, h: 21.508, r: 10.754, fs: 9.35 },
  // dots start at 116.19, label ink starts at 143.04, both centred on y 310.85
  speaking: { x: 116.19, y: 300.3, w: 125.62, h: 21, r: 0, fs: 12.64 },
}

/**
 * The reply bubble's box, colour and tail, interpolated from `ms`.
 *
 * States 4 and 5 used to morph via Motion's `layout`. They cannot any more:
 * the outline is now one welded path, so its geometry has to be a plain number
 * at render time — a layout animation runs outside React and would leave the
 * path stretched rather than redrawn. Interpolating here is also what the
 * rings already do, and it keeps the whole scene scrub-honest: any given ms
 * renders identically.
 *
 * It is still one element. The bubble is never remounted across the morph.
 */
export function replyStateAt(ms) {
  const k = smooth(clamp01((ms - T.morph) / DUR.morph))
  const a = BUBBLE.suggest
  const b = BUBBLE.speaking
  return {
    geom: {
      x: lerp(a.x, b.x, k),
      y: lerp(a.y, b.y, k),
      w: lerp(a.w, b.w, k),
      h: lerp(a.h, b.h, k),
      r: lerp(a.r, b.r, k),
      fs: lerp(a.fs, b.fs, k),
      origin: `${lerp(50, 86.3, k)}% ${lerp(0, 100, k)}%`,
      // the suggested reply has no tail; the speaking one grows the export's
      tail: b.tail,
    },
    tailAmount: k,
    fill: mix(COLOR.suggestBubble, COLOR.speakBubble, k),
    stroke: mix(COLOR.suggestStroke, COLOR.speakStroke, k),
    color: mix(COLOR.suggestText, COLOR.speakText, k),
  }
}

/** Blend two colours given as hex or rgba(). */
export function mix(a, b, k) {
  const pa = rgba(a)
  const pb = rgba(b)
  const c = [0, 1, 2].map((i) => Math.round(lerp(pa[i], pb[i], k)))
  return `rgba(${c.join(',')},${(lerp(pa[3], pb[3], k)).toFixed(3)})`
}

function rgba(v) {
  if (v.startsWith('#')) return [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16)).concat(1)
  const n = v.match(/-?\d*\.?\d+/g).map(Number)
  return [n[0], n[1], n[2], n.length > 3 ? n[3] : 1]
}

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const lerp = (a, b, t) => a + (b - a) * t
export const smooth = (t) => t * t * (3 - 2 * t)

export const COLOR = {
  frame: '#0D0B10',
  card: '#0D0B10',
  green: '#2D9931',
  avatarRing: '#131313',
  // Padmini, 2026-08-23: pale translucent white rather than the export's
  // near-black, so the bubble reads as glass over whichever tier gradient is
  // behind it and the copy carries in the loop. Matches the "40 Minutes"
  // pill's treatment (white at low alpha + a hairline), which sits 200px above it.
  sarahBubble: 'rgba(255,255,255,0.13)',
  sarahStroke: 'rgba(255,255,255,0.30)',
  sarahText: '#FFFFFF',
  sarahTail: 'rgba(255,255,255,0.13)',
  suggestBubble: '#1F262C',
  suggestStroke: '#7399BD',
  suggestText: '#95BADA',
  suggestTail: '#546777',
  accent: '#7AB6EF',
  speakBubble: 'rgba(91,66,40,0.47)',
  speakText: '#FFD38D',
  speakStroke: 'rgba(160,120,70,0.35)',
}
