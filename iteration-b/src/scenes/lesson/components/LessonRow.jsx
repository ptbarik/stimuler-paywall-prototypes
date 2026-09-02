import { C, ROWS, ROW_STROKE } from '../timeline'
import { P } from '../paths'
import Glyph from './Glyph'

/**
 * One roadmap row, at the export's own card coordinates.
 *
 * The outline is the export's **squircle** — Figma corner smoothing, not a
 * rounded rect — used verbatim with its own bounding box as the viewBox, so
 * nothing needs translating and the corners are real.
 *
 * `active` warms the border from flat #2B2B2B to the gold gradient and lifts
 * the row 2px, which is the whole of the "row responds as its node lights"
 * treatment.
 */
export default function LessonRow({ row, active = 0, opacity = 1, rise = 0 }) {
  const { box } = row
  const path = row.tall ? P.squircleTall : P.squircleShort
  const id = `row-${row.key}`

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        opacity,
        transform: `translateY(${rise - 2 * active}px)`,
      }}
    >
      <svg className="absolute inset-0" width={box.w} height={box.h} viewBox={path.box.join(' ')} fill="none">
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#878787" />
          </linearGradient>
          {/* the warm stroke runs out over the top 51% of the box in both the
              tall and the short export, so it is expressed as a fraction */}
          <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="0" y2="0.511">
            <stop offset="0" stopColor="#F2DCB6" stopOpacity="0.65" />
            <stop offset="1" stopColor="#383737" />
          </linearGradient>
        </defs>
        <path d={path.d} fill={`url(#${id}-fill)`} fillOpacity={0.05} />
        <path d={path.d} fill="none" stroke={C.rowStrokeIdle} strokeWidth={ROW_STROKE} opacity={1 - active} />
        <path d={path.d} fill="none" stroke={`url(#${id}-stroke)`} strokeWidth={ROW_STROKE} strokeOpacity={0.8} opacity={active} />
      </svg>

      <Glyph name={row.icon.name} x={row.icon.x} y={row.icon.y} w={row.icon.w} h={row.icon.h} fill={row.icon.fill} />
      <span
        className="absolute whitespace-nowrap"
        style={{
          left: row.label.x,
          top: row.label.y + row.label.h / 2,
          transform: 'translateY(-50%)',
          color: row.label.color,
          fontSize: row.label.fs,
          fontWeight: row.label.weight,
        }}
      >
        {row.title}
      </span>
    </div>
  )
}

export { ROWS }
