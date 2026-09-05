import { BEATS } from '../copy'
import { BEAT, LOCKUP, T, cascadeSpan } from '../design'
import { clamp, easeCascade, easeInOut, easeOut, seg, spring } from '../ease'
import Cascade, { words } from '../components/Cascade'
import CrownField from '../components/CrownField'

/* The three beats, parsed once. `{}` marks the accented words. */
const W1 = words(BEATS.one)
const W2 = words(BEATS.two.join('\n'))
const W3 = words(BEATS.three)

/**
 * The crown interstitial — first Premium visit only.
 *
 * ── Two acts, not one ─────────────────────────────────────────────
 *
 * **The fall finishes before the copy starts.** Sixty-four crowns come down,
 * every one of them is past the bottom edge by 1900ms, and only then does
 * anything else happen.
 *
 * They used to overlap, and it sounded better than it read. The near layer
 * crosses in *front* of the type, so the words being introduced were the words
 * being occluded — the eye had two things competing at the exact moment it was
 * being asked to read one. Separating them costs about a second and a half and
 * buys a screen that is doing one thing at a time.
 *
 * The word cascade is the onboarding prototype's intro-beat motion, to its
 * numbers: 740ms per word on `cubic-bezier(.22,.72,.24,1)`, 55ms apart,
 * clearing `blur(4px)` and 10px of rise together. See `Cascade.jsx` for why
 * the blur is the part that matters.
 *
 * ── `Stimuler PRO` visits three positions ─────────────────────────
 *
 * One element, never redrawn. It cascades in with beat 1 at y461 where `4.png`
 * puts it, settles up to y397 for beats 2 and 3 where `5.png` and `6.png` put
 * it, and then — **on the same beat that `50% OFF` lands** — flies to y73 and
 * 0.655 scale, which is exactly where and how big the paywall's own header is.
 *
 * That last move is the transition. `50% OFF` is the last thing this screen
 * has to say, so the brand mark's job here is done and it goes on ahead to the
 * next screen, arriving before the screen does.
 *
 * ── The exit ──────────────────────────────────────────────────────
 *
 * There is no screen change. The glow behind this belongs to neither this
 * screen nor the paywall — it is painted once, underneath both — so the
 * handover is this copy leaving while the paywall's content fades up *through
 * the same light*, with the header already in place because the lockup flew
 * there and the paywall's own header fades in underneath it at the same
 * position and size.
 *
 * Nothing the eye is tracking across that boundary moves, which is why it
 * reads as having scrolled into the page rather than as having been taken to
 * another one.
 *
 * ── Tap to skip ───────────────────────────────────────────────────
 *
 * At any point, landing on the paywall immediately. A user who taps has
 * decided; making them watch the rest is the prototype arguing with them.
 */
