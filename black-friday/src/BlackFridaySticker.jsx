import { motion } from 'motion/react'
import { GOLD, TEXT } from './theme.js'

/**
 * BLACK FRIDAY, as a die-cut sticker.
 *
 * The sticker outline is derived, not drawn. Each word is painted again
 * underneath with a fat round-joined stroke of its own fill, and a thick round
 * stroke of a shape *is* that shape dilated — so two words painted the same
 * colour merge into one continuous die cut that hugs the letterforms. Painting
 * it at 28, 26 and 24 gives the foil edge and the engraved line inside it.
 *
 * The letters are built the way the sale-poster lettering they come from is
 * built, which is four things and not one:
 *
 *   side     a wall stepped down-right, lighter at the face and darker behind
 *   keyline  a thin gold rim round the face, lit at the top
 *   face     a gradient, not a flat fill
 *   shadows  the letters drop one onto the sticker, the sticker onto the page
 *
 * An earlier pass had flat black letters on flat gold and read as a decal. The
 * side wall is the piece that does most of the work: it has to be clearly
 * darker than the sticker it sits on, or the two golds merge and the depth
 * disappears — which is exactly what went wrong the first time this was tried.
 *
 * The letters are real outlines pulled from Inter Display and warped onto a
 * quadratic **by arc length** — each point placed at its distance along the
 * curve, then pushed out perpendicular to it, so stems stay square to the
 * curve. `textPath` was not dependable enough to ship, and per-letter rotation
 * is the wrong shape.
 */

const D_BLACK = 'M63.0 81.1L52.0 48.0L67.2 43.4C71.4 42.3 74.8 42.3 77.4 43.4C80.0 44.5 81.6 46.3 82.2 49.0C82.6 50.9 82.4 52.7 81.5 54.2C80.6 55.8 79.2 57.0 77.3 58.0L77.3 58.0C79.6 57.7 81.6 58.0 83.5 59.1C85.3 60.2 86.5 62.0 87.0 64.4C87.6 67.3 87.0 69.8 85.4 72.0C83.7 74.3 81.0 75.9 77.1 76.9ZM68.1 73.6L74.7 71.7C76.5 71.2 77.8 70.4 78.7 69.4C79.5 68.4 79.8 67.1 79.4 65.7C79.1 64.3 78.3 63.3 77.0 62.8C75.8 62.2 74.2 62.2 72.3 62.7L65.4 64.7ZM63.8 59.5L70.5 57.6C72.1 57.1 73.3 56.4 74.1 55.4C74.8 54.3 75.1 53.2 74.7 51.9C74.4 50.6 73.7 49.6 72.5 49.1C71.3 48.6 69.8 48.6 68.1 49.0L61.2 51.0ZM91.5 73.5L84.5 39.3L92.7 37.8L97.5 66.1L113.7 63.9L114.3 70.1ZM114.1 70.1L124.8 34.3L135.5 34.1L147.8 69.3L139.8 69.0L137.5 61.4L124.0 61.7L121.8 69.5ZM125.7 55.8L135.5 55.6L134.2 52.0C133.6 50.2 133.0 48.4 132.4 46.6C131.7 44.8 131.1 42.8 130.3 40.6C129.7 42.8 129.1 44.8 128.5 46.7C127.9 48.5 127.4 50.4 126.8 52.2ZM164.5 71.4C161.4 71.0 158.6 70.0 156.3 68.3C153.9 66.6 152.0 64.4 150.8 61.6C149.4 58.8 148.9 55.6 149.1 51.9C149.3 48.2 150.2 45.1 152.0 42.5C153.8 39.9 156.2 38.0 159.2 36.8C162.2 35.6 165.5 35.2 169.2 35.7C172.3 36.1 175.1 37.1 177.4 38.5C179.7 40.0 181.4 41.8 182.6 44.0C183.8 46.2 184.3 48.6 184.2 51.2L176.3 49.7C176.2 47.6 175.5 45.9 174.1 44.5C172.7 43.2 170.8 42.3 168.5 42.0C165.2 41.6 162.5 42.4 160.4 44.3C158.4 46.2 157.2 48.9 156.9 52.5C156.6 56.0 157.2 58.9 158.7 61.2C160.2 63.4 162.4 64.7 165.5 65.1C167.6 65.4 169.4 65.1 171.0 64.2C172.6 63.3 173.9 61.9 174.7 60.0L182.2 61.3C181.3 63.8 180.0 65.9 178.2 67.5C176.5 69.1 174.4 70.3 172.1 70.9C169.8 71.6 167.2 71.8 164.5 71.4ZM182.3 73.9L189.5 39.7L197.6 41.5L193.7 57.4C194.9 56.6 196.0 55.8 197.2 55.1C198.4 54.3 199.5 53.5 200.7 52.8L212.8 45.7L222.2 48.7L203.8 58.8L211.2 81.9L203.3 79.3L197.6 62.1L191.6 66.1L189.3 75.5Z'
/* The die cut is the union of two dilated words, and a union of dilations is
   not the dilation of a union: where the gap between BLACK and FRIDAY sits
   between the body width and the rim width, the bodies fail to touch while the
   rims do, and a bright band of rim shows through the middle. This arc runs
   along that gap and is painted with the body, closing it. It is narrower than
   the body pass, so it fills without ever defining the outer edge. */
