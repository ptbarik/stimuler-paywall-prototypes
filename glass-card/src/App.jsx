import { useCallback, useEffect, useRef, useState } from 'react'
import Backdrop, { SCENES } from './components/Backdrop'
import PriceSheet, { SHEET_GROUP_W } from './components/PriceSheet'
import { SUPPORTS_BACKDROP_URL } from './components/Glass'

const FRAME_W = 412
const FRAME_H = 915
const RAIL_W = 278

/* Figma's Glass panel, as shipped on this node. */
const FIGMA = {
  lightAngle: -45,
  lightIntensity: 80,
  refraction: 100,
  depth: 63,
  dispersion: 50,
  frost: 23,
  splay: 0,
}

const KEYS = Object.keys(FIGMA)

function readURL() {
  const q = new URLSearchParams(window.location.search)
  const glass = { ...FIGMA }
  for (const k of KEYS) {
    const v = q.get(k)
    if (v !== null && !Number.isNaN(Number(v))) glass[k] = Number(v)
  }
  return {
    glass,
    scene: SCENES.some((s) => s.id === q.get('scene')) ? q.get('scene') : 'pro',
    flat: q.get('flat') === '1',
    float: q.get('float') === '1',
    sweep: q.get('sweep') !== '0',
  }
}

function Slider({ label, value, min, max, step = 1, suffix = '', onChange }) {
  return (
    <label style={{ display: 'block', marginBottom: 13 }}>
      <span style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontSize: 11.5, letterSpacing: '.02em', color: 'rgba(255,255,255,.62)', marginBottom: 6,
      }}>
        <span>{label}</span>
        <span style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{value}{suffix}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value}
             onChange={(e) => onChange(Number(e.target.value))}
             style={{ width: '100%' }} />
    </label>
  )
}

function Toggle({ on, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '7px 0', fontSize: 11.5, letterSpacing: '.01em',
      borderRadius: 8, cursor: 'pointer',
      border: on ? '1px solid rgba(160,150,255,.55)' : '1px solid rgba(255,255,255,.13)',
      background: on ? 'rgba(120,108,255,.22)' : 'rgba(255,255,255,.04)',
      color: on ? '#fff' : 'rgba(255,255,255,.62)',
    }}>{children}</button>
  )
}

