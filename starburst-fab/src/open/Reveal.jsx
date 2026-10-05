import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import { bloomPath } from '../fabs/bloom.js'
import { GOLD } from '../fabs/Rosette.jsx'

/**
 * Where the badge comes from, on the six tabs that never show one.
 *
 * Each of these takes the device the tab was carrying and gets it to a disc;
 * `Bloom` takes it from there. Splitting it that way is the only reason six
 * mechanics are affordable — the half of the move that has to be identical
 * every time (disc → nine points, in the paywall's own geometry) is written
 * once, and the half that has to be different every time is six short beats.
 *
 * There are four of those beats, not six. `price`, `odometer` and `lock` all
 * do the same thing — a rounded rectangle packs down into a circle — because
 * all three are *a block of something* collapsing, and the only honest
 * difference between them is where the block starts and how big it is. Saying
 * that plainly is better than writing three near-identical functions and
 * claiming three ideas.
 */

export const REVEAL_MS = 460
/* a commit arrives already a disc, so it only owes the points */
export const BLOOM_MS = 300
const DISC_AT = 0.22      // device is a disc by here
const OUT = [0.22, 0.72, 0.24, 1]

const grad = (id) => (
  <linearGradient id={id} x1="18%" y1="4%" x2="82%" y2="96%">
    <stop offset="0%" stopColor={GOLD[0]} />
    <stop offset="52%" stopColor={GOLD[1]} />
    <stop offset="100%" stopColor={GOLD[2]} />
  </linearGradient>
)

/**
 * Disc → badge, in the paywall's own vertices.
 *
 * `d` is driven off a scalar rather than handed to motion as a list of path
 * strings. Path interpolation would work here — every frame has the same
 * command structure — but a scalar is the thing that is actually being
 * animated, and keeping it that way means the easing curve applies to the
 * radius instead of to a string.
 */
function Bloom({ cx, cy, size, delay }) {
  const t = useMotionValue(0)
  const d = useTransform(t, bloomPath)

  useEffect(() => {
    const c = animate(t, 1, { duration: 0.24, delay, ease: OUT })
    return () => c.stop()
  }, [t, delay])

  return (
    <motion.svg
      viewBox="-110 -110 220 220" width={size} height={size}
      style={{ position: 'absolute', left: cx - size / 2, top: cy - size / 2, overflow: 'visible' }}
      /* a short overshoot on the way out of the disc — the points arriving
         with a little more than they keep reads as them being pushed out
         rather than drawn on */
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 0.3, delay, times: [0, 0.6, 1], ease: OUT }}
    >
      <defs>{grad('bloomG')}</defs>
      <motion.path d={d} fill="url(#bloomG)" />
      {/* the figure arrives with the points, not after them. Set at the
          paywall's own `size * 0.195` in viewBox units so it is the same
          glyph the flying copy hands over to. */}
      <motion.text
        x="0" y="16" textAnchor="middle" className="font-id"
        fontSize={0.195 * 220} fontWeight="700" letterSpacing="-1" fill="#fff"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.14, delay: delay + 0.1 }}
      >50%</motion.text>
    </motion.svg>
  )
}

/** price · odometer · lock — a block of something packing down into a circle */
function Collapse({ from, cx, cy, size }) {
  return (
    <motion.div
      style={{ position: 'absolute', background: `linear-gradient(140deg,${GOLD[0]},${GOLD[1]} 55%,${GOLD[2]})` }}
      initial={{ left: from.x, top: from.y, width: from.w, height: from.h, borderRadius: from.r, opacity: 0 }}
      animate={{
        left: cx - size / 2, top: cy - size / 2, width: size, height: size,
        borderRadius: size / 2, opacity: [0, 1, 1],
      }}
      transition={{ duration: DISC_AT, ease: OUT, opacity: { duration: 0.1, times: [0, 0.6, 1] } }}
    />
  )
}

