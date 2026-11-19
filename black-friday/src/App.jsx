import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import SlotMachine, { STOP_AT, BOX_W } from './SlotMachine.jsx'
import BlackFridaySticker from './BlackFridaySticker.jsx'
import Paywall, { PlanBar } from './Paywall.jsx'
import ConfettiPop from './Confetti.jsx'
import { sfx, unlock, haptic, setEnabled } from './sfx.js'
import { BG, BG_V2, BG_GLOW, BG_GLOW_V2, BG_LIT, BG_LIT_V2, GOLD, TEXT, EASE, STILL } from './theme.js'

/* One scene, four phases.
 *
 * The machine is mounted once and never remounts — that is the whole trick
 * behind the hand-off. It travels from the middle of the reveal to the hero of
 * the offer page by animating its own transform, and from then on it rides the
 * scroller instead of being pinned, so it behaves like part of the page rather
 * than a layer floating over it.
 *
 * The order in the hero is the order the board has it: the mark on top, the
 * machine beneath it. The mark is the headline; the machine is the evidence.
 */

/* The frame matches the mithai prototype's — 412×915, scaled to fit rather
   than clipped, inside a real phone body. */
const PHONE_W = 412
const PHONE_H = 915
const SIDE = 28

/* ?tall=1 stretches the frame so the whole offer page is visible at once —
   for design review and screenshots, not for the flow. */
const TALL =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('tall') === '1'

/* ?lights=1 rings the sticker with marquee bulbs — the alternate banner */
const LIGHTS =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('lights') === '1'

/* ?v=2 is board 7L0-0: the hero sits a little higher at its original size, the
   page under it goes indigo, and the benefits become a four-row list. */
const V2 =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('v') === '2'

/* reveal — straight off 2IM-0 */
const REVEAL_Y = 280

/* The offer hero. The board stacks the sticker *behind* the machine — it is
   the first child of 28E-0 — so the machine reads as standing in front of a
   signboard rather than hanging off it. */
/* 7L0-0's hero now reads top-down: the clock, the mark, then the machine —
   the offer is dated before it is named, and named before it is shown. */
const MARK_Y = V2 ? 118 : 28
const MARK_SCALE = V2 ? 1.125 : 1.21
const MACHINE_Y = V2 ? 89 : 107
const MACHINE_SCALE = V2 ? 0.82 : 0.7

/* the page is drawn in the board's own coordinate space, so no padding */
const SCROLL_PAD = 0
/* the page's first row clears the machine's shadow, not its box */

const LAND_MS = STOP_AT[2] + 120
const HOLD_MS = 900 // let 2L2-0 exist for a beat before the page builds

/* ?at=won / ?at=paywall jumps straight to a state, so one screen can be linked
   for review without sitting through the pull. */
const startPhase = () => {
  if (typeof window === 'undefined') return 'idle'
  const at = new URLSearchParams(window.location.search).get('at')
  return at === 'won' || at === 'paywall' ? at : 'idle'
}