/* Bulbs that sit ON the border.
   The die cut has no path of its own — it is the union of two glyph outlines
   grown by a round stroke — so there is nothing to hang a dash pattern on.
   So the ring is derived: rasterise the words grown by 19 — wide enough to
   bridge the notches between letters, so the ring never dives into a crevice —
   walk that boundary, and project every sample back onto the true edge. The
   nearest point on a glyph outline is the foot of the normal, so pushing out
   from it by the rim's half width lands each bulb exactly on the border.
   The run the cabinet stands in front of is dropped. Regenerate with
   /tmp/bfarch/bulbs3.py if the lettering, the rim or the machine moves. */
const BULBS = [[125.1,20.3],[133.7,20.1],[143.5,22.6],[151.8,24.7],[161.1,21.9],[171.3,21.8],[181.4,24.8],[191.2,25.8],[200.5,27.9],[213.3,31.7],[224.1,34.6],[232.8,39.6],[236.2,48.2],[233.2,57.3],[226.0,62.5],[222.4,70.3],[230.1,80.4],[240.1,83.6],[249.0,89.4],[251.6,98.5],[247.9,107.1],[241.5,112.2],[37.5,139.1],[34.3,130.7],[30.8,120.7],[27.9,112.4],[25.1,104.6],[23.3,94.1],[28.0,86.0],[36.8,81.8],[45.2,72.2],[42.5,63.9],[39.2,53.9],[38.8,43.2],[44.8,36.0],[55.2,32.3],[63.0,30.0],[73.2,28.6],[81.9,25.5],[90.1,24.0],[99.5,25.5],[112.3,27.9]]

const D_BRIDGE = 'M50,94 Q136,54 222,94'

const D_FRIDAY = 'M49.7 132.2L37.1 96.6L65.7 87.9L67.3 94.4L47.5 100.1L50.4 109.0L68.2 103.8L69.9 110.1L52.4 115.1L57.1 129.7ZM77.7 124.0L68.9 87.2L85.9 83.6C89.1 83.1 92.0 83.1 94.5 83.8C96.9 84.4 98.9 85.6 100.4 87.3C101.9 89.0 102.8 91.1 103.1 93.6C103.4 96.1 103.1 98.3 102.0 100.3C101.0 102.3 99.4 103.9 97.3 105.2L107.0 118.7L98.7 119.8L89.8 107.9C89.8 107.9 89.7 107.9 89.7 107.9L82.6 109.3L85.3 122.3ZM81.4 103.2L88.6 101.8C90.8 101.4 92.4 100.6 93.5 99.3C94.6 98.0 95.1 96.5 94.8 94.7C94.5 92.9 93.6 91.6 92.2 90.8C90.7 89.9 88.8 89.7 86.5 90.1L79.0 91.6ZM114.9 80.0L117.8 117.7L110.0 118.4L106.0 80.8ZM135.7 117.0L122.3 117.4L120.2 79.6L135.8 79.2C140.2 79.2 144.0 80.1 147.1 81.7C150.2 83.4 152.5 85.7 154.0 88.6C155.5 91.6 156.1 95.0 155.8 98.8C155.5 102.7 154.5 106.0 152.7 108.7C151.0 111.4 148.7 113.5 145.8 114.9C142.9 116.3 139.6 117.0 135.7 117.0ZM130.0 110.5L135.3 110.4C139.2 110.4 142.1 109.4 144.1 107.4C146.1 105.3 147.2 102.3 147.3 98.3C147.5 94.3 146.6 91.2 144.6 89.1C142.7 86.9 139.5 85.8 135.3 85.7L129.4 85.8ZM155.2 117.8L163.7 99.5L173.3 81.6L184.7 83.4L188.5 103.3L191.3 123.3L182.8 121.5L181.7 112.9L167.3 110.7L163.5 118.6ZM170.3 104.8L180.7 106.4L180.0 102.3C179.7 100.3 179.4 98.2 179.1 96.2C178.8 94.1 178.4 91.8 178.0 89.4C176.9 91.6 175.9 93.6 174.9 95.5C174.0 97.4 173.1 99.3 172.2 101.1ZM204.4 126.6L208.2 112.9L199.0 86.2L209.0 88.6L212.9 101.5C213.2 102.3 213.4 103.2 213.6 104.1C213.9 104.9 214.1 105.8 214.3 106.6C214.9 106.0 215.5 105.4 216.1 104.8C216.8 104.2 217.4 103.6 218.1 103.0L228.1 94.3L237.6 97.6L215.9 115.2L211.7 128.7Z'

