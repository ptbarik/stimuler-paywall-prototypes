import { useEffect, useRef, useState } from 'react'
import { CTA } from '../copy'
import { SHEET, SHEET_H } from '../design'
import { easeInOut, easeOut, seg } from '../ease'
import { ShieldCheck } from '../Icons'
import OfferTimer from './OfferTimer'

/* ── the strike, in milliseconds from mount ────────────────────────
   Stretched from 1300 to 2900. The first cut was paced like a flourish, and
   this is not a flourish — it is the page's whole argument about price, and it
   was over before the eye had finished arriving at the bottom of the screen.

   Every beat is longer, but the *unstruck hold* is where most of it went:
   ₹1999 now sits there for 800ms before anything happens to it, because the
   strike only means something if the number it crosses out was read first. */
const S = {
  line: [800, 1300], //   the strike draws, left to right
  badge: [1050, 1500], // the badge and the sub-line arrive with it
  reveal: [1400, 2050], //₹1999 out and ₹999 in — one shared move
  chips: [2200, 2550], // the timer settles into its chipped form
}
export const STRIKE_MS = 2900

/** When the button's shine may start: after the price has settled, never over it. */
const SHINE_AT = { offer: 2200, expired: 500 }

/**
 * The pinned CTA — and the price strike, which is the best moment on the page.
 *
 * Every measurement is the `CTA3 - with final offer` export's own; see
 * `design.js` for the layout and for the three details that were wrong before.
 *
 * ── Why the strike is built rather than drawn ─────────────────────
 *
 * A ₹1999 that arrives already crossed out is a claim. A ₹1999 that is present
 * for 800ms, gets crossed out while you watch, and is *replaced* is an event —
 * and the difference costs 2.9s and buys the only piece of theatre on a page
 * that is otherwise a list of features. `CTA1`, `CTA2` and `CTA3` are the three
 * frames of exactly this, in order, which is what says it was meant to move.
 *
 * | ms | |
 * |---|---|
 * | 0–800 | `₹1999`, full size, unstruck, nothing else |
 * | 800–1300 | the line draws — `scaleX` 0→1 from the left, 3px, `#BF4A4A` |
 * | 1050–1500 | the badge and the per-month line arrive with it |
 * | 1400–2050 | `₹1999` out, `₹999` in — **one shared move** |
 * | 2200–2550 | the timer settles into its chipped form |
 *
 * **The swap is one transition, not two.** Both figures occupy the same centred
 * slot and are driven by a single eased value: the old one scales down and
 * fades as the new one scales up and in, on the same curve, at the same
 * moment. Two independently-timed animations in that slot would have to be
 * kept in step by hand forever, and would drift the first time either duration
 * was touched.
 *
 * It now also **runs before the hero does**. The page holds its feature
 * animation until this has finished, so the first thing the eye is given is the
 * price coming down, and only then the reason it is worth it — see `Paywall`.
 *
 * ── The expired state ─────────────────────────────────────────────
 *
 * `CTA1`, held: `₹1999`, no strike, no badge, no timer, no animation at all.
 * The export draws no sub-line on that frame and none is invented here. And
 * nothing anywhere says the offer has ended — no "you missed it", no "come
 * back tomorrow". A page that mourns its own expired discount is telling the
 * user they were too slow, which is not a thing to say to someone who is still
 * considering buying.
 */
