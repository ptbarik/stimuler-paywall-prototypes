import { useCallback, useEffect, useRef, useState } from 'react'
import Hero from './Hero'
import { Faq, Sheet, Social, Table } from './Sections'
import { CTA_LABEL, PAGE_H, PLANS } from './design'
import { LOOP, PANELS, STEP, indexAt, mod } from './timing'

/**
 * Stimuler Pro / Pro+ — the paywall from `Paywall Design.svg`, with the four
 * feature animations running in the hero slot the design left for them.
 *
 * The page is the export's own 412×2483, absolutely positioned at its measured
 * coordinates, inside a 412×917 viewport with the CTA pinned to the bottom.
 * The tier toggle re-themes the whole page — indigo ⇄ gold — on the 250ms
 * ease-out / 40ms stagger recipe in `index.css`.
 */
/**
 * The sub-line's separator is set two points smaller than the words either side
 * of it (Figma: 12px / 10px / 12px), so the bullet reads as a divider rather
 * than a character. Plans whose label carries no bullet pass straight through.
 */
function subLine(text) {
  const i = text.indexOf('\u2022')
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <span className="dot">{'\u2022'}</span>
      {text.slice(i + 1)}
    </>
  )
}

export default function App() {
  const [tier, setTierRaw] = useState('pro')  // the design's default: Pro, and the toggle is the upsell
  const [touched, setTouched] = useState(false)

  /** Any deliberate tier change retires the hint and cancels the auto-switch. */
  const setTier = useCallback((t) => { setTouched(true); setTierRaw(t) }, [])

  /**
   * If the toggle is never touched, the page shows Pro+ on its own after 20s.
   *
   * The paywall opens on Pro, so a user who never toggles never sees the tier
   * the page exists to sell. The gold breathing under the Pro+ label is the
   * quiet ask; this is the fallback for when it goes unread. It fires once,
   * and only while the user has not touched the toggle themselves — being
   * moved off a tier you just chose is the one thing this must never do.
   */
  useEffect(() => {
    if (touched) return
    const id = setTimeout(() => setTierRaw('plus'), 20000)
    return () => clearTimeout(id)
  }, [touched])
  const [plan, setPlan] = useState('yearly')
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [faqH, setFaqH] = useState(217)       // the collapsed height in the export
  const [showPanel, setShowPanel] = useState(true)

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

  /* ── fit ────────────────────────────────────────────────────────────
     412×917 cannot reflow, so the frame is zoomed to the window. `zoom`, never
     `transform:scale()`: a scaled frame keeps its untransformed layout box, so
     the pinned CTA and the scroll container land in the wrong place at every
     window that isn't exactly 917 tall — which is nearly all of them. */
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    const fit = () => setZoom(Math.min(1, window.innerWidth / 412, window.innerHeight / 917))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
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

  const pageH = Math.max(PAGE_H, 2110 + faqH + 156)
  const cta = PLANS.find((p) => p.id === plan)

  return (
    <>
      <div style={{ zoom }}>
        <div className="frame" data-tier={tier} data-hinted={touched ? 'off' : 'on'}>
          <div className="scroll">
            <div className="page" style={{ height: pageH }}>
              <div className="glows"><i className="g1" /><i className="g2" /><i className="g3" /></div>

              <button className="close tint" aria-label="Close">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
                  <path d="M1 1l9 9M10 1l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>

              <div onPointerDown={onDown} onPointerUp={onUp} style={{ touchAction: 'pan-y' }}>
                <Hero t={t} tier={tier} reduced={reduced} />
              </div>

              <div className="dots">
                {PANELS.map((name, j) => (
                  <b
                    key={name}
                    className={j === index ? 'on' : ''}
                    style={{ width: j === index ? 23 : 9, cursor: 'pointer', pointerEvents: 'auto' }}
                    onClick={() => goto(j)}
                  />
                ))}
              </div>

              <Sheet tier={tier} setTier={setTier} plan={plan} setPlan={setPlan} />
              <Table tier={tier} />
              <Social />
              <Faq onResize={setFaqH} />
            </div>
          </div>

          <div className="status">
            <span className="time">9:41</span>
            <img className="ic sig" src="/assets/signal.svg" alt="" />
            <img className="ic wifi" src="/assets/wifi.svg" alt="" />
            <img className="ic bat" src="/assets/bat-outline.svg" alt="" />
            <img className="ic batf" src="/assets/bat-fill.svg" alt="" />
            <img className="ic bate" src="/assets/bat-end.svg" alt="" />
          </div>

          <div className="ctabar">
            <div className="veil s5">
              <i /><i /><i /><i /><i /><i /><i />
            </div>
            <button className="cta s5">
              <span className="l1">{CTA_LABEL[tier]}</span>
              <span className="l2">{subLine(cta.ctaSub[tier])}</span>
            </button>
            <div className="home" />
          </div>
        </div>
      </div>

      {showPanel && (
        <div className="panel">
          <div className="r">
            <button className={tier === 'pro' ? 'on' : ''} onClick={() => setTier('pro')}>Pro</button>
            <button className={tier === 'plus' ? 'on' : ''} onClick={() => setTier('plus')}>Pro+</button>
            <button onClick={() => setPlaying(!playing)}>{playing ? '❚❚' : '▶'}</button>
            <button onClick={() => setReduced(!reduced)} className={reduced ? 'on' : ''}>rm</button>
            <button onClick={() => setShowPanel(false)}>×</button>
          </div>
          <div className="r">
            <input type="range" min={0} max={LOOP} value={t} onChange={(e) => { setPlaying(false); setT(+e.target.value) }} />
            <span style={{ width: 82, fontVariantNumeric: 'tabular-nums' }}>
              {PANELS[index]} {Math.round(mod(t, STEP))}
            </span>
          </div>
        </div>
      )}
    </>
  )
}