export const STICKER_W = 272
export const STICKER_H = 180

/* how far the letters' own side wall travels */
const EXT = [4.6, 6.6]
const SIDE_STEPS = 16

const mix = (a, b, t) =>
  '#' +
  [0, 1, 2]
    .map((i) => {
      const x = parseInt(a.slice(1 + i * 2, 3 + i * 2), 16)
      const y = parseInt(b.slice(1 + i * 2, 3 + i * 2), 16)
      return Math.round(x + (y - x) * t).toString(16).padStart(2, '0')
    })
    .join('')

export default function BlackFridaySticker({ scale = 1, uid = 's', lights = false }) {
  const id = (k) => `${uid}-${k}`

  /* one pass over both words — a die cut, a shadow, a wall step, or the face */
  const Pass = ({ fill, tx = 0, ty = 0, sw, opacity, filter, bridge }) => {
    const p = {
      fill,
      ...(sw
        ? { stroke: fill, strokeWidth: sw, strokeLinejoin: 'round', strokeLinecap: 'round', paintOrder: 'stroke' }
        : null),
      opacity,
      filter,
      transform: tx || ty ? `translate(${tx} ${ty})` : undefined,
    }
    return (
      <g>
        <use href={`#${id('b')}`} {...p} />
        <use href={`#${id('f')}`} {...p} />
        {bridge && <path d={D_BRIDGE} {...p} fill="none" strokeWidth={sw - 6} />}
      </g>
    )
  }

  /* the side wall: stepped copies, each dilated just enough to close the gap
     to the next, so no staircase shows on the diagonals */
  const side = []
  for (let i = SIDE_STEPS; i >= 1; i--) {
    const t = i / SIDE_STEPS
    side.push(
      <Pass
        key={i}
        fill={mix('#8A5E14', '#3F2605', t)}
        tx={+(EXT[0] * t).toFixed(2)}
        ty={+(EXT[1] * t).toFixed(2)}
        sw={1}
      />,
    )
  }

  return (
    <div
      style={{
        width: STICKER_W,
        height: STICKER_H,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <svg width={STICKER_W} height={STICKER_H} viewBox="0 0 272 180" style={{ overflow: 'visible', display: 'block' }}>
          <defs>
            <path id={id('b')} d={D_BLACK} />
            <path id={id('f')} d={D_FRIDAY} />
            <linearGradient id={id('rim')} x1="0.1" y1="0" x2="0.45" y2="1">
              <stop offset="0" stopColor="#FFF8E6" />
              <stop offset="0.45" stopColor="#FBE0A4" />
              <stop offset="1" stopColor="#DCA43A" />
            </linearGradient>
            <linearGradient id={id('body')} x1="0.15" y1="0" x2="0.5" y2="1">
              <stop offset="0" stopColor="#F6D98F" />
              <stop offset="0.5" stopColor="#E0AF40" />
              <stop offset="1" stopColor="#C08722" />
            </linearGradient>
            <linearGradient id={id('key')} x1="0.2" y1="0" x2="0.5" y2="1">
              <stop offset="0" stopColor="#FFF6DE" />
              <stop offset="0.45" stopColor="#F3CE7C" />
              <stop offset="1" stopColor="#B9811C" />
            </linearGradient>
            <linearGradient id={id('face')} x1="0" y1="0" x2="0.2" y2="1">
              <stop offset="0" stopColor="#6B4918" />
              <stop offset="0.42" stopColor="#38220B" />
              <stop offset="1" stopColor="#241506" />
            </linearGradient>
            <radialGradient id={id('glow')} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#FFBF4D" stopOpacity="0.24" />
              <stop offset="0.6" stopColor="#FFBF4D" stopOpacity="0.07" />
              <stop offset="1" stopColor="#FFBF4D" stopOpacity="0" />
            </radialGradient>
            <filter id={id('cast')} x="-30%" y="-30%" width="160%" height="170%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <filter id={id('drop')} x="-30%" y="-30%" width="160%" height="170%">
              <feGaussianBlur stdDeviation="3.4" />
            </filter>
            <filter id={id('bulb')} x="-160%" y="-160%" width="420%" height="420%">
              <feGaussianBlur stdDeviation="3.2" />
            </filter>
            {/* the mark's own light. Two blurs of the die cut rather than one:
                a tight one that hugs the letterforms so the glow has the shape
                of the words, and a wide one that spills past the edge. An
                ellipse behind it can only ever look like a lamp pointed at the
                sticker — this looks like the sticker is the lamp. */}
            <filter id={id('bloomA')} x="-60%" y="-60%" width="220%" height="240%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id={id('bloomB')} x="-80%" y="-80%" width="260%" height="280%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>

          {/* its own pool of light, so the sticker reads as lifted off the page */}
          <ellipse cx="136" cy="92" rx="150" ry="92" fill={`url(#${id('glow')})`} />

          {/* the glow, thrown from behind the letters */}
          <Pass fill="#FFA61F" sw={40} opacity={0.30} filter={`url(#${id('bloomB')})`} bridge />
          <Pass fill="#FFCB5E" sw={30} opacity={0.34} filter={`url(#${id('bloomA')})`} bridge />

          <Pass fill="#120800" ty={10} sw={28} opacity={0.55} filter={`url(#${id('cast')})`} bridge />
          <Pass fill={`url(#${id('rim')})`} sw={28} />
          <Pass fill="#9E6D14" sw={26} />
          <Pass fill={`url(#${id('body')})`} sw={24} bridge />

          {/* the marquee, mounted on the sticker's own edge. Two strings
              alternating is how a real chase is wired; grouping them means two
              animated nodes rather than a hundred and thirty-four. */}
          {lights && (
            <>
              {/* socket and a dull brass bead sit under the blink, so the off
                  beat still reads as an unlit lamp rather than a hole */}
              <g>
                {BULBS.map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4.2" fill="#23130266" />
                    <circle cx={x} cy={y} r="3.4" fill="#33200A" />
                    <circle cx={x} cy={y} r="2.4" fill="#9C6D1E" />
                    <circle cx={x - 0.6} cy={y - 0.7} r="0.9" fill="#C59540" />
                  </g>
                ))}
              </g>
              {[0, 1].map((k) => (
                <motion.g
                  key={k}
                  animate={{ opacity: k ? [0, 1, 0] : [1, 0, 1] }}
                  transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {BULBS.filter((_, i) => i % 2 === k).map(([x, y], i) => (
                    <g key={i}>
                      <circle cx={x} cy={y} r="6" fill="#FFB02E" opacity="0.34" filter={`url(#${id('bulb')})`} />
                      <circle cx={x} cy={y} r="2.8" fill="#FFDE9C" opacity="0.5" filter={`url(#${id('bulb')})`} />
                      <circle cx={x} cy={y} r="2.4" fill="#FFF1CF" />
                      <circle cx={x - 0.6} cy={y - 0.7} r="0.9" fill="#FFFFFF" opacity="0.85" />
                    </g>
                  ))}
                </motion.g>
              ))}
            </>
          )}
          <Pass fill="#2A1600" tx={3} ty={6} opacity={0.32} filter={`url(#${id('drop')})`} />
          {side}
          <Pass fill={`url(#${id('key')})`} sw={2.4} />
          <Pass fill={`url(#${id('face')})`} />
        </svg>
      </div>
    </div>
  )
}

/* One line, for the sticky header once the sticker has scrolled away. */
export function BlackFridayMini() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: "'Inter Display',sans-serif", fontWeight: 700, fontSize: 15,
                     letterSpacing: '-0.015em', backgroundImage: GOLD.flat,
                     WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        BLACK FRIDAY
      </span>
      <span style={{ fontFamily: "'Inter Display',sans-serif", fontWeight: 700, fontSize: 11.5,
                     padding: '3px 9px', borderRadius: 999, color: TEXT.white,
                     background: 'linear-gradient(180deg,#DCA93A,#BE851D)' }}>
        50% OFF
      </span>
    </div>
  )
}
