import { PaneLight } from './light.jsx'
import Rosette from './Rosette.jsx'
import { NAV_H } from '../components/Chrome.jsx'
import { GLASS_TABS } from './interactive.jsx'
import { DIRECTION_TABS } from './directions.jsx'

/**
 * Six floating actions, all of them the starburst paywall arriving early.
 *
 * The brief was two things at once — make the tab *convert*, and make it
 * *shorter*. Those pull against each other: the current seven run 66 to 93px
 * tall because each one is a title, a subtitle and a six-tile countdown
 * stacked, and the usual way to shorten that is to throw away the offer.
 *
 * None of these do. They get their height back by making the discount an
 * **object** rather than a line of copy — the paywall's own nine-point rosette,
 * carrying `50%` on its face, where a `Save 50%` chip and a row of clock tiles
 * used to be. One glyph replaces two text runs and a six-tile strip, and it is
 * also the thing you want the thumb to land on. So the tabs come in at 52–58.
 *
 * The badge is `Rosette`, which pulls its vertices from the paywall's
 * `starburst.js`. That is what lets `BadgeOpen` fly this exact shape into the
 * paywall's slot and have the paywall's own copy take over in place.
 *
 * ── the geometry ──────────────────────────────────────────────────
 *
 * Each entry declares its own `box` in frame coordinates and its own `badge`
 * centre inside that box, because they do not all sit at the same height and
 * two of them deliberately overhang their own bar. Stated rather than derived:
 * where the badge sits is a composition decision per tab, and the open
 * transition needs the answer in pixels.
 */

const FRAME_H = 892
const GOLD_BAR = 'linear-gradient(104deg,#B47A22 0%,#E8B54B 44%,#FFE7A8 72%,#E0A93F 100%)'
const SHADOW = '0 16px 36px #00000085'

/** top edge of a tab `h` tall sitting `gap` above the nav */
const sit = (h, gap) => FRAME_H - NAV_H - gap - h

const box = (top, h) => ({ position: 'absolute', left: 0, top, width: 412, height: h })

/* ── B · Struck coin ────────────────────────────────────────────────
   54 tall, and the only one where the *tab* is the gold and the badge
   is the shadow punched out of it. Loudest of the six. */
function B({ clock }) {
  return (
    <div style={box(sit(54, 14), 54)}>
      <div style={{ position: 'absolute', left: 27, top: 4, width: 358, height: 50, borderRadius: 27, background: '#E8B54B45', filter: 'blur(22px)' }} />
      <div style={{
        position: 'absolute', left: 11, top: 0, width: 390, height: 54, borderRadius: 27,
        background: GOLD_BAR, overflow: 'clip', boxShadow: SHADOW,
      }}>
        <div style={{ position: 'absolute', left: 24, top: 0, width: 300, height: 1, background: 'linear-gradient(90deg,#FFF6DF00,#FFF9EAD9,#FFF6DF00)' }} />
        <PaneLight radius={27} border={0} strength={0.3} edge={0.5} edgeColor="#FFF6DF" />
      </div>
      <div className="font-id" style={{ position: 'absolute', left: 33, top: 11, fontSize: 17, fontWeight: 700, letterSpacing: '-.012em', lineHeight: '21px', color: '#3A2A0C' }}>
        Get Stimuler PRO
      </div>
      <div className="font-id tnum" style={{ position: 'absolute', left: 33, top: 32, fontSize: 12, fontWeight: 600, lineHeight: '15px', color: '#4A350C' }}>
        {clock.hms} left at this price
      </div>
      <div style={{ position: 'absolute', left: 327, top: 2 }}><Rosette size={50} fill="#2E2108" ink="#FFD98A" /></div>
    </div>
  )
}

/* ── C · Contour field ──────────────────────────────────────────────
   52 — the shortest. The paywall's contour rings become the tab's own
   ground, spreading out of the badge, so one line of copy is enough. */
