import { GlassFilter, RimLight, SUPPORTS_BACKDROP_URL, useGlassMap } from './Glass'

/**
 * Group 2085663169 — the price bottom sheet, at the numbers Figma exported.
 *
 * Everything here is absolutely positioned off the sheet's own top-left, in the
 * fractional pixels the export gives, because this card is being compared
 * against a Figma render side by side and 49.418 is not 49.
 *
 *   group   417 × 234.419
 *   sheet   414 × 227.419 at (0, 7), radius 18 18 0 0
 *   cards   183 × 90 at (15, 49.418) and (208, 49.418), radius 11.497
 *   CTA     382 × 54 at (16, 153.418), radius 27
 */

const W = 417
const H = 234.4186
const SHEET_W = 414
const SHEET_H = 227.4186
const SHEET_TOP = 7
const R = 18

const INTER = "'Inter Display', system-ui, sans-serif"

/** The sheet's top edge only, so the 1px stroke follows the corners cleanly. */
const topEdge = (w, h, r, inset) =>
  `M${inset} ${h} V${r + inset} A${r} ${r} 0 0 1 ${r + inset} ${inset} ` +
  `H${w - r - inset} A${r} ${r} 0 0 1 ${w - inset} ${r + inset} V${h}`

function Shield() {
  return (
    <svg width="11.6493" height="13.3135" viewBox="134.359 64.0781 11.6493 13.3135"
         style={{ flex: 'none' }} aria-hidden>
      <path fill="#fff" d="M145.506 67.0347L140.679 64.2127C140.526 64.123 140.355 64.0781 140.184 64.0781C140.013 64.0781 139.842 64.123 139.689 64.2127L134.863 67.0347C134.551 67.2167 134.359 67.5554 134.359 67.922V69.4516C134.359 72.351 135.878 75.0287 138.338 76.4672L139.689 77.257C139.842 77.3468 140.013 77.3916 140.184 77.3916C140.355 77.3916 140.526 77.3468 140.679 77.257L142.03 76.4672C144.49 75.0286 146.009 72.3517 146.009 69.4516V67.922C146.009 67.5554 145.817 67.2167 145.506 67.0347ZM145.177 69.4516C145.177 72.0492 143.81 74.4623 141.61 75.7489L140.259 76.5387C140.236 76.5524 140.211 76.5595 140.184 76.5595C140.157 76.5595 140.132 76.5524 140.109 76.5387L138.758 75.7489C136.558 74.4624 135.191 72.0499 135.191 69.4516V67.9219C135.191 67.8504 135.226 67.7861 135.282 67.7529L140.109 64.931C140.132 64.9173 140.157 64.9102 140.184 64.9102C140.211 64.9102 140.236 64.9173 140.259 64.931L145.086 67.7529C145.141 67.7861 145.177 67.8504 145.177 67.9219L145.177 69.4516ZM142.959 68.7443C143.129 68.8977 143.143 69.161 142.99 69.3319L139.664 73.027C139.587 73.1115 139.479 73.1615 139.366 73.1648H139.355C139.244 73.1648 139.139 73.1212 139.061 73.0426L137.394 71.3757C137.231 71.2132 137.231 70.9499 137.394 70.7874C137.556 70.6249 137.82 70.6249 137.982 70.7874L139.339 72.1441L142.372 68.7747C142.525 68.6044 142.788 68.5901 142.959 68.7435L142.959 68.7443Z" />
    </svg>
  )
}

/**
 * The yearly card's fill is an ellipse rotated 130.937°, which `radial-gradient`
 * cannot express — Figma's own CSS export flags it as unsupported. So the flat
 * #1C1843 is the card and the lighter core is a rotated, clipped div on top of
 * it, which reproduces the export's `scale(64.8633 131.889)` exactly.
 */
function YearlyFill() {
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: 10.497, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 64.8633 * 2, height: 131.889 * 2,
        transform: 'translate(-50%,-50%) rotate(130.937deg)',
        background: 'radial-gradient(closest-side, #2A255D 0%, #1C1843 70.19%)',
      }} />
    </div>
  )
}

