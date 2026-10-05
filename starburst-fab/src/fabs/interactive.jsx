import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import GlassPane from './GlassPane.jsx'
import { NAV_H } from '../components/Chrome.jsx'

/**
 * Six glass tabs with something to do on them.
 *
 * The argument, in one line: **a tap is a decision you can take back, and a
 * gesture is one you already made.** Every interaction here is a conversion
 * mechanic doing a job rather than a flourish —
 *
 *   M  slide to claim      commitment
 *   N  hold to unlock      effort justification
 *   O  scratch it          curiosity, paid for with effort
 *   P  pick your plan      pre-selection — one less decision on the paywall
 *   Q  pull up to compare  progressive disclosure
 *   R  tear the stub       endowment
 *
 * All six call `onCommit({ cx, cy, size, bloom, plan })` instead of being
 * wrapped in a button. The origin is reported **at commit time** rather than
 * declared up front, because on five of these the thing that becomes the badge
 * has been moved by the user — the knob is wherever they let go of it, the
 * stub is wherever they tore it to. A static `badge` would have the flight
 * start from somewhere the user was not looking.
 *
 * `bloom: true` tells `BadgeOpen` the device is already a disc and only the
 * nine points are left to grow.
 */

const FRAME_H = 892
const sit = (h, gap) => FRAME_H - NAV_H - gap - h
const box = (top, h) => ({ position: 'absolute', left: 0, top, width: 412, height: h })

const GOLD_KNOB = 'linear-gradient(140deg,#FFE7A8 0%,#E8B54B 58%,#B47A22 100%)'
const GOLD_FLAT = 'linear-gradient(104deg,#FFE7A8 0%,#E8B54B 60%,#D59F34 100%)'
const SHADOW = '0 16px 36px #00000085'

/* the tab bar is 390 wide and inset 11, so everything lands in frame coords */
const X0 = 11
const W = 390

/** The arrow that lives in every gold knob here. */
const Arrow = ({ size = 18, color = '#3A2A0C' }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden>
    <path d="M4 9h9M9 4.6 13.4 9 9 13.4" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── M · Slide to claim ─────────────────────────────────────────────
   A tap can be a misfire; a slide cannot. By the time the knob is at
   the far end the thumb has spent 400ms agreeing with itself. */
function M({ onCommit }) {
  const H = 56
  const TOP = sit(H, 14)
  const PAD = 6
  const KNOB = 44
  const RUN = W - KNOB - PAD * 2
  const x = useMotionValue(0)
  const [done, setDone] = useState(false)
  const fill = useTransform(x, [0, RUN], [KNOB + PAD * 2, W])
  const hint = useTransform(x, [0, RUN * 0.5], [1, 0])

  const release = () => {
    if (done) return
    if (x.get() > RUN * 0.7) {
      setDone(true)
      animate(x, RUN, { type: 'spring', visualDuration: 0.18, bounce: 0.1 }).then(() =>
        onCommit({ cx: X0 + PAD + RUN + KNOB / 2, cy: TOP + H / 2, size: KNOB, bloom: true }))
    } else {
      animate(x, 0, { type: 'spring', visualDuration: 0.3, bounce: 0.35 })
    }
  }

  return (
    <div style={box(TOP, H)}>
      <div style={{ position: 'absolute', left: X0, top: 0, width: W, height: H, borderRadius: H / 2, boxShadow: SHADOW }}>
        <GlassPane w={W} h={H} radius={H / 2} />
        {/* the track fills behind the knob, so the gold is a measure of how
            far the commitment has got rather than decoration on the handle */}
        <motion.div style={{
          position: 'absolute', left: 0, top: 0, height: H, width: fill,
          borderRadius: H / 2, background: 'linear-gradient(90deg,rgba(232,181,75,.34),rgba(255,231,168,.12))',
          pointerEvents: 'none',
        }} />
        <motion.div style={{
          position: 'absolute', left: 74, top: 18, opacity: hint, pointerEvents: 'none',
        }}>
          <span className="font-id" style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: '-.005em', color: '#E4DCFA' }}>
            Slide to claim 50% off
          </span>
        </motion.div>
        <motion.div style={{ position: 'absolute', left: 332, top: 21, opacity: hint, pointerEvents: 'none' }}>
          <svg width="30" height="14" viewBox="0 0 30 14">
            <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3l4 4-4 4" opacity=".25" /><path d="M12 3l4 4-4 4" opacity=".45" /><path d="M21 3l4 4-4 4" opacity=".7" />
            </g>
          </svg>
        </motion.div>
        <motion.div
          drag="x" dragConstraints={{ left: 0, right: RUN }} dragElastic={0.02} dragMomentum={false}
          onDragEnd={release}
          style={{
            position: 'absolute', left: PAD, top: PAD, width: KNOB, height: KNOB, x,
            borderRadius: KNOB / 2, background: GOLD_KNOB, boxShadow: '0 6px 16px #00000066',
            display: 'grid', placeItems: 'center', cursor: 'grab', touchAction: 'none',
          }}
        ><Arrow /></motion.div>
      </div>
    </div>
  )
}

