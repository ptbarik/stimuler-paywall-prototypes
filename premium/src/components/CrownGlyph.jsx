/**
 * The crown.
 *
 * Both paths are lifted straight out of `3.svg` — the export's own crown-fall
 * frame — including their gradients and the 4px/2px drop shadow Figma drew
 * under each one. The export bakes every crown's rotation into its path data,
 * so the instance taken here is the one nearest upright (the top-centre crown,
 * off by 2.8 degrees) and that residue is corrected by the group transform
 * rather than by re-drawing the curves.
 *
 * The viewBox is the glyph's own bounds, so the component scales from a single
 * `size` and everything else — fall physics, sway, spin — is applied outside it.
 */
const BODY = "M239.858 47.1493C236.707 47.3034 234.299 49.9865 234.454 53.1636C234.541 54.9475 235.467 56.5324 236.826 57.5559L227.159 67.8229C225.329 69.7764 222.148 69.3128 220.952 66.8818L211.556 47.9908C213.733 46.8733 215.16 44.5509 215.031 41.9129C214.857 38.3451 211.874 35.616 208.338 35.789C204.803 35.9619 202.101 38.9691 202.275 42.5369C202.404 45.1718 204.051 47.347 206.327 48.2466L198.819 67.9644C197.866 70.4974 194.745 71.2724 192.733 69.5068L182.347 60.2206C183.6 59.0726 184.367 57.4017 184.279 55.6178C184.124 52.4377 181.463 50.0056 178.314 50.1596C175.163 50.3137 172.755 52.9969 172.91 56.1739C173.066 59.354 175.727 61.7861 178.875 61.6321L179.106 61.6208L186.079 86.0707C186.355 86.9892 187.154 87.5725 188.076 87.5274L210.892 86.4144L233.79 85.2944C234.711 85.2493 235.449 84.5909 235.635 83.6497L240.188 58.6361L240.419 58.6248C243.571 58.4707 245.979 55.7875 245.823 52.6105C245.668 49.4304 243.007 46.9953 239.858 47.1493Z"
const BAR = "M233.545 89.8149L188.675 92.0097C187.6 92.0622 186.721 93.0372 186.774 94.1245L186.938 97.4591C186.991 98.5434 187.958 99.4312 189.035 99.3785L211.47 98.278L233.906 97.1807C234.98 97.1281 235.859 96.1531 235.806 95.0658L235.643 91.7312C235.586 90.5682 234.698 89.7585 233.545 89.8149Z"

/** The glyph's bounds in the export's page coordinates. */
export const CROWN = { x: 172.755, y: 35.616, w: 73.224, h: 63.815 }

let uid = 0

export default function CrownGlyph({ size = CROWN.w, shadow = true, sweep = false, style }) {
  // two gradients per instance, so several crowns can sit in one document
  const id = `cr${++uid}`
  const h = (size / CROWN.w) * CROWN.h
  return (
    <svg
      width={size}
      height={h}
      viewBox={`${CROWN.x} ${CROWN.y} ${CROWN.w} ${CROWN.h}`}
      fill="none"
      style={style}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}a`} x1="206.857" y1="13.8301" x2="212.635" y2="91.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DC9B34" />
          <stop offset="0.485577" stopColor="#FCDB8A" />
          <stop offset="1" stopColor="#DD9C35" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="215.171" y1="87.855" x2="215.897" y2="102.706" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3A846" />
          <stop offset="1" stopColor="#DD9B2E" />
        </linearGradient>
        {sweep && (
          <>
            <clipPath id={`${id}c`}>
              <path d={BODY} />
              <path d={BAR} />
            </clipPath>
            <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </>
        )}
      </defs>
      {/* the export's own drop shadow: dy 4, blur 2, #130800 at 32 percent */}
      <g
        transform="rotate(2.8 209.367 67.523)"
        style={shadow ? { filter: 'drop-shadow(0 4px 2px rgba(19,8,0,.32))' } : undefined}
      >
        <path d={BODY} fill={`url(#${id}a)`} />
        <path d={BAR} fill={`url(#${id}b)`} />

        {/* The specular sweep, clipped to the glyph itself.
            Clipping to the *paths* rather than to the icon's box is the whole
            point: the light has to travel through the crown's own shape,
            including the gaps between its points. A band swept across a
            bounding rectangle reads as a rectangle catching the light. */}
        {sweep && (
          <g clipPath={`url(#${id}c)`}>
            <rect
              className="sheenband"
              x={CROWN.x - 30}
              y={CROWN.y - 6}
              width="30"
              height={CROWN.h + 12}
              fill={`url(#${id}s)`}
            />
          </g>
        )}
      </g>
    </svg>
  )
}
