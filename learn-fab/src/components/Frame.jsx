import Roadmap from './Roadmap.jsx'
import { StatusBar, Header, NavBar, NAV_H } from './Chrome.jsx'
import { Arrival } from '../fabs/parts.jsx'

export const FRAME = { w: 412, h: 844 }

/* The slot the export marks with its `new fab 1` rectangle: 390 × 96,
   centred, sitting 14 above the nav — the gap the earlier five FABs kept. */
export const SLOT_X = 11
export const SLOT_GAP = 14
export const SLOT_Y = NAV_H + SLOT_GAP

/* The header is opaque and 127 tall, so the scroller starts under it rather
   than behind it. The design's own 135.43 to the first rule is preserved as
   the scroller's own top padding. */
const HEAD_H = 127

export default function Frame({ fab, run, clock, earned, scrolling, scrollRef, onScroll }) {
  const F = fab.C
  const props = {
    hms: clock.hms, ms: clock.ms, parts: clock.parts,
    fraction: clock.fraction, lastHour: clock.lastHour,
    scrolling, earned,
  }

  return (
    <div style={{ position: 'relative', width: FRAME.w, height: FRAME.h, background: '#0A0A0A', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: HEAD_H, bottom: 0 }}>
        <Roadmap scrollRef={scrollRef} onScroll={onScroll}
                 topPad={135.43 - HEAD_H}
                 bottomPad={NAV_H + SLOT_GAP + 96 + 20} />
      </div>

      <StatusBar />
      <Header />

      <div style={{ position: 'absolute', left: SLOT_X, bottom: SLOT_Y, zIndex: 35 }}>
        {fab.id === 'N3'
          ? <F {...props} />
          : <Arrival run={`${fab.id}-${run}`}><F {...props} /></Arrival>}
      </div>

      <NavBar />
    </div>
  )
}
