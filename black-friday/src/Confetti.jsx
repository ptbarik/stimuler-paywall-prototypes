import { useMemo } from 'react'
import { motion } from 'motion/react'
import { GOLD, CREAM, EMBER } from './theme.js'

/* The confetti is cut from the same three materials as everything else — gold
   foil, cream card, a little maroon — so it reads as the screen coming apart
   rather than a party effect dropped on top of it. */
export const PIECES = [
  GOLD.light, GOLD[1], GOLD.mid, GOLD[3],
  CREAM[1], CREAM[2],
  EMBER.hot,
]

/**
 * One burst, from a point, under gravity.
 *
 * Each piece is thrown on its own angle and speed, arcs up, and falls through
 * the frame turning as it goes. The arc is three keyframes — out, the top of
 * the throw, down past the bottom — eased so the throw decelerates and the
 * fall accelerates, which is all gravity is to the eye.
 */
export function Burst({ x, y, n = 44, seed = 1, spread = 1.35, power = 1 }) {
  const bits = useMemo(() => {
    let s = seed * 9301 + 49297
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    return Array.from({ length: n }, (_, i) => {
      const a = -Math.PI / 2 + (rnd() - 0.5) * Math.PI * spread
      const v = (140 + rnd() * 230) * power
      return {
        dx: Math.cos(a) * v,
        peak: Math.sin(a) * v,
        fall: 560 + rnd() * 420,
        drift: (rnd() - 0.5) * 130,
        rot: (rnd() - 0.5) * 900,
        w: 5 + rnd() * 5,
        h: 8 + rnd() * 9,
        round: rnd() < 0.22,
        /* a quarter of the pieces are foil — a thin bright edge on one side,
           which is what makes a flat rectangle read as something with a back */
        foil: rnd() < 0.28,
        c: PIECES[i % PIECES.length],
        d: 2.0 + rnd() * 1.2,
        delay: rnd() * 0.14,
      }
    })
  }, [n, seed, spread, power])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 40 }}>
      {bits.map((b, i) => (
        <motion.span
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: b.w,
            height: b.round ? b.w : b.h,
            background: b.foil
              ? `linear-gradient(130deg,${b.c} 0%,#FFFFFF 42%,${b.c} 70%)`
              : b.c,
            borderRadius: b.round ? '50%' : 1.5,
            marginLeft: -b.w / 2,
            marginTop: -b.h / 2,
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
          animate={{
            x: [0, b.dx, b.dx + b.drift],
            y: [0, b.peak, b.peak + b.fall],
            rotate: [0, b.rot * 0.4, b.rot],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: b.d,
            delay: b.delay,
            times: [0, 0.28, 1],
            ease: ['easeOut', 'easeIn'],
            /* opacity starts at 0 so a piece waiting out its delay is not left
               sitting on the launch point as a still square */
            opacity: { duration: b.d, delay: b.delay, times: [0, 0.03, 0.7, 1] },
          }}
        />
      ))}
    </div>
  )
}

/**
 * The pop that greets the page: three throws, not one.
 *
 * A single centred burst reads as an effect. Two from the shoulders and one up
 * the middle, each a beat apart, reads as the screen itself letting go — and
 * it fills the width, which one burst from the middle never does.
 */
export default function ConfettiPop({ w = 412, y = 300 }) {
  return (
    <>
      <Burst x={w * 0.5} y={y} n={40} seed={3} spread={1.5} power={1.05} />
      <Burst x={w * 0.12} y={y + 46} n={26} seed={11} spread={0.8} power={1.2} />
      <Burst x={w * 0.88} y={y + 46} n={26} seed={29} spread={0.8} power={1.2} />
    </>
  )
}
