import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ICONS, Chevron, Star, Laurel, Shield } from '../Icons.jsx'
import { FEATURES, TABLE, PROOF, TESTIMONIALS, FAQ, FAQ_BODY, PRICE, OFFER } from '../copy.js'

/**
 * The section headers — `PRO vs PRO+`, `What our learners say`.
 *
 * V3 turns these from hairline outlines into solid plates: 38 tall, 10 radius,
 * `14px 16px` padding, on the tier's own near-black, and set in Geist 500 at
 * 13.73 rather than Inter Display. The shadow is the export's own
 * `0 -2px 12.68 rgba(0,0,0,.2)` — lit from below, which is what keeps a plate
 * that is darker than the page from reading as a hole in it.
 */
export function Chip({ children, t }) {
  return (
    <div className="inline-flex items-center justify-center font-geist"
         style={{
           height: 38, padding: '14px 16px', borderRadius: 10,
           background: t.chip, color: t.chipInk,
           fontSize: 13.73, fontWeight: 500, lineHeight: '10px',
           boxShadow: '0 -2px 12.68px rgba(0,0,0,.2)',
         }}>
      {children}
    </div>
  )
}

/** The four-row feature card. */
export function FeatureList({ t, tier }) {
  return (
    <div className="mx-auto rounded-[14px]"
         style={{ width: 320, background: t.card, border: `1px solid ${t.cardLine}`, padding: 12 }}>
      {FEATURES[tier].map(([key, label], i) => {
        const Icon = ICONS[key]
        return (
          <motion.div key={`${tier}-${key}`} className="flex items-center gap-[12px]"
                      style={{ marginTop: i ? 12 : 0, color: '#fff', minHeight: 25 }}
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.34, delay: 0.05 * i }}>
            <span className="shrink-0 grid place-items-center" style={{ width: 22, opacity: 0.9 }}>
              <Icon />
            </span>
            <span className="font-id" style={{ fontSize: 13.5, fontWeight: 400, color: 'rgba(255,255,255,.92)' }}>{label}</span>
          </motion.div>
        )
      })}
    </div>
  )
}

/**
 * PRO vs PRO+.
 *
 * The lit column is the tier you are on — it moves rather than re-renders, so
 * switching tiers slides the highlight across the table instead of flashing
 * one on and one off. The two value columns are at 190.3 and 285.3 in the
 * export, 84.8 apart; that spacing is what the two `w-[85px]` cells are.
 */
