import { motion } from 'motion/react'
import { BG_V2, BG_GLOW_V2, EASE, STILL } from './theme.js'

/**
 * The offer page, traced from board 28E-0 rather than approximated.
 *
 * Every section is absolutely positioned at the artboard's own `top`, inside a
 * 412 × 3382 canvas — the same coordinate space the board uses. An earlier
 * version rebuilt this as a flow layout with its own paddings; the skeleton
 * matched but almost every detail drifted (type sizes, card geometry, the
 * testimonials, the tab bar), which is exactly the kind of drift absolute
 * coordinates make impossible.
 *
 * Two values are deliberately *not* copied, both leftovers from the indigo
 * pass that survive in the file: the PRO column's border (`#6F91FF`) and the
 * tab-bar icon strokes (`#8E88B5`). Both are cool blue-greys on a warm page.
 * They use the gold and the tab label's own colour here instead.
 */

/* Two boards, two pages. `v1` is 28E-0 — the warm one, benefits as a 2x2 of
   cards. `v2` is 7L0-0 — the same page cooled into indigo below the hero, with
   the benefits rewritten as a four-row list, which is 127px shorter and pulls
   everything under it up with it. Every number here is the board's own y. */
const BOARD = {
  v1: { h: 3406, shift: 14, countdown: 352, headline: 412, carousel: 460,
        benefits: 598, timeline: 1107, learners: 1560, compare: 2229, faq: 2648 },
  v2: { h: 3237, shift: 12, countdown: 75, headline: 370, carousel: 452,
        benefits: 592, timeline: 980, learners: 1433, compare: 2095, faq: 2554 },
}

/* 7L0-0 keeps the hero warm and lets the page go cold under it: the gold panels
   and the brown chrome of 28E-0 become indigo, and the tab bar's icons go back
   to the cool grey the app itself uses. */
const COOL = {
  /* The sheet is glass, the way the Christmas one is: a translucent pane that
     frosts the page scrolling under it, and a -45° sheen off the top-left
     corner over that. A flat fill has no relationship to what it covers; this
     one picks the page up and carries it. */
  sheet: 'rgba(24,22,52,0.52)',
  pane:
    'linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.035) 26%, rgba(255,255,255,0) 54%),' +
    'linear-gradient(180deg, rgba(24,22,52,0.52) 0%, rgba(46,40,95,0.32) 100%)',
  frost: 'blur(4.6px) saturate(1.35)',
  rim:
    'inset 1px 0 0 rgba(199,206,221,0.16), inset -1px 0 0 rgba(199,206,221,0.16),' +
    'inset 0 1px 0 rgba(255,255,255,0.07), 0 -20px 44px rgba(0,0,0,0.35)',
  /* the sheet's own metal: the keyline round the chosen plan, the save chip
     and the button all come off gold with the rest of the page */
  keyline: '#C7CEDD',
  cta: 'linear-gradient(96deg, #96A0B6 0%, #FFFFFF 34%, #F4F7FC 52%, #C3CBDB 76%, #8E98AE 100%)',
  ctaInk: '#14161F',
  ctaGlow: 'rgba(205,214,235,0.38)',
  chip: 'linear-gradient(90deg, #9AA3B8 0%, #FFFFFF 48%, #C3CBDA 100%)',
  sheetBorder: { top: 'rgba(255,255,255,0.12)', side: 'rgba(255,255,255,0.08)' },
  year: 'radial-gradient(ellipse 54% 96% at 50% 50%, #39357B 0%, #1B1445 70%)',
  month: '#191342',
  monthBorder: '#45456C',
  chipInk: '#201C47',
  tab: '#0B0A12',
  tabBorder: 'rgba(255,255,255,0.06)',
  tabIdle: '#8E88B5',
}
const ID = "'Inter Display', system-ui, sans-serif"
const PO = "'Poppins', system-ui, sans-serif"
const UR = "'Urbanist', system-ui, sans-serif"

/* The page's metal, as custom properties set once on the board root. v1 is the
   gold the boards were drawn in; v2 is silver — the gold is kept for the two
   things that have to stay warm, the BLACK FRIDAY mark and the buy button, so
   everything else going cool is what makes those two read as the offer. */
