import { useMemo } from 'react'
import { motion } from 'motion/react'
import { CASE, CASE_STEEL, RAIL, STEEL, CREAM } from './theme.js'

/**
 * The machine, traced from the Paper boards (2IM-0 idle, 2L2-0 landed).
 *
 * Every rectangle below is the artboard's own rectangle — same x, y, width,
 * height, radius — drawn in the artboard's own coordinate space, which is why
 * the viewBox starts at y 205 rather than 0. Nothing here is eyeballed from a
 * screenshot.
 *
 *   gold   #F2CF7A → #B8862B → #E9C46A   frame, bezel, lever rod
 *   body   #7C1F2B → #5E2A1C → #3F220F   cabinet
 *   cream  #FBF7EF → #E4D8C2             drum faces
 *
 * The reel faces are HTML sitting over the SVG rather than SVG text. A drum
 * needs a clipped, scrolling column of numerals; `overflow: hidden` on a div
 * does that in one line, and the numerals then get the real italic display
 * face the artboard specifies.
 */

export const BOX_W = 412
export const BOX_H = 365
const VIEW_Y = 205 // the artboard's y where this SVG starts

/* reel windows, in artboard coordinates */
const WIN_X = [82, 167, 252]
const WIN_Y = 354
const WIN_W = 78
const WIN_H = 98
const CELL = WIN_H

const TARGET = ['5', '0', '%']
const IDLE = ['★', '★', '★']
const FILLER = ['3', '9', '%', '2', '5', '8', '0', '★', '4', '6']
const REPEATS = 4

/** When each drum drops into its notch. */
export const STOP_AT = [900, 1250, 1650]

/* Each strip starts on its idle symbol, runs through the filler, and ends on
   the one it has to show. The drum does not pick a symbol — it is wound to a
   stop, which is the honest way to animate a result that was never random. */
const STRIPS = TARGET.map((t, r) => {
  const out = [IDLE[r]]
  for (let k = 0; k < REPEATS; k++) {
    for (let i = 0; i < FILLER.length; i++) out.push(FILLER[(i + r * 3 + k) % FILLER.length])
  }
  out.push(t)
  return out
})

function Reel({ index, spinning, landed, instant, silver }) {
  /* the drum is round, so its face darkens where it curves away — in the
     colour of the machine it is cut from, not a neutral grey */
  const shade = silver ? 'rgba(40,45,62,0.72)' : 'rgba(84,44,12,0.80)'
  const shade0 = silver ? 'rgba(40,45,62,0)' : 'rgba(84,44,12,0)'
  const strip = STRIPS[index]
  const land = -(strip.length - 1) * CELL
  const dur = STOP_AT[index] / 1000

  /* Memoised, or a re-render hands framer a new target object and restarts the
     spin from wherever it had got to. */
  const spin = useMemo(
    () => ({
      y: [0, land - 14, land],
      transition: {
        duration: dur,
        times: [0, 0.88, 1],
        /* wound fast and braked, then the last 14px springs back — the
           overshoot is the whole reason a reel stop reads as mechanical */
        ease: [[0.22, 0.55, 0.2, 1], [0.34, 1.3, 0.64, 1]],
      },
    }),
    [land, dur],
  )

  return (
    <div
      style={{
        position: 'absolute',
        left: WIN_X[index],
        top: WIN_Y - VIEW_Y,
        width: WIN_W,
        height: WIN_H,
        overflow: 'hidden',
        borderRadius: 5,
      }}
    >
      <motion.div
        initial={{ y: instant ? land : 0 }}
        /* `instant` is the deep link — ?at=won lands the drums without
           replaying the pull. A rewind is likewise cut, not eased: winding a
           drum backwards through forty symbols is not a thing a machine does. */
        animate={instant ? { y: land } : spinning || landed ? spin : { y: 0 }}
        transition={instant || (!spinning && !landed) ? { duration: 0 } : undefined}
        style={{ position: 'absolute', left: 0, top: 0, width: WIN_W }}
      >
        {strip.map((s, i) => (
          <div
            key={i}
            style={{
              height: CELL,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Inter Display',system-ui,sans-serif",
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: 46,
              letterSpacing: '-0.03em',
              lineHeight: '56px',
              /* the artboards give the idle drums a muted face and the landed
                 ones full ink — so the result is darker than the noise it came
                 out of, and the eye goes to it without anything flashing */
              color: i === strip.length - 1 ? (silver ? '#2A2E3B' : CREAM.ink) : silver ? '#A2AABC' : CREAM.idle,
            }}
          >
            {s}
          </div>
        ))}
      </motion.div>

      {/* the cylinder: the drum is round, so its face is darkest where it
          curves away at the top and bottom of the window */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            `linear-gradient(180deg,${shade} 0%,${shade0} 30%,${shade0} 70%,${shade} 100%)`,
        }}
      />
    </div>
  )
}

