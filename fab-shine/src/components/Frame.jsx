import Roadmap from './Roadmap.jsx'
import { StatusBar, Header, NavBar, NAV_H } from './Chrome.jsx'

export const FRAME = { w: 412, h: 844 }
const HEAD_H = 127

/**
 * The Learn screen, with whichever tab is selected pinned over it.
 *
 * Each tab positions itself — they range from 657 to 673 down the frame
 * depending on how tall the tab is and how far it tucks behind the nav — so the
 * frame only provides the ground and the chrome.
 */
export default function Frame({ tab, clock, anim, run }) {
  const T = tab.C
  return (
    <div style={{ position: 'relative', width: FRAME.w, height: FRAME.h, background: '#0A0A0A', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: HEAD_H, bottom: 0 }}>
        <Roadmap topPad={135.43 - HEAD_H} bottomPad={NAV_H + 14 + 96 + 20} />
      </div>
      <StatusBar />
      <Header />

      {/* remounting on `run` is what restarts a CSS animation, and restarting it
          is the only way to watch the first beat again */}
      <div key={`${tab.id}-${run}`} className={anim ? undefined : 'frozen'}
           style={{ position: 'absolute', inset: 0, zIndex: 35, pointerEvents: 'none' }}>
        <T parts={clock.parts} hms={clock.hms} anim={anim} />
      </div>

      <NavBar />
    </div>
  )
}
