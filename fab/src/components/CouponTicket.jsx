import { useId, useMemo } from 'react'
import { motion } from 'motion/react'
import { COUPON } from '../theme.js'
import { OFFER } from '../copy.js'

/**
 * V1's offer block — the export's ticket, as drawn.
 *
 * Measured off `COUPON` in the Figma CSS: 250.17 × 137.49, paper `#FEF4CB`,
 * three `#D9D9D9` notches a side at y 38.86 / 62.77 / 86.68 with r 5.98, and
 * a `#FAD643` star sitting 35.3 above centre and 61.87 right of it. The
 * scalloped edge in the export is a `Subtract` of those six ellipses out of a
 * 26.9-radius rectangle, so it is rebuilt here the same way — one path with
 * six arc bites rather than six overlaid dots, because the notches have to cut
 * the paper, not sit on it.
 *
 * The diagonal hatch is `Vector 53`–`Vector 95`: forty-three strokes at 35.64°.
 * They are generated at that angle and spacing instead of listed.
 */

const W = 250.17
const H = 137.49
const NOTCH_R = 5.98
const NOTCH_Y = [38.86 + NOTCH_R, 62.77 + NOTCH_R, 86.68 + NOTCH_R]

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
    const a = (35.64 * Math.PI) / 180
    const span = Math.abs(W * Math.cos(a)) + Math.abs(H * Math.sin(a))
    return Array.from({ length: 43 }, (_, i) => (i + 0.5) * (span / 43))
  }, [])

  return (
    <motion.svg
      key={`coupon-${run}`}
      viewBox={`0 0 ${W} ${H + 18}`}
      width={width}
      height={(width / W) * (H + 18)}
      style={{ overflow: 'visible', display: 'block' }}
      initial={{ opacity: 0, scale: 0.94, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', visualDuration: 0.55, bounce: 0.28, delay: 0.15 }}
    >
      <defs>
        <clipPath id={`${uid}p`}><path d={d} /></clipPath>
        <filter id={`${uid}sh`} x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity=".35" />
        </filter>
      </defs>

      <g transform="translate(0,10)">
        <path d={d} fill={COUPON.paper} filter={`url(#${uid}sh)`} />

        <g clipPath={`url(#${uid}p)`} opacity=".5">
          {hatch.map((off, i) => (
            <line key={i}
                  x1={off} y1={-40} x2={off - (H + 80) * Math.tan((35.64 * Math.PI) / 180)} y2={H + 40}
                  stroke={i % 2 ? COUPON.texture : COUPON.textureDim}
                  strokeWidth="1.1" opacity=".28" />
          ))}
        </g>

        {/*
          The star, centred over the eyebrow as the export renders it.

          The placing is an SVG `transform` attribute on a wrapping `<g>` and
          the spring is a CSS transform on the path inside it. They cannot
          share an element: a CSS `transform` replaces the attribute outright
          rather than composing with it, so animating scale on the positioned
          node throws the star back to the origin.
        */}
        <g transform={`translate(${W / 2},${H / 2 - 30})`}>
          <motion.path
            d="M0,-16 3.9,-5.5 15,-3.7 6.9,4 9,15.2 0,9.6 -9,15.2 -6.9,4 -15,-3.7 -3.9,-5.5Z"
            fill={COUPON.star}
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', visualDuration: 0.5, bounce: 0.5, delay: 0.42 }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        </g>

        <text x={W / 2} y={H / 2 + 2} textAnchor="middle" fill={COUPON.ink}
              style={{ font: '600 14.86px "Inter Display",sans-serif', letterSpacing: '-.01em' }}>
          {OFFER.eyebrow}
        </text>
        <text x={W / 2} y={H / 2 + 38} textAnchor="middle" fill={COUPON.figure}
              style={{ font: '700 34.46px "Inter Display",sans-serif', letterSpacing: '-.01em' }}>
          {OFFER.figure}
        </text>
      </g>
    </motion.svg>
  )
}
