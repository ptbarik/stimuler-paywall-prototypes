import { useId, useMemo } from 'react'
import { motion } from 'motion/react'
import { COUPON } from '../theme.js'
import { OFFER } from '../copy.js'

/**
 * V1's offer block — the export's ticket, as drawn.
 *
 * Measured off `COUPON` in the Figma CSS: 250.17 × 137.49, paper `#FEF4CB`,
 * three `#D9D9D9` notches a side at y 38.86 / 62.77 / 86.68 with r 5.98, and a
 * `#FAD643` star above the eyebrow. The scalloped edge in the export is a
 * `Subtract` of those six ellipses out of a 26.9-radius rectangle, so it is
 * rebuilt here the same way — one path with six arc bites rather than six
 * overlaid dots, because the notches have to cut the paper, not sit on it.
 *
 * The diagonal hatch is `Vector 53`–`Vector 95`: forty-three strokes at
 * 35.64°. They are generated at that angle and spacing instead of listed.
 *
 * ── the pop ───────────────────────────────────────────────────────
 *
 * The ticket arrives rather than appears: it comes up from below the fold of
 * its own slot, small and tipped, and lands on one overshoot. Three things are
 * doing the work and they are deliberately not simultaneous —
 *
 * **The paper lands first, and alone.** Nothing else is moving during its
 * overshoot, so the bounce reads as the weight of a physical thing rather than
 * as a page full of elements springing at once.
 *
 * **The shine crosses on the settle, not on the landing.** It starts at 480ms,
 * after the paper has stopped travelling — a highlight sweeping across
 * something still in motion reads as a glitch; across something at rest it
 * reads as a surface catching the light, which is the whole point of putting
 * a coupon on paper.
 *
 * **The figure is last and overshoots hardest.** `50% OFF` is the one number
 * on the block that has to be read, so it is the one thing allowed a second
 * bounce after everything else has settled.
 */

const W = 250.17
const H = 137.49
const NOTCH_R = 5.98
const NOTCH_Y = [38.86 + NOTCH_R, 62.77 + NOTCH_R, 86.68 + NOTCH_R]
const HATCH_DEG = 35.64

function paperPath() {
  const r = 22
  /* clockwise from the top-left corner, biting a semicircle out of each side
     where the export puts an ellipse */
  let d = `M${r},0 L${W - r},0 A${r},${r} 0 0 1 ${W},${r}`
  for (const y of NOTCH_Y) {
    d += ` L${W},${y - NOTCH_R} A${NOTCH_R},${NOTCH_R} 0 0 0 ${W},${y + NOTCH_R}`
  }
  d += ` L${W},${H - r} A${r},${r} 0 0 1 ${W - r},${H} L${r},${H} A${r},${r} 0 0 1 0,${H - r}`
  for (const y of [...NOTCH_Y].reverse()) {
    d += ` L0,${y + NOTCH_R} A${NOTCH_R},${NOTCH_R} 0 0 0 0,${y - NOTCH_R}`
  }
  return d + ` L0,${r} A${r},${r} 0 0 1 ${r},0 Z`
}

