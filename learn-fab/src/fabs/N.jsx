import { motion } from 'motion/react'
import { Crown } from '../components/Icons.jsx'
import {
  Housing, CrownChip, RoundAction, PillAction, Copy,
  SLOT, GOLD, INK, HOUSING, GOLD_ROUND, GOLD_PILL3,
} from './parts.jsx'

/* ── N1 · Collapse on scroll ──────────────────────────────────────
   Gets out of the way while you read and comes back when you stop, 280ms
   each way.

   It collapses leftward, not to the corner: the crown is the constant and the
   copy and the arrow are what get dropped, so at 96 the crown *becomes* the
   action rather than sitting beside a vanished one. */

export function N1({ hms, scrolling }) {
  return (
    <motion.div
      animate={{ width: scrolling ? 96 : SLOT.w }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'relative', height: SLOT.h, borderRadius: 22, overflow: 'hidden',
        background: HOUSING, border: `1px solid ${GOLD}57`, boxSizing: 'border-box',
      }}
    >
      <motion.div
        animate={{ opacity: scrolling ? 0 : 1 }}
        transition={{ duration: 0.14 }}
        className="absolute left-0 top-0 flex items-center"
        style={{ width: SLOT.w, height: SLOT.h, gap: 14, paddingLeft: 16, paddingRight: 14, boxSizing: 'border-box' }}
      >
        <CrownChip />
        <Copy>
          <span className="font-id" style={{ color: '#fff', fontSize: 16, fontWeight: 600, letterSpacing: '-.01em', lineHeight: '20px' }}>
            Unlock everything, 50% off
          </span>
          <span className="font-id tnum" style={{ color: GOLD, fontSize: 13.5, fontWeight: 600, lineHeight: '18px' }}>
            {hms} left
          </span>
        </Copy>
        <RoundAction />
      </motion.div>

      <motion.div
        animate={{ opacity: scrolling ? 1 : 0 }}
        transition={{ duration: 0.18, delay: scrolling ? 0.12 : 0 }}
        className="absolute left-0 top-0 grid place-items-center"
        style={{ width: 96, height: SLOT.h, pointerEvents: scrolling ? 'auto' : 'none' }}
      >
        <span className="grid place-items-center" style={{ width: 52, height: 52, borderRadius: 26, background: GOLD_ROUND }}>
          <Crown fill={INK} base={INK} w={24} h={21} />
        </span>
      </motion.div>
    </motion.div>
  )
}

/* ── N2 · Last hour ───────────────────────────────────────────────
   The clock drops a field and the housing warms — one 900ms transition, once.
   Above an hour it is amber and HH:MM:SS; under it, MM:SS at 32px on a red
   ground, because the hours column is the part that stopped mattering. */

export function N2({ hms, ms, lastHour }) {
  const T = { duration: 0.9, ease: [0.32, 0, 0.2, 1] }
  return (
    <motion.div
      animate={{ backgroundColor: lastHour ? '#1C1116' : HOUSING, borderColor: lastHour ? '#E0563F75' : `${GOLD}57` }}
      transition={T}
      className="flex items-center"
      style={{ position: 'relative', width: SLOT.w, height: SLOT.h, borderRadius: 22, borderWidth: 1, borderStyle: 'solid', boxSizing: 'border-box', gap: 14, paddingLeft: 18, paddingRight: 14 }}
    >
      <Copy>
        <motion.span className="font-id"
                     animate={{ color: lastHour ? '#E0563F' : '#8E8898' }} transition={T}
                     style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', lineHeight: '14px' }}>
          {lastHour ? 'LAST HOUR' : 'ENDS IN'}
        </motion.span>
        <motion.span className="font-id tnum"
                     animate={{ fontSize: lastHour ? 32 : 26 }} transition={T}
                     style={{ color: '#fff', fontWeight: 700, letterSpacing: '-.02em', lineHeight: lastHour ? '34px' : '28px' }}>
          {lastHour ? ms : hms}
        </motion.span>
      </Copy>
      <PillAction label="Unlock" />
    </motion.div>
  )
}

/* ── N3 · Earned entrance ─────────────────────────────────────────
   Absent until a lesson lands, then rises 96px while the ring fills, 620ms.
   The only one of the eleven that is not on screen at rest — its argument is
   that the prompt should be a consequence of the two lessons you just did,
   which means it cannot be there before you did them. */

const C = 2 * Math.PI * 21.5

export function N3({ earned }) {
  return (
    <div style={{ position: 'relative', width: SLOT.w, height: SLOT.h, overflow: 'hidden' }}>
      {/* The sheet draws the absent state as a dashed slot reading `nothing
          here yet`. That is the sheet telling you where the button would be;
          on the screen itself, absent means absent, so there is nothing here
          until the lesson lands. */}
      <motion.div
        className="flex items-center"
        initial={false}
        animate={earned ? { y: 0, opacity: 1 } : { y: 96, opacity: 0 }}
        transition={{ duration: 0.62, ease: [0.22, 0.72, 0.24, 1] }}
        style={{
          position: 'absolute', inset: 0, borderRadius: 22, boxSizing: 'border-box',
          background: HOUSING, border: '1px solid #2C2736',
          gap: 14, paddingLeft: 16, paddingRight: 14,
        }}
      >
        <span className="grid place-items-center shrink-0" style={{ width: 50, height: 50, position: 'relative' }}>
          <span className="font-id tnum relative" style={{ color: '#fff', fontSize: 14, fontWeight: 700, lineHeight: '18px' }}>2/3</span>
          <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', left: 0, top: 0 }}>
            <circle cx="25" cy="25" r="21.5" fill="none" stroke="#2C2736" strokeWidth="3.5" />
            <motion.circle cx="25" cy="25" r="21.5" transform="rotate(-90 25 25)" fill="none"
                           stroke={GOLD} strokeWidth="3.5" strokeLinecap="round"
                           initial={false}
                           animate={{ strokeDasharray: `${earned ? C * (2 / 3) : C / 3} ${C}` }}
                           transition={{ duration: 0.62, ease: [0.22, 0.72, 0.24, 1] }} />
          </svg>
        </span>
        <Copy>
          <span className="font-id" style={{ color: '#fff', fontSize: 15.5, fontWeight: 600, letterSpacing: '-.01em', lineHeight: '20px' }}>
            Two lessons down today
          </span>
          <span className="font-id" style={{ color: '#8E8898', fontSize: 12.5, fontWeight: 500, lineHeight: '16px' }}>
            100+ more days. Half price today.
          </span>
        </Copy>
        <PillAction label="Unlock" h={44} px={18} size={14.5} />
      </motion.div>
    </div>
  )
}

/* ── N4 · Shine sweep ─────────────────────────────────────────────
   The quietest change of the eleven: nothing about the button is different,
   a 22° band just crosses it every 4.75s. 1.15s to cross, 3.6s of nothing —
   the pause is what stops it reading as a loading bar. */

export function N4({ hms }) {
  return (
    <Housing style={{ gap: 14, paddingLeft: 18, paddingRight: 12 }}>
      <Copy>
        <span className="font-id" style={{ color: '#fff', fontSize: 16, fontWeight: 600, letterSpacing: '-.01em', lineHeight: '20px' }}>
          Unlock everything
        </span>
        <span className="font-id tnum" style={{ color: GOLD, fontSize: 13.5, fontWeight: 600, lineHeight: '18px' }}>
          50% off · {hms}
        </span>
      </Copy>
      <PillAction label="Get PRO" h={52} px={22} gradient={GOLD_PILL3}>
        <span className="fab-shine" />
      </PillAction>
    </Housing>
  )
}
