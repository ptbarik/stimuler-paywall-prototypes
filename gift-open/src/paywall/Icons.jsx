/**
 * The page's glyphs, drawn rather than exported.
 *
 * The Figma export flattens every icon into a heap of `Vector` divs with no
 * path data, so there is nothing to lift. These are redrawn on a 24-grid to
 * the shapes in the PNG: `currentColor` throughout so the feature rows can
 * tint them by tier without a second copy.
 */

const S = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const Lessons = (p) => (
  <svg {...S} {...p}>
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H10l-4 3.5V16h-.5A1.5 1.5 0 0 1 4 14.5Z" />
    <path d="M8.5 8.5h7M8.5 11.5h4" />
  </svg>
)

export const Chat = (p) => (
  <svg {...S} {...p}>
    <circle cx="9.5" cy="8" r="3" />
    <path d="M4 19c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5" />
    <path d="M16.5 6.5a4.5 4.5 0 0 1 0 7" />
    <path d="M19 4a8 8 0 0 1 0 12" />
  </svg>
)

export const Reps = (p) => (
  <svg {...S} {...p}>
    <path d="M12 20a8 8 0 1 1 8-8" />
    <path d="M12 12l4.2-3.2" />
    <path d="M20 12h-2.2" />
    <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

export const Cancel = (p) => (
  <svg {...S} {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M3.5 9.5h17M8 3.5V6.5M16 3.5V6.5" />
    <path d="M9.5 14.5l1.8 1.8 3.4-3.6" />
  </svg>
)

export const ICONS = { lessons: Lessons, chat: Chat, reps: Reps, cancel: Cancel }

export const Chevron = ({ open, ...p }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}
       style={{ transition: 'transform .28s cubic-bezier(.2,.7,.2,1)', transform: `rotate(${open ? 180 : 0}deg)`, ...(p.style || {}) }}>
    <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Close = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)

export const Shield = (p) => (
  <svg width="13" height="15" viewBox="0 0 24 26" fill="none" {...p}>
    <path d="M12 1.5 21 5v7.5c0 5.4-3.7 9.7-9 11.5-5.3-1.8-9-6.1-9-11.5V5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M8 12.6l2.8 2.8L16.4 9.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** The rating row's five. `fill` is a colour or a gradient `url(#…)`. */
export const Star = ({ size = 13, fill = 'currentColor', ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} {...p}>
    <path d="M12 1.8l3.1 6.5 7 .9-5.1 4.9 1.3 7-6.3-3.4-6.3 3.4 1.3-7L2 9.2l7-.9Z" />
  </svg>
)

/** A single laurel branch. Mirrored with `scaleX(-1)` for the other side. */
export const Laurel = ({ h = 62, color = '#FFBE4D', flip = false, ...p }) => (
  <svg width={h * 0.52} height={h} viewBox="0 0 32 60" fill="none"
       style={{ transform: flip ? 'scaleX(-1)' : undefined }} {...p}>
    <path d="M26 3C13 10 6 22 6 36c0 8 2.6 15 7 21" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const t = i / 5
      const x = 26 - 20 * Math.pow(t, 0.85)
      const y = 5 + 46 * t
      return (
        <ellipse key={i} cx={x} cy={y} rx={7 - i * 0.35} ry={3.1}
                 fill={color} transform={`rotate(${-52 + i * 9} ${x} ${y})`} />
      )
    })}
  </svg>
)

/** The four-point sparkle V2 scatters around the badge. */
export const Sparkle = ({ size = 10, color = '#fff', ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...p}>
    <path d="M12 0c.7 6.6 4.7 10.6 12 12-7.3 1.4-11.3 5.4-12 12-.7-6.6-4.7-10.6-12-12C7.3 10.6 11.3 6.6 12 0Z" />
  </svg>
)
