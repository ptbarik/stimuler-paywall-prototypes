import { useId, useMemo } from 'react'
import { motion } from 'motion/react'
import { ring, roundedPath, facets, contour } from '../starburst.js'
import { Sparkle } from '../Icons.jsx'
import { OFFER } from '../copy.js'

/**
 * V2's offer block — the coupon's replacement.
 *
 * The motion is the StressWatch pricing shot's anatomy, rebuilt rather than
 * copied: a faceted rosette arrives, a second one counter-rotates in behind
 * it, topographic rings settle around them, the figure fades up, and the pair
 * then turn against each other forever. Nothing of that shot's colour, copy or
 * layout is here — the geometry is `starburst.js`, the palette is the tier's,
 * and the block sits in the paywall's own rhythm.
 *
 * ── the entrance ──────────────────────────────────────────────────
 *
 * **It arrives as itself, at size.** There was a seed dot here that scaled up
 * into the badge, and it read as a loading spinner resolving rather than as an
 * object turning up — the eye spends the first 300ms asking what the dot *is*
 * instead of reading the offer. The entrance is now V1's, beat for beat: up
 * from below its own slot, already legible as a rosette, tipped, landing on
 * one overshoot. Both versions answer *how does the discount get here* the
 * same way now, so the comparison between them is about the object and not
 * about its arrival.
 *
 * **The figure lands late, and after the overshoot.** `50%` fades at 440ms,
 * past the badge's own settle. Overlapping them puts two things overshooting
 * in the same 200ms and the result reads as bounce; separated, the badge is
 * weight and the figure is arrival.
 *
 * ── the idle ──────────────────────────────────────────────────────
 *
 * The two rosettes turn against each other, slowly and forever — the front
 * clockwise on 80s, the back counter on 110s. Opposed rather than together
 * because two shapes rotating the same way at different speeds read as one
 * shape with a rendering bug; opposed, they read as two objects.
 *
 * A full 360° rather than the 40° the nine-fold silhouette would allow: the
 * facet shading is fixed to the shape and turns with it, so only a whole
 * revolution puts every facet back where it started. Anything less loops with
 * a visible jump in the lighting.
 *
 * The cast shadow is deliberately *outside* both spins. A drop shadow that
 * rotates with its object swings its offset around the badge like a clock
 * hand, which is the one thing that would give away that this is a flat shape
 * being turned rather than an object with a light above it.
 */

/* Timing, in ms from the block being told to play. Kept as one object so the
   numbers quoted in the README and the numbers that run cannot drift. */
const T = {
  pop: 100,
  rings: 260,
  figure: 440,
  off: 520,
  idle: 1200,
}
const ms = (n) => n / 1000

/* the idle turn: seconds for one full revolution, front and back */
const SPIN = { front: 80, back: 110 }

const N = 9          // points
const R = 78         // outer radius
const RI = 57.5      // waist
const VB = 220       // the viewBox the two radii are quoted in

/**
 * The contour rings, as multiples of the badge's own radius.
 *
 * Three, a clean 0.25 apart, from 1.12 out to 1.62. Five and seven were both
 * tried: past three they stop being a field the badge sits in and become a
 * pattern in their own right, competing with the figure they exist to frame.
 * Three is also what lets them be spaced *widely* — at five, fitting the same
 * reach meant 0.15 steps, and adjacent rings that close read as a single
 * thick, fuzzy edge rather than as separate contours.
 *
 * The innermost starts at 1.12 rather than hugging the badge at 1.04, where it
 * would have read as an outline drawn on the rosette instead of the first line
 * of something around it.
 *
 * They are stated as radii rather than as an abstract spread factor because
 * how far they reach past the badge is the one thing about them anybody ever
 * wants to change, and it should not require solving for it.
 */
const RINGS = [1.12, 1.37, 1.62]

/**
 * `size` is the svg's box. `slot` is how much column the block *claims*.
 *
 * They are separate on purpose, and the gap between them is this block's whole
 * layout argument.
 *
 * The rosette's outer radius is 78 of the viewBox's 110, so at `size` 276 the
 * badge itself draws 196 across — which is exactly `slot`. The badge fills the
 * column it claims; the extra 80 of `size` is the margin the *rings* need, and
 * they are allowed to spill out of it. So the field reaches ~320, passing
 * behind the timer below and under the header's blur above, while the timer,
 * the heading and the feature card stay on the lines V1 puts them on and the
 * card keeps its glimpse above the price sheet.
 *
 * That is the trade, stated plainly: the offer got bigger by overrunning its
 * slot rather than by claiming more of one. Claiming more would have cost the
 * feature card its glimpse, which is worth more than one faint ring crossing a
 * countdown.
 */
