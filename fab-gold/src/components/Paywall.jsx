import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { StatusBar, CloseButton, TierToggle, OfferTimer, TabBar } from './Chrome.jsx'
import { Chip, FeatureList, CompareTable, SocialProof, Testimonials, Faq, PriceSheet, SHEET_DOCKED } from './Sections.jsx'
import CouponTicket from './CouponTicket.jsx'
import StarburstOffer from './StarburstOffer.jsx'
import { THEMES, GOLD_STAR, GOLD_CTA } from '../theme.js'
import { OFFER, INDIA } from '../copy.js'

/**
 * The paywall, once.
 *
 * `variant` picks the offer block and nothing else — V1 and V2 are the same
 * component with a different child at the top of the scroll and one changed
 * chip in the sheet. That is deliberate: the comparison is only worth anything
 * if the two pages are otherwise byte-identical, so there is no second copy to
 * drift.
 *
 * `tier` picks the palette. Switching it re-keys the offer block, which
 * replays the entry — the badge respins in the new colour rather than
 * cross-fading, and the coupon re-lands. A tier switch is a change of product,
 * and the offer is the thing that has to re-argue itself.
 */
/* India's highlighted word, in the Stimuler PRO wordmark's own gold — the
   pill's three stops, run across the word — rather than the flat offer
   yellow, which read too lemon next to the wordmark above it. */
const HI = {
  background: 'linear-gradient(90deg,#EAB259 0%,#FFE292 50%,#EAB259 100%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  color: 'transparent', WebkitTextFillColor: 'transparent',
}

/**
 * The gift flow drives three more props, all optional:
 *
 * - `bare` renders the page without its own phone frame, filling whatever it
 *   is put in — the flow owns the frame, because the frame outlives the page.
 * - `badge` is `'enter'` (the badge makes its own entrance), `'hidden'` (the
 *   slot is kept but empty, while the badge from the gift is flying into it),
 *   `'still'` (it is there, landed) or `'landed'` (as still, but its contour
 *   rings ripple out as it takes over from the one that flew).
 * - `reveal` holds everything that is not the badge back until the badge has
 *   landed, then brings it up in reading order.
 * - `tabBar` pins the app's tab bar to the bottom, as on the first paywall,
 *   and docks the price sheet on it.
 */
