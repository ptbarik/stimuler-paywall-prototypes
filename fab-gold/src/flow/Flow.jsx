import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Paywall from '../components/Paywall.jsx'
import StarburstOffer from '../components/StarburstOffer.jsx'
import { StatusBar } from '../components/Chrome.jsx'
import { THEMES, GOLD_STAR } from '../theme.js'
import { INDIA } from '../copy.js'
import FirstPaywall from './FirstPaywall.jsx'
import Confetti from './Confetti.jsx'
import { Lid, Body, BOX, PALETTES } from './GiftBox.jsx'
import { sfx, haptic, unlock, setEnabled } from './sfx.js'

/**
 * First paywall → gift → offer paywall, as one continuous piece.
 *
 *   p1      the first paywall (stimuler-pro-paywall-v2). Its × is the way on.
 *   toGift  it drops away down the screen; the gift screen is already there
 *           behind it, and the box falls into place.
 *   gift    the closed box, rocking now and then. Tap anywhere.
 *   open    the box squats, the lid springs off, the body drops, light
 *           comes up out of the opening, and a small ball pops out of it,
 *           hangs, and bursts — the offer unfolding out of the burst.
 *   land    the lid and box leave the frame; the gift screen's own ground
 *           fades away, uncovering the offer paywall that has been waiting
 *           under it; the badge flies up into its slot on that page.
 *   offer   the page's own badge takes over in place, its contour rings
 *           rippling out as it lands, and everything else comes up around
 *           it in reading order, with the sheet rising last.
 *
 * The one rule that makes it smooth: **nothing is replaced while it is
 * visible.** The gift screen and the offer page share a ground (the same
 * gradient, the same three blurred plates), so the crossfade between them is
 * invisible — only the rays and the box are seen to go. And the badge is
 * never swapped mid-flight: the flying copy is held at rest (no idle spin)
 * and lands exactly where, and at exactly the size and angle, the page's copy
 * is mounted — so the hand-off is a no-op to the eye.
 */

/* The badge's slot on the offer page: the scroller's 158 top padding plus
   half the 196 slot. The flying badge uses the same 412 × 196 box. */
const SLOT = { top: 158, h: 196 }
const BADGE_CY = { rise: 560, open: 405, land: SLOT.top + SLOT.h / 2 }

/* the closed box's top-left, in frame coordinates */
const BOX_X = (412 - BOX.w) / 2
const BOX_Y = 352

const LID_OPEN = -150
const BODY_OPEN = 80
/* the top of the box's opening, closed */
const MOUTH_Y = BOX_Y + BOX.bodyTop

const BALL = 30

/* ms from the tap: the ball leaves the box, bursts; the whole open state
   holds until `openHold`, then the landing takes `land` */
const T = { ballAt: 380, popAt: 1000, openHold: 2000, land: 760 }

const CONFETTI = {
  pro: ['#8D84FF', '#E1C13C', '#FFFFFF', '#6C63FF', '#FFE292', '#B9B0FF'],
  plus: ['#FFE292', '#E1C13C', '#FFFFFF', '#EAB259', '#C7A014', '#FFF3CF'],
}

const spring = (d, b = 0.3, delay = 0) => ({ type: 'spring', visualDuration: d, bounce: b, delay })
const ease = [0.2, 0.72, 0.24, 1]

/*
  Sound and haptics, on the animation's own beats — seconds from the start
  of the stage named. Each offset is the moment the motion it belongs to
  lands, read off the springs and delays below, so the sound is *of* the
  motion rather than near it.
*/
const BEATS = {
  toGift: [
    [0.5, () => sfx.shimmer()],                  // the headline fades up (0.45 delay)
    [0.58, () => { sfx.thud(); haptic(10) }],    // the box's spring meets the floor
  ],
  gift: [
    /* the rock is at 1.1 + 0.6 × 3.2 into each 3.2s cycle; only the first two
       make a sound — after that the box rocks in silence */
    [3.02, () => { sfx.rattle(); haptic([6, 70, 6]) }],
    [6.22, () => sfx.rattle()],
  ],
  open: [
    [0, () => sfx.windup()],                     // the box squashes
    [0.18, () => { sfx.pop(); haptic(18) }],     // the lid springs off
    [0.24, () => sfx.air(0, 0.8)],               // light comes up out of the box
    [0.38, () => sfx.bloop()],                   // the ball leaves the opening (T.ballAt)
    [1.0, () => { sfx.burst(); haptic([20, 40, 12]) }], // the ball opens (T.popAt)
  ],
  land: [
    [0.06, () => sfx.rise()],                    // the badge flies up to its slot
  ],
  offer: [
    [0, () => { sfx.arrive(); haptic([14, 60, 24]) }], // it lands; rings, confetti
  ],
}

