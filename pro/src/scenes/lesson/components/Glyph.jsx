import { P } from '../paths'

/**
 * One exported path, drawn wherever it is put.
 *
 * Each glyph's `box` is in the coordinates it was measured in, so the box
 * doubles as the viewBox and nothing has to be translated or redrawn.
 */
export default function Glyph({ name, x, y, w, h, fill, stroke, strokeWidth, style, className }) {
  const g = P[name]
  const [bx, by, bw, bh] = g.box
  return (
    <svg
      aria-hidden
      className={className}
      style={{ position: 'absolute', left: x ?? bx, top: y ?? by, ...style }}
      width={w ?? bw}
      height={h ?? bh}
      viewBox={`${bx} ${by} ${bw} ${bh}`}
      fill="none"
      overflow="visible"
    >
      <path
        d={g.d}
        fill={fill ?? 'none'}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={stroke ? 'round' : undefined}
        strokeLinejoin={stroke ? 'round' : undefined}
      />
    </svg>
  )
}

/** The three sparkles beside the closing message, as one unit. */
export function Sparkles({ x, y, w, h, fill, style }) {
  return (
    <svg
      aria-hidden
      style={{ position: 'absolute', left: x, top: y, ...style }}
      width={w}
      height={h}
      viewBox="31.625 255.625 22.75 22.75"
      fill="none"
      overflow="visible"
    >
      {['sp1', 'sp2', 'sp3'].map((k) => (
        <path key={k} d={P[k].d} stroke={fill} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ))}
    </svg>
  )
}