function C({ clock }) {
  return (
    <div style={box(sit(52, 14), 52)}>
      <div style={{
        position: 'absolute', left: 11, top: 0, width: 390, height: 52, borderRadius: 26,
        background: '#13100A', border: '1px solid #8C6A2E8C', boxSizing: 'border-box',
        overflow: 'clip', boxShadow: SHADOW,
      }}>
        <svg width="390" height="52" viewBox="0 0 390 52" style={{ position: 'absolute', left: 0, top: 0 }}>
          <g fill="none" stroke="#E8B54B">
            {[[34, 30, 0.3], [52, 46, 0.2], [70, 62, 0.13], [90, 80, 0.08], [112, 99, 0.05]].map(([rx, ry, o]) => (
              <ellipse key={rx} cx="46" cy="26" rx={rx} ry={ry} opacity={o} />
            ))}
          </g>
        </svg>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 150, height: 52, background: 'linear-gradient(90deg,#E8B54B2E 0%,#E8B54B00 100%)' }} />
        <PaneLight radius={26} border={1} strength={0.22} edge={0.6} />
      </div>
      <div style={{ position: 'absolute', left: 31, top: 0 }}><Rosette size={52} /></div>
      <div className="font-id" style={{ position: 'absolute', left: 91, top: 17, fontSize: 16, fontWeight: 700, letterSpacing: '-.012em', lineHeight: '19px', color: '#FFE7A8' }}>
        Claim 50% off PRO
      </div>
      <div className="grid place-items-center" style={{
        position: 'absolute', left: 275, top: 14, width: 106, height: 25, borderRadius: 13,
        background: '#2C210A', border: '1px solid #B47A2275', boxSizing: 'border-box',
      }}>
        <span className="font-id tnum" style={{ fontSize: 13.5, fontWeight: 700, color: '#FFD98A' }}>{clock.hms}</span>
      </div>
    </div>
  )
}

/* ── D · Stub ticket ────────────────────────────────────────────────
   The die-cut from the current tabs, cut from 82 to 58, with the badge
   stamped on the stub where the crown used to be. */
const TICKET_58 =
  'M17,0 H279 A9 9 0 0 0 297 0 H373 A17 17 0 0 1 390 17 V41 A17 17 0 0 1 373 58 H297 A9 9 0 0 0 279 58 H17 A17 17 0 0 1 0 41 V17 A17 17 0 0 1 17 0 Z'

