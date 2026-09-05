import { useEffect, useRef, useState } from 'react'
import { FAQS, FAQ_CHIP, PROOF, TABLE_CHIP, TABLE_ROWS, TESTIMONIALS } from '../copy'
import { CLAIM, FAQ, LOVED, TABLE, TESTIM } from '../design'
import { clamp, easeInOut } from '../ease'
import { Chevron } from '../Icons'

/* ── Free vs PRO ──────────────────────────────────────────────────
   The box is measured off `7.png`; everything inside it is the roadmap
   paywall's own table geometry, which this export reuses to the hundredth of a
   pixel. Only the offset between the two pages differs, so it is carried once
   in `design.js` rather than re-measured here.

   The highlight does not travel. That page had two paid tiers and the
   highlight marked which one you were on; here there is one paid column, so it
   is simply always lit — a highlight that never moves is a highlight, not a
   control that has stopped working. */
export function ComparisonTable() {
  const { mids, rules, col, hl, box, rule, head, chip } = TABLE
  // `design.js` is in page coordinates; the table's children sit inside its
  // own box, so they shift by it
  const ly = (y) => y - box.y
  const lx = (x) => x - box.x
  const pillX = (colX) => lx(colX) + (col.w - 54.24) / 2

  return (
    <>
      <div className="chip" style={{ top: chip.top, left: chip.left, width: chip.w }}>
        <span className="rim" />
        {TABLE_CHIP}
      </div>

      <div
        className="surf tbl"
        style={{ left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: box.r }}
      >
        <span className="rim" />
        <span className="hl" style={{ left: lx(col.pro), top: ly(hl.y), height: hl.h }} />
        <span className="tpill free" style={{ left: pillX(col.free), top: ly(head) }}>Free</span>
        <span className="tpill pro" style={{ left: pillX(col.pro), top: ly(head) }}>PRO</span>

        {rules.map((y) => (
          <span key={y} className="rule" style={{ left: lx(rule.x), width: rule.w, top: ly(y) }} />
        ))}

        {TABLE_ROWS.map((r, i) => {
          const mid = ly(mids[i])
          return (
            <div key={r.label}>
              <span className="trow-l" style={{ top: mid }}>{r.label}</span>
              <span className="trow-v free" style={{ left: lx(col.free), top: mid }}>{r.free}</span>
              <span className="trow-v pro" style={{ left: lx(col.pro), top: mid }}>{r.pro}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ── the laurel carousel ──────────────────────────────────────────
   Three items on a ring: whichever is centred is at full size and full
   opacity, its neighbours at 0.87 and 0.3, and the frame's own edges do the
   clipping. It advances on its own — 2.4s held, 620ms to move.

   The ring is modular rather than a list of duplicated items. Each item's
   distance from the centre is `wrap(i - p, 3)` into `[-1.5, 1.5)`, so an item
   that leaves the right re-enters from the left in one step — and at |d| = 1.5
   it is 360px off centre, which on a 412 frame is entirely outside it. The
   wrap happens where there is nothing to see it. */
export function Loved({ reduced }) {
  const [p, setP] = useState(LOVED.start)
  const raf = useRef(0)

  useEffect(() => {
    if (reduced) return // no travel; the middle item simply stays the middle one
    const CYCLE = LOVED.hold + LOVED.move
    const t0 = performance.now()
    const tick = (now) => {
      const t = now - t0
      const whole = Math.floor(t / CYCLE)
      // held at an integer for `hold`, then eased across to the next
      const step = easeInOut(clamp(((t % CYCLE) - LOVED.hold) / LOVED.move))
      setP(LOVED.start + whole + step)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [reduced])

  const n = ITEMS.length
  return (
    <div className="loved" style={{ top: LOVED.top, height: LOVED.h }}>
      {ITEMS.map((item, i) => {
        // nearest representative of this item on the ring, in [-n/2, n/2)
        let d = (((i - p) % n) + n + n / 2) % n - n / 2
        const k = clamp(Math.abs(d))
        const scale = 1 + (LOVED.sideScale - 1) * k
        const opacity = 1 + (LOVED.sideOpacity - 1) * k
        return (
          <div
            key={item.key}
            className="unit2"
            style={{
              width: LOVED.item,
              height: 123.14,
              marginLeft: -LOVED.item / 2,
              marginTop: -123.14 / 2,
              transform: `translateX(${d * LOVED.pitch}px) scale(${scale})`,
              opacity,
              // the far item is behind the near ones where they overlap
              zIndex: Math.round((1 - k) * 10),
            }}
          >
            <span className="lr l">
              <img src="/assets/laurel-b.svg" alt="" />
            </span>
            <div className="mid">{item.body}</div>
            <span className="lr r">
              <img src="/assets/laurel-a.svg" alt="" />
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** The three claims, in the order the export puts them. */
const ITEMS = [
  {
    key: 'award',
    body: <div className="aw">{PROOF.award.join('\n')}</div>,
  },
  {
    key: 'users',
    body: (
      <>
        <div className="lby">{PROOF.lovedBy}</div>
        <div className="n1">
          {PROOF.users[0]}
          <span className="u">{PROOF.users[1]}</span>
        </div>
      </>
    ),
  },
  {
    key: 'rating',
    body: (
      <>
        <div className="n2">
          {PROOF.rating[0]}
          <span className="u">{PROOF.rating[1]}</span>
        </div>
        <div className="stars">
          <img src="/assets/stars.svg" alt="" />
        </div>
      </>
    ),
  },
]

/* ── the trophy and the 92% claim ─────────────────────────────────
   `92%` counts up on scroll into view, once, in `tabular-nums`. The count is
   the only number on the page that animates, and it earns it: it is the claim
   the page is actually making. */
export function Claim({ shown, reduced }) {
  const [n, setN] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    if (!shown || done.current) return
    done.current = true
    if (reduced) {
      setN(92) // the number is the claim; only the counting was the motion
      return
    }
    let raf
    const t0 = performance.now()
    const DUR = 900
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DUR)
      setN(Math.round(92 * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [shown, reduced])

  const { trophy, right, pct, lines } = CLAIM
  return (
    <div className="claim" style={{ top: 0, height: 0 }}>
      <div className="tro" style={{ left: trophy.x, top: trophy.y, width: trophy.w, height: trophy.h }}>
        <img src="/assets/trophy.png" alt="" />
      </div>
      <p
        className="pct"
        style={{
          left: 0,
          top: pct.top,
          width: right,
          fontSize: pct.size,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {n}%
      </p>
      <p
        className="cl"
        style={{ left: 0, top: lines.top, width: right, fontSize: lines.size, lineHeight: `${lines.line}px` }}
      >
        {PROOF.claim[1]}
      </p>
    </div>
  )
}

/* ── testimonials ─────────────────────────────────────────────────*/
export function Testimonials() {
  return (
    <div
      className="trow"
      style={{
        top: TESTIM.top,
        height: TESTIM.h,
        gap: TESTIM.gap,
        padding: `0 ${TESTIM.pad}px`,
        scrollPaddingLeft: TESTIM.pad,
      }}
    >
      {TESTIMONIALS.map((t) => (
        <div
          key={t.name}
          className="surf tcard"
          style={{ position: 'relative', width: TESTIM.w, height: TESTIM.h }}
        >
          <span className="rim" />
          <div className="in">
            <div className="av">
              <img src={`/assets/${t.img}`} alt="" />
            </div>
            <p className="q">{t.q}</p>
            <div className="who">
              <span className="nm">{t.name}</span>
              <span className="ro">{t.role}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── FAQ ──────────────────────────────────────────────────────────*/
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
      <div className="chip" style={{ top: FAQ.chip.top, left: FAQ.chip.left, width: FAQ.chip.w }}>
        <span className="rim" />
        {FAQ_CHIP}
      </div>
      <div className="faq" style={{ top: FAQ.top }} ref={box}>
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

/** Height-animated, so the page below grows at the same rate the chevron turns. */
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
