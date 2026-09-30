import { useLayoutEffect, useRef, useState } from 'react'
import Paywall from './components/Paywall.jsx'

/**
 * The stand the prototype sits on.
 *
 * This used to put V1 (coupon ticket) and V2 (starburst badge) side by side.
 * The comparison is settled — V2 is the one going forward — so only V2 is
 * shown. V1's CouponTicket and its `variant === 'v1'` branches are left in
 * Paywall/Sections untouched in case it needs bringing back.
 *
 * ── fitting ───────────────────────────────────────────────────────
 *
 * The phone is 412 × 892 and must be whole on screen — a paywall you have to
 * scroll the *browser* to see the bottom of cannot be judged, because the
 * pinned CTA is the thing being judged and it would be below the fold.
 *
 * So the frame is scaled to whatever is left after the header, measured rather
 * than assumed: the header's height is read off the DOM on mount and on every
 * resize, so changing a word in it cannot silently push the phone off the
 * bottom. Both axes are checked and the smaller wins.
 *
 * The scale goes on a wrapper sized to the *scaled* box, not on the frame
 * alone. A CSS transform does not change layout, so scaling the frame by
 * itself would leave it reserving its full 892 and the page would still
 * scroll — the thing the scaling was for.
 */

const VERSION = { id: 'v2', title: 'Starburst badge' }

/* The two markets. US keeps the Pro / Pro+ toggle; India sells PRO alone, so
   its header is the wordmark and its table is FREE vs PRO. `?m=in` opens on
   India, for links sent to reviewers. */
const MARKETS = [
  { id: 'us', label: 'US market' },
  { id: 'in', label: 'Indian market' },
]

const FRAME = { w: 412, h: 892 }
const CAPTION_H = 26   // the "Starburst badge · US market" line above the frame
const SIDE = 28        // page margin

export default function App() {
  const [tier, setTier] = useState('pro')
  const [market, setMarket] = useState(() =>
    new URLSearchParams(location.search).get('m') === 'in' ? 'in' : 'us')
  const [scale, setScale] = useState(1)
  const [run, setRun] = useState(0)
  const headRef = useRef(null)

  useLayoutEffect(() => {
    const fit = () => {
      const headH = headRef.current?.offsetHeight ?? 120
      const availH = window.innerHeight - headH - CAPTION_H - 24
      const availW = window.innerWidth - SIDE * 2
      setScale(Math.max(0.42, Math.min(availH / FRAME.h, availW / FRAME.w, 1)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const replay = () => setRun((r) => r + 1)

  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col items-center"
         style={{ background: 'radial-gradient(120% 80% at 50% 0%,#15131f 0%,#0a0910 55%,#060509 100%)' }}>

      <header ref={headRef} className="w-full flex flex-col items-center shrink-0"
              style={{ paddingTop: 18, paddingBottom: 14 }}>
        <h1 className="font-id text-white text-center" style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: '-.015em' }}>
          Stimuler · paywall — how the offer should read
        </h1>

        <div className="flex items-center gap-[8px]" style={{ marginTop: 11 }}>
          <div className="flex rounded-full p-[3px]" style={{ background: 'rgba(255,255,255,.07)' }}>
            {MARKETS.map((m) => (
              <button key={m.id}
                      onClick={() => { setMarket(m.id); history.replaceState(null, '', m.id === 'in' ? '?m=in' : location.pathname) }}
                      className="rounded-full font-id transition-colors"
                      style={{
                        padding: '6px 13px', fontSize: 12, fontWeight: 500,
                        background: market === m.id ? 'rgba(255,255,255,.13)' : 'transparent',
                        color: market === m.id ? '#fff' : 'rgba(255,255,255,.5)',
                      }}>
                {m.label}
              </button>
            ))}
          </div>
          <button onClick={replay} className="rounded-full font-id"
                  style={{ padding: '7px 15px', fontSize: 12, fontWeight: 500, background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.7)' }}>
            Replay
          </button>
        </div>
      </header>

      <main className="flex items-start justify-center">
        <div className="flex flex-col items-center" style={{ width: FRAME.w * scale }}>
          <div className="text-center font-id w-full truncate" style={{ height: CAPTION_H }}>
            <span className="text-white" style={{ fontSize: 12.5, fontWeight: 600 }}>
              {VERSION.title} · {MARKETS.find((m) => m.id === market).label}
            </span>
          </div>

          {/* the wrapper carries the scaled box so the page does not scroll */}
          <div style={{ width: FRAME.w * scale, height: FRAME.h * scale }}>
            <Paywall variant={VERSION.id} market={market} tier={tier} onTier={setTier} run={run} onReplay={replay} scale={scale} />
          </div>
        </div>
      </main>
    </div>
  )
}
