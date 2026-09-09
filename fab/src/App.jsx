import { useEffect, useState } from 'react'
import Paywall from './components/Paywall.jsx'

/**
 * The stand the two prototypes sit on.
 *
 * Wide enough and both versions are up at once, side by side, on independent
 * scrollers — because the whole question here is *which offer block*, and that
 * is a comparison you make by looking at two of them, not by remembering one.
 * Below 1080 it collapses to one at a time with a switch.
 *
 * The tier toggle is shared across both frames on purpose: comparing V1's
 * coupon against V2's badge is only fair if both are wearing the same palette.
 */

const VERSIONS = [
  { id: 'v1', n: '1', title: 'Coupon ticket', note: 'The export as drawn — the discount on paper.' },
  { id: 'v2', n: '2', title: 'Starburst badge', note: 'The discount as an object that arrives.' },
]

export default function App() {
  const [tier, setTier] = useState('pro')
  /* `?v=` takes 1, 2, v1 or v2 — a reviewer sent a link types the number */
  const [only, setOnly] = useState(() => {
    const raw = (new URLSearchParams(location.search).get('v') || '').replace(/^v/i, '')
    return raw === '2' ? 'v2' : 'v1'
  })
  const [both, setBoth] = useState(false)
  const [run, setRun] = useState(0)

  useEffect(() => {
    const q = () => setBoth(window.innerWidth >= 1080)
    q()
    window.addEventListener('resize', q)
    return () => window.removeEventListener('resize', q)
  }, [])

  const shown = both ? VERSIONS : VERSIONS.filter((v) => v.id === only)
  const replay = () => setRun((r) => r + 1)

  return (
    <div className="min-h-dvh w-full flex flex-col items-center"
         style={{ background: 'radial-gradient(120% 80% at 50% 0%,#15131f 0%,#0a0910 55%,#060509 100%)' }}>

      <header className="w-full flex flex-col items-center" style={{ paddingTop: 34, paddingBottom: 22 }}>
        <h1 className="font-id text-white text-center" style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-.015em' }}>
          Stimuler · paywall — how the offer should read
        </h1>
        <p className="font-id text-center" style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginTop: 6, maxWidth: 520 }}>
          Same page twice. Only the offer block differs. Use the switch inside either phone
          to see both tiers.
        </p>

        <div className="flex items-center gap-[10px]" style={{ marginTop: 18 }}>
          {!both && (
            <div className="flex rounded-full p-[3px]" style={{ background: 'rgba(255,255,255,.07)' }}>
              {VERSIONS.map((v) => (
                <button key={v.id} onClick={() => { setOnly(v.id); replay(); history.replaceState(null, '', `?v=${v.n}`) }}
                        className="rounded-full font-id transition-colors"
                        style={{
                          padding: '7px 15px', fontSize: 12.5, fontWeight: 500,
                          background: only === v.id ? 'rgba(255,255,255,.13)' : 'transparent',
                          color: only === v.id ? '#fff' : 'rgba(255,255,255,.5)',
                        }}>
                  V{v.n} · {v.title}
                </button>
              ))}
            </div>
          )}
          <button onClick={replay} className="rounded-full font-id"
                  style={{ padding: '8px 16px', fontSize: 12.5, fontWeight: 500, background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.7)' }}>
            Replay {both ? 'both' : ''}
          </button>
        </div>
      </header>

      <main className="flex items-start justify-center gap-[64px] pb-[70px]">
        {shown.map((v) => (
          <div key={v.id} className="flex flex-col items-center">
            <div className="text-center" style={{ marginBottom: 16, width: 412 }}>
              <div className="font-id text-white" style={{ fontSize: 14, fontWeight: 600 }}>
                Version {v.n} — {v.title}
              </div>
              <div className="font-id" style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 3 }}>{v.note}</div>
            </div>
            <Paywall variant={v.id} tier={tier} onTier={setTier} run={run} onReplay={replay} />
          </div>
        ))}
      </main>
    </div>
  )
}
