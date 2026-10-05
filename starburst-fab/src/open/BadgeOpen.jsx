import { useEffect, useMemo } from 'react'
import { motion } from 'motion/react'
import Rosette from '../fabs/Rosette.jsx'
import Reveal, { REVEAL_MS, BLOOM_MS } from './Reveal.jsx'
import { contour } from '../paywall/starburst.js'

/**
 * The tap.
 *
 * The badge on the tab *is* the badge on the paywall — same nine vertices out
 * of `starburst.js`, same three gold stops — so the tap does not need a cut.
 * It picks the rosette up off the tab, carries it to the slot the paywall
 * keeps for it, and the page assembles around it while it sits still.
 *
 *     0 – 720ms   the badge travels and grows; the Learn screen goes out
 *   260 – 1000ms  the contour rings ripple out of it as it arrives
 *   550 – 1000ms  a gold bloom catches it at the landing
 *   550 – 750ms   the paywall comes up underneath, its own badge already landed
 *   780 – 920ms   the flying copy fades into the one that was always there
 *
 * **There is no whiteout.** The gift flow had one because a box opening has to
 * hide the moment the box stops being a box; this has nothing to hide. Keeping
 * the badge visible end to end is the entire argument for the tab carrying it
 * in the first place — you watch the thing you tapped become the thing you are
 * looking at. A light that covers it would throw that away for drama.
 *
 * The landing is `(206, 256)`: the scroller's 158 of top padding plus half the
 * offer block's 196-tall slot. Taken off the paywall's own numbers rather than
 * eyeballed, because a few pixels out and the hand-off reads as a jump.
 */

/*
 * How long before the flight starts.
 *
 * Three cases, and they are three because the badge arrives three ways: it was
 * already on the tab (B/C/D/F — nothing owed), it has to be made out of a
 * device (G–L — a device beat and a bloom), or the user's own gesture already
 * got it to a disc (M–R — only the points are owed).
 */
export const leadOf = (screen, origin) =>
  origin?.bloom ? BLOOM_MS / 1000 : screen.reveal ? REVEAL_MS / 1000 : 0

export const openMs = (screen, origin) => 1150 + leadOf(screen, origin) * 1000

const LAND = { cx: 206, cy: 256, size: 276 }
const OUT = [0.22, 0.72, 0.24, 1]

/* the paywall's own rings, at its own radii */
const RINGS = [1.12, 1.37, 1.62]

