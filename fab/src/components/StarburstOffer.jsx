import { useId, useMemo } from 'react'
import { motion } from 'motion/react'
import { ring, roundedPath, facets, contour } from '../starburst.js'
import { Sparkle } from '../Icons.jsx'
import { OFFER } from '../copy.js'

/**
 * V2's offer block — the coupon's replacement.
 *
 * The motion is the StressWatch pricing shot's anatomy, rebuilt rather than
 * copied: a seed dot sits alone, springs open into a faceted rosette that
 * lands with one overshoot, a second rosette behind it counter-rotates in,
 * topographic rings blow out past the edge and fade, and only then does the
 * figure inside and the struck-through old price fade up. Nothing of that
 * shot's colour, copy or layout is here — the geometry is `starburst.js`, the
 * palette is the tier's, and the block sits in the paywall's own rhythm.
 *
 * ── the two decisions worth defending ─────────────────────────────
 *
 * **The dot is the badge, not a placeholder for it.** It is `seedDot` at 7px,
 * which is the back rosette's fill; when the spring fires, the thing that
 * grows is already on screen. That is what makes the entry read as one object
 * arriving rather than two objects swapping.
 *
 * **The figure lands late, and after the overshoot.** `50%` fades at 520ms,
 * which is past the badge's own settle. Overlapping them puts two things
 * overshooting in the same 200ms and the result reads as bounce; separated,
 * the badge is weight and the figure is arrival.
 *
 * ── on the label that used to sit above it ────────────────────────
 *
 * There was a `✦ WELCOME OFFER ✦` line and a `For limited time only` subtitle
 * here. Both are gone. The badge says `50% OFF` and the heading two intervals
 * down says `Limited Time 50% Offer Today` — the label was a third statement
 * of the same fact, and it was the one with nothing to add. The height it
 * freed went into the badge rather than into whitespace, which is why the
 * figure now has margin inside the rosette instead of touching its waist.
 */

/* Timing, in ms from the block being told to play. Kept as one object so the
   numbers quoted in the README and the numbers that run cannot drift. */
const T = {
  seed: 0,
  pop: 300,
  rings: 350,
  figure: 520,
  off: 600,
  idle: 1500,
}
const ms = (n) => n / 1000

const N = 9          // points
const R = 78         // outer radius
const RI = 57.5      // waist
const RINGS = 5
const VB = 220       // the viewBox the two radii are quoted in

