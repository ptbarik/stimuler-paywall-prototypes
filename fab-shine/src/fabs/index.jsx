import { PaneLight, Twinkle, Star } from './light.jsx'
import { TICKET_D, Mark, Crown, Chev, Tiles, Title, TOP_LIGHT } from './parts.jsx'

/* Seven tabs, at Paper's own geometry from the `1XDM-1` frame. The sheet
   writes its golds in oklab; every one is resolved to hex here so seven tabs
   cannot quietly disagree on a browser that interpolates differently.
 What is added
   here is the light and the twinkle; nothing about the surfaces is invented.

   Each tab reports its own `top` because they do not all sit at the same
   height — the sheet ranges from 657 to 673 depending on how tall the tab is
   and how far it tucks behind the nav. */

const SHADOW = '0 18px 40px #00000070'
const abs = (left, top, w, h) => ({ position: 'absolute', left, top, width: w, height: h, boxSizing: 'border-box' })

/* ── 1 · Gold bar ───────────────────────────────────────────────── */
export function Tab1({ parts, anim }) {
  return (
    <div style={{ ...abs(11, 671, 390, 72), background: '#100E0AC7', border: '1px solid #E9B94D7A', borderRadius: 26, boxShadow: SHADOW }}>
      <div style={{ position: 'absolute', left: 0, top: -1, width: 390, height: 72, borderRadius: 26, overflow: 'clip' }}>
        <div style={{ position: 'absolute', left: 14, top: 27, width: 365, height: 65, borderRadius: 24, background: '#F2DFAE3D', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', left: 10, top: -24, width: 150, height: 144, borderRadius: 75, background: '#E9B94D6B', filter: 'blur(34px)' }} />
        <div style={{ position: 'absolute', left: 17, top: -130, width: 420, height: 356, borderRadius: 52, background: '#E9B94D4D', filter: 'blur(28px)' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 390, height: 72, background: 'linear-gradient(180deg,#F6DC96 0%,#E0BC5C 30%,#D3A63D 52%,#B8862A 78%,#A8781F 100%)' }} />
        <div style={{ position: 'absolute', left: 26, top: 0, width: 338, height: 1, background: TOP_LIGHT }} />
        <Mark fill="#986F23" size={87} left={17} top={-3} />
        <Title left={123} top={10} size={17} color="#674D1F">Get Stimuler PRO</Title>
        <Tiles parts={parts} left={123} top={35} bg="#64470F7D" line="#F8C96157" colon="#513E138C" />
        <Chev left={334} top={23} />
        <Twinkle left={31} top={8} delay={0} anim={anim}><Star size={15} /></Twinkle>
        <Twinkle left={76} top={48} delay={1.35} anim={anim}><Star size={17} /></Twinkle>
      </div>
      <PaneLight w={390} h={72} radius={26} border={1} strength={0.24} edge={0.6} />
    </div>
  )
}

/* ── 2 · Dark bar ───────────────────────────────────────────────── */
export function Tab2({ parts, anim }) {
  return (
    <div style={{ ...abs(11, 673, 390, 72), background: '#100E0AC7', border: '1px solid #E9B94D7A', borderRadius: 26, boxShadow: SHADOW }}>
      <div style={{ position: 'absolute', left: 0, top: -1, width: 390, height: 72, borderRadius: 26, overflow: 'clip' }}>
        <div style={{ position: 'absolute', left: 14, top: 27, width: 365, height: 65, borderRadius: 24, background: '#F2DFAE3D', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', left: 10, top: -24, width: 150, height: 144, borderRadius: 75, background: '#E9B94D6B', filter: 'blur(34px)' }} />
        <div style={{ position: 'absolute', left: 17, top: -130, width: 420, height: 356, borderRadius: 52, background: '#886C2DCC', filter: 'blur(28px)' }} />
        <div style={{ position: 'absolute', left: 26, top: 0, width: 338, height: 1, background: TOP_LIGHT }} />
        <Mark fill="#523A0E" size={87} left={17} top={-3} />
        <Title left={123} top={10} size={17} color="#2B1D03">Get Stimuler PRO</Title>
        <Tiles parts={parts} left={123} top={35} bg="#312103DB" line="#F7E3BB9E" colon="#3B2B0AFC" />
        <Chev left={334} top={23} />
        <Twinkle left={31} top={8} delay={0.55} anim={anim}><Star size={15} /></Twinkle>
        <Twinkle left={76} top={48} delay={1.9} anim={anim}><Star size={17} /></Twinkle>
      </div>
      <PaneLight w={390} h={72} radius={26} border={1} strength={0.2} edge={0.55} />
    </div>
  )
}

/* ── 3 · Slate glass ────────────────────────────────────────────── */
export function Tab3({ parts, anim }) {
  return (
    <div style={{ ...abs(11, 669, 390, 78), background: '#3F3B32B3', border: '1px solid #E9B94D5C', borderRadius: 24, boxShadow: SHADOW, overflow: 'clip' }}>
      <div style={{ position: 'absolute', left: 28, top: -138, width: 368, height: 196, borderRadius: 16, background: 'linear-gradient(160deg,#B39128 0%,#372F50 46%,#4F4478 100%)', filter: 'blur(26px)' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: 390, height: 80, background: 'linear-gradient(150deg,#F6D98C38 0%,#E9B94C12 48%,#E9B94C05 100%)' }} />
      <Mark fill="#2B1F0C" size={87} left={16} top={-4} />
      <Title left={133} top={16} size={17} color="#E4DDD2">Get Stimuler PRO</Title>
      <Tiles parts={parts} left={133} top={41} bg="#534B42E6" line="#4B3F499E" colon="#D0C2A9FC" />
      <Chev left={352} top={26} />
      <div style={{ position: 'absolute', left: 24, top: 0, width: 342, height: 1, background: 'linear-gradient(90deg,#F6D98C00 0%,#F6D98CB8 50%,#F6D98C00 100%)' }} />
      <Twinkle left={61} top={58} delay={0} opacity={0.7} anim={anim}><Star size={17} /></Twinkle>
      <Twinkle left={19.6} top={16} delay={1.5} opacity={0.7} anim={anim}><Star size={13} /></Twinkle>
      <PaneLight w={390} h={78} radius={24} border={1} strength={0.2} edge={0.55} />
    </div>
  )
}

/* ── 4 · Night-to-gold ──────────────────────────────────────────── */
export function Tab4({ parts, anim }) {
  return (
    <div style={{ ...abs(16, 668, 380, 66), background: 'linear-gradient(90deg,#181001 -6.33%,#DCB259 131.76%)', border: '1px solid #79683D', borderRadius: 19, boxShadow: '0 14px 34px #0000009E' }}>
      <Title left={18} top={10} size={16} color="#E4DDD2">Get Stimuler PRO</Title>
      <Tiles parts={parts} left={18} top={33} bg="#37290BE6" line="#614C1E9E" colon="#D0C2A9FC" />
      <div className="grid place-items-center"
           style={{ position: 'absolute', left: 316, top: 11, width: 51, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#F6D98C 0%,#E9B94C 54%,#D2A034 100%)' }}>
        <svg width="16" height="16" viewBox="0 0 18 18"><path d="M3.6 9h10.8M9.6 4.2 14.4 9l-4.8 4.8" fill="none" stroke="#2A1D05" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <PaneLight w={380} h={66} radius={19} border={1} strength={0.2} edge={0.6} />
    </div>
  )
}

/* ── 5 · Gold ticket ────────────────────────────────────────────── */
function TicketPaper({ fill }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: -14, width: 390, height: 96, background: fill, clipPath: `path('${TICKET_D}')` }} />
  )
}

export function Tab5({ parts, anim }) {
  return (
    <div style={{ ...abs(11, 662, 390, 82) }}>
      <div style={{ position: 'absolute', left: 14, top: 8, width: 365, height: 65, borderRadius: 24, background: '#F2DFAE3D', filter: 'blur(30px)' }} />
      <TicketPaper fill="#D3A63D" />
      <svg width="390" height="82" viewBox="0 14 390 82" style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d="M280 26.812V83.187" fill="none" stroke="#FFEDC1" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 7" />
      </svg>
      <Title left={19} top={12} size={22} color="#3A2A0C" ls="0.01em" lh="26px">Get Stimuler PRO</Title>
      <Tiles parts={parts} left={19} top={43} bg="#FFFFFF59" line="#D3A63DA8" ink="#5A4A29" colon="#5A4A29E6" />
      <Crown left={314} top={18} flat body="rgb(63 45 13)" base="rgb(84 64 15)" />
      <div style={{ position: 'absolute', left: 0, top: -14, width: 390, height: 96 }}>
        <PaneLight w={390} h={96} shape={TICKET_D} border={1.5} strength={0.3} edge={0.62} edgeColor="#FFF6DF" offsetY={14} />
      </div>
    </div>
  )
}

/* ── 6 · Gold ticket, mark and stars ────────────────────────────── */
export function Tab6({ parts, anim }) {
  return (
    <div style={{ ...abs(11, 664, 390, 82), overflow: 'clip' }}>
      <div style={{ position: 'absolute', left: 14, top: 8, width: 365, height: 65, borderRadius: 24, background: '#F2DFAE3D', filter: 'blur(30px)' }} />
      <TicketPaper fill="#D3A63D" />
      <svg width="390" height="82" viewBox="0 14 390 82" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path d="M280 26.812V83.187" fill="none" stroke="#FFEDC1" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 7" />
      </svg>
      <Mark fill="#937227" size={96} left={288} top={-1} />
      <Twinkle left={304} top={11} delay={0} opacity={0.7} anim={anim}><Star size={17} fill="#FCD075" /></Twinkle>
      <Twinkle left={353} top={55} delay={1.45} opacity={0.7} anim={anim}><Star size={19} fill="#FCD075" /></Twinkle>
      <Title left={19} top={12} size={22} color="#3A2A0C" ls="0.01em" lh="26px">Get Stimuler PRO</Title>
      <Tiles parts={parts} left={19} top={43} bg="#FFEFCE59" line="#D3A63DA8" ink="#5A4A29" colon="#5A4A29E6" />
      <div style={{ position: 'absolute', left: 0, top: -14, width: 390, height: 96 }}>
        <PaneLight w={390} h={96} shape={TICKET_D} border={1.5} strength={0.3} edge={0.62} edgeColor="#FFF6DF" offsetY={14} />
      </div>
    </div>
  )
}

/* ── 7 · Two-tier band ──────────────────────────────────────────
   Full bleed and flush to the bottom, so its outline is open: the light
   runs the top edge and down both sides and simply stops, because there
   is no bottom edge to run along. */
const BAND_D = 'M0 93 V20 A20 20 0 0 1 20 0 H392 A20 20 0 0 1 412 20 V93'

export function Tab7({ parts, anim }) {
  const tile = { width: 42, height: 38, borderRadius: 9, background: '#0A08038C', border: '1px solid #E9B94D57', boxSizing: 'border-box', display: 'grid', placeItems: 'center', flexShrink: 0 }
  const ink = { color: '#fff', fontSize: 19, fontWeight: 700, lineHeight: '24px' }
  const colon = { color: '#E9B94D8C', fontSize: 17, fontWeight: 600, lineHeight: '22px', paddingTop: 8 }
  return (
    <div style={{ ...abs(0, 657, 412, 93), borderTop: '1px solid #E9B94D6B', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'clip', display: 'flex', flexDirection: 'column' }}>
      <div className="grid place-items-center" style={{ height: 34, flexShrink: 0, background: '#3A2C0E' }}>
        <span className="font-id" style={{ color: '#F2D48A', fontSize: 12.5, fontWeight: 600, letterSpacing: '0.01em', lineHeight: '16px' }}>Limited time offer</span>
      </div>
      <div className="flex items-center justify-between"
           style={{ height: 58, flexShrink: 0, gap: 14, paddingBlock: 14, paddingInline: 18, background: 'linear-gradient(96deg,#2A2008 0%,#4A3A12 58%,#6B5417 100%)' }}>
        <span className="flex items-start" style={{ gap: 7, flexShrink: 0 }}>
          <span style={tile}><span className="font-id tnum" style={ink}>{parts.hh}</span></span>
          <span className="font-id" style={colon}>:</span>
          <span style={tile}><span className="font-id tnum" style={ink}>{parts.mm}</span></span>
          <span className="font-id" style={colon}>:</span>
          <span style={tile}><span className="font-id tnum" style={ink}>{parts.ss}</span></span>
        </span>
        <span className="grid place-items-center"
              style={{ height: 35, borderRadius: 23, paddingInline: 24, flexShrink: 0, background: 'linear-gradient(135deg,#F6D98C 0%,#E9B94C 100%)' }}>
          <span className="font-id" style={{ color: '#2A1D05', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: '20px' }}>Claim 50% off</span>
        </span>
      </div>
      <PaneLight w={412} h={93} shape={BAND_D} border={1} strength={0.2} edge={0.6} clipRadius="20px 20px 0 0" />
    </div>
  )
}

export const TABS = [
  { id: '1', name: 'Gold bar', C: Tab1, stars: 2, note: 'gold body, bronze mark — two stars over the mark' },
  { id: '2', name: 'Dark bar', C: Tab2, stars: 2, note: 'the same tab with the gold body taken out' },
  { id: '3', name: 'Slate glass', C: Tab3, stars: 2, note: 'cool pane, warm veil — the stars sit on the mark' },
  { id: '4', name: 'Night to gold', C: Tab4, stars: 0, note: 'black to gold across the width, square action' },
  { id: '5', name: 'Gold ticket', C: Tab5, stars: 0, note: 'flat gold, die-cut, dark crown' },
  { id: '6', name: 'Ticket + mark', C: Tab6, stars: 2, note: 'the same ticket with the mark and two stars on the stub' },
  { id: '7', name: 'Two-tier band', C: Tab7, stars: 0, note: 'full bleed, flush to the nav — an open outline' },
]

export const byId = (id) => TABS.find((t) => t.id === id) ?? TABS[0]
