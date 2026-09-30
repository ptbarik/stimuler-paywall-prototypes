import { useEffect, useRef, useState } from 'react'
import { BENEFIT_CARDS, BENEFIT_HEAD, CLAIM, FAQ, PLANS, PROOF, TESTIMONIALS } from './copy'

/* ── proof band ───────────────────────────────────────────────────────
   `Dynamic carousel` in the export: 569 wide inside a 412 page, with its
   neighbours sliced by both edges and a four-dash pagination sitting hidden
   behind it. Four cards, then, shown one at a time — the cut-off neighbours
   are the only thing on the page that says it moves, so it moves.

   The track is absolute rather than modular: card `k` lives at `k · SPREAD`
   for a running, unbounded `k`, and the track slides to `-index · SPREAD`.
   A wrapped index would make the card leaving on the left reappear on the
   right by travelling back across the frame; absolute indices mean it simply
   unmounts once it is two slots out. */

const SPREAD = 186
const DWELL = 2800

export function Proof() {
  const [i, setI] = useState(1) // the export has `13Mn+ users` centred
  useEffect(() => {
    const id = setInterval(() => setI((v) => v + 1), DWELL)
    return () => clearInterval(id)
  }, [])

  const window_ = [-2, -1, 0, 1, 2].map((d) => i + d)

  return (
    <div className="proof">
      <div
        style={{
          position: 'absolute', left: '50%', top: 0, width: 0, height: 145,
          transform: `translateX(${-i * SPREAD}px)`,
          transition: 'transform .62s cubic-bezier(.3,.8,.25,1)',
        }}
      >
        {window_.map((k) => {
          const item = PROOF[((k % PROOF.length) + PROOF.length) % PROOF.length]
          const d = k - i
          const away = Math.min(1, Math.abs(d))
          return (
            <div
              key={k}
              className={`pitem${item.stack ? ' stack' : ''}`}
              style={{
                position: 'absolute', left: 0, top: '50%',
                transform: `translate(calc(-50% + ${k * SPREAD}px), -50%) scale(${1 - away * 0.28})`,
                opacity: Math.abs(d) >= 2 ? 0 : 1 - away * 0.55,
                transition: 'transform .62s cubic-bezier(.3,.8,.25,1), opacity .62s linear',
              }}
            >
              <span className="lr"><img src="/assets/laurel-a.svg" alt="" /></span>
              <span className="mid" style={{ width: item.w }}>
                {item.eyebrow && <span className="eyebrow">{item.eyebrow}</span>}
                <span className="big" style={item.fs ? { fontSize: item.fs, lineHeight: `${item.fs * 0.86}px` } : undefined}>{item.big}</span>
                {item.sub && <span className="sub">{item.sub}</span>}
                {item.stars && <span className="stars"><img src="/assets/stars.svg" alt="" width="66" /></span>}
              </span>
              <span className="lr" style={{ transform: 'scaleX(-1)' }}><img src="/assets/laurel-a.svg" alt="" /></span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── premium benefits ─────────────────────────────────────────────────
   The swipeable card row, as the Paper frame now draws it — it replaced the
   five-row list that block used to be.

   The row is a real scroller rather than a picture of one: the design's rail
   only means anything if the cards move, and the third card is sliced by the
   section's right padding, which is the only thing saying there are more than
   two. The rail's thumb is the drawn 44 and travels the track rather than
   sizing itself to the content — a proportional thumb at four cards in a 372
   viewport would be 88, and the design drew 44. */

export function Benefits() {
  const view = useRef(null)
  const [p, setP] = useState(0)

  const onScroll = () => {
    const el = view.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setP(max > 0 ? el.scrollLeft / max : 0)
  }

  return (
    <div className="benefits">
      <div className="bcol">
        <div className="eyebrow">PREMIUM BENEFITS</div>
        <h2>{BENEFIT_HEAD}</h2>

        <div className="bview" ref={view} onScroll={onScroll}>
          {BENEFIT_CARDS.map(([icon, title, sub]) => (
            <div key={icon} className="bcard">
              <img src={`/assets/icons/${icon}.png`} alt="" />
              <div className="tx">
                <span className="t">{title}</span>
                <span className="s">{sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="brail">
          <i style={{ transform: `translateX(${p * (150 - 44)}px)` }} />
        </div>
      </div>
    </div>
  )
}

/* ── learners ─────────────────────────────────────────────────────────*/

export function Learners() {
  return (
    <div className="learners">
      <div className="chip learn"><span>What our learners say</span></div>

      <div>
        <div className="claimrow">
          <span className="tro"><img src="/assets/trophy.png" alt="" /></span>
          <p className="claim">
            <span className="fig">{CLAIM.figure}</span>
            {CLAIM.lines.map((l) => <span key={l} className="ln">{l}</span>)}
          </p>
        </div>

        <div className="trow">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="tcard">
              <span className="ph"><img src={t.photo} alt="" /></span>
              <div className="body">
                <p className="q">{t.quote}</p>
                <div className="who">
                  <span className="nm">{t.name}</span>
                  <span className="ro">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── faq ──────────────────────────────────────────────────────────────
   The export draws four shut rows and nothing else. The answers are written
   in `copy.js` so the rows do something; this is the last block on the page,
   so opening one only makes the page taller. `onResize` reports that growth
   up to `App`, which is what keeps the page from ending mid-answer. */

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
    <div className="faqblock">
      <div className="chip faq"><span>Frequently asked questions</span></div>
      <div className="faqlist" ref={box}>
        {FAQ.map(([q, a], n) => (
          <div key={q}>
            {n > 0 && <div className="fqr" style={{ marginBottom: 11.17 }} />}
            <div className={`fq${open === n ? ' open' : ''}`} onClick={() => setOpen(open === n ? null : n)}>
              <div className="r">
                <p>{q}</p>
                <span className="cv">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
                    <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <Answer open={open === n}>{a}</Answer>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Height-animated, so the page below grows at the same rate the chevron turns. */
function Answer({ open, children }) {
  const inner = useRef(null)
  const [h, setH] = useState(0)
  useEffect(() => { setH(open && inner.current ? inner.current.offsetHeight : 0) }, [open, children])
  return (
    <div className="ans" style={{ height: h }}>
      <div ref={inner}><p>{children}</p></div>
    </div>
  )
}

/* ── the price sheet ──────────────────────────────────────────────────
   `Sticky` in the export, drawn flipped — which is why the file lists the CTA
   before the plan cards and the render shows them the other way round. It is
   pinned to the viewport here rather than to the page, so it is over the
   content at every scroll position, as it would be in the app.

   `₹99/month` is one 32px text node in Figma and three sizes in the render,
   so it is composed from its three parts. */

export function Sheet({ plan, setPlan }) {
  const chosen = PLANS.find((p) => p.id === plan)
  return (
    <div className="sheet">
      <div className="sheetin">
        <div className="plans">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`plan ${p.id === 'yearly' ? 'y' : 'm'} ${plan === p.id ? 'on' : 'off'}`}
              onClick={() => setPlan(p.id)}
              role="button"
              tabIndex={0}
            >
              <span className="lab">{p.label}</span>
              <span className="price">
                <span className="cur">{p.cur}</span>
                <span className="fig">{p.figure}</span>
                {p.per && <span className="per">{p.per}</span>}
              </span>
              <span className="note">{p.note}</span>
            </div>
          ))}
          {PLANS.filter((p) => p.badge).map((p) => (
            <span key={p.id} className="badge">{p.badge}</span>
          ))}
        </div>

        <button className="cta"><span>{chosen.cta}</span></button>
      </div>
    </div>
  )
}