export default function PriceSheet({ glass, flat, sweep = true }) {
  const { refraction, depth, dispersion, frost, splay, lightAngle, lightIntensity } = glass
  const map = useGlassMap({
    w: SHEET_W, h: SHEET_H, radius: R,
    refraction: refraction / 100, depth: Math.max(1, depth), splay: splay / 100,
  })
  const filterId = 'sheet-glass'
  const live = !flat && SUPPORTS_BACKDROP_URL && map

  /* Chrome takes the displacement filter; everyone else gets the blur alone. */
  const backdropFilter = flat
    ? 'none'
    : live
      ? `url(#${filterId})`
      : `blur(${frost * 0.2}px) saturate(1.35)`

  return (
    <div style={{ position: 'relative', width: W, height: H }}>
      {live && (
        <GlassFilter id={filterId} w={SHEET_W} h={SHEET_H} map={map}
                     depth={depth} dispersion={dispersion / 100} frost={frost * 0.2} />
      )}

      {/* Rectangle 828710 — the blue bloom that sits above the sheet's lip */}
      <div style={{
        position: 'absolute', left: 0, top: 0, width: 417, height: 13.8598,
        boxSizing: 'border-box',
        background: 'rgba(111, 145, 255, 0.3)',
        border: '0.929517px solid #4C43BC',
        opacity: 0.75, filter: 'blur(20.2635px)',
      }} />

      {/* Price bottom sheet */}
      <div style={{
        position: 'absolute', left: 0, top: SHEET_TOP, width: SHEET_W, height: SHEET_H,
        borderRadius: `${R}px ${R}px 0 0`,
      }}>
        {/* the pane: refraction, then the fill that tints it */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: `${R}px ${R}px 0 0`,
          backdropFilter, WebkitBackdropFilter: backdropFilter,
          background: 'linear-gradient(180.19deg, rgba(61,55,142,0.2) -36.63%, rgba(16,14,38,0.2) 84.74%, rgba(0,0,0,0.2) 99.83%)',
        }} />

        {/* border-top: 1px solid #4C43BC, drawn as a stroke so it holds its
            weight around the 18px corners instead of tapering off */}
        <svg width={SHEET_W} height={SHEET_H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden>
          <path d={topEdge(SHEET_W, SHEET_H, R, 0.5)} fill="none" stroke="#4C43BC" strokeWidth="1" />
        </svg>

        {!flat && (
          <RimLight w={SHEET_W} h={SHEET_H} radius={R} angle={lightAngle}
                    intensity={lightIntensity / 100} width={1.5} topOnly />
        )}

        {/* Frame 2087327042 — reassurance */}
        <div style={{
          position: 'absolute', left: 84.3555, top: 10.418,
          width: 244.2876, height: 25.581,
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          padding: '3.79052px 9.47629px', gap: 5.69,
          borderRadius: 22.7431, boxSizing: 'border-box',
        }}>
          <Shield />
          <span style={{
            fontFamily: INTER, fontWeight: 500, fontSize: 11.8707, lineHeight: '17px',
            color: '#FFFFFF', whiteSpace: 'nowrap',
          }}>Learn with confidence. Cancel anytime.</span>
        </div>

        {/* YEARLY */}
        <div style={{
          position: 'absolute', left: 15, top: 49.418, width: 183, height: 90,
          boxSizing: 'border-box', borderRadius: 11.497,
          padding: 13.4132, display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', gap: 3.83,
          border: '1px solid transparent',
          /* the flat fill goes first so it paints over the conic everywhere
             except the 1px border ring */
          background:
            'linear-gradient(#1C1843,#1C1843) padding-box,' +
            'conic-gradient(from 180deg at 50% 50%, #D59E4D 0deg, #FDD285 174.808deg, #D59D4C 360deg) border-box',
        }}>
          <YearlyFill />
          <div style={{
            position: 'relative', width: 155, height: 20.1176,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{
              fontFamily: INTER, fontWeight: 500, fontSize: 12, lineHeight: '140%',
              letterSpacing: '-0.01em', color: '#FFFFFF',
            }}>Yearly Plan</span>
            {/* the Save chip — Figma's own CSS export gives this conic angle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1.03887px 8.31097px', width: 57, height: 20.1176,
              boxSizing: 'border-box', borderRadius: 3.11662,
              background: 'conic-gradient(from 181.89deg at 50% 50%, #FFB85B 0deg, #FFEB9D 174.81deg, #FFC342 360deg)',
            }}>
              <span style={{
                fontFamily: INTER, fontWeight: 600, fontSize: 10.708, lineHeight: '140%',
                letterSpacing: '-0.01em', color: '#201C47', whiteSpace: 'nowrap',
              }}>Save 70%</span>
            </div>
          </div>
          <div style={{ position: 'relative', width: 112.0959, height: 40 }}>
            <div style={{
              fontFamily: INTER, fontWeight: 600, fontSize: 19.1617, lineHeight: '140%',
              letterSpacing: '-0.01em', color: '#FFFFFF', height: 27, whiteSpace: 'nowrap',
            }}>₹99/month</div>
            <div style={{
              fontFamily: INTER, fontWeight: 500, fontSize: 10, lineHeight: '140%',
              letterSpacing: '-0.01em', color: '#9A95C3', height: 14, marginTop: -1,
            }}>Just ₹999 per year</div>
          </div>
        </div>

        {/* MONTHLY */}
        <div style={{
          position: 'absolute', left: 208, top: 49.418, width: 183, height: 90,
          boxSizing: 'border-box', borderRadius: 11.497,
          padding: 13.4132, display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', gap: 3.83,
          background: '#201C47', border: '1px solid #4B4789',
        }}>
          <div style={{
            fontFamily: INTER, fontWeight: 500, fontSize: 12, lineHeight: '140%',
            letterSpacing: '-0.01em', color: '#FFFFFF', height: 17,
          }}>Monthly Plan</div>
          <div style={{ width: 112.0959, height: 40 }}>
            <div style={{
              fontFamily: INTER, fontWeight: 600, fontSize: 19.1617, lineHeight: '140%',
              letterSpacing: '-0.01em', color: '#FFFFFF', height: 27, whiteSpace: 'nowrap',
            }}>₹249/month</div>
            <div style={{
              fontFamily: INTER, fontWeight: 500, fontSize: 10, lineHeight: '140%',
              letterSpacing: '-0.01em', color: '#9A95C3', height: 14, marginTop: -1,
            }}>Billed monthly</div>
          </div>
        </div>

        {/* Frame 2087327004 — the CTA */}
        <div style={{
          position: 'absolute', left: 16, top: 153.418, width: 382, height: 54,
          borderRadius: 27, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(90.01deg, #DB992F 0.05%, #FFE090 50.02%, #DB992F 100%)',
          boxShadow: '-8px 11px 12px rgba(15, 13, 37, 0.25)',
        }}>
          {/* Rectangle 100868 — the sheen. The export's matrix is a 45° rotation
              about the rect's own origin; this is that, resolved. */}
          <div className={sweep ? 'cta-glare sweep' : 'cta-glare'} style={{
            position: 'absolute', left: 63.78, top: -31.38,
            width: 20.3739, height: 123.276,
            transformOrigin: '0 0', transform: 'rotate(45deg)',
            background: 'linear-gradient(90deg, rgba(242,190,97,0) 0%, #F2BE61 45%, #F2BE61 55%, rgba(242,190,97,0) 100%)',
            filter: 'blur(1.5px)',
          }} />
          <span style={{
            position: 'relative',
            fontFamily: INTER, fontWeight: 600, fontSize: 18, lineHeight: '140%',
            letterSpacing: '-0.01em', color: '#402305',
          }}>Get Stimuler PRO+</span>
        </div>
      </div>
    </div>
  )
}

export { W as SHEET_GROUP_W, H as SHEET_GROUP_H }
