import { Gift, GOLD_EARS, GOLD_TILT, CORAL_87 } from '../gifts.jsx'
import { SLOT, Digits, Chevron, COUPON_D } from './parts.jsx'
import { PaneLight } from './light.jsx'

/* Geometry, fills and copy are read out of Paper's `New FAB` frame node by
   node. What is added here is the motion and the tap target. */

const shell = { position: 'relative', width: SLOT.w, height: SLOT.h, boxSizing: 'border-box' }
const SHADOW = '0 18px 40px #00000070'
const TOP_LIGHT = 'linear-gradient(90deg,#F6D98C00 0%,#F6D98CB8 50%,#F6D98C00 100%)'

/* ── 1 · The gold coupon ─────────────────────────────────────────
   Gold paper, so it gets the sheen and no border shine: a lit gold line
   on a gold field is invisible. The gift is the cream box with the
   coral ribbon, and it rattles with its ribbons swinging after it. */
export function Fab1({ parts, anim }) {
  return (
    <div style={shell}>
      <div style={{ position: 'absolute', left: 14, top: 16, width: 362, height: 88, borderRadius: 24, background: '#F2DFAE3D', filter: 'blur(30px)' }} />
      <svg width="390" height="96" viewBox="0 0 390 96" style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d={COUPON_D} fill="#D3A63D" />
        <path d="M280 15 V81" fill="none" stroke="#FFEDC1" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 7" />
      </svg>
      <div style={{ position: 'absolute', left: 179, top: 2, width: 211, height: 92, borderRadius: 56, background: '#D9794152', filter: 'blur(26px)' }} />

      {anim && <PaneLight shape={COUPON_D} strength={0.30} edge={0} border={1} />}

      <div className="font-id" style={{ position: 'absolute', left: 22, top: 18, color: '#433414', fontSize: 22, fontWeight: 600, letterSpacing: '0.01em', lineHeight: '26px', width: 'max-content' }}>
        Unlock your gift!
      </div>
      <Digits parts={parts} left={20} top={50} tone="gold" />

      <Gift shape={CORAL_87} size={87} ears animate={anim} wrapStyle={{ left: 293, top: 5 }} />
    </div>
  )
}

/* ── 2 · Gold pane, gift on the trailing edge ────────────────────── */
export function Fab2({ parts, anim }) {
  return (
    <div style={{ ...shell, background: 'linear-gradient(96deg,#241B06 0%,#3E3010 58%,#57431A 100%)', border: '1px solid #E9B94D8C', borderRadius: 24, boxShadow: SHADOW }}>
      <div style={{ position: 'absolute', left: 24, top: 0, width: 342, height: 1, background: TOP_LIGHT }} />
      <div style={{ position: 'absolute', left: 272, top: 2, width: 112, height: 92, borderRadius: 56, background: '#D9794152', filter: 'blur(26px)' }} />
      {anim && <PaneLight radius={24} border={1} strength={0.20} edge={0.55} />}
      <div className="font-id" style={{ position: 'absolute', left: 30, top: 22, color: '#fff', fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: '20px', width: 'max-content' }}>
        Unlock your gift!
      </div>
      <Digits parts={parts} left={30} top={51} />
      <Gift shape={GOLD_EARS} size={104} ears animate={anim} wrapStyle={{ left: 272, top: -16 }} />
    </div>
  )
}

/* ── 3 · The tipped box ──────────────────────────────────────────
   Its rest position is already at an angle, so instead of a rattle it
   sways through the upright and back — angle, straight, angle — all
   cycle long. The 9° base tilt lives on the outer wrapper and the sway
   on the inner one, so the two never fight over the same transform. */
