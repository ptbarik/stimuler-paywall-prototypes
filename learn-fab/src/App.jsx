import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Frame, { FRAME } from './components/Frame.jsx'
import Switcher from './Switcher.jsx'
import { FABS, byId } from './fabs/index.js'
import { useOfferClock } from './useOfferClock.js'

/**
 * The stand the frame sits on.
 *
 * ── fitting ───────────────────────────────────────────────────────
 *
 * 412 × 844 cannot reflow, and the whole point of this prototype is a button
 * pinned 14 above the nav — a frame you have to scroll the *browser* to see
 * the bottom of hides the one thing being judged. So the frame is fitted to
 * whatever is left after the header and the rail, measured off the DOM rather
 * than assumed, and both axes are checked with the smaller winning.
 *
 * The fit is applied with `zoom`, never `transform: scale()`. A transform does
 * not change layout: the frame would keep reserving its full 844, the page
 * would scroll anyway, and — worse here — the pinned FAB and the roadmap's
 * own scroll container would end up computing against the unscaled box.
 */

const RAIL = 300
const GUTTER = 34
const SIDE = 26
const STACK_AT = 900          // below this the rail goes above the frame, laid out flat

export default function App() {
  const [id, setId] = useState(() => {
    const q = (new URLSearchParams(location.search).get('fab') || '').toUpperCase()
    return FABS.some((f) => f.id === q) ? q : 'A1'
  })
  const [stop, setStop] = useState('full')
  const [earned, setEarned] = useState(false)
  const [run, setRun] = useState(0)
  const [scrolling, setScrolling] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [compact, setCompact] = useState(false)

  const headRef = useRef(null)
  const railRef = useRef(null)
  const scrollRef = useRef(null)
  const idleRef = useRef(0)

  const clock = useOfferClock(stop)
  const current = byId(id)

  /* N1 is the only variant that reads the scroller, but the flag is derived
     here rather than inside it: "still scrolling" is a property of the frame,
     and a variant should not have to own a timer to find out. */
  const onScroll = useCallback(() => {
    setScrolling(true)
    clearTimeout(idleRef.current)
    idleRef.current = setTimeout(() => setScrolling(false), 220)
  }, [])
  useEffect(() => () => clearTimeout(idleRef.current), [])

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

  /* N3 is absent until a lesson lands, which means picking it shows an empty
     slot and nothing else. So the prototype lands one for you a beat after you
     select it — you see the entrance the variant is *about* — and the button
     below stays there to replay it or take it away again. */
  useEffect(() => {
    if (id !== 'N3') return
    setEarned(false)
    const t = setTimeout(() => setEarned(true), 900)
    return () => clearTimeout(t)
  }, [id, run])

  const panel = (
    <Switcher
      current={current}
      onPick={pick}
      stop={stop} onStop={setStop}
      earned={earned} onEarned={() => setEarned((e) => !e)}
      onReplay={() => setRun((r) => r + 1)}
      compact={compact}
    />
  )

  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col items-center"
         style={{ background: 'radial-gradient(120% 80% at 50% 0%,#151320 0%,#0B0A10 55%,#08070C 100%)', paddingInline: SIDE }}>

      <header ref={headRef} className="w-full shrink-0 flex flex-col items-center" style={{ paddingTop: 16, paddingBottom: 12 }}>
        <h1 className="font-id text-white text-center" style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: '-.015em' }}>
          Stimuler · Learn — eleven floating actions, one slot
        </h1>
        <p className="font-id text-center" style={{ color: '#6C6679', fontSize: 12, marginTop: 5 }}>
          390 × 96, 14 above the nav · pick one {compact ? 'above' : 'on the right'}
        </p>
      </header>

      {compact && <div ref={railRef} className="w-full shrink-0" style={{ marginBottom: 14 }}>{panel}</div>}

      <main className="flex items-start justify-center w-full min-h-0" style={{ gap: GUTTER }}>
        <div style={{ width: FRAME.w * zoom, height: FRAME.h * zoom, flexShrink: 0 }}>
          <div style={{ zoom }}>
            <Frame fab={current} run={run} clock={clock} earned={earned}
                   scrolling={scrolling} scrollRef={scrollRef} onScroll={onScroll} />
          </div>
        </div>
        {!compact && <div className="min-h-0 shrink-0" style={{ height: FRAME.h * zoom, width: 300 }}>{panel}</div>}
      </main>
    </div>
  )
}
