import {
  C, CAPTION, CARD, CENTRE, FAN, LEFT, LESSON, NODES, PAN, PRAISE, RAIL,
  REDUCED_SAMPLE, RIGHT, ROADMAP_GLOW, ROWS, SPRING, T, clamp01, lerp, mix,
  ROW_STROKE, panEase, railProgress, ramp, spring,
} from './timeline'
import { SPARKLES } from './sparkles'
import { P } from './paths'
import LessonCard from './components/LessonCard'
import TimelineRail from './components/TimelineRail'
import TimelineNode from './components/TimelineNode'
import LessonRow from './components/LessonRow'
import Bubble from './components/Bubble'
import Glyph, { Sparkles } from './components/Glyph'
import centreImg from './assets/tutor-centre.jpg'
import leftImg from './assets/tutor-left.jpg'
import rightImg from './assets/tutor-right.jpg'
import still from './assets/lesson-still.jpg'

/**
 * "Learn with 12+ AI tutors" — one 5000ms loop in the exports' own 370×330
 * card, five beats.
 *
 * Three structural rules:
 *
 * 1. **The centre card is one element** from beat A through beat C. The tutor
 *    tile, the roleplay card and the Introduction row are the same `<div>`
 *    with a stable key. It changes aspect ratio, size, position and contents
 *    and is never unmounted — the contents crossfade inside it. Its box is an
 *    **evaluated spring**, not a layout animation; see `spring()` in
 *    `timeline.js` for why that matters.
 *
 * 2. **The fan is one gesture.** Two siblings on one staggered move, not a
 *    sequence of steps. Frames 1 to 3 are samples of it; frame 4 is a hold.
 *
 * 3. **The scroll is a camera pan** — one `translateY` on one container. No
 *    row animates its own position.
 */
/**
 * The roadmap's warm wash is a 269×34 ellipse under a **67.7px blur**, so it
 * reaches ~200px past its own box in every direction — far wider than the
 * 370×330 frame, top and bottom. In this scene's own project that was fine and
 * intended: the frame *was* a card, the wash lifted its whole interior, and the
 * card's edge was supposed to be a line.
 *
 * On the paywall there is no card — the scene sits straight on the tier
 * gradient — so the frame's `overflow-hidden` turns that wash into a hard-edged
 * rectangle floating over the page. Feathering it top and bottom removes the
 * edge without moving or recolouring anything.
 */
const WASH_FEATHER = 'linear-gradient(180deg,transparent 0,#000 14%,#000 86%,transparent 100%)'

/**
 * A ~10px dissolve at the top and bottom of the *camera*, so the roadmap
 * scrolls out of frame instead of being sliced by it.
 *
 * The centre card carries a shadow up to 25px deep. On this scene's own black
 * ground that was invisible; on the paywall's gradient, once the card has
 * panned above the frame the only part of it still inside is that shadow —
 * which lands as a hard-edged dark band straight across the top of the
 * animation. Feathering the edge is the general fix, and it is what a
 * scrolling list should do anyway: leave the frame by dissolving, not by
 * being cut.
 */
const SCROLL_FEATHER = 'linear-gradient(180deg,transparent 0,#000 3.2%,#000 96.8%,transparent 100%)'

