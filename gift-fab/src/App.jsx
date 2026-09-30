import { useLayoutEffect, useRef, useState } from 'react'
import Frame, { FRAME } from './components/Frame.jsx'
import Switcher from './Switcher.jsx'
import { FABS, byId } from './fabs/index.jsx'
import { useOfferClock } from './useOfferClock.js'

/**
 * The stand the frame sits on.
 *
 * Same fitting rule as the rest of these prototypes: 412 × 844 cannot reflow,
 * and the thing being judged is pinned 14 above the nav, so the frame is
 * measured against whatever is left after the header and the rail and scaled
 * with `zoom` — never `transform: scale()`, which does not change layout and
 * would leave the page scrolling and the pinned slot computing against the
 * unscaled box.
 */

const RAIL = 300
const GUTTER = 34
const SIDE = 26
const STACK_AT = 900

export default function App() {
  const [id, setId] = useState(() => {
    const q = new URLSearchParams(location.search).get('fab') || ''
    return FABS.some((f) => f.id === q) ? q : '1'
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
  const current = byId(id)

  useLayoutEffect(() => {
    const fit = () => {
      const stacked = window.innerWidth < STACK_AT
      setCompact(stacked)
      const headH = headRef.current?.offsetHeight ?? 96
      const railH = stacked ? (railRef.current?.offsetHeight ?? 0) + 14 : 0
      const availH = window.innerHeight - headH - railH - 22
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
    history.replaceState(null, '', `?fab=${next}`)
  }

  const panel = (
    <Switcher
      current={current} onPick={pick}
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

      <header ref={headRef} className="w-full shrink-0 flex flex-col items-center" style={{ paddingTop: 16, paddingBottom: 12 }}>
        <h1 className="font-id text-white text-center" style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: '-.015em' }}>
          Stimuler · Learn — the gift, animated
        </h1>
        <p className="font-id text-center" style={{ color: '#6C6679', fontSize: 12, marginTop: 5 }}>
          eight designs, one 4.2s loop · pick one {compact ? 'above' : 'on the right'}
        </p>
      </header>

      {compact && <div ref={railRef} className="w-full shrink-0" style={{ marginBottom: 14 }}>{panel}</div>}

      <main className="flex items-start justify-center w-full min-h-0" style={{ gap: GUTTER }}>
        <div style={{ width: FRAME.w * zoom, height: FRAME.h * zoom, flexShrink: 0 }}>
          {/* the whole frame slows together, so the rattle, the ribbons and
              the highlight keep their relationship at either speed */}
          <div style={{ zoom, ...(slow ? { animationDuration: '8.4s' } : null) }}
               className={slow ? 'half-speed' : undefined}>
            <Frame fab={current} clock={clock} anim={anim} run={run} />
          </div>
        </div>
        {!compact && <div className="min-h-0 shrink-0" style={{ height: FRAME.h * zoom, width: RAIL }}>{panel}</div>}
      </main>
    </div>
  )
}
