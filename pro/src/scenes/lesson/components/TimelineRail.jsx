import { C, RAIL } from '../timeline'

/**
 * The rail.
 *
 * The gold **draws** rather than fades: `pathLength` is normalised to 1, so a
 * single `strokeDashoffset` from 1 to 0 is the whole animation, and because
 * that number is derived from `ms` it is back at 1 at the loop point without
 * any cleanup.
 *
 * The SVG is sized to its own viewBox in px rather than stretched to the
 * container. It has to be: the rail runs to y 411.7 inside a 330-tall card, so
 * a `w-full h-full` SVG would letterbox the viewBox and shift every x by ~35px.
 *
 * The base line has butt ends and the gold a round cap at its leading edge
 * only, which is exactly how the export draws it.
 */
export default function TimelineRail({ progress, height }) {
  return (
    <svg
      className="pointer-events-none absolute top-0 left-0"
      width={370}
      height={height}
      viewBox={`0 0 370 ${height}`}
      overflow="visible"
      fill="none"
    >
      <line
        x1={RAIL.x} y1={RAIL.top} x2={RAIL.x} y2={RAIL.bottom}
        stroke={C.railBase} strokeWidth={RAIL.w}
      />
      <line
        x1={RAIL.x} y1={RAIL.top} x2={RAIL.x} y2={RAIL.bottom}
        stroke={C.accent} strokeWidth={RAIL.w} strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
      {/* the top of the gold is square in the export, so square it off */}
      <rect
        x={RAIL.x - RAIL.w / 2} y={RAIL.top}
        width={RAIL.w} height={RAIL.w / 2}
        fill={C.accent} opacity={progress > 0 ? 1 : 0}
      />
    </svg>
  )
}
