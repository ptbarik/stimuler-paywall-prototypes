import { Corner } from '../components/Icons.jsx'
import { CrownChip, RoundAction, Copy, SLOT, GOLD_PILL3 } from './parts.jsx'

/* ── G · glass + gold, three ways ─────────────────────────────────
   The sheet shows all three over a lesson card, because a glass surface with
   nothing behind it is just a grey rectangle — the whole argument for glass
   is that the content survives underneath it. Here the thing underneath is
   the real roadmap, so the blur is a live `backdrop-filter` rather than the
   pre-blurred copy of the card the static sheet had to fake it with.

   What separates the three is whether gold is an accent, a tint, or a light
   source. */

function Pane({ bg, line, veil, light, lightW = 342, lightH = 1, lightX = 24, children }) {
  return (
    <div className="flex items-center"
         style={{
           position: 'relative', boxSizing: 'border-box',
           width: SLOT.w, height: SLOT.h, borderRadius: 24, overflow: 'hidden',
           background: bg, border: `1px solid ${line}`,
           boxShadow: '0 18px 40px rgba(0,0,0,.44)',
           backdropFilter: 'blur(26px)', WebkitBackdropFilter: 'blur(26px)',
           gap: 14, paddingLeft: 16, paddingRight: 14,
         }}>
      <span style={{ position: 'absolute', inset: 0, background: veil, pointerEvents: 'none' }} />
      {children}
      <span style={{ position: 'absolute', left: lightX, top: 0, width: lightW, height: lightH, background: light, pointerEvents: 'none' }} />
    </div>
  )
}

function GlassCopy({ hms }) {
  return (
    <Copy>
      <span className="font-id relative" style={{ color: '#fff', fontSize: 16, fontWeight: 600, letterSpacing: '-.01em', lineHeight: '20px' }}>
        Unlock everything
      </span>
      <span className="font-id tnum relative" style={{ color: '#F2D48A', fontSize: 13.5, fontWeight: 600, lineHeight: '18px' }}>
        50% off · {hms}
      </span>
    </Copy>
  )
}

/** G1 — neutral frost. Gold appears twice and only twice: the crown and the action. */
export function G1({ hms }) {
  return (
    <Pane bg="#FFFFFF0F" line="#FFFFFF33"
          veil="linear-gradient(150deg,rgba(255,255,255,.13) 0%,rgba(255,255,255,.05) 46%,rgba(255,255,255,.02) 100%)"
          light="linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.55) 50%,rgba(255,255,255,0) 100%)">
      <CrownChip bg="#FFFFFF1C" line="#FFFFFF33" radius={15} />
      <GlassCopy hms={hms} />
      <RoundAction size={50} gradient={GOLD_PILL3} />
    </Pane>
  )
}

/** G2 — the pane itself is warm. The purple still reads through, but through amber. */
export function G2({ hms }) {
  return (
    <Pane bg="#E9B94D1A" line="#E9B94D5C"
          veil="linear-gradient(150deg,rgba(246,217,140,.22) 0%,rgba(233,185,76,.07) 48%,rgba(233,185,76,.02) 100%)"
          light="linear-gradient(90deg,rgba(246,217,140,0) 0%,rgba(246,217,140,.72) 50%,rgba(246,217,140,0) 100%)">
      <CrownChip bg="#E9B94D29" line="#E9B94D52" radius={15} />
      <GlassCopy hms={hms} />
      <RoundAction size={50} gradient={GOLD_PILL3} />
    </Pane>
  )
}

/** G3 — colourless pane, no gold fill anywhere; a 2px light runs the top edge
    like a bevel catching a lamp, and the action is outlined rather than filled. */
export function G3({ hms }) {
  return (
    <Pane bg="#FFFFFF0D" line="#FFFFFF24"
          veil="linear-gradient(150deg,rgba(255,255,255,.13) 0%,rgba(255,255,255,.05) 46%,rgba(255,255,255,.02) 100%)"
          light="linear-gradient(90deg,rgba(233,185,76,.12) 0%,#F6D98C 46%,rgba(233,185,76,.30) 100%)"
          lightW={SLOT.w} lightH={2} lightX={0}>
      <CrownChip bg="#FFFFFF12" line="#E9B94D6B" radius={15} />
      <GlassCopy hms={hms} />
      <span className="flex items-center justify-center shrink-0 relative"
            style={{ height: 50, borderRadius: 25, paddingInline: 18, gap: 8, background: '#E9B94D1A', border: '1.5px solid #F6D98CB8', boxSizing: 'border-box' }}>
        <span className="font-id" style={{ color: '#F6D98C', fontSize: 14.5, fontWeight: 700, lineHeight: '18px' }}>Get PRO</span>
        <Corner stroke="#F6D98C" size={15} />
      </span>
    </Pane>
  )
}
