import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Paywall from './components/Paywall.jsx'

/**
 * The stand the two prototypes sit on.
 *
 * Wide enough and both versions are up at once, side by side, on independent
 * scrollers — because the whole question here is *which offer block*, and that
 * is a comparison you make by looking at two of them, not by remembering one.
 * Narrower and it collapses to one at a time with a switch.
 *
 * The tier toggle is shared across both frames on purpose: comparing V1's
 * coupon against V2's badge is only fair if both are wearing the same palette.
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
 * bottom. Both axes are checked and the smaller wins — at two frames wide the
 * binding constraint is usually width, at one it is always height.
 *
 * The scale goes on a wrapper sized to the *scaled* box, not on the frame
 * alone. A CSS transform does not change layout, so scaling the frame by
 * itself would leave it reserving its full 892 and the page would still
 * scroll — the thing the scaling was for.
 */

const VERSIONS = [
  { id: 'v1', n: '1', title: 'Coupon ticket', note: 'the discount on paper' },
  { id: 'v2', n: '2', title: 'Starburst badge', note: 'the discount as an object that arrives' },
]

const FRAME = { w: 412, h: 892 }
const CAPTION_H = 26   // the "V1 — Coupon ticket" line above each frame
const GUTTER = 44      // between the two frames
const SIDE = 28        // page margin

export default function App() {
  const [tier, setTier] = useState('pro')
  /* `?v=` takes 1, 2, v1 or v2 — a reviewer sent a link types the number */
  const [only, setOnly] = useState(() => {
    const raw = (new URLSearchParams(location.search).get('v') || '').replace(/^v/i, '')
    return raw === '2' ? 'v2' : 'v1'
  })
  const [both, setBoth] = useState(false)
  const [scale, setScale] = useState(1)
  const [run, setRun] = useState(0)
  const headRef = useRef(null)

  useLayoutEffect(() => {
    const fit = () => {
      const two = window.innerWidth >= 1024
      setBoth(two)
      const headH = headRef.current?.offsetHeight ?? 120
      const availH = window.innerHeight - headH - CAPTION_H - 24
      const availW = window.innerWidth - SIDE * 2 - (two ? GUTTER : 0)
      const byH = availH / FRAME.h
      const byW = availW / (FRAME.w * (two ? 2 : 1))
      setScale(Math.max(0.42, Math.min(byH, byW, 1)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const shown = both ? VERSIONS : VERSIONS.filter((v) => v.id === only)
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
          {!both && (
            <div className="flex rounded-full p-[3px]" style={{ background: 'rgba(255,255,255,.07)' }}>
              {VERSIONS.map((v) => (
                <button key={v.id}
                        onClick={() => { setOnly(v.id); replay(); history.replaceState(null, '', `?v=${v.n}`) }}
                        className="rounded-full font-id transition-colors"
                        style={{
                          padding: '6px 13px', fontSize: 12, fontWeight: 500,
                          background: only === v.id ? 'rgba(255,255,255,.13)' : 'transparent',
                          color: only === v.id ? '#fff' : 'rgba(255,255,255,.5)',
                        }}>
                  V{v.n} · {v.title}
                </button>
              ))}
            </div>
          )}
          <button onClick={replay} className="rounded-full font-id"
                  style={{ padding: '7px 15px', fontSize: 12, fontWeight: 500, background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.7)' }}>
            Replay{both ? ' both' : ''}
          </button>
        </div>
      </header>

      <main className="flex items-start justify-center" style={{ gap: GUTTER }}>
        {shown.map((v) => (
          <div key={v.id} className="flex flex-col items-center" style={{ width: FRAME.w * scale }}>
            {/* the caption is inside the frame's own scaled width, so it
                carries the title only — the note overran it and collided with
                the frame beside it */}
            <div className="text-center font-id w-full truncate" style={{ height: CAPTION_H }}>
              <span className="text-white" style={{ fontSize: 12.5, fontWeight: 600 }}>
                V{v.n} — {v.title}
              </span>
            </div>

            {/* the wrapper carries the scaled box so the page does not scroll */}
            <div style={{ width: FRAME.w * scale, height: FRAME.h * scale }}>
              <Paywall variant={v.id} tier={tier} onTier={setTier} run={run} onReplay={replay} scale={scale} />
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
