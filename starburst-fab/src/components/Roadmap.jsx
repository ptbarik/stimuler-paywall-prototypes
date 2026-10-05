import {
  PlayOutline, Screencast, Sparkle, Twister, GrammarMark, Padlock, Gem, MissingArt, MissingMark,
} from './Icons.jsx'
import {
  UNITS, HERO_H, ROW_H, ROW_GAP, NOTE_BLOCK, GROUP_GAP, NODE,
  nodeCentres, groupHeight,
} from '../roadmap.js'

/* The roadmap's three lanes, measured off the export in frame coordinates:
   the rail starts at 22.63, the cards at 76.63, and both are inside a column
   that starts at 20 — which is also where the header starts. */
const COL = 372
const RAIL_W = 32.33
const RAIL_GAP = 21.67
const CARD_W = 314
const INSET = 2.63

/* ── the unit rule ──────────────────────────────────────────────── */

function Divider({ unit }) {
  return (
    <div style={{ position: 'relative', width: COL, height: 24 }}>
      <div className="absolute flex items-center"
           style={{ left: '50%', top: 0, translate: '-50%', gap: 10.83 }}>
        <span className="font-ub whitespace-nowrap" style={{ color: '#E7CEA5', fontSize: 20, letterSpacing: '.01em', lineHeight: '24px' }}>
          Unit {unit.n}
        </span>
        <span style={{ width: 0.93, height: 20.31, background: unit.tick, flexShrink: 0 }} />
        <span className="font-ub whitespace-nowrap" style={{ color: '#E7CEA5', fontSize: 20, letterSpacing: '.01em', lineHeight: '24px' }}>
          {unit.title}
        </span>
      </div>
      <span style={{ position: 'absolute', left: 0, top: 13.22, width: 30, height: 1, background: unit.rule }} />
      <span style={{ position: 'absolute', right: 0, top: 13.22, width: 30, height: 1, background: unit.rule }} />
    </div>
  )
}

/* ── the rail ───────────────────────────────────────────────────── */

/**
 * One 7px line per unit, running from its first node's centre to its last,
 * with the nodes drawn on top of it in an opaque fill. The export builds the
 * same picture out of a separate line segment per gap; a single line under
 * opaque discs is the same result and cannot drift out of register with the
 * circles it is supposed to stop at.
 */
