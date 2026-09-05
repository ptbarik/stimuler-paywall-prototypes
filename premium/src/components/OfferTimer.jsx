import { useEffect, useState } from 'react'
import { fields, remaining } from '../offer'

/**
 * `23 : 12 : 05`.
 *
 * Three things about it, all of which are the point:
 *
 * **It reads `offer.js`, every tick.** Not a counter decremented in memory —
 * `remaining()` is `WINDOW - (now - startedAt)`, recomputed from the
 * timestamp. So backgrounding the app is not a case this has to handle; it is
 * simply not a case. A decrementing counter would freeze while the tab is
 * hidden and hand the user back an hour they did not spend, which is the one
 * failure that would make the whole page a lie.
 *
 * **`tabular-nums`, and a fixed 17×17 box per field.** Without either, every
 * digit change re-measures the string and the whole badge twitches once a
 * second for as long as the page is open. The export draws those boxes; they
 * turn out to be doing structural work as well as decorative.
 *
 * The colon is a 2.12 × 7.09 white bar in the export rather than a glyph, so it
 * is drawn as one — a typographic colon at 10px sits low and reads as two
 * specks against the purple.
 *
 * **The digits do not animate.** No flip, no slide, no roll. That treatment is
 * charming for the four seconds it takes to notice it and exhausting across
 * the three minutes someone spends reading a paywall — and it is competing
 * with the page for the attention the page is trying to earn.
 */
export default function OfferTimer({ chips, chip }) {
  const [ms, setMs] = useState(() => remaining())

  useEffect(() => {
    // aligned to the wall clock rather than to mount, so the value the badge
    // shows is the value it would show on any other surface at that instant
    const id = setInterval(() => setMs(remaining()), 250)
    return () => clearInterval(id)
  }, [])

  const [h, m, s] = fields(ms)
  // each field is a fixed 17×17 box, so the three of them do not re-measure as
  // the digits change — the chip is the thing holding the width, not the text
  const box = { width: chip.w, height: chip.h, borderRadius: chip.r, fontSize: chip.size }
  return (
    <span className={`t${chips ? ' chips' : ''}`} style={{ gap: chip.gap }}>
      <b style={box}>{h}</b>
      <s />
      <b style={box}>{m}</b>
      <s />
      <b style={box}>{s}</b>
    </span>
  )
}
