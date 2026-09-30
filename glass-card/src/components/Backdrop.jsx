/**
 * Three things to put the card over.
 *
 * Glass is only legible against something. A blurred rectangle over a flat
 * colour looks identical whether it is refracting or not, so each of these is
 * built to make one property of the material impossible to miss:
 *
 *   pro       the real paywall screen — what it will actually sit on
 *   field     saturated colour, where dispersion splits into visible fringes
 *   rules     hairlines and type, where refraction bends something straight
 *
 * All three are taller than the frame and scroll, because the moment the
 * content moves under a stationary pane is the moment it stops looking painted
 * on and starts looking like a piece of glass.
 */

const INTER = "'Inter Display', system-ui, sans-serif"

function Pro() {
  return (
    <div style={{ position: 'relative', width: 412, minHeight: 1180, background: '#0B0920' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(120% 60% at 50% 0%, #3A2F7A 0%, #1A1540 42%, #0B0920 100%)',
      }} />
      <img src="/assets/learner-pro.jpg" alt=""
           style={{ position: 'absolute', left: 0, top: 0, width: 412, height: 430, objectFit: 'cover', opacity: 0.85 }} />
      <div style={{
        position: 'absolute', left: 0, top: 0, width: 412, height: 430,
        background: 'linear-gradient(180deg, rgba(11,9,32,0) 38%, #0B0920 100%)',
      }} />
      <img src="/assets/trophy-pro.png" alt=""
           style={{ position: 'absolute', left: 250, top: 250, width: 150, filter: 'drop-shadow(0 18px 40px rgba(255,190,90,.35))' }} />
      <img src="/assets/crown.png" alt=""
           style={{ position: 'absolute', left: 24, top: 300, width: 82, opacity: .95 }} />

      <div style={{ position: 'absolute', left: 24, top: 400, width: 364 }}>
        <div style={{
          fontFamily: INTER, fontWeight: 700, fontSize: 32, lineHeight: '1.15',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(90deg,#DB992F,#FFE090 52%,#DB992F)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        }}>Speak like the<br />person you are<br />becoming.</div>
        <p style={{
          marginTop: 14, fontFamily: INTER, fontWeight: 400, fontSize: 15,
          lineHeight: '1.55', color: '#B7B0DF',
        }}>
          Unlimited practice, corrections that explain themselves, and a coach
          that remembers every mistake you have already fixed.
        </p>
      </div>

      {[
        ['Unlimited speaking sessions', 'No daily cap, ever.'],
        ['Instant pronunciation repair', 'Sound by sound, on the spot.'],
        ['A plan that follows you', 'It rebuilds itself every week.'],
        ['Real interview drills', 'Scored the way recruiters score.'],
        ['Offline lesson packs', 'Practise on the train.'],
      ].map(([t, s], i) => (
        <div key={t} style={{
          position: 'absolute', left: 24, top: 600 + i * 84, width: 364, height: 68,
          borderRadius: 16, background: 'rgba(255,255,255,.05)',
          border: '1px solid rgba(255,255,255,.09)',
          display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', boxSizing: 'border-box',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 11, flex: 'none',
            background: 'linear-gradient(140deg,#FFE090,#DB992F)',
          }} />
          <div>
            <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 14.5, color: '#fff' }}>{t}</div>
            <div style={{ fontFamily: INTER, fontWeight: 400, fontSize: 12.5, color: '#9A95C3', marginTop: 2 }}>{s}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Field() {
  const blobs = [
    ['#FF2D95', 300, 60, 40],
    ['#00E5FF', 260, 300, 240],
    ['#FFC33F', 280, -40, 520],
    ['#7B2BFF', 320, 180, 700],
    ['#00FF94', 240, -20, 930],
    ['#FF4D2D', 300, 200, 1080],
  ]
  return (
    <div style={{ position: 'relative', width: 412, minHeight: 1320, background: '#05040B', overflow: 'hidden' }}>
      {blobs.map(([c, s, x, y]) => (
        <div key={`${c}${y}`} style={{
          position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%',
          background: c, filter: 'blur(2px)', opacity: 0.92,
        }} />
      ))}
      {/* hard edges over the soft ones: displacement shows up on a boundary */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} style={{
          position: 'absolute', left: 0, top: 70 + i * 165, width: 412, height: 10,
          background: '#fff', opacity: 0.9,
        }} />
      ))}
    </div>
  )
}

function Rules() {
  return (
    <div style={{ position: 'relative', width: 412, minHeight: 1320, background: '#0C0B14' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,.26) 1px, transparent 1px),' +
          'linear-gradient(to bottom, rgba(255,255,255,.26) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'linear-gradient(to right, rgba(120,190,255,.6) 1px, transparent 1px),' +
          'linear-gradient(to bottom, rgba(120,190,255,.6) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />
      {Array.from({ length: 16 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute', left: 8, top: 8 + i * 80,
          fontFamily: INTER, fontWeight: 600, fontSize: 13, color: '#78BEFF',
        }}>{i * 80}</div>
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <div key={`t${i}`} style={{
          position: 'absolute', left: 30, top: 140 + i * 140, width: 352,
          fontFamily: INTER, fontWeight: 500, fontSize: 17, lineHeight: '1.4', color: '#fff',
        }}>
          A straight line is the only honest test of refraction.
        </div>
      ))}
    </div>
  )
}

export const SCENES = [
  { id: 'pro', label: 'Pro screen', Component: Pro },
  { id: 'field', label: 'Colour field', Component: Field },
  { id: 'rules', label: 'Hairlines', Component: Rules },
]

export default function Backdrop({ scene }) {
  const found = SCENES.find((s) => s.id === scene) || SCENES[0]
  const { Component } = found
  return <Component />
}
