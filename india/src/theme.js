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
  /* the sheet as glass: the same three stops at 20%, tinting a refracted,
     frosted backdrop — the first paywall's own recipe */
  sheetGlass: 'linear-gradient(180.19deg,rgba(61,55,142,.20) -36.63%,rgba(16,14,38,.20) 84.74%,rgba(0,0,0,.20) 99.83%)',
  sheetHalo: 'rgba(111,145,255,.5)',
  buy: 'linear-gradient(90.01deg,#4236C6 0.05%,#6F64FF 50.02%,#4236C6 100%)',
  buyInk: '#FFFFFF',
  shine: 'rgba(255,255,255,.42)',
  shineCore: 'rgba(255,255,255,.92)',
  planLine: '#4B4789',
  planPickLine: '#6F64FF',
  planPickFill: 'rgba(111,145,255,.12)',
  planFill: 'transparent',
  /* the India cards are solid on the glass sheet, as on the first paywall —
     these are that page's own two fills */
  cardFill: '#201C47',
  cardPickFill: 'radial-gradient(54.44% 96.02% at 50% 50%,#2A255D 0%,#1C1843 70.19%)',
  /* the line under a plan's price — the first paywall's lavender */
  planNote: '#9A95C3',
  save: 'linear-gradient(85.88deg,#5348CA -2.69%,#7E74FB 49.16%,#5348CA 101.01%)',
  saveInk: '#FFFFFF',

  /* accents that stay gold on both tiers — the offer is gold, the tier is not */
  gold: '#E1C13C',
  star: '#FFBE4D',
  laurel: '#FFBE4D',
  awarded: '#8D84FF',
  awardText: '#FFFFFF',
  name: '#8D84FF',
  role: '#E1C13C',

  /* V2's badge */
  starA: ['#8B80FF', '#5B4FE0', '#3B2FA8'],
  starB: '#E1C13C',
  starBAlpha: 0.85,
  spark: '#B9B0FF',
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
  sheetGlass: 'linear-gradient(180.19deg,rgba(72,65,43,.22) -36.63%,rgba(19,10,5,.22) 84.74%,rgba(0,0,0,.22) 99.83%)',
  sheetHalo: 'rgba(231,202,121,.5)',
  buy: 'linear-gradient(90.01deg,#DB992F 0.05%,#FFE090 50.02%,#DB992F 100%)',
  buyInk: '#130800',
  shine: 'rgba(255,251,235,.42)',
  shineCore: 'rgba(255,253,244,.9)',
  planLine: '#5B4726',
  planPickLine: '#E7CA79',
  planPickFill: 'rgba(231,202,121,.10)',
  planFill: 'transparent',
  /* the same two fills, carried into the gold page's browns */
  cardFill: '#1F1509',
  cardPickFill: 'radial-gradient(54.44% 96.02% at 50% 50%,#3B2B13 0%,#231809 70.19%)',
  /* the same line, warmed for the gold page */
  planNote: 'rgba(245,226,190,.62)',
  save: 'linear-gradient(96.52deg,#E8C15F 5.76%,#C48722 96.63%)',
  saveInk: '#130800',

  gold: '#E1C13C',
  star: '#FFBE4D',
  laurel: '#FFBE4D',
  awarded: '#E7CA79',
  /* iteration-b's gold page sets the award lines in its gold, not white */
  awardText: '#E3C487',
  name: '#E7CA79',
  role: '#FFFFFF',

  starA: ['#FFE7A8', '#E8B54B', '#B47A22'],
  starB: '#FF9803',
  starBAlpha: 0.5,
  spark: '#FFE292',
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

/* The starburst in gold, whatever the page's palette. India's purple page
   wears it too: a purple badge on a purple page sank into it, and the gold
   one is the thing on the page that is the offer. The rosettes, the
   back-plate and the sparkles — nothing else of the gold theme. */
export const GOLD_STAR = { starA: PLUS.starA, starB: PLUS.starB, starBAlpha: PLUS.starBAlpha, spark: PLUS.spark }

/* The price sheet's gold accents — the CTA's gold ramp and dark ink, its
   warm shine, and the gold stroke on the picked card. India's purple page
   takes them too, the way the first paywall pairs a purple page with a gold
   CTA; the sheet's glass tint and the cards' purple fills stay its own. */
export const GOLD_CTA = {
  buy: PLUS.buy, buyInk: PLUS.buyInk, shine: PLUS.shine, shineCore: PLUS.shineCore,
  planPickLine: PLUS.planPickLine,
}
