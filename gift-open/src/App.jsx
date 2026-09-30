import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import Stage, { FRAME } from './components/Stage.jsx'
import { SCREENS, byId } from './fabs/index.jsx'
import { useOfferClock, STOPS } from './useOfferClock.js'

/**
 * The stand.
 *
 * 412 × 892 cannot reflow and the thing being judged sits 14 above the nav, so
 * the phone is measured against whatever is left after the header and the rail
 * and scaled with `zoom` — never `transform: scale()`, which does not change
 * layout and would leave the page scrolling and the pinned slot computing
 * against the unscaled box.
 */

const RAIL = 300
const GUTTER = 34
const SIDE = 26
const STACK_AT = 900

export default function App() {
  const [id, setId] = useState(() => {
    const q = new URLSearchParams(location.search).get('s') || ''
    return SCREENS.some((s) => s.id === q) ? q : '1'
  })
  const [phase, setPhase] = useState('learn')   // learn → opening → paywall
  const [anim, setAnim] = useState(true)
  const [slow, setSlow] = useState(false)
  const [stop, setStop] = useState('full')
  const [run, setRun] = useState(0)
  const [pwRun, setPwRun] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [compact, setCompact] = useState(false)

  const headRef = useRef(null)
  const railRef = useRef(null)
  const clock = useOfferClock(stop)
  const screen = byId(id)

  useLayoutEffect(() => {
    const fit = () => {
      const stacked = window.innerWidth < STACK_AT
      setCompact(stacked)
      const headH = headRef.current?.offsetHeight ?? 96
      const railH = stacked ? (railRef.current?.offsetHeight ?? 0) + 14 : 0
      const availH = window.innerHeight - headH - railH - 26
      const availW = window.innerWidth - SIDE * 2 - (stacked ? 0 : RAIL + GUTTER)
      setZoom(Math.max(0.36, Math.min(availH / FRAME.h, availW / FRAME.w, 1)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [compact, id])

  const pick = (next) => {
    setId(next)
    setPhase('learn')
    setRun((r) => r + 1)
    history.replaceState(null, '', `?s=${next}`)
  }
  const reset = useCallback(() => { setPhase('learn'); setRun((r) => r + 1) }, [])
  /* `onOpened` has to be stable. The clock re-renders App every second, and an
     inline arrow here would give GiftOpen a new callback each tick, restarting
     its own end-of-sequence timeout before it could ever fire — the light would
     expand and then simply sit there. */
  const opened = useCallback(() => setPhase('paywall'), [])
  const open = useCallback(() => setPhase('opening'), [])
  const pwReplay = useCallback(() => setPwRun((r) => r + 1), [])

  const panel = (
    <Rail
      screens={SCREENS} current={screen} onPick={pick}
      phase={phase} onOpen={open} onReset={reset}
      anim={anim} onAnim={() => setAnim((a) => !a)}
      slow={slow} onSlow={() => setSlow((s) => !s)}
      stop={stop} onStop={setStop}
      onReplay={() => setRun((r) => r + 1)}
      compact={compact}
    />
  )

  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col items-center"
         style={{ background: 'radial-gradient(120% 80% at 50% 0%,#151320 0%,#0B0A10 55%,#08070C 100%)', paddingInline: SIDE }}>

      <header ref={headRef} className="w-full shrink-0 flex flex-col items-center" style={{ paddingTop: 14, paddingBottom: 10 }}>
        <h1 className="font-id text-white text-center" style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: '-.015em' }}>
          Stimuler · tap the gift → the coupon paywall
        </h1>
        <p className="font-id text-center" style={{ color: '#6C6679', fontSize: 12, marginTop: 4 }}>
          four screens · tap the floating action to open it {compact ? '· pick one above' : ''}
        </p>
      </header>

      {compact && <div ref={railRef} className="w-full shrink-0" style={{ marginBottom: 12 }}>{panel}</div>}

      <main className="flex items-start justify-center w-full min-h-0" style={{ gap: GUTTER }}>
        <div style={{ width: FRAME.w * zoom, height: FRAME.h * zoom, flexShrink: 0 }}>
          <div style={{ zoom }} className={slow ? 'half-speed' : undefined}>
            <Stage screen={screen} clock={clock} anim={anim} run={run}
                   phase={phase}
                   onTap={open}
                   onOpened={opened}
                   onReset={reset}
                   pwRun={pwRun} onPwReplay={pwReplay} />
          </div>
        </div>
        {!compact && <div className="min-h-0 shrink-0" style={{ height: FRAME.h * zoom, width: RAIL }}>{panel}</div>}
      </main>
    </div>
  )
}

/* ── the rail ────────────────────────────────────────────────────── */

function Rail({ screens, current, onPick, phase, onOpen, onReset, anim, onAnim, slow, onSlow, stop, onStop, onReplay, compact }) {
  const tabs = screens.map((s) => {
    const on = s.id === current.id
    return (
      <button key={s.id} onClick={() => onPick(s.id)}
              className={`${compact ? 'shrink-0' : 'text-left w-full'} rounded-[12px] transition-colors`}
              style={{
                padding: compact ? '8px 12px' : '9px 12px',
                background: on ? 'rgba(255,255,255,.09)' : 'rgba(255,255,255,.02)',
                outline: `1px solid ${on ? '#E9B94D4D' : 'rgba(255,255,255,.06)'}`,
                outlineOffset: -1,
              }}>
        <span className="flex items-baseline" style={{ gap: 8 }}>
          <span className="font-id" style={{ color: '#E9B94D', fontSize: 11.5, fontWeight: 700 }}>{s.id}</span>
          <span className="font-id whitespace-nowrap" style={{ color: on ? '#fff' : 'rgba(255,255,255,.62)', fontSize: 13, fontWeight: 600 }}>{s.name}</span>
          {!compact && <span className="font-id whitespace-nowrap" style={{ color: '#6C6679', fontSize: 10, marginLeft: 'auto' }}>{s.motion}</span>}
        </span>
        {!compact && on && (
          <span className="font-id block" style={{ color: '#7C7689', fontSize: 11.5, lineHeight: '16px', marginTop: 5 }}>{s.note}</span>
        )}
      </button>
    )
  })

  const openBtn = (
    <button onClick={phase === 'learn' ? onOpen : onReset}
            className="flex-1 rounded-[9px] font-id whitespace-nowrap transition-colors"
            style={{
              padding: compact ? '7px 14px' : '10px 0', fontSize: 12.5, fontWeight: 700,
              background: phase === 'learn' ? 'linear-gradient(135deg,#F6D98C 0%,#E9B94C 54%,#D2A034 100%)' : 'rgba(255,255,255,.06)',
              color: phase === 'learn' ? '#2A1D05' : 'rgba(255,255,255,.66)',
            }}>
      {phase === 'learn' ? 'Open the gift' : 'Back to the screen'}
    </button>
  )

  if (compact) {
    return (
      <div className="w-full flex flex-col" style={{ gap: 8 }}>
        <div className="flex overflow-x-auto no-bar" style={{ gap: 6 }}>{tabs}</div>
        <div className="flex items-center overflow-x-auto no-bar" style={{ gap: 6 }}>
          {openBtn}
          <Toggle on={anim} onClick={onAnim} labelOn="Animating" labelOff="Held still" tint="#43D6A0" dense />
          <Toggle on={slow} onClick={onSlow} labelOn="Half speed" labelOff="Full speed" tint="#9AC7FF" dense />
          <Plain onClick={onReplay} dense>Replay</Plain>
        </div>
      </div>
    )
  }

  return (
    <aside className="flex flex-col h-full min-h-0" style={{ width: RAIL, gap: 12 }}>
      <div className="font-id shrink-0" style={{ color: '#5C5768', fontSize: 10.5, fontWeight: 600, letterSpacing: '.12em' }}>
        FOUR SCREENS · ONE 6s IDLE LOOP
      </div>
      <div className="flex flex-col overflow-y-auto no-bar min-h-0" style={{ gap: 5 }}>{tabs}</div>

      <div className="rounded-[14px] shrink-0"
           style={{ padding: 12, background: 'rgba(255,255,255,.04)', outline: '1px solid rgba(255,255,255,.07)', outlineOffset: -1 }}>
        <div className="flex" style={{ gap: 5 }}>{openBtn}</div>
        <p className="font-id" style={{ color: '#6C6679', fontSize: 11.5, lineHeight: '17px', margin: '9px 0 12px' }}>
          Tapping the button on the phone does the same thing. The paywall's own × comes back here.
        </p>

        <div className="flex" style={{ gap: 5 }}>
          <Toggle on={anim} onClick={onAnim} labelOn="Animating" labelOff="Held still" tint="#43D6A0" />
          <Toggle on={slow} onClick={onSlow} labelOn="Half speed" labelOff="Full speed" tint="#9AC7FF" />
        </div>
        <div className="flex" style={{ gap: 5, marginTop: 6 }}>
          <Plain onClick={onReplay}>Replay the idle loop</Plain>
        </div>

        <div className="font-id" style={{ color: '#5C5768', fontSize: 10.5, fontWeight: 600, letterSpacing: '.12em', margin: '14px 0 8px' }}>TIME LEFT</div>
        <div className="flex" style={{ gap: 5 }}>
          {STOPS.map((s) => (
            <button key={s.id} onClick={() => onStop(s.id)}
                    className="flex-1 rounded-[9px] font-id tnum transition-colors"
                    style={{
                      padding: '7px 0', fontSize: 12, fontWeight: 600,
                      background: stop === s.id ? 'rgba(233,185,77,.16)' : 'rgba(255,255,255,.05)',
                      color: stop === s.id ? '#E9B94D' : 'rgba(255,255,255,.5)',
                    }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

function Toggle({ on, onClick, labelOn, labelOff, tint, dense }) {
  return (
    <button onClick={onClick}
            className={`${dense ? 'shrink-0' : 'flex-1'} rounded-[9px] font-id whitespace-nowrap transition-colors`}
            style={{
              padding: dense ? '7px 12px' : '8px 0', fontSize: 12, fontWeight: 600,
              background: on ? `${tint}29` : 'rgba(255,255,255,.05)',
              color: on ? tint : 'rgba(255,255,255,.5)',
            }}>
      {on ? labelOn : labelOff}
    </button>
  )
}

function Plain({ onClick, children, dense }) {
  return (
    <button onClick={onClick}
            className={`${dense ? 'shrink-0' : 'flex-1'} rounded-[9px] font-id whitespace-nowrap`}
            style={{ padding: dense ? '7px 12px' : '8px 0', fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.5)' }}>
      {children}
    </button>
  )
}
