import { useState } from 'react'
import { GlassFilter, SUPPORTS_BACKDROP_URL, useGlassMap } from './Glass.jsx'
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
export function CompareTable({ t, tier, table }) {
  /* US: PRO vs PRO+, the lit column follows the toggle. India: FREE vs PRO,
     with PRO — the second column — always lit. */
  const title = table?.title ?? 'PRO vs PRO+'
  const head = table?.head ?? ['PRO', 'PRO+']
  const rows = table?.rows ?? TABLE
  const lit = table ? 1 : tier === 'pro' ? 0 : 1
  return (
    <div className="mx-auto rounded-[16px] relative"
         style={{ width: 358, background: t.panel, border: `1px solid ${t.cardLine}`, padding: '18px 14px 20px' }}>
      <div className="mb-[18px]"><Chip t={t}>{title}</Chip></div>

      <div className="relative">
        {/* the lit column, one element that slides. Its left edge is the
            column's own — 146 past the labels, 85 per column — so the values
            sit dead centre in it. It used to stop at 236 for the second
            column, 5px right of where that column starts. */}
        <motion.div
          className="absolute rounded-[12px] pointer-events-none"
          style={{ top: -4, bottom: -6, width: 85, background: t.colFill, border: `1px solid ${t.colLine}` }}
          initial={false}
          animate={{ left: 146 + lit * 85 }}
          transition={{ type: 'spring', visualDuration: 0.45, bounce: 0.2 }}
        />

        {/* the two column pills */}
        <div className="relative flex items-center h-[22px] mb-[10px]">
          <div style={{ width: 146 }} />
          {head.map((label, i) => (
            <div key={label} style={{ width: 85 }} className="grid place-items-center">
              {/* India's FREE heads its column as plain text, not a pill —
                  a gold pill would read as a second paid tier */}
              <span className="rounded-full font-id grid place-items-center"
                    style={{
                      width: 54, height: 20,
                      background: i === lit ? t.pillOwn : table ? 'transparent' : t.pillOther,
                      color: i === lit ? t.pillOwnInk : table ? '#fff' : t.pillOtherInk,
                      fontSize: 13, fontWeight: 500,
                    }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {rows.map(([label, a, b], r) => (
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
                      color: i === lit ? '#fff' : 'rgba(255,255,255,.45)',
                      fontWeight: i === lit ? 500 : 400,
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

/**
 * The proof block — stacked the way iteration-b stacks it
 * (stimuler-paywall-carousel-b), because side by side in 358 it read as two
 * loose rows fighting for the width.
 *
 * One composed piece, 412 wide, placed off that build's own coordinates:
 *
 *   the stats line  — `LOVED BY / 13Mn+ / users` and `4.9 / Learner’s rating
 *                     / stars`, each between its own pair of laurels, on one
 *                     line 46 in from the left.
 *   the award       — the trophy on the left, its foot reaching the card
 *                     below, and `Awarded / Google play / Best AI App /
 *                     Worldwide` set right-aligned against it in Rubik, the
 *                     way that page sets it.
 *
 * The award starts 45 under the stats line — it overlaps the line's box on
 * purpose, because the trophy's top is empty air and a clean gap left a hole.
 */
export function SocialProof({ t, tier }) {
  const p = PROOF[tier]
  const lr = (left, flip) => (
    <div className="absolute flex items-center justify-center" style={{ left, top: 0, width: 52.777, height: 55.491 }}>
      <img src={`/assets/laurel-${flip ? 'a' : 'b'}.svg`} alt="" style={{ display: 'block', width: 35.92, height: 43.338,
                                                                          transform: flip ? 'rotate(150deg) scaleY(-1)' : 'rotate(30deg)' }} />
    </div>
  )
  const num = { color: '#fff', fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700, whiteSpace: 'nowrap', textAlign: 'center' }
  return (
    <div className="relative" style={{ width: 412, height: 215 }}>
      {/* the stats line */}
      <div className="absolute" style={{ left: 46.094, top: 0, width: 319.816, height: 56 }}>
        {lr(0, false)}
        {lr(112.34, true)}
        <div className="absolute" style={{ ...num, left: 61.81, top: 0.09, fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 5.982, lineHeight: 0.86, letterSpacing: 2.03 }}>LOVED BY</div>
        <div className="absolute" style={{ ...num, left: 47.3, top: 11.13, fontSize: 21.968, lineHeight: 0.86, letterSpacing: -0.44 }}>
          {p.users}<span className="block" style={{ fontWeight: 400 }}>users</span>
        </div>
        {lr(161.46, false)}
        {lr(273.79, true)}
        <div className="absolute" style={{ ...num, left: 204.8, top: 0, fontSize: 21.969, lineHeight: 1.14 }}>
          {p.rating}<span className="block" style={{ fontWeight: 400, fontSize: 10.568, lineHeight: 1.14 }}>Learner’s rating</span>
        </div>
        <img src="/assets/stars.svg" alt="" className="absolute block" style={{ left: 211.83, top: 40.58, width: 63.767, height: 9.825 }} />
      </div>

      {/* the award */}
      <div className="absolute" style={{ left: 18.781, top: 45, width: 341.161, height: 169.949 }}>
        <div className="absolute overflow-hidden" style={{ left: 30.7, top: 20.85, width: 150.048, height: 150.048 }}>
          <img src="/assets/trophy-award.png" alt="" className="absolute block"
               style={{ left: 0, top: '-8.33%', width: '108.79%', height: '108.33%', maxWidth: 'none' }} />
        </div>
        <div className="absolute text-right" style={{ left: 175.953, top: 38.888, width: 141.203, fontFamily: 'Rubik, sans-serif' }}>
          <p style={{ margin: 0, fontWeight: 400, fontSize: 12.807, lineHeight: 1.3, color: t.awarded }}>Awarded</p>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 23.053, lineHeight: 1.15, color: t.awardText }}>Google play</p>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 23.053, lineHeight: 1.3, color: t.awardText }}>Best AI App Worldwide</p>
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
/* docked on the tab bar the sheet loses the home indicator's 26 — the bar
   below is the screen's edge now */
export const SHEET_DOCKED = 216

/* the first paywall's glass, by its Figma numbers — Refraction 100, Depth
   63, Dispersion 50, Frost 23, Splay 0 */
const FIGMA_GLASS = { refraction: 100, depth: 63, dispersion: 50, frost: 23, splay: 0 }

export function PriceSheet({ t, tier, variant, run, plans, docked = false, glass = false }) {
  const H = docked ? SHEET_DOCKED : 242
  const g = FIGMA_GLASS
  const map = useGlassMap({
    w: 412, h: H, radius: 18,
    refraction: g.refraction / 100, depth: Math.max(1, g.depth), splay: g.splay / 100,
  })
  const live = glass && SUPPORTS_BACKDROP_URL && map
  const backdropFilter = live ? 'url(#offer-sheet-glass)' : `blur(${g.frost * 0.2}px) saturate(1.35)`
  const [plan, setPlan] = useState('yearly')
  const p = PRICE[tier]
  const word = t.wordmark

  return (
    <div className="absolute inset-x-0 bottom-0 z-30" style={{ height: H }}>
      <div className="absolute inset-x-0 top-0 h-[14px]" style={{ background: t.sheetHalo, filter: 'blur(20px)' }} />
      {glass ? (
        /* glass, as on the first paywall: the page behind is refracted and
           frosted, then tinted by the sheet's own stops at 20%; a lit top
           edge, faint side rims, and the −45° sheen off the top-left */
        <>
          {live && <GlassFilter id="offer-sheet-glass" w={412} h={H} map={map}
                                depth={g.depth} dispersion={g.dispersion / 100} frost={g.frost * 0.2} />}
          <div className="absolute inset-0 rounded-t-[18px]"
               style={{ background: t.sheetGlass, backdropFilter, WebkitBackdropFilter: backdropFilter,
                        borderTop: `1px solid ${t.sheetLine}`,
                        boxShadow: `inset 1px 0 0 ${t.sheetLine}33, inset -1px 0 0 ${t.sheetLine}33, inset 0 1px 0 rgba(255,255,255,.07), 0 -20px 44px rgba(0,0,0,.35)` }} />
          <div className="absolute inset-0 rounded-t-[18px] pointer-events-none"
               style={{ background: 'linear-gradient(135deg,rgba(255,255,255,.11) 0%,rgba(255,255,255,.035) 26%,rgba(255,255,255,0) 54%)' }} />
        </>
      ) : (
        <div className="absolute inset-0 rounded-t-[18px]" style={{ background: t.sheet, borderTop: `1px solid ${t.sheetLine}` }} />
      )}

      <div className="relative pt-[9px]">
        <div className="flex items-center justify-center gap-[6px]" style={{ color: '#fff' }}>
          <Shield />
          <span className="font-id" style={{ fontSize: 11.9, fontWeight: 500 }}>{OFFER.reassure}</span>
        </div>

        {plans ? <PlanCards t={t} plans={plans} plan={plan} setPlan={setPlan} /> : (
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
        )}

        {/*
          The CTA, with a shine crossing it on a slow loop.

          The sweep is at 20° rather than vertical so it reads as light moving
          across a surface rather than a bar wiping the button, and it rests
          for most of its cycle — the highlight is 30% of the button wide and
          spends ~3s of every 4.2 off the right-hand edge. A shine that is
          always mid-crossing stops being an accent and becomes a spinner.

          `--shine` is the tier's own highlight: white on PRO's indigo, and a
          warm white on PRO+, because pure white over gold reads as a blowout.
        */}
        <button className="cta mx-auto mt-[10px] grid place-items-center rounded-full font-id relative overflow-hidden transition-transform active:scale-[.985]"
                style={{ width: 374, height: 54, background: t.buy, color: t.buyInk, fontSize: 18, fontWeight: 600, letterSpacing: '-.01em', boxShadow: '-8px 11px 12px rgba(15,13,37,.25)', '--shine': t.shine, '--shine-core': t.shineCore }}>
          <span className="relative z-10">{t.cta}</span>
          <span className="cta-shine" aria-hidden="true" />
        </button>
      </div>

      {!docked && (
        <div className="absolute inset-x-0 bottom-0 h-[26px] grid place-items-center">
          <span className="rounded-full" style={{ width: 128, height: 4.8, background: '#fff', opacity: 0.9 }} />
        </div>
      )}
    </div>
  )
}

/**
 * The first paywall's plan cards, in this page's palette.
 *
 * Same information design as `pro-v2`'s sheet: a label with the badge
 * opposite it, the monthly figure at 19.16/600, and a 10px line under it.
 * Same box too — 90 tall, 13.4 in, 11.5 round. The cards are solid (only
 * the sheet behind them is glass): on purple they are the first paywall's
 * own two fills, on gold the same pair in the page's browns. The picked card
 * takes the tier's stroke; the badge is the first paywall's gold, in both.
 */
function PlanCards({ t, plans, plan, setPlan }) {
  return (
    <div className="flex gap-[10px] mt-[10px]" style={{ paddingInline: 15 }}>
      {plans.map((c) => {
        const on = plan === c.id
        return (
          <button key={c.id} onClick={() => setPlan(c.id)}
                  className="flex-1 text-left transition-colors flex flex-col items-start"
                  style={{
                    height: 90, padding: 13.41, gap: 3.83, borderRadius: 11.5,
                    border: `1px solid ${on ? t.planPickLine : t.planLine}`,
                    background: on ? t.cardPickFill : t.cardFill,
                  }}>
            <div className="flex items-center justify-between w-full" style={{ height: 20.12 }}>
              <span className="font-id" style={{ fontSize: 12, fontWeight: 500, lineHeight: '17px', letterSpacing: '-.01em', color: '#fff' }}>{c.label}</span>
              {c.badge && (
                <span className="font-id" style={{ padding: '1.04px 8.31px', borderRadius: 3.12, fontSize: 10.71, fontWeight: 600, lineHeight: '15px',
                                                  letterSpacing: '-.01em', color: '#201C47',
                                                  background: 'conic-gradient(from 181.89deg at 50% 50%,#FFB85B 0deg,#FFEB9D 174.81deg,#FFC342 360deg)' }}>
                  {c.badge}
                </span>
              )}
            </div>
            <span className="font-id" style={{ fontSize: 19.16, fontWeight: 600, lineHeight: '27px', letterSpacing: '-.01em', color: '#fff', whiteSpace: 'nowrap' }}>{c.price}</span>
            <span className="font-id" style={{ fontSize: 10, fontWeight: 500, lineHeight: '14px', letterSpacing: '-.01em', color: t.planNote, whiteSpace: 'nowrap' }}>{c.note}</span>
          </button>
        )
      })}
    </div>
  )
}
