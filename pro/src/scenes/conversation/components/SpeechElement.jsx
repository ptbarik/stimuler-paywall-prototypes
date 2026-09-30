import { C, EASE, PILL, REPLY, SPRING, T, TYPING, clamp01, lerp, ramp, spring } from '../timeline'
import Waveform from './Waveform'
import Icon from './Icons'
import IconRow from './IconRow'

/**
 * **The spine of the sequence: one element, three shapes.**
 *
 * Recording pill → typing bubble → reply bubble. Same `<div>`, stable key,
 * never unmounted; only the contents crossfade. It carries
 * `data-role="speech"` so node identity can be checked rather than trusted.
 *
 * The box is two chained, *evaluated* springs — the contract and the expand —
 * so it is a plain number at every ms rather than a layout delta Motion has to
 * measure. That is what lets the second move begin while the first is still
 * settling, and what makes the scrubber honest.
 *
 * The corner radii interpolate too, and asymmetrically: the pill is fully
 * rounded, but the typing and reply bubbles both have a **square top-right**,
 * which is the export's mirror of Sarah's square top-left.
 */
export default function SpeechElement({ ms, reduced, underline, iconOpacity }) {
  const t = ms

  const rise = reduced ? 1 : spring(t - T.pillIn, SPRING.pillIn)
  const contract = reduced ? (t >= T.contract ? 1 : 0) : EASE.standard((t - T.contract) / T.contractDur)
  const expand = reduced ? (t >= T.expand ? 1 : 0) : spring(t - T.expand, SPRING.expand)

  const box = {
    x: lerp(lerp(PILL.box.x, TYPING.x, contract), REPLY.box.x, expand),
    y: lerp(lerp(PILL.box.y, TYPING.y, contract), REPLY.box.y, expand),
    w: lerp(lerp(PILL.box.w, TYPING.w, contract), REPLY.box.w, expand),
    h: lerp(lerp(PILL.box.h, TYPING.h, contract), REPLY.box.h, expand),
    r: lerp(lerp(PILL.box.r, TYPING.r, contract), REPLY.box.r, expand),
    // the top-right corner squares off as the pill becomes a bubble
    tr: lerp(PILL.box.r, 0, contract),
  }
  const fill = contract < 0.5 ? 'transparent' : mixFill(contract, expand)
  const strokeOn = 1 - clamp01(contract * 2.2)

  // ── contents ──
  const chrome = reduced ? (t < T.contract ? 1 : 0) : 1 - ramp(t, T.pillChromeOut, T.pillChromeOutDur)
  const waveLive = !reduced && t >= T.waveFrom && t < T.contract
  const dots = reduced
    ? t >= T.dotsIn && t < T.expand ? 1 : 0
    : ramp(t, T.dotsIn, T.dotsInDur) * (1 - ramp(t, T.expand, 160))
  const replyIn = reduced ? (t >= T.expand ? 1 : 0) : ramp(t, T.replyText, T.replyTextDur)

  const scale = box.w / PILL.box.w

  return (
    <div
      data-role="speech"
      className="pointer-events-none absolute"
      style={{
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        borderRadius: `${box.r}px ${box.tr}px ${box.r}px ${box.r}px`,
        background: fill,
        border: `0.73395px solid rgba(83,67,127,${strokeOn})`,
        opacity: reduced ? 1 : clamp01(rise * 1.2),
        transform: `translateY(${lerp(12, 0, rise)}px)`,
      }}
    >
      {/* ── pill chrome: check, waveform, dismiss ─────────────────
          Laid out at the pill's own coordinates and scaled with the box, so
          every number here is the export's. */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: PILL.box.w,
          height: PILL.box.h,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          opacity: chrome,
        }}
      >
        <div
          className="absolute"
          style={{
            left: PILL.check.x - PILL.box.x,
            top: PILL.check.y - PILL.box.y,
            width: PILL.check.d,
            height: PILL.check.d,
            borderRadius: '50%',
            background: `radial-gradient(circle at 50% 50%, ${C.checkFrom}, ${C.checkTo})`,
          }}
        />
        <Icon
          name="check"
          x={PILL.check.x - PILL.box.x + 10.9}
          y={PILL.check.y - PILL.box.y + 12.4}
          size={13.4}
          color="#fff"
        />
        <div
          className="absolute"
          style={{
            left: PILL.dismiss.x - PILL.box.x,
            top: PILL.dismiss.y - PILL.box.y,
            width: PILL.dismiss.d,
            height: PILL.dismiss.d,
            borderRadius: '50%',
            background: C.dismissFill,
          }}
        />
        <Icon
          name="dismiss"
          x={PILL.dismiss.x - PILL.box.x + 10.1}
          y={PILL.dismiss.y - PILL.box.y + 10.2}
          size={6.2}
          color="#fff"
        />
        <Waveform
          ms={ms}
          box={{ x: PILL.wave.x - PILL.box.x, y: PILL.wave.y - PILL.box.y, w: PILL.wave.w, h: PILL.wave.h }}
          live={waveLive}
          opacity={1}
        />
      </div>

      {/* ── typing dots ───────────────────────────────────────────
          Staggered by a 160ms phase offset, never synchronised. */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: dots, gap: 5.6 }}>
        {[0, 1, 2].map((i) => {
          const p = reduced ? 0.7 : 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(((ms - i * T.dotPhase) / 520) * Math.PI * 2))
          return (
            <span
              key={i}
              style={{
                width: 6.1,
                height: 6.1,
                borderRadius: '50%',
                background: '#9EA0FB',
                opacity: p,
                transform: `scale(${lerp(0.86, 1, p)})`,
              }}
            />
          )
        })}
      </div>

      {/* ── the reply ─────────────────────────────────────────────
          Laid out at the reply bubble's own coordinates and scaled with the
          box, same trick as the pill chrome. */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: REPLY.box.w,
          height: REPLY.box.h,
          transform: `scale(${box.w / REPLY.box.w})`,
          transformOrigin: '0 0',
          opacity: replyIn,
        }}
      >
        <div
          className="absolute whitespace-pre"
          style={{
            left: REPLY.text.x - REPLY.box.x,
            top: REPLY.text.y - REPLY.box.y,
            fontSize: REPLY.text.fs,
            lineHeight: REPLY.text.lh,
            color: C.text,
          }}
        >
          {REPLY.lines.map((runs, li) => (
            <span key={li} className="block">
              {runs.map((r, ri) =>
                r.mark ? (
                  <span key={ri} className="relative inline-block" style={{ color: C.markText }}>
                    {r.t}
                    <span
                      className="absolute left-0"
                      style={{
                        bottom: -1,
                        width: '100%',
                        height: 1.5,
                        background: C.markText,
                        transform: `scaleX(${lineUnderline(underline, li)})`,
                        transformOrigin: 'left',
                      }}
                    />
                  </span>
                ) : (
                  <span key={ri}>{r.t}</span>
                ),
              )}
            </span>
          ))}
        </div>

        <div style={{ opacity: iconOpacity }}>
          <IconRow
            icons={REPLY.icons}
            user
            offset={{ x: -REPLY.box.x, y: -REPLY.box.y }}
          />
        </div>
      </div>
    </div>
  )
}

/** The rule draws across both lines as one gesture: the short run on line 1
 *  goes first, the long run on line 2 picks up where it left off. */
function lineUnderline(u, li) {
  return li === 0 ? clamp01(u / 0.18) : clamp01((u - 0.18) / 0.82)
}

/** The pill has no fill in the export — it is a hairline over the card. The
 *  typing bubble and the reply are solid, and different violets. */
function mixFill(contract, expand) {
  const a = hex(C.purpleTyping)
  const b = hex(C.purple)
  const k = expand
  const c = [0, 1, 2].map((i) => Math.round(lerp(a[i], b[i], k)))
  const alpha = clamp01((contract - 0.5) * 2)
  return `rgba(${c.join(',')},${alpha.toFixed(3)})`
}
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
