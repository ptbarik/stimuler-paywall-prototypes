import { Housing, PillAction, GOLD } from './parts.jsx'

/* ── B1 · Two-tier ────────────────────────────────────────────────
   The loudest of the eleven: the offer gets a band of its own above a row
   that is nothing but a clock and a button.

   The digits are boxed and they never animate. A countdown that flips its
   own numerals turns the button into the thing you watch instead of the
   thing you press — the seconds change, the boxes do not. */

function Digit({ children }) {
  return (
    <span className="grid place-items-center shrink-0"
          style={{ width: 34, height: 32, borderRadius: 8, background: '#0A08038C', border: `1px solid ${GOLD}57`, boxSizing: 'border-box' }}>
      <span className="font-id tnum" style={{ color: '#fff', fontSize: 16, fontWeight: 700, lineHeight: '20px' }}>{children}</span>
    </span>
  )
}

function Colon() {
  return <span className="font-id" style={{ color: '#E9B94D8C', fontSize: 14, fontWeight: 600, lineHeight: '18px' }}>:</span>
}

export function B1({ parts }) {
  return (
    <Housing style={{ flexDirection: 'column', alignItems: 'stretch', overflow: 'hidden', padding: 0 }}>
      <span className="grid place-items-center shrink-0" style={{ height: 30, background: '#3A2C0E' }}>
        <span className="font-id" style={{ color: '#F2D48A', fontSize: 12, fontWeight: 600, lineHeight: '16px' }}>
          Your first year, half price
        </span>
      </span>
      <span className="flex flex-1 items-center justify-between"
            style={{ paddingInline: 14, gap: 12, background: 'linear-gradient(96deg,#2A2008 0%,#4A3A12 58%,#6B5417 100%)' }}>
        <span className="flex items-center shrink-0" style={{ gap: 6 }}>
          <Digit>{parts.hh}</Digit><Colon />
          <Digit>{parts.mm}</Digit><Colon />
          <Digit>{parts.ss}</Digit>
        </span>
        <PillAction label="Claim 50% off" h={42} px={18} size={14.5} />
      </span>
    </Housing>
  )
}
