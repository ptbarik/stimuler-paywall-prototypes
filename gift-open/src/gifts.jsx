/**
 * The three gift boxes the revised screens use, at Paper's own geometry.
 *
 * Split finely — `ears`, `knot`, `bandLid`, `bandBody`, `base`, `lid`, `mouth`
 * — because the opening needs the ribbon to come *undone* rather than simply
 * disappear: the knot lets go, the loops fall open, and then the two bands slide
 * off the box in opposite directions. None of that is possible while the ribbon
 * is baked into the same path as the box.
 *
 * `earPivot` is the knot and `lidHinge` the box's top-left corner, both already
 * rebased. `transform-box: view-box` measures transform-origin from the
 * *viewBox's* corner, not from (0,0) of the user coordinate system — so a knot
 * at user (50, 38.5) in a viewBox starting at (-8.963, 1.733) has to be written
 * as (58.963, 36.772). Wrong, and the ribbon opens around a point off the box.
 *
 * `mouthFrac` is where the open box's rim sits down the rendered square, which
 * is what the light seam and the coupon are positioned against.
 */

export const GOLD_EARS = {
  viewBox: '-8.963 1.733 117.924 117.924',
  earPivot: [58.963, 36.772],
  lidHinge: [22.963, 61.538],
  mouthFrac: 0.522,
  ears: [
    { fill: '#E0824A', d: 'M50 38.505C35.849 38.505 20.52 31.431 20.52 21.408 20.52 12.562 30.542 9.615 37.029 16.1 42.924 21.997 47.642 32.021 50 38.505Z' },
    { fill: '#D97941', d: 'M50 38.505C64.152 38.505 79.482 31.431 79.482 21.408 79.482 12.562 69.457 9.615 62.973 16.1 57.076 21.997 52.358 32.021 50 38.505Z' },
  ],
  base: (
    <>
      <path d="M7.547 63.271l84.905 0 0 40.094a8.255 8.255 0 0 1-8.253 8.253l-68.397 0a8.255 8.255 0 0 1-8.255-8.253z" fill="#D9A337" />
      <path d="M50 63.271l42.452 0 0 40.094a8.255 8.255 0 0 1-8.253 8.253l-34.199 0z" fill="#C08E27" />
    </>
  ),
  mouth: <rect x="7.547" y="63.271" width="84.905" height="7" fill="#8A6420" />,
  lid: (
    <>
      <rect x="0.473" y="37.327" width="99.056" height="25.944" rx="5" fill="#F4CE72" />
      <path d="M50 37.327l43.632 0a5.897 5.897 0 0 1 5.897 5.897l0 14.15a5.897 5.897 0 0 1-5.897 5.897l-43.632 0z" fill="#E9B94D" />
    </>
  ),
  bandBody: <rect x="41.745" y="63.271" width="16.51" height="48.35" fill="#D97941" />,
  bandLid: <rect x="41.745" y="37.327" width="16.51" height="25.944" fill="#E0824A" />,
  knot: <circle cx="50" cy="37.917" r="6.368" fill="#C4632F" />,
}

export const GOLD_TILT = {
  viewBox: '-8.888 1.808 111.267 111.267',
  earPivot: [55.559, 34.62],
  lidHinge: [15.503, 57.988],
  mouthFrac: 0.521,
  ears: [
    { fill: '#E0824A', d: 'M46.671 36.428C33.319 36.428 18.856 29.754 18.856 20.297 18.856 11.95 28.312 9.169 34.433 15.288 39.995 20.852 44.447 30.311 46.671 36.428Z' },
    { fill: '#D97941', d: 'M46.671 36.428C60.025 36.428 74.489 29.754 74.489 20.297 74.489 11.95 65.03 9.169 58.912 15.288 53.348 20.852 48.896 30.311 46.671 36.428Z' },
  ],
  base: (
    <>
      <path d="M6.615 59.796l80.112 0 0 37.831a7.789 7.789 0 0 1-7.787 7.787l-64.536 0a7.789 7.789 0 0 1-7.789-7.787z" fill="#D9A337" />
      <path d="M46.671 59.796l40.056 0 0 37.831a7.789 7.789 0 0 1-7.787 7.787l-32.269 0z" fill="#C08E27" />
    </>
  ),
  mouth: <rect x="6.615" y="59.796" width="80.112" height="6.6" fill="#8A6420" />,
  lid: (
    <>
      <rect x="-0.06" y="35.317" width="93.464" height="24.479" rx="5" fill="#F4CE72" />
      <path d="M46.671 35.317l41.169 0a5.564 5.564 0 0 1 5.564 5.564l0 13.351a5.564 5.564 0 0 1-5.564 5.564l-41.169 0z" fill="#E9B94D" />
    </>
  ),
  bandBody: <rect x="38.882" y="59.796" width="15.578" height="45.621" fill="#D97941" />,
  bandLid: <rect x="38.882" y="35.317" width="15.578" height="24.479" fill="#E0824A" />,
  knot: <circle cx="46.671" cy="35.874" r="6.009" fill="#C4632F" />,
}