/* ── N · Hold to unlock ─────────────────────────────────────────────
   700ms is small enough to be nothing and long enough to be a choice.
   The ring *is* the disc: when it closes it is already the circle the
   badge grows out of, so the reward is what the effort filled. */
function N({ onCommit }) {
  const H = 54
  const TOP = sit(H, 14)
  const R = 16
  const C = 2 * Math.PI * R
  const RING = 40
  const p = useMotionValue(0)
  const offset = useTransform(p, (v) => C * (1 - v))
  const held = useRef(null)

  const start = () => {
    held.current = animate(p, 1, { duration: 0.7, ease: 'linear' })
    held.current.then((ok) => {
      if (ok !== false) onCommit({ cx: X0 + 18 + RING / 2, cy: TOP + H / 2, size: RING, bloom: true })
    })
  }
  const stop = () => {
    held.current?.stop()
    if (p.get() < 1) animate(p, 0, { duration: 0.22, ease: 'easeOut' })
  }
  useEffect(() => () => held.current?.stop(), [])

  return (
    <div style={box(TOP, H)}>
      <div
        onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
        style={{
          position: 'absolute', left: X0, top: 0, width: W, height: H, borderRadius: H / 2,
          boxShadow: SHADOW, cursor: 'pointer', touchAction: 'none', userSelect: 'none',
        }}
      >
        <GlassPane w={W} h={H} radius={H / 2} />
        <svg width={RING} height={RING} viewBox="0 0 40 40" style={{ position: 'absolute', left: 18, top: (H - RING) / 2, pointerEvents: 'none' }}>
          <defs>
            <linearGradient id="holdGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE7A8" /><stop offset="100%" stopColor="#E8B54B" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r={R} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="4" />
          <motion.circle
            cx="20" cy="20" r={R} fill="none" stroke="url(#holdGold)" strokeWidth="4" strokeLinecap="round"
            transform="rotate(-90 20 20)" strokeDasharray={C} style={{ strokeDashoffset: offset }}
          />
          <motion.circle cx="20" cy="20" r="7" fill="#FFE7A8" style={{ opacity: useTransform(p, [0, 1], [0.45, 1]) }} />
        </svg>
        <div className="font-id" style={{
          position: 'absolute', left: 72, top: 12, fontSize: 16, fontWeight: 700,
          letterSpacing: '-.012em', lineHeight: '20px', color: '#FFE7A8', pointerEvents: 'none',
        }}>Hold to unlock 50% off</div>
        <div className="font-id" style={{
          position: 'absolute', left: 72, top: 32, fontSize: 12, fontWeight: 500,
          lineHeight: '15px', color: '#B6ADD4', pointerEvents: 'none',
        }}>Unlimited calls with Sarah, half price</div>
      </div>
    </div>
  )
}

/* ── O · Scratch it yourself ────────────────────────────────────────
   The foil erases under the finger on a canvas mask, not on a timer.
   Past 55% cleared it finishes itself — nobody should have to scrub a
   whole panel to buy something. */
