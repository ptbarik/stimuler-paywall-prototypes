import { useLayoutEffect, useRef, useState } from 'react'
import Paywall from './components/Paywall.jsx'

/**
 * The Indian market's paywall, on its own, in two colours.
 *
 * India sells PRO alone, so there is no tier to pick. What is under test here
 * is the palette: the same PRO page in the purple it ships in, and in the
 * gold PRO+ wears in the US. The switch repaints and nothing else — the copy,
 * the prices, the FREE vs PRO table and the CTA are PRO's in both. `?theme=gold`
 * opens on gold, for links sent to reviewers.
 *
 * ── fitting ───────────────────────────────────────────────────────
 *
 * The phone is 412 × 892 and must be whole on screen — a paywall you have to
 * scroll the *browser* to see the bottom of cannot be judged, because the
 * pinned CTA is the thing being judged and it would be below the fold.
 *
 * So the frame is scaled to whatever is left after the header, measured rather
 * than assumed, and the scale goes on a wrapper sized to the *scaled* box — a
 * CSS transform does not change layout, so scaling the frame alone would leave
 * it reserving its full 892 and the page would still scroll.
 */

const THEMES = [
  { id: 'pro', label: 'Purple theme' },
  { id: 'plus', label: 'Gold theme' },
]

const FRAME = { w: 412, h: 892 }
const CAPTION_H = 26   // the "Purple theme" line above the frame
const SIDE = 28        // page margin

export default function App() {
  const [theme, setTheme] = useState(() =>
    new URLSearchParams(location.search).get('theme') === 'gold' ? 'plus' : 'pro')
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
          Stimuler · PRO paywall — Indian market
        </h1>

        <div className="flex items-center gap-[8px]" style={{ marginTop: 11 }}>
          <div className="flex rounded-full p-[3px]" style={{ background: 'rgba(255,255,255,.07)' }}>
            {THEMES.map((m) => (
              <button key={m.id}
                      onClick={() => { setTheme(m.id); history.replaceState(null, '', m.id === 'plus' ? '?theme=gold' : location.pathname) }}
                      className="rounded-full font-id transition-colors"
                      style={{
                        padding: '6px 13px', fontSize: 12, fontWeight: 500,
                        background: theme === m.id ? 'rgba(255,255,255,.13)' : 'transparent',
                        color: theme === m.id ? '#fff' : 'rgba(255,255,255,.5)',
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
              {THEMES.find((m) => m.id === theme).label}
            </span>
          </div>

          {/* the wrapper carries the scaled box so the page does not scroll */}
          <div style={{ width: FRAME.w * scale, height: FRAME.h * scale }}>
            <Paywall variant="v2" market="in" tier="pro" theme={theme} run={run} onReplay={replay} scale={scale} />
          </div>
        </div>
      </main>
    </div>
  )
}
