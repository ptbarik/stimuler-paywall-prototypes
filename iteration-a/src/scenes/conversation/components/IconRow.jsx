import { C } from '../timeline'
import { GLYPH } from '../glyphs'
import Icon, { ExportGlyph } from './Icons'

/**
 * A row of circular icon buttons under a bubble.
 *
 * Sarah's are filled `#323034` with a `#575757` hairline; the user's are
 * transparent with a white 38% hairline, except the retry button, which
 * carries the export's gold gradient ring and is the one the glow lands on.
 *
 * Both the buttons and their glyphs are placed at the export's own card
 * coordinates and then shifted by `offset` — so a row nested inside a scaled
 * layer still puts every glyph exactly where the export measured it, at the
 * export's own size and fill.
 */
export default function IconRow({ icons, user, opacity = 1, offset = { x: 0, y: 0 } }) {
  return (
    <>
      {icons.map((ic) => (
        <div key={ic.glyph} className="pointer-events-none absolute" style={{ opacity }}>
          {ic.gold ? (
            /* The export draws this ring as a stroked rect with a gradient
               stroke, and its interior is *transparent* — the bubble shows
               through. A CSS gradient border cannot do that: the
               padding-box layer has to paint something, which turns the
               inside into a disc. So it is drawn the way the export draws
               it. */
            <svg
              aria-hidden
              className="absolute"
              style={{ left: ic.x + offset.x, top: ic.y + offset.y }}
              width={ic.d}
              height={ic.d}
              viewBox={`0 0 ${ic.d} ${ic.d}`}
              fill="none"
            >
              <defs>
                <linearGradient id="gold-ring" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={C.goldFrom} />
                  <stop offset="1" stopColor={C.goldTo} />
                </linearGradient>
              </defs>
              <rect
                x={0.75579 / 2}
                y={0.75579 / 2}
                width={ic.d - 0.75579}
                height={ic.d - 0.75579}
                rx={(ic.d - 0.75579) / 2}
                stroke="url(#gold-ring)"
                strokeWidth={0.75579}
              />
            </svg>
          ) : (
            <div
              className="absolute"
              style={{
                left: ic.x + offset.x,
                top: ic.y + offset.y,
                width: ic.d,
                height: ic.d,
                borderRadius: ic.d / 2,
                background: user ? 'rgba(167,167,255,0.02)' : C.iconFill,
                border: `${user ? 0.75579 : 0.732172}px solid ${user ? C.userIconStroke : C.iconStroke}`,
              }}
            />
          )}
          <Glyph ic={ic} offset={offset} />
        </div>
      ))}
    </>
  )
}

function Glyph({ ic, offset }) {
  if (ic.glyph === 'translate' || ic.glyph === 'retry') {
    const [gx, gy] = GLYPH[ic.glyph].box
    return <ExportGlyph name={ic.glyph} x={gx + offset.x} y={gy + offset.y} />
  }
  const size = ic.d * 0.6
  return (
    <Icon
      name="speaker"
      x={ic.x + offset.x + (ic.d - size) / 2}
      y={ic.y + offset.y + (ic.d - size) / 2 + size * 0.14}
      size={size}
      color={C.iconGlyph}
    />
  )
}
