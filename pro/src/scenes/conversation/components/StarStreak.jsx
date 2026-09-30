import { C, STREAK, clamp01, lerp } from '../timeline'
import GoldStar from './GoldStar'

/**
 * The three-star streak.
 *
 * **The outline stays under the fill.** The export draws both — the `#444444`
 * ring is still there beneath every earned star, which is what gives the gold
 * one its edge. Fading the outline out as the star fills loses that.
 *
 * A star fills because a particle arrived, not on a timer of its own, and its
 * pop is a spring the caller passes through — `fill` can exceed 1, which is
 * the overshoot.
 */
export default function StarStreak({ fills, glow }) {
  const [, , bw, bh] = STREAK.pathBox
  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="absolute top-0 left-0"
        width={370}
        height={330}
        viewBox="0 0 370 330"
        fill="none"
        overflow="visible"
      >
        {STREAK.centres.map((c, i) => (
          <path
            key={i}
            d={STREAK.path}
            transform={`translate(${c.x - STREAK.centres[0].x} 0)`}
            stroke={C.starIdle}
            strokeWidth={STREAK.sw}
            strokeLinejoin="round"
          />
        ))}
      </svg>

      {STREAK.centres.map((c, i) => {
        const f = clamp01(fills[i])
        const pop = Math.max(0, fills[i])
        const w = bw * lerp(0.4, 1, pop)
        return (
          <div key={i} style={{ opacity: f }}>
            {/* a slight warm bloom, brightening as the third lands — the
                export has barely any, so this stays low on purpose */}
            <div
              className="pointer-events-none absolute"
              style={{
                left: c.x - 11,
                top: c.y - 11,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#FFC342',
                filter: 'blur(5px)',
                opacity: 0.05 + 0.07 * glow,
              }}
            />
            <GoldStar x={c.x - w / 2} y={c.y - (w * (bh / bw)) / 2} w={w} />
          </div>
        )
      })}
    </div>
  )
}
