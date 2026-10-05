import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Paywall from './components/Paywall.jsx'
import { THEMES } from './theme.js'
import { StatusBar, Header, NavBar, NAV_H } from './learn/Chrome.jsx'
import Roadmap from './learn/Roadmap.jsx'
import { FABS, Seal } from './fabs.jsx'
import { useOfferClock } from './useOfferClock.js'

/**
 * Two floating actions on the Learn screen, each opening the gold offer
 * paywall — the second page of the India flow, reached directly.
 *
 * Both tabs are the same offer in opposite clothes, and both alternate their
 * line between **Get Stimuler PRO** and **Unlock unlimited practice**. The
 * question the toggle exists to answer is which casing and which sentence a
 * thumb actually goes to, so the two sit on the identical screen at the
 * identical height and nothing else differs.
 *
 * ── the tap ───────────────────────────────────────────────────────
 *
 *     0 – 120ms   the Learn screen steps back to the offer page's ground
 *    80 – 800ms   the seal leaves the tab and flies to the page's badge slot
 *   520 – 720ms   the page comes up underneath, holding everything back
 *   800ms         the page takes the badge over and begins its own reveal
 *   820 – 950ms   the flying copy fades into the one that was always there
 *
 * The landing is `(206, 256)`: the scroller's 158 of top padding plus half the
 * 196-tall offer slot, taken off `Flow.jsx`'s own constants rather than
 * measured. The flying seal is held at rest for the whole flight — the tab's
 * copy spins, this one does not, because it has to land at the same angle the
 * page mounts its badge at or the hand-off shows.
 */

const FRAME = { w: 412, h: 915 }
const SIDE = 28
const RAIL = 268
const STACK_AT = 900

/* the slot the tab sits in: 390 wide, 14 above the nav */
const SLOT = { x: 11, w: 390, h: 72 }
const SLOT_TOP = FRAME.h - NAV_H - 14 - SLOT.h

/* where each tab keeps its seal, and the slot it flies to */
const SEAL = {
  /* centred on the bar now, which is the alignment fix */
  starburst: { cx: SLOT.x - 2 + 38, cy: SLOT_TOP + 5 + 38, size: 76 },
  /* the ticket has no seal any more — the badge grows out of the figure on
     its stub, which is where the eye already is */
  ticket: { cx: SLOT.x + 339, cy: SLOT_TOP + 38, size: 54 },
  'ticket-mark': { cx: SLOT.x + 342, cy: SLOT_TOP + 44, size: 54 },
}
const LAND = { cx: 206, cy: 256, size: 276 }
const OPEN_MS = 1000

