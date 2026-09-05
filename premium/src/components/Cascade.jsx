import { Fragment } from 'react'
import { CASCADE } from '../design'
import { clamp, easeCascade, easeOut } from '../ease'

/**
 * A line of words that assembles itself.
 *
 * Each word clears `opacity 0 → 1`, `blur(4px) → 0` and `translateY(10px) → 0`
 * over 740ms, 55ms after the one before it. Leaving is 500ms, 16ms apart,
 * drifting *up*: tight enough that the line goes as one object instead of
 * un-cascading itself back out word by word, which would read as a rewind.
 *
 * ── Why the blur is doing the work ────────────────────────────────
 *
 * A word that only fades is a word that was always there at a lower opacity. A
 * word that only rises is a word that slid in from somewhere. Defocused and
 * *then* resolving is the one combination that reads as the word coming into
 * being — which is what makes this a reveal rather than an entrance, and why
 * it belongs on a line emerging out of a screenful of falling crowns.
 *
 * ── Why it is computed rather than animated ───────────────────────
 *
 * The reference does this with `@keyframes` and a per-word `animation-delay`,
 * which is right there and wrong here: a running CSS animation cannot be asked
 * what it looks like at 2400ms. Everything on this screen is a pure function
 * of one clock so the panel can scrub it, so the same curve is evaluated
 * directly instead. Same numbers, same result, and the scrubber stays honest.
 */
export default function Cascade({ words, ms, from, out, className, style }) {
  const { in: I, out: O } = CASCADE

  return (
    <p className={className} style={style}>
      {words.map((w, i) => {
        // in: staggered forwards. out: staggered too, but four times tighter
        const pIn = easeCascade(clamp((ms - from - i * I.stagger) / I.dur))
        const pOut = out === null ? 0 : easeOut(clamp((ms - out - i * O.stagger) / O.dur))

        const p = pIn * (1 - pOut)
        const y = I.rise * (1 - pIn) + O.rise * pOut
        const blur = I.blur * (1 - pIn) + O.blur * pOut

        return (
          <Fragment key={`${w.text}-${i}`}>
            <span
              className={`w${w.em ? ' em' : ''}`}
              style={{
                opacity: p,
                transform: `translateY(${y}px)`,
                filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
              }}
            >
              {w.text}
            </span>
            {/* the break is a sibling, not a child: a `<br>` inside an
                inline-block breaks *inside* the word's own box and makes it two
                lines tall */}
            {w.br ? <br /> : ' '}
          </Fragment>
        )
      })}
    </p>
  )
}

/**
 * `Your path to {confident English} starts here.` → words, with the braced
 * ones accented.
 *
 * The reference builds its spans from a plain string with `{}` marking the
 * accent, so a translation is a straight swap and nothing has to reach inside
 * the markup. Same here — `copy.js` stays readable strings, and `\n` is a hard
 * break rather than a word.
 */
export function words(str) {
  const out = []
  for (const chunk of str.split('\n')) {
    const parts = chunk.split(/(\{[^}]*\})/).filter(Boolean)
    for (const part of parts) {
      const em = part.startsWith('{')
      const text = em ? part.slice(1, -1) : part
      for (const w of text.split(' ').filter(Boolean)) out.push({ text: w, em })
    }
    if (out.length) out[out.length - 1].br = true
  }
  if (out.length) delete out[out.length - 1].br
  return out
}
