import { useEffect, useRef, useState } from 'react'
import { AWARD, BENEFITS, FAQS, TABLE, TABLE_ROWS, TESTIMONIALS, benefitText } from './design'
import { BENEFIT_ICONS, Chevron } from './Icons'

/* ── the tier toggle ──────────────────────────────────────────────────
   The only control above the fold, and the page's single piece of state: the
   background, the headline accent, one benefit line, the table highlight, the
   testimonial colours, the sheet and the CTA all read off it.

   The thumb travels on the spring; everything else crossfades on the 250ms
   ease-out. Two different curves on purpose — the thing that *moves* should
   settle, the things that only *recolour* should not. */
export function TierToggle({ tier, setTier }) {
  return (
    <div className="seg" role="tablist" aria-label="Plan tier">
      <span className="rim" />
      <div className="thumb" />
      <button className="s-pro" role="tab" aria-selected={tier === 'pro'} onClick={() => setTier('pro')}>
        Stimuler Pro
      </button>
      <button className="s-plus" role="tab" aria-selected={tier === 'plus'} onClick={() => setTier('plus')}>
        Stimuler Pro+
      </button>
    </div>
  )
}

/* ── the benefit card ─────────────────────────────────────────────────
   Four rows, 28px each, 12 apart, inside a 12px pad — which is the whole 172px
   card. Row 2 is the one line on the page whose words change with the tier. */
export function Benefits({ tier }) {
  return (
    <ul className="benefits tint s1">
      {BENEFITS.map((b) => {
        const Icon = BENEFIT_ICONS[b.icon]
        return (
          <li key={b.icon}>
            <span className="ic">
              <Icon />
            </span>
            <p>{benefitText(b, tier)}</p>
          </li>
        )
      })}
    </ul>
  )
}

/* ── PRO vs PRO+ ──────────────────────────────────────────────────────
   One table with the delta marked inside it. The highlight travels to the tier
   you are on, so the column you are buying is the one reading in white — which
   is what keeps this from being the paid-vs-paid grid that hands the decision
   to price. */
export function Table({ tier }) {
  const { mids, rules, col, hl, box, rule, head } = TABLE
  // every measurement in `design.js` is in *page* coordinates; the table's
  // children are positioned inside its own box, so they shift by it
  const ly = (y) => y - box.y
  const lx = (x) => x - box.x
  const pillX = (colX) => lx(colX) + (col.w - 54.24) / 2

  return (
    <>
      <div className="chip tint s2" style={{ top: 859.16, width: 118 }}>
        <span className="rim" />
        PRO vs PRO+
      </div>

      <div className="surf tbl tint s2">
        <span className="rim" />
        <span
          className="hl"
          style={{ left: lx(tier === 'pro' ? col.pro : col.plus), top: ly(hl.y), height: hl.h }}
        />
        <span className="tpill a" style={{ left: pillX(col.pro), top: ly(head) }}>PRO</span>
        <span className="tpill b" style={{ left: pillX(col.plus), top: ly(head) }}>PRO+</span>

        {rules.map((y) => (
          <span key={y} className="rule" style={{ left: lx(rule.x), width: rule.w, top: ly(y) }} />
        ))}

        {TABLE_ROWS.map((r, i) => {
          const mid = ly(mids[i])
          return (
            <div key={r.label}>
              <span className="trow-l" style={{ top: mid }}>{r.label}</span>
              <span className={`trow-v ${tier === 'pro' ? 'on' : 'off'}`} style={{ left: lx(col.pro), top: mid }}>
                {r.pro}
              </span>
              <span className={`trow-v ${tier === 'plus' ? 'on' : 'off'}`} style={{ left: lx(col.plus), top: mid }}>
                {r.plus}
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ── social proof ─────────────────────────────────────────────────── */
export function Social() {
  return (
    <>
      <div className="chip tint s3" style={{ top: 1285.11, width: 168 }}>
        <span className="rim" />
        What our learners say
      </div>

      <div className="loved">
        <div className="lr lb"><img src="/assets/laurel-b.svg" alt="" /></div>
        <div className="lr la"><img src="/assets/laurel-a.svg" alt="" /></div>
        <div className="lby">LOVED BY</div>
        <div className="n1">13Mn+<span className="u">users</span></div>
        <div className="lr ld"><img src="/assets/laurel-d.svg" alt="" /></div>
        <div className="lr lc"><img src="/assets/laurel-c.svg" alt="" /></div>
        <div className="n2">4.9<span className="u">Learner’s rating</span></div>
        <div className="stars"><img src="/assets/stars.svg" alt="" /></div>
      </div>

      <div className="award">
        <div className="tro"><img src="/assets/trophy.png" alt="" /></div>
        <div className="txt">
          <p className="a1">Awarded</p>
          {AWARD.map((l) => (
            <p key={l} className="a2">{l}</p>
          ))}
        </div>
      </div>

      <div className="trow">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="surf tcard tint s3" style={{ position: 'relative' }}>
            <span className="rim" />
            <div className="in">
              <div className="av"><img src={`/assets/${t.img}`} alt="" /></div>
              <p className="q">{t.q}</p>
              <div className="who">
                <span className="nm">{t.name}</span>
                <span className="ro">{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ── FAQ ──────────────────────────────────────────────────────────── */
export function Faq({ onResize }) {
  const [open, setOpen] = useState(null)
  const box = useRef(null)

  useEffect(() => {
    if (!box.current) return
    const ro = new ResizeObserver(() => onResize(box.current.offsetHeight))
    ro.observe(box.current)
    return () => ro.disconnect()
  }, [onResize])

  return (
    <>
      <div className="chip tint s3" style={{ top: 1973.15, width: 210 }}>
        <span className="rim" />
        Frequently asked questions
      </div>
      <div className="faq" ref={box}>
        {FAQS.map((f, i) => (
          <div key={f.q}>
            {i > 0 && <div className="fqr" />}
            <div className={`fq${open === i ? ' open' : ''}`} onClick={() => setOpen(open === i ? null : i)}>
              <div className="row">
                <p>{f.q}</p>
                <Chevron />
              </div>
              <Answer open={open === i}>{f.a}</Answer>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/** Height-animated so the page below it moves at the same rate as the chevron. */
function Answer({ open, children }) {
  const inner = useRef(null)
  const [h, setH] = useState(0)
  useEffect(() => {
    setH(open && inner.current ? inner.current.offsetHeight : 0)
  }, [open, children])
  return (
    <div className="ans" style={{ height: h }}>
      <div ref={inner}>
        <p>{children}</p>
      </div>
    </div>
  )
}
