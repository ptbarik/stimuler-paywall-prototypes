import { Gift, GOLD_EARS, GOLD_TILT, GOLD_BOW, BLUE_87, BLUE_80 } from '../gifts.jsx'
import { SLOT, TICKET_D, TICKET_GOLD_D, BorderRun, Digits, Chevron, RoundAction, GOLD_ROUND, TOP_LIGHT } from './parts.jsx'

/* Every variant is the revised sheet's own geometry — the positions, sizes,
   fills and copy are read out of Paper, not re-typed by eye. What is added
   here is only the motion. */

const shell = { position: 'relative', width: SLOT.w, height: SLOT.h, boxSizing: 'border-box' }
const SHADOW = '0 18px 40px #00000070'

function Line({ children, size, weight = 600, color = '#fff', ls = '-0.01em', lh, ...rest }) {
  return (
    <div className="font-id" style={{ color, fontSize: size, fontWeight: weight, letterSpacing: ls, lineHeight: lh ?? `${size + 4}px`, width: 'max-content', ...rest }}>
      {children}
    </div>
  )
}

/* ── 1 · Gold ticket, glare ──────────────────────────────────────
   The only variant already made of gold, so it is the only one that
   cannot use the border chase — a lit gold line on a gold field is
   invisible. It gets a sweep across the paper instead, clipped to the
   die-cut with `clip-path: path()`, kept under half opacity and started
   1.6s in so it never lands on top of the rattle. */
