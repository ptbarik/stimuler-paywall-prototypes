import { memo } from 'react'
import { FRAME, PANELS, panelAt } from '../carousel.timing'
import CallSequence from '../scenes/sarah/CallSequence'
import LessonSequence from '../scenes/lesson/LessonSequence'
import ConversationSequence from '../scenes/conversation/ConversationSequence'
import ReportReveal from '../scenes/report/ReportReveal'

/**
 * Four scenes, one loop — the consolidated carousel, dropped into the slot
 * `7.png` leaves for it.
 *
 * `src/scenes/*` is each animation project's own source and
 * `carousel.timing.js` is the consolidated build's timing file, both vendored
 * across. Each panel is handed a local clock and asked to render; that is the
 * whole reason this was cheap — all four scenes are 370×330, all four run
 * 5000ms, and every one of them is a pure function of its own `ms`.
 *
 * ── Two changes from the standalone carousel ──────────────────────
 *
 * **It does not paint its own background.** There it painted `#0D0B10` so the
 * four panels tiled against an unbroken surface; here the surface is the
 * paywall's warm `#130800` and the glow above it, and a `#0D0B10` card sitting
 * on that reads as a hole punched in the light. The scenes' own root
 * backgrounds are cleared by `.hero > *` in the stylesheet rather than by
 * editing vendored files.
 *
 * **The lesson scene's built-in caption is switched off.** It is the only one
 * of the four carrying its own headline — the roadmap paywall depends on
 * exactly that — but this page draws a caption under the frame for every
 * slide, so leaving it on renders the same seven words twice, 200px apart.
 * This is the one line edited in any vendored scene: a prop defaulting to
 * `true`, so no other consumer of that file changes behaviour.
 *
 * **Nothing unmounts.** All four are mounted from frame 0 and moved with
 * `translate3d`. Off-screen panels are held at `ms: 0` and wrapped in `memo`,
 * so they cost one render each and then nothing until their turn — which
 * matters, because two of these scenes are not cheap. It also means a panel
 * never mounts mid-slide, so no scene ever plays its entrance twice.
 */
export default function Carousel({ t, reduced }) {
  return (
    <div style={{ position: 'relative', width: FRAME.w, height: FRAME.h, overflow: 'hidden' }}>
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

/** `memo` so an off-screen panel, held at ms 0, re-renders zero times. */
const SCENES = {
  sarah: memo(function Sarah({ ms, reduced }) {
    return <CallSequence ms={ms} reduced={reduced} speed={1} />
  }),
  /* the lesson scene draws its own "Learn with 12+ AI tutors" inside the
     frame. This page draws a caption under the frame for all four slides, so
     that one is switched off rather than shown twice — the scene's only prop
     beyond its clock, and it defaults to on. */
  lesson: memo(function Lesson({ ms, reduced }) {
    return <LessonSequence ms={ms} reduced={reduced} caption={false} />
  }),
  conversation: memo(ConversationSequence),
  report: memo(ReportReveal),
}
