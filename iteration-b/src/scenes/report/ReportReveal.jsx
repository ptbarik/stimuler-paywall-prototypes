import { C, CARD, CARDS, REDUCED_FADE, SCORE, T, arcFraction, clamp01, ramp } from './timeline'
import { progressAt, scoreAt } from './useProgress'
import Gauge from './components/Gauge'
import TickLabels from './components/TickLabels'
import ScoreCounter from './components/ScoreCounter'
import DeltaRow from './components/DeltaRow'
import StatCard from './components/StatCard'

/**
 * The report reveal. One 5000ms looping pass in the export's own 370×330
 * frame.
 *
 * **The frame is transparent** — no fill of its own — so the reveal can be
 * composited over whatever sits behind it. `C.bg` keeps the export's card
 * colour for reference and for the dev panel's solid preview.
 *
 * Four structural rules, all four visible here:
 *
 * 1. **One progress value** drives the arc, the specular tip, the counter and
 *    the glow — `progressAt(ms)`, a pure function of the clock. Not three
 *    animations of equal duration hoping to stay together.
 *
 * 2. **Every counting number is `tabular-nums`**, so digits keep their width
 *    and nothing wobbles mid-count.
 *
 * 3. **Each card's outline lights behind it and stays.** The box arrives, its
 *    outline draws itself around the perimeter a beat later, and it holds —
 *    so the row reads card by card rather than as three boxes plus a tour.
 *
 * 4. **Nothing unmounts.** Every element is mounted from frame 0 and animates
 *    from opacity 0 in place.
 */
export default function ReportReveal({ ms, reduced, target = SCORE.target }) {
  const p = progressAt(ms, target, reduced)
  const score = scoreAt(ms, target, reduced)

  const framed = reduced ? 1 : ramp(ms, T.bezelIn, T.bezelInDur)
  const labelIn = reduced ? 1 : ramp(ms, T.scoreLabel, T.scoreLabelDur)
  // the number arrives with its label — there is no reading of this report in
  // which a bare 0% should sit in the dome before the sweep starts
  const valueIn = reduced ? 1 : ramp(ms, T.scoreLabel, T.scoreLabelDur)
  // the glow reads the same progress the arc does, through the same mapping
  const glow = reduced ? 0.35 : (arcFraction(p) / (arcFraction(target / 100) || 1)) * 0.35

  // reduced motion: the finished state, with one fade over the top.
  // Playing: a short fade before the wrap, so the loop restarts on black
  // rather than cutting from a finished report back to an empty gauge.
  const fade = reduced ? ramp(ms, 0, REDUCED_FADE) : 1 - ramp(ms, T.fadeOut, T.fadeOutDur)

  return (
    <div
      data-scene="report"
      className="relative overflow-hidden"
      style={{
        width: CARD.w,
        height: CARD.h,
        borderRadius: CARD.r,
        fontFamily: 'var(--font-card)',
        opacity: fade,
      }}
    >
      <Gauge progress={p} glow={clamp01(glow)} framed={framed} />
      <TickLabels ms={ms} reduced={reduced} />
      <ScoreCounter score={score} labelIn={labelIn} valueIn={valueIn} />
      <DeltaRow ms={ms} reduced={reduced} />

      {CARDS.map((card, i) => (
        <StatCard key={card.key} card={card} index={i} ms={ms} reduced={reduced} />
      ))}
    </div>
  )
}
