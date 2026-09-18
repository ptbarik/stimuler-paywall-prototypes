import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Paywall from './components/Paywall.jsx'

/**
 * The stand the prototype sits on.
 *
 * One screen, two tiers. The V2 prototype put two frames side by side because
 * the question was *which offer block*; that question is settled, so this one
 * shows the single page and the switch inside it, and the frame gets the width
 * it would have had to share.
 *
 * ── fitting ───────────────────────────────────────────────────────
 *
 * The phone is 412 × 892 and must be whole on screen — a paywall you have to
 * scroll the *browser* to see the bottom of cannot be judged, because the
 * pinned CTA is the thing being judged and its glare would be below the fold.
 *
 * So the frame is scaled to whatever is left after the header, measured rather
 * than assumed: the header's height is read off the DOM on mount and on every
 * resize, so changing a word in it cannot silently push the phone off the
 * bottom. The scale goes on a wrapper sized to the *scaled* box — a CSS
 * transform does not change layout, so scaling the frame alone would leave it
 * reserving its full 892 and the page would still scroll.
 */

const FRAME = { w: 412, h: 892 }
const SIDE = 28

export default function App() {
  const [tier, setTier] = useState(() =>
    (new URLSearchParams(location.search).get('tier') || '').toLowerCase().includes('plus') ? 'plus' : 'pro')
  const [scale, setScale] = useState(1)
  const [run, setRun] = useState(0)
  const headRef = useRef(null)

  useLayoutEffect(() => {
    const fit = () => {
      const headH = headRef.current?.offsetHeight ?? 110
      const byH = (window.innerHeight - headH - 22) / FRAME.h
      const byW = (window.innerWidth - SIDE * 2) / FRAME.w
      setScale(Math.max(0.42, Math.min(byH, byW, 1)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    history.replaceState(null, '', tier === 'plus' ? '?tier=plus' : '?tier=pro')
  }, [tier])

  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col items-center"
         style={{ background: 'radial-gradient(120% 80% at 50% 0%,#15131f 0%,#0a0910 55%,#060509 100%)' }}>

      <header ref={headRef} className="w-full flex flex-col items-center shrink-0"
              style={{ paddingTop: 18, paddingBottom: 12 }}>
        <h1 className="font-id text-white text-center" style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: '-.015em' }}>
          Stimuler V3 · paywall — the coupon, with the CTA moving
        </h1>
        <p className="font-id text-center" style={{ fontSize: 12.5, color: 'rgba(255,255,255,.42)', marginTop: 5 }}>
          Switch tiers inside the phone. The glare and the price-card rim run on their own.
        </p>
        <button onClick={() => setRun((r) => r + 1)} className="rounded-full font-id"
                style={{ marginTop: 10, padding: '7px 15px', fontSize: 12, fontWeight: 500, background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.7)' }}>
          Replay the page
        </button>
      </header>

      <main style={{ width: FRAME.w * scale, height: FRAME.h * scale }}>
        <Paywall tier={tier} onTier={setTier} run={run} onReplay={() => setRun((r) => r + 1)} scale={scale} />
      </main>
    </div>
  )
}
