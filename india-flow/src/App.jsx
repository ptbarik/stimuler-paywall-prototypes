import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Flow from './flow/Flow.jsx'
import { unlock } from './flow/sfx.js'

/**
 * The Indian double paywall, end to end: the existing first paywall, the gift
 * that appears when it is closed, and the discounted offer paywall the gift
 * opens into — in purple and in gold.
 *
 * The theme switch changes the gift and the offer page; the first paywall is
 * the existing screen and stays as it ships. `?theme=gold` opens on gold and
 * `?step=gift` / `?step=offer` start partway through, for links sent to
 * reviewers.
 */

const THEMES = [
  { id: 'pro', q: 'purple', label: 'Purple theme' },
  { id: 'plus', q: 'gold', label: 'Gold theme' },
]
const STEPS = [
  { id: 'p1', label: '1 · First paywall' },
  { id: 'gift', label: '2 · Gift' },
  { id: 'offer', label: '3 · Offer paywall' },
]
const STAGE_STEP = { p1: 'p1', toGift: 'gift', gift: 'gift', open: 'gift', land: 'offer', offer: 'offer', direct: 'offer' }
const HINT = {
  p1: 'Tap × to decline the first offer',
  toGift: '', gift: 'Tap the box to open it', open: '', land: '',
  offer: 'Tap × to start again', direct: 'Tap × to start again',
}

/* the first paywall's own phone is 412 × 915 (it carries the tab bar), so
   the whole flow runs at that size */
const FRAME = { w: 412, h: 915 }
const SIDE = 28

export default function App() {
  const q = new URLSearchParams(location.search)
  const [theme, setTheme] = useState(q.get('theme') === 'gold' ? 'plus' : 'pro')
  const [startAt, setStartAt] = useState(STEPS.some((s) => s.id === q.get('step')) ? q.get('step') : 'p1')
  const [run, setRun] = useState(0)
  const [stage, setStage] = useState(startAt)
  const [scale, setScale] = useState(1)
  const [sound, setSound] = useState(q.get('sound') !== 'off')
  const headRef = useRef(null)

  /* any tap on the stand unlocks audio, so a flow started from a step button
     still has sound from its first beat */
  useEffect(() => {
    const on = () => unlock()
    window.addEventListener('pointerdown', on, { capture: true })
    return () => window.removeEventListener('pointerdown', on, { capture: true })
  }, [])

  useLayoutEffect(() => {
    const fit = () => {
      const headH = headRef.current?.offsetHeight ?? 140
      const availH = window.innerHeight - headH - 30
      const availW = window.innerWidth - SIDE * 2
      setScale(Math.max(0.42, Math.min(availH / FRAME.h, availW / FRAME.w, 1)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const sync = (th, st) => {
    const p = new URLSearchParams()
    if (th === 'plus') p.set('theme', 'gold')
    if (st !== 'p1') p.set('step', st)
    const s = p.toString()
    history.replaceState(null, '', s ? `?${s}` : location.pathname)
  }
  const go = (st) => { setStartAt(st); setRun((r) => r + 1); sync(theme, st) }
  const pickTheme = (th) => { setTheme(th); setRun((r) => r + 1); sync(th, startAt) }
  const onStage = useCallback((s) => setStage(s), [])

  const pill = (on) => ({
    padding: '6px 13px', fontSize: 12, fontWeight: 500,
    background: on ? 'rgba(255,255,255,.13)' : 'transparent',
    color: on ? '#fff' : 'rgba(255,255,255,.5)',
  })

  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col items-center"
         style={{ background: 'radial-gradient(120% 80% at 50% 0%,#15131f 0%,#0a0910 55%,#060509 100%)' }}>

      <header ref={headRef} className="w-full flex flex-col items-center shrink-0" style={{ paddingTop: 16, paddingBottom: 12 }}>
        <h1 className="font-id text-white text-center" style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: '-.015em' }}>
          Stimuler · India — first paywall → gift → offer
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-[8px]" style={{ marginTop: 10 }}>
          <div className="flex rounded-full p-[3px]" style={{ background: 'rgba(255,255,255,.07)' }}>
            {THEMES.map((m) => (
              <button key={m.id} onClick={() => pickTheme(m.id)} className="rounded-full font-id transition-colors" style={pill(theme === m.id)}>
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex rounded-full p-[3px]" style={{ background: 'rgba(255,255,255,.07)' }}>
            {STEPS.map((s) => (
              <button key={s.id} onClick={() => go(s.id)} className="rounded-full font-id transition-colors" style={pill(STAGE_STEP[stage] === s.id)}>
                {s.label}
              </button>
            ))}
          </div>
          <button onClick={() => setSound((v) => !v)} className="rounded-full font-id" aria-pressed={sound}
                  style={{ padding: '7px 13px', fontSize: 12, fontWeight: 500, background: 'rgba(255,255,255,.07)',
                           color: sound ? '#fff' : 'rgba(255,255,255,.5)' }}>
            {sound ? 'Sound on' : 'Sound off'}
          </button>
        </div>

        <p className="font-id text-center" style={{ marginTop: 9, height: 16, fontSize: 12, color: 'rgba(255,255,255,.55)' }}>
          {HINT[stage]}
        </p>
      </header>

      <main className="flex items-start justify-center">
        <div style={{ width: FRAME.w * scale, height: FRAME.h * scale }}>
          <div className="relative overflow-hidden"
               style={{ width: FRAME.w, height: FRAME.h, borderRadius: 44, transform: `scale(${scale})`, transformOrigin: 'top left',
                        boxShadow: '0 40px 90px rgba(0,0,0,.55), 0 0 0 8px #0b0b0f, 0 0 0 9px rgba(255,255,255,.10)' }}>
            <Flow key={`${theme}-${run}`} theme={theme} startAt={startAt} onStage={onStage} sound={sound} />
          </div>
        </div>
      </main>
    </div>
  )
}
