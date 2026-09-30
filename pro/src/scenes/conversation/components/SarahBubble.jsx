import { C, SARAH } from '../timeline'
import IconRow from './IconRow'
import sarah from '../assets/sarah.png'

/**
 * Sarah's avatar, bubble and icon row.
 *
 * The bubble's **top-left corner is square** and the other three are rounded —
 * that is the export's own shape, and the user's bubble is its mirror. The
 * avatar's image box comes from the pattern transform, not from the rect: it
 * is 1.566× the rect's width and hangs off the left edge.
 */
export default function SarahBubble({ dy }) {
  const b = SARAH.box
  return (
    <div className="pointer-events-none absolute inset-0" style={{ transform: `translateY(${dy}px)` }}>
      <img
        src={sarah}
        alt=""
        className="absolute max-w-none"
        style={{
          left: SARAH.avatar.imgX,
          top: SARAH.avatar.y,
          width: SARAH.avatar.imgW,
          height: SARAH.avatar.h,
        }}
      />

      <div
        className="absolute"
        style={{
          left: b.x,
          top: b.y,
          width: b.w,
          height: b.h,
          background: C.surface,
          border: `0.706023px solid ${C.surfaceStroke}`,
          borderRadius: `0 ${b.r}px ${b.r}px ${b.r}px`,
        }}
      />

      <div
        className="absolute whitespace-pre"
        style={{
          left: SARAH.text.x,
          top: SARAH.text.y,
          width: SARAH.text.w + 8,
          color: C.text,
          fontSize: SARAH.text.fs,
          lineHeight: SARAH.text.lh,
        }}
      >
        {SARAH.lines.map((l, i) => (
          <span key={i} className="block">
            {l}
          </span>
        ))}
      </div>

      <IconRow icons={SARAH.icons} />
    </div>
  )
}
