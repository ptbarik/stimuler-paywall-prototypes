import { motion } from 'motion/react'
import { DUR, EASE } from '../timeline'
import { outlinePath } from '../bubblePath'

/**
 * One bubble. Body and tail are **a single welded path**, exactly as the
 * exports draw them.
 *
 * This used to be a bordered `<div>` with the tail hung off it as a separate
 * `<path>`, and it seamed: the body's bottom border ran straight across the
 * mouth of the tail, and because an absolutely positioned child sits inside
 * the *padding* box, the tail started a border-width clear of the edge — a
 * dark hairline under a tan line. Neither is in the design. One path, filled
 * once and stroked once, cannot produce either.
 *
 * Filling once also matters here specifically: the speaking bubble is 47%
 * opaque, so any overlap between two shapes would show as a darker patch.
 *
 * `tailAmount` grows the tail out of the edge without the path ever changing
 * structure, so nothing has to be swapped or cross-faded mid-morph.
 */
export default function Bubble({
  geom,
  fill,
  stroke,
  color,
  tailAmount = 1,
  children,
  from = 'left',
  reduced,
  scale,
}) {
  const enter = { duration: (DUR.bubbleIn / 1000) * scale, ease: EASE.enter }
  const exit = { duration: (DUR.bubbleOut / 1000) * scale, ease: EASE.exit }

  return (
    <motion.div
      className="absolute flex items-center justify-center text-center"
      initial={{ opacity: 0, scale: 0.9, x: from === 'left' ? -12 : 12 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.94, transition: reduced ? { duration: 0 } : exit }}
      transition={reduced ? { duration: 0 } : enter}
      style={{
        left: geom.x,
        top: geom.y,
        width: geom.w,
        height: geom.h,
        transformOrigin: geom.origin,
        color,
      }}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${geom.w} ${geom.h}`}
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <path
          d={outlinePath(geom, tailAmount)}
          fill={fill}
          stroke={stroke ?? 'none'}
          /* the export's outline is 0.7576 wide overall, centred on the path */
          strokeWidth={stroke ? 0.7576 : 0}
        />
      </svg>

      <span className="relative px-4" style={{ fontSize: geom.fs, lineHeight: 1.4, fontWeight: 400 }}>
        {children}
      </span>
    </motion.div>
  )
}