function O({ onCommit }) {
  const H = 54
  const TOP = sit(H, 14)
  const SW = 118, SH = 38, SX = 258, SY = (H - SH) / 2
  const canvas = useRef(null)
  const cells = useRef(new Set())
  const fired = useRef(false)
  const [cleared, setCleared] = useState(0)
  const COLS = 20, ROWS = 6

  const paint = useCallback(() => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, SW, SH)
    const g = ctx.createLinearGradient(0, 0, SW, SH)
    g.addColorStop(0, '#8C8578'); g.addColorStop(0.46, '#D3CCBC'); g.addColorStop(1, '#9A9284')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, SW, SH)
    ctx.strokeStyle = 'rgba(255,255,255,.26)'
    ctx.lineWidth = 1
    for (let x = -SH; x < SW + SH; x += 14) { ctx.beginPath(); ctx.moveTo(x, SH); ctx.lineTo(x + SH, 0); ctx.stroke() }
    ctx.fillStyle = '#56503F'
    ctx.font = '700 10.5px "Inter Display", system-ui'
    ctx.textAlign = 'center'
    ctx.letterSpacing = '1.8px'
    ctx.fillText('SCRATCH', SW / 2, SH / 2 + 4)
  }, [])

  useEffect(() => { paint() }, [paint])

  const scrub = (e) => {
    if (e.buttons === 0 && e.pointerType === 'mouse') return
    const c = canvas.current
    if (!c || fired.current) return
    const r = c.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * SW
    const y = ((e.clientY - r.top) / r.height) * SH
    const ctx = c.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
    /* a coarse grid rather than reading pixels back — `getImageData` on every
       pointermove is the one thing that would make this stutter */
    const cx = Math.floor((x / SW) * COLS)
    const cy = Math.floor((y / SH) * ROWS)
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) cells.current.add(`${cx + i}:${cy + j}`)
    const frac = cells.current.size / (COLS * ROWS)
    setCleared(frac)
    if (frac > 0.55) {
      fired.current = true
      onCommit({ cx: X0 + SX + SW / 2, cy: TOP + H / 2, size: 50, bloom: true })
    }
  }

  return (
    <div style={box(TOP, H)}>
      <div style={{ position: 'absolute', left: X0, top: 0, width: W, height: H, borderRadius: H / 2, boxShadow: SHADOW }}>
        <GlassPane w={W} h={H} radius={H / 2} />
        <div className="font-id" style={{
          position: 'absolute', left: 26, top: 11, fontSize: 15.5, fontWeight: 700,
          letterSpacing: '-.012em', lineHeight: '19px', color: '#FFE7A8', pointerEvents: 'none',
        }}>Scratch to see your code</div>
        <div className="font-id" style={{
          position: 'absolute', left: 26, top: 31, fontSize: 12, fontWeight: 500,
          lineHeight: '15px', color: '#B6ADD4', pointerEvents: 'none',
        }}>{cleared > 0.08 ? 'Keep going…' : 'Drag across the panel'}</div>
        <div style={{ position: 'absolute', left: SX, top: SY, width: SW, height: SH, borderRadius: 11, overflow: 'hidden' }}>
          <div className="grid place-items-center" style={{ position: 'absolute', inset: 0, background: GOLD_FLAT }}>
            <span className="font-id" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.02em', color: '#2E2108' }}>50% OFF</span>
          </div>
          <canvas
            ref={canvas} width={SW} height={SH}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); scrub(e) }}
            onPointerMove={scrub}
            style={{ position: 'absolute', inset: 0, width: SW, height: SH, touchAction: 'none', cursor: 'crosshair' }}
          />
        </div>
      </div>
    </div>
  )
}

/* ── P · Pick before you go ─────────────────────────────────────────
   The plan is chosen on the Learn screen, so the paywall opens with it
   already picked and one decision fewer on it. */
function P({ onCommit }) {
  const H = 58
  const TOP = sit(H, 14)
  const [plan, setPlan] = useState('yearly')
  const chip = plan === 'yearly' ? { x: 8, w: 152 } : { x: 168, w: 142 }

  const go = () => onCommit({
    cx: X0 + chip.x + chip.w / 2, cy: TOP + H / 2, size: 46, bloom: true, plan,
  })

  const Chip = ({ id, label, price, w, x }) => {
    const on = plan === id
    return (
      <button onClick={() => setPlan(id)} style={{
        position: 'absolute', left: x, top: 8, width: w, height: 42, borderRadius: 21,
        background: on ? 'linear-gradient(140deg,#FFE7A8 0%,#E8B54B 60%,#CE9A31 100%)' : 'rgba(255,255,255,.08)',
        border: on ? 'none' : '1px solid rgba(255,255,255,.15)', boxSizing: 'border-box', cursor: 'pointer',
      }}>
        <span className="font-id block" style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '.1em',
          color: on ? '#6B4E16' : '#B6ADD4', lineHeight: '13px',
        }}>{label}</span>
        <span className="font-id block tnum" style={{
          fontSize: 16, fontWeight: 700, letterSpacing: '-.015em',
          color: on ? '#2E2108' : '#E6E0FA', lineHeight: '19px',
        }}>{price}</span>
      </button>
    )
  }

  return (
    <div style={box(TOP, H)}>
      <div style={{ position: 'absolute', left: X0, top: 0, width: W, height: H, borderRadius: H / 2, boxShadow: SHADOW }}>
        <GlassPane w={W} h={H} radius={H / 2} />
        <Chip id="yearly" label="YEARLY · SAVE 50%" price="$49.99" x={8} w={152} />
        <Chip id="monthly" label="MONTHLY" price="$12.99" x={168} w={142} />
        <button onClick={go} className="grid place-items-center" style={{
          position: 'absolute', left: 322, top: 12, width: 34, height: 34, borderRadius: 17,
          background: GOLD_KNOB, cursor: 'pointer', border: 'none',
        }}><Arrow /></button>
      </div>
    </div>
  )
}

