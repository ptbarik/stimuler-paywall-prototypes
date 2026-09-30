import { C, GAUGE, arcFraction, arcPath, clamp01, lerp } from '../timeline'

/**
 * The gauge: bezel, dome, track, fill arc and the specular head.
 *
 * The arc is generated from the export's own measured geometry — centre
 * (185.61, 133.02), r 80.63 — rather than reusing its path, because the fill
 * has to start at the **3.0 end** and sweep clockwise, and the exported path
 * runs the other way. Generating it means `stroke-dashoffset` fills from the
 * right end without any negative-offset trickery.
 *
 * The **specular tip travels**: it is a second dashed stroke whose visible
 * window is positioned from the same `progress` the fill uses, so it sits on
 * the leading edge at every value including through the overshoot.
 */
export default function Gauge({ progress, glow, framed }) {
  const span = GAUGE.to - GAUGE.from
  const d = arcPath(GAUGE.cx, GAUGE.cy, GAUGE.r, GAUGE.from, GAUGE.to)
  // `progress` is the shared value in score units; the dial is graduated
  // 3.0-9.0, so it has to be mapped onto the arc rather than used directly.
  const p = arcFraction(progress)

  // the head sits just behind the leading edge, and shortens as it arrives
  const tipLen = Math.min(GAUGE.tipSpan, p)
  const tipStart = Math.max(0, p - tipLen)

  return (
    <svg
      className="pointer-events-none absolute top-0 left-0"
      width={370}
      height={330}
      viewBox="0 0 370 330"
      fill="none"
      overflow="visible"
    >
      <defs>
        <linearGradient id="bezel" x1="186.062" y1="-40.9507" x2="195.717" y2="254.78" gradientUnits="userSpaceOnUse">
          <stop offset="0.00285944" stopColor={C.bezel} />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="track" x1="60.7536" y1="-43.3108" x2="357.243" y2="247.765" gradientUnits="userSpaceOnUse">
          <stop stopColor={C.track} />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <filter id="arcGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="bezelShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="3.83" stdDeviation="6.38" floodColor="#111019" floodOpacity="1" />
        </filter>
      </defs>

      {/* bezel and dome, the export's own paths.
          The dome is flat `#0A0911`: the export fills it with a gradient whose
          last two stops share offset 1 (`#0A0911` and `#4141EB`), so in a
          browser everything past the gradient vector pads to blue and a large
          triangle lands across the gauge. That is an export artefact, not the
          design — see the README. */}
      <g opacity={framed} filter="url(#bezelShadow)">
        <path d={GAUGE.bezel} fill="url(#bezel)" />
      </g>
      <path d={GAUGE.dome} fill={C.dome} opacity={framed} />

      {/* the empty track */}
      <path
        d={d}
        stroke="url(#track)"
        strokeWidth={GAUGE.sw}
        strokeLinecap="butt"
        fill="none"
        opacity={framed}
        pathLength={1}
      />

      {/* the teal glow behind the fill, reading the same progress.
          Gated at zero: a round linecap on a zero-length dash still paints a
          dot at the path's start, so an un-swept gauge would sit there with a
          teal pip on it. */}
      {p > 0.002 && (
      <path
        d={d}
        stroke={C.arc}
        strokeWidth={GAUGE.sw * 1.5}
        strokeLinecap="butt"
        fill="none"
        pathLength={1}
        strokeDasharray={`${p} 1`}
        opacity={glow}
        filter="url(#arcGlow)"
      />
      )}

      {/* the fill */}
      {p > 0.002 && (
      <path
        d={d}
        stroke={C.arc}
        strokeWidth={GAUGE.sw}
        strokeLinecap="butt"
        fill="none"
        pathLength={1}
        strokeDasharray={`${p} 1`}
      />
      )}

      {/* the specular head, travelling on the leading edge */}
      {p > 0.001 && (
        <path
          d={d}
          stroke={C.arcTip}
          strokeWidth={GAUGE.sw}
          strokeLinecap="butt"
          fill="none"
          pathLength={1}
          strokeDasharray={`0 ${tipStart} ${tipLen} 1`}
          opacity={lerp(0, 1, clamp01(p / 0.06))}
        />
      )}
      {/* `span` is kept in scope for the tick placement to read off */}
      <desc>{span}</desc>
    </svg>
  )
}
