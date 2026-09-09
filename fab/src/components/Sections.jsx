import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ICONS, Chevron, Star, Laurel, Shield } from '../Icons.jsx'
import { FEATURES, TABLE, PROOF, TESTIMONIALS, FAQ, FAQ_BODY, PRICE, OFFER } from '../copy.js'

/** The section headers — a hairline chip, `PRO vs PRO+` / `What our learners say`. */
export function Chip({ children, t }) {
  return (
    <div className="inline-flex items-center rounded-[10px] font-id"
         style={{ padding: '9px 14px', border: `1px solid ${t.chipLine}`, color: '#fff', fontSize: 14, fontWeight: 500 }}>
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
export function PriceSheet({ t, tier, variant, run }) {
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
              <button key={id} onClick={() => setPlan(id)}
                      className="flex-1 rounded-[11.5px] text-left transition-colors"
                      style={{
                        padding: 13.4, minHeight: 77,
                        border: `1px solid ${on ? t.planPickLine : t.planLine}`,
                        background: on ? t.planPickFill : 'transparent',
                      }}>
                <div className="flex items-center gap-[6px]">
                  <span className="font-id" style={{ fontSize: 9.6, fontWeight: 500, color: '#fff', letterSpacing: '-.01em' }}>{label}</span>
                  {id === 'yearly' && variant === 'v1' && (
                    <span className="rounded-[3px] font-id grid place-items-center"
                          style={{ height: 18, padding: '0 7px', background: t.save, color: t.saveInk, fontSize: 9.6, fontWeight: 600 }}>
                      {p.off}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-[7px] mt-[4px]">
                  <span className="font-id" style={{ fontSize: 19.2, fontWeight: 600, color: '#fff', letterSpacing: '-.01em' }}>{price}</span>
                  {id === 'yearly' && variant === 'v2' && (
                    <motion.span key={`${run}-was`} className="font-id relative"
                                 style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,.42)' }}
                                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 1.0 }}>
                      {p.was}
                      <motion.span className="absolute left-0 top-1/2 h-[1px] w-full origin-left"
                                   style={{ background: 'rgba(255,255,255,.55)' }}
                                   initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                                   transition={{ duration: 0.34, delay: 1.2, ease: [0.2, 0.7, 0.2, 1] }} />
                    </motion.span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <button className="mx-auto mt-[10px] grid place-items-center rounded-full font-id transition-transform active:scale-[.985]"
                style={{ width: 374, height: 54, background: t.buy, color: t.buyInk, fontSize: 18, fontWeight: 600, letterSpacing: '-.01em', boxShadow: '-8px 11px 12px rgba(15,13,37,.25)' }}>
          {t.cta}
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[26px] grid place-items-center">
        <span className="rounded-full" style={{ width: 128, height: 4.8, background: '#fff', opacity: 0.9 }} />
      </div>
    </div>
  )
}
