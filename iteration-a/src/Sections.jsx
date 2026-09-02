import { useEffect, useRef, useState } from 'react'
import { FAQS, PLANS, TABLE, TABLE_ROWS, TESTIMONIALS } from './design'

/* ── the price sheet ──────────────────────────────────────────────────
   A white card floating over the tier's gradient, with the tier toggle inside
   it rather than in the header — that is where the export puts it, and it is
   the reason the toggle reads as "which plan am I buying" instead of "which
   theme am I looking at". */
export function Sheet({ tier, setTier, plan, setPlan }) {
  return (
    <>
      <div className="sheetglow s4" />
      <div className="sheet">
        <div className="seg s4" role="tablist">
          <div className="thumb" />
          <button className="s-pro" role="tab" aria-selected={tier === 'pro'} onClick={() => setTier('pro')}>
            Stimuler Pro
          </button>
          <button className="s-plus" role="tab" aria-selected={tier === 'plus'} onClick={() => setTier('plus')}>
            Stimuler Pro+
          </button>
        </div>

        {PLANS.map((p) => (
          <div
            key={p.id}
            className={`plan ${p.id === 'yearly' ? 'a' : 'b'}${plan === p.id ? ' sel' : ''}`}
            onClick={() => setPlan(p.id)}
          >
            <span className="glow s4" />
            <span className="rim grey" />
            <span className="rim s4" />
            <span className="nm">{p.name}</span>
            <span className="sb">{p.sub}</span>
            <span className="pr">{p.price}</span>
          </div>
        ))}
        {/* the badge sits on the card's top edge, so it lives outside it */}
        <div className="badge s4">{PLANS[0].badge}</div>
      </div>
    </>
  )
}

/* ── PRO vs PRO+ ──────────────────────────────────────────────────────
   One table with the delta marked inside it. The highlight travels to the tier
   you are on, so the column you are buying is the one reading in white — which
   is what keeps this from being the paid-vs-paid grid that hands the decision
   to price. */
export function Table({ tier }) {
  const { bands, col, hl, box, rule } = TABLE
  // every measurement below was read off the export in *page* coordinates;
  // the table's children are positioned inside its own box, so they shift by it
  const ly = (y) => y - box.y
  const lx = (x) => x - box.x
  return (
    <>
      <div className="chip s2" style={{ top: 918.9 }}>
        <span className="rim" />PRO vs PRO+
      </div>
      <div className="surf tbl tint s2">
        <span className="rim" />
        <span className="hl" style={{ left: lx(tier === 'pro' ? col.pro : col.plus), top: ly(hl.y), height: hl.h }} />
        <span className="tpill a" style={{ left: lx(col.pro) + 15.3, top: ly(TABLE.head) }}>PRO</span>
        <span className="tpill b" style={{ left: lx(col.plus) + 15.7, top: ly(TABLE.head) }}>PRO+</span>

        {bands.slice(1, -1).map((y) => (
          <span key={y} className="rule" style={{ left: lx(rule.x), width: rule.w, top: ly(y) }} />
        ))}

        {TABLE_ROWS.map((r, i) => {
          const mid = ly((bands[i] + bands[i + 1]) / 2)
          return (
            <div key={r.label}>
              <span className="trow-l" style={{ top: mid }}>{r.label}</span>
              <span className={`trow-v ${tier === 'pro' ? 'on' : 'off'}`} style={{ left: lx(col.pro), top: mid }}>{r.pro}</span>
              <span className={`trow-v ${tier === 'plus' ? 'on' : 'off'}`} style={{ left: lx(col.plus), top: mid }}>{r.plus}</span>
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
      <div className="chip s3" style={{ top: 1343.5 }}>
        <span className="rim" />What our learners say
      </div>

      <div className="loved s3">
        <div className="lr la"><img src="/assets/laurel-a.svg" alt="" /></div>
        <div className="lr lb"><img src="/assets/laurel-b.svg" alt="" /></div>
        <div className="lby">LOVED BY</div>
        <div className="n1">12Mn+<span className="u">users</span></div>
        <div className="lr lc"><img src="/assets/laurel-c.svg" alt="" /></div>
        <div className="lr ld"><img src="/assets/laurel-d.svg" alt="" /></div>
        <div className="n2">4.8<span className="u">Learner’s rating</span></div>
        <div className="stars"><img src="/assets/stars.svg" alt="" /></div>
      </div>

      <div className="award s3">
        <div className="tro"><img src="/assets/trophy.png" alt="" /></div>
        <div className="txt">
          <p className="a1">Awarded</p>
          <p className="a2">Google play</p>
          <p className="a3">Best AI App Worldwide</p>
        </div>
      </div>

      <div className="trow">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="surf tcard tint s3" style={{ position: 'relative' }}>
            <span className="rim" />
            <div className="in">
              <div className="av"><img src={`/assets/${t.img}`} alt="" /></div>
              <div>
                <p className="q">{t.q}</p>
                <div className="who">
                  <span className="nm">{t.name}</span>
                  <span className="ro">{t.role}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ── FAQ ──────────────────────────────────────────────────────────────
   The export only draws the collapsed state. The answers are written here so
   the rows actually do something; the block is the last thing on the page, so
   opening one only grows the page rather than moving anything above it. */
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
      <div className="chip s3" style={{ top: 2047 }}>
        <span className="rim" />Frequently asked questions
      </div>
      <div className="faq" ref={box}>
        {FAQS.map((f, i) => (
          <div key={f.q}>
            {i > 0 && <div className="fqr" />}
            <div
              className={`fq${open === i ? ' open' : ''}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
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
      <div ref={inner}><p>{children}</p></div>
    </div>
  )
}

function Chevron() {
  return (
    <svg className="cv" viewBox="0 0 12 8" fill="none" aria-hidden>
      <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