/** The coupon screen's own box: cream paper, coral ribbon. */
export const CORAL_87 = {
  viewBox: '13.208 26.415 82.076 82.076',
  earPivot: [41.037, 25.444],
  lidHinge: [11.49, 42.68],
  mouthFrac: 0.52,
  ears: [
    { fill: '#D97941', d: 'M54.245 51.859C44.397 51.859 33.727 46.934 33.727 39.958 33.727 33.802 40.702 31.75 45.218 36.265 49.321 40.368 52.604 47.345 54.245 51.859Z' },
    { fill: '#D97941', d: 'M54.245 51.859C64.094 51.859 74.764 46.934 74.764 39.958 74.764 33.802 67.787 31.75 63.273 36.265 59.17 40.368 55.887 47.345 54.245 51.859Z' },
  ],
  base: (
    <>
      <path d="M24.698 69.095L83.793 69.095L83.793 97C83.793 100.173 81.221 102.745 78.048 102.745L30.443 102.745C27.27 102.745 24.698 100.173 24.698 97L24.698 69.095Z" fill="#FFE6BD" />
      <path d="M54.245 69.095h29.548v27.905a5.745 5.745 0 0 1-5.745 5.745h-23.803z" fill="#FCD490" />
    </>
  ),
  mouth: <rect x="24.698" y="69.095" width="59.095" height="5" fill="#B08A4E" />,
  lid: (
    <>
      <rect x="19.773" y="51.038" width="68.943" height="18.057" rx="5" fill="#FFF7E6" />
      <path d="M54.245 51.038h30.368a4.103 4.103 0 0 1 4.105 4.103v9.849a4.103 4.103 0 0 1-4.105 4.105h-30.368z" fill="#FFE8BA" />
    </>
  ),
  bandBody: <rect x="48.5" y="69.095" width="11.491" height="33.651" fill="#C1652D" />,
  bandLid: <rect x="48.5" y="51.038" width="11.491" height="18.057" fill="#D97941" />,
  knot: <circle cx="54.245" cy="51.448" r="4.433" fill="#C1652D" />,
}

/**
 * The gift at rest, looping.
 *
 * `idle` is `rattle` on the three upright boxes and `sway` on the tipped one,
 * whose rest position is already at an angle — it swings through the upright
 * and back instead of shaking.
 */
export function Gift({ shape, size, idle = 'rattle', ears = false, animate = true, style, wrapStyle }) {
  const pivot = { transformOrigin: `${shape.earPivot[0]}px ${shape.earPivot[1]}px` }
  return (
    <span style={{ position: 'absolute', width: size, height: size, ...wrapStyle }}>
      <span className={animate ? (idle === 'sway' ? 'gift-sway' : 'gift-rattle') : undefined}
            style={{ display: 'block', width: size, height: size, ...style }}>
        <svg viewBox={shape.viewBox} width={size} height={size} xmlns="http://www.w3.org/2000/svg"
             style={{ overflow: 'visible', display: 'block' }}>
          <path d={shape.ears[0].d} fill={shape.ears[0].fill} className={animate && ears ? 'ear-l' : undefined} style={pivot} />
          <path d={shape.ears[1].d} fill={shape.ears[1].fill} className={animate && ears ? 'ear-r' : undefined} style={pivot} />
          {shape.base}
          {shape.lid}
          {shape.bandBody}
          {shape.bandLid}
          {shape.knot}
        </svg>
      </span>
    </span>
  )
}
