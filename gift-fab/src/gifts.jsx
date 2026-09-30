/**
 * The three gift boxes the revised sheet uses, at the exact geometry Paper
 * exports them — same viewBoxes, same paths, same fills.
 *
 * Each one is split into `ears` and `body` for one reason: on the variants
 * where the box breaks the top edge of the pill, the two ribbon loops swing
 * on their own after the box has stopped. That only works if they are
 * separate elements with a pivot at the knot.
 *
 * `pivot` is that knot, already rebased. `transform-box: view-box` measures
 * transform-origin from the *viewBox's* top-left corner, not from (0,0) of
 * the user coordinate system — so a knot at user (50, 38.5) inside a viewBox
 * starting at (-8.963, 1.733) has to be written as (58.963, 36.772). Getting
 * this wrong swings the ribbons around a point somewhere off the box.
 */

function Ears({ shape, animate }) {
  const [l, r] = shape.ears
  const style = { transformOrigin: `${shape.pivot[0]}px ${shape.pivot[1]}px` }
  return (
    <>
      <path d={l.d} fill={l.fill} className={animate ? 'ear-l' : undefined} style={style} />
      <path d={r.d} fill={r.fill} className={animate ? 'ear-r' : undefined} style={style} />
    </>
  )
}

/**
 * @param shape   one of the four below
 * @param size    rendered px (the sheet overrides the intrinsic size on most)
 * @param ears    swing the ribbons independently — pop-out variants only
 * @param animate rattle at all
 */
export function Gift({ shape, size, ears = false, animate = true, style, wrapStyle }) {
  return (
    <span style={{ position: 'absolute', width: size, height: size, ...wrapStyle }}>
      <span className={animate ? 'gift-rattle' : undefined}
            style={{ display: 'block', width: size, height: size, ...style }}>
        <svg viewBox={shape.viewBox} width={size} height={size} xmlns="http://www.w3.org/2000/svg"
             style={{ overflow: 'visible', display: 'block' }}>
          <Ears shape={shape} animate={animate && ears} />
          {shape.body}
        </svg>
      </span>
    </span>
  )
}

/* ── gold, long ribbons ─── FABs 4, 5, 7 ───────────────────────── */
export const GOLD_EARS = {
  viewBox: '-8.963 1.733 117.924 117.924',
  pivot: [58.963, 36.772],
  ears: [
    { fill: '#E0824A', d: 'M50 38.505C35.849 38.505 20.52 31.431 20.52 21.408 20.52 12.562 30.542 9.615 37.029 16.1 42.924 21.997 47.642 32.021 50 38.505Z' },
    { fill: '#D97941', d: 'M50 38.505C64.152 38.505 79.482 31.431 79.482 21.408 79.482 12.562 69.457 9.615 62.973 16.1 57.076 21.997 52.358 32.021 50 38.505Z' },
  ],
  body: (
    <>
      <path d="M7.547 63.271l84.905 0 0 40.094a8.255 8.255 0 0 1-8.253 8.253l-68.397 0a8.255 8.255 0 0 1-8.255-8.253z" fill="#D9A337" />
      <path d="M50 63.271l42.452 0 0 40.094a8.255 8.255 0 0 1-8.253 8.253l-34.199 0z" fill="#C08E27" />
      <rect x="0.473" y="37.327" width="99.056" height="25.944" rx="5" fill="#F4CE72" />
      <path d="M50 37.327l43.632 0a5.897 5.897 0 0 1 5.897 5.897l0 14.15a5.897 5.897 0 0 1-5.897 5.897l-43.632 0z" fill="#E9B94D" />
      <rect x="41.745" y="63.271" width="16.51" height="48.35" fill="#D97941" />
      <rect x="41.745" y="37.327" width="16.51" height="25.944" fill="#E0824A" />
      <circle cx="50" cy="37.917" r="6.368" fill="#C4632F" />
    </>
  ),
}

/* ── gold, the tilted sticker's own draw ─── FAB 6 ─────────────── */
export const GOLD_TILT = {
  viewBox: '-8.888 1.808 111.267 111.267',
  pivot: [55.559, 34.62],
  ears: [
    { fill: '#E0824A', d: 'M46.671 36.428C33.319 36.428 18.856 29.754 18.856 20.297 18.856 11.95 28.312 9.169 34.433 15.288 39.995 20.852 44.447 30.311 46.671 36.428Z' },
    { fill: '#D97941', d: 'M46.671 36.428C60.025 36.428 74.489 29.754 74.489 20.297 74.489 11.95 65.03 9.169 58.912 15.288 53.348 20.852 48.896 30.311 46.671 36.428Z' },
  ],
  body: (
    <>
      <path d="M6.615 59.796l80.112 0 0 37.831a7.789 7.789 0 0 1-7.787 7.787l-64.536 0a7.789 7.789 0 0 1-7.789-7.787z" fill="#D9A337" />
      <path d="M46.671 59.796l40.056 0 0 37.831a7.789 7.789 0 0 1-7.787 7.787l-32.269 0z" fill="#C08E27" />
      <rect x="-0.06" y="35.317" width="93.464" height="24.479" rx="5" fill="#F4CE72" />
      <path d="M46.671 35.317l41.169 0a5.564 5.564 0 0 1 5.564 5.564l0 13.351a5.564 5.564 0 0 1-5.564 5.564l-41.169 0z" fill="#E9B94D" />
      <rect x="38.882" y="59.796" width="15.578" height="45.621" fill="#D97941" />
      <rect x="38.882" y="35.317" width="15.578" height="24.479" fill="#E0824A" />
      <circle cx="46.671" cy="35.874" r="6.009" fill="#C4632F" />
    </>
  ),
}

