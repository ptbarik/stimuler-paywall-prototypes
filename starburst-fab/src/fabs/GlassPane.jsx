import { useId } from 'react'
import { GlassFilter, RimLight, SUPPORTS_BACKDROP_URL, useGlassMap } from './Glass.jsx'

/**
 * One pane of the `glass-card` material, sized to a tab.
 *
 * The parts are that prototype's, unchanged — a generated normal map read by
 * three `feDisplacementMap` passes through `backdrop-filter: url()`. What is
 * different here is what sits behind it. `glass-card` put the pane over a
 * photograph; this puts it over the Learn screen's roadmap, which is dark grey
 * rows on near-black, and a lens with nothing to bend reads as a smudge.
 *
 * So two things are dialled against the original:
 *
 * **Depth is lower.** 44 rather than 63. The deeper the bend reaches, the more
 * of the pane is made of edge-clamped samples, and over dark content that is
 * just a grey wash. Keeping it at the rim is what makes the pane look like it
 * has a thickness.
 *
 * **The rim light is brighter and the fill is warmer.** On the paywall the
 * glass had colour to borrow; here it has to supply its own, so the gold is in
 * the pane rather than behind it.
 *
 * `backdrop-filter: url()` is a Chrome feature. Everywhere else falls back to
 * `blur() saturate()` — frost without refraction — detected rather than sniffed.
 */

const GLASS = { refraction: 100, depth: 44, dispersion: 50, frost: 20, splay: 0 }

export default function GlassPane({
  w, h, radius, tint = 'rgba(255,255,255,.10)', light = -45, intensity = 62, children,
}) {
  const uid = useId().replace(/:/g, '')
  const map = useGlassMap({
    w, h, radius,
    refraction: GLASS.refraction / 100, depth: Math.max(1, GLASS.depth), splay: GLASS.splay / 100,
  })
  const live = SUPPORTS_BACKDROP_URL && map
  const backdropFilter = live ? `url(#${uid})` : `blur(${GLASS.frost * 0.2}px) saturate(1.4)`

  return (
    <>
      {live && (
        <GlassFilter id={uid} w={w} h={h} map={map}
                     depth={GLASS.depth} dispersion={GLASS.dispersion / 100} frost={GLASS.frost * 0.2} />
      )}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: radius, overflow: 'clip',
        backdropFilter, WebkitBackdropFilter: backdropFilter,
        background: `linear-gradient(170deg, ${tint} 0%, rgba(255,255,255,.035) 100%)`,
      }} />
      {/* the pane's own edge. On the paywall the glass had colour to borrow
          from behind it; over the roadmap it has to bring its own. */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: radius,
        border: '1px solid rgba(255,255,255,.13)', boxSizing: 'border-box', pointerEvents: 'none',
      }} />
      <RimLight w={w} h={h} radius={radius} angle={light} intensity={intensity / 100} width={1.5} />
      {children}
    </>
  )
}
