import { C, SCORE } from '../timeline'

/**
 * The score readout inside the dome.
 *
 * The number reads the **shared progress value** — it is never animated on its
 * own — and is rounded to an integer, so it visibly ticks past the target and
 * back as the spring settles.
 *
 * `tabular-nums` is not optional: without it the digits change width mid-count
 * and the whole number wobbles as it climbs.
 */
export default function ScoreCounter({ score, labelIn, valueIn }) {
  return (
    <>
      <span
        className="pointer-events-none absolute whitespace-nowrap"
        style={{
          left: SCORE.label.x,
          top: SCORE.label.y + SCORE.label.h / 2,
          transform: 'translateY(-50%)',
          color: C.score,
          fontSize: SCORE.label.fs,
          opacity: labelIn,
        }}
      >
        {SCORE.label.text}
      </span>
      <span
        className="pointer-events-none absolute whitespace-nowrap"
        style={{
          left: SCORE.value.x,
          top: SCORE.value.y + SCORE.value.h / 2,
          transform: 'translateY(-50%)',
          color: C.score,
          fontSize: SCORE.value.fs,
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1',
          opacity: valueIn,
        }}
      >
        {Math.round(score)}%
      </span>
    </>
  )
}
