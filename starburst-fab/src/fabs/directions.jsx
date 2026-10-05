import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import { NAV_H } from '../components/Chrome.jsx'

/**
 * Four directions against the brief: the tab should *open*, not state.
 *
 * The rule all four obey is that **nothing on the tab says the whole offer at
 * rest.** A seal is shut, a reel is on another line, a tag is folded, a rail is
 * unfinished. The tab's job standing still is to look like something that has
 * not finished happening yet; the copy completes as it opens.
 *
 *   S  the seal   unwrap          sealed means unopened means unread
 *   T  the reel   sequential      four benefits, one at a time, price last
 *   U  the tag    unfold          each fold is a small completed thing
 *   V  the rail   earned          reports your behaviour, not an offer
 *
 * No glass, per the brief. These build on the language that was already here —
 * the gold, the ticket, the Learn screen's own progress rail.
 *
 * Each runs its idle on the same **6s master cycle** the rest of this
 * prototype uses, so switching tabs does not change the tempo of the screen.
 */

const FRAME_H = 892
const sit = (h, gap) => FRAME_H - NAV_H - gap - h
const box = (top, h) => ({ position: 'absolute', left: 0, top, width: 412, height: h })

const X0 = 11
const W = 390
const DARK = 'linear-gradient(170deg,#1C160C 0%,#110E08 100%)'
const RIM = '1px solid #B47A2299'
const SHADOW = '0 16px 36px #00000085'
const GOLD = ['#FFE7A8', '#E8B54B', '#B47A22']
const OUT = [0.22, 0.72, 0.24, 1]

/* ══ S · The Seal ════════════════════════════════════════════════════
   Idle: the tails lift at 0.6s, a sliver of gold slides out from under
   the seal at 1.4s and retracts. Tap: the seal splits, the ribbon
   unspools rightward and *prints* the copy with its leading edge. */
