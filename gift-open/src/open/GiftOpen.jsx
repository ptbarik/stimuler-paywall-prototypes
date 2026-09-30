import { useEffect } from 'react'
import { motion } from 'motion/react'

/**
 * The tap.
 *
 * The gift leaves the floating action, the lid comes off and takes the ribbon
 * with it, something starts to rise out of the box — and before you can read
 * what it is, the light takes the whole screen and the paywall is underneath.
 *
 *    0 – 660ms    the box travels to the middle and grows; the screen dims
 *  560 – 900ms    the ribbon takes up its slack — the loops give a little
 * 1060 – 1520ms   the box shivers and a seam of light opens under the lid
 * 1480 – 2020ms   the lid lifts, tips and drifts off, carrying the ribbon
 * 1520 – 2080ms   a coupon starts up out of the box — the top edge only
 * 1820 – 2620ms   the light swells, one continuous move, out past the frame
 * 2080 – 2940ms   it evens out; the paywall comes up inside the hold
 *
 * The ribbon is never untied. The band across the box stays on the box and the
 * band across the lid stays on the lid, so when the lid goes the loops, the
 * knot and the top band all go with it as one piece — which is what a lid with
 * a bow on it actually does. It used to come undone and fall away, and a ribbon
 * dropping off the bottom of the frame read as debris.
 */

export const OPEN_MS = 3050

const OUT = [0.22, 0.72, 0.24, 1]      // decelerate, no overshoot
const SOFT = [0.4, 0, 0.3, 1]
const SWELL = [0.42, 0, 0.18, 1]       // the light, one continuous move

