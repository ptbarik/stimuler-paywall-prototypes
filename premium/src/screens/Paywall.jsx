import { useCallback, useEffect, useRef, useState } from 'react'
import { SLIDES } from '../copy'
import { CAPTION, DOTS, HEADER, HERO, PAGE_H, SHEET_H } from '../design'
import { LOOP, STEP, indexAt } from '../carousel.timing'
import Carousel from '../components/Carousel'
import { Claim, ComparisonTable, Faq, Loved, Testimonials } from '../components/Sections'

/**
 * The paywall.
 *
 * `7.png` is a 412×2470 page and this is that page: header, the animation, the
 * dashes, the caption, Free vs PRO, the laurel band, the 92% claim,
 * testimonials, the FAQ, and the CTA pinned over the bottom 308 of it.
 *
 * ── The hero is one carousel, not four blocks ─────────────────────
 *
 * The export draws the Sarah call at the top with four pagination dashes under
 * it and one caption under those. The other three scenes float loose beside
 * the flow with a caption each. So this is not four stacked feature sections —
 * it is the consolidated carousel in one slot, with the caption changing per
 * slide, which is what the dashes are there to say.
 *
 * That also settles the scroll-trigger question the brief raises (play at 40%
 * visibility, one at a time, never restart): there is only ever one animation
 * on the page, it owns its slot, and it never competes with a second. The
 * scroll rules exist to stop four animations fighting; with one there is
 * nothing to arbitrate.
 *
 * ── The price goes first ──────────────────────────────────────────
 *
 * On landing, the hero is held at its first frame and faded out while the
 * price strike plays in the pinned card, and only then does it start — from
 * the Sarah call, always, because the carousel is a loop and resuming it
 * wherever it happened to be means starting a quarter of the way into the
 * report scene with no idea what it is.
 *
 * The order is the argument: **what it costs, then why it is worth it.**
 * Running both at once splits the attention of the one moment the page has to
 * make its case, and the animation always wins that fight — it moves more, and
 * it is at the top of the screen.
 *
 * ── The caption crossfades, the dash travels ──────────────────────
 *
 * The live dash grows and the others shrink on the same 320ms curve, so the
 * indicator moves rather than blinks. The caption crossfades over the join
 * instead of cutting at it — a hard swap draws the eye to the text at the
 * exact moment the picture is moving, which is the one moment the text should
 * not be the interesting thing on screen.
 */
export default function Paywall({ t, reduced, sheet, captions = SLIDES, scrollTo }) {
  const [faqExtra, setFaqExtra] = useState(0)
  const [claimSeen, setClaimSeen] = useState(false)
  const scroll = useRef(null)

  const faqBase = useRef(null)
  const onFaqResize = useCallback((h) => {
    if (faqBase.current === null) faqBase.current = h
    setFaqExtra(Math.max(0, h - faqBase.current))
  }, [])

  /* The 92% count fires once, when the claim comes into view — measured
     against the scroll container rather than the window, because the page
     scrolls inside a 917px frame and `IntersectionObserver`'s default root is
     the viewport, which the whole frame is already inside. */
  useEffect(() => {
    const el = scroll.current
    if (!el) return
    if (scrollTo) el.scrollTop = scrollTo
    const check = () => {
      // the claim block sits at page y 1229; 40% of the way up the frame is
      // where it counts as read
      if (el.scrollTop + 917 * 0.75 > 1235) setClaimSeen(true)
    }
    check()
    el.addEventListener('scroll', check, { passive: true })
    return () => el.removeEventListener('scroll', check)
  }, [scrollTo])

  const live = indexAt(t)
  // how far through the current slide's *exit* we are, for the caption fade
  const v = ((t % LOOP) + LOOP) % LOOP - live * STEP
  const fade = v > STEP - 500 ? (STEP - v) / 500 : v < 260 ? v / 260 : 1

  const cap = captions[live] ?? captions[0]

  /* The hero is fully present from the first frame — it is simply not moving
     yet. See `HERO_POSTER`: it holds the still the export draws in this slot,
     so what waits for the price is a paused screen rather than an empty one. */

  return (
    <>
      <div className="scroll" ref={scroll}>
        <div className="page" style={{ height: PAGE_H + faqExtra }}>
          <div className="glows">
            <i className="g1" />
            <i className="g2" />
            <i className="g3" />
          </div>

          <div className="head" style={{ top: HEADER.top, gap: HEADER.gap }}>
            <span>Stimuler</span>
            <span className="pill">PRO</span>
          </div>

          <div
            className="hero"
            style={{ left: HERO.x, top: HERO.y, width: HERO.w, height: HERO.h }}
          >
            <Carousel t={t} reduced={reduced} />
          </div>

          <div className="dots" style={{ left: DOTS.x, top: DOTS.y, gap: DOTS.gap }}>
            {captions.map((s, i) => (
              <i
                key={s.scene}
                className={i === live ? 'on' : ''}
                style={{ width: i === live ? DOTS.on : DOTS.off }}
              />
            ))}
          </div>

          <p
            className="cap"
            style={{
              top: CAPTION.top,
              fontSize: CAPTION.size,
              lineHeight: `${CAPTION.line}px`,
              opacity: reduced ? 1 : fade,
            }}
          >
            {cap.a}
            <em>{cap.b}</em>
          </p>

          <ComparisonTable />
          <Loved reduced={reduced} />
          <Claim shown={claimSeen} reduced={reduced} />
          <Testimonials />
          <Faq onResize={onFaqResize} />

          {/* the page reserves the pinned CTA's height, so at full scroll the
              last FAQ row clears it instead of sitting behind it */}
          <div style={{ height: SHEET_H }} />
        </div>
      </div>

      {sheet}
    </>
  )
}
