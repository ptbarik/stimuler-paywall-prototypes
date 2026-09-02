import { C, lerp } from '../timeline'
import { outlinePath } from '../bubblePath'

/**
 * The tutor's text bubble — the **same bubble as the Calls-with-Sarah card**.
 *
 * Fill `#161616` and radius 15.15 are sampled off that export, and the tail is
 * its path verbatim: an asymmetric flag with a rounded tip on the top edge,
 * not a centred triangle.
 *
 * Body and tail are **one welded path**, which is how the exports draw it.
 * Hanging the tail off a rounded `<div>` as a separate shape seams at the
 * join — the body's own edge runs across the mouth of the tail, and an
 * absolutely positioned child sits inside the padding box, so the tail starts
 * a fraction clear of it. One path, filled once, cannot do either.
 *
 * `enter` is a 0-1 ramp rather than a transition, because everything on these
 * cards is a pure function of the clock — scrubbing to any ms has to render
 * exactly the same frame.
 */
export default function Bubble({ geom, enter, color, fs, lh, children }) {
  return (
    <div
      className="absolute flex flex-col justify-center"
      style={{
        left: geom.x,
        top: geom.y,
        width: geom.w,
        height: geom.h,
        paddingLeft: geom.padX,
        paddingRight: geom.padX,
        color,
        fontSize: fs,
        lineHeight: lh,
        transformOrigin: geom.origin,
        transform: `scale(${lerp(0.92, 1, enter)}) translateX(${lerp(-8, 0, enter)}px)`,
        opacity: enter,
      }}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${geom.w} ${geom.h}`}
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <path d={outlinePath(geom)} fill={C.bubble} stroke={C.bubbleStroke} strokeWidth={0.7576} />
      </svg>
      <div className="relative">{children}</div>
    </div>
  )
}
