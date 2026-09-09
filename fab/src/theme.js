/**
 * The two tiers, as colour.
 *
 * Every value below is a fill attribute lifted out of the two Figma CSS
 * exports — `PRO` (412×2469) and `PRO+` (412×2468) — not sampled off the PNGs.
 * The exports are the same frame twice, so the two objects have the same shape
 * key-for-key and the paywall can be written once and dressed twice: nothing in
 * `components/` knows which tier it is rendering, it only reads `t.*`.
 *
 * The one thing that is *not* a straight copy is `starA` / `starB` / `spark`,
 * which the coupon has no need for. Those are V2's, and the note is on
 * `StarburstOffer.jsx`.
 */

/* ── Stimuler PRO — indigo ──────────────────────────────────────── */
export const PRO = {
  id: 'pro',
  label: 'Stimuler Pro',
  cta: 'Get Stimuler PRO',
  wordmark: 'PRO',

  /* the frame's own fill, and the three blurred plates over it */
  page: 'linear-gradient(180deg,#16122A 0%,#120F22 60.1%,#0D0B16 100%)',
  /* the page's own top stop, for the pinned header's wash */
  scrim: 'rgba(22,18,42,.92)',
  glow: [
    { w: 517, h: 231, x: -19, y: 28, fill: 'rgba(59,54,140,.35)', blur: 145 },
    { w: 336, h: 231, x: 263, y: 145, fill: 'rgba(59,54,140,.12)', blur: 48, blend: 'plus-lighter' },
    { w: 303, h: 139, x: 286, y: -10, fill: '#3B368C', blur: 97, blend: 'plus-lighter', rot: -29.71 },
  ],

  /* the tier switch: #0E0B2D at .77, with the live half on a 3-stop sweep */
  track: '#0E0B2D',
  knob: 'linear-gradient(87.44deg,#382EA5 -13.09%,#9991FF 53.31%,#382EA5 119.7%)',
  knobInk: '#171436',

  /* surfaces */
  card: 'rgba(50,44,109,.30)',
  cardLine: 'rgba(255,255,255,.08)',
  panel: 'radial-gradient(85% 127% at 85% 76%,rgba(148,141,255,.07) 0%,rgba(148,141,255,.04) 100%)',
  rule: 'linear-gradient(90deg,rgba(111,145,255,0) 0%,rgba(111,145,255,.5) 51%,rgba(111,145,255,0) 100%)',
  chipLine: 'rgba(255,255,255,.22)',

  /* the comparison table's own column */
  colFill: 'rgba(111,145,255,.15)',
  colLine: '#6F91FF',
  pillOwn: 'linear-gradient(85.77deg,#6259CC 1.85%,#9890FE 49.31%,#6259CC 96.78%)',
  pillOther: 'linear-gradient(100.14deg,#DBA936 1.86%,#FFEB6A 94.86%)',
  pillOwnInk: '#FFFFFF',
  pillOtherInk: '#3A2A00',

  /* the pinned sheet */
  sheet: 'linear-gradient(180.19deg,#3D378E -36.63%,#100E26 84.74%,#000000 99.83%)',
  sheetLine: '#4C43BC',
  sheetHalo: 'rgba(111,145,255,.5)',
  buy: 'linear-gradient(90.01deg,#4236C6 0.05%,#6F64FF 50.02%,#4236C6 100%)',
  buyInk: '#FFFFFF',
  shine: 'rgba(255,255,255,.42)',
  shineCore: 'rgba(255,255,255,.92)',
  planLine: '#4B4789',
  planPickLine: '#6F64FF',
  planPickFill: 'rgba(111,145,255,.12)',
  save: 'linear-gradient(85.88deg,#5348CA -2.69%,#7E74FB 49.16%,#5348CA 101.01%)',
  saveInk: '#FFFFFF',

  /* accents that stay gold on both tiers — the offer is gold, the tier is not */
  gold: '#E1C13C',
  star: '#FFBE4D',
  laurel: '#FFBE4D',
  awarded: '#8D84FF',
  name: '#8D84FF',
  role: '#E1C13C',

  /* V2's badge */
  starA: ['#8B80FF', '#5B4FE0', '#3B2FA8'],
  starB: '#E1C13C',
  starBAlpha: 0.85,
  spark: '#B9B0FF',
  seedDot: '#E1C13C',
}