export default function Flow({ theme, startAt = 'p1', onStage, sound = true }) {
  const [stage, setStage] = useState(startAt === 'offer' ? 'direct' : startAt)
  const [popped, setPopped] = useState(false)
  const t = THEMES[theme]
  const p = PALETTES[theme]

  useEffect(() => { onStage?.(stage) }, [stage, onStage])
  useEffect(() => { setEnabled(sound) }, [sound])

  /* play the stage's beats; leaving the stage cancels any not yet played */
  useEffect(() => {
    const ids = (BEATS[stage] || []).map(([at, play]) => setTimeout(play, at * 1000))
    return () => ids.forEach(clearTimeout)
  }, [stage])

  /* both ways on are taps, so both unlock audio — the × is inside the first
     paywall's frame, and a tap there counts for this page too */
  const toGift = useCallback(() => { unlock(); setStage('toGift') }, [])

  useEffect(() => {
    if (stage === 'open') {
      setPopped(false)
      const a = setTimeout(() => setPopped(true), T.popAt)
      const b = setTimeout(() => setStage('land'), T.openHold)
      return () => { clearTimeout(a); clearTimeout(b) }
    }
    if (stage === 'land') { const id = setTimeout(() => setStage('offer'), T.land); return () => clearTimeout(id) }
  }, [stage])

  const giftOn = ['toGift', 'gift', 'open', 'land'].includes(stage)
  const pageOn = ['open', 'land', 'offer'].includes(stage)
  const opened = stage === 'open' || stage === 'land'

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: t.page }}>

      {/* ── the offer paywall, mounted under the gift as soon as it opens ── */}
      {pageOn && (
        <Paywall bare tabBar variant="v2" market="in" tier="pro" theme={theme} run={0}
                 badge={stage === 'offer' ? 'landed' : 'hidden'} reveal={stage === 'offer'}
                 onClose={() => setStage('p1')} />
      )}
      {stage === 'direct' && (
        <Paywall bare tabBar variant="v2" market="in" tier="pro" theme={theme} run={0} onClose={() => setStage('p1')} />
      )}

      {/* ── the gift screen ── */}
      {giftOn && (
        <div className="absolute inset-0" onClick={() => { if (stage === 'gift') { unlock(); setStage('open') } }}
             style={{ cursor: stage === 'gift' ? 'pointer' : 'default' }}>

          {/* its ground — the offer page's, exactly, so this can fade out
              over that page without the colour moving */}
          <motion.div className="absolute inset-0 pointer-events-none" style={{ background: t.page }}
                      initial={false}
                      animate={{ opacity: stage === 'land' ? 0 : 1 }}
                      transition={{ duration: 0.5, delay: stage === 'land' ? 0.22 : 0, ease: 'easeInOut' }}>
            {t.glow.map((g, i) => (
              <div key={i} className="absolute"
                   style={{ width: g.w, height: g.h, left: g.x, top: g.y, background: g.fill,
                            filter: `blur(${g.blur}px)`, mixBlendMode: g.blend,
                            transform: g.rot ? `rotate(${g.rot}deg)` : undefined }} />
            ))}
          </motion.div>

          {/* the rays: in with the box, brighter as it opens, gone as it leaves */}
          <motion.div className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: stage === 'land' ? 0 : opened ? 1 : 0.8, scale: opened ? 1.06 : 1 }}
                      transition={{ duration: stage === 'land' ? 0.35 : 0.8, ease }}
                      style={{ transformOrigin: '50% 0%' }}>
            <img src="/assets/gift/ray-3.svg" className="absolute max-w-none" style={{ left: 206, top: 45, width: 140 }} alt="" />
            <img src="/assets/gift/ray-3.svg" className="absolute max-w-none" style={{ left: 66, top: 45, width: 140, transform: 'scaleX(-1)' }} alt="" />
            <img src="/assets/gift/ray-1.svg" className="absolute max-w-none" style={{ left: 206, top: 95, width: 206 }} alt="" />
            <img src="/assets/gift/ray-1.svg" className="absolute max-w-none" style={{ left: 0, top: 95, width: 206, transform: 'scaleX(-1)' }} alt="" />
            <img src="/assets/gift/ray-big.svg" className="absolute max-w-none" style={{ left: 0, top: 360, width: 412 }} alt="" />
          </motion.div>

          {/* the headline and the tap hint — the reference frame's, and they
              step aside the moment the box is touched */}
          <motion.h1 className="absolute inset-x-0 text-center font-id pointer-events-none"
                     style={{ top: 150, fontSize: 34, fontWeight: 800, lineHeight: 1.04, letterSpacing: '-.012em', color: '#FFFBEC' }}
                     initial={{ opacity: 0, y: 10 }}
                     animate={opened ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
                     transition={opened ? { duration: 0.28 } : { duration: 0.55, delay: 0.45, ease }}>
            YOU’VE<br />UNLOCKED AN<br />OFFER
          </motion.h1>

          <motion.p className="absolute inset-x-0 text-center font-id pointer-events-none"
                    style={{ top: 628, fontSize: 16, color: 'rgba(255,255,255,.72)' }}
                    initial={{ opacity: 0 }}
                    animate={opened ? { opacity: 0 } : { opacity: [0.55, 1, 0.55], y: [0, -3, 0] }}
                    transition={opened ? { duration: 0.2 } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }}>
            Tap to open the box
          </motion.p>

          {/*
            The light, the ball and the badge — all *behind* the box's front
            face, so each of them comes up out of the opening rather than
            being laid over the box.

            The light is anchored to the opening and rides the body's own
            drop, so its foot is always the inside of the box. It is a soft
            column, screened onto the ground rather than painted over it, and
            it goes down to a trace the moment the offer opens, so it never
            sits over the figure.
          */}
          <motion.div className="absolute pointer-events-none" style={{ left: BOX_X, top: MOUTH_Y, width: BOX.w, height: 0 }}
                      animate={stage === 'land' ? { y: 460 } : { y: opened ? BODY_OPEN : 0 }}
                      transition={stage === 'land' ? { duration: 0.5, ease: [0.5, 0, 0.9, 0.5] } : spring(0.6, 0.3, 0.18)}>
            <motion.div className="absolute"
                        style={{ left: 30, width: 121, bottom: 0, height: 230, transformOrigin: '50% 100%',
                                 background: `linear-gradient(0deg, ${p.beam}CC 0%, ${p.beam}40 35%, ${p.beam}00 100%)`,
                                 clipPath: 'polygon(12% 100%, 88% 100%, 100% 0%, 0% 0%)', filter: 'blur(12px)', mixBlendMode: 'screen' }}
                        initial={{ opacity: 0, scaleY: 0.1 }}
                        animate={stage !== 'open' ? { opacity: 0, scaleY: 0.4 }
                          : popped ? { opacity: 0, scaleY: 1 } : { opacity: 0.38, scaleY: 1 }}
                        transition={stage !== 'open' ? { duration: 0.25 } : popped ? { duration: 0.35 } : { duration: 0.55, delay: 0.24, ease }} />
            {/* the bloom sitting on the opening */}
            <motion.div className="absolute rounded-full"
                        style={{ left: 35, width: 111, top: -14, height: 26, background: p.beam, filter: 'blur(16px)', mixBlendMode: 'screen' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: stage !== 'open' ? 0 : popped ? 0.3 : 0.6 }}
                        transition={{ duration: stage !== 'open' ? 0.25 : 0.4, delay: stage === 'open' && !popped ? 0.22 : 0 }} />
          </motion.div>

          {/* the ball: pops out of the opening, overshoots, hangs — then
              bursts, and the offer is what was inside it */}
          <AnimatePresence>
            {stage === 'open' && (
              <motion.div key="ball" className="absolute pointer-events-none rounded-full"
                          style={{ left: 206 - BALL / 2, top: 0, width: BALL, height: BALL,
                                   background: `radial-gradient(circle at 35% 30%, ${p.ball[0]} 0%, ${p.ball[1]} 38%, ${p.ball[2]} 100%)`,
                                   boxShadow: `0 0 18px 4px ${p.beam}AA, 0 0 46px 10px ${p.beam}55` }}
                          initial={{ y: MOUTH_Y + BODY_OPEN + 10 - BALL / 2, scale: 0.35, opacity: 0 }}
                          animate={popped
                            ? { y: BADGE_CY.open - BALL / 2, scale: 2.4, opacity: 0 }
                            : { y: BADGE_CY.open - BALL / 2, scale: 1, opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={popped
                            ? { duration: 0.26, ease: 'easeOut' }
                            : { y: spring(0.55, 0.45, T.ballAt / 1000), scale: spring(0.4, 0.5, T.ballAt / 1000),
                                opacity: { duration: 0.12, delay: T.ballAt / 1000 } }} />
            )}
          </AnimatePresence>

          {/* the burst: one soft flash where the ball was */}
          {popped && stage === 'open' && (
            <motion.div className="absolute pointer-events-none rounded-full"
                        style={{ left: 206 - 60, top: BADGE_CY.open - 60, width: 120, height: 120,
                                 background: `radial-gradient(circle, #fff 0%, ${p.beam} 35%, ${p.beam}00 70%)`, mixBlendMode: 'screen' }}
                        initial={{ scale: 0.3, opacity: 1 }}
                        animate={{ scale: 2.3, opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }} />
          )}

          {/* the offer, unfolding out of the burst. No rings and no sparkles
              in flight — those arrive with the landing, on the page's own
              badge. Held at rest so it hands over at the page's angle. */}
          <AnimatePresence>
            {(popped || stage === 'land') && (
              <motion.div key="fly" className="absolute left-0 pointer-events-none"
                          style={{ top: 0, width: 412, height: SLOT.h }}
                          initial={{ y: BADGE_CY.open - SLOT.h / 2, scale: 0.12, opacity: 0, rotate: -110 }}
                          animate={stage === 'land'
                            ? { y: BADGE_CY.land - SLOT.h / 2, scale: 1, opacity: 1, rotate: 0 }
                            : { y: BADGE_CY.open - SLOT.h / 2, scale: 0.64, opacity: 1, rotate: 0 }}
                          transition={stage === 'land'
                            ? spring(0.72, 0.18, 0.06)
                            : { default: spring(0.62, 0.42), opacity: { duration: 0.12 } }}>
                <StarburstOffer t={{ ...t, ...GOLD_STAR }} size={276} offLabel={INDIA.off} still idle={false} rings={false} sparkles={false} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* the box: enters, rocks, squats, and comes apart */}
          <motion.div className="absolute" style={{ left: BOX_X, top: BOX_Y, width: BOX.w, height: BOX.bodyTop + BOX.bodyH }}
                      initial={{ y: -70, scale: 0.8, opacity: 0 }}
                      animate={{ y: 0, scale: 1, opacity: 1 }}
                      transition={{ ...spring(0.7, 0.42, 0.3), opacity: { duration: 0.25, delay: 0.3 } }}>
            <motion.div className="absolute inset-0" style={{ transformOrigin: '50% 100%' }}
                        animate={stage === 'gift'
                          ? { rotate: [0, 0, -5, 4.2, -3, 2, -1, 0], scaleY: 1, scaleX: 1 }
                          : opened ? { rotate: 0, scaleY: [1, 0.88, 1.05, 1], scaleX: [1, 1.07, 0.98, 1] } : { rotate: 0 }}
                        transition={stage === 'gift'
                          ? { duration: 3.2, repeat: Infinity, delay: 1.1, times: [0, 0.6, 0.66, 0.72, 0.78, 0.84, 0.9, 1], ease: 'easeInOut' }
                          : { duration: 0.42, times: [0, 0.4, 0.75, 1], ease: 'easeOut' }}>

              <motion.div className="absolute left-0" style={{ top: BOX.bodyTop }}
                          animate={stage === 'land' ? { y: 460, opacity: 0 } : { y: opened ? BODY_OPEN : 0, opacity: 1 }}
                          transition={stage === 'land' ? { duration: 0.5, ease: [0.5, 0, 0.9, 0.5] } : spring(0.6, 0.3, 0.18)}>
                <Body p={p} lit={stage === 'open'} />
              </motion.div>

              <motion.div className="absolute left-0 top-0" style={{ transformOrigin: '50% 80%' }}
                          animate={stage === 'land'
                            ? { y: -700, rotate: -28, opacity: 0 }
                            : opened ? { y: LID_OPEN, rotate: -7, opacity: 1 } : { y: 0, rotate: 0, opacity: 1 }}
                          transition={stage === 'land' ? { duration: 0.42, ease: [0.5, 0, 0.9, 0.5] } : spring(0.62, 0.42, 0.18)}>
                <Lid p={p} />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* ── the first paywall, which leaves by dropping down the screen ── */}
      {(stage === 'p1' || stage === 'toGift') && (
        /* clipped below the status bar: the page brings its own, and it
           must not slide down the screen with the page — the frame's bar
           stays put on top */
        <motion.div className="absolute inset-0 z-40" style={{ clipPath: 'inset(45px 0 0 0)' }}
                    initial={false}
                    animate={stage === 'toGift' ? { y: 915 } : { y: 0 }}
                    transition={{ duration: 0.55, ease: [0.55, 0, 0.75, 0.3] }}
                    onAnimationComplete={() => stage === 'toGift' && setStage('gift')}>
          <FirstPaywall onClose={toGift} />
        </motion.div>
      )}

      {stage === 'offer' && <Confetti x={206} y={BADGE_CY.land} colors={CONFETTI[theme]} />}

      <StatusBar />
    </div>
  )
}
