import { motion } from 'motion/react'
import { DUR, EASE } from '../timeline'

/**
 * The three pills in the sequence: "40 Minutes", "Try reading!" and the
 * "You're speaking" row.
 *
 * `dots` renders the three-dot loop. Its animation is driven off the global
 * clock rather than off mount, so swapping the label next to it never resets
 * the dots mid-bounce.
 */
export default function Pill({
  ms,
  geom,
  children,
  dots = false,
  bare = false,
  bg,
  fg,
  border,
  blur = 0,
  icon = null,
  gap = 6,
  align = 'center',
  from = 'below',
  reduced,
  scale,
}) {
  const offset = from === 'below' ? 10 : -10
  return (
    <motion.div
      className="absolute flex items-center whitespace-nowrap"
      initial={{ opacity: 0, y: offset }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: from === 'below' ? -10 : 10,
        transition: reduced ? { duration: 0 } : { duration: (DUR.pillCross / 1000) * scale, ease: EASE.exit },
      }}
      transition={reduced ? { duration: 0 } : { duration: (DUR.pillIn / 1000) * scale, ease: EASE.enter }}
      style={{
        gap,
        justifyContent: align === 'left' ? 'flex-start' : 'center',
        left: geom.x,
        top: geom.y,
        width: geom.w,
        height: geom.h,
        borderRadius: bare ? 0 : geom.r,
        backgroundColor: bare ? 'transparent' : bg,
        border: bare || !border ? 'none' : `0.43px solid ${border}`,
        color: fg,
        backdropFilter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      {dots && <Dots ms={ms} reduced={reduced} />}
      {icon}
      <span className="leading-none" style={{ fontSize: geom.fs ?? 12, fontWeight: 400 }}>
        {children}
      </span>
    </motion.div>
  )
}

function Dots({ ms, reduced }) {
  return (
    <span className="flex items-center gap-[4px]">
      {[0, 1, 2].map((i) => {
        // phase off the global clock — independent of when the label mounted
        const p = reduced ? 0 : Math.sin(ms / 130 - i * 0.7)
        return (
          <span
            key={i}
            className="block rounded-full bg-white"
            style={{
              width: 4.648,
              height: 4.648,
              transform: `translateY(${(-1.6 * Math.max(0, p)).toFixed(2)}px)`,
              opacity: 0.55 + 0.45 * Math.max(0, p),
            }}
          />
        )
      })}
    </span>
  )
}
