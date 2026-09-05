import { useState } from 'react'
import { FLOWS, T, WINDOW_LABELS } from '../design'
import { PANELS, LOOP, STEP } from '../carousel.timing'
import { BEAT_MARKS } from '../screens/CrownInterstitial'
import * as offer from '../offer'

/**
 * Prototype controls.
 *
 * Built first, and the reason is the third group down: **the expired state.**
 * Without a way to reach it, verifying that the offer really does end means
 * waiting a day, which means in practice it is verified once, badly, at the
 * end. `Set time remaining` rewinds `offerWindowStartedAt` — the same single
 * timestamp the page reads — so what it produces is not a simulation of the
 * expired state, it *is* the expired state.
 *
 * Everything here drives the same values the flow drives. Nothing is a
 * separate code path built to be demonstrated.
 */
/** Which moment of the interstitial the clock is currently sitting in. */
function beatAt(ms) {
  let name = BEAT_MARKS[0][0]
  for (const [label, at] of BEAT_MARKS) if (ms >= at) name = label
  return name
}

export default function DevPanel(p) {
  const [hidden, setHidden] = useState(false)
  if (hidden) {
    return (
      <button
        className="panel"
        style={{ top: 12, bottom: 'auto', width: 'auto', cursor: 'pointer' }}
        onClick={() => setHidden(false)}
      >
        controls
      </button>
    )
  }

  const left = offer.remaining()
  const [h, m, s] = offer.fields(left)
  const slide = Math.floor((((p.carouselT % LOOP) + LOOP) % LOOP) / STEP)

  return (
    <div className="panel">
      <div className="r" style={{ justifyContent: 'space-between' }}>
        <h3>Prototype controls</h3>
        <button onClick={() => setHidden(true)}>×</button>
      </div>

      {/* ── the three flows ───────────────────────────────────────
          Each button writes the same two pieces of state the app writes for
          itself and then gets out of the way. None of them is a mode: from any
          of these starting positions the app behaves exactly as it would have
          if the user had arrived there on their own. */}
      <p className="lbl">Flows</p>
      {FLOWS.map((f) => (
        <button
          key={f.id}
          className={`flow${p.flow === f.id ? ' on' : ''}`}
          onClick={() => p.startFlow(f.id)}
        >
          <b>{f.who}</b>
          <span>{f.label}</span>
          <i>{f.note}</i>
        </button>
      ))}

      <p className="lbl">Screen</p>
      <div className="r">
        <button
          className={p.phase === p.PHASES.home ? 'on' : ''}
          onClick={() => {
            p.setPhase(p.PHASES.home)
            p.setSheetOpen(false)
          }}
        >
          Roadmap
        </button>
        <button className={p.phase === p.PHASES.intro ? 'on' : ''} onClick={p.openPremium}>
          Premium tap
        </button>
        <button
          className={p.phase === p.PHASES.paywall ? 'on' : ''}
          onClick={() => p.setPhase(p.PHASES.paywall)}
        >
          Paywall
        </button>
      </div>
      <div className="r">
        <button onClick={() => p.setSheetOpen(true)}>Show sheet</button>
        <button onClick={p.sweepCrown} disabled={p.phase !== p.PHASES.home}>
          Sweep the crown
        </button>
      </div>

      {/* ── the offer window ─────────────────────────────────────── */}
      <p className="lbl">Offer window</p>
      <div className="ro">
        <span>
          startedAt <b>{p.started ? new Date(p.started).toLocaleTimeString() : '—'}</b>
        </span>
        <span>
          remaining <b style={{ fontVariantNumeric: 'tabular-nums' }}>{`${h}:${m}:${s}`}</b>
        </span>
        <span>
          offerActive <b>{String(p.active)}</b>
        </span>
        <span>
          hasSeenIntro <b>{String(offer.hasSeenIntro())}</b>
        </span>
      </div>
      <div className="r">
        {WINDOW_LABELS.map(([label, ms]) => (
          <button
            key={label}
            onClick={() => {
              offer.devSetRemaining(ms)
              p.bump()
              p.replayStrike()
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="r">
        <button
          onClick={() => {
            offer.devResetIntro()
            p.bump()
          }}
        >
          Reset hasSeenIntro
        </button>
      </div>
      <div className="r">
        <button
          onClick={() => {
            offer.devResetWindow()
            offer.devResetIntro()
            p.bump()
            p.setPhase(p.PHASES.home)
          }}
        >
          Reset the whole first visit
        </button>
      </div>

      {/* ── the interstitial ─────────────────────────────────────── */}
      <p className="lbl">Interstitial · {T.total}ms</p>
      <div className="r">
        <button onClick={() => p.setPlaying(!p.playing)}>{p.playing ? '❚❚' : '▶'}</button>
        {[0.1, 0.25, 0.5, 1].map((x) => (
          <button key={x} className={p.speed === x ? 'on' : ''} onClick={() => p.setSpeed(x)}>
            {x}×
          </button>
        ))}
      </div>
      <input
        type="range"
        min={0}
        max={T.total}
        value={Math.min(T.total, Math.round(p.introMs))}
        onChange={(e) => {
          p.setPlaying(false)
          p.setPhase(p.PHASES.intro)
          p.setIntroMs(Number(e.target.value))
        }}
      />
      <div className="ro">
        <span>
          intro ms <b style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.round(p.introMs)}</b>
        </span>
        <span>
          beat <b>{beatAt(p.introMs)}</b>
        </span>
      </div>
      {/* jump straight to a moment rather than hunting for it on the scrubber */}
      <div className="r">
        {BEAT_MARKS.map(([label, at], i) => (
          <button
            key={`${label}-${i}`}
            onClick={() => {
              p.setPlaying(false)
              p.setPhase(p.PHASES.intro)
              p.setIntroMs(at + 1)
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── the carousel ─────────────────────────────────────────── */}
      <p className="lbl">Feature carousel · {LOOP}ms</p>
      <div className="r">
        {PANELS.map((name, i) => (
          <button
            key={name}
            className={slide === i ? 'on' : ''}
            onClick={() => {
              p.setHeroOn(true)
              p.setCarouselT(i * STEP + 1)
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <input
        type="range"
        min={0}
        max={LOOP}
        value={Math.round(p.carouselT)}
        onChange={(e) => {
          p.setPlaying(false)
          p.setHeroOn(true)
          p.setCarouselT(Number(e.target.value))
        }}
      />
      <div className="r">
        <button className={p.heroOn ? 'on' : ''} onClick={() => p.setHeroOn(!p.heroOn)}>
          Hero running
        </button>
        <button className={p.spare ? 'on' : ''} onClick={() => p.setSpare(!p.spare)}>
          Spare caption
        </button>
      </div>
      <p className="note">
        The hero is held at the Sarah call until the price strike finishes, so the price is read
        first. “Spare caption” swaps the export's odd fourth caption — “Know what to practice
        next” — onto the lesson slide.
      </p>

      {/* ── the price strike ─────────────────────────────────────── */}
      <p className="lbl">Price</p>
      <div className="r">
        <button onClick={p.replayStrike}>Replay the strike</button>
      </div>

      <p className="lbl">Motion</p>
      <div className="r">
        <button className={p.reduced ? 'on' : ''} onClick={() => p.setReduced(!p.reduced)}>
          prefers-reduced-motion
        </button>
      </div>
    </div>
  )
}
