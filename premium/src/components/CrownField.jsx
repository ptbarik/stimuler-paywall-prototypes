import { memo } from 'react'
import { CROWNS, crownAt } from '../crowns'
import CrownGlyph from './CrownGlyph'

/**
 * The falling crowns, split into the layer that goes in front of the copy and
 * the two that go behind it.
 *
 * Rendering the near layer over the type is what stops the fall reading as a
 * backdrop. A field that is entirely behind the words is a wallpaper the words
 * sit on; a field with five crowns crossing *in front* of them puts the copy
 * inside the fall rather than under it, and that is the whole depth effect
 * paying off — the layers only mean anything if something actually occupies
 * the near one.
 *
 * Each crown's transform is a single `translate3d` + `rotate`, computed by
 * `crownAt` from the interstitial clock. Nothing here animates itself, so the
 * whole field scrubs, and a crown that is not on screen is not rendered at all
 * rather than rendered at zero opacity.
 */
function CrownField({ ms, front }) {
  return (
    <div className={`field ${front ? 'front' : 'back'}`}>
      {CROWNS.filter((c) => c.front === front).map((c) => {
        const p = crownAt(c, ms)
        if (!p) return null
        return (
          <i
            key={c.i}
            style={{
              transform: `translate3d(${p.x - c.size / 2}px, ${p.y}px, 0) rotate(${p.turn}deg)`,
              opacity: c.opacity,
              filter: c.blur ? `blur(${c.blur}px)` : undefined,
            }}
          >
            <CrownGlyph size={c.size} />
          </i>
        )
      })}
    </div>
  )
}

export default memo(CrownField)
