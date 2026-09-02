import {
  C, CARD, GLOW, PANEL, PARTICLES, REDUCED_SAMPLE, SCROLL, SPRING, STREAK, T,
  clamp01, lerp, ramp, spring,
} from './timeline'
import SarahBubble from './components/SarahBubble'
import SpeechElement from './components/SpeechElement'
import StarStreak from './components/StarStreak'
import StarParticle from './components/StarParticle'
import FeedbackPanel from './components/FeedbackPanel'

/**
 * Conversation → stars → feedback. One 5000ms loop in the exports' own
 * 370×330 card, six beats.
 *
 * Four structural rules, all four visible here:
 *
 * 1. **The speech element is one element** — recording pill, typing bubble and
 *    reply bubble are the same `<div>` (`data-role="speech"`), never
 *    unmounted, with only its contents crossfading.
 *
 * 2. **Stars fly and are absorbed.** Each particle has its own emission point,
 *    scatter kick, target and duration, and a streak star fills *because* a
 *    particle arrived — `fills` is derived from the same times the particles
 *    use, not run on a parallel timer.
 *
 * 3. **The marked run is shared content.** `want eat` is cream and underlined
 *    inside the bubble and the same characters in red inside the panel.
 *
 * 4. **The glow is a fake affordance driving a real transition.** The icon
 *    pulses, then the panel opens with its `transformOrigin` on that icon. No
 *    cursor, no ripple, no pointer.
 */
export default function ConversationSequence({ ms, reduced }) {
  const t = reduced ? REDUCED_SAMPLE[Math.min(5, Math.floor(ms / (5000 / 6)))] : ms

  // ── the chat rides up as the pill arrives ───────────────────────
  const scroll = reduced ? (t >= T.pillIn ? 1 : 0) : ramp(t, T.scrollUp, T.scrollUpDur)
  const chatOut = reduced ? (t >= T.panel ? 1 : 0) : ramp(t, T.chatOut, T.chatOutDur)

  // ── beat C ──────────────────────────────────────────────────────
  const underline = reduced ? (t >= T.underline ? 1 : 0) : ramp(t, T.underline, T.underlineDur, (k) => k)
  const iconRow = reduced ? (t >= T.expand ? 1 : 0) : ramp(t, T.iconRow, T.iconRowDur)

  // ── beat D ──────────────────────────────────────────────────────
  // A streak star fills when its particle lands. `T.fills` are the arrival
  // beats the particles are timed to, so the two cannot drift apart.
  const fills = T.fills.map((at) =>
    reduced ? (t >= at ? 1 : 0) : spring(t - at, SPRING.fillPop) * 1.0,
  )
  const streakGlow = reduced ? (t >= T.fills[2] ? 1 : 0) : ramp(t, T.fills[2], 260)
  const particlesLive = !reduced && t >= T.burst && t < T.fills[2] + 260

  // ── beat E ──────────────────────────────────────────────────────
  // Two pulses of the glow. It exists only inside the glow window — outside
  // it there is no halo at all, or it sits on the icon for the whole loop.
  const glowK = (t - T.glow) / T.glowDur
  const glowing = !reduced && glowK > 0 && glowK < 1
  const pulse = glowing ? Math.sin(clamp01(glowK) * Math.PI * T.glowPulses) ** 2 : 0

  // ── beat F ──────────────────────────────────────────────────────
  const panel = reduced ? (t >= T.panel ? 1 : 0) : spring(t - T.panel, SPRING.panel)
  const tabs = reduced ? (t >= T.panel ? 1 : 0) : ramp(t, T.tabs, T.tabsDur)
  const red = reduced ? (t >= T.redRow ? 1 : 0) : ramp(t, T.redRow, T.redRowDur)
  const connector = reduced ? (t >= T.connector ? 1 : 0) : ramp(t, T.connector, T.connectorDur, (k) => k)
  const green = reduced ? (t >= T.greenRow ? 1 : 0) : ramp(t, T.greenRow, T.greenRowDur)

  const out = reduced ? 1 : 1 - ramp(ms, T.fadeOut, T.fadeOutDur)

  return (
    <div
      data-scene="conversation"
      className="relative overflow-hidden"
      style={{
        width: CARD.w,
        height: CARD.h,
        borderRadius: CARD.r,
        backgroundColor: C.bg,
        fontFamily: 'var(--font-card)',
        opacity: out,
      }}
    >
      {/* ── the chat ─────────────────────────────────────────── */}
      <div className="absolute inset-0" style={{ opacity: 1 - chatOut }}>
        <SarahBubble dy={lerp(SCROLL, 0, scroll)} />

        <StarStreak fills={fills} glow={streakGlow} />

        <SpeechElement ms={t} reduced={reduced} underline={underline} iconOpacity={iconRow} />

        {/* ── the glow ─────────────────────────────────────────
            One soft halo behind the retry button, pulsing twice. It is the
            export's own drop shadow — `#E7CA79`, 2px deviation, no offset —
            simply brightened and dimmed, rather than an invented ring that
            expands. It reads as "this is the thing to press" without any
            cursor, ripple or pointer graphic. */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: GLOW.cx - GLOW.r,
            top: GLOW.cy - GLOW.r,
            width: GLOW.r * 2,
            height: GLOW.r * 2,
            borderRadius: '50%',
            boxShadow: `0 0 ${GLOW.blur * 4}px ${GLOW.blur}px ${C.glowGold}`,
            opacity: 0.5 * pulse,
          }}
        />

        {/* ── the particles ────────────────────────────────────
            Rendered only while in flight, so nothing is left running
            across the loop point. */}
        {particlesLive &&
          PARTICLES.map((p) => <StarParticle key={p.key} p={p} ms={t} t0={T.burst} />)}
      </div>

      {/* ── the feedback panel ───────────────────────────────── */}
      {panel > 0.001 && (
        <FeedbackPanel
          open={panel}
          origin={{ x: GLOW.cx, y: GLOW.cy }}
          tabs={tabs}
          red={red}
          connector={connector}
          green={green}
        />
      )}
    </div>
  )
}

export { PANEL, STREAK }
