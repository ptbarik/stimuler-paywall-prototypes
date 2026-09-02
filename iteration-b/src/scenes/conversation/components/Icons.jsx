import { C } from '../timeline'
import { GLYPH } from '../glyphs'

/**
 * The glyphs, lifted verbatim from the exports.
 *
 * Each `d` is drawn in its own export coordinates, so `box` doubles as the
 * viewBox and the glyph can be dropped anywhere at any size without redrawing.
 */
const G = {
  speaker: {
    box: [67.82, 160.413, 9.761, 6.902],
    d: 'M74.4294 162.136C74.8869 162.594 75.144 163.214 75.144 163.862C75.144 164.509 74.8869 165.129 74.4294 165.587M76.1525 160.413C77.0675 161.328 77.5816 162.57 77.5816 163.864C77.5816 165.158 77.0675 166.4 76.1525 167.315M72.2133 160.447L69.7728 162.4H67.8203V165.328H69.7728L72.2133 167.281V160.447Z',
    stroke: true,
    sw: 0.97623,
  },
  check: {
    box: [86.797, 271.875, 13.402, 9.573],
    d: 'M86.7969 276.981L91.2644 281.448L100.199 271.875',
    stroke: true,
    sw: 1.91465,
  },
  dismiss: {
    box: [273.156, 274.08, 6.223, 6.223],
    d: 'M279.379 274.08L273.156 280.303M273.156 274.08L279.379 280.303',
    stroke: true,
    sw: 1.43599,
  },
  cross: {
    box: [67.62, 140.92, 8.1, 8.1],
    d: 'M75.7188 140.92L67.6191 149.02M67.6191 140.92L75.7188 149.02',
    stroke: true,
    sw: 1.34979,
  },
  tick: {
    box: [69.59, 214.99, 7.29, 5.01],
    d: 'M69.5938 217.223L71.8262 220L76.8828 214.99',
    stroke: true,
    sw: 1.36666,
  },
}

export default function Icon({ name, x, y, size, color, style }) {
  const g = G[name]
  const [bx, by, bw, bh] = g.box
  const s = size / Math.max(bw, bh)
  return (
    <svg
      aria-hidden
      style={{ position: 'absolute', left: x, top: y, ...style }}
      width={bw * s}
      height={bh * s}
      viewBox={`${bx} ${by} ${bw} ${bh}`}
      fill="none"
      overflow="visible"
    >
      <path
        d={g.d}
        fill={g.stroke ? 'none' : color}
        stroke={g.stroke ? color : undefined}
        strokeWidth={g.stroke ? g.sw : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/**
 * The exported glyph outlines, drawn at the size and fill the export gives
 * them — not scaled to a nominal icon box, and not recoloured.
 *
 * `x`/`y` are the glyph's own measured position, so a caller places it by
 * where the export puts it rather than by centring it in its button.
 */
export function ExportGlyph({ name, x, y, style }) {
  const g = GLYPH[name]
  const [bx, by, bw, bh] = g.box
  const gold = g.fill === 'gold'
  return (
    <svg
      aria-hidden
      style={{ position: 'absolute', left: x, top: y, ...style }}
      width={bw}
      height={bh}
      viewBox={`${bx} ${by} ${bw} ${bh}`}
      fill="none"
      overflow="visible"
    >
      {gold && (
        <defs>
          <linearGradient id={`g-${name}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.goldFrom} />
            <stop offset="1" stopColor={C.goldTo} />
          </linearGradient>
        </defs>
      )}
      <path d={g.d} fill={gold ? `url(#g-${name})` : g.fill} />
    </svg>
  )
}