export default function CouponTicket({ run = 0, width = 250 }) {
  const uid = useId().replace(/:/g, '')
  const d = useMemo(paperPath, [])
  /* 43 strokes at the export's 35.64°, swept across the diagonal extent */
  const hatch = useMemo(() => {
    const a = (HATCH_DEG * Math.PI) / 180
    const span = Math.abs(W * Math.cos(a)) + Math.abs(H * Math.sin(a))
    return Array.from({ length: 43 }, (_, i) => (i + 0.5) * (span / 43))
  }, [])
  const s = width / W

  return (
    <div className="relative" style={{ width, height: (H + 26) * s }}>
      {/* the ground the ticket lands on — one soft pulse under the paper */}
      <motion.div
        key={`glow-${run}`}
        className="absolute rounded-full pointer-events-none"
        style={{
          left: '50%', top: '52%', width: width * 0.9, height: width * 0.42,
          marginLeft: -width * 0.45, marginTop: -width * 0.21,
          background: COUPON.star, filter: 'blur(38px)',
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.42, 0.14], scale: [0.5, 1.15, 1] }}
        transition={{ duration: 0.9, delay: 0.14, ease: [0.16, 0.8, 0.24, 1], times: [0, 0.45, 1] }}
      />

      <motion.svg
        key={`coupon-${run}`}
        viewBox={`0 0 ${W} ${H + 26}`}
        width={width}
        height={(H + 26) * s}
        className="relative"
        style={{ overflow: 'visible', display: 'block' }}
        initial={{ opacity: 0, scale: 0.34, y: 40, rotate: -9 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
        transition={{
          opacity: { duration: 0.2, delay: 0.1 },
          default: { type: 'spring', visualDuration: 0.62, bounce: 0.5, delay: 0.1 },
        }}
      >
        <defs>
          <clipPath id={`${uid}p`}><path d={d} /></clipPath>
          <filter id={`${uid}sh`} x="-40%" y="-40%" width="180%" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000" floodOpacity=".45" />
          </filter>
          <linearGradient id={`${uid}gl`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity=".85" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform="translate(0,14)">
          <path d={d} fill={COUPON.paper} filter={`url(#${uid}sh)`} />

          <g clipPath={`url(#${uid}p)`} opacity=".5">
            {hatch.map((o, i) => (
              <line key={i}
                    x1={o} y1={-40} x2={o - (H + 80) * Math.tan((HATCH_DEG * Math.PI) / 180)} y2={H + 40}
                    stroke={i % 2 ? COUPON.texture : COUPON.textureDim}
                    strokeWidth="1.1" opacity=".28" />
            ))}
          </g>

          {/*
            The shine, at the hatch's own 35.64° so the two read as one
            surface. Clipped to the paper, so it crosses the notches rather
            than sliding over them.
          */}
          <g clipPath={`url(#${uid}p)`}>
            <motion.rect
              key={`shine-${run}`}
              x={-70} y={-70} width={54} height={H + 140}
              fill={`url(#${uid}gl)`}
              transform={`rotate(${HATCH_DEG} ${W / 2} ${H / 2})`}
              initial={{ x: -110, opacity: 0 }}
              animate={{ x: [-110, W + 70], opacity: [0, 0.55, 0] }}
              transition={{ duration: 0.78, delay: 0.48, ease: [0.32, 0, 0.24, 1], times: [0, 0.3, 1] }}
            />
          </g>

          {/*
            The star's placing is an SVG `transform` attribute on a wrapping
            `<g>` and its spring is a CSS transform on the path inside it. They
            cannot share an element: a CSS `transform` replaces the attribute
            outright rather than composing with it, so animating scale on the
            positioned node throws the star back to the origin.
          */}
          <g transform={`translate(${W / 2},${H / 2 - 30})`}>
            <motion.path
              key={`star-${run}`}
              d="M0,-16 3.9,-5.5 15,-3.7 6.9,4 9,15.2 0,9.6 -9,15.2 -6.9,4 -15,-3.7 -3.9,-5.5Z"
              fill={COUPON.star}
              initial={{ scale: 0, rotate: -60 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', visualDuration: 0.44, bounce: 0.62, delay: 0.4 }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
          </g>

          <motion.text
            key={`eb-${run}`}
            x={W / 2} y={H / 2 + 2} textAnchor="middle" fill={COUPON.ink}
            style={{ font: '600 14.86px "Inter Display",sans-serif', letterSpacing: '-.01em' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.46 }}
          >
            {OFFER.eyebrow}
          </motion.text>

          <g transform={`translate(${W / 2},${H / 2 + 38})`}>
            <motion.text
              key={`fig-${run}`}
              textAnchor="middle" fill={COUPON.figure}
              style={{
                font: '700 34.46px "Inter Display",sans-serif', letterSpacing: '-.01em',
                transformBox: 'fill-box', transformOrigin: 'center',
              }}
              initial={{ opacity: 0, scale: 0.62 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', visualDuration: 0.5, bounce: 0.55, delay: 0.56 }}
            >
              {OFFER.figure}
            </motion.text>
          </g>
        </g>
      </motion.svg>
    </div>
  )
}