export default function GiftOpen({ screen, frame, slot, onDone }) {
  const g = screen.gift
  const s = g.shape

  useEffect(() => {
    const t = setTimeout(onDone, OPEN_MS)
    return () => clearTimeout(t)
  }, [onDone])

  const startX = slot.left + g.left
  const startY = slot.top + g.top
  const cx = startX + g.size / 2
  const cy = startY + g.size / 2

  const toCx = frame.w / 2
  const toCy = frame.h * 0.44
  const scale = 2.4

  /* the rim of the open box in frame pixels, once the gift is at full size —
     the seam and the coupon are hung off this rather than off guesses */
  const mouthY = toCy + (s.mouthFrac - 0.5) * g.size * scale
  const boxW = g.size * scale * 0.72

  const earPivot = { transformOrigin: `${s.earPivot[0]}px ${s.earPivot[1]}px`, transformBox: 'view-box' }
  const lidPivot = { transformOrigin: `${s.lidHinge[0]}px ${s.lidHinge[1]}px`, transformBox: 'view-box' }

  /* the loops give a little as the box is picked up — the ribbon taking up its
     slack, not coming undone. They stay tied for the whole sequence. */
  const loosen = (dir) => ({
    initial: { rotate: 0, scaleY: 1 },
    animate: { rotate: [0, dir * -4, dir * 9, dir * 5], scaleY: [1, 0.96, 1.03, 1] },
    transition: { duration: 0.34, delay: 0.56, times: [0, 0.3, 0.68, 1], ease: SOFT },
  })

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, pointerEvents: 'none' }}>
      {/* the screen goes out of the way — dark first, then warm as the box opens */}
      <motion.div
        style={{ position: 'absolute', inset: 0 }}
        initial={{ backgroundColor: 'rgba(6,5,3,0)' }}
        animate={{ backgroundColor: ['rgba(6,5,3,0)', 'rgba(6,5,3,.9)', 'rgba(26,17,4,.94)'] }}
        transition={{ duration: 1.4, times: [0, 0.42, 1], ease: 'easeOut' }}
      />

      {/* the seam: a sliver along the rim while the lid is only cracked */}
      <motion.div
        style={{
          position: 'absolute', left: toCx, top: mouthY, width: boxW, height: 20,
          marginLeft: -boxW / 2, marginTop: -10, borderRadius: '50%',
          background: 'radial-gradient(closest-side,#FFFFFF 0%,#FFF0C4 45%,rgba(246,217,140,0) 100%)',
          filter: 'blur(5px)',
        }}
        initial={{ opacity: 0, scaleX: 0.25, scaleY: 0.5 }}
        animate={{ opacity: [0, 0.95, 0.8], scaleX: [0.25, 1, 1.1], scaleY: [0.5, 1, 1.7] }}
        transition={{ duration: 0.66, delay: 1.06, times: [0, 0.55, 1], ease: SOFT }}
      />

      {/* the coupon, only ever a top edge.
          It sits *before* the box in the stacking order, so the box's own front
          wall hides everything but the sliver that clears the rim — and the
          light arrives before it can come far enough to be read. */}
      <motion.div
        style={{ position: 'absolute', left: toCx, top: mouthY, width: 122, marginLeft: -61, transformOrigin: 'center bottom' }}
        initial={{ y: 34, rotate: -5, opacity: 0 }}
        animate={{ y: [34, -24, -31], rotate: [-5, 1.5, 2], opacity: [0, 1, 1] }}
        transition={{ duration: 0.56, delay: 1.52, times: [0, 0.72, 1], ease: OUT }}
      >
        <MiniCoupon />
      </motion.div>

      {/* ── the box ───────────────────────────────────────────────── */}
      <motion.div
        style={{ position: 'absolute', left: startX, top: startY, width: g.size, height: g.size, transformOrigin: 'center center' }}
        initial={{ x: 0, y: 0, scale: 1, rotate: g.rotate ?? 0 }}
        animate={{ x: toCx - cx, y: toCy - cy, scale, rotate: 0 }}
        transition={{ duration: 0.66, ease: OUT }}
      >
        <motion.div
          style={{ width: '100%', height: '100%', transformOrigin: '50% 78%' }}
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -3, 2.4, -1.8, 1, -0.4, 0] }}
          transition={{ duration: 0.46, delay: 1.06, ease: 'easeInOut' }}
        >
          <motion.svg
            viewBox={s.viewBox} width={g.size} height={g.size} xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible', display: 'block' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 2.02, ease: 'easeInOut' }}
          >
            {/* the box, and the band that stays on it */}
            {s.base}
            {s.bandBody}

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.1 }}>
              {s.mouth}
            </motion.g>

            {/* the lid and everything tied to it — a crack first, then off as
                one piece, loops and knot and all */}
            <motion.g style={lidPivot}
                      initial={{ rotate: 0, y: 0, x: 0, opacity: 1 }}
                      animate={{ rotate: [0, -1.4, -29], y: [0, -7, -56], x: [0, 0, -19], opacity: [1, 1, 0] }}
                      transition={{ duration: 0.96, delay: 1.06, times: [0, 0.4, 1], ease: [SOFT, OUT] }}>
              <motion.path d={s.ears[0].d} fill={s.ears[0].fill} style={earPivot} {...loosen(-1)} />
              <motion.path d={s.ears[1].d} fill={s.ears[1].fill} style={earPivot} {...loosen(1)} />
              {s.lid}
              {s.bandLid}
              {s.knot}
            </motion.g>
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* ── the light ─────────────────────────────────────────────── */}

      {/* one continuous swell. A single scale on a single curve, and the blur is
          applied before the transform so it grows with the light and the edge is
          never crisp at any size. */}
      <motion.div
        style={{
          position: 'absolute', left: toCx, top: mouthY, width: 420, height: 420,
          marginLeft: -210, marginTop: -210, borderRadius: '50%',
          background: 'radial-gradient(circle,#FFFEF4 0%,#FDF7DA 22%,#FBF0C4 42%,rgba(251,240,196,.6) 60%,rgba(251,240,196,.22) 80%,rgba(251,240,196,0) 100%)',
          filter: 'blur(26px)',
        }}
        initial={{ scale: 0.16, opacity: 0 }}
        animate={{ scale: 7, opacity: 1 }}
        transition={{
          scale: { duration: 0.92, delay: 1.82, ease: SWELL },
          opacity: { duration: 0.34, delay: 1.82, ease: 'easeOut' },
        }}
      />

      {/* and then it evens out — a light yellow rather than white, so the peak
          is the same family as the light that made it, and short: it is up for
          a quarter of a second and gone in another four tenths. A long white
          hold in the middle of a transition is dead air. */}
      <motion.div
        style={{ position: 'absolute', inset: 0, background: '#FBF0C4' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.86, delay: 2.08, times: [0, 0.34, 0.5, 1], ease: 'easeInOut' }}
      />
    </div>
  )
}

/**
 * The coupon that starts to come out.
 *
 * The top 34px are deliberately blank paper: it never rises far enough for the
 * star or the offer to clear the rim, and it should not be able to by accident
 * if a delay is nudged later.
 */
function MiniCoupon() {
  return (
    <svg width="122" height="86" viewBox="0 0 122 86" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <path d="M11 0 H111 A11 11 0 0 1 122 11 V40 A10 10 0 0 0 122 60 V75 A11 11 0 0 1 111 86 H11 A11 11 0 0 1 0 75 V60 A10 10 0 0 1 0 40 V11 A11 11 0 0 1 11 0 Z"
            fill="#FEF4CB" stroke="#E7CE8F" strokeWidth="1" />
      <path d="M61 44 l3 6.1 6.7.9 -4.85 4.7 1.15 6.7 -6-3.2 -6 3.2 1.15-6.7 -4.85-4.7 6.7-.9 z" fill="#E3B437" />
      <text x="61" y="80" textAnchor="middle" fontFamily="Inter Display, system-ui, sans-serif"
            fontSize="17" fontWeight="800" letterSpacing="-0.3" fill="#C79A2A">50% OFF</text>
    </svg>
  )
}