export function Fab3({ hms, anim }) {
  return (
    <div style={{ ...shell, background: '#17110A', border: '1.5px solid #E9B94DA8', borderRadius: 24, boxShadow: SHADOW }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 390, height: 96, borderRadius: 24, overflow: 'clip', background: 'linear-gradient(150deg,#F6D98C33 0%,#E9B94C12 48%,#E9B94C05 100%)' }} />
      <div style={{ position: 'absolute', left: 2, top: -4, width: 130, height: 104, borderRadius: 65, background: '#D9794161', filter: 'blur(28px)' }} />
      {anim && <PaneLight radius={24} border={1.5} strength={0.18} edge={0.5} />}
      <div style={{ position: 'absolute', left: 138, top: 25, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div className="font-id" style={{ color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: '22px', width: 'max-content' }}>Tap to unwrap your gift!</div>
        <div className="font-id tnum" style={{ color: '#F2D48A', fontSize: 14, fontWeight: 600, lineHeight: '18px', width: 'max-content' }}>Ends at {hms}</div>
      </div>
      <Chevron left={358} top={40} />
      <Gift shape={GOLD_TILT} size={117} ears idle="sway" animate={anim}
            wrapStyle={{ left: 0, top: 0, rotate: '-9deg', translate: '-0.91px -19.935px', transformOrigin: '0% 0%' }}
            style={{ filter: 'drop-shadow(#0000008C 0px 10px 16px)' }} />
    </div>
  )
}

/* ── 4 · Gold bloom glass ────────────────────────────────────────── */
export function Fab4({ parts, anim }) {
  return (
    <div style={{ ...shell, background: '#100E0AC7', border: '1px solid #E9B94D7A', borderRadius: 26, boxShadow: SHADOW }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 390, height: 96, borderRadius: 26, overflow: 'clip' }}>
        <div style={{ position: 'absolute', left: 10, top: -24, width: 150, height: 144, borderRadius: 75, background: '#E9B94D6B', filter: 'blur(34px)' }} />
        <div style={{ position: 'absolute', left: 17, top: -130, width: 420, height: 356, borderRadius: 52, background: '#E9B94D4D', filter: 'blur(28px)' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 390, height: 96, background: 'linear-gradient(150deg,#F6D98C29 0%,#E9B94C0F 48%,#E9B94C05 100%)' }} />
        <div style={{ position: 'absolute', left: 26, top: 0, width: 338, height: 1, background: 'linear-gradient(90deg,#F6D98C00 0%,#F6D98CC7 50%,#F6D98C00 100%)' }} />
      </div>
      {anim && <PaneLight radius={26} border={1} strength={0.20} edge={0.55} />}
      <div className="font-id" style={{ position: 'absolute', left: 134, top: 26, color: '#fff', fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: '20px', width: 'max-content' }}>
        Unlock your gift!
      </div>
      <Digits parts={parts} left={134} top={53} tile={{ bg: '#0A080359', line: '#E9B94D57', ink: '#FFFFFF', colon: '#E9B94D8C' }} />
      <Chevron left={338} top={34.75} w={15} h={25.5} />
      <Gift shape={GOLD_EARS} size={104} ears animate={anim} wrapStyle={{ left: 15, top: -16 }} />
    </div>
  )
}

/**
 * The four screens, with everything the opening sequence needs to take over
 * from the resting gift: which box it is, how big, and where it sits inside
 * the 390 × 96 slot. The transition reads these rather than measuring the DOM,
 * so the gift it flies to the centre is the same object at the same size.
 */
export const SCREENS = [
  { id: '1', name: 'Gold coupon', C: Fab1, motion: 'rattle + ears + wash',
    gift: { shape: CORAL_87, size: 87, left: 293, top: 5 },
    note: 'gold paper, so the light crosses the coupon instead of running its edge' },
  { id: '2', name: 'Gold pane', C: Fab2, motion: 'rattle + ears + one light',
    gift: { shape: GOLD_EARS, size: 104, left: 272, top: -16 },
    note: 'object on the trailing edge — the border arc reaches it last' },
  { id: '3', name: 'Tipped box', C: Fab3, motion: 'sway + ears + one light',
    gift: { shape: GOLD_TILT, size: 117, left: -0.91, top: -19.935, rotate: -9 },
    note: 'tipped at rest, so it swings through the upright and back' },
  { id: '4', name: 'Bloom glass', C: Fab4, motion: 'rattle + ears + one light',
    gift: { shape: GOLD_EARS, size: 104, left: 15, top: -16 },
    note: 'the busiest ground of the four — the border has the most to fight' },
]

export const byId = (id) => SCREENS.find((s) => s.id === id) ?? SCREENS[0]
