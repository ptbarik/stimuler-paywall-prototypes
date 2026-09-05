import { useCallback, useEffect, useRef, useState } from 'react'
import { SLIDES, SPARE_CAPTION } from './copy'
import { HERO_POSTER, T } from './design'
import { LOOP } from './carousel.timing'
import * as offer from './offer'
import * as offerBoot from './offer'
import Roadmap from './screens/Roadmap'
import CrownInterstitial from './screens/CrownInterstitial'
import Paywall from './screens/Paywall'
import PriceCTA, { STRIKE_MS } from './components/PriceCTA'
import DevPanel from './components/DevPanel'

/**
 * Stimuler · the Premium tab flow.
 *
 * Roadmap → crown interstitial → paywall, with a real 24-hour offer window
 * that genuinely expires.
 *
 * ── The routing, which is three lines and one rule ────────────────
 *
 * ```
 * offer.start()                    // opens the window, once, ever
 * if (!offer.hasSeenIntro()) → interstitial, then paywall
 * else                       → paywall
 * ```
 *
 * The interstitial plays **once, ever**. Every visit after the first goes
 * straight to the paywall — a 4.2s title sequence is a delight the first time
 * and an obstacle the fourth, and the thing it introduces has already been
 * introduced.
 *
 * ── One clock, three consumers ────────────────────────────────────
 *
 * A single rAF loop drives both the interstitial's 4200ms and the carousel's
 * 21160ms loop. Nothing anywhere is scheduled with `setTimeout` or chained off
 * an animation-end event, because every animated thing on these screens is a
 * pure function of its own `ms` — which is what lets the dev panel's scrubber
 * show exactly the frame playback would, at any speed, in either direction.
 *
 * The one exception is the price strike, which runs on its own clock from the
 * moment the paywall mounts. It has to: it is anchored to *arrival*, not to a
 * position in a loop, and it plays once.
 */

const PHASES = { home: 'home', intro: 'intro', paywall: 'paywall' }

/**
 * Deep links, for review and for screenshots.
 *
 * `?screen=intro&t=2400` opens on that frame, frozen. `?scroll=1200` opens the
 * paywall at a page offset. `?remaining=0` sets the window before first paint,
 * so the expired paywall can be linked to rather than described. `?bare` drops
 * the panel.
 *
 * These write through the same functions the flow uses — `?remaining` calls
 * `devSetRemaining`, which moves `offerWindowStartedAt` — so a link cannot
 * produce a state the app cannot reach on its own.
 */
const Q = typeof location === 'undefined' ? new URLSearchParams() : new URLSearchParams(location.search)
const Q_SCREEN = Q.get('screen')
const Q_T = Q.has('t') ? Number(Q.get('t')) : null
const Q_CT = Q.has('ct') ? Number(Q.get('ct')) : null
const Q_SCROLL = Q.has('scroll') ? Number(Q.get('scroll')) : null
const Q_BARE = Q.has('bare')
const Q_SHEET = Q.has('sheet')
const Q_STRIKE = Q.has('strike') ? Number(Q.get('strike')) : null
const Q_FLOW = Q.get('flow')

if (Q.has('remaining')) {
  const v = Number(Q.get('remaining'))
  if (v <= 0) {
    offerBoot.devSetRemaining(0)
  } else {
    offerBoot.devSetRemaining(v)
  }
  offerBoot.markIntroSeen()
}
if (Q.has('fresh')) {
  offerBoot.devResetWindow()
  offerBoot.devResetIntro()
}

/**
 * `?flow=tab | sheet | new` — the three flows, set up before first paint.
 *
 * The two seasoned flows are the same user reached two ways, so both are
 * staged identically: the window already open (23h left, as if opened
 * yesterday) and the interstitial already spent. They differ only in what is on
 * screen when you arrive. The new user gets nothing set at all, which is what
 * makes the tap that follows a genuine first one.
 */
if (Q_FLOW === 'tab' || Q_FLOW === 'sheet') {
  offerBoot.devSetRemaining(23 * 3600e3)
  offerBoot.markIntroSeen()
} else if (Q_FLOW === 'new') {
  offerBoot.devResetWindow()
  offerBoot.devResetIntro()
}
/* a link that lands past the Premium tap has to open the window the tap would
   have opened — otherwise the paywall it links to renders its expired state
   for the wrong reason */
if (Q_SCREEN === 'intro' || Q_SCREEN === 'paywall') offerBoot.start()