export default function StarburstOffer({ t, run = 0, size = 276, slot = 196 }) {
  const uid = useId().replace(/:/g, '')
  const g = useMemo(() => {
    const pts = ring(N, R, RI)
    return {
      path: roundedPath(pts, 7, 17),
      facets: facets(pts),
      rings: RINGS.map((mult, i) => contour(N, R, RI, mult, i)),
    }
  }, [])

  const [c0, c1, c2] = t.starA
  /* the figure is a fraction of the badge, not a fixed size — the waist is
     26% of `size`, so a fixed 46px would touch it the moment the badge grew */
  const pct = size * 0.195
  const off = size * 0.063

  /* V1's landing, in one place: the rosettes and their shadow ride the same
     spring, so they arrive as one object rather than three.

     It starts at 0.52 rather than V1's 0.34. The ticket is 250 wide and reads
     as a ticket at a third of that; the rosette is 196 and at a third it is a
     70px blob with its own blurred shadow around it — indistinguishable from
     the seed dot this entrance replaced. Half size is the point where the nine
     lobes are still countable, which is what makes the first frame an object
     rather than a shape resolving. */
  const land = {
    /* the fade is short and starts ahead of the spring on purpose. At 0.22s it
       was still under half opaque at 150ms, and a half-opaque badge over this
       ground is a pale blob — the exact read the seed dot was removed for. The
       shape has to be solid before it has finished travelling. */
    opacity: { duration: 0.13, delay: ms(T.pop) - 0.05 },
    default: { type: 'spring', visualDuration: 0.62, bounce: 0.5, delay: ms(T.pop) },
  }
  const origin = { transformOrigin: '50% 50%' }

  return (
    <div className="relative flex items-center justify-center" style={{ width: '100%', height: slot }}>
      {/*
        V1's ticket lands on a soft glow pulse; this one does not, and the
        reason is that the two blocks are different shapes. The ticket is
        opaque paper, so a bloom underneath reads as light bouncing off a
        surface. The badge spends its first 300ms small, and a bloom sized to
        the *landed* badge is three times the width of the rising one — the
        halo swallows the object it is supposed to be lighting. The cast
        shadow below is `starA`'s darkest stop, which on this ground already
        reads as a bloom, and it scales with the badge because it is drawn in
        the same coordinate space.
      */}
      <div className="absolute" style={{ width: size, height: size, left: '50%', top: '50%', marginLeft: -size / 2, marginTop: -size / 2 }}>
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
              <feGaussianBlur stdDeviation="13" />
            </filter>
          </defs>

          {/* the contour field */}
          <g>
            {g.rings.map((d, i) => (
              <motion.path
                key={`${run}-r${i}`}
                d={d}
                fill="none"
                stroke="#fff"
                strokeWidth={1}
                initial={{ opacity: 0, scale: 0.72 }}
                animate={{
                  opacity: [0, 0.16 - i * 0.03, 0.085 - i * 0.017],
                  scale: [0.72, 1.04, 1],
                }}
                transition={{
                  duration: 1.15,
                  delay: ms(T.rings) + i * 0.09,
                  ease: [0.16, 0.8, 0.24, 1],
                  times: [0, 0.55, 1],
                }}
                style={origin}
              />
            ))}
          </g>

          {/* the cast shadow — rides the landing, sits out both spins */}
          <motion.g
            key={`${run}-sh`}
            style={origin}
            initial={{ opacity: 0, scale: 0.52, y: 22 }}
            animate={{ opacity: 0.45, scale: 1, y: 0 }}
            transition={land}
          >
            <g transform="translate(0,11)">
              <path d={g.path} fill={c2} filter={`url(#${uid}s)`} />
            </g>
          </motion.g>

          {/* the back rosette */}
          <motion.g
            key={`${run}-b`}
            style={origin}
            initial={{ opacity: 0, scale: 0.52, y: 22, rotate: -40 }}
            animate={{ opacity: t.starBAlpha, scale: 1.02, y: 0, rotate: -11 }}
            transition={land}
          >
            <motion.path
              d={g.path}
              fill={t.starB}
              animate={{ rotate: [0, -360] }}
              transition={{ duration: SPIN.back, repeat: Infinity, ease: 'linear', delay: ms(T.idle) }}
              style={origin}
            />
          </motion.g>

          {/* the front rosette — the one that carries the figure */}
          <motion.g
            key={`${run}-f`}
            style={origin}
            initial={{ opacity: 0, scale: 0.52, y: 22, rotate: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            transition={land}
          >
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: SPIN.front, repeat: Infinity, ease: 'linear', delay: ms(T.idle) }}
              style={origin}
            >
              <path d={g.path} fill={`url(#${uid}f)`} />
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

        {/* the figure. Outside the svg, so it never turns with the rosette —
            a discount that rotates is a discount nobody can read. */}
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