export default function BadgeOpen({ screen, origin, onDone }) {
  /*
   * Where the badge is coming from, in order of who knows best:
   *
   *   the gesture   M–R, which moved the thing themselves and said where it
   *                 ended up — the knob is wherever it was let go of
   *   the device    G–L, which put their disc where their device stood
   *   the tab       B/C/D/F, which were showing the badge all along
   */
  /* `?open=play` can land on an interactive tab with nobody having touched
     it, so there is a fourth case: no gesture, no device, no badge. The tab's
     own middle is the honest answer — it is where the pane is. */
  const fallback = screen.interactive && !origin
    ? { cx: 206, cy: 892 - 94 - 14 - screen.h / 2, size: 48, bloom: true }
    : null
  const o = origin ?? fallback
  const r = o?.bloom ? { ...o, kind: 'commit' } : screen.reveal
  const b = o ?? screen.badge ?? { cx: r.cx, cy: r.cy, size: r.size }
  const lead = leadOf(screen, o)

  useEffect(() => {
    const t = setTimeout(onDone, openMs(screen, o))
    return () => clearTimeout(t)
  }, [onDone, screen, o])

  const rings = useMemo(() => RINGS.map((m, i) => contour(9, 78, 57.5, m, i)), [])

  /* the flight, as one spring both the badge and its rings ride, so they
     arrive as one object rather than as a shape with decoration trailing it */
  const flight = { type: 'spring', visualDuration: 0.56, bounce: 0.16 }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, pointerEvents: 'none' }}>
      {/* the Learn screen steps back to the paywall's own ground */}
      <motion.div
        style={{ position: 'absolute', inset: 0 }}
        initial={{ backgroundColor: 'rgba(7,6,13,0)' }}
        animate={{ backgroundColor: 'rgba(7,6,13,1)' }}
        transition={{ duration: 0.42, delay: lead + 0.08, ease: 'easeOut' }}
      />

      {/* the bloom that catches the badge as it sets down */}
      <motion.div
        style={{
          position: 'absolute', left: LAND.cx, top: LAND.cy, width: 520, height: 520,
          marginLeft: -260, marginTop: -260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,231,168,.42) 0%, rgba(232,181,75,.18) 42%, rgba(232,181,75,0) 70%)',
        }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 0.95, 0], scale: [0.4, 1, 1.18] }}
        transition={{ duration: 0.9, delay: lead + 0.42, times: [0, 0.42, 1], ease: 'easeOut' }}
      />

      {/* the badge being made, on the six that were not carrying one */}
      {r && <Reveal reveal={r} />}

      {/* the badge itself: from wherever this tab put it, to the slot */}
      <motion.div
        style={{ position: 'absolute', left: 0, top: 0, width: LAND.size, height: LAND.size }}
        initial={{
          x: b.cx - LAND.size / 2, y: b.cy - LAND.size / 2,
          scale: b.size / LAND.size,
          /* on a reveal tab this copy is invisible until `Reveal` has finished
             making the badge, and then takes over from it in place */
          opacity: r ? 0 : 1,
        }}
        animate={{
          x: LAND.cx - LAND.size / 2, y: LAND.cy - LAND.size / 2,
          scale: 1, opacity: r ? [0, 1, 1, 0] : [1, 1, 0],
        }}
        transition={{
          default: { ...flight, delay: lead },
          /* the cross-fade into the paywall's own copy. Both are the same
             shape at the same place by now, so this is only insurance
             against a half-pixel — 140ms and nobody sees a thing. */
          opacity: r
            ? { duration: 0.92, delay: lead, times: [0, 0.02, 0.85, 1], ease: 'linear' }
            : { duration: 0.92, delay: lead, times: [0, 0.85, 1], ease: 'linear' },
        }}
      >
        <svg viewBox="-110 -110 220 220" width={LAND.size} height={LAND.size}
             style={{ position: 'absolute', inset: 0, overflow: 'visible' }} aria-hidden>
          {rings.map((d, i) => (
            <motion.path
              key={i} d={d} fill="none" stroke="#fff" strokeWidth={1}
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: [0, 0.16 - i * 0.03, 0.085 - i * 0.017], scale: [0.72, 1.04, 1] }}
              transition={{ duration: 0.74, delay: lead + 0.26 + i * 0.07, times: [0, 0.55, 1], ease: OUT }}
              style={{ transformOrigin: '50% 50%' }}
            />
          ))}
        </svg>
        <Rosette size={LAND.size} shapeOnly />

        {/*
          The figure is drawn here rather than left to `Rosette`, because at
          the landing it has to sit exactly where `StarburstOffer` puts its
          own — and `StarburstOffer` centres the *pair*, `50%` over `OFF`, so
          its `50%` rides about 10px above the badge's centre. Ten pixels is
          nothing to look at and everything to land on.

          `OFF` fades in rather than scaling up from nothing: at the start of
          the flight the badge is 50px across and this line is three, which is
          a smudge. It arrives once there is room for it.
        */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-id" style={{
            fontSize: LAND.size * 0.195, fontWeight: 700,
            letterSpacing: '-.03em', color: '#fff', lineHeight: 1,
          }}>50%</span>
          <motion.span className="font-id" style={{
            fontSize: LAND.size * 0.063, fontWeight: 600, letterSpacing: '.16em',
            color: '#fff', marginTop: LAND.size * 0.012,
          }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             transition={{ duration: 0.26, delay: lead + 0.3 }}>OFF</motion.span>
        </div>
      </motion.div>
    </div>
  )
}