function S({ onCommit, anim }) {
  const H = 56
  const TOP = sit(H, 14)
  const [open, setOpen] = useState(false)
  const idle = anim && !open

  const go = () => {
    if (open) return
    setOpen(true)
    /* the halves rejoin as one disc where the seal was, and that disc is
       what blooms — so the thing you broke is the thing you get */
    setTimeout(() => onCommit({ cx: X0 + 38, cy: TOP + H / 2, size: 44, bloom: true }), 620)
  }

  const tail = (dx, rot, fill, delay) => (
    <motion.div
      style={{
        position: 'absolute', left: X0 + dx, top: 38, width: 16, height: 13,
        borderRadius: 2, background: fill, transformOrigin: '50% 0%',
      }}
      animate={idle ? { rotate: [rot, rot - 8, rot] } : { rotate: rot }}
      transition={idle ? { duration: 0.8, delay, repeat: Infinity, repeatDelay: 5.2, ease: 'easeInOut' } : { duration: 0.2 }}
    />
  )

  return (
    <div style={box(TOP, H)} onClick={go}>
      <div style={{ position: 'absolute', left: X0, top: 0, width: W, height: H, borderRadius: H / 2,
                    background: DARK, border: RIM, boxSizing: 'border-box', boxShadow: SHADOW, overflow: 'clip' }} />
      {!open && tail(17, -18, '#A5761F', 0.6)}
      {!open && tail(35, 16, '#8D6419', 0.68)}

      {/* the sliver: the offer trying to get out, 3px at a time */}
      {idle && (
        <motion.div
          style={{ position: 'absolute', left: X0 + 46, top: 24, height: 9, borderRadius: 2,
                   background: `linear-gradient(90deg,${GOLD[2]},${GOLD[0]})` }}
          animate={{ width: [0, 14, 14, 0] }}
          transition={{ duration: 1.1, delay: 1.4, times: [0, 0.3, 0.72, 1], repeat: Infinity, repeatDelay: 4.9, ease: 'easeInOut' }}
        />
      )}

      {/* the ribbon. Its right edge is the mask — the words are not faded
          in, they are uncovered, which is what makes it read as printing. */}
      <motion.div
        style={{ position: 'absolute', left: X0 + 58, top: 16, height: 24, overflow: 'hidden',
                 background: `linear-gradient(90deg,${GOLD[1]} 0%,${GOLD[0]} 60%,${GOLD[1]} 100%)`,
                 boxShadow: '0 4px 12px #0000006B' }}
        initial={{ width: 0 }}
        animate={{ width: open ? 316 : 0 }}
        transition={{ duration: 0.42, delay: open ? 0.16 : 0, ease: OUT }}
      >
        <span className="font-id" style={{
          position: 'absolute', left: 0, top: 4, width: 316, textAlign: 'center',
          fontSize: 14, fontWeight: 700, letterSpacing: '-.01em', lineHeight: '18px', color: '#3A2A0C',
        }}>Half price. Today only.</span>
      </motion.div>

      {/* the two halves of the seal, which come apart and come back */}
      {['top', 'bottom'].map((half, i) => (
        <motion.div key={half}
          style={{
            position: 'absolute', left: X0 + 18, top: 8 + (i ? 20 : 0), width: 40, height: 20,
            background: i ? 'linear-gradient(170deg,#C08F2C,#9A6F1C)' : 'linear-gradient(170deg,#FFE7A8,#D29F33)',
            borderRadius: i ? '0 0 20px 20px' : '20px 20px 0 0',
            transformOrigin: i ? '50% 0%' : '50% 100%',
          }}
          animate={open ? { rotate: [0, i ? 11 : -13, 0], y: [0, i ? 5 : -5, 0] } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.6, times: [0, 0.35, 1], ease: OUT }}
        />
      ))}
      <div style={{ position: 'absolute', left: X0 + 25, top: 15, width: 26, height: 26,
                    borderRadius: 13, border: '1.5px solid #86601A99', boxSizing: 'border-box', pointerEvents: 'none' }} />

      <motion.div style={{ position: 'absolute', left: X0 + 74, top: 14, pointerEvents: 'none' }}
                  animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.14 }}>
        <div className="font-id" style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: '-.012em', lineHeight: '19px', color: '#FFE7A8' }}>A sealed offer</div>
        <div className="font-id" style={{ fontSize: 12, fontWeight: 500, lineHeight: '15px', color: '#A9966B', marginTop: 1 }}>Tap to break it open</div>
      </motion.div>
    </div>
  )
}

/* ══ T · The Reel ════════════════════════════════════════════════════
   Four lines through a window, one every 2.2s, price last. Tapping
   accelerates the reel and *stops* it on the offer rather than
   interrupting — an impatient tap still gets the payoff. */
const REEL = [
  'Unlimited calls with Sarah',
  '300+ exercises',
  'Your plan, rebuilt weekly',
  '50% off today',
]
const LINE_H = 36

