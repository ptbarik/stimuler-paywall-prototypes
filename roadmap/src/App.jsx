import { useCallback, useEffect, useRef, useState } from 'react'
import { Benefits, Faq, Social, Table, TierToggle } from './Sections'
import { Cross, ShieldCheck } from './Icons'
import { CTA_LABEL, HEAD, HERO, PAGE_H, PLANS, TRUST_LINE } from './design'
import LessonSequence from './scenes/lesson/LessonSequence'
import { DURATION } from './scenes/lesson/timeline'

/**
 * Stimuler · the roadmap paywall.
 *
 * Figma `11032:8142` (Pro) and `11032:8409` (Pro+) are the same 412×2558 page
 * in two palettes, so this is one component with a tier switch rather than two
 * screens — the toggle in the header is the whole prototype's point, and every
 * colour below it is a CSS variable that re-themes in 250ms.
 *
 * The hero runs `02-ai-tutors` live in the export's own 370×330 slot. That
 * animation was composed to exactly 370×330 months earlier, in its own project,
 * so it drops in at native size and its built-in "Learn with 12+ AI tutors"
 * caption lands within a third of a pixel of where the export draws the same
 * words. `src/scenes/lesson` is that project's source, vendored unedited.
 */
export default function App() {
  const [tier, setTier] = useState('pro') // the design's default; the toggle is the upsell
  const [plan, setPlan] = useState('yearly')
  const [ms, setMs] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [faqExtra, setFaqExtra] = useState(0)
  const [showPanel, setShowPanel] = useState(true)

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(q.matches)
    sync()
    q.addEventListener('change', sync)
    return () => q.removeEventListener('change', sync)
  }, [])

  /**
   * One rAF clock, wrapping at the scene's own DURATION.
   *
   * Nothing is scheduled with `setTimeout` or chained off an animation-end
   * event: the scene is a pure function of `ms`, which is what lets the
   * scrubber below show exactly the frame playback would.
   */
  const last = useRef(null)
  useEffect(() => {
    if (!playing) {
      last.current = null
      return
    }
    let raf
    const tick = (now) => {
      if (last.current === null) last.current = now
      const dt = now - last.current
      last.current = now
      setMs((prev) => (prev + dt) % DURATION)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  /* ── fit ────────────────────────────────────────────────────────────
     412×917 cannot reflow, so the frame is zoomed to the window. `zoom`, never
     `transform:scale()`: a scaled frame keeps its untransformed layout box, so
     the pinned sheet and the scroll container land in the wrong place at every
     window that isn't exactly 917 tall — which is nearly all of them. */
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    const fit = () => setZoom(Math.min(1, window.innerWidth / 412, window.innerHeight / 917))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  /**
   * The page is exactly the export's height with every FAQ row shut, and grows
   * by however much opening one adds — measured against the *first* height the
   * block reports rather than a constant, so it lands on `PAGE_H` regardless of
   * how the FAQ copy happens to wrap at a given font size.
   */
  const faqBase = useRef(null)
  const onFaqResize = useCallback((h) => {
    if (faqBase.current === null) faqBase.current = h
    setFaqExtra(Math.max(0, h - faqBase.current))
  }, [])

  /* The page is the export's full 2558. The sheet is pinned over the bottom
     242 of the *viewport*, and the export leaves the bottom 242 of the page
     empty for exactly that — so at full scroll the last FAQ row clears it
     instead of sitting behind it. */
  const pageH = PAGE_H + faqExtra

  return (
    <>
      <div style={{ zoom }}>
        <div className="frame" data-tier={tier}>
          <div className="scroll">
            <div className="page" style={{ height: pageH }}>
              <div className="glows">
                <i className="g1" />
                <i className="g2" />
                <i className="g3" />
              </div>

              <button className="close tint" aria-label="Close">
                <Cross />
              </button>

              <TierToggle tier={tier} setTier={setTier} />

              <h1 className="head">
                {HEAD[0]}
                <em>{HEAD[1]}</em>
              </h1>

              <div
                className="hero"
                style={{ left: HERO.x, top: HERO.y, width: HERO.w, height: HERO.h }}
              >
                <LessonSequence ms={ms} reduced={reduced} />
              </div>

              <Benefits tier={tier} />
              <Table tier={tier} />
              <Social />
              <Faq onResize={onFaqResize} />
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

          {/* ── the pinned sheet ────────────────────────────────────────
              Reassurance, the two plans, the CTA. The plan cards are the one
              place the *selection* is a second piece of state — it changes the
              ring, not the theme, so it rides the 180ms fade rather than the
              tier's 250ms. */}
          <span className="halo" />

          <div className="sheet tint s5">
            <p className="trust">
              <ShieldCheck />
              {TRUST_LINE}
            </p>

            {PLANS.map((p) => (
              <button
                key={p.id}
                className={`plan ${p.id === 'yearly' ? 'a' : 'b'}${plan === p.id ? ' sel' : ''}`}
                onClick={() => setPlan(p.id)}
              >
                <span className="flat" />
                <span className="rim tint s5" />
                <span className="hd">
                  <span className="nm">{p.name[tier]}</span>
                  {p.badge && <span className="off tint s5">{p.badge}</span>}
                </span>
                <span className="pr">{p.price}</span>
              </button>
            ))}

            <button className="cta">{CTA_LABEL[tier]}</button>
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
            <input
              type="range"
              min={0}
              max={DURATION}
              value={Math.round(ms)}
              onChange={(e) => {
                setPlaying(false)
                setMs(Number(e.target.value))
              }}
            />
            <span style={{ width: 46, fontVariantNumeric: 'tabular-nums' }}>{Math.round(ms)}</span>
          </div>
        </div>
      )}
    </>
  )
}