const TONE = {
  gold: {
    '--l1': '#B09A6E', '--l2': '#FFF0C9', '--l3': '#E6C88B',
    '--h1': '#EAB259', '--h2': '#FFE292', '--h3': '#F0C476',
    '--n1': '#FFF7C8', '--n2': '#F0C878', '--n3': '#E2AE4E',
    '--edge': '#E7CA79', '--edgeRGB': '231,202,121',
    '--chipBg': '#241704', '--chipEdge': '#FFC96E', '--card': '#241707',
    '--dim': '#6B5428',
  },
  /* Silver is not grey. A sheet of polished metal is a hard break between a
     highlight and the shadow it sits against, so each fill runs light → dark →
     light rather than fading through one value; that break is the whole reason
     the type reads as metal and not as a dimmed white. */
  silver: {
    '--l1': '#78819A', '--l2': '#FFFFFF', '--l3': '#AEB7CC',
    '--h1': '#6E7892', '--h2': '#FFFFFF', '--h3': '#B9C2D4',
    '--n1': '#FFFFFF', '--n2': '#CAD2E1', '--n3': '#6E7891',
    '--edge': '#C2C9D8', '--edgeRGB': '194,201,216',
    '--chipBg': '#1A1C2A', '--chipEdge': '#C7CEDD', '--card': '#1B1E30',
    '--dim': '#4A5064',
  },
}

/* the two gradient text fills the board uses, and the chip every section heads with */
const label = {
  backgroundImage: 'linear-gradient(90deg, var(--l1) 0%, var(--l2) 52%, var(--l3) 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}
const heading = {
  backgroundImage: 'linear-gradient(100deg, var(--h1) 0%, var(--h2) 34%, var(--h3) 58%, var(--h1) 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}
const chip = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--chipBg)',
  borderRadius: 10,
  outline: '0.5px solid var(--chipEdge)',
  padding: '14px 16px',
  filter: 'drop-shadow(0 -2px 6.34px rgba(0,0,0,0.2))',
  color: '#FFFFFF',
  fontFamily: ID,
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '14px',
}

const Rise = ({ i = 0, children, style }) => (
  <motion.div
    initial={STILL ? false : { opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.16 + i * 0.06, duration: 0.5, ease: EASE.out }}
    style={style}
  >
    {children}
  </motion.div>
)

/* ── premium benefits ───────────────────────────────────────────── */

const CARDS = [
  ['ic-lessons', '100+ lessons', 'Grammar, pronunciation & vocab in short daily lessons.'],
  ['ic-roleplay', '50+ roleplays', 'Order food, sit an interview, make small talk.'],
  ['ic-sarah', 'Sarah, daily', 'Up to 30 minutes on call with your AI tutor.'],
  ['ic-sound', 'Sound clearer', 'A few minutes of fluency practice every day.'],
]

const Card = ({ icon, title, sub }) => (
  <div
    style={{
      width: 179,
      minHeight: 145,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: '18px 15px',
      borderRadius: 18,
      background: 'rgba(231,202,121,0.05)',
      border: '1px solid rgba(231,202,121,0.12)',
      boxSizing: 'border-box',
    }}
  >
    <img src={`/assets/${icon}.png`} alt="" style={{ width: 34, height: 34, flexShrink: 0 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontFamily: ID, fontWeight: 600, fontSize: 14, lineHeight: '19px', letterSpacing: '-0.01em', color: '#FFFFFF' }}>
        {title}
      </div>
      <div style={{ fontFamily: ID, fontSize: 12, lineHeight: '17px', color: 'rgba(255,255,255,0.56)' }}>{sub}</div>
    </div>
  </div>
)

/* 7L0-0 drops the four cards for four rows: the number carries the weight and
   the line beside it finishes the sentence, so the whole section reads in one
   pass instead of four. It is 388 tall against the cards' 499. */
const LINES = [
  ['100+', 'bite-sized lessons'],
  ['50+', 'real-life roleplays'],
  ['30 min', 'a day with Sarah, your AI tutor'],
  ['Daily', 'fluency drills to sound clearer'],
]

