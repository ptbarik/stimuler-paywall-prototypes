import { C, clamp01 } from '../timeline'

/**
 * The recording waveform.
 *
 * The export ships this as a raster strip, so only its box, bar colour and
 * rough density come from there — 28 bars across 134.33px, 2px wide, rounded
 * caps, in the export's `#8B72CE`.
 *
 * Each bar runs on **its own sine phase and its own rate**, seeded off the
 * index. That is the whole point: with one shared phase the field pulses in
 * unison and reads as a progress bar rather than as sound. `scaleY` is what
 * animates, never `height`, so nothing relayouts at 60fps.
 */
const BARS = 28

export default function Waveform({ ms, box, live, opacity }) {
  const gap = box.w / BARS
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: box.x, top: box.y, width: box.w, height: box.h, opacity }}
    >
      {Array.from({ length: BARS }, (_, i) => {
        // three incommensurate seeds so the field never re-synchronises
        const phase = i * 0.83 + Math.sin(i * 2.1) * 1.7
        const rate = 0.0042 + (i % 5) * 0.00055
        const env = 0.45 + 0.55 * Math.sin(i * 0.55 + 1.2) ** 2
        const a = live ? (0.5 + 0.5 * Math.sin(ms * rate + phase)) : 0.18
        const h = clamp01(0.12 + 0.88 * a * env)
        return (
          <span
            key={i}
            className="absolute"
            style={{
              left: gap * i + gap / 2 - 1,
              top: 0,
              width: 2,
              height: box.h,
              borderRadius: 1,
              background: C.waveBar,
              transform: `scaleY(${h})`,
              transformOrigin: 'center',
            }}
          />
        )
      })}
    </div>
  )
}
