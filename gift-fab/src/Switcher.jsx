import { FABS } from './fabs/index.jsx'
import { STOPS } from './useOfferClock.js'

/**
 * The rail on the right: the eight designs, and the three things worth doing
 * to a loop while you judge it — stop it, slow it down, and start it again
 * from the first frame.
 */
export default function Switcher({ current, onPick, anim, onAnim, slow, onSlow, stop, onStop, onReplay, compact }) {
  if (compact) {
    return (
      <div className="w-full flex flex-col" style={{ gap: 8 }}>
        <div className="flex overflow-x-auto no-bar" style={{ gap: 6 }}>
          {FABS.map((f) => (
            <button key={f.id} onClick={() => onPick(f.id)}
                    className="shrink-0 rounded-[11px] font-id whitespace-nowrap transition-colors"
                    style={{
                      padding: '8px 12px', fontSize: 12.5, fontWeight: 600,
                      background: f.id === current.id ? 'rgba(255,255,255,.09)' : 'rgba(255,255,255,.03)',
                      outline: `1px solid ${f.id === current.id ? '#E9B94D4D' : 'rgba(255,255,255,.06)'}`,
                      outlineOffset: -1,
                      color: f.id === current.id ? '#fff' : 'rgba(255,255,255,.62)',
                    }}>
              <span style={{ color: '#E9B94D', fontWeight: 700, marginRight: 7 }}>{f.id}</span>{f.name}
            </button>
          ))}
        </div>
        <div className="flex items-center overflow-x-auto no-bar" style={{ gap: 6 }}>
          <Toggle on={anim} onClick={onAnim} labelOn="Animating" labelOff="Held still" tint="#43D6A0" dense />
          <Toggle on={slow} onClick={onSlow} labelOn="Half speed" labelOff="Full speed" tint="#9AC7FF" dense />
          <Plain onClick={onReplay} dense>Replay</Plain>
          <span className="font-id shrink-0" style={{ color: '#6C6679', fontSize: 11.5, marginLeft: 4 }}>{current.motion}</span>
        </div>
      </div>
    )
  }

  return (
    <aside className="flex flex-col h-full min-h-0" style={{ width: 300, gap: 14 }}>
      <div className="flex flex-col overflow-y-auto no-bar min-h-0" style={{ gap: 5 }}>
        <div className="font-id" style={{ color: '#5C5768', fontSize: 10.5, fontWeight: 600, letterSpacing: '.12em', marginBottom: 2 }}>
          EIGHT DESIGNS · ONE 4.2s LOOP
        </div>
        {FABS.map((f) => {
          const on = f.id === current.id
          return (
            <button key={f.id} onClick={() => onPick(f.id)}
                    className="text-left rounded-[12px] transition-colors"
                    style={{
                      padding: '9px 12px',
                      background: on ? 'rgba(255,255,255,.09)' : 'transparent',
                      outline: `1px solid ${on ? '#E9B94D4D' : 'rgba(255,255,255,.06)'}`,
                      outlineOffset: -1,
                    }}>
              <span className="flex items-baseline" style={{ gap: 8 }}>
                <span className="font-id" style={{ color: '#E9B94D', fontSize: 11.5, fontWeight: 700 }}>{f.id}</span>
                <span className="font-id whitespace-nowrap" style={{ color: on ? '#fff' : 'rgba(255,255,255,.62)', fontSize: 13, fontWeight: 600 }}>{f.name}</span>
                <span className="font-id whitespace-nowrap" style={{ color: '#6C6679', fontSize: 10.5, marginLeft: 'auto' }}>{f.motion}</span>
              </span>
              {on && (
                <span className="font-id block" style={{ color: '#7C7689', fontSize: 11.5, lineHeight: '16px', marginTop: 5 }}>{f.note}</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="rounded-[14px] shrink-0"
           style={{ padding: 12, background: 'rgba(255,255,255,.04)', outline: '1px solid rgba(255,255,255,.07)', outlineOffset: -1 }}>
        <div className="font-id" style={{ color: '#5C5768', fontSize: 10.5, fontWeight: 600, letterSpacing: '.12em', marginBottom: 9 }}>THE LOOP</div>
        <div className="flex" style={{ gap: 5 }}>
          <Toggle on={anim} onClick={onAnim} labelOn="Animating" labelOff="Held still" tint="#43D6A0" />
          <Toggle on={slow} onClick={onSlow} labelOn="Half speed" labelOff="Full speed" tint="#9AC7FF" />
        </div>
        <div className="flex" style={{ gap: 5, marginTop: 9 }}>
          <Plain onClick={onReplay}>Replay from frame one</Plain>
        </div>

        <div className="font-id" style={{ color: '#5C5768', fontSize: 10.5, fontWeight: 600, letterSpacing: '.12em', margin: '14px 0 9px' }}>TIME LEFT</div>
        <div className="flex" style={{ gap: 5 }}>
          {STOPS.map((s) => (
            <button key={s.id} onClick={() => onStop(s.id)}
                    className="flex-1 rounded-[9px] font-id tnum transition-colors"
                    style={{
                      padding: '7px 0', fontSize: 12, fontWeight: 600,
                      background: stop === s.id ? 'rgba(233,185,77,.16)' : 'rgba(255,255,255,.05)',
                      color: stop === s.id ? '#E9B94D' : 'rgba(255,255,255,.5)',
                    }}>
              {s.label}
            </button>
          ))}
        </div>

        <p className="font-id" style={{ color: '#6C6679', fontSize: 11.5, lineHeight: '17px', margin: '11px 0 0' }}>
          Rattle 0–1.2s · highlight 1.2–3.1s · then a second of nothing. Half speed is for reading the ribbons.
        </p>
      </div>
    </aside>
  )
}

function Toggle({ on, onClick, labelOn, labelOff, tint, dense }) {
  return (
    <button onClick={onClick}
            className={`${dense ? 'shrink-0' : 'flex-1'} rounded-[9px] font-id whitespace-nowrap transition-colors`}
            style={{
              padding: dense ? '7px 12px' : '8px 0', fontSize: 12, fontWeight: 600,
              background: on ? `${tint}29` : 'rgba(255,255,255,.05)',
              color: on ? tint : 'rgba(255,255,255,.5)',
            }}>
      {on ? labelOn : labelOff}
    </button>
  )
}

function Plain({ onClick, children, dense }) {
  return (
    <button onClick={onClick}
            className={`${dense ? 'shrink-0' : 'flex-1'} rounded-[9px] font-id whitespace-nowrap`}
            style={{ padding: dense ? '7px 12px' : '8px 0', fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.5)' }}>
      {children}
    </button>
  )
}
