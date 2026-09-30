import { useCallback, useEffect, useRef, useState } from 'react'
import Hero from './Hero'
import { Benefits, Faq, Learners, Proof, Sheet } from './Sections'
import { DOTS, PAGE_H } from './design'
import { TITLE } from './copy'
import { LOOP, PANELS, STEP, indexAt, mod } from './timing'

/**
 * Stimuler PRO — the Indian first paywall, from the Figma node `PRO`
 * (12176-6027), with the four feature animations running in the 370×330 slot
 * the design leaves bare.
 *
 * The page is the export's own 412×2598, absolutely positioned at its measured
 * coordinates, inside a 412×915 viewport with the status bar and the price
 * sheet pinned over it. Two blocks are not the export's:
 *
 * - **the hero**, which is the finished carousel from the Pro/Pro+ prototypes,
 *   dropped into the rect the design left for it at native size;
 * - **Premium Benefits**, whose five icons and five lines come from the Paper
 *   frame, because the Figma node ships that block as five identical
 *   placeholder rows.
 */
export default function App() {
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [plan, setPlan] = useState('yearly')
  const [faqExtra, setFaqExtra] = useState(0)

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(q.matches)
    sync()
    q.addEventListener('change', sync)
    return () => q.removeEventListener('change', sync)
  }, [])

  /** One rAF clock for the hero, wrapping at LOOP. */
  const last = useRef(null)
  useEffect(() => {
    if (!playing) { last.current = null; return }
    let raf
    const tick = (now) => {
      if (last.current === null) last.current = now
      const dt = now - last.current
      last.current = now
      setT((prev) => mod(prev + dt, LOOP))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  /* ── fit ──────────────────────────────────────────────────────────
     412×915 cannot reflow, so the frame is zoomed to the window. `zoom`,
     never `transform:scale()`: a scaled frame keeps its untransformed layout
     box, so the pinned sheet and the scroll container land in the wrong place
     at every window that isn't exactly 915 tall — which is nearly all. */
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    const fit = () => setZoom(Math.min(1, window.innerWidth / 452, (window.innerHeight - 70) / 915))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  /**
   * `?y=1200` opens the page already scrolled there.
   *
   * The page is 2598 tall inside a 915 viewport, so reviewing a block below
   * the fold otherwise means describing where to scroll to. Read once, on
   * mount, and never written back — the scroller stays the user's.
   */
  const scroller = useRef(null)
  useEffect(() => {
    const y = Number(new URLSearchParams(window.location.search).get('y'))
    if (y > 0 && scroller.current) scroller.current.scrollTop = y
  }, [])

  /** The FAQ's collapsed height, captured the first time it reports one. */
  const faqBase = useRef(null)
  const onFaqResize = useCallback((h) => {
    if (faqBase.current === null) faqBase.current = h
    setFaqExtra(Math.max(0, h - faqBase.current))
  }, [])

  /** Jumping a slide is just moving the clock — the hero stays a function of t. */
  const goto = useCallback((j) => setT(mod(j * STEP, LOOP)), [])
  const index = indexAt(t)

  // swipe the hero
  const drag = useRef(null)
  const onDown = (e) => { drag.current = { x: e.clientX, i: index } }
  const onUp = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    if (Math.abs(dx) > 36) goto(mod(drag.current.i + (dx < 0 ? 1 : -1), PANELS.length))
    drag.current = null
  }

  return (
    <div className="stage">
      <div style={{ zoom }}>
        <div className="frame">
          <div className="scroll" ref={scroller}>
            <div className="page" style={{ height: PAGE_H + faqExtra }}>
              <div className="glows"><i className="g1" /><i className="g2" /><i className="g3" /></div>

              <button className="close" aria-label="Close">
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none" aria-hidden>
                  <path d="M.5.5l5 5M5.5.5l-5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
              </button>

              <div className="head">
                <div className="brand">
                  <span className="word">Stimuler</span>
                  <span className="pill"><span>PRO</span></span>
                </div>

                <h1 className="htitle">{TITLE}</h1>

                <div className="heroslot" onPointerDown={onDown} onPointerUp={onUp}>
                  <Hero t={t} reduced={reduced} />
                  <div className="dots">
                    {PANELS.map((name, j) => (
                      <b
                        key={name}
                        className={j === index ? 'on' : ''}
                        style={{ width: j === index ? DOTS.on : DOTS.off }}
                        onClick={() => goto(j)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <Proof />
              <Benefits />
              <Learners />
              <Faq onResize={onFaqResize} />
            </div>
          </div>

          <div className="status">
            <span className="time">9:41</span>
            <img className="sig" src="/assets/signal.svg" alt="" />
            <img className="wifi" src="/assets/wifi.svg" alt="" />
            <img className="bat" src="/assets/bat-outline.svg" alt="" />
          </div>

          <Sheet plan={plan} setPlan={setPlan} />
        </div>
      </div>

      <div className="rail">
        <button onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</button>
        <input
          type="range" min={0} max={LOOP} step={1} value={Math.round(t)}
          onChange={(e) => { setPlaying(false); setT(Number(e.target.value)) }}
        />
        <span>{PANELS[index]}</span>
        <button onClick={() => setReduced((r) => !r)}>{reduced ? 'Motion: reduced' : 'Motion: full'}</button>
      </div>
    </div>
  )
}