function Rail({ unit }) {
  const nodes = []
  let y = 0
  unit.groups.forEach((g) => {
    nodeCentres(g).forEach((c, i) => nodes.push({ y: y + c, n: i === 0 ? g.node.n : null, state: i === 0 ? g.node.state : null }))
    y += groupHeight(g) + GROUP_GAP
  })
  const first = nodes[0].y
  const last = nodes[nodes.length - 1].y

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: RAIL_W, height: y, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: (RAIL_W - 7) / 2, top: first, width: 7, height: last - first, background: '#343434' }} />
      {nodes.map((nd, i) => {
        const current = nd.state === 'current'
        return (
          <span key={i}
                style={{
                  position: 'absolute', left: 0.17, top: nd.y - NODE / 2, width: NODE, height: NODE,
                  borderRadius: '50%', boxSizing: 'border-box',
                  background: current ? '#66512D' : '#000000',
                  border: `2px solid ${current ? '#F8C6B7' : '#343434'}`,
                  display: 'grid', placeItems: 'center',
                }}>
            {nd.n != null && (
              <span className="font-rhd"
                    style={{ color: current ? '#FFFFFF' : '#343434', fontSize: 16.76, fontWeight: 600, letterSpacing: '.01em', lineHeight: '22px' }}>
                {nd.n}
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}

/* ── the lesson card ────────────────────────────────────────────── */

const CTA = {
  open: {
    bg: '#FFFFFF1F', line: '#C9C9C9', ink: '#FFFFFF', size: 16, weight: 700, caps: true,
    glow: { w: 163.6, h: 144.55, left: 80.5, top: 0, fill: 'rgba(132,124,141,.59)' },
  },
  locked: {
    bg: '#7D7A7A26', line: '#4F4F4F', ink: '#C3C3C3', size: 16, weight: 700,
    glow: { w: 177.16, h: 126.07, left: 60.18, top: 34, fill: '#3E352E' },
  },
  premium: {
    bg: '#FFFFFF21', line: '#9C9990', ink: '#FFFFFF', size: 18, weight: 600,
    glow: { w: 163.6, h: 144.55, left: 80.5, top: 0, fill: 'rgba(193,183,157,.59)' },
  },
}

function Hero({ hero }) {
  const open = hero.state === 'open'
  const c = CTA[hero.state]
  return (
    <div style={{ position: 'relative', width: CARD_W, height: 344, borderRadius: 20, overflow: 'hidden' }}>
      {open ? (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${hero.art})`, backgroundSize: '100%',
          backgroundPosition: '50% -8.333%', backgroundRepeat: 'no-repeat',
        }} />
      ) : <MissingArt />}

      {/* the scrim the title and the action sit on — blurred, not just dimmed,
          because the export blurs what is behind it and a flat wash over a
          photograph reads as a different card */}
      <div style={{
        position: 'absolute', left: 0, bottom: 0, width: CARD_W,
        height: open ? 135 : 254.46,
        backdropFilter: 'blur(29.6px)', WebkitBackdropFilter: 'blur(29.6px)',
        background: open
          ? 'linear-gradient(180deg, rgba(82,53,18,0) 9.5%, rgba(82,53,18,.75) 69.44%)'
          : 'linear-gradient(180deg, rgba(116,116,116,0) 9.5%, rgba(40,40,40,.75) 69.44%)',
      }} />
      {!open && <MissingMark />}

      <div className="flex items-center"
           style={{ position: 'absolute', left: 16, top: 16.04, gap: 8, background: '#4B4B4B7A', borderRadius: 24, padding: '2px 10px', outline: '1px solid #BABABA', outlineOffset: -1 }}>
        <PlayOutline />
        <span className="font-ub" style={{ color: '#fff', fontSize: 14, letterSpacing: '.01em', lineHeight: '27.7px' }}>{hero.tag}</span>
      </div>

      <div className="flex flex-col items-start"
           style={{ position: 'absolute', left: 0, right: 0, bottom: 7.43, padding: 16, gap: 16 }}>
        <div className="flex items-start" style={{ gap: 8 }}>
          <Screencast fill={open ? '#FFFFFF' : '#C7C7C7'} />
          <span className="font-ub" style={{ color: open ? '#FFFFFF' : '#C7C7C7', fontSize: 20, fontWeight: 700, letterSpacing: '.01em', lineHeight: '24px' }}>
            {hero.title}
          </span>
        </div>

        <div className="flex items-center justify-center"
             style={{ position: 'relative', width: 282, height: 56, borderRadius: 16, gap: 10, overflow: 'hidden', background: c.bg, outline: `1px solid ${c.line}`, outlineOffset: -1 }}>
          <span style={{
            position: 'absolute', left: c.glow.left, top: c.glow.top, width: c.glow.w, height: c.glow.h,
            borderRadius: '50%', background: c.glow.fill, filter: 'blur(44.06px)',
          }} />
          {hero.state === 'locked' && <Padlock />}
          {hero.state === 'premium' && <Gem />}
          <span className={`font-ub relative${c.caps ? ' capitalize' : ''}`}
                style={{ color: c.ink, fontSize: c.size, fontWeight: c.weight, lineHeight: c.size === 18 ? '18px' : '24px', textAlign: 'center' }}>
            {hero.cta}
          </span>
        </div>
      </div>
    </div>
  )
}

function ExerciseRow({ row }) {
  return (
    <div style={{ width: CARD_W, background: '#252525', borderRadius: 20, padding: 16, boxSizing: 'border-box' }}>
      <div className="flex items-center" style={{ gap: 16 }}>
        <span className="grid place-items-center" style={{ background: '#252525', borderRadius: 8, padding: 8, opacity: 0.67 }}>
          {row.icon === 'twister' ? <Twister /> : <GrammarMark />}
        </span>
        <span className="font-ub capitalize"
              style={{ color: '#707070BA', fontSize: 20, fontWeight: 600, letterSpacing: '.01em', lineHeight: '24px' }}>
          {row.label}
        </span>
      </div>
    </div>
  )
}

function Group({ group }) {
  return (
    <div style={{ width: CARD_W }}>
      <div style={{ height: HERO_H }}><Hero hero={group.hero} /></div>
      {group.note && (
        <div className="flex items-start" style={{ height: NOTE_BLOCK, paddingTop: 12, paddingBottom: 16, gap: 15, boxSizing: 'border-box' }}>
          <Sparkle />
          <span className="font-ub" style={{ color: '#737271', fontSize: 18, letterSpacing: '.01em', lineHeight: '28px', width: 264 }}>
            {group.note}
          </span>
        </div>
      )}
      {group.rows.map((r, i) => (
        <div key={i} style={{ height: ROW_H, paddingBottom: 16, marginTop: i ? ROW_GAP : 0, boxSizing: 'border-box' }}>
          <ExerciseRow row={r} />
        </div>
      ))}
    </div>
  )
}

/* ── the scroller ───────────────────────────────────────────────── */

export default function Roadmap({ topPad, bottomPad }) {
  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden no-bar"
         style={{ paddingTop: topPad, paddingLeft: 20, paddingRight: 20, paddingBottom: bottomPad }}>
      {UNITS.map((u, ui) => (
        <div key={u.n} style={{ marginTop: ui ? 26 : 0 }}>
          <Divider unit={u} />
          <div style={{ position: 'relative', marginTop: u.lead, marginLeft: INSET }}>
            <Rail unit={u} />
            <div style={{ marginLeft: RAIL_W + RAIL_GAP }}>
              {u.groups.map((g, gi) => (
                <div key={gi} style={{ marginTop: gi ? GROUP_GAP : 0 }}>
                  <Group group={g} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
