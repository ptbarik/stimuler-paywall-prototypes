import { useId } from 'react'
import { SLOT } from './parts.jsx'

/**
 * The pane's light, once.
 *
 * A single soft band crossing the pill on the diagonal. It shows up twice — as
 * a wash over the pane and as a glint on the border — but it is one travelling
 * object: both elements are the same width, start at the same x and carry the
 * same `light-wipe` keyframes, so the lit stretch of edge is always the stretch
 * the wash is passing over.
 *
 * The border version is the same band used as a *mask* on the outline stroke,
 * which is what makes it subtle: the stroke can only be as bright as the band's
 * own falloff at that point, so it fades up and down instead of arriving as a
 * hard dash. Nothing about it is tuned separately — turn the band's opacity
 * down and both get quieter together.
 */

const BAND = 170          // both the wash and the mask are this wide
const SKEW = -14

export function PaneLight({ radius, shape, strength = 0.20, edge = 0.5, border = 1, edgeColor = '#FFE9B8' }) {
  const uid = useId().replace(/:/g, '')
  const inset = border / 2

  /* the wash: wide, feathered on both sides and blurred, so what passes is a
     spread of light rather than the edge of a rectangle */
  const wash = (
    <div style={{
      position: 'absolute', left: 0, top: 0, width: SLOT.w, height: SLOT.h,
      borderRadius: shape ? undefined : radius,
      clipPath: shape ? `path('${shape}')` : undefined,
      overflow: 'hidden', pointerEvents: 'none',
    }}>
      <div className="light-wipe"
           style={{
             position: 'absolute', left: 0, top: -80, width: BAND, height: 260,
             background: `linear-gradient(90deg,
               rgba(255,252,240,0) 0%,
               rgba(255,252,240,${(strength * 0.18).toFixed(3)}) 18%,
               rgba(255,252,240,${(strength * 0.62).toFixed(3)}) 36%,
               rgba(255,252,240,${strength.toFixed(3)}) 50%,
               rgba(255,252,240,${(strength * 0.62).toFixed(3)}) 64%,
               rgba(255,252,240,${(strength * 0.18).toFixed(3)}) 82%,
               rgba(255,252,240,0) 100%)`,
             filter: 'blur(14px)',
           }} />
    </div>
  )

  const geom = shape
    ? { d: shape }
    : { x: inset, y: inset, width: SLOT.w - border, height: SLOT.h - border, rx: radius - inset }
  const El = shape ? 'path' : 'rect'

  return (
    <>
      {wash}
      <svg width={SLOT.w} height={SLOT.h} viewBox={`0 0 ${SLOT.w} ${SLOT.h}`}
           style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`lg${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.28" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.72" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`mk${uid}`} maskUnits="userSpaceOnUse" x="-260" y="-90" width="920" height="280">
            <rect className="light-wipe" x="0" y="-80" width={BAND} height="260" fill={`url(#lg${uid})`} />
          </mask>
        </defs>
        <El {...geom} fill="none" stroke={edgeColor} strokeWidth={border * 1.7}
            mask={`url(#mk${uid})`}
            style={{ opacity: edge, filter: 'blur(0.7px)' }} />
      </svg>
    </>
  )
}
