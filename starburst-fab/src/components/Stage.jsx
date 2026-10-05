import { motion } from 'motion/react'
import Roadmap from './Roadmap.jsx'
import { StatusBar, Header, NavBar, NAV_H } from './Chrome.jsx'
import BadgeOpen, { leadOf } from '../open/BadgeOpen.jsx'
import Paywall from '../paywall/Paywall.jsx'

/* The paywall is 412 × 892, so the phone is, and the Learn screen fills it —
   the nav stays pinned, the roadmap just gets taller. Making both pages the
   same object is what lets one become the other without the frame resizing
   underneath the transition. */
export const FRAME = { w: 412, h: 892 }

/* Every tab reports its own box — they run 52 to 58 tall and two of them hang
   their badge off their own bar, so there is no one slot to put them in. The
   tab draws itself in frame coordinates; this only has to catch the tap. */
const HEAD_H = 127

/** The ten that are not interactive stay a plain tap target. */
function InertTab({ F, clock, anim, onTap }) {
  return (
    <button onClick={onTap}
            style={{ position: 'absolute', inset: 0, background: 'transparent', cursor: onTap ? 'pointer' : 'default' }}>
      <F clock={clock} anim={anim} />
    </button>
  )
}

export default function Stage({ screen, clock, anim, run, phase, origin, progress, onTap, onOpened, onReset, pwRun, onPwReplay }) {
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
            <Roadmap topPad={135.43 - HEAD_H} bottomPad={NAV_H + 14 + screen.h + 24} />
          </div>
          <StatusBar />
          <Header />

          {/* remounting on `run` is what restarts a CSS animation, and
              restarting it is the only way to watch the first beat again */}
          {/* An interactive tab is not wrapped in a button: a full-bleed
              button over the top swallows every pointerdown before the knob,
              the ring or the stub ever sees it. Those tabs commit themselves
              and report where their badge is coming from. */}
          <div key={`${screen.id}-${run}`}
               className={anim ? undefined : 'frozen'}
               style={{
                 position: 'absolute', inset: 0, zIndex: 35,
                 opacity: phase === 'opening' ? 0 : 1,
                 transition: 'opacity .2s linear .1s',
                 pointerEvents: phase === 'learn' ? 'auto' : 'none',
               }}>
            {screen.interactive
              ? <F clock={clock} anim={anim} onCommit={onTap} progress={progress} />
              : <InertTab F={F} clock={clock} anim={anim} onTap={phase === 'learn' ? onTap : undefined} />}
          </div>
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
                    transition={{ duration: 0.2, delay: phase === 'opening' ? 0.55 + leadOf(screen, origin) : 0, ease: 'easeInOut' }}>
          <Paywall variant="v2" tier="pro" plan={origin?.plan} onTier={() => {}} run={pwRun} onReplay={onPwReplay}
                   onClose={onReset} landed={phase === 'opening'} />
        </motion.div>
      )}

      {phase === 'opening' && <BadgeOpen screen={screen} origin={origin} onDone={onOpened} />}
    </div>
  )
}
