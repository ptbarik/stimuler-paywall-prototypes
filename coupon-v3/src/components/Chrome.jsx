import { motion } from 'motion/react'
import { Close } from '../Icons.jsx'

/** The iOS bar, at the export's 45px with the time at 16.29/600. */
export function StatusBar({ ink = '#000000' }) {
  return (
    <div className="absolute inset-x-0 top-0 h-[45px] z-40 flex items-center justify-between px-[26px] pointer-events-none" style={{ background: ink }}>
      <span className="font-id text-white" style={{ fontSize: 16.3, fontWeight: 600, letterSpacing: '-.39px' }}>9:41</span>
      <div className="flex items-center gap-[6px]">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="#fff">
          {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 4.4} y={8 - i * 2.6} width="3" height={3 + i * 2.6} rx="1" opacity={i === 3 ? 0.4 : 1} />)}
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="#fff">
          <path d="M8 10.6 6.1 8.5a2.8 2.8 0 0 1 3.8 0Z" />
          <path d="M8 6.1c-1.4 0-2.7.5-3.7 1.4L3 6.1A7 7 0 0 1 8 4a7 7 0 0 1 5 2.1l-1.3 1.4A5.4 5.4 0 0 0 8 6.1Z" />
          <path d="M8 1.8c-2.4 0-4.6.9-6.3 2.4L.4 2.9A10.8 10.8 0 0 1 8 0c2.9 0 5.6 1.1 7.6 2.9l-1.3 1.3A9.2 9.2 0 0 0 8 1.8Z" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12">
          <rect x=".5" y=".5" width="22" height="11" rx="3.6" fill="none" stroke="#fff" opacity=".35" />
          <rect x="2" y="2" width="14.4" height="8" rx="2" fill="#fff" />
          <rect x="23.2" y="4" width="1.4" height="4" rx=".7" fill="#fff" opacity=".4" />
        </svg>
      </div>
    </div>
  )
}

export function CloseButton({ t }) {
  return (
    <button className="absolute left-[18px] top-[57px] z-30 grid place-items-center rounded-full transition-opacity hover:opacity-100"
            style={{ width: 26, height: 26, background: 'rgba(255,255,255,.10)', color: 'rgba(255,255,255,.75)', opacity: 0.9, border: `1px solid ${t.chipLine}` }}
            aria-label="Close">
      <Close />
    </button>
  )
}

/**
 * The tier switch — 244.05 × 43.38, knob 113.45 × 33.77 inset 4.8.
 *
 * The knob is one element that slides, not two that cross-fade, so the two
 * halves are the same object at two positions and the switch reads as a
 * physical thing. The labels sit above it and swap weight (300 ↔ 600) and ink
 * on the same spring.
 */
export function TierToggle({ tier, onChange, t }) {
  const W = 244.05, H = 43.38, KW = 113.45, KH = 33.77
  const pad = (H - KH) / 2
  return (
    <div className="relative mx-auto z-30" style={{ width: W, height: H }}>
      {/* the track and its hairline are separate elements: the fill is at .77
          opacity per the export, and putting the border on that same node
          would fade the hairline with it */}
      <div className="absolute inset-0 rounded-[20.7px]"
           style={{ background: t.track, opacity: 0.77, boxShadow: '0 -1.48px 9.37px rgba(0,0,0,.2)' }} />
      <div className="absolute inset-0 rounded-[20.7px] pointer-events-none"
           style={{ border: `1px solid ${t.trackLine}` }} />
      <motion.div
        className="absolute rounded-[17px]"
        style={{ width: KW, height: KH, top: pad, background: t.knob }}
        animate={{ left: tier === 'pro' ? pad : W - KW - pad }}
        transition={{ type: 'spring', visualDuration: 0.42, bounce: 0.22 }}
      />
      {[['pro', 'Stimuler Pro'], ['plus', 'Stimuler Pro+']].map(([id, label]) => (
        <button key={id} onClick={() => onChange(id)}
                className="absolute top-0 h-full grid place-items-center font-id"
                style={{ left: id === 'pro' ? 0 : W / 2, width: W / 2 }}>
          <motion.span
            style={{ fontSize: 14.79, letterSpacing: '-.02em' }}
            animate={{
              color: tier === id ? t.knobInk : '#FFFFFF',
              /* V3 takes the live half to 700 — the export has it on PRO+ and
                 the switch has to read the same on both sides */
              fontWeight: tier === id ? 700 : 300,
              opacity: tier === id ? 1 : 0.72,
            }}
            transition={{ duration: 0.25 }}
          >
            {label}
          </motion.span>
        </button>
      ))}
    </div>
  )
}

/** 23 : 12 : 05 — three 34×34 tiles on `rgba(255,255,255,.21)`. */
export function OfferTimer({ run, delay = 0 }) {
  const parts = ['23', '12', '05']
  return (
    <div className="flex items-center gap-[5px] justify-center">
      {parts.map((p, i) => (
        <motion.div key={`${run}-${i}`} className="contents"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: delay + i * 0.06 }}>
          {i > 0 && (
            <span className="font-id text-white" style={{ fontSize: 20, fontWeight: 600, opacity: 0.9 }}>:</span>
          )}
          <span className="grid place-items-center rounded-[5px] font-id text-white"
                style={{ width: 34, height: 34, background: 'rgba(255,255,255,.21)', fontSize: 20, fontWeight: 600 }}>
            {p}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
