import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { StatusBar, CloseButton, TierToggle, OfferTimer } from './Chrome.jsx'
import { Chip, FeatureList, CompareTable, SocialProof, Testimonials, Faq, PriceSheet } from './Sections.jsx'
import CouponTicket from './CouponTicket.jsx'
import { THEMES } from '../theme.js'
import { OFFER } from '../copy.js'

/**
 * The paywall, once.
 *
 * One version only — the coupon ticket. The starburst that shared this file in
 * the V2 prototype is gone rather than switched off, so there is no dead branch
 * pretending to be a choice.
 *
 * `tier` picks the palette. Switching it re-keys the offer block, which
 * replays the entry — the badge respins in the new colour rather than
 * cross-fading, and the coupon re-lands. A tier switch is a change of product,
 * and the offer is the thing that has to re-argue itself.
 */
export default function Paywall({ tier, onTier, run, onReplay, scale = 1 }) {
  const t = THEMES[tier]
  const scroller = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const on = () => setScrolled(el.scrollTop > 8)
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [])

  /* the offer's own key: a tier switch restarts it, the replay button bumps
     `run` */
  const k = `${tier}-${run}`

  return (
    <div className="relative overflow-hidden shrink-0"
         style={{ width: 412, height: 892, borderRadius: 44, background: t.page,
                  transform: `scale(${scale})`, transformOrigin: 'top left',
                  boxShadow: '0 40px 90px rgba(0,0,0,.55), 0 0 0 8px #0b0b0f, 0 0 0 9px rgba(255,255,255,.10)' }}>

      {/* the three blurred plates from the export's `Gradients` group */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {t.glow.map((g, i) => (
          <motion.div key={`${tier}-${i}`} className="absolute"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                      style={{
                        width: g.w, height: g.h, left: g.x, top: g.y, background: g.fill,
                        filter: `blur(${g.blur}px)`, mixBlendMode: g.blend,
                        transform: g.rot ? `rotate(${g.rot}deg)` : undefined,
                      }} />
        ))}
      </div>

      <StatusBar ink={t.chromeInk} />
      <CloseButton t={t} />

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
      <motion.div
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
      />

      <div className="absolute inset-x-0 z-30" style={{ top: 91.8 }}>
        <TierToggle tier={tier} onChange={onTier} t={t} />
      </div>

      <div ref={scroller} className="absolute inset-0 overflow-y-auto no-bar"
           style={{ paddingTop: 158, paddingBottom: 262 }}>

        {/*
          ── the offer ──────────────────────────────────────────────

          The export puts 31.5px between the coupon and the timer, the timer
          and the heading, and the heading and the feature card — one interval,
          three times, and V3 does not move it.
        */}
        <div className="flex flex-col items-center">
          <CouponTicket key={k} run={run} width={250} />
        </div>

        <div style={{ marginTop: 22 }}>
          <OfferTimer run={k} delay={0.55} />
        </div>

        <motion.h1 key={`h-${k}`} className="font-id text-center text-white mx-auto"
                   style={{ width: 244, fontSize: 28, fontWeight: 700, lineHeight: 1.3, marginTop: 31.5 }}
                   initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, delay: 0.7, ease: [0.2, 0.72, 0.24, 1] }}>
          {OFFER.heading[0]}<br />
          <span style={{ color: t.gold }}>{OFFER.heading[1]}</span>{OFFER.heading[2]}
        </motion.h1>

        <div style={{ marginTop: 31.5 }}><FeatureList t={t} tier={tier} /></div>

        <div style={{ marginTop: 40 }}><CompareTable t={t} tier={tier} /></div>

        <div style={{ marginTop: 46, paddingInline: 27 }}><Chip t={t}>What our learners say</Chip></div>
        <div style={{ marginTop: 26 }}><SocialProof t={t} tier={tier} /></div>
        <div style={{ marginTop: 26 }}><Testimonials t={t} /></div>

        <div style={{ marginTop: 46, paddingInline: 27 }}><Chip t={t}>Frequently asked questions</Chip></div>
        <div style={{ marginTop: 18 }}><Faq t={t} tier={tier} /></div>

        <div style={{ height: 30 }} />
      </div>

      <PriceSheet t={t} tier={tier} run={k} />

      {/* replay, on the frame rather than in the page */}
      <button onClick={onReplay}
              className="absolute z-40 rounded-full font-id transition-opacity hover:opacity-100"
              style={{ right: 16, top: 57, height: 26, padding: '0 11px', fontSize: 11, fontWeight: 500,
                       background: 'rgba(255,255,255,.10)', border: `1px solid ${t.chipLine}`, color: 'rgba(255,255,255,.8)', opacity: 0.75 }}>
        Replay
      </button>
    </div>
  )
}
