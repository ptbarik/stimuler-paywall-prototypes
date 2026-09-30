import { useEffect, useMemo, useState } from 'react'

/**
 * Figma's Glass material, rebuilt in the browser.
 *
 * Figma's panel gives five numbers and a light. CSS has one of them —
 * `backdrop-filter: blur()` is Frost, and nothing else. Refraction, Depth,
 * Dispersion and Splay are all *displacement* of what is behind the pane, and
 * the only way to displace a backdrop in a browser is an SVG filter referenced
 * from `backdrop-filter`, which Chrome supports and Safari does not.
 *
 * So the pane carries a generated normal map — a canvas where the red channel
 * is how far to push each sample sideways and the green channel how far to push
 * it down — and three `feDisplacementMap` passes read it at three slightly
 * different strengths, one per colour channel. That last part is Dispersion:
 * glass bends red less than blue, and at the rim of a real lens you can see the
 * two come apart.
 *
 *   Refraction  how hard the rim bends what is behind it
 *   Depth       how far in from the edge the bending reaches
 *   Dispersion  how far apart the three channels are pushed
 *   Frost       the blur, the one part CSS already had
 *   Splay       how sharply the bend falls off — 0 keeps it at the rim,
 *               higher spreads it toward the middle
 *
 * The map is regenerated whenever a number changes, which is cheap: it is one
 * pass over ~95,000 pixels and it only runs on release of a slider.
 */

/** Signed distance to a rounded rectangle. Negative inside. */
function sdRoundRect(px, py, hw, hh, r) {
  const qx = Math.abs(px) - (hw - r)
  const qy = Math.abs(py) - (hh - r)
  const ax = Math.max(qx, 0)
  const ay = Math.max(qy, 0)
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(ax, ay) - r
}

/**
 * The normal map.
 *
 * Neutral grey is "leave this pixel alone". Toward the rim each pixel is pushed
 * along the *outward* normal, so the pane samples from beyond its own edge and
 * the content there stretches — which is what the edge of a real lens does, and
 * the reason a glass panel on Apple's platforms looks like an object rather
 * than a blurred rectangle.
 */