export default function App() {
  const init = useRef(readURL()).current
  const [glass, setGlass] = useState(init.glass)
  const [scene, setScene] = useState(init.scene)
  const [flat, setFlat] = useState(init.flat)
  const [float, setFloat] = useState(init.float)
  const [sweep, setSweep] = useState(init.sweep)
  const [zoom, setZoom] = useState(1)

  /* the frame is a fixed 412 × 915, so it is fitted with `zoom` rather than
     `transform: scale()` — a transform leaves the layout box full size and the
     bottom-pinned sheet computes against a frame taller than the window */
  useEffect(() => {
    const fit = () => setZoom(Math.min(
      1,
      (window.innerHeight - 40) / FRAME_H,
      (window.innerWidth - RAIL_W - 40) / FRAME_W,
    ))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    const q = new URLSearchParams()
    for (const k of KEYS) if (glass[k] !== FIGMA[k]) q.set(k, String(glass[k]))
    if (scene !== 'pro') q.set('scene', scene)
    if (flat) q.set('flat', '1')
    if (float) q.set('float', '1')
    if (!sweep) q.set('sweep', '0')
    const s = q.toString()
    window.history.replaceState(null, '', s ? `?${s}` : window.location.pathname)
  }, [glass, scene, flat, float, sweep])

  const set = useCallback((k) => (v) => setGlass((g) => ({ ...g, [k]: v })), [])

  /* --- the backdrop scrolls under the pane --- */
  const [offset, setOffset] = useState(0)
  const maxScroll = 460
  const clamp = (v) => Math.max(-maxScroll, Math.min(0, v))
  const drag = useRef(null)

  /* --- and in float mode the pane moves over the backdrop instead --- */
  const [pos, setPos] = useState({ x: (FRAME_W - SHEET_GROUP_W) / 2, y: FRAME_H - 234.4186 })
  const pdrag = useRef(null)

  const onFrameWheel = (e) => {
    setOffset((o) => clamp(o - e.deltaY))
  }
  const onFrameDown = (e) => {
    if (float && e.target.closest('[data-pane]')) return
    drag.current = { y: e.clientY, start: offset }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onFrameMove = (e) => {
    if (pdrag.current) {
      const d = pdrag.current
      setPos({
        x: Math.max(-40, Math.min(FRAME_W - SHEET_GROUP_W + 40, d.px + (e.clientX - d.x) / zoom)),
        y: Math.max(-20, Math.min(FRAME_H - 40, d.py + (e.clientY - d.y) / zoom)),
      })
      return
    }
    if (!drag.current) return
    setOffset(clamp(drag.current.start + (e.clientY - drag.current.y) / zoom))
  }
  const onFrameUp = () => { drag.current = null; pdrag.current = null }

  const onPaneDown = (e) => {
    if (!float) return
    e.stopPropagation()
    pdrag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y }
  }

  useEffect(() => {
    if (float) return
    setPos({ x: (FRAME_W - SHEET_GROUP_W) / 2, y: FRAME_H - 234.4186 })
  }, [float])

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#07060C' }}>
      {/* stage */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 0, overflow: 'hidden',
      }}>
        <div
          onWheel={onFrameWheel}
          onPointerDown={onFrameDown}
          onPointerMove={onFrameMove}
          onPointerUp={onFrameUp}
          onPointerCancel={onFrameUp}
          style={{
            zoom, width: FRAME_W, height: FRAME_H, position: 'relative',
            overflow: 'hidden', borderRadius: 30, background: '#07060C',
            boxShadow: '0 40px 90px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.07)',
            cursor: float ? 'default' : 'grab', touchAction: 'none', userSelect: 'none',
          }}
        >
          <div style={{ position: 'absolute', left: 0, top: offset, width: FRAME_W }}>
            <Backdrop scene={scene} />
          </div>

          <div data-pane
               onPointerDown={onPaneDown}
               style={{
                 position: 'absolute', left: pos.x, top: pos.y,
                 cursor: float ? 'grab' : 'default',
               }}>
            <PriceSheet glass={glass} flat={flat} sweep={sweep} />
          </div>
        </div>
      </div>

      {/* rail */}
      <aside className="no-bar" style={{
        width: RAIL_W, flex: 'none', height: '100vh', overflowY: 'auto',
        borderLeft: '1px solid rgba(255,255,255,.08)',
        background: 'rgba(255,255,255,.025)', padding: '22px 20px 40px',
        fontFamily: "'Inter Display', system-ui, sans-serif",
      }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>Price sheet · glass</div>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.45)', marginTop: 4, lineHeight: 1.5 }}>
          Figma node 12222-26563. Drag or scroll the screen to pull content under the pane.
        </div>

        {!SUPPORTS_BACKDROP_URL && (
          <div style={{
            marginTop: 14, padding: '9px 11px', borderRadius: 9, fontSize: 11, lineHeight: 1.5,
            background: 'rgba(255,190,90,.1)', border: '1px solid rgba(255,190,90,.3)', color: '#FFD79A',
          }}>
            This browser can't run a filter inside <code>backdrop-filter</code>, so you're
            seeing frost only. Open in Chrome for refraction and dispersion.
          </div>
        )}

        <div style={{ marginTop: 20, fontSize: 10.5, letterSpacing: '.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: 9 }}>Behind the glass</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {SCENES.map((s) => (
            <button key={s.id} onClick={() => setScene(s.id)} style={{
              textAlign: 'left', padding: '8px 11px', borderRadius: 9, fontSize: 12, cursor: 'pointer',
              border: scene === s.id ? '1px solid rgba(160,150,255,.55)' : '1px solid rgba(255,255,255,.1)',
              background: scene === s.id ? 'rgba(120,108,255,.2)' : 'rgba(255,255,255,.03)',
              color: scene === s.id ? '#fff' : 'rgba(255,255,255,.6)',
            }}>{s.label}</button>
          ))}
        </div>

        <div style={{ marginTop: 20, fontSize: 10.5, letterSpacing: '.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: 9 }}>Light</div>
        <Slider label="Angle" value={glass.lightAngle} min={-180} max={180} suffix="°" onChange={set('lightAngle')} />
        <Slider label="Intensity" value={glass.lightIntensity} min={0} max={100} suffix="%" onChange={set('lightIntensity')} />

        <div style={{ marginTop: 14, fontSize: 10.5, letterSpacing: '.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: 9 }}>Material</div>
        <Slider label="Refraction" value={glass.refraction} min={0} max={100} onChange={set('refraction')} />
        <Slider label="Depth" value={glass.depth} min={0} max={100} onChange={set('depth')} />
        <Slider label="Dispersion" value={glass.dispersion} min={0} max={100} onChange={set('dispersion')} />
        <Slider label="Frost" value={glass.frost} min={0} max={100} onChange={set('frost')} />
        <Slider label="Splay" value={glass.splay} min={0} max={100} onChange={set('splay')} />

        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <Toggle on={!flat} onClick={() => setFlat(false)}>Glass</Toggle>
          <Toggle on={flat} onClick={() => setFlat(true)}>Flat</Toggle>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <Toggle on={!float} onClick={() => setFloat(false)}>Pinned</Toggle>
          <Toggle on={float} onClick={() => setFloat(true)}>Free</Toggle>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <Toggle on={sweep} onClick={() => setSweep(true)}>Sheen on</Toggle>
          <Toggle on={!sweep} onClick={() => setSweep(false)}>Sheen off</Toggle>
        </div>

        <button onClick={() => { setGlass(FIGMA); setOffset(0) }} style={{
          width: '100%', marginTop: 12, padding: '8px 0', fontSize: 11.5, borderRadius: 8,
          border: '1px solid rgba(255,255,255,.13)', background: 'rgba(255,255,255,.04)',
          color: 'rgba(255,255,255,.7)', cursor: 'pointer',
        }}>Back to Figma's values</button>

        <div style={{ marginTop: 16, fontSize: 10.5, lineHeight: 1.6, color: 'rgba(255,255,255,.32)' }}>
          Refraction, Depth, Dispersion and Splay are a generated displacement map
          read by three <code>feDisplacementMap</code> passes — one per colour
          channel. Frost is the plain blur. Every setting is in the URL.
        </div>
      </aside>
    </div>
  )
}
