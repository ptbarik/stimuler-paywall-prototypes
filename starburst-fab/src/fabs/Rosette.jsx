import { useId, useMemo } from 'react'
import { ring, roundedPath, facets } from '../paywall/starburst.js'

/**
 * The paywall's badge, at tab size.
 *
 * It imports `starburst.js` rather than carrying its own path, which is the
 * whole reason the hand-off works: the rosette your thumb lands on and the
 * rosette waiting on the paywall are the *same nine vertices*, so when one
 * becomes the other there is no silhouette to cross-fade. Facets included —
 * at 50px they are nearly subliminal, but they are what stops the badge
 * reading as a flat sticker when the light crosses it.
 *
 * **The figure is `size * 0.195`, which is `StarburstOffer`'s own fraction.**
 * Not a copy of the number — the same rule. The badge travels from 50px on the
 * tab to 276 on the paywall during the open, and a figure set in fixed pixels
 * would have to pop at some point in that journey. Being a fraction of the
 * badge means it simply scales, and the two ends agree without being
 * coordinated.
 *
 * It is also why the badge says `50%` and nothing else. `50% / OFF` is right at
 * 276, where OFF has 17px to live in; at 50 it has three, and a word nobody can
 * read is worse than a word that isn't there. The tab's copy carries *off*.
 */

const N = 9
const R = 78
const RI = 57.5
export const VB = 220

/** the geometry, computed once for the whole app */
let cached = null
export function rosetteGeometry() {
  if (!cached) {
    const pts = ring(N, R, RI)
    cached = { path: roundedPath(pts, 7, 17), facets: facets(pts) }
  }
  return cached
}

export const GOLD = ['#FFE7A8', '#E8B54B', '#B47A22']

export default function Rosette({ size, fill = 'gold', figure = '50%', ink = '#fff', shapeOnly = false }) {
  const uid = useId().replace(/:/g, '')
  const g = useMemo(rosetteGeometry, [])
  const solid = fill !== 'gold'

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg viewBox={`${-VB / 2} ${-VB / 2} ${VB} ${VB}`} width={size} height={size}
           style={{ display: 'block', overflow: 'visible' }} aria-hidden>
        <defs>
          {!solid && (
            <linearGradient id={`${uid}f`} x1="18%" y1="4%" x2="82%" y2="96%">
              <stop offset="0%" stopColor={GOLD[0]} />
              <stop offset="52%" stopColor={GOLD[1]} />
              <stop offset="100%" stopColor={GOLD[2]} />
            </linearGradient>
          )}
          <radialGradient id={`${uid}h`} cx="32%" cy="24%" r="72%">
            <stop offset="0%" stopColor="#fff" stopOpacity=".30" />
            <stop offset="65%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${uid}c`}><path d={g.path} /></clipPath>
        </defs>

        <path d={g.path} fill={solid ? fill : `url(#${uid}f)`} />
        {!solid && (
          <g clipPath={`url(#${uid}c)`}>
            {g.facets.map((f, i) => (
              <path key={i} d={f.d} fill={f.lift > 0 ? '#fff' : '#000'}
                    fillOpacity={Math.abs(f.lift) * (f.lift > 0 ? 0.11 : 0.14)} />
            ))}
            <path d={g.path} fill={`url(#${uid}h)`} />
          </g>
        )}
      </svg>

      {/* outside the svg, so it never turns with the rosette — a discount
          that rotates is a discount nobody can read */}
      {!shapeOnly && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <span className="font-id" style={{
            fontSize: size * 0.195, fontWeight: 700, letterSpacing: '-.03em',
            color: ink, lineHeight: 1,
          }}>{figure}</span>
        </div>
      )}
    </div>
  )
}
