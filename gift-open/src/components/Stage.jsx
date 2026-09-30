import { motion } from 'motion/react'
import Roadmap from './Roadmap.jsx'
import { StatusBar, Header, NavBar, NAV_H } from './Chrome.jsx'
import GiftOpen from '../open/GiftOpen.jsx'
import Paywall from '../paywall/Paywall.jsx'

/* The paywall is 412 × 892, so the phone is, and the Learn screen fills it —
   the nav stays pinned, the roadmap just gets taller. Making both pages the
   same object is what lets one become the other without the frame resizing
   underneath the transition. */
export const FRAME = { w: 412, h: 892 }

const SLOT = { left: 11, top: FRAME.h - NAV_H - 14 - 96, w: 390, h: 96 }
const HEAD_H = 127

export default function Stage({ screen, clock, anim, run, phase, onTap, onOpened, onReset, pwRun, onPwReplay }) {
  const F = screen.C
  const showLearn = phase !== 'paywall'
  const showPaywall = phase !== 'learn'

  return (
    <div style={{
      position: 'relative', width: FRAME.w, height: FRAME.h, background: '#0A0A0A',
      overflow: 'hidden', borderRadius: 44,
      boxShadow: '0 40px 90px rgba(0,0,0,.55), 0 0 0 8px #0b0b0f, 0 0 0 9px rgba(255,255,255,.10)',
    }}>
      {showLearn && (
        <>
          <div style={{ position: 'absolute', left: 0, right: 0, top: HEAD_H, bottom: 0 }}>
            <Roadmap topPad={135.43 - HEAD_H} bottomPad={NAV_H + 14 + 96 + 20} />
          </div>
          <StatusBar />
          <Header />

          {/* remounting on `run` is what restarts a CSS animation, and
              restarting it is the only way to watch the first beat again */}
          <button key={`${screen.id}-${run}`}
                  onClick={phase === 'learn' ? onTap : undefined}
                  className={anim ? undefined : 'frozen'}
                  style={{
                    position: 'absolute', left: SLOT.left, top: SLOT.top,
                    width: SLOT.w, height: SLOT.h, zIndex: 35,
                    opacity: phase === 'opening' ? 0 : 1,
                    cursor: phase === 'learn' ? 'pointer' : 'default',
                  }}>
            <F hms={clock.hms} parts={clock.parts} anim={anim} />
          </button>

          <NavBar />
        </>
      )}

      {showPaywall && (
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 20 }}
                    /* the paywall comes up inside the field's own hold —
                       solid from 2.37s to 2.51s — and the hold is short on
                       purpose. Being under the light for a beat is a reveal;
                       being under it for a second is a wait. */
                    initial={{ opacity: phase === 'opening' ? 0 : 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.12, delay: phase === 'opening' ? 2.34 : 0, ease: 'easeInOut' }}>
          <Paywall variant="v1" tier="pro" onTier={() => {}} run={pwRun} onReplay={onPwReplay} onClose={onReset} />
        </motion.div>
      )}

      {phase === 'opening' && (
        <GiftOpen screen={screen} frame={FRAME} slot={SLOT} onDone={onOpened} />
      )}
    </div>
  )
}
