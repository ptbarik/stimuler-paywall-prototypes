export const SLOT = { w: 390, h: 96 }

const DARK_TILE = { bg: '#0A08038C', line: '#E9B94D57', ink: '#FFFFFF', colon: '#E9B94D8C' }
const GOLD_TILE = { bg: '#FFFFFF29', line: '#FFE8B9A8', ink: '#5A4A29', colon: '#FFFFFFE6' }
export const TILES = { dark: DARK_TILE, gold: GOLD_TILE }

/** 23 : 59 : 41 — the sheet's 27 / 28 / 27 × 26 tiles, gap 4. */
export function Digits({ parts, left, top, tone = 'dark', tile }) {
  const t = tile ?? TILES[tone]
  const box = {
    height: 26, borderRadius: 8, background: t.bg, border: `1px solid ${t.line}`,
    boxSizing: 'border-box', display: 'grid', placeItems: 'center', flexShrink: 0,
  }
  const ink = { color: t.ink, fontSize: 12, fontWeight: 700, lineHeight: '16px' }
  const colon = { color: t.colon, fontSize: 14, fontWeight: 600, lineHeight: '18px' }
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

export function Chevron({ left, top, w = 10, h = 17, color = '#F2D48A' }) {
  return (
    <svg width={w} height={h} viewBox="0 0 8 14" style={{ position: 'absolute', left, top }}>
      <path d="M1.4 1.4 6.6 7l-5.2 5.6" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** The coupon's die-cut, with the tear on the right the way the screen draws it. */
export const COUPON_D =
  'M0 76L0 20C0 8.954 8.954 0 20 0L271 0C271 4.971 275.029 9 280 9C284.971 9 289 4.971 289 0L370 0C381.046 0 390 8.954 390 20L390 76C390 87.046 381.046 96 370 96L289 96C289 91.029 284.971 87 280 87C275.029 87 271 91.029 271 96L20 96C8.954 96 0 87.046 0 76Z'
