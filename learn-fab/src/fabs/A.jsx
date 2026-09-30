import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { RouteMark } from '../components/Icons.jsx'
import { Housing, CrownChip, RoundAction, PillAction, Copy, GOLD } from './parts.jsx'

/* ── A1 · Crossfade readout ───────────────────────────────────────
   Two messages, one slot. The offer holds 3.2s, the clock holds 3.2s, and
   the 420ms between them is a crossfade with 6px of drift — the mark and the
   action never move, so what changes is the sentence and not the button. */

const A1_HOLD = 3200
const A1_FADE = 0.42

export function A1({ hms }) {
  const [second, setSecond] = useState(false)
  useEffect(() => {
    const t = setInterval(() => setSecond((s) => !s), A1_HOLD)
    return () => clearInterval(t)
  }, [])

  const slide = (on) => ({
    animate: { opacity: on ? 1 : 0, y: on ? 0 : 6 },
    transition: { duration: A1_FADE, ease: [0.4, 0, 0.2, 1] },
    style: { position: 'absolute', left: 0, top: 0, display: 'flex', flexDirection: 'column', gap: 5 },
  })

  return (
    <Housing style={{ gap: 14, paddingLeft: 16, paddingRight: 14 }}>
      <CrownChip />
      <span className="relative flex-1 min-w-0" style={{ height: 43 }}>
        <motion.span {...slide(!second)}>
          <span className="font-id" style={{ color: '#fff', fontSize: 16, fontWeight: 600, letterSpacing: '-.01em', lineHeight: '20px' }}>
            Unlock everything
          </span>
          <span className="font-id" style={{ color: GOLD, fontSize: 14, fontWeight: 600, lineHeight: '18px' }}>
            50% off your first year
          </span>
        </motion.span>
        <motion.span {...slide(second)}>
          <span className="font-id" style={{ color: '#8E8898', fontSize: 11, fontWeight: 600, letterSpacing: '.12em', lineHeight: '14px' }}>
            ENDS IN
          </span>
          <span className="font-id tnum" style={{ color: '#fff', fontSize: 19, fontWeight: 700, letterSpacing: '-.01em', lineHeight: '24px' }}>
            {hms}
          </span>
        </motion.span>
      </span>
      <RoundAction />
    </Housing>
  )
}

/* ── A4 · Depleting rim ───────────────────────────────────────────
   The border is the clock. One 24-hour sweep, no readout at all, and under
   an hour the whole housing warms rather than the number turning red — there
   is no number.

   The rim's length is the export's own 928, not the true perimeter of a
   390 × 96 rounded rectangle. Recomputing it would put the 55% state at a
   different place on the corner than the frame it was signed off in. */

const RIM = 928

export function A4({ fraction, lastHour }) {
  return (
    <Housing bg={lastHour ? '#191018' : undefined}
             border={lastHour ? '#33222A' : '#26222F'}
             style={{ gap: 14, paddingLeft: 18, paddingRight: 14 }}>
      <Copy>
        <span className="font-id" style={{ color: '#fff', fontSize: 16, fontWeight: 600, letterSpacing: '-.01em', lineHeight: '20px' }}>
          Half price, first year
        </span>
        <span className="font-id"
              style={{ color: lastHour ? '#E0563F' : '#8E8898', fontSize: 13, fontWeight: lastHour ? 600 : 500, lineHeight: '16px' }}>
          {lastHour ? 'under an hour left' : 'the rim empties as the day does'}
        </span>
      </Copy>
      <PillAction label="Unlock" />
      <svg width="392" height="98" viewBox="0 0 392 98" xmlns="http://www.w3.org/2000/svg"
           style={{ position: 'absolute', left: -1, top: -1, pointerEvents: 'none' }}>
        <rect x="1" y="1" width="390" height="96" rx="22" fill="none" strokeWidth="2" strokeLinecap="round"
              stroke={lastHour ? '#E0563F' : GOLD}
              strokeDasharray={`${(RIM * fraction).toFixed(1)} ${RIM}`} />
      </svg>
    </Housing>
  )
}

/* ── A5 · Sarah, with the S mark ──────────────────────────────────
   A person, not a crown. The avatar carries the Stimuler route glyph rather
   than an initial, and a ring pulses out of it every 8s — once, then nothing,
   because a ring that never stops is a spinner. */

export function A5({ hms }) {
  return (
    <Housing border="#2C2736" style={{ gap: 14, paddingLeft: 15, paddingRight: 14 }}>
      <span className="grid place-items-center shrink-0"
            style={{ width: 52, height: 52, borderRadius: 26, background: 'linear-gradient(150deg,#8E6BC4 0%,#C97F8E 55%,#E0A45E 100%)' }}>
        <RouteMark />
      </span>
      <Copy>
        <span className="font-id" style={{ color: '#fff', fontSize: 15, fontWeight: 600, letterSpacing: '-.01em', lineHeight: '18px' }}>
          “Ready for the next 100 days?”
        </span>
        <span className="font-id" style={{ color: '#8E8898', fontSize: 12.5, fontWeight: 500, lineHeight: '16px' }}>
          Sarah · half price for {hms}
        </span>
      </Copy>
      <PillAction label="I'm in" h={44} px={18} size={14.5} />
      <span className="fab-ring"
            style={{ position: 'absolute', left: 5, top: 12, width: 72, height: 72, borderRadius: 36, border: '2px solid #E0A45E57', boxSizing: 'border-box', pointerEvents: 'none' }} />
    </Housing>
  )
}