export default function App() {
  const q = new URLSearchParams(location.search)
  const [id] = useState(FABS[0].id)
  const [phase, setPhase] = useState(q.get('open') === '1' ? 'offer' : 'learn')
  const [landed, setLanded] = useState(q.get('open') === '1')
  const [run, setRun] = useState(0)
  const [scale, setScale] = useState(1)
  const [compact, setCompact] = useState(false)
  const headRef = useRef(null)
  const railRef = useRef(null)
  const clock = useOfferClock('full')
  const fab = FABS.find((f) => f.id === id) ?? FABS[0]
  const t = THEMES.plus

  useLayoutEffect(() => {
    const fit = () => {
      const stacked = window.innerWidth < STACK_AT
      setCompact(stacked)
      const headH = headRef.current?.offsetHeight ?? 110
      const railH = stacked ? (railRef.current?.offsetHeight ?? 0) + 14 : 0
      const availH = window.innerHeight - headH - railH - 28
      const availW = window.innerWidth - SIDE * 2 - (stacked ? 0 : RAIL + 34)
      setScale(Math.max(0.42, Math.min(availH / FRAME.h, availW / FRAME.w, 1)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [compact, id])

  const open = useCallback(() => {
    setPhase('opening')
    setTimeout(() => setLanded(true), 800)
    setTimeout(() => setPhase('offer'), OPEN_MS)
  }, [])

  const reset = useCallback(() => {
    setPhase('learn'); setLanded(false); setRun((r) => r + 1)
  }, [])


  const F = fab.C
  const seal = SEAL[id]
  const showLearn = phase !== 'offer'
  const showOffer = phase !== 'learn'

  const panel = (
    <Rail current={fab} phase={phase} onOpen={open} onReset={reset} compact={compact} />
  )

  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col items-center"
         style={{ background: 'radial-gradient(120% 80% at 50% 0%,#1A1206 0%,#0C0903 55%,#070502 100%)', paddingInline: SIDE }}>
      <header ref={headRef} className="w-full shrink-0 flex flex-col items-center" style={{ paddingTop: 14, paddingBottom: 10 }}>
        <h1 className="font-id text-white text-center" style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: '-.015em' }}>
          Stimuler · the stub ticket → the gold offer paywall
        </h1>
        <p className="font-id text-center" style={{ color: '#8A7A5C', fontSize: 12, marginTop: 4 }}>
          the line alternates every 2.8s · scratch the stub, or tap anywhere on the tab
        </p>
      </header>

      {compact && <div ref={railRef} className="w-full shrink-0" style={{ marginBottom: 12 }}>{panel}</div>}

      <main className="flex items-start justify-center w-full min-h-0" style={{ gap: 34 }}>
        <div style={{ width: FRAME.w * scale, height: FRAME.h * scale, flexShrink: 0 }}>
          <div style={{
            zoom: scale, width: FRAME.w, height: FRAME.h, position: 'relative',
            overflow: 'hidden', borderRadius: 44, background: '#0A0A0A',
            boxShadow: '0 40px 90px rgba(0,0,0,.55), 0 0 0 8px #0b0b0f, 0 0 0 9px rgba(255,255,255,.10)',
          }}>
            {showLearn && (
              <>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 127, bottom: 0 }}>
                  <Roadmap topPad={8.43} bottomPad={NAV_H + 14 + SLOT.h + 24} />
                </div>
                <StatusBar />
                <Header />
                <motion.div key={`${id}-${run}`}
                            style={{ position: 'absolute', left: SLOT.x, top: SLOT_TOP, zIndex: 35 }}
                            animate={{ opacity: phase === 'opening' ? 0 : 1 }}
                            transition={{ duration: 0.2, delay: phase === 'opening' ? 0.1 : 0 }}>
                  <F clock={clock} onTap={phase === 'learn' ? open : undefined} />
                </motion.div>
                <NavBar />
              </>
            )}

            {showOffer && (
              <motion.div style={{ position: 'absolute', inset: 0, zIndex: 20 }}
                          initial={{ opacity: phase === 'opening' ? 0 : 1 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: phase === 'opening' ? 0.52 : 0 }}>
                <Paywall bare tabBar variant="v2" market="in" tier="pro" theme="plus" run={run}
                         badge={landed ? 'landed' : 'hidden'} reveal={landed}
                         onClose={reset} />
              </motion.div>
            )}

            {phase === 'opening' && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 60, pointerEvents: 'none' }}>
                <motion.div style={{ position: 'absolute', inset: 0, background: t.page }}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }} />
                <motion.div
                  style={{ position: 'absolute', left: 0, top: 0, width: LAND.size, height: LAND.size }}
                  initial={{
                    x: seal.cx - LAND.size / 2, y: seal.cy - LAND.size / 2,
                    scale: seal.size / LAND.size, opacity: 1,
                  }}
                  animate={{
                    x: LAND.cx - LAND.size / 2, y: LAND.cy - LAND.size / 2,
                    scale: 1, opacity: [1, 1, 0],
                  }}
                  transition={{
                    default: { type: 'spring', visualDuration: 0.6, bounce: 0.14, delay: 0.08 },
                    opacity: { duration: 0.95, times: [0, 0.86, 1], ease: 'linear' },
                  }}
                >
                  {/* held at rest: it has to land at the angle the page mounts
                      its own badge at, or the hand-off shows */}
                  <Seal size={LAND.size} uid="fly" />
                </motion.div>
              </div>
            )}
          </div>
        </div>
        {!compact && <div className="min-h-0 shrink-0" style={{ height: FRAME.h * scale, width: RAIL }}>{panel}</div>}
      </main>
    </div>
  )
}

function Rail({ current, phase, onOpen, onReset, compact }) {
  const openBtn = (
    <button onClick={phase === 'learn' ? onOpen : onReset}
            className="rounded-[9px] font-id whitespace-nowrap transition-colors"
            style={{
              flex: 1, padding: compact ? '7px 14px' : '10px 0', fontSize: 12.5, fontWeight: 700,
              background: phase === 'learn' ? 'linear-gradient(135deg,#FFE7A8 0%,#E8B54B 54%,#D2A034 100%)' : 'rgba(255,255,255,.06)',
              color: phase === 'learn' ? '#2A1D05' : 'rgba(255,255,255,.66)',
            }}>
      {phase === 'learn' ? 'Open the paywall' : 'Back to the screen'}
    </button>
  )

  if (compact) {
    return (
      <div className="w-full flex flex-col" style={{ gap: 8 }}>
        <div className="flex" style={{ gap: 6 }}>{openBtn}</div>
      </div>
    )
  }

  return (
    <aside className="flex flex-col h-full min-h-0" style={{ width: RAIL, gap: 12 }}>
      <div className="font-id shrink-0" style={{ color: '#6B6045', fontSize: 10.5, fontWeight: 600, letterSpacing: '.12em' }}>
        STUB + MARK
      </div>
      <p className="font-id shrink-0" style={{ color: '#8A7A5C', fontSize: 12, lineHeight: '18px', margin: 0 }}>
        {current.note}
      </p>
      <div className="rounded-[14px] shrink-0"
           style={{ padding: 12, background: 'rgba(255,255,255,.04)', outline: '1px solid rgba(255,255,255,.07)', outlineOffset: -1 }}>
        <div className="flex">{openBtn}</div>
        <p className="font-id" style={{ color: '#8A7A5C', fontSize: 11.5, lineHeight: '17px', margin: '11px 0 0' }}>
          Scratching the stub reveals 50% off and the page follows 700ms later. Tapping anywhere else on the tab opens it straight away.
        </p>
      </div>
    </aside>
  )
}