export default function CrownInterstitial({ ms, onSkip, reduced }) {
  // reduced motion: no fall, no blur, no travel, no overshoot. The beats still
  // change, because the *content* was never the thing that needed reducing.
  const still = reduced

  const outAll = seg(ms, T.out)
  const gone = 1 - outAll

  /* ── the lockup: cascades in, settles, then leaves for the paywall ── */
  const lockIn = easeCascade(clamp((ms - T.lockIn) / 740))
  const pillIn = easeCascade(clamp((ms - T.lockIn - 55) / 740))

  // 461 → 397 between beats 1 and 2, then 397 → the paywall header at 73.2
  const settled = LOCKUP.beat1Y + (LOCKUP.restY - LOCKUP.beat1Y) * easeInOut(seg(ms, T.move))
  const flown = easeInOut(seg(ms, T.fly))
  const lockY = settled + (LOCKUP.land - settled) * flown
  const lockScale = 1 + (LOCKUP.scale - 1) * flown

  // the pill's own box travels with it — see LOCKUP.pill for why it cannot
  // simply ride the group scale
  const { from: PF, to: PT } = LOCKUP.pill
  const lerp = (a, b) => a + (b - a) * flown
  const pill = {
    width: lerp(PF.w, PT.w),
    height: lerp(PF.h, PT.h),
    borderRadius: lerp(PF.r, PT.r),
    fontSize: lerp(PF.fs, PT.fs),
  }

  /* ── `50% OFF` ── */
  const offT = clamp((ms - T.off) / 620)
  const offScale = still ? 1 : 0.85 + 0.15 * spring(offT)
  const offO = easeOut(clamp(offT * 2.4))

  // one pass, left to right, and only one — a sweep that repeats turns the
  // number into a loading state
  const sweep = seg(ms, T.sweep)
  const sweepOn = ms >= T.sweep[0] && ms <= T.sweep[1] && !still

  // in `reduced`, every line is simply present for its own window
  const held = (from, out) => (ms >= from - 200 && (out === null || ms < out + 400) ? 1 : 0)

  return (
    <div
      className="inter"
      onClick={onSkip}
      role="button"
      tabIndex={0}
      aria-label="Skip"
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSkip()}
    >
      {!still && <CrownField ms={ms} front={false} />}

      <div className="beats" style={{ opacity: gone }}>
        {/* `Stimuler` + PRO — one element, visiting all three of its
            positions. `transformOrigin` is the *top* centre so that `top` stays
            the element's visual top while it scales, which is what lets the
            landing be a single measured number rather than a fudge. */}
        <div
          className="lockup"
          style={{
            top: lockY,
            gap: lerp(PF.gap, PT.gap),
            transform: `scale(${lockScale})`,
            transformOrigin: '50% 0',
          }}
        >
          <span
            style={{
              opacity: still ? 1 : lockIn,
              transform: `translateY(${still ? 0 : 10 * (1 - lockIn)}px)`,
              filter: !still && lockIn < 0.99 ? `blur(${(4 * (1 - lockIn)).toFixed(2)}px)` : undefined,
            }}
          >
            Stimuler
          </span>
          <span
            className="pill"
            style={{
              ...pill,
              opacity: still ? 1 : pillIn,
              transform: `translateY(${still ? 0 : 10 * (1 - pillIn)}px)`,
              filter: !still && pillIn < 0.99 ? `blur(${(4 * (1 - pillIn)).toFixed(2)}px)` : undefined,
            }}
          >
            PRO
          </span>
        </div>

        {still ? (
          <>
            <p className="beat one" style={{ top: BEAT.one.top, opacity: held(T.b1, T.b1out) }}>
              {BEATS.one.replace(/[{}]/g, '')}
            </p>
            <p className="beat two" style={{ top: BEAT.two.top, opacity: held(T.b2, T.b2out) }}>
              {BEATS.two.join('\n').replace(/[{}]/g, '')}
            </p>
            <p className="beat three" style={{ top: BEAT.three.top, opacity: held(T.b3, null) }}>
              {BEATS.three.replace(/[{}]/g, '')}
            </p>
          </>
        ) : (
          <>
            <Cascade className="beat one" style={{ top: BEAT.one.top }} words={W1} ms={ms} from={T.b1} out={T.b1out} />
            <Cascade className="beat two" style={{ top: BEAT.two.top }} words={W2} ms={ms} from={T.b2} out={T.b2out} />
            <Cascade className="beat three" style={{ top: BEAT.three.top }} words={W3} ms={ms} from={T.b3} out={null} />
          </>
        )}

        <p
          className="off"
          style={{
            top: BEAT.off.top,
            opacity: offO,
            transform: `scale(${offScale})`,
            transformOrigin: '50% 50%',
          }}
        >
          {BEATS.off}
          {/* the pass is clipped to the glyphs by `background-clip:text`, so
              the light travels through the letterforms rather than across a
              box that happens to contain them */}
          {sweepOn && (
            <span
              className="sheen"
              style={{ backgroundPosition: `${-60 + sweep * 220}% 0`, backgroundSize: '260% 100%' }}
            >
              {BEATS.off}
            </span>
          )}
        </p>
      </div>

      {/* the near layer, over the copy — see `CrownField` */}
      {!still && <CrownField ms={ms} front />}
    </div>
  )
}

/** Exported so the panel can label its scrubber with what is on screen. */
export const BEAT_MARKS = [
  ['crowns', 0],
  ['Welcome to', T.b1],
  ['whole', T.b1 + cascadeSpan(W1.length)],
  ['unlocked', T.b2],
  ['whole', T.b2 + cascadeSpan(W2.length)],
  ['50% OFF · fly', T.off],
  ['sweep', T.sweep[0]],
  ['paywall', T.out[0]],
]
