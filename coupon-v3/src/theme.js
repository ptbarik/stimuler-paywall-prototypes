/**
 * The two tiers, as colour. Stimuler V3.
 *
 * Every value below is a fill attribute lifted out of the two Figma CSS
 * exports — `Stimuler V3` nodes 11028:6622 (PRO) and 11028:6140 (PRO+) — not
 * sampled off the PNGs.
 * The exports are the same frame twice, so the two objects have the same shape
 * key-for-key and the paywall can be written once and dressed twice: nothing in
 * `components/` knows which tier it is rendering, it only reads `t.*`.
 *
 * ── what V3 changed out of V2 ──────────────────────────────────────
 *
 * Diffed rather than re-read, so the list is exact: the feature card goes to a
 * neutral white wash on both tiers, the section chips stop being outlines and
 * become solid plates in Geist, PRO's yearly card gains a `#201C47` fill,
 * PRO+'s chrome black warms from `#000000` to `#140901` and its CTA ink from
 * `#130800` to `#402305`, the comparison table's two pills are now identical
 * across tiers (PRO+ was carrying a translucent variant), the active toggle
 * label goes bold, and Roadmap Days reads `100+ Days` in both columns.
 *
 * Two values post-date the CSS export and were sampled off the 18 Sep switch
 * instead: `knobInk` on PRO, now white, and `trackLine`, the hairline the
 * track has gained.
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
  /* the live half's label is white now, and the track carries a hairline —
     both sampled off the 18 Sep switch, which post-dates the CSS export */
  knobInk: '#FFFFFF',
  trackLine: '#8A8991',

  /* surfaces */
  card: 'rgba(255,255,255,.06)',
  cardLine: 'rgba(255,255,255,.08)',
  /* the section chips are solid plates in V3, not outlines */
  chip: '#191935',
  chipInk: '#FFFFFF',
  panel: 'radial-gradient(85% 127% at 85% 76%,rgba(148,141,255,.07) 0%,rgba(148,141,255,.04) 100%)',
  rule: 'linear-gradient(90deg,rgba(111,145,255,0) 0%,rgba(111,145,255,.5) 51%,rgba(111,145,255,0) 100%)',
  chipLine: 'rgba(255,255,255,.22)',
  chromeInk: '#000000',

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
  /* the CTA's sweep */
  shine: 'rgba(255,255,255,.42)',
  shineCore: 'rgba(255,255,255,.92)',
  planLine: '#4B4789',
  /* the picked card's stroke is a gradient, which the CSS export drops —
     sampled off the 18 Sep frame: 2px, `#8A82F7` at the left and right edges
     ramping to `#F6F6FE` across the middle of the top and bottom runs. The
     60° tilt is measured, not guessed: the bright band crosses the top edge
     at 46% and the bottom at 70%, which over a 183 × 77 card is 60°. */
  planPickLine: 'linear-gradient(60deg,#8A82F7 0%,#F6F6FE 50%,#8A82F7 100%)',
  planPickFill: '#201C47',
  save: 'linear-gradient(85.88deg,#5348CA -2.69%,#7E74FB 49.16%,#5348CA 101.01%)',
  saveInk: '#FFFFFF',

  /* accents that stay gold on both tiers — the offer is gold, the tier is not */
  gold: '#E1C13C',
  star: '#FFBE4D',
  laurel: '#FFBE4D',
  awarded: '#8D84FF',
  name: '#8D84FF',
  role: '#E1C13C',

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
  /* PRO+ keeps dark ink: white on `#FFE292` is about 1.3:1 and unreadable.
     The screenshot that moved PRO to white was the indigo tier only. */
  knobInk: '#130800',
  trackLine: '#8F8577',

  card: 'rgba(255,255,255,.06)',
  cardLine: 'rgba(231,202,121,.13)',
  chip: '#140901',
  chipInk: '#FFFFFF',
  panel: 'radial-gradient(85.34% 126.95% at 85.34% 76.09%,rgba(231,202,121,.074) 0%,rgba(231,202,121,.04) 100%)',
  rule: 'linear-gradient(90deg,rgba(167,134,44,0) 0%,rgba(167,134,44,.5) 51%,rgba(167,134,44,0) 100%)',
  chipLine: 'rgba(231,202,121,.28)',
  chromeInk: '#140901',

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
  buyInk: '#402305',
  shine: 'rgba(255,251,235,.42)',
  shineCore: 'rgba(255,253,244,.9)',
  planLine: '#5B4726',
  planPickLine: 'linear-gradient(60deg,#D6AF5E 0%,#FFF6DF 50%,#D6AF5E 100%)',
  /* opaque, not the `rgba(231,202,121,.10)` tint it used to be. The gradient
     stroke is painted by stacking the fill on `padding-box` over the gradient
     on `border-box`, and a translucent fill lets the gradient through the
     middle of the card — the stroke stops being a stroke. This is that same
     10% tint resolved against the sheet at the plan row's own height. */
  planPickFill: '#3B301E',
  save: 'linear-gradient(96.52deg,#E8C15F 5.76%,#C48722 96.63%)',
  saveInk: '#FFFFFF',

  gold: '#E1C13C',
  star: '#FFBE4D',
  laurel: '#FFBE4D',
  awarded: '#E7CA79',
  name: '#E7CA79',
  role: '#FFFFFF',

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