function T({ onCommit, anim }) {
  const H = 54
  const TOP = sit(H, 14)
  const [i, setI] = useState(0)
  const [stopped, setStopped] = useState(false)
  const y = useMotionValue(0)
  const last = i % REEL.length === REEL.length - 1

  useEffect(() => {
    if (!anim || stopped) return
    const t = setInterval(() => setI((n) => n + 1), 2200)
    return () => clearInterval(t)
  }, [anim, stopped])

  useEffect(() => {
    animate(y, -(i % REEL.length) * LINE_H, {
      duration: 0.38, ease: OUT,
    })
  }, [i, y])

  const go = () => {
    if (stopped) return
    setStopped(true)
    /* the spin-down: past the offer and back onto it, the way a reel settles */
    const target = REEL.length - 1
    setI(target)
    animate(y, [-((i % REEL.length) * LINE_H), -(target * LINE_H) - 10, -(target * LINE_H)], {
      duration: 0.5, times: [0, 0.72, 1], ease: OUT,
    })
    setTimeout(() => onCommit({ cx: X0 + 154, cy: TOP + H / 2, size: 46, bloom: true }), 560)
  }

  return (
    <div style={box(TOP, H)} onClick={go}>
      <div style={{ position: 'absolute', left: X0, top: 0, width: W, height: H, borderRadius: H / 2,
                    background: last ? 'linear-gradient(170deg,#241B0B,#140F07)' : DARK,
                    border: last ? '1px solid #E8B54B8C' : RIM,
                    boxSizing: 'border-box', boxShadow: SHADOW, transition: 'border-color .3s, background .3s' }} />
      <motion.div style={{ position: 'absolute', left: X0 + 14, top: 4, width: 280, height: 46, borderRadius: 16,
                           background: '#E8B54B33', filter: 'blur(14px)', pointerEvents: 'none' }}
                  animate={{ opacity: last ? 1 : 0 }} transition={{ duration: 0.35 }} />
      <div style={{
        position: 'absolute', left: X0 + 20, top: 9, width: 268, height: LINE_H, borderRadius: 12,
        background: last ? '#120C03' : '#0A0804', border: `1px solid ${last ? '#E8B54B8C' : '#3A2F1B'}`,
        boxSizing: 'border-box', overflow: 'hidden', transition: 'border-color .3s',
        /* both ends of the window fade, so a line arrives out of nothing
           rather than sliding in from a visible edge */
        maskImage: 'linear-gradient(#0000,#000 28%,#000 72%,#0000)',
        WebkitMaskImage: 'linear-gradient(#0000,#000 28%,#000 72%,#0000)',
      }}>
        <motion.div style={{ position: 'absolute', left: 0, top: 0, width: 266, y }}>
          {REEL.map((line, n) => (
            <div key={line} className="grid place-items-center" style={{ height: LINE_H }}>
              <span className="font-id" style={{
                fontSize: n === REEL.length - 1 ? 16 : 14,
                fontWeight: n === REEL.length - 1 ? 700 : 600,
                letterSpacing: '-.012em',
                color: n === REEL.length - 1 ? '#FFE7A8' : '#E6DCC4',
              }}>{line}</span>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="font-id" style={{
        position: 'absolute', left: X0 + 304, top: 19, fontSize: 12,
        fontWeight: last ? 700 : 600, lineHeight: '16px', color: last ? '#E8B54B' : '#6E6450',
      }}>PRO</div>
      <svg width="18" height="18" viewBox="0 0 18 18" style={{ position: 'absolute', left: X0 + 352, top: 18 }}>
        <path d="M4 9h9M9 4.6 13.4 9 9 13.4" fill="none" stroke={last ? '#FFE7A8' : '#8D7F5F'} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/* ══ U · The Tag ═════════════════════════════════════════════════════
   Three panels folded behind one. Idle it lifts one at a time, cycling,
   so a second glance shows a different reason. Tap opens all three,
   then they concertina *inward* into the disc. */
const PANELS = ['Today only', 'Unlimited', 'Half price']

function U({ onCommit, anim }) {
  const H = 52
  const TOP = sit(H, 14)
  const PW = 80, PH = 30
  const PX = X0 + 296
  const [open, setOpen] = useState(false)
  const [lift, setLift] = useState(-1)

  useEffect(() => {
    if (!anim || open) return
    let n = 0
    const t = setInterval(() => {
      setLift(n % PANELS.length)
      setTimeout(() => setLift(-1), 1700)
      n++
    }, 7000)
    return () => clearInterval(t)
  }, [anim, open])

  const go = () => {
    if (open) return
    setOpen(true)
    setTimeout(() => onCommit({ cx: PX + PW / 2, cy: TOP + 15, size: 54, bloom: true }), 760)
  }

  return (
    <div style={box(TOP - 96, H + 96)} onClick={go}>
      <div style={{ position: 'absolute', left: X0, top: 96, width: W, height: H, borderRadius: H / 2,
                    background: open ? 'linear-gradient(170deg,#241B0B,#140F07)' : DARK,
                    border: open ? '1px solid #E8B54B8C' : RIM, boxSizing: 'border-box', boxShadow: SHADOW }} />
      <div className="font-id" style={{ position: 'absolute', left: X0 + 26, top: 107, fontSize: 15.5, fontWeight: 700,
                                        letterSpacing: '-.012em', lineHeight: '19px', color: '#FFE7A8' }}>Something for you</div>
      <div className="font-id" style={{ position: 'absolute', left: X0 + 26, top: 127, fontSize: 12, fontWeight: 500,
                                        lineHeight: '15px', color: '#A9966B' }}>Three folds, three reasons</div>

      {/* the folded stack, hinged at each panel's bottom edge. `rotateX`
          past 90° hides the face, so −92 is the folded-away state. */}
      {PANELS.map((word, n) => {
        const up = open || lift === n
        const topY = 96 - (n + 1) * (PH + 1)
        return (
          <motion.div key={word}
            style={{
              position: 'absolute', left: PX, top: topY, width: PW, height: PH,
              transformOrigin: '50% 100%', transformStyle: 'preserve-3d', perspective: 420,
              borderRadius: n === PANELS.length - 1 ? '9px 9px 2px 2px' : 2,
              background: `linear-gradient(170deg,${['#FFF0C4', '#F1D078', '#E8B54B'][n]},${['#E8C063', '#D9A93F', '#C08F2C'][n]})`,
              display: 'grid', placeItems: 'center',
              /* the crease: a cast shadow on the panel below. Without it the
                 fold reads as a cross-fade rather than as paper. */
              boxShadow: up ? '0 8px 18px #0000008C' : 'none',
            }}
            initial={false}
            animate={{ rotateX: up ? 0 : -92, opacity: up ? 1 : 0 }}
            transition={{ duration: 0.42, delay: open ? n * 0.09 : 0, ease: OUT }}
          >
            <span className="font-id" style={{ fontSize: 11, fontWeight: 700, color: '#3A2A0C' }}>{word}</span>
          </motion.div>
        )
      })}

      {/* the front panel, which never folds */}
      <div style={{
        position: 'absolute', left: PX, top: 96 - 4, width: PW, height: 38, borderRadius: 9,
        background: `linear-gradient(150deg,${GOLD[0]},${GOLD[1]} 62%,#C08F2C)`,
        boxShadow: '0 5px 14px #00000073', display: 'grid', placeItems: 'center',
      }}>
        <span className="font-id" style={{ fontSize: 15, fontWeight: 700, letterSpacing: '.01em', color: '#2E2108' }}>PRO</span>
      </div>
    </div>
  )
}

/* ══ V · The Rail ════════════════════════════════════════════════════
   The Learn screen's own progress rail, continued. It reports what you
   did today; the offer is what the rail turns into when it fills. A tap
   below 3/3 nudges rather than opening the paywall. */
const STEPS = 3

function V({ onCommit, anim, progress = 2, onNudge }) {
  const H = 52
  const TOP = sit(H, 14)
  const done = progress >= STEPS
  const [nudge, setNudge] = useState(false)
  const shake = useMotionValue(0)

  const go = () => {
    if (!done) {
      setNudge(true)
      animate(shake, [0, 6, -5, 3, 0], { duration: 0.34, ease: 'easeOut' })
      setTimeout(() => setNudge(false), 1500)
      onNudge?.()
      return
    }
    onCommit({ cx: X0 + 36, cy: TOP + H / 2, size: 44, bloom: true })
  }

  const line = done
    ? ['Unlocked — 50% off PRO', 'You earned this today']
    : progress === 0
      ? ['Finish a lesson to start', null]
      : [nudge ? `${STEPS - progress} more lesson${STEPS - progress > 1 ? 's' : ''}, that’s it`
               : `${STEPS - progress} more to unlock it`,
         'Your reward is 50% off PRO']

  return (
    <motion.div style={{ ...box(TOP, H), x: shake }} onClick={go}>
      <div style={{
        position: 'absolute', left: X0, top: 0, width: W, height: H, borderRadius: H / 2,
        background: done ? 'linear-gradient(170deg,#241B0B,#140F07)' : progress === 0 ? 'linear-gradient(170deg,#191511,#0F0D0A)' : DARK,
        border: `1px solid ${done ? '#E8B54B' : progress === 0 ? '#4A4336' : '#8C6A2E'}`,
        boxSizing: 'border-box', boxShadow: SHADOW,
      }} />

      {done ? (
        <>
          <div style={{ position: 'absolute', left: X0 + 12, top: 2, width: 120, height: 48, borderRadius: 24,
                        background: '#E8B54B4D', filter: 'blur(18px)', pointerEvents: 'none' }} />
          <motion.svg width="40" height="40" viewBox="0 0 40 40" style={{ position: 'absolute', left: X0 + 16, top: 6 }}
                      initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.5, ease: OUT }}>
            <defs>
              <linearGradient id="railGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={GOLD[0]} /><stop offset="100%" stopColor={GOLD[2]} />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="15" fill="none" stroke="url(#railGold)" strokeWidth="3.5" />
            <circle cx="20" cy="5" r="5.5" fill={GOLD[0]} />
          </motion.svg>
        </>
      ) : (
        <>
          <div style={{ position: 'absolute', left: X0 + 26, top: 24, width: 76, height: 3, borderRadius: 2, background: '#3A3328' }} />
          <motion.div style={{ position: 'absolute', left: X0 + 26, top: 24, height: 3, borderRadius: 2,
                               background: `linear-gradient(90deg,${GOLD[2]},${GOLD[0]})` }}
                      initial={{ width: 0 }} animate={{ width: (76 * progress) / STEPS }}
                      transition={{ duration: 0.6, delay: 0.25, ease: OUT }} />
          {[0, 1, 2].map((n) => {
            const filled = n < progress
            const next = n === progress
            return (
              <motion.div key={n}
                style={{
                  position: 'absolute', left: X0 + 22 + n * 36, top: next ? 18 : 20,
                  width: next ? 15 : 11, height: next ? 15 : 11, borderRadius: 8,
                  background: filled ? GOLD[0] : 'transparent',
                  border: next ? '2px solid #8C6A2E' : filled ? 'none' : '2px solid #4A4336',
                  boxSizing: 'border-box',
                }}
                /* only the *next* node moves. The breathing thing on the
                   screen should be the next action, not the purchase. */
                animate={next && anim ? { scale: [1, 1.18, 1], opacity: [0.75, 1, 0.75] } : { scale: 1, opacity: 1 }}
                transition={next && anim ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
              />
            )
          })}
        </>
      )}

      <div className="font-id" style={{
        position: 'absolute', left: X0 + (done ? 68 : 124), top: line[1] ? (done ? 10 : 10) : 18,
        fontSize: done ? 15.5 : 14.5, fontWeight: done || progress > 0 ? 700 : 600,
        letterSpacing: '-.012em', lineHeight: done ? '19px' : '18px',
        color: done ? '#FFE7A8' : progress === 0 ? '#9A9183' : '#FFE7A8',
      }}>{line[0]}</div>
      {line[1] && (
        <div className="font-id" style={{
          position: 'absolute', left: X0 + (done ? 68 : 124), top: done ? 30 : 29,
          fontSize: 11.5, fontWeight: 500, lineHeight: '14px', color: done ? '#C6B084' : '#A9966B',
        }}>{line[1]}</div>
      )}
      {done && (
        <svg width="18" height="18" viewBox="0 0 18 18" style={{ position: 'absolute', left: X0 + 354, top: 17 }}>
          <path d="M4 9h9M9 4.6 13.4 9 9 13.4" fill="none" stroke="#FFE7A8" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </motion.div>
  )
}

export const DIRECTION_TABS = [
  { id: 's', key: 'S', name: 'The Seal', h: 56, C: S, interactive: true, copy: 'unwrap',
    note: 'sealed means unopened — the ribbon prints the copy as it unspools' },
  { id: 't', key: 'T', name: 'The Reel', h: 54, C: T, interactive: true, copy: 'sequential',
    note: 'four benefits one at a time, price last; a tap stops the reel on the offer' },
  { id: 'u', key: 'U', name: 'The Tag', h: 52, C: U, interactive: true, copy: 'unfold',
    note: 'three folded panels, one lifts at a time; a tap opens all three' },
  { id: 'v', key: 'V', name: 'The Rail', h: 52, C: V, interactive: true, copy: 'earned', progress: true,
    note: 'the Learn screen’s own rail — the offer is what it turns into when it fills' },
]