function D({ clock }) {
  return (
    <div style={box(sit(58, 14), 58)}>
      <div style={{ position: 'absolute', left: 27, top: 6, width: 358, height: 50, borderRadius: 26, background: '#E8B54B3D', filter: 'blur(22px)' }} />
      <div style={{ position: 'absolute', left: 11, top: 0, width: 390, height: 58 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(118deg,#E8B54B 0%,#FFE7A8 52%,#D7A23A 100%)',
          clipPath: `path('${TICKET_58}')`,
        }} />
        <svg width="390" height="58" viewBox="0 0 390 58" style={{ position: 'absolute', left: 0, top: 0 }}>
          <path d="M288 11V47" fill="none" stroke="#8A6319" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 6" opacity="0.5" />
        </svg>
        <PaneLight shape={TICKET_58} border={1.5} strength={0.3} edge={0.62} edgeColor="#FFF6DF" />
      </div>
      <div className="font-id" style={{ position: 'absolute', left: 35, top: 11, fontSize: 18, fontWeight: 700, letterSpacing: '-.012em', lineHeight: '22px', color: '#3A2A0C' }}>
        Get Stimuler PRO
      </div>
      <div className="font-id tnum" style={{ position: 'absolute', left: 35, top: 34, fontSize: 12, fontWeight: 600, lineHeight: '15px', color: '#4A350C' }}>
        50% off · {clock.hms} left
      </div>
      <div style={{ position: 'absolute', left: 321, top: 3 }}><Rosette size={52} fill="#3A2A0C" ink="#FFD98A" /></div>
    </div>
  )
}

/* ── F · Seal off the end ───────────────────────────────────────────
   The biggest badge of the six, hung off the pill's left end so it can
   carry the whole figure — 50% *and* OFF — and leave the bar quiet. */
function F({ clock }) {
  return (
    <div style={box(sit(54, 14) - 8, 62)}>
      <div style={{ position: 'absolute', left: 48, top: 10, width: 340, height: 50, borderRadius: 25, background: '#E8B54B33', filter: 'blur(20px)' }} />
      <div style={{
        position: 'absolute', left: 45, top: 8, width: 356, height: 54, borderRadius: 27,
        background: 'linear-gradient(96deg,#1E170D 0%,#241B0E 48%,#3A2B10 100%)',
        border: '1px solid #B47A2299', boxSizing: 'border-box', boxShadow: SHADOW,
      }}>
        <PaneLight radius={27} border={1} strength={0.24} edge={0.6} />
      </div>
      <div className="font-id" style={{ position: 'absolute', left: 89, top: 18, fontSize: 16.5, fontWeight: 700, letterSpacing: '-.012em', lineHeight: '20px', color: '#FFE7A8' }}>
        Get Stimuler PRO
      </div>
      <div className="font-id" style={{ position: 'absolute', left: 89, top: 39, fontSize: 12.5, fontWeight: 500, lineHeight: '16px', color: '#A9966B' }}>
        50% off, today only
      </div>
      <div className="grid place-items-center" style={{
        position: 'absolute', left: 287, top: 23, width: 96, height: 24, borderRadius: 12,
        background: '#0F0C06', border: '1px solid #B47A2259', boxSizing: 'border-box',
      }}>
        <span className="font-id tnum" style={{ fontSize: 13, fontWeight: 700, color: '#FFD98A' }}>{clock.hms}</span>
      </div>
      <div style={{ position: 'absolute', left: 13, top: 0 }}><Rosette size={76} /></div>
    </div>
  )
}


/* ══ the six that never show the badge ═══════════════════════════════
   Each of these carries the discount as something else, and declares a
   `reveal` instead of a `badge`: where the disc forms when the tap starts,
   and which device has to get out of the way first. The badge is made on
   the way to the paywall rather than carried there. */

const DARK_BAR = 'linear-gradient(170deg,#1C160C 0%,#110E08 100%)'
const RIM = '1px solid #B47A2299'

/* ── G · Price fall ─────────────────────────────────────────────────
   No percentage anywhere. The discount is the gap between two numbers,
   which is the one framing that survives a reader who does not trust
   percentages — and most of them do not. */
function G({ clock }) {
  return (
    <div style={box(sit(52, 14), 52)}>
      <div style={{
        position: 'absolute', left: 11, top: 0, width: 390, height: 52, borderRadius: 26,
        background: DARK_BAR, border: RIM, boxSizing: 'border-box', boxShadow: SHADOW,
      }}>
        <PaneLight radius={26} border={1} strength={0.24} edge={0.6} />
      </div>
      <div className="font-id" data-part="was" style={{
        position: 'absolute', left: 33, top: 18, fontSize: 13, fontWeight: 600,
        lineHeight: '17px', color: '#8A7D62', textDecoration: 'line-through',
      }}>$12.99</div>
      <svg width="13" height="13" viewBox="0 0 14 14" style={{ position: 'absolute', left: 87, top: 20 }}>
        <path d="M7 2v9M3.2 7.4 7 11.2l3.8-3.8" fill="none" stroke="#E8B54B" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="font-id" style={{
        position: 'absolute', left: 110, top: 10, fontSize: 25, fontWeight: 700,
        letterSpacing: '-.025em', lineHeight: '31px', color: '#FFE7A8',
      }}>$6.49</div>
      <div className="font-id" style={{
        position: 'absolute', left: 177, top: 26, fontSize: 12, fontWeight: 500,
        lineHeight: '15px', color: '#A9966B',
      }}>/month</div>
      <div className="grid place-items-center" style={{
        position: 'absolute', left: 282, top: 11, width: 100, height: 30, borderRadius: 15,
        background: 'linear-gradient(104deg,#FFE7A8 0%,#E8B54B 60%,#D59F34 100%)',
      }}>
        <span className="font-id" style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-.01em', color: '#3A2A0C' }}>Get PRO</span>
      </div>
    </div>
  )
}

/* ── H · The gauge ──────────────────────────────────────────────────
   The arc is the only figure, and it is half. Reads as something you
   did rather than something you were offered. */
function H({ clock }) {
  return (
    <div style={box(sit(54, 14), 54)}>
      <div style={{
        position: 'absolute', left: 11, top: 0, width: 390, height: 54, borderRadius: 27,
        background: DARK_BAR, border: RIM, boxSizing: 'border-box', boxShadow: SHADOW,
      }}>
        <PaneLight radius={27} border={1} strength={0.24} edge={0.6} />
      </div>
      <svg width="38" height="38" viewBox="0 0 38 38" style={{ position: 'absolute', left: 28, top: 8 }}>
        <circle cx="19" cy="19" r="15" fill="none" stroke="#6E5B35" strokeWidth="4.5" />
        <path d="M19 4 A15 15 0 0 1 19 34" fill="none" stroke="#E8B54B" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="19" cy="34" r="3.4" fill="#FFE7A8" />
      </svg>
      <div className="font-id" style={{
        position: 'absolute', left: 77, top: 11, fontSize: 15.5, fontWeight: 700,
        letterSpacing: '-.012em', lineHeight: '19px', color: '#FFE7A8',
      }}>You’ve earned 50% off</div>
      <div className="font-id" style={{
        position: 'absolute', left: 77, top: 31, fontSize: 12, fontWeight: 500,
        lineHeight: '15px', color: '#A9966B',
      }}>Yours for the next <span className="tnum">{clock.hms}</span></div>
      <svg width="20" height="20" viewBox="0 0 18 18" style={{ position: 'absolute', left: 363, top: 17 }}>
        <path d="M4 9h9M9 4.6 13.4 9 9 13.4" fill="none" stroke="#E8B54B" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/* ── I · Scratch strip ──────────────────────────────────────────────
   The only one that withholds the number — strongest pull of the six,
   and the only one that can disappoint, because it has to be 50 every
   single time or the mechanic is a lie. */
function I({ clock }) {
  return (
    <div style={box(sit(54, 14), 54)}>
      <div style={{
        position: 'absolute', left: 11, top: 0, width: 390, height: 54, borderRadius: 27,
        background: DARK_BAR, border: RIM, boxSizing: 'border-box', boxShadow: SHADOW,
      }}>
        <PaneLight radius={27} border={1} strength={0.24} edge={0.6} />
      </div>
      <div className="font-id" style={{
        position: 'absolute', left: 35, top: 11, fontSize: 15.5, fontWeight: 700,
        letterSpacing: '-.012em', lineHeight: '19px', color: '#FFE7A8',
      }}>A code is waiting</div>
      <div className="font-id" style={{
        position: 'absolute', left: 35, top: 31, fontSize: 12, fontWeight: 500,
        lineHeight: '15px', color: '#A9966B',
      }}>Tap to see how much comes off</div>
      <div style={{
        position: 'absolute', left: 261, top: 8, width: 122, height: 38, borderRadius: 11,
        background: 'linear-gradient(118deg,#8C8578 0%,#D3CCBC 46%,#9A9284 100%)', overflow: 'clip',
      }}>
        <svg width="122" height="38" viewBox="0 0 122 38" style={{ position: 'absolute', left: 0, top: 0 }}>
          <g stroke="#fff" strokeWidth="1" opacity="0.26">
            {[-20, 0, 20, 40, 60, 80, 100].map((x) => <path key={x} d={`M${x} 38 L${x + 38} 0`} />)}
          </g>
        </svg>
        <div className="font-id" style={{
          position: 'absolute', left: 0, top: 13, width: 122, textAlign: 'center',
          fontSize: 10.5, fontWeight: 700, letterSpacing: '.17em', color: '#56503F',
        }}>SCRATCH</div>
      </div>
    </div>
  )
}

/* ── J · Odometer ───────────────────────────────────────────────────
   Split tiles and a seam, so the number looks mechanical and therefore
   temporary — it is going to roll. */
function J({ clock }) {
  const tile = {
    position: 'absolute', top: 9, width: 27, height: 34, borderRadius: 7,
    background: 'linear-gradient(118deg,#FFE7A8 0%,#E8B54B 70%,#D59F34 100%)', overflow: 'clip',
  }
  const digit = {
    position: 'absolute', left: 0, top: 7, width: 27, textAlign: 'center',
    fontSize: 19, fontWeight: 700, lineHeight: '21px', color: '#3A2A0C',
  }
  const seam = { position: 'absolute', left: 0, top: 17, width: 27, height: 1, background: '#9A701C66' }
  return (
    <div style={box(sit(52, 14), 52)}>
      <div style={{
        position: 'absolute', left: 11, top: 0, width: 390, height: 52, borderRadius: 26,
        background: DARK_BAR, border: RIM, boxSizing: 'border-box', boxShadow: SHADOW,
      }}>
        <PaneLight radius={26} border={1} strength={0.24} edge={0.6} />
      </div>
      <div style={{ ...tile, left: 31 }}><div style={seam} /><div className="font-id" style={digit}>5</div></div>
      <div style={{ ...tile, left: 62 }}><div style={seam} /><div className="font-id" style={digit}>0</div></div>
      <div style={{
        position: 'absolute', left: 93, top: 9, width: 27, height: 34, borderRadius: 7,
        background: '#2C210A', border: '1px solid #B47A2259', boxSizing: 'border-box',
      }}>
        <div className="font-id" style={{ ...digit, fontSize: 17, color: '#FFD98A', width: 25 }}>%</div>
      </div>
      <div className="font-id" style={{
        position: 'absolute', left: 133, top: 13, fontSize: 13.5, fontWeight: 700,
        letterSpacing: '.08em', lineHeight: '17px', color: '#FFE7A8',
      }}>OFF PRO TODAY</div>
      <div className="font-id" style={{
        position: 'absolute', left: 133, top: 31, fontSize: 11.5, fontWeight: 500,
        lineHeight: '14px', color: '#8A7D62',
      }}>rolls back at <span className="tnum">{clock.hms}</span></div>
      <svg width="20" height="20" viewBox="0 0 18 18" style={{ position: 'absolute', left: 363, top: 16 }}>
        <path d="M4 9h9M9 4.6 13.4 9 9 13.4" fill="none" stroke="#E8B54B" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/* ── K · The lock ───────────────────────────────────────────────────
   The only one that leads with what you get rather than what it costs.
   The discount is the second line, which is where it belongs when the
   thing above it is worth having. */
function K({ clock }) {
  return (
    <div style={box(sit(56, 14), 56)}>
      <div style={{
        position: 'absolute', left: 11, top: 0, width: 390, height: 56, borderRadius: 28,
        background: DARK_BAR, border: RIM, boxSizing: 'border-box', boxShadow: SHADOW,
      }}>
        <PaneLight radius={28} border={1} strength={0.24} edge={0.6} />
      </div>
      <svg width="30" height="34" viewBox="0 0 30 34" style={{ position: 'absolute', left: 31, top: 11 }}>
        <defs>
          <linearGradient id="lockGold" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FFE7A8" /><stop offset="60%" stopColor="#E8B54B" /><stop offset="100%" stopColor="#C08F2C" />
          </linearGradient>
        </defs>
        <path d="M9.5 13V9.5a5.5 5.5 0 0 1 11 0V13" fill="none" stroke="#E8B54B" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="4.5" y="13" width="21" height="16.5" rx="4.6" fill="url(#lockGold)" />
        <circle cx="15" cy="21.3" r="2.1" fill="#3A2A0C" />
      </svg>
      <div className="font-id" style={{
        position: 'absolute', left: 73, top: 12, fontSize: 16, fontWeight: 700,
        letterSpacing: '-.012em', lineHeight: '20px', color: '#FFE7A8',
      }}>Unlimited calls with Sarah</div>
      <div className="font-id" style={{
        position: 'absolute', left: 73, top: 33, fontSize: 12, fontWeight: 500,
        lineHeight: '15px', color: '#A9966B',
      }}>Locked — open it at half price</div>
      <svg width="20" height="20" viewBox="0 0 18 18" style={{ position: 'absolute', left: 363, top: 18 }}>
        <path d="M4 9h9M9 4.6 13.4 9 9 13.4" fill="none" stroke="#E8B54B" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/* ── L · Midnight bar ───────────────────────────────────────────────
   One line, one bar, no device at all — the hairline along the bottom
   edge is the day draining. 50px, the shortest of the ten. */
function L({ clock }) {
  return (
    <div style={box(sit(50, 14), 50)}>
      <div style={{
        position: 'absolute', left: 11, top: 0, width: 390, height: 50, borderRadius: 25,
        background: DARK_BAR, border: RIM, boxSizing: 'border-box', overflow: 'clip', boxShadow: SHADOW,
      }}>
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: 390, height: 3, background: '#2E2616' }} />
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: 148, height: 3, background: 'linear-gradient(90deg,#B47A22 0%,#FFE7A8 100%)' }} />
        <PaneLight radius={25} border={1} strength={0.24} edge={0.6} />
      </div>
      <div className="font-id" style={{
        position: 'absolute', left: 35, top: 16, fontSize: 16, fontWeight: 700,
        letterSpacing: '-.012em', lineHeight: '20px', color: '#FFE7A8',
      }}>Your 50% expires at midnight</div>
      <div className="font-id tnum" style={{
        position: 'absolute', left: 293, top: 18, width: 88, textAlign: 'right',
        fontSize: 13.5, fontWeight: 700, lineHeight: '17px', color: '#E8B54B',
      }}>{clock.hms}</div>
    </div>
  )
}

/**
 * Ten tabs.
 *
 * `badge` is the rosette's centre **in frame coordinates**, for the four that
 * show one. `reveal` is the same thing for the six that do not: where the disc
 * forms when the tap starts, and which device has to clear out first. Both are
 * stated rather than derived — two of the four hang their badge off their own
 * bar, and the six put their disc wherever the device they are replacing was.
 *
 * B, C, D and F were 2, 3, 4 and 6 in the first set and are unchanged.
 */
export const SCREENS = [
  /* S–V: the four directions. The tab opens rather than states — a seal, a
     reel, a tag, a rail — and the copy completes as it opens. */
  ...DIRECTION_TABS,

  { id: 'b', alias: '2', key: 'B', name: 'Struck coin', h: 54, C: B, copy: 'direct',
    badge: { cx: 352, cy: sit(54, 14) + 27, size: 50 },
    note: 'the tab is the coin face and the badge is punched out of it in shadow' },
  { id: 'c', alias: '3', key: 'C', name: 'Contour field', h: 52, C: C, copy: 'direct',
    badge: { cx: 57, cy: sit(52, 14) + 26, size: 52 },
    note: 'the paywall’s contour rings as the tab’s own ground' },
  { id: 'd', alias: '4', key: 'D', name: 'Stub ticket', h: 58, C: D, copy: 'direct',
    badge: { cx: 347, cy: sit(58, 14) + 29, size: 52 },
    note: 'the die-cut cut down to 58, badge stamped on the stub' },
  { id: 'f', alias: '6', key: 'F', name: 'Seal off the end', h: 54, C: F, copy: 'direct',
    badge: { cx: 51, cy: sit(54, 14) - 8 + 38, size: 76 },
    note: 'the biggest badge, hung off the pill’s end' },

  { id: 'g', key: 'G', name: 'Price fall', h: 52, C: G, copy: 'price anchor',
    reveal: { kind: 'price', cx: 143, cy: sit(52, 14) + 26, size: 52,
              from: { x: 110, y: sit(52, 14) + 10, w: 67, h: 31, r: 7 } },
    note: 'no percentage anywhere — the discount is the gap between two numbers' },
  { id: 'h', key: 'H', name: 'The gauge', h: 54, C: H, copy: 'earned',
    reveal: { kind: 'gauge', cx: 47, cy: sit(54, 14) + 27, size: 46 },
    note: 'the arc is the only figure, and it is half' },
  { id: 'i', key: 'I', name: 'Scratch strip', h: 54, C: I, copy: 'curiosity',
    reveal: { kind: 'scratch', cx: 322, cy: sit(54, 14) + 27, size: 50,
              strip: { x: 261, y: sit(54, 14) + 8, w: 122, h: 38 } },
    note: 'the only one that withholds the number' },
  { id: 'j', key: 'J', name: 'Odometer', h: 52, C: J, copy: 'plain',
    reveal: { kind: 'odometer', cx: 76, cy: sit(52, 14) + 26, size: 52,
              from: { x: 31, y: sit(52, 14) + 9, w: 89, h: 34, r: 7 } },
    note: 'split tiles and a seam — the number looks like it is going to roll' },
  { id: 'k', key: 'K', name: 'The lock', h: 56, C: K, copy: 'benefit first',
    reveal: { kind: 'lock', cx: 46, cy: sit(56, 14) + 28, size: 50,
              from: { x: 35, y: sit(56, 14) + 24, w: 21, h: 17, r: 5 } },
    note: 'leads with what you get, not what it costs' },
  { id: 'l', key: 'L', name: 'Midnight bar', h: 50, C: L, copy: 'loss',
    reveal: { kind: 'bar', cx: 206, cy: sit(50, 14) + 25, size: 48,
              rail: { x: 11, y: sit(50, 14) + 47, w: 390, lit: 148 } },
    note: 'one line, one bar — the hairline is the day draining' },

  /* M–R: glass, and something to do on it. Superseded — the brief rules out
     glassmorphism, so these are kept for reference rather than taken forward. */
  /* (was: glass, and something to do on it. They report their own origin at
     commit time rather than declaring a badge, because on five of the six the
     thing that becomes the badge has been moved by the user.) */
  ...GLASS_TABS.map((t) => ({ ...t, superseded: true })),
]

export const byId = (id) => {
  const k = String(id ?? '').toLowerCase()
  return SCREENS.find((s) => s.id === k || s.alias === k) ?? SCREENS[0]
}