export function Fab1({ hms, anim }) {
  return (
    <div style={shell}>
      <div style={{ position: 'absolute', left: 14, top: 16, width: 362, height: 88, borderRadius: 24, background: '#F2DFAE3D', filter: 'blur(30px)' }} />
      <svg width="390" height="96" viewBox="0 0 390 96" style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d={TICKET_GOLD_D} fill="#E9B94D" />
        <path d="M110 15 V81" fill="none" stroke="#FFEDC1" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 7" />
      </svg>

      <div style={{ position: 'absolute', inset: 0, clipPath: `path('${TICKET_GOLD_D}')`, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className={anim ? 'ticket-glare' : undefined}
             style={{
               position: 'absolute', left: 0, top: -30, width: 54, height: 156,
               background: 'linear-gradient(90deg,#FFFFFF00 0%,#FFFDF200 12%,#FFFDF26B 50%,#FFFDF200 88%,#FFFFFF00 100%)',
               opacity: anim ? 1 : 0,
             }} />
      </div>

      <Gift shape={BLUE_87} size={87} animate={anim} wrapStyle={{ left: 11, top: 5 }} />

      <div style={{ position: 'absolute', left: 130, top: 18, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Line size={10.5} weight={700} ls="0.2em" lh="14px" color="#8A6420">ADMIT ONE · ONE YEAR</Line>
        <Line size={23} weight={800} ls="-0.02em" lh="26px" color="#2A1D05">HALF PRICE</Line>
        <div className="font-id tnum" style={{ color: '#8A6420', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', lineHeight: '15px', width: 'max-content' }}>ENDS {hms}</div>
      </div>

      <RoundAction left={328} top={26} size={44} bg="#2A1D05" arrow="#F2DFAE" />
    </div>
  )
}

/* ── 2 · Dark glass, short-bow gift ──────────────────────────────
   The box breaks the top edge, so the two bow loops swing after it. */
export function Fab2({ parts, anim }) {
  return (
    <div style={{ ...shell, background: '#191307F7', border: '1px solid #E9B94D5C', borderRadius: 24, boxShadow: SHADOW }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 390, height: 96, borderRadius: 24, overflow: 'clip', background: 'linear-gradient(150deg,#F6D98C2E 0%,#E9B94C0F 48%,#E9B94C05 100%)' }}>
        <div style={{ position: 'absolute', left: 24, top: 0, width: 342, height: 1, background: TOP_LIGHT }} />
      </div>
      <div style={{ position: 'absolute', left: 6, top: 2, width: 112, height: 92, borderRadius: 56, background: '#D9794152', filter: 'blur(26px)' }} />
      <Gift shape={GOLD_BOW} size={106} ears animate={anim} wrapStyle={{ left: 8, top: -16 }} />
      <div style={{ position: 'absolute', left: 124, top: 26 }}><Line size={16}>Your gift is waiting</Line></div>
      <Digits parts={parts} left={124} top={51} />
      <RoundAction left={326} top={23} bg={GOLD_ROUND} />
      <BorderRun radius={24} run={anim} />
    </div>
  )
}

/* ── 3 · Black ticket, blue gift ─────────────────────────────────
   The box sits inside the pill, so the ribbons stay with it — there is
   nowhere for them to swing into, and ears that flap against a hard
   edge read as a glitch rather than an invitation. */
export function Fab3({ parts, anim }) {
  return (
    <div style={shell}>
      <div style={{ position: 'absolute', left: 14, top: 18, width: 362, height: 88, borderRadius: 24, background: '#E9B94D33', filter: 'blur(30px)' }} />
      <svg width="392" height="98" viewBox="-1 -1 392 98" style={{ position: 'absolute', left: -1, top: -1 }}>
        <path d={TICKET_D} fill="#14110A" stroke="#E9B94D8C" />
        <path d="M110 15 V81" fill="none" stroke="#E9B94D7A" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 7" />
      </svg>
      <Gift shape={BLUE_80} size={80} animate={anim} wrapStyle={{ left: 14, top: 6 }} />
      <div style={{ position: 'absolute', left: 130, top: 26 }}><Line size={16}>Your gift is waiting</Line></div>
      <Digits parts={parts} left={130} top={51} />
      <Chevron left={339} top={39.5} />
      <BorderRun shape={TICKET_D} run={anim} />
    </div>
  )
}

/* ── 4 · Gold pane, gift on the trailing edge ────────────────────── */
export function Fab4({ parts, anim }) {
  return (
    <div style={{ ...shell, background: 'linear-gradient(96deg,#241B06 0%,#3E3010 58%,#57431A 100%)', border: '1px solid #E9B94D8C', borderRadius: 24, boxShadow: SHADOW }}>
      <div style={{ position: 'absolute', left: 24, top: 0, width: 342, height: 1, background: TOP_LIGHT }} />
      <div style={{ position: 'absolute', left: 272, top: 2, width: 112, height: 92, borderRadius: 56, background: '#D9794152', filter: 'blur(26px)' }} />
      <div className="flex items-center" style={{ position: 'absolute', left: 30, top: 22, gap: 8 }}>
        <Line size={18}>Unlock your gift!</Line>
        <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}>
          <path d="M1.4 1.4 6.6 7l-5.2 5.6" fill="none" stroke="#F2D48A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <Digits parts={parts} left={30} top={51} />
      <Gift shape={GOLD_EARS} size={104} ears animate={anim} wrapStyle={{ left: 272, top: -16 }} />
      <BorderRun radius={24} run={anim} />
    </div>
  )
}

/* ── 5 · Underlit glass ──────────────────────────────────────────── */
export function Fab5({ hms, anim }) {
  return (
    <div style={{ ...shell, background: '#0E0E12C7', border: '1px solid #FFFFFF2E', borderRadius: 26, boxShadow: SHADOW }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 390, height: 96, borderRadius: 26, overflow: 'clip', background: 'linear-gradient(200deg,#FFFFFF0A 0%,#FFFFFF08 46%,#E9B94C1F 100%)' }}>
        <div style={{ position: 'absolute', left: 40, top: 70, width: 310, height: 40, borderRadius: 20, background: '#E9B94D7A', filter: 'blur(24px)' }} />
        <div style={{ position: 'absolute', left: 0, top: 93, width: 390, height: 2, background: 'linear-gradient(90deg,#E9B94C1F 0%,#F6D98C 46%,#E9B94C4D 100%)' }} />
        <div className="flex flex-col items-start justify-center"
             style={{ position: 'absolute', left: 'calc(50% + 23.5px)', top: 26, translate: '-50%', gap: 6 }}>
          <Line size={19} lh="20px">Unlock your gift!</Line>
          <div className="font-id tnum" style={{ color: '#FFFFFFB8', fontSize: 16, fontWeight: 600, lineHeight: '18px', width: 'max-content' }}>Ends {hms}</div>
        </div>
        <Chevron left={345} top={39} />
      </div>
      <Gift shape={GOLD_EARS} size={104} ears animate={anim} wrapStyle={{ left: 16, top: -16 }} />
      <BorderRun radius={26} run={anim} />
    </div>
  )
}

/* ── 6 · Sticker, tipped 9° ──────────────────────────────────────
   The base tilt lives on the outer wrapper and the rattle on the inner
   one, so the two never fight over the same transform. */
export function Fab6({ hms, anim }) {
  return (
    <div style={{ ...shell, background: '#17110A', border: '1.5px solid #E9B94DA8', borderRadius: 24, boxShadow: SHADOW }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 390, height: 96, borderRadius: 24, overflow: 'clip', background: 'linear-gradient(150deg,#F6D98C33 0%,#E9B94C12 48%,#E9B94C05 100%)' }} />
      <div style={{ position: 'absolute', left: 2, top: -4, width: 130, height: 104, borderRadius: 65, background: '#D9794161', filter: 'blur(28px)' }} />
      <Gift shape={GOLD_TILT} size={117} ears animate={anim}
            wrapStyle={{ left: 0, top: 0, rotate: '-9deg', translate: '-0.91px -19.935px', transformOrigin: '0% 0%' }}
            style={{ filter: 'drop-shadow(#0000008C 0px 10px 16px)' }} />
      <div style={{ position: 'absolute', left: 138, top: 25, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Line size={18} weight={700} ls="-0.015em" lh="22px">Tap to unwrap your gift!</Line>
        <div className="font-id tnum" style={{ color: '#F2D48A', fontSize: 14, fontWeight: 600, lineHeight: '18px', width: 'max-content' }}>Ends at {hms}</div>
      </div>
      <Chevron left={358} top={40} />
      <BorderRun radius={24} run={anim} width={2} inset={1.5} />
    </div>
  )
}

/* ── 7 · Gold bloom glass ────────────────────────────────────────── */
export function Fab7({ hms, anim }) {
  return (
    <div style={{ ...shell, background: '#100E0AC7', border: '1px solid #E9B94D7A', borderRadius: 26, boxShadow: SHADOW }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 390, height: 96, borderRadius: 26, overflow: 'clip' }}>
        <div style={{ position: 'absolute', left: 10, top: -24, width: 150, height: 144, borderRadius: 75, background: '#E9B94D6B', filter: 'blur(34px)' }} />
        <div style={{ position: 'absolute', left: 17, top: -130, width: 420, height: 356, borderRadius: 52, background: '#E9B94D4D', filter: 'blur(28px)' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 390, height: 96, background: 'linear-gradient(150deg,#F6D98C29 0%,#E9B94C0F 48%,#E9B94C05 100%)' }} />
        <div style={{ position: 'absolute', left: 26, top: 0, width: 338, height: 1, background: 'linear-gradient(90deg,#F6D98C00 0%,#F6D98CC7 50%,#F6D98C00 100%)' }} />
        <Chevron left={338} top={34.75} w={15} h={25.5} />
        <div style={{ position: 'absolute', left: 134, top: 26, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Line size={20} lh="20px">Unlock your gift!</Line>
          <div className="font-id tnum" style={{ color: '#F2D48A', fontSize: 14, fontWeight: 600, lineHeight: '18px', width: 'max-content' }}>Closes in {hms}</div>
        </div>
      </div>
      <Gift shape={GOLD_EARS} size={104} ears animate={anim} wrapStyle={{ left: 15, top: -16 }} />
      <BorderRun radius={26} run={anim} />
    </div>
  )
}

/* ── 8 · Black ticket, “Claim your surprise!” ────────────────────── */
export function Fab8({ parts, anim }) {
  return (
    <div style={shell}>
      <div style={{ position: 'absolute', left: 14, top: 18, width: 362, height: 88, borderRadius: 24, background: '#E9B94D33', filter: 'blur(30px)' }} />
      <svg width="392" height="98" viewBox="-1 -1 392 98" style={{ position: 'absolute', left: -1, top: -1 }}>
        <path d={TICKET_D} fill="#14110A" stroke="#E9B94D8C" />
        <path d="M110 15 V81" fill="none" stroke="#E9B94D7A" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 7" />
      </svg>
      <Gift shape={BLUE_80} size={80} animate={anim} wrapStyle={{ left: 14, top: 6 }} />
      <div style={{ position: 'absolute', left: 138, top: 26 }}><Line size={16}>Claim your surprise!</Line></div>
      <Digits parts={parts} left={138} top={51} />
      <Chevron left={339} top={39.5} />
      <BorderRun shape={TICKET_D} run={anim} />
    </div>
  )
}

export const FABS = [
  { id: '1', name: 'Gold ticket', C: Fab1, motion: 'rattle + glare',
    note: 'the only gold-on-gold pane, so it takes a sweep across the paper rather than a line around the edge' },
  { id: '2', name: 'Dark glass, short bow', C: Fab2, motion: 'rattle + ears + border',
    note: 'the box breaks the top edge, so the bow loops swing on after it' },
  { id: '3', name: 'Black ticket', C: Fab3, motion: 'rattle + border',
    note: 'the gift sits inside the pill — the ribbons stay with the box' },
  { id: '4', name: 'Gold pane, gift trailing', C: Fab4, motion: 'rattle + ears + border',
    note: 'object on the right, so the border chase arrives at it last' },
  { id: '5', name: 'Underlit glass', C: Fab5, motion: 'rattle + ears + border',
    note: 'the chase and the standing bottom light are the same gold, one moving and one not' },
  { id: '6', name: 'Sticker, tipped 9°', C: Fab6, motion: 'rattle + ears + border',
    note: 'the 9° tilt is the rest position; the rattle rocks around it' },
  { id: '7', name: 'Gold bloom glass', C: Fab7, motion: 'rattle + ears + border',
    note: 'the busiest ground of the eight — the border has the most to fight' },
  { id: '8', name: 'Black ticket, surprise', C: Fab8, motion: 'rattle + border',
    note: 'gift inside the pill again, with the loudest line of the eight' },
]

export const byId = (id) => FABS.find((f) => f.id === id) ?? FABS[0]