export default function App() {
  const [phase, setPhase] = useState(startPhase) // idle | spinning | won | paywall
  const [settled, setSettled] = useState(() => startPhase() === 'paywall')
  const [scrollY, setScrollY] = useState(0)
  const [clock, setClock] = useState(59 * 60 + 39)
  const [sound, setSound] = useState(true)
  const [pop, setPop] = useState(0)
  const [scale, setScale] = useState(1)
  const scroller = useRef(null)
  const timers = useRef([])
  /* a deep-linked load has no pull behind it, so the drums must not replay one */
  const deepLinked = useRef(startPhase() !== 'idle')

  const isPaywall = phase === 'paywall'
  const lit = phase === 'won' || isPaywall

  useEffect(() => {
    const t = setInterval(() => setClock((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  /* The frame is never cropped — it shrinks to whatever the window gives it,
     the same way the mithai prototype does. */
  useLayoutEffect(() => {
    const fit = () => {
      /* the same reserve the xmas prototype keeps for its header, so the two
         render the phone at the same size side by side */
      const availH = window.innerHeight - 152
      const availW = window.innerWidth - SIDE * 2
      setScale(Math.max(0.42, Math.min(availH / PHONE_H, availW / PHONE_W, 1)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const mmss = `${String(Math.floor(clock / 60)).padStart(2, '0')}:${String(clock % 60).padStart(2, '0')}`

  const pull = useCallback(() => {
    if (phase !== 'idle') return
    unlock()
    setPhase('spinning')

    /* Everything audible is scheduled here, in one go, on the audio clock —
       the drums, the three stops, the landing, the page. A timer per sound
       would drift a frame or two each, and a slot machine is nothing but
       timing. */
    sfx.lever()
    STOP_AT.forEach((ms, i) => {
      sfx.reel(0.13, ms / 1000 - 0.13, [-0.3, 0, 0.3][i])
      sfx.detent(ms / 1000, i)
    })
    sfx.jackpot(LAND_MS / 1000)
    sfx.coins(LAND_MS / 1000 + 0.14)
    sfx.build((LAND_MS + HOLD_MS) / 1000)

    haptic([10, 70, 10])
    STOP_AT.forEach((ms) => timers.current.push(setTimeout(() => haptic(12), ms)))

    timers.current.push(setTimeout(() => setPhase('won'), LAND_MS))
    timers.current.push(setTimeout(() => haptic([0, 24, 40, 24]), LAND_MS))
    timers.current.push(
      setTimeout(() => {
        setPhase('paywall')
        setPop((n) => n + 1) // the confetti is keyed on this, so it replays
      }, LAND_MS + HOLD_MS),
    )
    timers.current.push(setTimeout(() => setSettled(true), LAND_MS + HOLD_MS + 720))
  }, [phase])

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (scroller.current) scroller.current.scrollTop = 0
    setScrollY(0)
    setSettled(false)
    deepLinked.current = false
    setPhase('idle')
  }

  const toggleSound = () => {
    unlock()
    setSound((s) => {
      setEnabled(!s)
      return !s
    })
  }

  /* Once we are on the offer page both the mark and the machine ride the
     scroller, which is what keeps them from feeling like a sticker. */
  const machineY = isPaywall ? MACHINE_Y - scrollY : REVEAL_Y
  const glide = settled ? { duration: 0, ease: 'linear' } : { duration: 0.66, ease: EASE.out }

  return (
    <div style={shell}>
      <div style={{ width: PHONE_W * scale, height: PHONE_H * scale }}>
      <div
        style={{ ...phone, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        onClick={phase === 'idle' ? pull : undefined}
      >
        {/* ground: the board's gradient, its wash, and a warmer light that only
            exists once the drums land */}
        <div style={{ position: 'absolute', inset: 0, background: V2 ? BG_V2 : BG }} />
        <div
          style={{
            position: 'absolute', left: 0, right: 0, top: 0, height: 460,
            background: V2 ? BG_GLOW_V2 : BG_GLOW,
            ...(V2
              ? { maskImage: 'linear-gradient(180deg, #000 78%, transparent 100%)', WebkitMaskImage: 'linear-gradient(180deg, #000 78%, transparent 100%)' }
              : null),
          }}
        />
        <motion.div
          animate={{ opacity: lit ? 1 : 0 }}
          transition={{ duration: 0.8, ease: EASE.out }}
          style={{ position: 'absolute', inset: 0, background: V2 ? BG_LIT_V2 : BG_LIT }}
        />

        <div style={statusBar}>
          <span style={{ fontWeight: 600, fontSize: 13, color: TEXT.white }}>9:41</span>
          <div style={{ display: 'flex', gap: 5 }}>
            <span style={{ width: 17, height: 9, borderRadius: 2, background: TEXT.white }} />
            <span style={{ width: 24, height: 9, borderRadius: 2, background: TEXT.white }} />
          </div>
        </div>

        {/* close, at the board's own 24 / 66 */}
        <button onClick={(e) => { e.stopPropagation(); reset() }} style={closeBtn} aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M2 2l8 8M10 2l-8 8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        {!V2 && (
        <button onClick={(e) => { e.stopPropagation(); toggleSound() }} style={soundBtn} aria-label={sound ? 'Mute' : 'Unmute'}>
          <svg width="15" height="14" viewBox="0 0 15 14">
            <path d="M1 5h2.6L7 2v10L3.6 9H1z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinejoin="round" />
            {sound ? (
              <path d="M9.6 4.6a3.6 3.6 0 010 4.8M11.6 2.6a6.4 6.4 0 010 8.8" fill="none" stroke={V2 ? '#C9D0E2' : GOLD[1]} strokeWidth="1.3" strokeLinecap="round" />
            ) : (
              <path d="M10 5l3.6 4M13.6 5L10 9" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" strokeLinecap="round" />
            )}
          </svg>
        </button>
        )}

        {/* the offer page, scrolling under the hero */}
        <motion.div
          ref={scroller}
          onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
          className="no-bar"
          initial={false}
          animate={{ opacity: isPaywall ? 1 : 0 }}
          transition={{ duration: 0.45, ease: EASE.out }}
          style={{
            position: 'absolute',
            inset: 0,
            paddingTop: SCROLL_PAD,
            overflowY: isPaywall ? 'auto' : 'hidden',
            pointerEvents: isPaywall ? 'auto' : 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {isPaywall && <Paywall clock={mmss} v2={V2} />}
        </motion.div>

        {/* THE MARK — only on the offer page, and it arrives before the page
            does: it drops in, overshoots, and settles */}
        <AnimatePresence>
          {isPaywall && (
            <motion.div
              key="mark"
              initial={STILL ? false : { opacity: 0, y: -40, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.62, ease: [0.34, 1.3, 0.64, 1] }}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: MARK_Y - scrollY,
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              {V2 ? <BlackFridayWord /> : <BlackFridaySticker scale={MARK_SCALE} lights={LIGHTS} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* the reveal copy — headline over, caption under. Both are gone on
            `won`, which is exactly what board 2L2-0 shows. */}
        <AnimatePresence>
          {phase === 'idle' || phase === 'spinning' ? (
            <motion.div
              key="head"
              initial={STILL ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18, transition: { duration: 0.32 } }}
              transition={{ delay: 0.25, duration: 0.6, ease: EASE.out }}
              style={{ position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', pointerEvents: 'none' }}
            >
              <div
                style={{
                  margin: '0 auto',
                  width: 301,
                  fontFamily: "'Inter Display',sans-serif",
                  fontWeight: 600,
                  fontSize: 29,
                  lineHeight: '37px',
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  color: V2 ? '#EDF1F8' : TEXT.hi,
                }}
              >
                You’ve unlocked
                <br />
                an offer
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'idle' || phase === 'spinning' ? (
            <motion.div
              key="cap"
              initial={STILL ? false : { opacity: 0 }}
              animate={{ opacity: phase === 'spinning' ? 0.35 : 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ position: 'absolute', left: 0, right: 0, top: 665, textAlign: 'center' }}
            >
              <motion.div
                animate={phase === 'idle' ? { y: [0, 4, 0] } : { y: 0 }}
                transition={{ duration: 2, repeat: phase === 'idle' ? Infinity : 0, ease: 'easeInOut' }}
                style={{ fontSize: 14.5, lineHeight: '18px', color: V2 ? '#9AA2B6' : TEXT.warm }}
              >
                Tap anywhere to reveal it
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* THE MACHINE — mounted once, for the whole flow */}
        <motion.div
          animate={{ y: machineY, scale: isPaywall ? MACHINE_SCALE : 1 }}
          transition={glide}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: BOX_W,
            transformOrigin: 'top center',
            pointerEvents: isPaywall ? 'none' : 'auto',
            zIndex: 2,
          }}
        >
          <div style={{ cursor: phase === 'idle' ? 'pointer' : 'default' }}>
            <SlotMachine
              phase={phase === 'spinning' ? 'spin' : 'idle'}
              lit={lit}
              pulled={phase === 'spinning'}
              instant={deepLinked.current && phase !== 'spinning'}
              silver={V2}
              lever={!(V2 && isPaywall)}
              shadow={!V2}
            />
          </div>
        </motion.div>

        {/* the confetti goes off with the page, over everything but the sheet */}
        {pop > 0 && <ConfettiPop key={pop} w={PHONE_W} y={320} />}

        <PlanBar show={isPaywall} v2={V2} />
      </div>
      </div>

      <div style={caption}>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>Tap to reveal · × replays · ♪ mutes · ?lights=1 · ?v=2</span>
      </div>
    </div>
  )
}

const shell = {
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 18,
  background: '#07060D',
  padding: '28px 0',
}

/* The mark, on the 7L0-0 board: no die cut, no extrude — letter-spaced caps
   with their own light behind them. The glow is three stacked shadows rather
   than one, because a single wide one reads as blur on the type; a tight white
   core, a violet middle and a wide dim halo read as the letters being lit. */
function BlackFridayWord() {
  return (
    <div
      style={{
        width: 360,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter Display', system-ui, sans-serif",
        fontWeight: 500,
        fontSize: 31,
        lineHeight: '30px',
        letterSpacing: '0.27em',
        /* the tracking is applied to the right of every glyph, including the
           last, so the word sits a half-space left of centre without this */
        textIndent: '0.27em',
        color: '#FFFFFF',
        whiteSpace: 'nowrap',
        textShadow:
          '0 0 10px rgba(255,255,255,0.55), 0 0 30px rgba(186,196,255,0.45),' +
          '0 0 68px rgba(104,116,230,0.40), 0 0 120px rgba(76,86,200,0.30)',
      }}
    >
      BLACK FRIDAY
    </div>
  )
}

const phone = {
  position: 'relative',
  width: PHONE_W,
  height: TALL ? 3460 : PHONE_H,
  borderRadius: 44,
  overflow: 'hidden',
  /* the same body as the mithai prototype: an 8px bezel and a 1px rim */
  boxShadow: '0 40px 90px rgba(0,0,0,0.55), 0 0 0 8px #0b0b0f, 0 0 0 9px rgba(255,255,255,0.10)',
  isolation: 'isolate',
}

const statusBar = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 46,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 26px',
  zIndex: 7,
  pointerEvents: 'none',
}

const round = {
  position: 'absolute',
  top: 66,
  width: 30,
  height: 30,
  borderRadius: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 8,
  border: '1px solid rgba(255,255,255,0.35)',
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(8px)',
}

const closeBtn = { ...round, left: 24 }
const soundBtn = { ...round, right: 24 }

const caption = {
  fontFamily: "'Geist Mono',monospace",
  fontSize: 11,
  letterSpacing: '0.1em',
}
