import { EASE, STREAK, clamp01, lerp } from '../timeline'
import GoldStar from './GoldStar'

/**
 * One star particle, on a two-phase path.
 *
 * Phase 1 is a short outward scatter away from the bubble. Phase 2 is the
 * flight to its streak star — and the two axes are eased **differently**
 * (`flyX` 0.22/1/0.36/1 against `flyY` 0.34/1.2/0.64/1, over different
 * fractions of the same window). Mismatching them is the entire reason the
 * path bends: matched easings would draw a straight line.
 *
 * Everything is a pure function of `ms`, which is also what makes the
 * freeze-for-inspection control possible — a particle mid-flight can be held
 * at an exact time rather than caught wherever a running animation happened
 * to be.
 */
export default function StarParticle({ p, ms, t0 }) {
  const scatterK = clamp01((ms - t0) / 150)
  const sx = p.from.x + p.scatter.x * EASE.enter(scatterK)
  const sy = p.from.y + p.scatter.y * EASE.enter(scatterK)

  const start = t0 + 150 + p.delay
  const k = clamp01((ms - start) / p.dur)
  if (k <= 0 && ms < start) {
    // still scattering
    return <Star x={sx} y={sy} size={p.size} rot={p.rot * scatterK} opacity={clamp01(scatterK * 3)} />
  }

  const target = p.to === null ? bendTarget(p, sx, sy) : STREAK.centres[p.to]
  const x = lerp(sx, target.x, EASE.flyX(k))
  const y = lerp(sy, target.y, EASE.flyY(k))

  // the ones that do not land thin out partway, so the field reads dense at
  // the start and precise at the end
  const alive = p.to === null ? 1 - clamp01((k - p.fadeAt) / (1 - p.fadeAt)) : 1
  // absorbed: the last 15% of the flight is the star being taken in
  const absorbed = p.to === null ? 1 : 1 - clamp01((k - 0.85) / 0.15)

  return (
    <Star
      x={x}
      y={y}
      size={p.size * lerp(1, 0.55, k)}
      rot={p.rot + k * 180 * p.bend}
      opacity={alive * absorbed}
    />
  )
}

/** Particles that never land still travel somewhere — a shortened, splayed
 *  version of the same journey, so they read as part of one burst. */
function bendTarget(p, sx, sy) {
  const c = STREAK.centres[1]
  return { x: lerp(sx, c.x, 0.75) + p.scatter.x * 1.6, y: lerp(sy, c.y, 0.75) }
}

function Star({ x, y, size, rot, opacity }) {
  const [, , bw, bh] = STREAK.pathBox
  return (
    <GoldStar
      x={x - size / 2}
      y={y - (size * (bh / bw)) / 2}
      w={size}
      role="particle"
      style={{ transform: `rotate(${rot}deg)`, opacity: clamp01(opacity) }}
    />
  )
}
