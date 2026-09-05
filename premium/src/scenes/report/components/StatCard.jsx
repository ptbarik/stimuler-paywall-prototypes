import { C, CARD_STROKE_W, EASE, SPRING, T, clamp01, easeInOut, lerp, mmss, ramp, spring } from '../timeline'

/**
 * One stat card.
 *
 * **The box comes up, and its outline lights immediately behind it and stays.**
 * The outline is an SVG rounded rect with `pathLength` normalised to 1, so a
 * single `stroke-dashoffset` runs the stroke around the perimeter from the top
 * edge — eased in and out, so it starts gently, travels, and arrives gently.
 *
 * It starts `T.outlineDelay` after the box rather than with it, which is what
 * makes it read as a consequence of the box arriving rather than as part of
 * the box. And it **stays lit** — it does not cool back to the near-invisible
 * `#25222C` and it is not toured by a separate highlight afterwards, so the
 * beat reads card by card: box, outline, next box.
 *
 * Its number starts counting as the card itself enters, and `4:53` is animated
 * as **293 seconds** and formatted by `mmss` on render — the string is never
 * interpolated. Every counting number is `tabular-nums`.
 */
export default function StatCard({ card, index, ms, reduced }) {
  const at = T.cards + index * T.cardStagger
  const enter = reduced ? 1 : clamp01(spring(ms - at, SPRING.card))
  // the outline follows the box, and holds at 1 once closed
  const draw = reduced ? 1 : easeInOut(clamp01((ms - at - T.outlineDelay) / T.outlineDur))
  const count = reduced ? 1 : ramp(ms, at, T.countDur, EASE.out)
  const shown = card.seconds ? mmss(card.value * count) : Math.round(card.value * count)

  const b = card.box
  // The resting stroke is #25222C on a #282828 card — all but invisible, so
  // the line is drawn in the arc's teal and left there. The draw *is* the
  // highlight; there is no second lit border chasing it later.
  const stroke = mixHex(C.cardStroke, C.arc, draw)

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: b.x,
        top: b.y,
        width: b.w,
        height: b.h,
        borderRadius: b.r,
        background: C.surface,
        boxShadow: draw > 0.001 ? `0 0 12px 1px rgba(30,130,130,${0.14 * draw})` : 'none',
        opacity: enter,
        transform: `translateY(${lerp(10, 0, enter)}px) scale(${lerp(0.96, 1, enter)})`,
        transformOrigin: '50% 50%',
      }}
    >
      {/* the outline, drawing itself around the box */}
      <svg
        aria-hidden
        className="absolute top-0 left-0 overflow-visible"
        width={b.w}
        height={b.h}
        viewBox={`0 0 ${b.w} ${b.h}`}
        fill="none"
      >
        <rect
          x={CARD_STROKE_W / 2}
          y={CARD_STROKE_W / 2}
          width={b.w - CARD_STROKE_W}
          height={b.h - CARD_STROKE_W}
          rx={b.r - CARD_STROKE_W / 2}
          stroke={stroke}
          strokeWidth={CARD_STROKE_W + draw * 0.5}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
          strokeLinecap="round"
        />
      </svg>

      <span
        className="absolute whitespace-nowrap"
        style={{
          left: 0,
          width: b.w,
          top: card.number.y - b.y + card.number.h / 2,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          color: C.cardNumber,
          fontSize: card.number.fs,
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1',
        }}
      >
        {shown}
      </span>

      <span
        className="absolute block"
        style={{
          left: 0,
          width: b.w,
          top: card.label.y - b.y,
          textAlign: 'center',
          color: C.textMuted,
          fontSize: card.label.fs,
          lineHeight: card.label.lh,
        }}
      >
        {card.lines.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </span>
    </div>
  )
}

/** Blend two hex colours — the outline runs from its resting hairline to teal. */
function mixHex(a, b, k) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], clamp01(k)))).join(',')})`
}