const numeral = {
  width: 104,
  flexShrink: 0,
  fontFamily: UR,
  fontWeight: 700,
  fontSize: 24,
  lineHeight: '30px',
  letterSpacing: '-0.02em',
  backgroundImage: 'linear-gradient(140deg, var(--n1) 2%, var(--n2) 36%, var(--n3) 74%, var(--n1) 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

/* ── the 8-week rail ────────────────────────────────────────────── */

const STEPS = [
  ['DAY 1', 'Your first call with Sarah', 'Up to 30 minutes, on any topic you pick.'],
  ['DAY 3', 'Roleplays that match your life', '50+ themes — interviews, ordering, small talk.'],
  ['WEEK 2', 'Pronunciation starts feeling natural', 'A few minutes of daily drills, plus 100+ lessons.'],
  ['WEEK 8', 'You speak without rehearsing', 'Put your practice into action in real-life conversations.'],
]

/* ── free vs pro ────────────────────────────────────────────────── */

const ROWS = [
  ['Lessons', '2', 'Unlimited'],
  ['Themes with Sarah', '4', 'Unlimited'],
  ['Access to premium community', 'No', 'Yes'],
  ['Priority support from English Experts', 'No', 'Yes'],
  ['Talking minutes \nwith Sarah', 'Upto \n10 mins', 'Unlimited'],
]

const FAQ = [
  ['Why should I get Stimuler Pro?', null],
  ['Will the price increase in future ?', null],
  ['Is my payment secure & can I cancel my plan anytime', 270],
  ['What to do if I am facing any problems in purchase ?', 280],
]

const Laurel = ({ flip, w = 36, silver }) => (
  <img
    src={silver ? '/assets/laurel-silver.svg' : '/assets/laurel-a.svg'}
    alt=""
    style={{ width: w, height: w * 1.207, flexShrink: 0, transform: flip ? 'scaleX(-1)' : 'none' }}
  />
)

export default function Paywall({ clock, v2 = false }) {
  const B = v2 ? BOARD.v2 : BOARD.v1
  return (
    <div style={{ position: 'relative', top: -B.shift, width: 412, height: B.h - B.shift, ...(v2 ? TONE.silver : TONE.gold) }}>
      {/* 7L0-0 runs its gradient down the whole 3406, not down one screenful —
          brown for the hero, then the app's indigo, then black. It has to live
          inside the scroller or the page would re-warm every time you scroll. */}
      {v2 && (
        <>
          <div style={{ position: 'absolute', inset: 0, background: BG_V2 }} />
          {/* the board's 412x460 wash. It ends a shade darker than the page,
              which leaves a visible step at its bottom edge, so it is masked
              out over the last fifth instead of being cut off. */}
          <div
            style={{
              position: 'absolute', left: 0, top: 0, width: 412, height: 460, background: BG_GLOW_V2,
              maskImage: 'linear-gradient(180deg, #000 78%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(180deg, #000 78%, transparent 100%)',
            }}
          />
        </>
      )}
      {/* countdown — board top 328 */}
      <Rise i={0} style={{ position: 'absolute', left: 0, top: B.countdown, width: 412, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            height: 36,
            padding: '0 16px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(var(--edgeRGB),0.28)',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" style={{ flexShrink: 0 }}>
            <circle cx="6.5" cy="6.5" r="5.6" fill="none" stroke="#FFF7E5" strokeWidth="1.3" />
            <path d="M6.5 3.4V6.8L8.8 8.2" fill="none" stroke="#FFF7E5" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10.5, letterSpacing: '0.14em', lineHeight: '14px', color: 'var(--l1)' }}>
            OFFER ENDS IN
          </span>
          <span style={{ fontFamily: ID, fontWeight: 700, fontSize: 15, letterSpacing: '0.02em', lineHeight: '18px', color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
            {clock}
          </span>
        </div>
      </Rise>

      {/* headline — board top 388, both lines white */}
      <Rise
        i={1}
        style={{ position: 'absolute', left: '50%', top: B.headline, width: 340, translate: '-50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
      >
        {['Get fluent for half the price,', 'Invest in the skill that opens doors.'].map((t) => (
          <div key={t} style={{ fontFamily: ID, fontWeight: 500, fontSize: 22, lineHeight: '25px', letterSpacing: '-0.015em', color: '#FFFFFF', whiteSpace: 'nowrap' }}>
            {t}
          </div>
        ))}
      </Rise>

      {/* proof carousel — board top 436. A 569-wide strip centred on a 412
          frame, so the two side cards are cut by the screen edge: that clipping
          is the design, it is what says the row keeps going. #1 App sits left,
          4.9 right, both at 30%. */}
      <Rise i={2} style={{ position: 'absolute', left: '50%', top: B.carousel, width: 569, height: 145, translate: '-50%', overflow: 'hidden' }}>
        {/* left — #1 App, clipped by the screen edge */}
        <div style={{ position: 'absolute', left: 78.19, top: '50%', translate: '-50% -50%', width: 168.38, height: 106.69, opacity: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: 156.9 }}>
            <Laurel w={34.12} silver={v2} />
            <div style={{ fontFamily: PO, fontSize: 10, lineHeight: '180%', letterSpacing: '-0.02em', color: '#FFFFFF', textAlign: 'center', whiteSpace: 'pre-line' }}>
              {'#1 App\nAppstore India'}
            </div>
            <Laurel w={34.12} flip silver={v2} />
          </div>
        </div>

        {/* centre — the one at full strength */}
        <div style={{ position: 'absolute', left: 'calc(50% + 2.86px)', top: '50%', translate: '-50% -50%', width: 253.53, height: 123.14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: 219.66 }}>
            <Laurel w={47.78} silver={v2} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 600, fontSize: 7.96, letterSpacing: '0.34em', lineHeight: '14px', color: '#FFFFFF' }}>
                LOVED BY
              </div>
              <div style={{ fontFamily: PO, fontSize: 29.23, letterSpacing: '-0.02em', lineHeight: '86%', color: '#FFFFFF', whiteSpace: 'pre-line' }}>
                {'13Mn+\nusers'}
              </div>
            </div>
            <Laurel w={47.78} flip silver={v2} />
          </div>
        </div>

        {/* right — 4.9, running off the edge */}
        <div style={{ position: 'absolute', left: 406.62, top: '50%', translate: '0 -50%', width: 168.38, height: 106.69, opacity: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: 156.9 }}>
            <Laurel w={34.12} silver={v2} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 79 }}>
              <div style={{ fontFamily: PO, fontSize: 12, lineHeight: '114%', letterSpacing: '-0.02em', color: '#FFFFFF', textAlign: 'center', whiteSpace: 'pre-line' }}>
                {'4.9\nLearner\u2019s rating'}
              </div>
              <img src={v2 ? '/assets/stars-silver.svg' : '/assets/stars.svg'} alt="" style={{ width: 33.46, height: 5.15 }} />
            </div>
            <Laurel w={34.12} flip silver={v2} />
          </div>
        </div>
      </Rise>

      {/* premium benefits — full bleed */}
      <Rise
        i={3}
        style={{
          position: 'absolute',
          left: 0,
          top: B.benefits,
          width: 412,
          height: v2 ? 388 : 499,
          borderRadius: 28,
          backgroundImage: v2
            ? 'linear-gradient(180deg, rgba(32,28,56,0.86) 0%, rgba(18,15,34,0.85) 60%, rgba(13,11,22,0.79) 100%)'
            : 'linear-gradient(180deg, #3A2508 0%, rgba(58,37,8,0.85) 38.06%, rgba(13,7,0,0.79) 100%)',
        }}
      >
        <div style={{ position: 'absolute', left: 27, top: 28, fontFamily: ID, fontWeight: 500, fontSize: 11, lineHeight: '14px', letterSpacing: '0.2em', ...label }}>
          PREMIUM BENEFITS
        </div>
        <div
          style={{
            position: 'absolute', left: 27, top: v2 ? 57 : 64, width: 340, fontFamily: ID, fontWeight: 700,
            fontSize: v2 ? 26 : 28, lineHeight: '35px', letterSpacing: '-0.035em', ...heading,
          }}
        >
          {v2 ? (
            <>
              Unlock everything you need
              <br />
              to speak confidently
            </>
          ) : (
            'Everything you need to speak confidently'
          )}
        </div>

        {v2 ? (
          <div style={{ position: 'absolute', left: 27, top: 145, width: 358, display: 'flex', flexDirection: 'column' }}>
            {LINES.map(([n, text], i) => (
              <div
                key={n}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  padding: i === LINES.length - 1 ? '12px 0 2px' : '12px 0',
                  borderBottom: i === LINES.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={numeral}>{n}</div>
                <div style={{ fontFamily: ID, fontWeight: 500, fontSize: 15, lineHeight: '20px', color: '#FFFFFF' }}>
                  {text}
                </div>
              </div>
            ))}
          </div>
        ) : (
          [0, 1].map((r) => (
            <div key={r} style={{ position: 'absolute', left: 20, top: r === 0 ? 162 : 326, width: 372, display: 'flex', gap: 14 }}>
              <Card icon={CARDS[r * 2][0]} title={CARDS[r * 2][1]} sub={CARDS[r * 2][2]} />
              <Card icon={CARDS[r * 2 + 1][0]} title={CARDS[r * 2 + 1][1]} sub={CARDS[r * 2 + 1][2]} />
            </div>
          ))
        )}
      </Rise>

      {/* first 8 weeks — board top 1083 */}
      <Rise
        i={4}
        style={{
          position: 'absolute',
          left: '50%',
          top: B.timeline,
          width: 372,
          translate: '-50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 26,
          padding: '32px 16px 30px',
          borderRadius: 16,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, width: 323 }}>
          <span style={{ flex: 1, height: 1, backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, var(--l1) 49%, var(--l2) 100%)' }} />
          <span style={{ fontFamily: PO, fontSize: 12, lineHeight: '14px', letterSpacing: '-0.02em', whiteSpace: 'nowrap', ...label }}>
            Your first 8 weeks at a glance
          </span>
          <span style={{ flex: 1, height: 1, backgroundImage: 'linear-gradient(90deg, var(--l2) 0%, var(--l1) 51%, rgba(0,0,0,0) 100%)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', width: 340 }}>
          {STEPS.map(([when, head, sub], i) => {
            const last = i === STEPS.length - 1
            return (
              <div key={when} style={{ display: 'flex', gap: 14, width: 340 }}>
                <div style={{ width: 22, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      flexShrink: 0,
                      borderRadius: 999,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...(last
                        ? { backgroundImage: 'linear-gradient(135deg, var(--h2) 0%, var(--h1) 100%)' }
                        : { background: 'var(--chipBg)', border: '1px solid rgba(var(--edgeRGB),0.5)' }),
                      boxSizing: 'border-box',
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 999,
                        ...(last ? { background: 'var(--chipBg)' } : { backgroundImage: 'linear-gradient(135deg, var(--h2) 0%, var(--h1) 100%)' }),
                      }}
                    />
                  </div>
                  {!last && <span style={{ width: 1, flex: 1, backgroundImage: 'linear-gradient(180deg, rgba(var(--edgeRGB),0.45) 0%, rgba(var(--edgeRGB),0.18) 100%)' }} />}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, paddingBottom: last ? 0 : 26 }}>
                  <div style={{ fontFamily: ID, fontWeight: 600, fontSize: 11, lineHeight: '14px', letterSpacing: '0.1em', color: 'var(--l3)' }}>{when}</div>
                  <div style={{ fontFamily: ID, fontWeight: 600, fontSize: 15, lineHeight: '21px', letterSpacing: '-0.01em', color: '#FFFFFF' }}>{head}</div>
                  <div style={{ fontFamily: ID, fontSize: 13, lineHeight: '19px', color: 'rgba(255,255,255,0.56)' }}>{sub}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Rise>

      {/* learners — board top 1536, left 27 */}
      <Rise i={5} style={{ position: 'absolute', left: 27, top: B.learners, width: 360, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={chip}>What our learners say</div>
        <div style={{ height: 20 }} />

        <div style={{ position: 'relative', width: 341, height: 171 }}>
          <img src="/assets/trophy.png" alt="" style={{ position: 'absolute', left: 9, top: 7, width: 162, height: 165, objectFit: 'contain' }} />
          <div style={{ position: 'absolute', left: 164, top: 21, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div
              style={{
                fontFamily: UR,
                fontWeight: 600,
                fontSize: 72,
                lineHeight: '68px',
                textAlign: 'right',
                backgroundImage: 'linear-gradient(133.55deg, var(--n1) 8%, var(--n2) 40%, var(--n3) 85%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              92%
            </div>
            <div
              style={{
                width: 170,
                fontFamily: PO,
                fontSize: 18,
                lineHeight: '20px',
                textAlign: 'right',
                whiteSpace: 'pre-line',
                backgroundImage: 'linear-gradient(136.7deg, var(--n1) 0.5%, var(--n2) 38%, var(--n3) 83.5%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {'Stimuler users speak fluently in\n12 weeks'}
            </div>
          </div>
        </div>

        {/* the row runs off the right edge, the way the board clips it */}
        <div className="no-bar" style={{ display: 'flex', gap: 11.76, marginTop: 10, overflowX: 'auto', width: 385, paddingBottom: 4 }}>
          {[
            ['/assets/learner-1.png', '“At last I found an app that really helps you to grow. Direct to the point instructions for every lesson”', 'Mateo González', 'Software developer, Mexico City'],
            ['/assets/t2.png', '“I am an introvert. The app is really helpful for me personally. I am practicing English consistently now “', 'Santiago Rodríguez', 'Accountant ,Buenos Aires'],
            ['/assets/t3.png', '“This app really helped me with my pronunciation. The features improved my English”', 'Camila López', 'Architect, Chicago'],
          ].map(([photo, quote, name, role]) => (
            <div
              key={name}
              style={{
                position: 'relative',
                width: 294,
                height: 373,
                flexShrink: 0,
                borderRadius: 16,
                backgroundImage: 'radial-gradient(ellipse 114.33% 152.97% at 85.34% 76.09%, rgba(var(--edgeRGB),0.08) 0%, var(--card) 100%)',
              }}
            >
              <img
                src={photo}
                alt=""
                style={{
                  position: 'absolute',
                  left: 88,
                  top: 27,
                  width: 118,
                  height: 118,
                  objectFit: 'cover',
                  borderRadius: 13.45,
                  border: '2.94px solid rgba(99,77,51,0.42)',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ position: 'absolute', left: 25, top: 166, width: 245, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18.63 }}>
                <div style={{ fontFamily: PO, fontSize: 15.69, lineHeight: '25.49px', textAlign: 'center', color: '#D4D4D4' }}>{quote}</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontFamily: UR, fontWeight: 700, fontStyle: 'italic', fontSize: 19.61, lineHeight: '26px', color: 'var(--edge)' }}>{name}</div>
                  <div style={{ fontFamily: UR, fontWeight: 700, fontStyle: 'italic', fontSize: 11.76, lineHeight: '20px', color: 'var(--l3)' }}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Rise>

      {/* free vs pro — board top 2205 */}
      <Rise
        i={6}
        style={{
          position: 'absolute',
          left: '50%',
          top: B.compare,
          width: 382,
          translate: '-50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 24,
          padding: '27px 26px 30px',
          borderRadius: 16,
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <div style={chip}>Free vs PRO</div>
        <div style={{ position: 'relative', width: 327, paddingBottom: 8, display: 'flex', flexDirection: 'column' }}>
          {/* the PRO column lane. The board still carries an indigo border here
              from an earlier pass; it is gold on a gold page. */}
          <div style={{ position: 'absolute', left: 242, top: 0, bottom: 0, width: 85, background: 'rgba(var(--edgeRGB),0.13)', border: '0.57px solid var(--edge)', borderRadius: 12.76 }} />

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: 44, paddingTop: 4, flexShrink: 0 }}>
            <span style={{ width: 150, flexShrink: 0 }} />
            <span style={{ width: 85, flexShrink: 0, display: 'flex', justifyContent: 'center', fontFamily: ID, fontWeight: 500, fontSize: 14, lineHeight: '18px', color: '#FFFFFF' }}>
              Free
            </span>
            <span style={{ width: 7, flexShrink: 0 }} />
            <span style={{ width: 85, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
              <span
                style={{
                  width: 54,
                  height: 20,
                  borderRadius: 11.15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: 'linear-gradient(134.66deg, var(--n3) 1.5%, var(--n1) 94.5%)',
                  fontFamily: ID,
                  fontWeight: 600,
                  fontSize: 13,
                  lineHeight: '16px',
                  color: 'var(--chipBg)',
                }}
              >
                PRO
              </span>
            </span>
          </div>

          {ROWS.map(([lab, free, pro], i) => (
            <div key={lab}>
              {i > 0 && <div style={{ position: 'relative', width: 327, height: 1, backgroundImage: 'linear-gradient(90deg, rgba(var(--edgeRGB),0.22) 0%, rgba(var(--edgeRGB),0.6) 100%)' }} />}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minHeight: 44, padding: '10px 0' }}>
                <span style={{ width: 150, flexShrink: 0, fontFamily: ID, fontWeight: 500, fontSize: 13, lineHeight: '17.3px', color: '#FFFFFF', whiteSpace: 'pre-line' }}>{lab}</span>
                <span style={{ width: 85, flexShrink: 0, textAlign: 'center', fontFamily: ID, fontWeight: 500, fontSize: 13, lineHeight: '16px', color: '#FFFFFF', whiteSpace: 'pre-line' }}>{free}</span>
                <span style={{ width: 7, flexShrink: 0 }} />
                <span style={{ width: 85, flexShrink: 0, textAlign: 'center', fontFamily: ID, fontWeight: 600, fontSize: 13, lineHeight: '16px', color: '#FFFFFF' }}>{pro}</span>
              </div>
            </div>
          ))}
        </div>
      </Rise>

      {/* faq — board top 2624, left 27 */}
      <Rise i={7} style={{ position: 'absolute', left: 27, top: B.faq, width: 356, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 36 }}>
        <div style={{ ...chip, fontFamily: "'Geist', system-ui, sans-serif", fontSize: 13.73 }}>Frequently asked questions</div>
        <div style={{ width: 350, display: 'flex', flexDirection: 'column', gap: 11 }}>
          {FAQ.map(([q, w], i) => (
            <div key={q}>
              {i > 0 && (
                <div style={{ alignSelf: 'flex-end', width: 300.4, height: 1, marginLeft: 'auto', marginBottom: 11, backgroundImage: 'linear-gradient(90deg, rgba(var(--edgeRGB),0) 2.6%, rgba(var(--edgeRGB),0.55) 49.59%, rgba(var(--edgeRGB),0) 94.75%)' }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 11, minHeight: 29.41 }}>
                <span style={{ width: w || undefined, fontFamily: ID, fontSize: 14, lineHeight: '19.6px', color: '#FFFFFF' }}>{q}</span>
                <svg width="12" height="8" viewBox="0 0 12 8" style={{ flexShrink: 0 }}>
                  <path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </Rise>
    </div>
  )
}

/* ── the foot: price sheet over the app's tab bar ───────────────── */

export function PlanBar({ show, v2 = false }) {
  return (
    <motion.div
      initial={STILL ? false : { y: 344 }}
      animate={{ y: show ? 0 : 344 }}
      transition={{ delay: show ? 0.5 : 0, duration: 0.6, ease: EASE.out }}
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 6 }}
    >
      <div
        style={{
          position: 'relative',
          width: 412,
          height: 260,
          padding: '16px 20px 20px',
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          backdropFilter: v2 ? COOL.frost : 'blur(16px)',
          WebkitBackdropFilter: v2 ? COOL.frost : 'blur(16px)',
          backgroundImage: v2
            ? COOL.pane
            : 'linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.035) 26%, rgba(255,255,255,0) 54%),' +
              'linear-gradient(180deg, rgba(34,23,10,0.86) 0%, rgba(58,43,22,0.78) 100%)',
          borderTop: `1px solid ${v2 ? 'rgba(199,206,221,0.42)' : 'rgba(231,202,121,0.48)'}`,
          borderLeft: v2 ? 'none' : '1px solid rgba(231,202,121,0.18)',
          borderRight: v2 ? 'none' : '1px solid rgba(231,202,121,0.18)',
          boxShadow: v2 ? COOL.rim : '0 -18px 40px rgba(0,0,0,0.45)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: ID, fontWeight: 500, fontSize: 15, lineHeight: '20px', color: 'rgba(255,255,255,0.92)' }}>
            Learn with confidence. Cancel anytime.
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, height: 114, flexShrink: 0 }}>
          <div
            style={{
              position: 'relative',
              flex: 1,
              height: 114,
              padding: '12px 14px',
              borderRadius: 14,
              boxSizing: 'border-box',
              backgroundImage: v2 ? COOL.year : 'radial-gradient(ellipse 54% 96% at 50% 50%, #4A3613 0%, #2A1B08 82%)',
              border: `1.25px solid ${v2 ? COOL.keyline : '#E7CA79'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: ID, fontWeight: 500, fontSize: 15, lineHeight: '20px', color: '#FFFFFF' }}>Yearly Plan</span>
              <span
                style={{
                  width: 57,
                  height: 18,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: v2 ? COOL.chip : 'linear-gradient(90deg, #FFB85B 0%, #FFEB9D 50%, #FFC342 100%)',
                  fontFamily: ID,
                  fontWeight: 600,
                  fontSize: 10,
                  lineHeight: '18px',
                  color: v2 ? COOL.chipInk : '#2A1B08',
                }}
              >
                Save 67%
              </span>
            </div>
            <div style={{ position: 'absolute', left: 13.75, top: 47.75, fontFamily: ID, fontWeight: 600, fontSize: 25, lineHeight: '28px', color: '#FFFFFF' }}>₹83/month</div>
            <div style={{ position: 'absolute', left: 13.75, top: 79.75, fontFamily: ID, fontWeight: 500, fontSize: 12.5, lineHeight: '16px', color: v2 ? '#A8B0C4' : '#C2B28C' }}>₹999 billed anually</div>
          </div>

          <div style={{ position: 'relative', flex: 1, height: 114, padding: '12px 14px', borderRadius: 14, boxSizing: 'border-box', background: v2 ? COOL.month : '#33240F', border: `1px solid ${v2 ? COOL.monthBorder : '#6B5428'}` }}>
            <span style={{ fontFamily: ID, fontWeight: 500, fontSize: 15, lineHeight: '20px', color: '#FFFFFF' }}>Monthly Plan</span>
            <div style={{ position: 'absolute', left: 14, top: 48, fontFamily: ID, fontWeight: 600, fontSize: 25, lineHeight: '28px', color: '#FFFFFF' }}>₹249/month</div>
            <div style={{ position: 'absolute', left: 14, top: 80, fontFamily: ID, fontWeight: 500, fontSize: 12.5, lineHeight: '16px', color: v2 ? '#A8B0C4' : '#C2B28C' }}>Billed monthly</div>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          style={{
            position: 'absolute',
            left: 20,
            top: 184,
            width: 370,
            height: 54,
            borderRadius: 999,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: v2 ? COOL.cta : 'linear-gradient(90deg, #DB992F 0%, #FFE090 50%, #DB992F 100%)',
            boxShadow: v2 ? `0 8px 24px ${COOL.ctaGlow}` : '0 8px 24px rgba(219,153,47,0.35)',
          }}
        >
          <motion.span
            aria-hidden
            initial={{ x: -260 }}
            animate={{ x: [-260, 420] }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: 0,
              top: -20,
              width: 26,
              height: 100,
              rotate: '24deg',
              backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%)',
              pointerEvents: 'none',
            }}
          />
          <span style={{ position: 'relative', fontFamily: ID, fontWeight: 600, fontSize: 21, lineHeight: '26px', color: v2 ? COOL.ctaInk : '#130800' }}>
            Unlock 1 Year of Stimuler PRO
          </span>
        </motion.button>
      </div>

      <TabBar v2={v2} />
    </motion.div>
  )
}

/* the app's own tab bar, five items. The board's icon strokes are still an
   indigo-era grey; they take the label's colour here. */
const TAB_ICONS = {
  Learn: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7" />
    </>
  ),
  Practice: (
    <>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M8 10.5h.01M12 10.5h.01M16 10.5h.01" />
    </>
  ),
  Call: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  Profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
}

function TabBar({ v2 = false }) {
  const idle = v2 ? COOL.tabIdle : '#9A8A6A'
  return (
    <div style={{ position: 'relative', width: 412, height: 84, background: v2 ? COOL.tab : '#140C02', borderTop: `1px solid ${v2 ? COOL.tabBorder : 'rgba(231,202,121,0.14)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', width: 412, padding: '10px 8px 0' }}>
        {Object.keys(TAB_ICONS).map((name) => (
          <div key={name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={idle} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              {TAB_ICONS[name]}
            </svg>
            <span style={{ fontFamily: ID, fontWeight: 500, fontSize: 13, lineHeight: '16px', color: idle }}>{name}</span>
          </div>
        ))}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <svg width="26" height="24" viewBox="0 0 26 24" style={{ flexShrink: 0 }}>
            <defs>
              <linearGradient id="crown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FFE8A8" />
                <stop offset="1" stopColor="#D79B26" />
              </linearGradient>
            </defs>
            <path d="M3 17h20l1.6-10-6 4L13 4 7.4 11l-6-4z" fill="url(#crown)" />
            <rect x="3" y="18.4" width="20" height="2.6" rx="1.3" fill="url(#crown)" />
          </svg>
          <span style={{ fontFamily: ID, fontWeight: 500, fontSize: 13, lineHeight: '16px', color: '#F5C46A' }}>Premium</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 139, bottom: 8, width: 134, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.85)' }} />
    </div>
  )
}
