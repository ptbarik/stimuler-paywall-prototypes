import { useId } from 'react'

/**
 * The tab's light, once.
 *
 * A soft band crossing the tab on the diagonal. It shows up twice — as a wash
 * over the surface and as a glint on the border — but it is one travelling
 * object: both elements are the same width, start at the same x and carry the
 * same `light-wipe` keyframes, so the lit stretch of edge is always the stretch
 * the wash is passing over.
 *
 * The border version is that band used as a *mask* on the outline stroke, which
 * is what keeps it subtle: the stroke can only be as bright as the band's own
 * falloff at that point, so it fades up and down instead of arriving as a hard
 * dash. Nothing is tuned separately — turn the band's opacity down and both get
 * quieter together.
 *
 * `shape` takes a path for the ticket cuts and the open-topped band; `radius`
 * takes a rounded rectangle. Either way the stroke is drawn on the border's own
 * centreline — inset by half the border width, radius reduced by the same — so
 * it sits *on* the edge rather than beside it.
 */

const BAND = 180
const TONE = '255,252,240'

export function PaneLight({
  w, h, radius, shape, border = 1, strength = 0.22, edge = 0.55,
  edgeColor = '#FFE9B8', clipRadius, offsetY = 0,
}) {
  const uid = useId().replace(/:/g, '')
  const inset = border / 2

  const wash = (
    <div style={{
      position: 'absolute', left: 0, top: 0, width: w, height: h,
      borderRadius: shape ? undefined : (clipRadius ?? radius),
      clipPath: shape ? `path('${shape}')` : undefined,
      overflow: 'hidden', pointerEvents: 'none',
    }}>
      <div className="light-wipe"
           style={{
             position: 'absolute', left: 0, top: -90, width: BAND, height: h + 200,
             background: `linear-gradient(90deg,
               rgba(${TONE},0) 0%,
               rgba(${TONE},${(strength * 0.16).toFixed(3)}) 18%,
               rgba(${TONE},${(strength * 0.6).toFixed(3)}) 36%,
               rgba(${TONE},${strength.toFixed(3)}) 50%,
               rgba(${TONE},${(strength * 0.6).toFixed(3)}) 64%,
               rgba(${TONE},${(strength * 0.16).toFixed(3)}) 82%,
               rgba(${TONE},0) 100%)`,
             filter: 'blur(15px)',
           }} />
    </div>
  )

  if (edge <= 0) return wash

  const geom = shape
    ? { d: shape }
    : { x: inset, y: inset, width: w - border, height: h - border, rx: radius - inset }
  const El = shape ? 'path' : 'rect'

  return (
    <>
      {wash}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}
           style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`lg${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.28" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.72" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`mk${uid}`} maskUnits="userSpaceOnUse" x="-280" y="-120" width="1000" height={h + 260}>
            <rect className="light-wipe" x="0" y={-90 + offsetY} width={BAND} height={h + 200} fill={`url(#lg${uid})`} />
          </mask>
        </defs>
        <El {...geom} fill="none" stroke={edgeColor} strokeWidth={border * 1.8}
            mask={`url(#mk${uid})`}
            style={{ opacity: edge, filter: 'blur(0.7px)' }} />
      </svg>
    </>
  )
}

/**
 * A star, twinkling.
 *
 * The delay is what matters. Two stars on the same clock read as a loading
 * indicator; a second and a bit apart, they read as light catching.
 */
export function Twinkle({ children, left, top, delay = 0, opacity = 0.7, anim = true }) {
  return (
    <span style={{ position: 'absolute', left, top, opacity, lineHeight: 0, pointerEvents: 'none' }}>
      <span className={anim ? 'twinkle' : undefined}
            style={{ display: 'block', animationDelay: `${delay}s` }}>
        {children}
      </span>
    </span>
  )
}

/** The four-point star the sheet uses, at whatever size and fill. */
export function Star({ size = 15, fill = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', overflow: 'visible' }}>
      <path d="M7.5 0L8.932 6.068L15 7.5L8.932 8.932L7.5 15L6.068 8.932L0 7.5L6.068 6.068Z" fillRule="nonzero" fill={fill} />
    </svg>
  )
}
