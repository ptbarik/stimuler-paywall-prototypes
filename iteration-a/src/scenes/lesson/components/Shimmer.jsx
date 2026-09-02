/**
 * A narrow diagonal light band travelling across the CTA, once.
 *
 * It is a **masked gradient sweep**, not an opacity blink: the band is a
 * 105-degree linear gradient laid on a background 250% the width of the
 * element, and `backgroundPosition` is what moves. The element's own
 * `overflow: hidden` and radius are the mask, so the band is clipped to the
 * button's shape and cannot spill past it.
 *
 * `progress` is a 0-1 ramp off the clock rather than a Motion transition. Two
 * reasons: scrubbing to any ms then shows the band where it should be instead
 * of restarting the sweep, and it is back at its start at the loop point by
 * construction, with nothing left in flight to reset.
 */
export default function Shimmer({ progress, radius, reduced }) {
  if (reduced || progress <= 0 || progress >= 1) return null
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        borderRadius: radius,
        backgroundImage:
          'linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.55) 50%, transparent 58%)',
        backgroundSize: '250% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `${160 - 220 * progress}% 0%`,
      }}
    />
  )
}
