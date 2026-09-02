import { STREAK } from '../timeline'

/**
 * A filled star.
 *
 * The export's fill is a Figma **angular** gradient — `#FFB85B` → `#FFEB9D` at
 * 48.6% → `#FFC342`, meeting again at the bottom, which is what gives the star
 * its folded, faceted look and the faint seam down the middle. SVG has no
 * angular gradient, so this is a CSS `conic-gradient` masked by the star path
 * rather than a linear approximation of it.
 *
 * `from 180deg` puts stop 0 at the bottom and the pale peak at the top, which
 * is how the export's own gradient transform is oriented.
 */
const [BX, BY, BW, BH] = STREAK.pathBox

const MASK = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BX} ${BY} ${BW} ${BH}" preserveAspectRatio="none"><path d="${STREAK.path}" fill="#000"/></svg>`,
)}")`

export default function GoldStar({ x, y, w, style, role }) {
  const h = w * (BH / BW)
  return (
    <div
      aria-hidden
      data-role={role}
      className="pointer-events-none absolute"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        background: 'conic-gradient(from 180deg, #FFB85B, #FFEB9D 48.6%, #FFC342)',
        WebkitMaskImage: MASK,
        maskImage: MASK,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        ...style,
      }}
    />
  )
}