/* ── Q · Pull up to compare ─────────────────────────────────────────
   52px until you want more, then it tracks the finger up to 148 and
   the prices are there without leaving the screen. The cheapest first
   tap of the lot — it costs nothing to peek and you can put it back. */
function Q({ onCommit }) {
  const SHUT = 52
  const OPEN = 148
  const BOTTOM = FRAME_H - NAV_H - 14
  const h = useMotionValue(SHUT)
  const [open, setOpen] = useState(false)
  const [plan, setPlan] = useState('yearly')
  const start = useRef(SHUT)
  const fade = useTransform(h, [SHUT, SHUT + 34], [1, 0])
  const show = useTransform(h, [SHUT + 30, OPEN - 16], [0, 1])

  const snap = (to) => { setOpen(to === OPEN); animate(h, to, { type: 'spring', visualDuration: 0.34, bounce: 0.18 }) }
  const down = (e) => { start.current = h.get(); e.currentTarget.setPointerCapture(e.pointerId) }
  const dragMove = (_, info) => h.set(Math.max(SHUT, Math.min(OPEN, start.current - info.offset.y)))
  const dragEnd = () => snap(h.get() > (SHUT + OPEN) / 2 ? OPEN : SHUT)

  const go = () => onCommit({
    cx: 206, cy: BOTTOM - 26, size: 48, bloom: true, plan,
  })

  return (
    <motion.div style={{ position: 'absolute', left: 0, width: 412, height: h, top: useTransform(h, (v) => BOTTOM - v) }}>
      <motion.div
        drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0} dragMomentum={false}
        onPointerDown={down} onDrag={dragMove} onDragEnd={dragEnd}
        style={{
          position: 'absolute', left: X0, top: 0, width: W, height: '100%',
          borderRadius: 26, boxShadow: SHADOW, cursor: 'grab', touchAction: 'none',
        }}
      >
        <GlassPane w={W} h={OPEN} radius={26} />
        <div style={{
          position: 'absolute', left: W / 2 - 18, top: 7, width: 36, height: 4,
          borderRadius: 2, background: 'rgba(255,255,255,.35)', pointerEvents: 'none',
        }} />
        <motion.div style={{ position: 'absolute', left: 26, top: 17, opacity: fade, pointerEvents: 'none' }}>
          <span className="font-id" style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: '-.012em', color: '#FFE7A8' }}>
            Your 50% is ready
          </span>
        </motion.div>
        <motion.div style={{ position: 'absolute', left: 350, top: 18, opacity: fade, pointerEvents: 'none' }}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M4.6 11.2 9 6.8l4.4 4.4" fill="none" stroke="#FFE7A8" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.div>

        <motion.div style={{ position: 'absolute', inset: 0, opacity: show, pointerEvents: open ? 'auto' : 'none' }}>
          {[['yearly', 'YEARLY · SAVE 50%', '$49.99', '$4.16 a month', 20],
            ['monthly', 'MONTHLY', '$12.99', 'billed monthly', 202]].map(([id, label, price, sub, x]) => {
            const on = plan === id
            return (
              <button key={id} onClick={() => setPlan(id)} style={{
                position: 'absolute', left: x, top: 26, width: 168, height: 70, borderRadius: 16, cursor: 'pointer',
                background: on ? 'linear-gradient(150deg,#FFE7A8 0%,#E8B54B 62%,#CE9A31 100%)' : 'rgba(255,255,255,.08)',
                border: on ? 'none' : '1px solid rgba(255,255,255,.16)', boxSizing: 'border-box',
              }}>
                <span className="font-id block" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: on ? '#6B4E16' : '#B6ADD4', lineHeight: '14px' }}>{label}</span>
                <span className="font-id block tnum" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', color: on ? '#2E2108' : '#E6E0FA', lineHeight: '27px' }}>{price}</span>
                <span className="font-id block" style={{ fontSize: 11, fontWeight: 500, color: on ? '#6B4E16' : '#9A91BC', lineHeight: '14px' }}>{sub}</span>
              </button>
            )
          })}
          <button onClick={go} className="grid place-items-center" style={{
            position: 'absolute', left: 20, top: 108, width: 350, height: 32, borderRadius: 16,
            background: GOLD_FLAT, cursor: 'pointer', border: 'none',
          }}>
            <span className="font-id" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-.01em', color: '#3A2A0C' }}>
              Continue with {plan === 'yearly' ? 'Yearly' : 'Monthly'}
            </span>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/* ── R · Tear the stub ──────────────────────────────────────────────
   Once it is torn it is yours, and giving something up is heavier than
   not taking it. The stub is the only gold on the tab, so the piece
   pulled off is the badge. */