/* ── gold, the short bow ─── FAB 2 ─────────────────────────────── */
export const GOLD_BOW = {
  viewBox: '0 0 100 100',
  pivot: [50, 31],
  ears: [
    { fill: '#E0824A', d: 'M50 31 C 38 31, 25 25, 25 16.5 C 25 9, 33.5 6.5, 39 12 C 44 17, 48 25.5, 50 31 Z' },
    { fill: '#D97941', d: 'M50 31 C 62 31, 75 25, 75 16.5 C 75 9, 66.5 6.5, 61 12 C 56 17, 52 25.5, 50 31 Z' },
  ],
  body: (
    <>
      <path d="M14 52 h72 v34 a7 7 0 0 1 -7 7 h-58 a7 7 0 0 1 -7 -7 z" fill="#D9A337" />
      <path d="M50 52 h36 v34 a7 7 0 0 1 -7 7 h-29 z" fill="#C08E27" />
      <rect x="8" y="30" width="84" height="22" rx="5" fill="#F4CE72" />
      <path d="M50 30 h37 a5 5 0 0 1 5 5 v12 a5 5 0 0 1 -5 5 h-37 z" fill="#E9B94D" />
      <rect x="43" y="52" width="14" height="41" fill="#D97941" />
      <rect x="43" y="30" width="14" height="22" fill="#E0824A" />
      <circle cx="50" cy="30.5" r="5.4" fill="#C4632F" />
    </>
  ),
}

/* ── cream box, blue ribbon ─── FAB 1 (87px draw) ──────────────── */
export const BLUE_87 = {
  viewBox: '13.208 26.415 82.076 82.076',
  pivot: [41.037, 25.444],
  ears: [
    { fill: '#89A8FF', d: 'M54.245 51.859C44.397 51.859 33.727 46.934 33.727 39.958 33.727 33.802 40.702 31.75 45.218 36.265 49.321 40.368 52.604 47.345 54.245 51.859Z' },
    { fill: '#89A8FF', d: 'M54.245 51.859C64.094 51.859 74.764 46.934 74.764 39.958 74.764 33.802 67.787 31.75 63.273 36.265 59.17 40.368 55.887 47.345 54.245 51.859Z' },
  ],
  body: (
    <>
      <path d="M24.698 69.095L83.793 69.095L83.793 97C83.793 100.173 81.221 102.745 78.048 102.745L30.443 102.745C27.27 102.745 24.698 100.173 24.698 97L24.698 69.095Z" fill="#FFE6BD" />
      <path d="M54.245 69.095h29.548v27.905a5.745 5.745 0 0 1-5.745 5.745h-23.803z" fill="#FCD490" />
      <rect x="19.773" y="51.038" width="68.943" height="18.057" rx="5" fill="#FFF7E6" />
      <path d="M54.245 51.038h30.368a4.103 4.103 0 0 1 4.105 4.103v9.849a4.103 4.103 0 0 1-4.105 4.105h-30.368z" fill="#FFE8BA" />
      <rect x="48.5" y="69.095" width="11.491" height="33.651" fill="#5C7EF0" />
      <rect x="48.5" y="51.038" width="11.491" height="18.057" fill="#89A8FF" />
      <circle cx="54.245" cy="51.448" r="4.433" fill="#5C7EF0" />
    </>
  ),
}

/* ── cream box, blue ribbon ─── FABs 3 and 8 (80px draw) ───────── */
export const BLUE_80 = {
  viewBox: '16.51 33.019 75.472 75.472',
  pivot: [37.735, 23.396],
  ears: [
    { fill: '#89A8FF', d: 'M54.245 56.415C45.189 56.415 35.378 51.887 35.378 45.472 35.378 39.811 41.792 37.924 45.944 42.076 49.717 45.849 52.736 52.265 54.245 56.415Z' },
    { fill: '#89A8FF', d: 'M54.245 56.415C63.302 56.415 73.113 51.887 73.113 45.472 73.113 39.811 66.697 37.924 62.547 42.076 58.774 45.849 55.755 52.265 54.245 56.415Z' },
  ],
  body: (
    <>
      <path d="M27.075 72.265L81.416 72.265L81.416 97.924C81.416 100.842 79.051 103.207 76.133 103.207L32.358 103.207C29.44 103.207 27.075 100.842 27.075 97.924L27.075 72.265Z" fill="#FFDC9F" />
      <path d="M54.245 72.265h27.171v25.659a5.283 5.283 0 0 1-5.283 5.283h-21.888z" fill="#F3C87D" />
      <rect x="22.547" y="55.66" width="63.396" height="16.604" rx="5" fill="#FFF7E6" />
      <path d="M54.245 55.66h27.925a3.773 3.773 0 0 1 3.774 3.773v9.057a3.773 3.773 0 0 1-3.774 3.775h-27.925z" fill="#FFE8BA" />
      <rect x="48.962" y="72.265" width="10.566" height="30.943" fill="#5C7EF0" />
      <rect x="48.962" y="55.66" width="10.566" height="16.604" fill="#89A8FF" />
      <circle cx="54.245" cy="56.037" r="4.076" fill="#5C7EF0" />
    </>
  ),
}
