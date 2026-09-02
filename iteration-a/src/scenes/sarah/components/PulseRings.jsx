import { RIPPLE, T, ringGeomAt } from '../timeline'

/**
 * The rings, as a ripple.
 *
 * This used to be three fixed circles breathing in unison with a bright glow
 * crest travelling through them. It pulled the eye away from the call itself,
 * so it is now the quieter thing it should always have been: a ripple that is
 * born at the inner radius, spreads outward and **fades out as it goes**. No
 * ring ever holds full strength, nothing snaps, and the whole stack sits at
 * roughly half the weight it had before.
 *
 * Everything is derived from `ms`, not scheduled:
 *
 *  · `RIPPLE.emit` (1250ms) divides the 5000ms loop exactly, so the emission
 *    phase either side of the wrap is identical and the seam is invisible;
 *  · `life = emit × count` keeps exactly three ripples in flight, and since
 *    each travels one `span` per emission they land on the export's three
 *    radii every time the phase comes round — the still frames still match;
 *  · the centre and base radius come from `ringGeomAt(ms)`, a pure keyframe
 *    interpolation, so any given ms always renders the same. That matters:
 *    the radius has to be a plain number here, and a spring would make the
 *    scrubber lie.
 */
export default function PulseRings({ ms, reduced }) {
  const g = ringGeomAt(ms)

  // Louder while dialling, quieter once connected — eased across the connect
  // window rather than switched, so nothing steps.
  const k = clamp01((ms - T.connect) / T.connectDur)
  const peak = lerp(RIPPLE.peakCalling, RIPPLE.peakIdle, smooth(k))

  const ripples = []
  for (let i = 0; i < RIPPLE.count; i++) {
    // Reduced motion: hold the three ripples on the export's radii.
    const p = reduced ? i / RIPPLE.count : ((ms % RIPPLE.emit) + i * RIPPLE.emit) / RIPPLE.life

    const r = g.r0 + g.span * RIPPLE.count * p
    const fadeIn = smooth(clamp01(p / RIPPLE.fadeIn))
    const fadeOut = 1 - smooth(clamp01((p - RIPPLE.fadeFrom) / (1 - RIPPLE.fadeFrom)))
    const opacity = peak * fadeIn * fadeOut

    ripples.push({ r, opacity, sw: g.sw * (1 - RIPPLE.strokeDecay * p) })
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg viewBox="0 0 370 330" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="ringStroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#8C8C8C" />
          </linearGradient>
          <filter id="ringHalo" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={RIPPLE.haloBlur} />
          </filter>
        </defs>

        {/* a soft blurred copy under the crisp ring — without it a 0.4px
            stroke at this opacity reads as a hairline artefact */}
        <g filter="url(#ringHalo)">
          {ripples.map((d, i) => (
            <circle
              key={`halo-${i}`}
              cx={g.rcx}
              cy={g.rcy}
              r={d.r}
              fill="none"
              stroke="#CFCFCF"
              strokeWidth={d.sw * 2.4}
              opacity={d.opacity * RIPPLE.halo}
            />
          ))}
        </g>

        {ripples.map((d, i) => (
          <circle
            key={i}
            cx={g.rcx}
            cy={g.rcy}
            r={d.r}
            fill="none"
            stroke="url(#ringStroke)"
            strokeWidth={d.sw}
            opacity={d.opacity}
          />
        ))}
      </svg>
    </div>
  )
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (t) => t * t * (3 - 2 * t)