export default function App() {
  const [phase, setPhase] = useState(PHASES[Q_SCREEN] ?? PHASES.home)
  const [sheetOpen, setSheetOpen] = useState(Q_SHEET || Q_FLOW === 'sheet')
  const [flow, setFlow] = useState(Q_FLOW ?? null)
  const [sweepNow, setSweepNow] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [spare, setSpare] = useState(false)

  /* the two clocks the panel can drive */
  const [introMs, setIntroMs] = useState(Q_T ?? 0)
  const [carouselT, setCarouselT] = useState(Q_CT ?? HERO_POSTER)
  const [playing, setPlaying] = useState(Q_T === null && Q_CT === null)
  const [speed, setSpeed] = useState(1)

  /* offer state, mirrored into React so the panel's writes re-render */
  const [version, bump] = useReducerVersion()
  const active = offer.offerActive()
  const started = offer.startedAt()

  const [strikeRun, setStrikeRun] = useState(0)

  /**
   * The hero waits for the price.
   *
   * On landing, the page runs the price strike first and holds the feature
   * carousel at its first frame; the hero starts only once the strike has
   * settled. The order is the argument: **what it costs, then why it is worth
   * it.** Running both at once splits the attention of the one moment the page
   * has to make its case, and the animation always wins that fight — it moves
   * more, and it is at the top of the screen.
   *
   * With no live offer there is no strike to wait for, so the wait is just long
   * enough to let the page settle before something starts moving on it.
   */
  const [heroOn, setHeroOn] = useState(Q_CT !== null)

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(q.matches)
    sync()
    q.addEventListener('change', sync)
    return () => q.removeEventListener('change', sync)
  }, [])

  /* ── the clock ─────────────────────────────────────────────────── */
  const last = useRef(null)
  useEffect(() => {
    if (!playing) {
      last.current = null
      return
    }
    let raf
    const tick = (now) => {
      if (last.current === null) last.current = now
      const dt = (now - last.current) * speed
      last.current = now
      // the carousel's clock only runs once the price has had its moment
      if (heroOn) setCarouselT((p) => (p + dt) % LOOP)
      setIntroMs((p) => p + dt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, speed, heroOn])

  /**
   * Arriving at the paywall: park the carousel on its poster frame and hold it
   * there until the strike is done.
   *
   * **Parked, not blanked.** The hero holds `HERO_POSTER` — 620ms into the
   * Sarah call, which is the still `7.png` draws in this slot — so the top of
   * the page is the design's own frame, fully present and simply not moving,
   * rather than an empty rectangle waiting its turn.
   *
   * **Parked, not rewound to zero.** The carousel is a loop, so without this
   * the hero would resume wherever it happened to be — for someone landing on
   * the paywall, a quarter of the way into the report scene with no idea what
   * it is. And frame 0 of the call is empty, which is the problem this exists
   * to solve. Releasing the clock continues *from* the poster.
   */
  useEffect(() => {
    if (phase !== PHASES.paywall || Q_CT !== null) return
    setHeroOn(false)
    setCarouselT(HERO_POSTER)
    const wait = active ? STRIKE_MS + 260 : 700
    const id = setTimeout(() => setHeroOn(true), wait)
    return () => clearTimeout(id)
  }, [phase, strikeRun, active])

  /* the interstitial hands over on its own, at the end of its timeline */
  useEffect(() => {
    if (Q_T !== null) return // frozen by a deep link — do not advance past it
    if (phase === PHASES.intro && introMs >= T.total) toPaywall()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, introMs])

  /* ── the Premium tap ───────────────────────────────────────────── */
  const openPremium = useCallback(() => {
    setSheetOpen(false)
    // the window starts HERE, and only the first time this ever runs
    offer.start()
    bump()
    if (offer.hasSeenIntro()) {
      setPhase(PHASES.paywall)
      setStrikeRun((n) => n + 1)
    } else {
      setIntroMs(0)
      setPhase(PHASES.intro)
    }
  }, [bump])

  /**
   * Stage one of the three flows and drop the user at its start.
   *
   * Every flow is set up by writing the *same* two pieces of state the app
   * writes for itself — the offer timestamp and `hasSeenIntro` — so none of
   * these is a mode. They are starting positions, and from any of them the app
   * behaves exactly as it would have if the user had arrived there on their
   * own.
   */
  const startFlow = useCallback(
    (id) => {
      if (id === 'new') {
        offer.devResetWindow()
        offer.devResetIntro()
      } else {
        // opened yesterday, so the countdown reads like a real returning user's
        offer.devSetRemaining(23 * 3600e3)
        offer.markIntroSeen()
      }
      setFlow(id)
      setSheetOpen(id === 'sheet')
      setPhase(PHASES.home)
      setIntroMs(0)
      bump()
    },
    [bump],
  )

  const toPaywall = useCallback(() => {
    offer.markIntroSeen()
    bump()
    setPhase(PHASES.paywall)
    setStrikeRun((n) => n + 1)
  }, [bump])

  /* ── fit ───────────────────────────────────────────────────────── */
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    // the panel is 250 wide and pinned right; the frame is fitted to what is
    // left of the window, unless `?bare` has taken the panel away
    const fit = () =>
      setZoom(
        Math.min(
          1,
          (window.innerWidth - (Q_BARE ? 0 : 290)) / 412,
          (window.innerHeight - (Q_BARE ? 0 : 24)) / 917,
        ),
      )
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const captions = spare ? SLIDES.map((s, i) => (i === 1 ? SPARE_CAPTION : s)) : SLIDES

  return (
    <>
      <div style={{ zoom }}>
        <div className="frame" data-v={version}>
          {phase === PHASES.home && (
            <Roadmap
              onPremium={openPremium}
              sheetOpen={sheetOpen}
              onOpenSheet={() => setSheetOpen(true)}
              onCloseSheet={() => setSheetOpen(false)}
              reduced={reduced}
              /* flow (a) is the one whose subject is the crown catching your
                 eye, so its first sweep does not make you wait four seconds */
              eagerSweep={flow === 'tab'}
              sweepNow={sweepNow}
            />
          )}

          {/* ── the handover ──────────────────────────────────────────
              The interstitial and the paywall are drawn on the same three
              blurred ellipses. During the intro that glow is rendered here,
              underneath the fall; on the paywall it is rendered inside the
              page, because it has to scroll away with it.

              Across the last 500ms the two crossfade on exact complements —
              and because they are the *same image at the same offset* (the
              paywall opens at scrollTop 0), crossfading one into the other
              leaves the light unchanged. Nothing about it moves, brightens or
              dips. That is the whole trick: the user's eye is holding onto the
              one element on screen that does not know a screen changed. */}
          {phase === PHASES.intro && (
            <div className="glows" style={{ zIndex: 0, opacity: bloom(introMs) * (1 - fadeUp(introMs)) }}>
              <i className="g1" />
              <i className="g2" />
              <i className="g3" />
            </div>
          )}

          {(phase === PHASES.intro || phase === PHASES.paywall) && (
            <>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 5,
                  opacity: phase === PHASES.paywall ? 1 : fadeUp(introMs),
                  pointerEvents: phase === PHASES.paywall ? 'auto' : 'none',
                }}
              >
                <Paywall
                  t={carouselT}
                  reduced={reduced}
                  captions={captions}
                  scrollTo={Q_SCROLL}
                  sheet={
                    <PriceCTA active={active} replay={strikeRun} reduced={reduced} frozen={Q_STRIKE} />
                  }
                />
              </div>
            </>
          )}

          {phase === PHASES.intro && (
            <CrownInterstitial ms={introMs} onSkip={toPaywall} reduced={reduced} />
          )}

          <div className="status">
            <span className="time">9:41</span>
            <img className="ic sig" src="/assets/signal.svg" alt="" />
            <img className="ic wifi" src="/assets/wifi.svg" alt="" />
            <img className="ic bat" src="/assets/bat-outline.svg" alt="" />
            <img className="ic batf" src="/assets/bat-fill.svg" alt="" />
            <img className="ic bate" src="/assets/bat-end.svg" alt="" />
          </div>
        </div>
      </div>

      {!Q_BARE && (
      <DevPanel
        {...{
          phase,
          setPhase,
          PHASES,
          introMs,
          setIntroMs,
          carouselT,
          setCarouselT,
          heroOn,
          setHeroOn,
          playing,
          setPlaying,
          speed,
          setSpeed,
          reduced,
          setReduced,
          started,
          active,
          bump,
          openPremium,
          flow,
          startFlow,
          sweepCrown: () => setSweepNow((n) => n + 1),
          replayStrike: () => setStrikeRun((n) => n + 1),
          spare,
          setSpare,
          setSheetOpen,
        }}
      />
      )}
    </>
  )
}

/**
 * The bloom.
 *
 * The glow comes up over the first 400ms — *during* the emission, not before
 * it. It is the light the crowns are falling through, so it has to arrive with
 * them; lighting the frame first and then dropping things into it makes the
 * glow a backdrop that was already there, which is a different and much duller
 * idea.
 */
function bloom(ms) {
  const [a, b] = T.glow
  return ms <= a ? 0 : ms >= b ? 1 : (ms - a) / (b - a)
}

/** The paywall fading up through the glow across the intro's last 500ms. */
function fadeUp(ms) {
  const [a, b] = T.out
  if (ms <= a) return 0
  if (ms >= b) return 1
  return (ms - a) / (b - a)
}

/** A counter that forces a re-read of `localStorage` after the panel writes. */
function useReducerVersion() {
  const [v, setV] = useState(0)
  return [v, useCallback(() => setV((n) => n + 1), [])]
}