export function CompareTable({ t, tier }) {
  return (
    <div className="mx-auto rounded-[16px] relative"
         style={{ width: 358, background: t.panel, border: `1px solid ${t.cardLine}`, padding: '18px 14px 20px' }}>
      <div className="mb-[18px]"><Chip t={t}>PRO vs PRO+</Chip></div>

      <div className="relative">
        {/* the lit column, one element that slides */}
        <motion.div
          className="absolute rounded-[12px] pointer-events-none"
          style={{ top: -4, bottom: -6, width: 85, background: t.colFill, border: `1px solid ${t.colLine}` }}
          animate={{ left: tier === 'pro' ? 146 : 236 }}
          transition={{ type: 'spring', visualDuration: 0.45, bounce: 0.2 }}
        />

        {/* the two tier pills */}
        <div className="relative flex items-center h-[22px] mb-[10px]">
          <div style={{ width: 146 }} />
          {['PRO', 'PRO+'].map((label, i) => (
            <div key={label} style={{ width: 85 }} className="grid place-items-center">
              <span className="rounded-full font-id grid place-items-center"
                    style={{
                      width: 54, height: 20,
                      background: (i === 0) === (tier === 'pro') ? t.pillOwn : t.pillOther,
                      color: (i === 0) === (tier === 'pro') ? t.pillOwnInk : t.pillOtherInk,
                      fontSize: 13, fontWeight: 500,
                    }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {TABLE.map(([label, a, b], r) => (
          <div key={label} className="relative flex items-center"
               style={{ minHeight: 46, borderTop: r ? '1px solid rgba(255,255,255,.07)' : 'none' }}>
            <span className="font-id whitespace-pre-line"
                  style={{ width: 146, fontSize: 12.5, color: 'rgba(255,255,255,.82)', lineHeight: 1.3, paddingRight: 8 }}>
              {label}
            </span>
            {[a, b].map((v, i) => (
              <span key={i} className="font-id whitespace-pre-line text-center"
                    style={{
                      width: 85, fontSize: 12.5, lineHeight: 1.25,
                      color: (i === 0) === (tier === 'pro') ? '#fff' : 'rgba(255,255,255,.45)',
                      fontWeight: (i === 0) === (tier === 'pro') ? 500 : 400,
                    }}>
                {v}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** 13Mn+ users, 4.9, the laurels and the Play trophy. */
export function SocialProof({ t, tier }) {
  const p = PROOF[tier]
  return (
    <div style={{ width: 358 }} className="mx-auto">
      {/* four branches and two figures inside 358: at h 64 the row overran
          the panel and clipped the last laurel, so the branch is 56 */}
      <div className="flex items-center justify-center gap-[7px]">
        <Laurel h={56} color={t.laurel} />
        <div className="text-center" style={{ marginInline: -2 }}>
          <div className="font-poppins" style={{ fontSize: 8.5, letterSpacing: '.14em', color: 'rgba(255,255,255,.65)', fontWeight: 600 }}>LOVED BY</div>
          <div className="font-poppins text-white" style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-.02em' }}>{p.users}</div>
          <div className="font-poppins text-white" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em' }}>users</div>
        </div>
        <Laurel h={56} color={t.laurel} flip />
        <Laurel h={56} color={t.laurel} />
        <div className="text-center" style={{ marginInline: -2 }}>
          <div className="font-poppins text-white" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.1 }}>{p.rating}</div>
          <div className="font-poppins" style={{ fontSize: 10, color: 'rgba(255,255,255,.8)', fontWeight: 500 }}>Learner’s rating</div>
          <div className="flex justify-center gap-[2px] mt-[3px]">
            {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={10} fill={t.star} />)}
          </div>
        </div>
        <Laurel h={56} color={t.laurel} flip />
      </div>

      <div className="flex items-center gap-[10px] mt-[14px]">
        <img src="/assets/trophy.png" alt="" width="132" height="132"
             style={{ marginLeft: -12, filter: 'drop-shadow(0 12px 22px rgba(0,0,0,.5))' }} />
        <div>
          <div className="font-poppins text-right" style={{ fontSize: 12, fontWeight: 600, color: t.awarded }}>Awarded</div>
          <div className="font-poppins text-right text-white" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.18, letterSpacing: '-.02em' }}>
            Google play<br />Best AI App<br />Worldwide
          </div>
        </div>
      </div>
    </div>
  )
}

/** The learner cards, on the export's peeking horizontal rail. */
export function Testimonials({ t }) {
  return (
    <div className="overflow-x-auto no-bar" style={{ paddingInline: 27 }}>
      <div className="flex gap-[14px] pb-[6px]" style={{ width: 'max-content' }}>
        {TESTIMONIALS.map((q) => (
          <div key={q.name} className="rounded-[16px] shrink-0"
               style={{ width: 240, background: t.card, border: `1px solid ${t.cardLine}`, padding: '20px 18px 22px' }}>
            {q.photo ? (
              <img src={q.photo} alt="" className="mx-auto rounded-[16px] object-cover" style={{ width: 108, height: 108 }} />
            ) : (
              <div className="mx-auto rounded-[16px] grid place-items-center font-poppins"
                   style={{ width: 108, height: 108, background: t.panel, border: `1px solid ${t.cardLine}`, color: t.name, fontSize: 32, fontWeight: 700 }}>
                {q.name[0]}
              </div>
            )}
            <p className="font-poppins text-center text-white" style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.45, marginTop: 18 }}>{q.quote}</p>
            <p className="font-urbanist text-center" style={{ fontSize: 15, fontWeight: 700, fontStyle: 'italic', color: t.name, marginTop: 16 }}>{q.name}</p>
            <p className="font-poppins text-center" style={{ fontSize: 10.5, fontWeight: 700, color: t.role, marginTop: 4 }}>{q.role}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Faq({ t, tier }) {
  const [open, setOpen] = useState(null)
  return (
    <div style={{ width: 358 }} className="mx-auto">
      {FAQ[tier].map((q, i) => (
        <div key={q} style={{ borderTop: i ? '1px solid rgba(255,255,255,.09)' : 'none' }}>
          <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-start justify-between gap-[14px] text-left"
                  style={{ padding: '18px 2px', color: '#fff' }}>
            <span className="font-id" style={{ fontSize: 13.5, fontWeight: 400, lineHeight: 1.4 }}>{q}</span>
            <span style={{ opacity: 0.75, marginTop: 1 }}><Chevron open={open === i} /></span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                <p className="font-id" style={{ fontSize: 12.5, lineHeight: 1.55, color: 'rgba(255,255,255,.6)', paddingBottom: 18, paddingRight: 28 }}>
                  {FAQ_BODY[i]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

/**
 * The pinned sheet.
 *
 * V2 is the only one that shows `was` — the coupon put the discount on paper,
 * so V1's yearly card carries a `50% OFF` chip and nothing struck through. In
 * V2 the badge has already said `50% OFF`, so repeating it on the chip is
 * noise; the card shows the price it replaces instead.
 */
export function PriceSheet({ t, tier, run }) {
  const [plan, setPlan] = useState('yearly')
  const p = PRICE[tier]
  const word = t.wordmark

  return (
    <div className="absolute inset-x-0 bottom-0 z-30" style={{ height: 242 }}>
      <div className="absolute inset-x-0 top-0 h-[14px]" style={{ background: t.sheetHalo, filter: 'blur(20px)' }} />
      <div className="absolute inset-0 rounded-t-[18px]" style={{ background: t.sheet, borderTop: `1px solid ${t.sheetLine}` }} />

      <div className="relative pt-[9px]">
        <div className="flex items-center justify-center gap-[6px]" style={{ color: '#fff' }}>
          <Shield />
          <span className="font-id" style={{ fontSize: 11.9, fontWeight: 500 }}>{OFFER.reassure}</span>
        </div>

        <div className="flex gap-[8px] mt-[10px]" style={{ paddingInline: 19 }}>
          {[
            ['yearly', `${word} YEARLY`, p.yearly],
            ['monthly', `${word} MONTHLY`, p.monthly],
          ].map(([id, label, price]) => {
            const on = plan === id
            return (
              /*
                The picked card's 2px stroke is a gradient, so it cannot be a
                `border-color`. It is painted as two stacked backgrounds — the
                fill clipped to `padding-box`, the gradient to `border-box` —
                with the border itself transparent. That is the one technique
                that gives a gradient stroke which still follows the 11.5px
                radii; `border-image` does not round.

                The unpicked card keeps a flat 1px `#4B4789`, so the two are
                deliberately not the same construction: only the selected one
                is carrying a gradient, and only it needs the extra paint.
              */
              <button key={id} onClick={() => setPlan(id)}
                      className="flex-1 rounded-[11.5px] text-left transition-colors"
                      style={
                        on
                          ? {
                              padding: 12.4, minHeight: 77,
                              border: '2px solid transparent',
                              background: `linear-gradient(${t.planPickFill},${t.planPickFill}) padding-box, ${t.planPickLine} border-box`,
                            }
                          : {
                              padding: 13.4, minHeight: 77,
                              border: `1px solid ${t.planLine}`,
                              background: 'transparent',
                            }
                      }>
                <div className="flex items-center gap-[6px]">
                  <span className="font-id" style={{ fontSize: 9.6, fontWeight: 500, color: '#fff', letterSpacing: '-.01em' }}>{label}</span>
                  {id === 'yearly' && (
                    <span className="rounded-[3px] font-id grid place-items-center"
                          style={{ height: 18, padding: '0 7px', background: t.save, color: t.saveInk, fontSize: 9.6, fontWeight: 600 }}>
                      {p.off}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-[7px] mt-[4px]">
                  <span className="font-id" style={{ fontSize: 19.2, fontWeight: 600, color: '#fff', letterSpacing: '-.01em' }}>{price}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/*
          The CTA, with a shine crossing it on a slow loop.

          The sweep is at 20° rather than vertical so it reads as light moving
          across a surface rather than a bar wiping the button, and it rests
          for most of its cycle — the highlight is 24% of the button wide and
          spends two thirds of every 4.2s off the right-hand edge. A shine that
          is always mid-crossing stops being an accent and becomes a spinner.

          `--shine` is the tier's own: white on PRO's indigo, and a warm white
          on PRO+, because pure white over gold reads as a blowout.

          `isolation: isolate` is the V3 export's own and it is load-bearing —
          it gives the button its own stacking context, so the sweep is clipped
          by the pill instead of escaping over the sheet.
        */}
        <button className="cta mx-auto mt-[10px] grid place-items-center rounded-full font-id relative overflow-hidden transition-transform active:scale-[.985]"
                style={{
                  width: 374, height: 54, background: t.buy, color: t.buyInk,
                  fontSize: 18, fontWeight: 600, letterSpacing: '-.01em',
                  boxShadow: '-8px 11px 12px rgba(15,13,37,.25)',
                  isolation: 'isolate', '--shine': t.shine, '--shine-core': t.shineCore,
                }}>
          <span className="relative z-10">{t.cta}</span>
          <span className="cta-shine" aria-hidden="true" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[26px] grid place-items-center">
        <span className="rounded-full" style={{ width: 128, height: 4.8, background: '#fff', opacity: 0.9 }} />
      </div>
    </div>
  )
}
