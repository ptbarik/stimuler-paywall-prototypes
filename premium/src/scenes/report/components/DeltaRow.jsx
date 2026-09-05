import { C, DELTA, EASE, T, clamp01, lerp, ramp } from '../timeline'

/**
 * The delta row.
 *
 * This is negative feedback, so it is deliberately **restrained** — no bounce,
 * no overshoot, no scale-in anywhere in here. The arrow draws along its own
 * axis from its top-left, the text fades up 6px, and the `See why?` rule draws
 * with `scaleX` from the left only after the text has settled.
 *
 * The whole row is lifted by `DELTA.dy` so it sits evenly between the gauge
 * and the cards — see the note on that constant. It is applied here, once, so
 * the coordinates in `timeline.js` stay the export's own.
 */
export default function DeltaRow({ ms, reduced }) {
  const arrow = reduced ? 1 : ramp(ms, T.arrow, T.arrowDur, EASE.out)
  const text = reduced ? 1 : ramp(ms, T.deltaText, T.deltaTextDur, EASE.out)
  const rule = reduced ? 1 : clamp01((ms - T.seeWhy) / T.seeWhyDur)

  return (
    <>
      <svg
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: DELTA.arrow.x,
          top: DELTA.arrow.y + DELTA.dy,
          transformOrigin: '0 0',
          transform: `scale(${arrow})`,
        }}
        width={DELTA.arrow.w}
        height={DELTA.arrow.h}
        viewBox={`${DELTA.arrow.x} ${DELTA.arrow.y} ${DELTA.arrow.w} ${DELTA.arrow.h}`}
        fill="none"
      >
        <path d={DELTA.arrow.d} fill={C.redArrow} />
      </svg>

      <Line run={DELTA.pct} color={C.redArrow} k={text} />
      <Line run={DELTA.rest} color={C.red} k={text} />
      <Line run={DELTA.seeWhy} color={C.seeWhy} k={text} />

      <span
        className="pointer-events-none absolute"
        style={{
          left: DELTA.rule.x,
          top: DELTA.rule.y + DELTA.dy,
          width: DELTA.rule.w,
          height: Math.max(0.6, DELTA.rule.h),
          background: C.seeWhy,
          transformOrigin: 'left',
          transform: `scaleX(${rule})`,
        }}
      />
    </>
  )
}

function Line({ run, color, k }) {
  return (
    <span
      className="pointer-events-none absolute whitespace-nowrap"
      style={{
        left: run.x,
        top: run.y + run.h / 2 + DELTA.dy,
        transform: `translateY(calc(-50% + ${lerp(6, 0, k)}px))`,
        color,
        fontSize: run.fs,
        opacity: k,
      }}
    >
      {run.text}
    </span>
  )
}