export default function LessonSequence({ ms, reduced, caption: showCaption = true }) {
  const t = reduced ? REDUCED_SAMPLE[Math.min(4, Math.floor(ms / 1000))] : ms

  // ── beat A ──────────────────────────────────────────────────────
  const sceneIn = reduced ? 1 : ramp(t, T.sceneIn, T.sceneInDur)
  // one gesture, staggered — the right tile leads, the left follows
  const fanR = reduced ? (t >= T.fanOut ? 1 : 0) : spring(t - T.fanOut, SPRING.fan)
  const fanL = reduced ? (t >= T.fanOut ? 1 : 0) : spring(t - T.fanOut - T.fanStagger, SPRING.fan)
  // ...and they leave outside-in, funnelling the eye back to the centre
  const goneR = reduced ? (t >= T.morph ? 1 : 0) : ramp(t, T.sideExit + T.sideExitStagger, T.sideExitDur)
  const goneL = reduced ? (t >= T.morph ? 1 : 0) : ramp(t, T.sideExit, T.sideExitDur)
  const caption = reduced
    ? t < T.morph ? 1 : 0
    : ramp(t, T.sceneIn, 420) * (1 - ramp(t, T.sideExit, 240))

  // ── beat B ──────────────────────────────────────────────────────
  const morph = reduced ? (t >= T.morph ? 1 : 0) : spring(t - T.morph, SPRING.morph)
  // The still crossfades under the chrome rather than cutting, and latches on
  // — it is what hides the tutor portrait for the rest of the cycle, so its
  // reduced-motion branch must be `t > X` and never a window.
  const stillIn = reduced ? (t >= T.morph ? 1 : 0) : ramp(t, T.stillIn, T.stillInDur)
  const tutorOut = reduced ? (t >= T.morph ? 1 : 0) : ramp(t, T.tutorOut, T.tutorOutDur)
  const chrome = reduced ? (t >= T.chromeIn && t < T.collapse ? 1 : 0) : ramp(t, T.chromeIn, T.chromeInDur)
  const shimmer = reduced ? 0 : (t - T.shimmer) / T.shimmerDur
  const sparkle = SPARKLES.map((s) =>
    reduced ? 0 : ramp(t, s.at, s.dur * 0.35) * (1 - ramp(t, s.at + s.dur * 0.5, s.dur * 0.5)),
  )

  // ── beat C ──────────────────────────────────────────────────────
  const collapse = reduced ? (t >= T.collapse ? 1 : 0) : spring(t - T.collapse, SPRING.collapse)
  const rowIn = reduced ? (t >= T.collapse ? 1 : 0) : ramp(t, T.collapseContent, T.collapseContentDur)
  /** the roleplay content clears ahead of the row content arriving */
  const stillOut = reduced ? (t >= T.collapse ? 1 : 0) : ramp(t, T.collapse, T.collapseClear)
  const rail = reduced ? (t >= T.collapse ? (t >= T.pan ? 1 : 0.31) : 0) : railProgress(t)
  const railIn = reduced ? (t >= T.collapse ? 1 : 0) : ramp(t, T.railDraw, 220)
  const row2In = reduced ? (t >= T.row2In ? 1 : 0) : ramp(t, T.row2In, T.row2InDur)

  // ── beat D ──────────────────────────────────────────────────────
  const pan = reduced ? (t >= T.pan ? 1 : 0) : panEase(clamp01((t - T.pan) / T.panDur))
  const nodeOn = (n) => {
    const node = NODES[n - 1]
    if (reduced) return t >= node.at ? 1 : 0
    return clamp01(spring(t - node.at, SPRING.node))
  }

  // ── beat E ──────────────────────────────────────────────────────
  const praiseIn = reduced ? (t >= T.praise ? 1 : 0) : ramp(t, T.praise, T.praiseDur)
  const praiseResolve = reduced ? (t >= T.praiseResolve ? 1 : 0) : ramp(t, T.praiseResolve, T.praiseResolveDur)
  const praiseSparkle = reduced ? (t >= T.praiseSparkle ? 1 : 0) : ramp(t, T.praiseSparkle, T.praiseSparkleDur)
  const praiseOpacity = lerp(0, 0.4, praiseIn) + lerp(0, 0.6, praiseResolve)
  const praiseColor = mix(C.praiseDim, C.bubbleText, praiseResolve)

  const out = reduced ? 1 : 1 - ramp(ms, T.fadeOut, T.fadeOutDur)

  // ── the centre card's box ───────────────────────────────────────
  // Two evaluated springs, chained: tutor tile → roleplay card → row 1.
  // Because they are numbers rather than layout deltas, the second can begin
  // while the first is still settling and the result reads as one move.
  const row1 = ROWS[0]
  const box = {
    x: lerp(lerp(CENTRE.x, LESSON.x, morph), row1.box.x, collapse),
    y: lerp(lerp(CENTRE.y, LESSON.y, morph), row1.box.y, collapse),
    w: lerp(lerp(CENTRE.w, LESSON.w, morph), row1.box.w, collapse),
    h: lerp(lerp(CENTRE.h, LESSON.h, morph), row1.box.h, collapse),
    r: lerp(lerp(CENTRE.r, LESSON.r, morph), 24, collapse),
  }

  // The exported x's are the *fanned* positions (frame 3); the tiles start one
  // FAN inboard of them, hidden behind the centre card, and travel out to 0.
  //
  // The exit runs the same axis backwards rather than fading in place: spread
  // goes 0 → 1 → 0, so the tiles slide back under the centre card as they go.
  // That is what makes the hand-off into the morph read as one gesture — they
  // are already retreating when the card starts to grow.
  const spreadR = fanR * (1 - goneR)
  const spreadL = fanL * (1 - goneL)
  const dxR = -FAN * (1 - spreadR)
  const dxL = FAN * (1 - spreadL)

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: CARD.w,
        height: CARD.h,
        borderRadius: CARD.r,
        backgroundColor: C.bg,
        fontFamily: 'var(--font-card)',
        opacity: out * sceneIn,
      }}
    >
      {/* ── the warm glows behind the fan ───────────────────────────
          A mirrored ellipse is still an ellipse, so the left one resolves to
          a plain −7° tilt. Figma's own blur radius is what CSS blur() takes
          too — it must not be halved. */}
      <div className="pointer-events-none absolute inset-0" style={{ opacity: 1 - stillIn }}>
        <Blob g={RIGHT.glow} dx={dxR} fill={C.glowSide} o={(1 - goneR) * fanR} />
        <Blob g={LEFT.glow} dx={dxL} fill={C.glowSideAlt} o={(1 - goneL) * fanL} />
        <Blob g={CENTRE.glow} fill={C.glowWarm} o={0.9} />
      </div>

      {/* ── the two fanning tiles ───────────────────────────────────
          Drawn in SVG because their transforms cannot be simplified: the
          right one rotates 7° about its own top-left, the left one is a
          reflection, and in both the portrait is rotated by a *different*
          angle about a *different* origin than the tile that clips it. `dx`
          is the only thing that changes between the exported frames. */}
      <svg
        viewBox={`0 0 ${CARD.w} ${CARD.h}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ opacity: 1 - stillIn }}
      >
        <defs>
          <clipPath id="tile-right">
            <rect
              x={RIGHT.clip.x + dxR} y={RIGHT.clip.y}
              width={RIGHT.clip.w} height={RIGHT.clip.h} rx={RIGHT.clip.r}
              transform={`rotate(${RIGHT.rotate} ${RIGHT.clip.x + dxR} ${RIGHT.clip.y})`}
            />
          </clipPath>
          <clipPath id="tile-left">
            <rect
              width={LEFT.clip.w} height={LEFT.clip.h} rx={LEFT.clip.r}
              transform={`matrix(${LEFT.matrix.join(' ')} ${LEFT.clipTx + dxL} ${LEFT.clipTy})`}
            />
          </clipPath>
        </defs>

        <g clipPath="url(#tile-right)" opacity={clamp01(fanR * 5) * (1 - goneR)}>
          <image
            href={rightImg} preserveAspectRatio="none"
            x={RIGHT.img.x + dxR} y={RIGHT.img.y} width={RIGHT.img.w} height={RIGHT.img.h}
            transform={`rotate(${RIGHT.img.rotate} ${RIGHT.img.ox + dxR} ${RIGHT.img.oy})`}
          />
        </g>
        <rect
          opacity={clamp01(fanR * 5) * (1 - goneR)}
          x={RIGHT.rect.x + dxR} y={RIGHT.rect.y}
          width={RIGHT.rect.w} height={RIGHT.rect.h} rx={RIGHT.rect.r}
          transform={`rotate(${RIGHT.rotate} ${RIGHT.rect.x + dxR} ${RIGHT.rect.y})`}
          fill="none" stroke={C.tutorStroke} strokeWidth={RIGHT.rect.sw}
        />

        <g clipPath="url(#tile-left)" opacity={clamp01(fanL * 5) * (1 - goneL)}>
          <image
            href={leftImg} preserveAspectRatio="none"
            x={LEFT.img.x + dxL} y={LEFT.img.y} width={LEFT.img.w} height={LEFT.img.h}
            transform={`rotate(${LEFT.img.rotate} ${LEFT.img.ox + dxL} ${LEFT.img.oy})`}
          />
        </g>
        <rect
          opacity={clamp01(fanL * 5) * (1 - goneL)}
          x={LEFT.rect.x} y={LEFT.rect.y}
          width={LEFT.rect.w} height={LEFT.rect.h} rx={LEFT.rect.r}
          transform={`matrix(${LEFT.matrix.join(' ')} ${LEFT.tx + dxL} ${LEFT.ty})`}
          fill="none" stroke={C.tutorStroke} strokeWidth={LEFT.rect.sw}
        />
      </svg>

      {/* ── the camera ──────────────────────────────────────────────
          One translateY on one container. The persistent centre card lives
          inside it, because in beat C that card *is* timeline row 1. */}
      {/* The wash is painted here rather than inside the camera so its feather
          is fixed to the frame while the wash itself still rides the pan —
          same pixels as before, minus the edge. It stays the first thing the
          camera group would have drawn, so nothing changes order. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: railIn, maskImage: WASH_FEATHER, WebkitMaskImage: WASH_FEATHER }}
      >
        <div style={{ transform: `translateY(${-PAN * pan}px)` }}>
          <Blob g={ROADMAP_GLOW} fill={C.glowWarm} o={0.45} />
        </div>
      </div>

      {/* the feather sits outside the camera so it stays put while the camera pans */}
      <div className="absolute inset-0" style={{ maskImage: SCROLL_FEATHER, WebkitMaskImage: SCROLL_FEATHER }}>
        <div className="absolute inset-0" style={{ transform: `translateY(${-PAN * pan}px)` }}>
          <div style={{ opacity: railIn }}>
            <TimelineRail progress={rail} height={RAIL.bottom + 20} />
          </div>

        {/* rows 2 and 3 never animate their own position — row 3 sits below
            the card's bottom edge until the camera brings it up */}
        {ROWS.slice(1).map((row, i) => (
          <LessonRow
            key={row.key}
            row={row}
            active={nodeOn(row.node)}
            opacity={i === 0 ? row2In : railIn}
            rise={i === 0 ? lerp(10, 0, row2In) : 0}
          />
        ))}

        {NODES.map((node) => (
          <div key={node.n} style={{ opacity: railIn }}>
            <TimelineNode node={node} active={nodeOn(node.n)} />
          </div>
        ))}

        {/* ── THE persistent centre card ─────────────────────────
            Tutor tile → roleplay card → Introduction row. One element,
            stable key, never unmounted. */}
        <div
          data-role="centre-card"
          className="absolute overflow-hidden"
          style={{
            left: box.x,
            top: box.y,
            width: box.w,
            height: box.h,
            borderRadius: box.r,
            // The card dips through its own fill between contents, and that
            // fill has to be dark when it does — over #2E2A22 a half-faded
            // portrait reads as a milky beige box rather than as a dissolve.
            backgroundColor: mix(C.tutorFill, C.bg, Math.max(tutorOut, stillOut)),
            boxShadow: `0 4px ${lerp(25, 8, collapse)}px rgba(0,0,0,0.28)`,
            transform: `scale(${lerp(0.94, 1, ramp(t, 0, 320))})`,
            zIndex: 5,
          }}
        >
          {/* row 1's squircle fill, crossfaded in under everything else so
              the rounded rect becomes the export's corner smoothing */}
          <RowSkin opacity={rowIn} />

          <img
            src={centreImg} alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: '50% 12%', opacity: 1 - tutorOut }}
          />

          <img
            src={still} alt="" className="absolute max-w-none"
            style={{
              left: LESSON.img.x * (box.w / LESSON.w),
              top: LESSON.img.y * (box.h / LESSON.h),
              width: LESSON.img.w * (box.w / LESSON.w),
              height: LESSON.img.h * (box.h / LESSON.h),
              opacity: stillIn * (1 - stillOut),
            }}
          />

          {/* Figma gates a background blur by the layer's own alpha and CSS
              does not, so the same ramp is repeated as a mask — otherwise the
              blur washes the whole still instead of just the caption area. */}
          <div
            className="absolute inset-x-0"
            style={{
              top: LESSON.scrim.y * (box.h / LESSON.h),
              height: LESSON.scrim.h * (box.h / LESSON.h),
              opacity: stillIn * (1 - stillOut) * LESSON.scrim.opacity,
              backdropFilter: `blur(${LESSON.scrim.blur}px)`,
              maskImage: `linear-gradient(to bottom, transparent ${LESSON.scrim.from * 100}%, black ${LESSON.scrim.to * 100}%)`,
              WebkitMaskImage: `linear-gradient(to bottom, transparent ${LESSON.scrim.from * 100}%, black ${LESSON.scrim.to * 100}%)`,
              background: `linear-gradient(to bottom, ${C.scrimTop} ${LESSON.scrim.from * 100}%, ${C.scrimBottom} ${LESSON.scrim.to * 100}%)`,
            }}
          />

          <LessonCard
            scale={box.w / LESSON.w}
            opacity={chrome * (1 - stillOut)}
            shimmer={shimmer}
            sparkle={sparkle}
            reduced={reduced}
          />
          <IntroContent scale={box.w / row1.box.w} opacity={rowIn} />

          {/* the tutor tile's own hairline, gone by the time it is a row */}
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              border: `${CENTRE.sw}px solid ${C.tutorStroke}`,
              borderRadius: box.r,
              opacity: 1 - tutorOut,
            }}
          />
          <RowSkin opacity={rowIn} stroke />
        </div>
        </div>
      </div>

      {/* ── beat A caption ───────────────────────────────────────
          The one prop this scene has ever taken beyond its clock, added for
          the Premium tab flow, where the page draws its own caption under the
          frame for all four slides and this one would be the same words twice.
          Defaults to `true`, so every existing consumer is unchanged. */}
      {showCaption && (
        <span
          className="absolute whitespace-nowrap text-center"
          style={{
            left: 0,
            width: CARD.w,
            top: CAPTION.y + CAPTION.h / 2,
            transform: `translateY(calc(-50% + ${lerp(7, 0, caption)}px))`,
            color: C.text,
            fontSize: CAPTION.fs,
            opacity: caption,
            zIndex: 6,
          }}
        >
          {CAPTION.text}
        </span>
      )}

      {/* ── beat E · the resolve ──────────────────────────────────
          Two stages: in at 40% with a 6px rise, then resolving to full. The
          sparkle scales in after the text, never with it. */}
      <div className="absolute inset-0" style={{ opacity: praiseOpacity, zIndex: 6 }}>
        <div className="absolute inset-0" style={{ transform: `translateY(${lerp(6, 0, praiseIn)}px)` }}>
          <Bubble
            geom={PRAISE.bubble}
            enter={praiseIn}
            color={praiseColor}
            fs={PRAISE.text.fs}
            lh={PRAISE.text.lh}
          >
            {PRAISE.lines.map((line, i) => (
              <span key={i} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </Bubble>
          <Sparkles
            x={PRAISE.sparkles.x}
            y={PRAISE.sparkles.y}
            w={PRAISE.sparkles.w * praiseSparkle}
            h={PRAISE.sparkles.h * praiseSparkle}
            fill={praiseColor}
            style={{
              opacity: praiseSparkle,
              transform: `translate(${(1 - praiseSparkle) * 11}px, ${(1 - praiseSparkle) * 11}px)`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

/** Row 1's squircle, drawn inside the persistent card so its rounded rect
 *  becomes the export's real corner smoothing without swapping elements. */
function RowSkin({ opacity, stroke }) {
  const b = ROWS[0].box
  const d = P.squircleTall.d
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`${b.x} ${b.y} ${b.w} ${b.h}`}
      preserveAspectRatio="none"
      fill="none"
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="intro-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#878787" />
        </linearGradient>
        {/* the warm stroke runs out over the top 51% of the box, as it does on
            every other row — expressed as a fraction so it survives the morph */}
        <linearGradient id="intro-stroke" x1="0" y1="0" x2="0" y2="0.511">
          <stop offset="0" stopColor="#F2DCB6" stopOpacity="0.65" />
          <stop offset="1" stopColor="#383737" />
        </linearGradient>
      </defs>
      {stroke ? (
        <path
          d={d} fill="none"
          stroke="url(#intro-stroke)" strokeWidth={ROW_STROKE} strokeOpacity={0.8}
          vectorEffect="non-scaling-stroke"
        />
      ) : (
        <>
          <path d={d} fill={C.bg} />
          <path d={d} fill="url(#intro-fill)" fillOpacity={0.05} />
        </>
      )}
    </svg>
  )
}

/** The Introduction row's contents, at the export's own coordinates and
 *  scaled to whatever the card currently is. */
function IntroContent({ scale, opacity }) {
  const row = ROWS[0]
  return (
    <div
      className="pointer-events-none absolute top-0 left-0"
      style={{ width: row.box.w, height: row.box.h, transform: `scale(${scale})`, transformOrigin: '0 0', opacity }}
    >
      <Glyph name={row.icon.name} x={row.icon.x} y={row.icon.y} w={row.icon.w} h={row.icon.h} fill={row.icon.fill} />
      <span
        className="absolute whitespace-nowrap"
        style={{
          left: row.label.x,
          top: row.label.y + row.label.h / 2,
          transform: 'translateY(-50%)',
          color: row.label.color,
          fontSize: row.label.fs,
          fontWeight: row.label.weight,
        }}
      >
        {row.title}
      </span>
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: row.cta.x,
          top: row.cta.y,
          width: row.cta.w,
          height: row.cta.h,
          borderRadius: row.cta.r,
          background: C.ctaSolid,
          color: C.ctaSolidText,
          fontSize: row.cta.fs,
        }}
      >
        Start Lesson
      </div>
    </div>
  )
}

/** A blurred ellipse in card coordinates. */
function Blob({ g, dx = 0, fill, o = 1 }) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: g.cx - g.rx + dx,
        top: g.cy - g.ry,
        width: g.rx * 2,
        height: g.ry * 2,
        borderRadius: '50%',
        background: fill,
        filter: `blur(${g.blur}px)`,
        transform: g.rot ? `rotate(${g.rot}deg)` : undefined,
        opacity: clamp01(o),
      }}
    />
  )
}
