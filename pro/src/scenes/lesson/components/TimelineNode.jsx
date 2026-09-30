import { C, NODE, lerp } from '../timeline'
import Glyph from './Glyph'

/**
 * A roadmap node.
 *
 * **The opaque `#161616` disc is always there.** That is exactly how the
 * export stacks it — gold rail, then an opaque dark circle, then the idle dot
 * or the translucent gold ring on top, then the numeral. Crossfading the dark
 * disc away with the idle state is what let the gold rail read through the
 * ring's 34% fill and swallow the number; keeping it means the rail is behind
 * a solid disc and the numeral always sits clear of it.
 *
 * Only the *dot* and the *ring* crossfade, so the flip is still one dissolve.
 */
export default function TimelineNode({ node, active }) {
  const size = (NODE.r + NODE.sw / 2) * 2
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: node.cx - size / 2, top: node.cy - size / 2, width: size, height: size }}
    >
      {/* always opaque, always underneath — this is what hides the rail */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: '50%',
          background: C.nodeDisc,
          border: `${NODE.sw}px solid ${C.nodeIdleStroke}`,
        }}
      />
      {/* not reached yet */}
      <div
        className="absolute"
        style={{
          left: size / 2 - NODE.dotR,
          top: size / 2 - NODE.dotR,
          width: NODE.dotR * 2,
          height: NODE.dotR * 2,
          borderRadius: '50%',
          background: C.nodeIdleDot,
          opacity: 1 - active,
          transform: `scale(${lerp(1, 0.4, active)})`,
        }}
      />
      {/* reached */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: '50%',
          background: C.accentSoft,
          border: `${NODE.sw}px solid ${C.accent}`,
          opacity: active,
          transform: `scale(${lerp(0.7, 1, active)})`,
        }}
      />
      <Glyph
        name={`num${node.n}`}
        x={size / 2 + node.dx}
        y={size / 2 + node.dy}
        fill="#fff"
        style={{ opacity: active }}
      />
    </div>
  )
}
