import { motion } from 'motion/react'
import { Crown, Corner } from '../components/Icons.jsx'

/** The slot the `new fab 1` rectangle marks in the frame. */
export const SLOT = { w: 390, h: 96 }

export const GOLD = '#E9B94D'
export const INK = '#2A1D05'
export const HOUSING = '#16141C'

/* The export writes its golds in oklab. They are resolved here rather than
   left as `oklab()` so the eleven buttons cannot quietly disagree with each
   other on a browser that interpolates differently. */
export const GOLD_ROUND = 'linear-gradient(135deg,#F4CE72 0%,#E9B94C 52%,#CF9C2E 100%)'
export const GOLD_PILL  = 'linear-gradient(135deg,#F6D98C 0%,#E9B94C 100%)'
export const GOLD_PILL3 = 'linear-gradient(135deg,#F6D98C 0%,#E9B94C 54%,#D2A034 100%)'

/**
 * Every variant arrives the same way: up from below its own slot, already
 * legible, on one overshoot, with the fade running *ahead* of the spring.
 *
 * Shared on purpose. Which floating action is the right one is a question you
 * answer by comparing the objects, and eleven different entrances would make
 * it a question about arrivals instead.
 */
export function Arrival({ children, run }) {
  return (
    <motion.div
      key={run}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        y: { type: 'spring', visualDuration: 0.42, bounce: 0.26 },
        opacity: { duration: 0.13 },
      }}
      style={{ width: SLOT.w, height: SLOT.h }}
    >
      {children}
    </motion.div>
  )
}

/** The 390 × 96 housing, at whatever border and ground the variant wears. */
export function Housing({ border = '#E9B94D57', bg = HOUSING, style, children, ...rest }) {
  return (
    <div {...rest}
         style={{
           position: 'relative', boxSizing: 'border-box',
           width: SLOT.w, height: SLOT.h, borderRadius: 22,
           background: bg, border: `1px solid ${border}`,
           display: 'flex', alignItems: 'center',
           ...style,
         }}>
      {children}
    </div>
  )
}

/** 46 × 46, the crown held in a tinted square rather than on the ground. */
export function CrownChip({ bg = '#E9B94D1F', line = '#E9B94D47', radius = 14 }) {
  return (
    <span className="grid place-items-center shrink-0"
          style={{ width: 46, height: 46, borderRadius: radius, background: bg, border: `1px solid ${line}`, boxSizing: 'border-box', position: 'relative' }}>
      <Crown />
    </span>
  )
}

/** The round action — 48, or 50 on the glass three. */
export function RoundAction({ size = 48, gradient = GOLD_ROUND }) {
  return (
    <span className="grid place-items-center shrink-0"
          style={{ width: size, height: size, borderRadius: size / 2, background: gradient, position: 'relative' }}>
      <Corner />
    </span>
  )
}

/** The filled action, when the variant spends words on it instead of an arrow. */
export function PillAction({ label, h = 46, px = 20, size = 15, gradient = GOLD_PILL, children }) {
  return (
    <span className="grid place-items-center shrink-0"
          style={{ height: h, borderRadius: h / 2, paddingInline: px, background: gradient, position: 'relative', overflow: 'hidden' }}>
      <span className="font-id relative" style={{ color: INK, fontSize: size, fontWeight: 700, lineHeight: '18px' }}>{label}</span>
      {children}
    </span>
  )
}

/** The two-line copy block every variant puts between the mark and the action. */
export function Copy({ children, gap = 5 }) {
  return <span className="flex flex-col min-w-0 flex-1" style={{ gap }}>{children}</span>
}
