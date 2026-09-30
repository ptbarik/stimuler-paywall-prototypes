import { FABS, FAMILIES } from './fabs/index.js'
import { STOPS } from './useOfferClock.js'

/**
 * The rail on the right.
 *
 * Eleven rows in the sheet's own grouping, and under them the controls the
 * selected variant actually reacts to. Four of the eleven read the clock, one
 * reads the scroller, one waits for a lesson to land, and the rest are
 * unconditional — so the panel says which of those you are looking at, rather
 * than showing every control at all times and letting you find out.
 *
 * Under 900px wide it folds to two horizontal strips above the frame. The
 * frame is the thing that has to stay whole; the rail is the thing that gives
 * way.
 */

function reactsLine(reacts) {
  if (reacts === 'clock') return 'Driven by the clock — move the stop and the button changes.'
  if (reacts === 'scroll') return 'Driven by the scroller — scroll the roadmap and it gets out of the way.'
  if (reacts === 'lesson') return 'Absent until a lesson lands. Nothing else brings it on screen.'
  return 'Runs on its own clock; the controls only change what it reads out.'
}

function Chip({ on, tint, children, ...rest }) {
  return (
    <button {...rest}
            className="shrink-0 rounded-[11px] font-id whitespace-nowrap transition-colors"
            style={{
              padding: '8px 12px', fontSize: 12.5, fontWeight: 600,
              background: on ? 'rgba(255,255,255,.09)' : 'rgba(255,255,255,.03)',
              outline: `1px solid ${on ? `${tint}4D` : 'rgba(255,255,255,.06)'}`,
              outlineOffset: -1,
              color: on ? '#fff' : 'rgba(255,255,255,.62)',
            }}>
      {children}
    </button>
  )
}

function Stops({ stop, onStop, earned, onEarned, onReplay, dense }) {
  return (
    <>
      <div className="flex" style={{ gap: 5 }}>
        {STOPS.map((s) => (
          <button key={s.id} onClick={() => onStop(s.id)}
                  className="flex-1 rounded-[9px] font-id tnum transition-colors whitespace-nowrap"
                  style={{
                    padding: dense ? '7px 12px' : '7px 0', fontSize: 12, fontWeight: 600,
                    background: stop === s.id ? 'rgba(233,185,77,.16)' : 'rgba(255,255,255,.05)',
                    color: stop === s.id ? '#E9B94D' : 'rgba(255,255,255,.5)',
                  }}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex" style={{ gap: 5 }}>
        <button onClick={onEarned}
                className="flex-1 rounded-[9px] font-id transition-colors whitespace-nowrap"
                style={{
                  padding: dense ? '7px 12px' : '8px 0', fontSize: 12, fontWeight: 600,
                  background: earned ? 'rgba(67,214,160,.16)' : 'rgba(255,255,255,.05)',
                  color: earned ? '#43D6A0' : 'rgba(255,255,255,.5)',
                }}>
          {earned ? 'Lesson landed' : 'Land a lesson'}
        </button>
        <button onClick={onReplay}
                className="flex-1 rounded-[9px] font-id whitespace-nowrap"
                style={{ padding: dense ? '7px 12px' : '8px 0', fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.5)' }}>
          Replay entrance
        </button>
      </div>
    </>
  )
}

export default function Switcher({ current, onPick, stop, onStop, earned, onEarned, onReplay, compact }) {
  const tintOf = (key) => FAMILIES.find((f) => f.key === key)?.tint ?? '#E9B94D'

  if (compact) {
    return (
      <div className="w-full flex flex-col" style={{ gap: 8 }}>
        <div className="flex overflow-x-auto no-bar" style={{ gap: 6 }}>
          {FABS.map((f) => (
            <Chip key={f.id} on={f.id === current.id} tint={tintOf(f.family)} onClick={() => onPick(f.id)}>
              <span style={{ color: tintOf(f.family), fontWeight: 700, marginRight: 7 }}>{f.id}</span>
              {f.name}
            </Chip>
          ))}
        </div>
        <div className="flex items-center overflow-x-auto no-bar" style={{ gap: 6 }}>
          <Stops stop={stop} onStop={onStop} earned={earned} onEarned={onEarned} onReplay={onReplay} dense />
          <span className="font-id shrink-0" style={{ color: '#6C6679', fontSize: 11.5, marginLeft: 4 }}>
            {reactsLine(current.reacts)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <aside className="flex flex-col h-full min-h-0" style={{ width: 300, gap: 14 }}>
      <div className="flex flex-col overflow-y-auto no-bar min-h-0" style={{ gap: 14 }}>
        {FAMILIES.map((fam) => {
          const rows = FABS.filter((f) => f.family === fam.key)
          if (!rows.length) return null
          return (
            <div key={fam.key}>
              <div className="font-id" style={{ color: '#5C5768', fontSize: 10.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 7 }}>
                {fam.label}
              </div>
              <div className="flex flex-col" style={{ gap: 5 }}>
                {rows.map((f) => {
                  const on = f.id === current.id
                  return (
                    <button key={f.id} onClick={() => onPick(f.id)}
                            className="text-left rounded-[12px] transition-colors"
                            style={{
                              padding: '9px 12px',
                              background: on ? 'rgba(255,255,255,.09)' : 'transparent',
                              outline: `1px solid ${on ? `${fam.tint}4D` : 'rgba(255,255,255,.06)'}`,
                              outlineOffset: -1,
                            }}>
                      <span className="flex items-baseline" style={{ gap: 8 }}>
                        <span className="font-id" style={{ color: fam.tint, fontSize: 11.5, fontWeight: 700 }}>{f.id}</span>
                        <span className="font-id whitespace-nowrap" style={{ color: on ? '#fff' : 'rgba(255,255,255,.62)', fontSize: 13, fontWeight: 600 }}>
                          {f.name}
                        </span>
                      </span>
                      {on && (
                        <span className="font-id block" style={{ color: '#7C7689', fontSize: 11.5, lineHeight: '16px', marginTop: 5 }}>
                          {f.note}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-[14px] shrink-0"
           style={{ padding: 12, background: 'rgba(255,255,255,.04)', outline: '1px solid rgba(255,255,255,.07)', outlineOffset: -1 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 9 }}>
          <span className="font-id" style={{ color: '#5C5768', fontSize: 10.5, fontWeight: 600, letterSpacing: '.12em' }}>TIME LEFT</span>
          {current.reacts !== 'clock' && (
            <span className="font-id" style={{ color: '#4A4557', fontSize: 10.5 }}>readout only</span>
          )}
        </div>
        <div className="flex flex-col" style={{ gap: 9 }}>
          <Stops stop={stop} onStop={onStop} earned={earned} onEarned={onEarned} onReplay={onReplay} />
        </div>
        <p className="font-id" style={{ color: '#6C6679', fontSize: 11.5, lineHeight: '17px', margin: '10px 0 0' }}>
          {reactsLine(current.reacts)}
        </p>
      </div>
    </aside>
  )
}