export default function PriceCTA({ active, replay, reduced, frozen = null }) {
  const [ms, setMs] = useState(frozen ?? (active ? 0 : STRIKE_MS))
  const raf = useRef(0)

  // one rAF pass per mount (and per replay). Not on scroll, not looping.
  useEffect(() => {
    if (frozen !== null) {
      setMs(frozen)
      return
    }
    if (!active || reduced) {
      setMs(STRIKE_MS) // straight to the settled frame
      return
    }
    let start = null
    setMs(0)
    const tick = (now) => {
      if (start === null) start = now
      const t = now - start
      setMs(t)
      if (t < STRIKE_MS) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [active, replay, reduced, frozen])

  const { halo, trust, badge, chip, box, ember, price, sub, cta, more, strike } = SHEET

  /* ── the shared move ── */
  const p = easeInOut(seg(ms, S.reveal))
  const lineP = easeOut(seg(ms, S.line))
  const chrome = easeOut(seg(ms, S.badge))
  const chips = ms >= S.chips[1] || (ms >= S.chips[0] && seg(ms, S.chips) > 0.5)

  return (
    <div className="sheet" style={{ height: SHEET_H }}>
      {/* the export's blurred gold bar, over the sheet's top edge */}
      <i
        className="halo"
        style={{
          top: halo.top,
          width: halo.w,
          height: halo.h,
          background: halo.color,
          filter: `blur(${halo.blur}px)`,
        }}
      />

      <p className="trust" style={{ top: trust.top, height: trust.h, fontSize: trust.size }}>
        <ShieldCheck />
        {CTA.trust}
      </p>

      {active && (
        <div
          className="badge"
          style={{
            left: (412 - badge.w) / 2 - 1.94,
            top: badge.top,
            width: badge.w,
            height: badge.h,
            borderRadius: badge.r,
            gap: badge.gap,
            fontSize: badge.size,
            opacity: chrome,
            transform: `translateY(${(1 - chrome) * 4}px)`,
          }}
        >
          {CTA.badge}
          <OfferTimer chips={chips} chip={chip} />
        </div>
      )}

      <div
        className="pbox"
        style={{ left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: box.r }}
      >
        {/* the export's warm ellipse, clipped to the box so it lights the top
            edge rather than bleeding out across the sheet */}
        <i
          style={{
            left: ember.x,
            top: ember.y,
            width: ember.w,
            height: ember.h,
            background: ember.color,
            opacity: ember.o,
            filter: `blur(${ember.blur}px)`,
          }}
        />
      </div>

      {/* both prices, one slot */}
      <div
        className="price"
        style={{
          top: (active ? price.withSub : price.alone) - price.line / 2,
          height: price.line,
          fontSize: price.size,
        }}
      >
        {active ? (
          <>
            <span style={{ opacity: 1 - p, transform: `scale(${1 - 0.38 * p})` }}>
              {CTA.full}
              <i
                className="line"
                style={{
                  width: strike.w,
                  marginLeft: -strike.w / 2,
                  marginTop: -strike.h / 2,
                  transform: `scaleX(${lineP})`,
                  opacity: lineP > 0 ? 1 : 0,
                }}
              />
            </span>
            <span style={{ opacity: p, transform: `scale(${0.62 + 0.38 * p})` }}>{CTA.offer}</span>
          </>
        ) : (
          <span>{CTA.full}</span>
        )}
      </div>

      {/* the per-month line only exists while the offer does — `CTA1` draws
          none, and the expired frame is `CTA1` */}
      {active && (
        <p className="sub" style={{ top: sub.centre - 8.5, fontSize: sub.size, opacity: chrome }}>
          {CTA.subOffer}
        </p>
      )}

      <button
        className="cta"
        style={{
          left: cta.x,
          top: cta.y,
          width: cta.w,
          height: cta.h,
          borderRadius: cta.r,
          fontSize: cta.size,
        }}
      >
        <span>{CTA.action}</span>
        {/* The shine mounts rather than being delayed in CSS, so it restarts
            with the strike on every replay — and it mounts only once the price
            has settled. A button glinting *underneath* a price being struck
            through is two things asking for the same glance. */}
        {!reduced && ms >= (active ? SHINE_AT.offer : SHINE_AT.expired) && <i className="shine" />}
      </button>

      <button className="more" style={{ top: more.top, height: more.h, fontSize: more.size }}>
        {CTA.more}
      </button>
    </div>
  )
}
