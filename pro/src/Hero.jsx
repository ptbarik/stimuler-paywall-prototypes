import { memo } from 'react'
import { FRAME, PANELS, panelAt } from './timing'
import CallSequence from './scenes/sarah/CallSequence'
import LessonSequence from './scenes/lesson/LessonSequence'
import ConversationSequence from './scenes/conversation/ConversationSequence'
import ReportReveal from './scenes/report/ReportReveal'

/**
 * The hero.
 *
 * The export leaves `Calls with sarah feature` as a bare **370×330** rect —
 * the exact frame all four finished scenes were built to, months apart, in
 * four separate projects. They drop in at native size: no scale, no
 * re-layout, and `./timing` (the carousel from the Pro/Pro+ prototypes) is
 * reused untouched. Everything here is still a pure function of `t`.
 *
 * Two differences from where this came from:
 *
 * **No captions.** The earlier page put a headline per slide above the frame.
 * This design has one headline for the whole page, in gold above the hero, so
 * a second changing line under it would be two headlines arguing.
 *
 * **The scenes' own backgrounds are cleared.** Three of the four paint
 * `#0D0B10` so they read as a card in their own project; here they sit
 * directly on the page's gradient, and a near-black rectangle over that
 * gradient is exactly the card this design doesn't have. It is cleared from
 * the stylesheet, not by editing a scene — `src/scenes/*` stays as it shipped.
 */
export default function Hero({ t, reduced }) {
  return (
    <div className="hero">
      {PANELS.map((name, j) => {
        const p = panelAt(t, j)
        const Scene = SCENES[name]
        return (
          <div
            key={name}
            data-panel={name}
            data-phase={p.phase}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: FRAME.w,
              height: FRAME.h,
              pointerEvents: 'none',
              transform: `translate3d(${p.x}px, 0, 0)`,
              willChange: 'transform',
            }}
          >
            <Scene ms={p.ms} reduced={reduced} />
          </div>
        )
      })}
    </div>
  )
}

/**
 * `memo` so an off-screen panel, held at ms 0, re-renders zero times — two of
 * these scenes are not cheap.
 *
 * Sarah's pill is pinned to `40 Minutes`, which is what this page's design
 * draws inside the frame and what the India plan actually sells.
 */
const SCENES = {
  sarah: memo(function Sarah({ ms, reduced }) {
    return <CallSequence ms={ms} reduced={reduced} speed={1} minutesLabel="40 Minutes" />
  }),
  lesson: memo(LessonSequence),
  conversation: memo(ConversationSequence),
  report: memo(ReportReveal),
}
