import { memo } from 'react'
import { FRAME, PANELS, panelAt } from './timing'
import { CAR, headFor, pillFor } from './design'
import CallSequence from './scenes/sarah/CallSequence'
import LessonSequence from './scenes/lesson/LessonSequence'
import ConversationSequence from './scenes/conversation/ConversationSequence'
import ReportReveal from './scenes/report/ReportReveal'

/**
 * The hero: four finished 5s scenes and their captions, in the slot the design
 * left for them.
 *
 * The export has a bare **370×330 rect at (21, 218)** where the animation goes
 * — the exact frame all four scenes were built to. So they drop in at native
 * size: no scale, no re-layout, and the carousel's own timing (`./timing`) is
 * reused untouched. Everything here is still a pure function of `t`.
 *
 * Two things the carousel didn't have to do before:
 *
 * **The captions travel with the slides.** Each scene carries a headline in the
 * design, so a caption is part of its slide rather than a label above the
 * frame. It moves at 0.32 of the panel's amplitude and crossfades across the
 * middle of the transition — enough to read as attached to the thing sliding,
 * not so much that it looks like a second carousel running alongside.
 *
 * **The scenes' own backgrounds are cleared.** Three of the four paint `#0D0B10`
 * so they read as a card in their own project; here they sit directly on the
 * tier's gradient, and a near-black rectangle over that gradient is exactly the
 * card the design doesn't have. It is cleared from the stylesheet
 * (`.hero [data-panel] > * {background-color:transparent!important}`) rather
 * than by editing a scene — `src/scenes/*` stays byte-identical to its source
 * project apart from the one Sarah pill below.
 */
export default function Hero({ t, tier, reduced }) {
  return (
    <>
      <div className="caps">
        {PANELS.map((_, j) => {
          const p = panelAt(t, j)
          if (!p.render) return null
          // 0 at centre, 1 once the panel is half a frame away
          const away = Math.min(1, Math.abs(p.x) / (FRAME.w / 2))
          return (
            <p
              key={j}
              className="cap"
              style={{ transform: `translate3d(${p.x * 0.32}px,0,0)`, opacity: 1 - away }}
            >
              {headFor(j, tier).map((line, li) => (
                <span key={li} style={{ display: 'block' }}>
                  {line.map(([text, accent], k) => (accent ? <em key={k}>{text}</em> : <span key={k}>{text}</span>))}
                </span>
              ))}
            </p>
          )
        })}
      </div>

      <div
        className="hero"
        style={{ position: 'absolute', left: CAR.x, top: CAR.y, width: CAR.w, height: CAR.h, zIndex: 10, overflow: 'hidden' }}
      >
        {PANELS.map((name, j) => {
          const p = panelAt(t, j)
          const Scene = SCENES[name]
          return (
            <div
              key={name}
              data-panel={name}
              data-phase={p.phase}
              className="pointer-events-none absolute top-0 left-0"
              style={{
                width: FRAME.w,
                height: FRAME.h,
                transform: `translate3d(${p.x}px, 0, 0)`,
                willChange: 'transform',
              }}
            >
              <Scene ms={p.ms} reduced={reduced} tier={tier} />
            </div>
          )
        })}
      </div>
    </>
  )
}

/**
 * `memo` so an off-screen panel, held at ms 0, re-renders zero times — two of
 * these scenes are not cheap. Sarah is the one place the tier reaches inside a
 * scene: Pro caps calls at 40 minutes and Pro+ doesn't, and the design puts
 * that difference on the pill.
 */
const SCENES = {
  sarah: memo(function Sarah({ ms, reduced, tier }) {
    return <CallSequence ms={ms} reduced={reduced} speed={1} minutesLabel={pillFor(tier)} />
  }),
  lesson: memo(LessonSequence),
  conversation: memo(ConversationSequence),
  report: memo(ReportReveal),
}