export default function StarburstOffer({ t, run = 0, size = 244 }) {
  const uid = useId().replace(/:/g, '')
  const g = useMemo(() => {
    const pts = ring(N, R, RI)
    return {
      path: roundedPath(pts, 7, 17),
      facets: facets(pts),
      rings: Array.from({ length: RINGS }, (_, i) => contour(N, R, RI, 0.25 + i * 0.42, i)),
    }
  }, [])

  const [c0, c1, c2] = t.starA
  /* the figure is a fraction of the badge, not a fixed size — the waist is
     26% of `size`, so a fixed 46px would touch it the moment the badge grew */
  const pct = size * 0.195
  const off = size * 0.063

  return (
    <div className="relative flex flex-col items-center" style={{ width: '100%' }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`${-VB / 2} ${-VB / 2} ${VB} ${VB}`} width={size} height={size}
             style={{ overflow: 'visible', display: 'block' }}>
          <defs>
            <linearGradient id={`${uid}f`} x1="18%" y1="4%" x2="82%" y2="96%">
              <stop offset="0%" stopColor={c0} />
              <stop offset="52%" stopColor={c1} />
              <stop offset="100%" stopColor={c2} />
            </linearGradient>
            <radialGradient id={`${uid}h`} cx="32%" cy="24%" r="72%">
              <stop offset="0%" stopColor="#fff" stopOpacity=".30" />
              <stop offset="65%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <clipPath id={`${uid}c`}><path d={g.path} /></clipPath>
            <filter id={`${uid}s`} x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor={c2} floodOpacity=".45" />
            </filter>
          </defs>

          {/* topographic rings — out past the badge, then held faint */}
          <g>
            {g.rings.map((d, i) => (
              <motion.path
                key={`${run}-r${i}`}
                d={d}
                fill="none"
                stroke="#fff"
                strokeWidth={1}
                initial={{ opacity: 0, scale: 0.35 }}
                animate={{ opacity: [0, 0.13, 0.055], scale: [0.35, 1.06, 1] }}
                transition={{
                  duration: 1.15,
                  delay: ms(T.rings) + i * 0.075,
                  ease: [0.16, 0.8, 0.24, 1],
                  times: [0, 0.55, 1],
                }}
                style={{ transformOrigin: '50% 50%' }}
              />
            ))}
          </g>

          {/* the back rosette — counter-rotates in, then drifts */}
          <motion.g
            key={`${run}-b`}
            style={{ transformOrigin: '50% 50%' }}
            initial={{ scale: 0.06, rotate: -46, opacity: 0 }}
            animate={{ scale: 1.02, rotate: -11, opacity: t.starBAlpha }}
            transition={{
              scale: { type: 'spring', visualDuration: 0.7, bounce: 0.4, delay: ms(T.pop) },
              rotate: { type: 'spring', visualDuration: 0.8, bounce: 0.3, delay: ms(T.pop) },
              opacity: { duration: 0.18, delay: ms(T.pop) },
            }}
          >
            <motion.path
              d={g.path}
              fill={t.starB}
              animate={{ rotate: [-11, -15, -11] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: ms(T.idle) }}
              style={{ transformOrigin: '50% 50%' }}
            />
          </motion.g>

          {/* the front rosette — the one that carries the figure */}
          <motion.g
            key={`${run}-f`}
            style={{ transformOrigin: '50% 50%' }}
            initial={{ scale: 0.05, rotate: 38 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              scale: { type: 'spring', visualDuration: 0.62, bounce: 0.46, delay: ms(T.pop) },
              rotate: { type: 'spring', visualDuration: 0.75, bounce: 0.32, delay: ms(T.pop) },
            }}
          >
            <motion.g
              animate={{ rotate: [0, 3.2, 0], scale: [1, 1.016, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: ms(T.idle) }}
              style={{ transformOrigin: '50% 50%' }}
            >
              <path d={g.path} fill={`url(#${uid}f)`} filter={`url(#${uid}s)`} />
              {/* one triangle per half-lobe: the low-poly cut */}
              <g clipPath={`url(#${uid}c)`}>
                {g.facets.map((f, i) => (
                  <path
                    key={i}
                    d={f.d}
                    fill={f.lift > 0 ? '#fff' : '#000'}
                    fillOpacity={Math.abs(f.lift) * (f.lift > 0 ? 0.11 : 0.14)}
                  />
                ))}
                <path d={g.path} fill={`url(#${uid}h)`} />
              </g>
            </motion.g>
          </motion.g>
        </svg>

        {/* the seed. Sits alone, then hands over to the spring. */}
        <motion.span
          key={`${run}-seed`}
          className="absolute rounded-full"
          style={{ width: 7, height: 7, left: '50%', top: '50%', marginLeft: -3.5, marginTop: -3.5, background: t.seedDot }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 2.4 }}
          transition={{ duration: 0.22, delay: ms(T.pop) }}
        />

        {/* the figure */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span
            key={`${run}-pct`}
            className="font-id"
            style={{ fontSize: pct, fontWeight: 700, letterSpacing: '-.03em', color: '#fff', lineHeight: 1 }}
            initial={{ opacity: 0, scale: 0.82, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.46, delay: ms(T.figure), ease: [0.2, 0.72, 0.24, 1] }}
          >
            {OFFER.pct}
          </motion.span>
          <motion.span
            key={`${run}-off`}
            className="font-id"
            style={{ fontSize: off, fontWeight: 600, letterSpacing: '.16em', color: 'rgba(255,255,255,.92)', marginTop: size * 0.012 }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: ms(T.off), ease: [0.2, 0.72, 0.24, 1] }}
          >
            OFF
          </motion.span>
        </div>

        {/* sparkles — in and out on their own clocks, never in phase */}
        {[
          [0.86, -0.62, 9], [-0.9, 0.34, 7], [0.62, 0.86, 6],
          [-0.55, -0.86, 8], [1.02, 0.22, 5], [-0.2, 1.0, 6],
        ].map(([x, y, s], i) => (
          <motion.span
            key={`${run}-sp${i}`}
            className="absolute"
            style={{ left: `calc(50% + ${x * (size / 2) * 0.86}px)`, top: `calc(50% + ${y * (size / 2) * 0.86}px)` }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1, 0.5] }}
            transition={{
              duration: 2.2 + i * 0.35,
              repeat: Infinity,
              repeatDelay: 0.6 + i * 0.28,
              delay: ms(T.rings) + i * 0.32,
              ease: 'easeInOut',
            }}
          >
            <Sparkle size={s * (size / 196)} color={t.spark} />
          </motion.span>
        ))}
      </div>
    </div>
  )
}

export { T as STARBURST_TIMING }
