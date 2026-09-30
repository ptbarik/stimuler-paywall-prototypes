import { useLayoutEffect, useRef, useState } from 'react'
import Frame, { FRAME } from './components/Frame.jsx'
import { TABS, byId } from './fabs/index.jsx'
import { useOfferClock, STOPS } from './useOfferClock.js'

/**
 * The stand.
 *
 * 412 × 844 cannot reflow and the thing being judged sits at the bottom of it,
 * so the phone is measured against whatever is left after the header and the
 * rail and scaled with `zoom` — never `transform: scale()`, which does not
 * change layout and would leave the page scrolling.
 */

const RAIL = 296
const GUTTER = 34
const SIDE = 26
const STACK_AT = 900

export default function App() {
  const [id, setId] = useState(() => {
    const q = new URLSearchParams(location.search).get('t') || ''
    return TABS.some((t) => t.id === q) ? q : '1'
  })
  const [anim, setAnim] = useState(true)
  const [slow, setSlow] = useState(false)
  const [stop, setStop] = useState('full')
  const [run, setRun] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [compact, setCompact] = useState(false)

  const headRef = useRef(null)
  const railRef = useRef(null)
  const clock = useOfferClock(stop)
  const tab = byId(id)

  useLayoutEffect(() => {
    const fit = () => {
      const stacked = window.innerWidth < STACK_AT
      setCompact(stacked)
      const headH = headRef.current?.offsetHeight ?? 96
      const railH = stacked ? (railRef.current?.offsetHeight ?? 0) + 14 : 0
      const availH = window.innerHeight - headH - railH - 24
      const availW = window.innerWidth - SIDE * 2 - (stacked ? 0 : RAIL + GUTTER)
      setZoom(Math.max(0.4, Math.min(availH / FRAME.h, availW / FRAME.w, 1)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [compact, id])

  const pick = (next) => {
    setId(next)
    setRun((r) => r + 1)
    history.replaceState(null, '', `?t=${next}`)
  }

  const panel = (
    <Rail tab={tab} onPick={pick}
          anim={anim} onAnim={() => setAnim((a) => !a)}
          slow={slow} onSlow={() => setSlow((s) => !s)}
          stop={stop} onStop={setStop}
          onReplay={() => setRun((r) => r + 1)}
          compact={compact} />
  )

  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col items-center"
         style={{ background: 'radial-gradient(120% 80% at 50% 0%,#151320 0%,#0B0A10 55%,#08070C 100%)', paddingInline: SIDE }}>

      <header ref={headRef} className="w-full shrink-0 flex flex-col items-center" style={{ paddingTop: 14, paddingBottom: 10 }}>
        <h1 className="font-id text-white text-center" style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: '-.015em' }}>
          Stimuler · seven FAB tabs, shining
        </h1>
        <p className="font-id text-center" style={{ color: '#6C6679', fontSize: 12, marginTop: 4 }}>
          one 6s light · pick a tab {compact ? 'above' : 'on the right'}
        </p>
      </header>

      {compact && <div ref={railRef} className="w-full shrink-0" style={{ marginBottom: 12 }}>{panel}</div>}

      <main className="flex items-start justify-center w-full min-h-0" style={{ gap: GUTTER }}>
        <div style={{ width: FRAME.w * zoom, height: FRAME.h * zoom, flexShrink: 0 }}>
          <div style={{ zoom }} className={slow ? 'half-speed' : undefined}>
            <Frame tab={tab} clock={clock} anim={anim} run={run} />
          </div>
        </div>
        {!compact && <div className="min-h-0 shrink-0" style={{ height: FRAME.h * zoom, width: RAIL }}>{panel}</div>}
      </main>
    </div>
  )
}

function Rail({ tab, onPick, anim, onAnim, slow, onSlow, stop, onStop, onReplay, compact }) {
  const tabs = TABS.map((t) => {
    const on = t.id === tab.id
    return (
      <button key={t.id} onClick={() => onPick(t.id)}
              className={`${compact ? 'shrink-0' : 'text-left w-full'} rounded-[12px] transition-colors`}
              style={{
                padding: compact ? '8px 12px' : '9px 12px',
                background: on ? 'rgba(255,255,255,.09)' : 'rgba(255,255,255,.02)',
                outline: `1px solid ${on ? '#E9B94D4D' : 'rgba(255,255,255,.06)'}`,
                outlineOffset: -1,
              }}>
        <span className="flex items-baseline" style={{ gap: 8 }}>
          <span className="font-id" style={{ color: '#E9B94D', fontSize: 11.5, fontWeight: 700 }}>{t.id}</span>
          <span className="font-id whitespace-nowrap" style={{ color: on ? '#fff' : 'rgba(255,255,255,.62)', fontSize: 13, fontWeight: 600 }}>{t.name}</span>
          {!compact && t.stars > 0 && (
            <span className="font-id whitespace-nowrap" style={{ color: '#6C6679', fontSize: 10, marginLeft: 'auto' }}>{t.stars} stars</span>
          )}
        </span>
        {!compact && on && (
          <span className="font-id block" style={{ color: '#7C7689', fontSize: 11.5, lineHeight: '16px', marginTop: 5 }}>{t.note}</span>
        )}
      </button>
    )
  })

  if (compact) {
    return (
      <div className="w-full flex flex-col" style={{ gap: 8 }}>
        <div className="flex overflow-x-auto no-bar" style={{ gap: 6 }}>{tabs}</div>
        <div className="flex items-center overflow-x-auto no-bar" style={{ gap: 6 }}>
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
        SEVEN TABS · ONE 6s LIGHT
      </div>
      <div className="flex flex-col overflow-y-auto no-bar min-h-0" style={{ gap: 5 }}>{tabs}</div>

      <div className="rounded-[14px] shrink-0"
           style={{ padding: 12, background: 'rgba(255,255,255,.04)', outline: '1px solid rgba(255,255,255,.07)', outlineOffset: -1 }}>
        <div className="flex" style={{ gap: 5 }}>
          <Toggle on={anim} onClick={onAnim} labelOn="Animating" labelOff="Held still" tint="#43D6A0" />
          <Toggle on={slow} onClick={onSlow} labelOn="Half speed" labelOff="Full speed" tint="#9AC7FF" />
        </div>
        <div className="flex" style={{ gap: 5, marginTop: 6 }}>
          <Plain onClick={onReplay}>Replay from frame one</Plain>
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
        <p className="font-id" style={{ color: '#6C6679', fontSize: 11.5, lineHeight: '17px', margin: '11px 0 0' }}>
          The band crosses from 1.2s to 3s, then nothing until 6s. The stars run on their own 2.9s clocks, offset so they never blink together.
        </p>
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
