import Roadmap from './Roadmap.jsx'
import { StatusBar, Header, NavBar, NAV_H } from './Chrome.jsx'

export const FRAME = { w: 412, h: 844 }

/* The slot the revised sheet keeps: 390 × 96, centred, 14 above the nav. */
export const SLOT_X = 11
export const SLOT_GAP = 14
const HEAD_H = 127

export default function Frame({ fab, clock, anim, run }) {
  const F = fab.C
  return (
    <div style={{ position: 'relative', width: FRAME.w, height: FRAME.h, background: '#0A0A0A', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: HEAD_H, bottom: 0 }}>
        <Roadmap topPad={135.43 - HEAD_H} bottomPad={NAV_H + SLOT_GAP + 96 + 20} />
      </div>

      <StatusBar />
      <Header />

      {/* `run` is a nonce — remounting is what restarts a CSS animation, and
          restarting it is the only way to watch the first beat again. */}
      <div key={`${fab.id}-${run}`}
           className={anim ? undefined : 'frozen'}
           style={{ position: 'absolute', left: SLOT_X, bottom: NAV_H + SLOT_GAP, zIndex: 35 }}>
        <F hms={clock.hms} parts={clock.parts} anim={anim} />
      </div>

      <NavBar />
    </div>
  )
}
