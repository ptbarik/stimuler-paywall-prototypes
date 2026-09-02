import { motion } from 'motion/react'
import { EASE, T } from '../timeline'

const BARS = 12

/**
 * A fixed, irrationally-spaced phase seed per bar. Fixed so it survives
 * re-renders and scrubbing; irrational so no two bars ever share a cycle —
 * which is what stops this reading as a loading spinner.
 */
const SEEDS = Array.from({ length: BARS }, (_, i) => (i * 2.399963) % (Math.PI * 2))
const RATES = Array.from({ length: BARS }, (_, i) => 1 + ((i * 0.37) % 0.6))

export default function Waveform({ ms, visible, reduced, scale }) {
  return (
    <motion.div
      className="flex items-center justify-center gap-[3px]"
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 6 }}
      transition={
        reduced
          ? { duration: 0 }
          : visible
            ? { duration: 0.2 * scale, ease: EASE.enter }
            : { duration: (T.waveOutDur / 1000) * scale, ease: EASE.exit }
      }
    >
      {SEEDS.map((seed, i) => {
        // live height comes straight off the clock so it stays scrubbable
        const wave = 0.5 + 0.5 * Math.sin((ms / 210) * RATES[i] + seed)
        const h = reduced ? 14 : 5 + wave * 24
        return (
          <motion.span
            key={i}
            className="block w-[3px] rounded-[2px] bg-white/90"
            initial={false}
            animate={{ scaleY: visible ? 1 : 0.2, opacity: visible ? 0.9 : 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : {
                    duration: 0.22 * scale,
                    ease: visible ? EASE.enter : EASE.exit,
                    delay: visible ? (i * T.waveBarStagger * scale) / 1000 : 0,
                  }
            }
            style={{ height: h }}
          />
        )
      })}
    </motion.div>
  )
}
