import { C, LESSON } from '../timeline'
import { SPARKLES } from '../sparkles'
import Glyph from './Glyph'
import Shimmer from './Shimmer'
import { P } from '../paths'

/**
 * The roleplay card's chrome — everything that crossfades in on top of the
 * still once the centre card has taken its new shape.
 *
 * It is laid out at the export's own 276x236 and then scaled to whatever the
 * card currently is, so every coordinate here is the export's and none of it
 * has to be re-derived as the box grows.
 */
export default function LessonCard({ scale, opacity, shimmer, sparkle, reduced }) {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0"
      style={{
        width: LESSON.w,
        height: LESSON.h,
        transform: `scale(${scale})`,
        transformOrigin: '0 0',
        opacity,
      }}
    >
      {/* Roleplay pill */}
      <div
        className="absolute"
        style={{
          left: LESSON.pill.x,
          top: LESSON.pill.y,
          width: LESSON.pill.w,
          height: LESSON.pill.h,
          borderRadius: LESSON.pill.r,
          background: C.pillFill,
          border: `${LESSON.pill.sw}px solid ${C.pillStroke}`,
        }}
      >
        <Glyph
          name="iconPlay"
          x={LESSON.play.x - LESSON.pill.x}
          y={LESSON.play.y - LESSON.pill.y}
          stroke="#fff"
          strokeWidth={0.873565}
        />
        <span
          className="absolute whitespace-nowrap text-white"
          style={{
            left: LESSON.pillLabel.x - LESSON.pill.x,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: LESSON.pillLabel.fs,
            fontWeight: 600,
          }}
        >
          Roleplay
        </span>
      </div>

      {/* title */}
      <Glyph name="iconVideoSm" x={LESSON.icon.x} y={LESSON.icon.y} w={LESSON.icon.w} h={LESSON.icon.h} fill="#fff" />
      <span
        className="absolute whitespace-nowrap text-white"
        style={{
          left: LESSON.title.x,
          top: LESSON.title.y + LESSON.title.h / 2,
          transform: 'translateY(-50%)',
          fontSize: LESSON.title.fs,
          fontWeight: 600,
        }}
      >
        {LESSON.title.text}
      </span>

      {/* CTA — the shimmer is clipped by this element's own radius */}
      <div
        className="absolute flex items-center justify-center overflow-hidden text-white"
        style={{
          left: LESSON.cta.x,
          top: LESSON.cta.y,
          width: LESSON.cta.w,
          height: LESSON.cta.h,
          borderRadius: LESSON.cta.r,
          background: C.ctaFill,
          border: `${LESSON.cta.sw}px solid ${C.accent}`,
          fontSize: LESSON.cta.fs,
        }}
      >
        Start Lesson
        <Shimmer progress={shimmer} radius={LESSON.cta.r} reduced={reduced} />
      </div>

      {/* three sparkles around the CTA, each on its own timing so they never
          pulse in unison */}
      {SPARKLES.map((s, i) => (
        <svg
          key={s.key}
          aria-hidden
          className="absolute"
          style={{
            left: s.x,
            top: s.y,
            transform: `scale(${sparkle[i]})`,
            opacity: sparkle[i],
          }}
          width={s.size}
          height={s.size}
          viewBox={P.sp1.box.join(' ')}
          fill="none"
          overflow="visible"
        >
          <path d={P.sp1.d} stroke={C.accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  )
}
