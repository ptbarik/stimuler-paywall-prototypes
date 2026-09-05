import { HOME, SHEET } from '../copy'
import { Cross, Flame, GrammarBox, PlayCircle, Sparkle, Swords, VideoTag } from '../Icons'
import CrownGlyph from '../components/CrownGlyph'
import NavBar from '../components/NavBar'
import lessonStill from '../scenes/lesson/assets/lesson-still.jpg'

/**
 * The roadmap — the screen the flow starts on, and the only screen with a nav
 * bar on it.
 *
 * It exists to give the two entry points somewhere to be entered from: the
 * crown in the nav, and the sheet that follows a first lesson. It is drawn to
 * `1.png` and `2.png` rather than lifted from them — those are flattened PNGs
 * with no SVG twin, so there is nothing to lift.
 *
 * The lesson thumbnail is `lesson-still.jpg`, out of the AI-tutors scene's own
 * assets: the export's card and that scene's still are the same photograph, so
 * the page and the animation four screens later are showing the same person.
 */
export default function Roadmap({ onPremium, sheetOpen, onOpenSheet, onCloseSheet, reduced, eagerSweep, sweepNow }) {
  return (
    <div className="home">
      <h1 className="greet">{HOME.greeting}</h1>
      <div className="streak">
        <Flame />
        {HOME.streak}
      </div>

      <div className="unit">
        <i />
        <span>{HOME.unit[0]}</span>
        <span className="sep">|</span>
        <span>{HOME.unit[1]}</span>
        <i />
      </div>

      <div className="rail" />
      <div className="node on">1</div>
      <div className="node off n2" />
      <div className="node off n3" />

      <div className="card">
        <img src={lessonStill} alt="" />
        <div className="fade" />
        <span className="kind">
          <PlayCircle />
          {HOME.lessonKind}
        </span>
        <p className="ttl">
          <VideoTag />
          {HOME.lessonTitle}
        </p>
        {/* the one button on the screen that fires the sheet — the sheet
            follows a *completed lesson*, never an app launch, because a sheet
            on launch is dismissed reflexively and burns the entry point */}
        <button className="go" onClick={onOpenSheet}>
          {HOME.lessonCta}
        </button>
      </div>

      <p className="hint">
        <Sparkle />
        {HOME.note}
      </p>

      <div className="locked l1">
        <Swords />
        {HOME.locked[0]}
      </div>
      <div className="locked l2">
        <GrammarBox />
        {HOME.locked[1]}
      </div>

      <NavBar
        active={0}
        onPremium={onPremium}
        blocked={sheetOpen}
        reduced={reduced}
        eager={eagerSweep}
        sweepNow={sweepNow}
      />

      {sheetOpen && (
        <>
          <button className="scrim" onClick={onCloseSheet} aria-label="Dismiss" />
          <div className="psheet" role="dialog" aria-label={SHEET.head.replace('\n', ' ')}>
            <button className="x" onClick={onCloseSheet} aria-label="Close">
              <Cross />
            </button>
            <div className="cr">
              <CrownGlyph size={34} />
            </div>
            <h2>{SHEET.head}</h2>
            {/* routes exactly as the Premium tab does — same call, so the
                window opens and the interstitial plays on the same rules */}
            <button className="go" onClick={onPremium}>
              {SHEET.cta}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
