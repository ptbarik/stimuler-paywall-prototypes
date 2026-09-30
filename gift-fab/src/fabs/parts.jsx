export const SLOT = { w: 390, h: 96 }

/** The die-cut the two black tickets are drawn on. */
export const TICKET_D =
  'M20 0 H101 A9 9 0 0 0 119 0 H370 A20 20 0 0 1 390 20 V76 A20 20 0 0 1 370 96 H119 A9 9 0 0 0 101 96 H20 A20 20 0 0 1 0 76 V20 A20 20 0 0 1 20 0 Z'

/** The gold ticket's own cut — the same shape, drawn the other way round. */
export const TICKET_GOLD_D =
  'M0 76L0 20C0 8.954 8.954 0 20 0L101 0C101 4.971 105.029 9 110 9C114.971 9 119 4.971 119 0L370 0C381.046 0 390 8.954 390 20L390 76C390 87.046 381.046 96 370 96L119 96C119 91.029 114.971 87 110 87C105.029 87 101 91.029 101 96L20 96C8.954 96 0 87.046 0 76Z'

/**
 * The border chase.
 *
 * One lit segment running the pill's own outline, once per cycle, starting
 * the moment the box stops rattling. `pathLength="1000"` normalises whatever
 * shape is passed in, so a rounded rectangle and a ticket's die-cut take the
 * same dash numbers and finish their lap in the same time — no measuring, and
 * no per-variant tuning to drift out of sync later.
 */
export function BorderRun({ shape, radius = 24, run = true, color = '#F6D98C', width = 2, inset = 1 }) {
  const common = {
    pathLength: 1000,
    fill: 'none',
    stroke: color,
    strokeWidth: width,
    strokeLinecap: 'round',
    strokeDasharray: '92 908',
    className: run ? 'border-run' : undefined,
    style: { opacity: run ? undefined : 0, filter: `drop-shadow(0 0 5px ${color}D9)` },
  }
  return (
    <svg width={SLOT.w} height={SLOT.h} viewBox={`0 0 ${SLOT.w} ${SLOT.h}`}
         style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', overflow: 'visible' }}>
      {shape
        ? <path d={shape} {...common} />
        : <rect x={inset} y={inset} width={SLOT.w - inset * 2} height={SLOT.h - inset * 2} rx={radius - inset} {...common} />}
    </svg>
  )
}

/** 23 : 59 : 41 — the sheet's 27 / 28 / 27 × 26 tiles, gap 4. */
export function Digits({ parts, left, top }) {
  const box = {
    height: 26, borderRadius: 8, background: '#0A08038C',
    border: '1px solid #E9B94D57', boxSizing: 'border-box',
    display: 'grid', placeItems: 'center', flexShrink: 0,
  }
  const ink = { color: '#fff', fontSize: 12, fontWeight: 700, lineHeight: '16px' }
  const colon = { color: '#E9B94D8C', fontSize: 14, fontWeight: 600, lineHeight: '18px' }
  return (
    <span className="flex items-center" style={{ gap: 4, position: 'absolute', left, top }}>
      <span style={{ ...box, width: 27 }}><span className="font-id tnum" style={ink}>{parts.hh}</span></span>
      <span className="font-id" style={colon}>:</span>
      <span style={{ ...box, width: 28 }}><span className="font-id tnum" style={ink}>{parts.mm}</span></span>
      <span className="font-id" style={colon}>:</span>
      <span style={{ ...box, width: 27 }}><span className="font-id tnum" style={ink}>{parts.ss}</span></span>
    </span>
  )
}

export function Chevron({ left, top, w = 10, h = 17, color = '#F2D48A', style }) {
  return (
    <svg width={w} height={h} viewBox="0 0 8 14" style={{ position: 'absolute', left, top, ...style }}>
      <path d="M1.4 1.4 6.6 7l-5.2 5.6" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function RoundAction({ left, top, size = 50, bg, arrow = '#2A1D05' }) {
  return (
    <span className="grid place-items-center"
          style={{ position: 'absolute', left, top, width: size, height: size, borderRadius: size / 2, background: bg }}>
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path d="M5.4 12.6 12.6 5.4M6.6 5.4h6v6" fill="none" stroke={arrow} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export const GOLD_ROUND = 'linear-gradient(135deg,#F6D98C 0%,#E9B94C 54%,#D2A034 100%)'
export const TOP_LIGHT = 'linear-gradient(90deg,#F6D98C00 0%,#F6D98CB8 50%,#F6D98C00 100%)'