export default function SlotMachine({
  phase = 'idle',
  lit = false,
  pulled = false,
  instant = false,
  uid = 'm',
  /* the 7L0-0 page runs the machine in chrome rather than brass */
  silver = false,
  /* the cast ellipse grounds the big machine on the reveal; under the small
     one on the offer page it just smudges the panel behind it */
  shadow = true,
  /* and drops the lever once the reels have landed and the page is up: on the
     offer screen there is nothing left to pull, so the arm is dead weight */
  lever = true,
}) {
  const id = (s) => `${uid}-${s}`
  const spinning = phase === 'spin'
  const R = silver ? STEEL : RAIL
  const C = silver ? CASE_STEEL : CASE

  return (
    <div style={{ position: 'relative', width: BOX_W, height: BOX_H }}>
      <svg
        width={BOX_W}
        height={BOX_H}
        viewBox={`0 ${VIEW_Y} ${BOX_W} ${BOX_H}`}
        style={{ position: 'absolute', inset: 0, overflow: 'visible', display: 'block' }}
      >
        <defs>
          <linearGradient id={id('gold')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={R[1]} />
            <stop offset="0.5" stopColor={R[2]} />
            <stop offset="1" stopColor={R[3]} />
          </linearGradient>
          <linearGradient id={id('body')} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor={C[1]} />
            <stop offset="0.5" stopColor={C[2]} />
            <stop offset="1" stopColor={C[3]} />
          </linearGradient>
          <linearGradient id={id('cream')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={CREAM[1]} />
            <stop offset="1" stopColor={CREAM[2]} />
          </linearGradient>
          <linearGradient id={id('arm')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={silver ? '#4C5264' : '#4A3109'} />
            <stop offset="0.45" stopColor={silver ? '#99A1B3' : '#8A6016'} />
            <stop offset="1" stopColor={silver ? '#363B49' : '#362206'} />
          </linearGradient>
          <radialGradient id={id('knob')} cx="0.38" cy="0.34" r="0.7">
            <stop offset="0" stopColor={silver ? '#FFFFFF' : '#F0BA45'} />
            <stop offset="0.6" stopColor={silver ? '#A7AFC0' : '#CE8212'} />
            <stop offset="1" stopColor={silver ? '#5E6577' : '#9E5605'} />
          </radialGradient>
          <linearGradient id={id('spec')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.20" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={id('recess')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={silver ? '#1C1F29' : '#2A1708'} stopOpacity="0.8" />
            <stop offset="1" stopColor={silver ? '#1C1F29' : '#2A1708'} stopOpacity="0" />
          </linearGradient>
          <radialGradient id={id('aura')} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={silver ? '#C9D6F0' : '#FFC85A'} stopOpacity="0.18" />
            <stop offset="1" stopColor={silver ? '#C9D6F0' : '#FFC85A'} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* the warm aura the cabinet sits in — it brightens when the drums land,
            which is how the win lights the screen rather than the machine */}
        <motion.ellipse
          cx="206" cy="400" rx="195" ry="190"
          fill={`url(#${id('aura')})`}
          animate={{ opacity: lit ? 2.1 : 1, scale: lit ? 1.06 : 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: '206px 195px', transformBox: 'view-box' }}
        />
        {shadow && <ellipse cx="206" cy="507" rx="156" ry="18" fill={silver ? '#14161E' : '#1B0F03'} opacity="0.75" />}

        {/* the lever, behind the cabinet: bracket, then the arm that swings
            about it */}
        <motion.g
          /* one shot: down a little and straight back. The old version held a
             44° pull for the whole spin, which swung the knob off the screen.
             On the offer page the arm fades off with the boss it turns on —
             the pull has already happened, so there is nothing to pull. */
          animate={{ rotate: pulled ? [0, 17, 0] : 0, opacity: lever ? 1 : 0 }}
          transition={{
            rotate: pulled
              ? { duration: 0.62, times: [0, 0.26, 1], ease: ['easeIn', [0.34, 1.5, 0.64, 1]] }
              : { duration: 0 },
            opacity: { duration: 0.4, ease: 'easeOut' },
          }}
          style={{ transformOrigin: '368px 175px', transformBox: 'view-box' }}
        >
          <rect x="363" y="308" width="10" height="74" rx="5" fill={`url(#${id('arm')})`} stroke={R[2]} strokeWidth="1" />
          <rect x="365.4" y="312" width="2" height="66" rx="1" fill={R[1]} opacity="0.5" />
          <circle cx="368" cy="302" r="15" fill={`url(#${id('knob')})`} stroke={silver ? '#2B2F3C' : '#2E1D04'} strokeWidth="1.8" />
          <circle cx="363.5" cy="297" r="4.4" fill="#FFFFFF" opacity="0.38" />
        </motion.g>

        {/* feet, behind the cabinet */}
        <rect x="92" y="486" width="58" height="16" rx="6" fill={R.deep} />
        <rect x="262" y="486" width="58" height="16" rx="6" fill={R.deep} />

        {/* cabinet */}
        <rect
          x="47.5" y="317.5" width="317" height="171" rx="24"
          fill={`url(#${id('body')})`} stroke={`url(#${id('gold')})`} strokeWidth="3"
        />
        <rect
          x="58" y="328" width="296" height="150" rx="17"
          fill="none" stroke={R.line} strokeWidth="0.9" opacity="0.45"
        />

        {/* bezel and the well the drums sit in */}
        {/* the cabinet is a moulded body, so it takes a light across its
            shoulder — without it the concentric rings read as flat rims */}
        <rect x="52" y="321" width="308" height="74" rx="22" fill={`url(#${id('spec')})`} />
        <rect x="64" y="334" width="284" height="138" rx="15" fill={`url(#${id('gold')})`} />
        <rect x="76" y="346" width="260" height="114" rx="9" fill={C.well} />
        {/* the drums sit in a recess, so the well is darkest where it meets
            the bezel */}
        <rect x="76" y="346" width="260" height="30" rx="9" fill={`url(#${id('recess')})`} />

        {/* the drum faces — the HTML numerals land on top of these */}
        {WIN_X.map((x) => (
          <rect
            key={x} x={x} y={WIN_Y} width={WIN_W} height={WIN_H} rx="5"
            fill={`url(#${id('cream')})`} stroke={CREAM.line} strokeWidth="0.8"
          />
        ))}

        {/* gold between the drums, instead of three windows floating in a gap */}
        <rect x="160" y="352" width="7" height="102" rx="3" fill={`url(#${id('gold')})`} opacity="0.5" />
        <rect x="245" y="352" width="7" height="102" rx="3" fill={`url(#${id('gold')})`} opacity="0.5" />

        {/* the glass over the drums */}
        <path d="M76 346 L139 346 L96 460 L76 460 Z" fill="#FFFFFF" opacity="0.06" />
        <path d="M151 346 L167 346 L124 460 L108 460 Z" fill="#FFFFFF" opacity="0.045" />

        {/* the lever's mounting boss, on the face of the cabinet */}
        <motion.g animate={{ opacity: lever ? 1 : 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
          <circle cx="368" cy="380" r="12" fill={`url(#${id('gold')})`} />
          <circle cx="368" cy="380" r="6" fill={C[3]} opacity="0.6" />
          <circle cx="365.5" cy="377.5" r="2.4" fill={silver ? '#F4F7FC' : '#F2D79A'} opacity="0.6" />
        </motion.g>

        {/* four rivets — the detail that makes a drawn box read as a built one */}
        {[[70, 340], [342, 340], [70, 466], [342, 466]].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="3.2" fill={R.deep} />
            <circle cx={cx - 0.7} cy={cy - 0.7} r="1.6" fill={silver ? '#F4F7FC' : '#F2D79A'} opacity="0.75" />
          </g>
        ))}

        {/* the pay line only exists once there is something to point at */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: lit ? 1 : 0 }}
          transition={{ duration: 0.45, delay: lit ? 0.12 : 0 }}
        >
          <path d="M70 403 l9 -6 v12 z" fill={R[1]} />
          <path d="M342 403 l-9 -6 v12 z" fill={R[1]} />
        </motion.g>

        {/* one flash across the bezel as the last drum drops */}
        <motion.rect
          x="64" y="334" width="284" height="138" rx="15" fill="#FFFFFF"
          initial={{ opacity: 0 }}
          animate={{ opacity: lit ? [0, 0.34, 0] : 0 }}
          transition={{ duration: 0.5, times: [0, 0.14, 1], ease: 'easeOut' }}
          style={{ pointerEvents: 'none' }}
        />
      </svg>

      {WIN_X.map((_, i) => (
        <Reel key={i} index={i} spinning={spinning} landed={lit} instant={instant} silver={silver} />
      ))}
    </div>
  )
}