export default function Paywall({ variant, market = 'us', tier: tierIn, theme, onTier, run, onReplay, onClose, scale = 1,
                                  bare = false, badge = 'enter', reveal, tabBar = false }) {
  /* India sells one tier, so it is always PRO — the toggle is not there to
     change it */
  const india = market === 'in'
  const tier = india ? 'pro' : tierIn
  /* `theme` repaints without changing the product: India in gold is still
     PRO, so the palette is PRO+'s but the words it carries — the plan name
     and the CTA — stay PRO's */
  const base = theme && theme !== tier
    ? { ...THEMES[theme], label: THEMES[tier].label, cta: THEMES[tier].cta, wordmark: THEMES[tier].wordmark }
    : THEMES[tier]
  /* India's badge and CTA accents are gold on either palette — see
     GOLD_STAR and GOLD_CTA */
  const t = india ? { ...base, ...GOLD_STAR, ...GOLD_CTA } : base
  const scroller = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const on = () => setScrolled(el.scrollTop > 8)
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [])

  /* the offer's own key: tier and variant both restart it, the replay button
     bumps `run` */
  const k = `${market}-${variant}-${tier}-${theme ?? ''}-${run}`

  /* the flow's staged reveal: item `i` in reading order. Outside the flow
     `reveal` is undefined and these are inert. */
  const flow = reveal !== undefined
  const up = (i) => flow ? {
    initial: false,
    animate: reveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 0.55, delay: reveal ? 0.05 + i * 0.07 : 0, ease: [0.2, 0.72, 0.24, 1] },
  } : {}

  return (
    /* `isolate` keeps the page's own layers (tab bar, sheet, status bar) inside
       the page — without it they would stack against whatever the page is
       mounted under, and the tab bar would show through the gift */
    <div className={bare ? 'absolute inset-0 overflow-hidden isolate' : 'relative overflow-hidden shrink-0'}
         style={bare ? { background: t.page } : {
                  width: 412, height: 892, borderRadius: 44, background: t.page,
                  transform: `scale(${scale})`, transformOrigin: 'top left',
                  boxShadow: '0 40px 90px rgba(0,0,0,.55), 0 0 0 8px #0b0b0f, 0 0 0 9px rgba(255,255,255,.10)' }}>

      {/* the three blurred plates from the export's `Gradients` group */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {t.glow.map((g, i) => (
          <motion.div key={`${theme ?? tier}-${i}`} className="absolute"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                      style={{
                        width: g.w, height: g.h, left: g.x, top: g.y, background: g.fill,
                        filter: `blur(${g.blur}px)`, mixBlendMode: g.blend,
                        transform: g.rot ? `rotate(${g.rot}deg)` : undefined,
                      }} />
        ))}
      </div>

      <StatusBar />
      <motion.div {...up(0)}><CloseButton t={t} onClick={onClose} /></motion.div>

      {/*
        ── the pinned header ──────────────────────────────────────

        The toggle is the first decision on the page and has to stay reachable
        while the comparison table is being read, so it does not scroll.

        What sits behind it is a *masked* backdrop blur rather than an opaque
        bar. A solid band would cut the page in two at a fixed line and make
        the frame read as two panes; the mask lets the blur fall off to nothing
        over its last 45%, so content going under it dissolves instead of
        meeting an edge. The tinted wash on top is the page's own top stop, so
        the band is the background densified rather than a new colour laid over
        it — which is why it survives the tier switch without a second value.
      */}
      {!india && <motion.div
        className="absolute inset-x-0 z-20 pointer-events-none"
        style={{
          top: 45, height: 118,
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          background: `linear-gradient(180deg,${t.scrim} 0%,${t.scrim} 42%,transparent 100%)`,
          maskImage: 'linear-gradient(180deg,#000 0%,#000 55%,transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg,#000 0%,#000 55%,transparent 100%)',
        }}
        animate={{ opacity: scrolled ? 1 : 0.55 }}
        transition={{ duration: 0.28 }}
      />}

      {!india && (
        <div className="absolute inset-x-0 z-30" style={{ top: 91.8 }}>
          <TierToggle tier={tier} onChange={onTier} t={t} />
        </div>
      )}

      <div ref={scroller} className="absolute inset-0 overflow-y-auto no-bar"
           style={{ paddingTop: 158, paddingBottom: tabBar ? SHEET_DOCKED + 89 + 24 : 262 }}>

        {/* India's wordmark sits where the US toggle does, but in the page
            rather than pinned over it: with one tier there is no decision to
            keep in reach, so it scrolls away with everything else */}
        {india && (
          <motion.img {...up(0)} src="/assets/stimuler-pro.svg" alt="Stimuler PRO" width={145} height={32}
                      className="absolute block" style={{ top: 97.5, left: '50%', marginLeft: -72.5 }} />
        )}

        {/*
          ── the offer ──────────────────────────────────────────────

          The export puts 31.5px between the coupon and the timer, the timer
          and the heading, and the heading and the feature card — one interval,
          three times. V2 keeps it. That is the whole reason the badge is sized
          to 196 rather than filling the space the coupon left: swapping the
          block is allowed to change what the offer *is*, not the rhythm the
          rest of the page is set to.

          V2's badge draws at 276 but claims only 244 — the height V1's coupon
          claims — so both versions put the timer, the heading and the feature
          card on the same lines and the card keeps its glimpse above the price
          sheet in both. The badge and its rings overrun that slot on purpose;
          see `StarburstOffer.jsx`.
        */}
        <div className="flex flex-col items-center">
          {variant === 'v1'
            ? <CouponTicket key={k} run={run} width={250} />
            : <div style={{ width: '100%', opacity: badge === 'hidden' ? 0 : 1 }}>
                <StarburstOffer key={`${k}-${badge}`} t={t} run={run} size={276} offLabel={india ? INDIA.off : 'OFF'}
                                still={badge !== 'enter'} rings={badge === 'landed' ? 'ripple' : true} />
              </div>}
        </div>

        <motion.div {...up(1)} style={{ marginTop: variant === 'v1' ? 22 : 26 }}>
          <OfferTimer run={k} delay={flow ? 0 : variant === 'v1' ? 0.55 : 1.05} />
        </motion.div>

        {india ? (
          /* two lines, broken where the brief breaks them — each line is held
             on one line so the break can never drift with the font */
          <motion.h1 key={`h-${k}`} className="font-id text-center text-white mx-auto"
                     style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-.015em', marginTop: 31.5 }}
                     {...(flow ? up(2) : {
                       initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 },
                       transition: { duration: 0.5, delay: 1.2, ease: [0.2, 0.72, 0.24, 1] },
                     })}>
            {INDIA.heading.map((line, i) => (
              <span key={i} className="block whitespace-nowrap">
                {line.map((seg, j) => (
                  <span key={j} style={seg.hi ? HI : undefined}>{seg.text}</span>
                ))}
              </span>
            ))}
          </motion.h1>
        ) : (
          <motion.h1 key={`h-${k}`} className="font-id text-center text-white mx-auto"
                     style={{ width: 244, fontSize: 28, fontWeight: 700, lineHeight: 1.3, marginTop: 31.5 }}
                     initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: variant === 'v1' ? 0.7 : 1.2, ease: [0.2, 0.72, 0.24, 1] }}>
            {OFFER.heading[0]}<br />
            <span style={{ color: t.gold }}>{OFFER.heading[1]}</span>{OFFER.heading[2]}
          </motion.h1>
        )}

        <motion.div {...up(3)} style={{ marginTop: 31.5 }}><FeatureList t={t} tier={tier} /></motion.div>

        <motion.div {...up(4)} style={{ marginTop: 40 }}><CompareTable t={t} tier={tier} table={india ? INDIA.table : undefined} /></motion.div>

        <div style={{ marginTop: 46, paddingInline: 27 }}><Chip t={t}>What our learners say</Chip></div>
        <div style={{ marginTop: 26 }}><SocialProof t={t} tier={tier} /></div>
        {/* the trophy's foot reaches the first card, as iteration-b has it */}
        <div style={{ marginTop: 2 }}><Testimonials t={t} /></div>

        <div style={{ marginTop: 46, paddingInline: 27 }}><Chip t={t}>Frequently asked questions</Chip></div>
        <div style={{ marginTop: 18 }}><Faq t={t} tier={tier} /></div>

        <div style={{ height: 30 }} />
      </div>

      {/* in the flow the sheet rises from below the frame rather than fading —
          it is the one thing on the page that is a surface, not content */}
      <motion.div className="absolute inset-x-0 z-30" style={{ bottom: tabBar ? 89 : 0, height: tabBar ? SHEET_DOCKED : 242 }}
                  {...(flow ? {
                    initial: false,
                    animate: { y: reveal ? 0 : 340 },
                    transition: reveal ? { type: 'spring', visualDuration: 0.6, bounce: 0.18, delay: 0.12 } : { duration: 0 },
                  } : {})}>
        <PriceSheet t={t} tier={tier} variant={variant} run={k} plans={india ? INDIA.plans : undefined} docked={tabBar} glass={tabBar} />
      </motion.div>

      {/* fixed, like the first paywall's — not part of the staged reveal: it
          is the app's, and it is simply there when the gift clears */}
      {tabBar && <TabBar />}

      {/* replay, on the frame rather than in the page */}
      {onReplay && <button onClick={onReplay}
              className="absolute z-40 rounded-full font-id transition-opacity hover:opacity-100"
              style={{ right: 16, top: 57, height: 26, padding: '0 11px', fontSize: 11, fontWeight: 500,
                       background: 'rgba(255,255,255,.10)', border: `1px solid ${t.chipLine}`, color: 'rgba(255,255,255,.8)', opacity: 0.75 }}>
        Replay
      </button>}
    </div>
  )
}