function R({ onCommit }) {
  const H = 58
  const TOP = sit(H, 14)
  const SX = 296, SW = 94
  const x = useMotionValue(0)
  const [gone, setGone] = useState(false)
  const gap = useTransform(x, [0, 70], [0, 1])

  const release = () => {
    if (gone) return
    if (x.get() > 56) {
      setGone(true)
      onCommit({ cx: X0 + SX + SW / 2 + x.get(), cy: TOP + H / 2, size: 54, bloom: true })
    } else {
      animate(x, 0, { type: 'spring', visualDuration: 0.3, bounce: 0.4 })
    }
  }

  return (
    <div style={box(TOP, H)}>
      <div style={{ position: 'absolute', left: X0, top: 0, width: SX - 10, height: H, borderRadius: `${H / 2}px 8px 8px ${H / 2}px`, boxShadow: SHADOW }}>
        <GlassPane w={SX - 10} h={H} radius={H / 2} />
        <div className="font-id" style={{
          position: 'absolute', left: 26, top: 12, fontSize: 15.5, fontWeight: 700,
          letterSpacing: '-.012em', lineHeight: '19px', color: '#FFE7A8', pointerEvents: 'none',
        }}>Tear off your 50%</div>
        <div className="font-id" style={{
          position: 'absolute', left: 26, top: 32, fontSize: 12, fontWeight: 500,
          lineHeight: '15px', color: '#B6ADD4', pointerEvents: 'none',
        }}>Drag the stub to the right</div>
      </div>
      <motion.svg width="2" height={H - 14} viewBox={`0 0 2 ${H - 14}`}
                  style={{ position: 'absolute', left: X0 + SX - 10, top: 7, opacity: useTransform(gap, [0, 1], [0.45, 0]) }}>
        <path d={`M1 0V${H - 14}`} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 5" />
      </motion.svg>
      <motion.div
        drag="x" dragConstraints={{ left: 0, right: 86 }} dragElastic={0.06} dragMomentum={false}
        onDragEnd={release}
        style={{
          position: 'absolute', left: X0 + SX, top: 0, width: SW, height: H, x,
          borderRadius: `8px ${H / 2}px ${H / 2}px 8px`, background: 'linear-gradient(150deg,#FFE7A8 0%,#E8B54B 62%,#C08F2C 100%)',
          boxShadow: '-10px 6px 20px #00000073', cursor: 'grab', touchAction: 'none',
          display: 'grid', placeItems: 'center', alignContent: 'center',
        }}
      >
        <span className="font-id" style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.02em', color: '#2E2108', lineHeight: '22px' }}>50%</span>
        <span className="font-id" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: '#6B4E16', lineHeight: '12px' }}>OFF</span>
      </motion.div>
    </div>
  )
}

export const GLASS_TABS = [
  { id: 'm', key: 'M', name: 'Slide to claim', h: 56, C: M, interactive: true, copy: 'commitment',
    note: 'drag the knob — release past 70% and it is the disc that becomes the badge' },
  { id: 'n', key: 'N', name: 'Hold to unlock', h: 54, C: N, interactive: true, copy: 'effort justification',
    note: 'press and hold 700ms — the ring you fill is the circle the badge grows out of' },
  { id: 'o', key: 'O', name: 'Scratch it yourself', h: 54, C: O, interactive: true, copy: 'curiosity + effort',
    note: 'the foil erases under the finger on a canvas mask; 55% cleared finishes it' },
  { id: 'p', key: 'P', name: 'Pick before you go', h: 58, C: P, interactive: true, copy: 'pre-selection',
    note: 'choose the plan here, and the chip you touched is what flies to the paywall' },
  { id: 'q', key: 'Q', name: 'Pull up to compare', h: 52, C: Q, interactive: true, copy: 'progressive disclosure',
    note: 'drag up to 148px for both prices; let go below halfway and it shuts again' },
  { id: 'r', key: 'R', name: 'Tear the stub', h: 58, C: R, interactive: true, copy: 'endowment',
    note: 'pull the stub along the perforation — past 56px it detaches and is yours' },
]