/* ── Stimuler PRO+ — gold ───────────────────────────────────────── */
export const PLUS = {
  id: 'plus',
  label: 'Stimuler Pro+',
  cta: 'Get Stimuler PRO+',
  wordmark: 'PRO+',

  page: 'linear-gradient(180deg,#241503 0%,#180C01 55%,#130800 100%)',
  scrim: 'rgba(36,21,3,.92)',
  glow: [
    { w: 517, h: 231, x: -19, y: 28, fill: 'rgba(140,102,42,.38)', blur: 145 },
    { w: 336, h: 231, x: 263, y: 145, fill: 'rgba(231,202,121,.10)', blur: 48, blend: 'plus-lighter' },
    { w: 303, h: 139, x: 286, y: -10, fill: '#8C6A2A', blur: 97, blend: 'plus-lighter', rot: -29.71 },
  ],

  track: '#1F1406',
  knob: 'linear-gradient(85.77deg,#EAB259 1.85%,#FFE292 49.31%,#EAB259 96.78%)',
  knobInk: '#130800',

  card: 'rgba(255,255,255,.06)',
  cardLine: 'rgba(231,202,121,.13)',
  panel: 'radial-gradient(85.34% 126.95% at 85.34% 76.09%,rgba(231,202,121,.074) 0%,rgba(231,202,121,.04) 100%)',
  rule: 'linear-gradient(90deg,rgba(167,134,44,0) 0%,rgba(167,134,44,.5) 51%,rgba(167,134,44,0) 100%)',
  chipLine: 'rgba(231,202,121,.28)',

  colFill: 'rgba(231,202,121,.15)',
  colLine: '#B67E35',
  pillOwn: 'linear-gradient(100.14deg,#DBA936 1.86%,#FFEB6A 94.86%)',
  pillOther: 'linear-gradient(85.77deg,#6259CC 1.85%,#9890FE 49.31%,#6259CC 96.78%)',
  pillOwnInk: '#3A2A00',
  pillOtherInk: '#FFFFFF',

  sheet: 'linear-gradient(180.19deg,#48412B -36.63%,#130A05 84.74%,#000000 99.83%)',
  sheetLine: '#795E2D',
  sheetHalo: 'rgba(231,202,121,.5)',
  buy: 'linear-gradient(90.01deg,#DB992F 0.05%,#FFE090 50.02%,#DB992F 100%)',
  buyInk: '#130800',
  shine: 'rgba(255,251,235,.42)',
  shineCore: 'rgba(255,253,244,.9)',
  planLine: '#5B4726',
  planPickLine: '#E7CA79',
  planPickFill: 'rgba(231,202,121,.10)',
  save: 'linear-gradient(96.52deg,#E8C15F 5.76%,#C48722 96.63%)',
  saveInk: '#130800',

  gold: '#E1C13C',
  star: '#FFBE4D',
  laurel: '#FFBE4D',
  awarded: '#E7CA79',
  name: '#E7CA79',
  role: '#FFFFFF',

  starA: ['#FFE7A8', '#E8B54B', '#B47A22'],
  starB: '#FF9803',
  starBAlpha: 0.5,
  spark: '#FFE292',
  seedDot: '#FF9803',
}

export const THEMES = { pro: PRO, plus: PLUS }

/* The coupon is gold on both tiers — it is the *offer's* colour, not the
   tier's, and holding it fixed is what lets the eye read the switch as a
   change of plan rather than a change of promotion. */
export const COUPON = {
  paper: '#FEF4CB',
  ink: '#000000',
  figure: '#E1C13C',
  star: '#FAD643',
  texture: '#E1C13C',
  textureDim: '#BCA132',
  notch: '#D9D9D9',
}