export function buildMap({ w, h, radius, refraction, depth, splay }) {
  const c = document.createElement('canvas')
  c.width = Math.max(1, Math.round(w))
  c.height = Math.max(1, Math.round(h))
  const ctx = c.getContext('2d', { willReadFrequently: false })
  const img = ctx.createImageData(c.width, c.height)
  const d = img.data

  const hw = c.width / 2
  const hh = c.height / 2
  const r = Math.min(radius, hw, hh)
  /* Depth is one of Figma's 0-100 dials, not a pixel count; at 63 this puts
     the bend in the outer ~28px, which is where a real bevel lives */
  const reach = Math.max(1, depth * 0.45)
  /* splay 0 keeps the bend hard against the rim; 1 spreads it inward */
  const falloff = 1.9 - splay * 1.25
  const e = 1 // sample step for the numeric gradient

  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      const px = x + 0.5 - hw
      const py = y + 0.5 - hh
      const sd = sdRoundRect(px, py, hw, hh, r)

      let R = 128, G = 128
      if (sd < 0) {
        const dist = -sd
        let t = dist < reach ? 1 - dist / reach : 0
        if (t > 0) {
          t = Math.pow(t, falloff)
          /* outward normal, by central difference on the field */
          const gx = sdRoundRect(px + e, py, hw, hh, r) - sdRoundRect(px - e, py, hw, hh, r)
          const gy = sdRoundRect(px, py + e, hw, hh, r) - sdRoundRect(px, py - e, hw, hh, r)
          const len = Math.hypot(gx, gy) || 1
          const amt = t * refraction
          R = 128 + (gx / len) * amt * 127
          G = 128 + (gy / len) * amt * 127
        }
      }
      const i = (y * c.width + x) * 4
      d[i] = R
      d[i + 1] = G
      d[i + 2] = 128
      d[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return c.toDataURL()
}

/** Chrome takes `url()` in backdrop-filter; Safari and Firefox do not. */
export const SUPPORTS_BACKDROP_URL =
  typeof CSS !== 'undefined' && CSS.supports && CSS.supports('backdrop-filter', 'url(#a)')

export function useGlassMap({ w, h, radius, refraction, depth, splay }) {
  const [map, setMap] = useState(null)
  useEffect(() => {
    let live = true
    const id = requestAnimationFrame(() => {
      const url = buildMap({ w, h, radius, refraction, depth, splay })
      if (live) setMap(url)
    })
    return () => { live = false; cancelAnimationFrame(id) }
  }, [w, h, radius, refraction, depth, splay])
  return map
}

/**
 * The filter itself.
 *
 * `scale` on feDisplacementMap is in user units and the map's extremes are
 * ±127/255, so a scale of `depth * 2` gives a maximum push of about `depth`
 * pixels — which is what makes the Depth slider read in the units its label
 * implies rather than in some arbitrary strength.
 */
export function GlassFilter({ id, w, h, map, depth, dispersion, frost }) {
  /* the map's extremes are ±127/255, so this puts the hardest push at the rim
     at roughly `depth * 0.55` px — strong enough to read as a lens, short of
     the smear you get when the edge samples from halfway across the panel */
  const scale = depth * 1.1
  const spread = dispersion * 0.16
  const sR = scale * (1 + spread)
  const sG = scale
  const sB = scale * (1 - spread)
  const only = (c) => {
    const rows = { r: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
                   g: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
                   b: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0' }
    return rows[c]
  }
  if (!map) return null
  return (
    <svg aria-hidden width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
      <filter id={id} filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse"
              x="0" y="0" width={w} height={h} colorInterpolationFilters="sRGB">
        <feImage href={map} x="0" y="0" width={w} height={h} preserveAspectRatio="none" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale={sR} xChannelSelector="R" yChannelSelector="G" result="dR" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale={sG} xChannelSelector="R" yChannelSelector="G" result="dG" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale={sB} xChannelSelector="R" yChannelSelector="G" result="dB" />
        <feColorMatrix in="dR" type="matrix" values={only('r')} result="cR" />
        <feColorMatrix in="dG" type="matrix" values={only('g')} result="cG" />
        <feColorMatrix in="dB" type="matrix" values={only('b')} result="cB" />
        <feBlend in="cR" in2="cG" mode="screen" result="rg" />
        <feBlend in="rg" in2="cB" mode="screen" result="rgb" />
        <feGaussianBlur in="rgb" stdDeviation={frost} />
      </filter>
    </svg>
  )
}

/**
 * The rim light.
 *
 * Figma's Light is an angle and an intensity, and what it actually does is put
 * a specular edge on the side the light comes from and a weaker bounce on the
 * far side. Drawn as a stroke on the pane's own outline with a gradient across
 * it, rather than as a box-shadow, so it follows the rounded corners exactly.
 */
export function RimLight({ w, h, radius, angle, intensity, width = 1.5, topOnly }) {
  /* Figma's angle is clockwise from straight up. The lit edge is the one the
     light points at, so stop 0 goes there and the weak bounce lands opposite. */
  const a = (angle * Math.PI) / 180
  const dx = Math.sin(a)
  const dy = -Math.cos(a)
  const x1 = 0.5 + dx * 0.5
  const y1 = 0.5 + dy * 0.5
  const x2 = 0.5 - dx * 0.5
  const y2 = 0.5 - dy * 0.5
  const id = useMemo(() => `rim${Math.random().toString(36).slice(2, 8)}`, [])
  const near = Math.min(1, intensity)
  const far = near * 0.38
  const inset = width / 2
  return (
    <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0" stopColor="#fff" stopOpacity={near} />
          <stop offset="0.3" stopColor="#fff" stopOpacity={near * 0.12} />
          <stop offset="0.68" stopColor="#fff" stopOpacity={far * 0.25} />
          <stop offset="1" stopColor="#fff" stopOpacity={far} />
        </linearGradient>
      </defs>
      {topOnly ? (
        <path d={`M${inset} ${h} V${radius + inset} A${radius} ${radius} 0 0 1 ${radius + inset} ${inset} H${w - radius - inset} A${radius} ${radius} 0 0 1 ${w - inset} ${radius + inset} V${h}`}
              fill="none" stroke={`url(#${id})`} strokeWidth={width} />
      ) : (
        <rect x={inset} y={inset} width={w - width} height={h - width} rx={radius - inset}
              fill="none" stroke={`url(#${id})`} strokeWidth={width} />
      )}
    </svg>
  )
}
