import { C, EASE, GAUGE, T, TICKS, TICK_TYPE, clamp01, lerp } from '../timeline'

/**
 * The seven tick labels.
 *
 * They are staggered **along the arc's travel direction** — `3.0` first, `9.0`
 * last — so they read as being laid down ahead of the sweep rather than
 * appearing as a set. Fade plus a 3px outward radial drift from the gauge
 * centre; no scale.
 */
export default function TickLabels({ ms, reduced }) {
  return (
    <>
      {TICKS.map((t, i) => {
        const k = reduced ? 1 : EASE.tick(clamp01((ms - (T.ticksFrom + i * T.tickStagger)) / T.tickDur))
        // outward along the radius from the gauge centre
        const cxTick = t.x + t.w / 2
        const cyTick = t.y + TICK_TYPE.inkH / 2
        const dx = cxTick - GAUGE.cx
        const dy = cyTick - GAUGE.cy
        const len = Math.hypot(dx, dy) || 1
        const drift = lerp(-3, 0, k)
        return (
          <span
            key={t.label}
            className="pointer-events-none absolute whitespace-nowrap"
            style={{
              left: t.x,
              top: t.y + TICK_TYPE.inkH / 2,
              transform: `translate(${(dx / len) * -drift}px, calc(-50% + ${(dy / len) * -drift}px))`,
              color: C.tick,
              fontSize: TICK_TYPE.fs,
              opacity: k,
            }}
          >
            {t.label}
          </span>
        )
      })}
    </>
  )
}