/** gauge — the arc runs to full, then thickens into the disc it was tracing */
function Gauge({ cx, cy, size }) {
  const R = 15
  const C = 2 * Math.PI * R
  return (
    <motion.svg
      viewBox="0 0 38 38" width={size} height={size}
      style={{ position: 'absolute', left: cx - size / 2, top: cy - size / 2 }}
      initial={{ opacity: 1 }} animate={{ opacity: 1 }}
    >
      <defs>{grad('gaugeG')}</defs>
      <circle cx="19" cy="19" r={R} fill="none" stroke="#6E5B35" strokeWidth="4.5" />
      {/* the sweep: half to whole, from the top, clockwise */}
      <motion.circle
        cx="19" cy="19" r={R} fill="none" stroke="url(#gaugeG)" strokeLinecap="round"
        transform="rotate(-90 19 19)"
        initial={{ strokeWidth: 4.5, strokeDasharray: C, strokeDashoffset: C / 2 }}
        animate={{ strokeWidth: [4.5, 4.5, R], strokeDashoffset: [C / 2, 0, 0] }}
        transition={{ duration: DISC_AT, times: [0, 0.62, 1], ease: OUT }}
      />
    </motion.svg>
  )
}

/** scratch — the foil wipes off a badge that was under it the whole time */
function Scratch({ strip, cx, cy, size }) {
  return (
    <>
      <motion.svg
        viewBox="-110 -110 220 220" width={size} height={size}
        style={{ position: 'absolute', left: cx - size / 2, top: cy - size / 2 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.08 }}
      >
        <defs>{grad('scratchG')}</defs>
        <path d={bloomPath(1)} fill="url(#scratchG)" />
        <text x="0" y="16" textAnchor="middle" className="font-id"
              fontSize={0.195 * 220} fontWeight="700" letterSpacing="-1" fill="#fff">50%</text>
      </motion.svg>
      <motion.div
        style={{
          position: 'absolute', left: strip.x, top: strip.y, height: strip.h,
          borderRadius: 11, overflow: 'hidden',
          background: 'linear-gradient(118deg,#8C8578 0%,#D3CCBC 46%,#9A9284 100%)',
        }}
        initial={{ width: strip.w }}
        animate={{ width: 0 }}
        transition={{ duration: DISC_AT + 0.06, ease: [0.5, 0, 0.3, 1] }}
      />
    </>
  )
}

/** bar — the day's hairline runs to full, then gathers to a point at centre */
function Bar({ rail, cx, cy }) {
  return (
    <motion.div
      style={{ position: 'absolute', height: 3, borderRadius: 2, background: `linear-gradient(90deg,${GOLD[2]},${GOLD[0]})` }}
      initial={{ left: rail.x, top: rail.y, width: rail.lit }}
      animate={{ left: [rail.x, rail.x, cx], top: [rail.y, rail.y, cy], width: [rail.lit, rail.w, 0] }}
      transition={{ duration: DISC_AT, times: [0, 0.55, 1], ease: OUT }}
    />
  )
}

export default function Reveal({ reveal }) {
  const { kind, cx, cy, size } = reveal
  const common = { cx, cy, size }
  /* `commit` is the glass tabs: the user's own gesture already got the device
     to a disc — the knob, the ring, the chip, the stub — so there is no device
     beat left to play and only the nine points are owed. */
  const out = kind === 'commit' ? BLOOM_MS / 1000 : REVEAL_MS / 1000
  return (
    /*
      This goes out as the flight starts. Without it the badge that was just
      made stays sitting on the tab while an identical one travels to the
      paywall — two badges, which is the exact read the hand-off exists to
      avoid. 100ms, overlapping the flying copy's own fade-in, so nothing is
      ever half-there.
    */
    <motion.div
      style={{ position: 'absolute', inset: 0 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.1, delay: out }}
    >
      {kind === 'gauge' && <Gauge {...common} />}
      {kind === 'scratch' && <Scratch {...common} strip={reveal.strip} />}
      {kind === 'bar' && <Bar {...common} rail={reveal.rail} />}
      {(kind === 'price' || kind === 'odometer' || kind === 'lock') && <Collapse {...common} from={reveal.from} />}
      {kind !== 'scratch' && <Bloom {...common} delay={kind === 'commit' ? 0.04 : DISC_AT} />}
    </motion.div>
  )
}
