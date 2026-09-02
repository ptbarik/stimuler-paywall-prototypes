import { AnimatePresence, motion } from 'motion/react'
import { BUBBLE, CARD, CIRCLE, COLOR, DUR, EASE, PILLS, T, replyStateAt } from './timeline'
import PulseRings from './components/PulseRings'
import Waveform from './components/Waveform'
import Bubble from './components/Bubble'
import Pill from './components/Pill'
import { ClockIcon, PhoneIcon, SparkleIcon } from './components/Icons'
import sarah from './assets/sarah.jpg'

/** Reduced motion: five static holds of 1000ms, sampled mid-state, cut instantly. */
const REDUCED_SAMPLE = [300, 1500, 2400, 3600, 4400]

export default function CallSequence({ ms, reduced, speed, minutesLabel = '40 Minutes' }) {
  const scale = 1 / speed
  const t = reduced ? REDUCED_SAMPLE[Math.min(4, Math.floor(ms / 1000))] : ms

  // just after the loop wraps, geometry snaps instead of animating back
  const instant = reduced || ms < 80

  const calling = t < T.connect
  const geom = calling
    ? CIRCLE.calling
    : t < T.sarahIn
      ? CIRCLE.connected
      : t < T.morph
        ? CIRCLE.settled
        : CIRCLE.speaking

  const showPhone = t < T.connect
  const showMinutes = t < T.connect
  const showWave = t >= T.waveIn && t < T.waveOut
  const showSarah = t >= T.sarahIn && t < T.sarahOut
  const showReply = t >= T.userIn && t < T.fadeOut
  const showTry = t >= T.pillIn && t < T.morph
  const showSpeaking = t >= T.morph && t < T.fadeOut

  // Soft, near-critically-damped. The brief's 450ms / stiffness 320 spring was
  // too sharp next to the ring breathing, so this eases rather than snaps.
  const geomT = instant
    ? { duration: 0 }
    : { type: 'spring', visualDuration: DUR.morphVisual * scale, bounce: DUR.morphBounce }

  // Box, fill, stroke and text colour all interpolate together from the clock.
  // The outline is one welded path now, so the geometry has to be a plain
  // number here rather than something Motion animates behind React's back.
  const reply = replyStateAt(t)

  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        width: CARD.w,
        height: CARD.h,
        borderRadius: CARD.r,
        backgroundColor: COLOR.card,
        fontFamily: 'var(--font-card)',
      }}
      animate={{ opacity: !reduced && ms >= T.fadeOut ? 0 : 1 }}
      transition={
        reduced || ms < 80
          ? { duration: 0 }
          : { duration: (T.fadeOutDur / 1000) * scale, ease: EASE.exit }
      }
    >
      <PulseRings ms={t} reduced={reduced} />

      {/* ── the one persistent circle ─────────────────────────────
          Green call button in state 1, Sarah in states 2–5. Same
          element throughout — it changes size, fill and contents but
          is never unmounted. */}
      <motion.div
        key="call-circle"
        className="absolute overflow-hidden"
        animate={{
          left: geom.cx - geom.d / 2,
          top: geom.cy - geom.d / 2,
          width: geom.d,
          height: geom.d,
          backgroundColor: calling ? COLOR.green : COLOR.avatarRing,
          opacity: ms < 30 && !reduced ? 0 : 1,
        }}
        transition={{
          ...geomT,
          backgroundColor: instant ? { duration: 0 } : { duration: 0.3 * scale },
          opacity: ms < 30 || reduced ? { duration: 0 } : { duration: (DUR.fade / 1000) * scale },
        }}
        style={{ borderRadius: '50%' }}
      >
        {/* Sarah — crossfades in under the phone glyph */}
        <motion.div
          className="absolute overflow-hidden"
          animate={{ opacity: calling ? 0 : 1 }}
          transition={instant ? { duration: 0 } : { duration: 0.32 * scale, ease: EASE.enter }}
          style={{ inset: '5.9%', borderRadius: '50%' }}
        >
          <img src={sarah} alt="" className="h-full w-full object-cover" style={{ objectPosition: '50% 7%' }} />
          <span className="absolute inset-0 bg-[#090909]/35" />
          <span
            className="absolute inset-x-0 bottom-0 h-[31%]"
            style={{ background: 'linear-gradient(to bottom, transparent, #0A0A0Acc)' }}
          />
        </motion.div>

        <AnimatePresence>
          {showPhone && (
            <motion.div
              key="phone"
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.8,
                transition: reduced ? { duration: 0 } : { duration: (T.phoneExitDur / 1000) * scale, ease: EASE.exit },
              }}
            >
              <PhoneIcon className="h-[47%] w-[47%] text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── state 1 chrome ─────────────────────────────────────── */}
      <AnimatePresence>
        {showMinutes && (
          <Pill
            key="minutes"
            ms={t}
            geom={PILLS.minutes}
            bg="rgba(255,255,255,0.06)"
            border="rgba(255,255,255,0.43)"
            fg="#fff"
            blur={20.26}
            from="above"
            reduced={reduced}
            scale={scale}
            icon={<ClockIcon className="h-[14.7px] w-[14.7px] text-white" />}
          >
            {minutesLabel}
          </Pill>
        )}
        {showMinutes && (
          <motion.p
            key="calling-label"
            className="absolute w-full text-center text-[19px] font-medium text-white"
            style={{ top: 258 }}
            initial={false}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: reduced ? { duration: 0 } : { duration: (T.phoneExitDur / 1000) * scale },
            }}
          >
            Calling Sarah
            <CallingDots ms={t} reduced={reduced} />
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── state 2 waveform ───────────────────────────────────── */}
      <div className="absolute inset-x-0 flex justify-center" style={{ top: 248 }}>
        <Waveform ms={t} visible={showWave} reduced={reduced} scale={scale} />
      </div>

      {/* ── bubbles ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSarah && (
          <Bubble
            key="sarah"
            geom={BUBBLE.sarah}
            fill={COLOR.sarahBubble}
            stroke={COLOR.sarahStroke}
            color={COLOR.sarahText}
            from="left"
            reduced={reduced}
            scale={scale}
          >
            Hi! I am Sarah.What would
            <br />
            you like to talk about?
          </Bubble>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReply && (
          <Bubble
            key="reply"
            geom={reply.geom}
            fill={reply.fill}
            stroke={reply.stroke}
            color={reply.color}
            tailAmount={reply.tailAmount}
            from="right"
            reduced={reduced}
            scale={scale}
          >
            Yeah sure! Let&rsquo;s talk
            <br />
            about hobbies
          </Bubble>
        )}
      </AnimatePresence>

      {/* ── pills that bracket the reply ───────────────────────── */}
      <AnimatePresence>
        {showTry && (
          <Pill
            key="try"
            ms={t}
            geom={PILLS.tryReading}
            bg={COLOR.suggestBubble}
            border={COLOR.suggestStroke}
            fg={COLOR.accent}
            from="below"
            reduced={reduced}
            scale={scale}
            gap={6.2}
            icon={<SparkleIcon className="h-[12px] w-[12px]" style={{ color: COLOR.accent }} />}
          >
            Try reading!
          </Pill>
        )}
        {showSpeaking && (
          <Pill
            key="speaking"
            ms={t}
            geom={PILLS.speaking}
            bare
            dots
            align="left"
            fg="#fff"
            from="below"
            reduced={reduced}
            scale={scale}
          >
            You&rsquo;re speaking
          </Pill>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/** The three dots after "Calling Sarah" — clock-driven, so it never resets. */
function CallingDots({ ms, reduced }) {
  if (reduced) return <span>…</span>
  const n = Math.floor((ms / 330) % 4)
  return <span className="inline-block w-[18px] text-left">{'.'.repeat(n)}</span>
}
