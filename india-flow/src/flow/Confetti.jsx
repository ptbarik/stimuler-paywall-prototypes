import { useMemo } from 'react'
import { motion } from 'motion/react'

/**
 * One burst, from a point, under gravity.
 *
 * Each piece is thrown on its own angle and speed, arcs up and falls through
 * the frame, turning as it goes. The arc is three keyframes — out, the top of
 * the throw, down past the bottom — eased so the throw decelerates and the
 * fall accelerates, which is all gravity is to the eye.
 */
export default function Confetti({ x, y, colors, n = 56, seed = 1 }) {
  const bits = useMemo(() => {
    let s = seed * 9301 + 49297
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    return Array.from({ length: n }, (_, i) => {
      const a = -Math.PI / 2 + (rnd() - 0.5) * Math.PI * 1.35
      const v = 150 + rnd() * 230
      const dx = Math.cos(a) * v
      const peak = Math.sin(a) * v
      return {
        dx, peak,
        fall: 520 + rnd() * 380,
        drift: (rnd() - 0.5) * 120,
        rot: (rnd() - 0.5) * 900,
        w: 5 + rnd() * 5, h: 8 + rnd() * 8,
        round: rnd() < 0.25,
        c: colors[i % colors.length],
        d: 2.1 + rnd() * 1.1,
        delay: rnd() * 0.12,
      }
    })
  }, [n, seed, colors])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {bits.map((b, i) => (
        <motion.span key={i} className="absolute"
                     style={{ left: x, top: y, width: b.w, height: b.round ? b.w : b.h, background: b.c,
                              borderRadius: b.round ? '50%' : 1.5, marginLeft: -b.w / 2, marginTop: -b.h / 2 }}
                     initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
                     animate={{
                       x: [0, b.dx, b.dx + b.drift],
                       y: [0, b.peak, b.peak + b.fall],
                       rotate: [0, b.rot * 0.4, b.rot],
                       opacity: [1, 1, 0],
                     }}
                     transition={{ duration: b.d, delay: b.delay, times: [0, 0.28, 1], ease: ['easeOut', 'easeIn'] }} />
      ))}
    </div>
  )
}
