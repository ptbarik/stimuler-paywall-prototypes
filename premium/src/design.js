/**
 * Every number here is measured out of the exports in `~/Desktop/premium tab`
 * — `1.png`/`2.png` (the roadmap and its sheet), `3.png`–`6.png` (the crown
 * interstitial's four frames) and `7.png` (the 412×2470 paywall), with the
 * three `CTA*.png` frames for the price block's own states.
 *
 * The exports outline their text, so nothing below is read off a Figma text
 * node. Positions are pixel bounds off a 1:1 render; type sizes are
 * back-solved from cap heights at Inter Display's 0.727 cap ratio; colours are
 * fill attributes out of the SVG twins where there is one and sampled off the
 * PNG where the text has been flattened.
 *
 * ── Two things the export handed over ──────────────────────────────
 *
 * **The frame is 412×917 and the comparison table is the same table.** Its box
 * is 382 wide by 417.7 tall with its value columns at x 190.3 and 285.28,
 * 84.79 apart — identical to the roadmap paywall's, to the hundredth. So the
 * table's internals are that page's measurements shifted by a single constant
 * (`TABLE.box.y - 832.5`) rather than measured a second time, and the two
 * prototypes cannot drift apart.
 *
 * **The animation slot is 370×330.** Which is the frame all four feature
 * scenes were composed to, months apart, in four separate projects. Dropping
 * the consolidated carousel in at (21, 120) puts the Sarah call's green button
 * within 2px of where `7.png` draws it — so the export's hero is not
 * approximated, it is the thing itself.
 */

/* ── the frame ──────────────────────────────────────────────────── */
export const FRAME = { w: 412, h: 917 }

/**
 * The paywall's scroll length, and the height the pinned CTA reserves.
 *
 * `7.png` is 2470 tall. The laurel band was 66 there and is 145 now, so
 * everything below it — the claim, the testimonials, the FAQ — carries the same
 * `+ 79` and the page is 79 longer. Written as `+ 79` rather than folded into
 * the numbers so the export's own measurements stay legible beside them.
 */
export const PAGE_H = 2470 + 79
export const SHEET_H = 308.38

/* ── the paywall ────────────────────────────────────────────────── */

/** `Stimuler` + the PRO pill. Measured: text x138–215, pill x223–276. */
export const HEADER = { top: 72, gap: 8, pill: { w: 53, h: 24 } }

/** The carousel's slot. 370×330 at native size — see the note above. */
export const HERO = { x: 21, y: 120, w: 370, h: 330 }

/**
 * The frame the hero holds on while the price strike plays.
 *
 * The page runs the strike first and the hero second, so that the price is
 * read before the pitch. The hero therefore needs something to *be* for that
 * second and a bit — and blank is the wrong answer: a paywall whose top half
 * is empty on arrival reads as broken, not as deferential.
 *
 * 620ms into the Sarah call is the answer, and it is the export's own: the
 * scene spends its first 750ms on the calling state, so at 620 the `40 Minutes`
 * pill, the green call button and `Calling Sarah…` are all up and settled —
 * which is exactly the still `7.png` draws in this slot. The page arrives
 * looking like the design, holds there, and then continues *from* that frame
 * rather than restarting.
 *
 * That it is 130ms short of `connect` is deliberate too. When the clock is
 * released the very next thing that happens is the call connecting, so the
 * reward for having read the price is immediate.
 */
export const HERO_POSTER = 620

/** Four dashes: the live one 22.5 wide, the rest 8.5, 5.5 apart, 3 tall. */
export const DOTS = { y: 472, x: 174, on: 22.5, off: 8.5, gap: 5.5, h: 3 }

/** The caption under the dashes. Line one's cap tops at 508, lines 30 apart. */
export const CAPTION = { top: 501, size: 24, line: 30 }

/**
 * Free vs PRO.
 *
 * `box` is measured here (x15–397, y587–1005); everything inside it is the
 * roadmap paywall's own table geometry, which this export reuses to the
 * hundredth of a pixel, shifted by the one offset between the two pages.
 */
const SHIFT = 587 - 832.5

export const TABLE = {
  /** the `Free vs PRO` chip sits *inside* the card, at its top-left */
  chip: { top: 616, left: 46, w: 109 },
  box: { x: 15, y: 587, w: 382, h: 417.7, r: 32 },
  /** the column pills */
  head: 926.3 + SHIFT,
  /** the four hairlines the export draws between the five rows */
  rules: [995.45, 1038.85, 1103.62, 1168.38].map((y) => y + SHIFT),
  /**
   * Each row's line-box centre — measured off the render, not derived from the
   * rules. The export's rows are not centred in their own bands: row 1 sits
   * ~3px low because the pills above eat into its space, and row 5 ~5px low.
   * A mid = (rule[i] + rule[i+1]) / 2 model puts the last two visibly high.
   */
  mids: [973.5, 1016.5, 1071, 1135.5, 1200].map((y) => y + SHIFT),
  col: { free: 190.3, pro: 285.28, w: 84.79 },
  /** the PRO column's standing highlight — it does not travel here, there is
      only one paid column to be in */
  hl: { y: 917.25 + SHIFT, h: 305.73, r: 12.5 },
  rule: { x: 44.14, w: 326.93 },
}

/**
 * The laurel carousel.
 *
 * Redrawn from the `Dynamic carousel` export: **145 tall**, not the 66 the
 * earlier paywall gave it, and now it moves. Three claims on a ring — the Play
 * award, `13Mn+ users`, the rating — each holding the centre for 2.4s. The
 * centred item is at full size and full opacity; its neighbours sit at 0.72 and
 * 0.3 and are clipped by the frame's own edges, which is what says there is
 * more of this without spending a row on saying so.
 */
export const LOVED = {
  top: 1072,
  h: 145,
  item: 253.53,
  /**
   * Measured off the render rather than taken from the export's boxes.
   *
   * The export's item frames are 253.53 and 168.38 wide, but those are text
   * boxes and the three items hold different amounts of text, so their widths
   * say nothing about the spacing. What is measurable is the ink: in the
   * reference the centre item's two laurels sit at x128 and x283.5 — ±77.75
   * from the item's centre — and the neighbours' laurels at x48.5 and x352.3,
   * at 0.72 the size. Solving those back gives a pitch of ~208 and a side
   * scale of 0.72, not the 0.87 the export's frame heights imply.
   */
  pitch: 208,
  sideScale: 0.72,
  sideOpacity: 0.3,
  /** the item the band opens on: the one the reference centres */
  start: 1,
  /** how long each item holds the centre, and how long the move between takes */
  hold: 2400,
  move: 620,
}

/** The trophy and the 92% claim, right-aligned against x363. */
export const CLAIM = {
  trophy: { x: 43, y: 1235 + 79, w: 150, h: 150 },
  right: 363,
  pct: { top: 1229 + 79, size: 49 },
  lines: { top: 1275 + 79, size: 24.7, line: 28 },
}

/** The testimonial carousel — the roadmap paywall's card, at this page's y. */
export const TESTIM = { top: 1382 + 79, w: 294.1, h: 372.25, gap: 11.8, pad: 26 }

export const FAQ = { chip: { top: 1806 + 79, left: 44, w: 211 }, top: 1866 + 79 }

/* ── the pinned CTA ─────────────────────────────────────────────── */

/**
 * The pinned CTA, from the `CTA3 - with final offer` export.
 *
 * Every number is that export's own, in its own layout order: the sheet is one
 * 277.26-tall auto-layout column of four blocks 13 apart, starting 11.44 down.
 * They are given here as offsets from the sheet's top edge, because that is
 * what the component positions against.
 *
 *     11.44  trust line          25.58
 *     50.02  price group        118.44   (the badge straddles the box's top edge)
 *    181.46  the CTA button      54
 *    248.46  see all plans       40.24
 *
 * The three details that were wrong before and are the reason this block
 * "looked a bit off":
 *
 * **The badge is nearly square-cornered** — `3.52px`, not the 11 it had. At 11
 * it reads as a pill floating on the card; at 3.5 it reads as a tab cut into
 * the box's edge, which is what the export draws.
 *
 * **The price box is 11.06, not 16**, and it carries a blurred `#7C561F`
 * ellipse inside its top edge — 228.92 × 51.43, blurred 64.53 at 83% — which
 * is where the warmth at the top of the card comes from. Without it the box is
 * a flat outline and the whole sheet reads colder than the export.
 *
 * **The sheet has an 18px top radius** and its own gradient
 * (`#48412B → #130A05 → #000`), with a blurred gold bar across the top edge.
 * It was drawing as a square-cornered slab.
 */
export const SHEET = {
  top: PAGE_H - SHEET_H,
  radius: 18,
  /** the export's blurred gold bar, over the sheet's top edge */
  halo: { top: 12.73, w: 417, h: 18.01, blur: 20.2635, color: 'rgba(231,202,121,.5)' },

  trust: { top: 11.44, h: 25.58, size: 11.8707 },

  badge: { top: 50.02, w: 250, h: 23, r: 3.5217, size: 11.8359, gap: 11.74 },
  /** each timer field, and the colon between them */
  chip: { w: 17, h: 17, r: 2.5, size: 10, gap: 2.5 },

  box: { x: 15, y: 60.28, w: 382, h: 108.18, r: 11.0627 },
  /** the warm blur inside the box's top edge */
  ember: { x: 229.97, y: -24.44, w: 228.92, h: 51.43, blur: 64.5327, color: '#7C561F', o: 0.83 },

  /**
   * The price's optical centre, which is not the same in the two states.
   *
   * With the per-month line under it the pair is centred, which puts the figure
   * at 105.37 — 9px above the box's own middle. With no sub-line (`CTA1`, which
   * is also the expired frame) it drops to the box's true centre at 114.37.
   */
  price: { withSub: 105.37, alone: 114.37, size: 48, line: 51 },
  sub: { centre: 140.37, size: 12 },

  cta: { x: 15, y: 181.46, w: 382, h: 54, r: 27, size: 18 },
  more: { top: 248.46, h: 40.24, size: 18 },

  /** the strike: 163 long, 3 thick, drawn past the glyphs at both ends */
  strike: { w: 163, h: 3 },
}

/* ── the roadmap, and its sheet ─────────────────────────────────── */

export const NAV = {
  top: 825,
  h: 92,
  /** the five tab centres, measured off `1.png` */
  x: [56, 132, 208, 279, 352],
}

/** The sheet in `2.png`: top edge 602, button 741–789, bottom 813. */
export const PREMIUM_SHEET = {
  top: 602,
  h: 211,
  crown: { top: 23, size: 30 },
  head: { top: 88, size: 21, line: 29 },
  cta: { x: 42, y: 139, w: 328, h: 48, r: 24 },
  close: { x: 369, y: 611, d: 25 },
}

/* ── the crown interstitial ─────────────────────────────────────── */

/**
 * The word cascade.
 *
 * Lifted from the intro beats of the Stimuler onboarding prototype
 * (`usa-onboarding-v2`), which is the motion this sequence was asked to match.
 * Its own note on why the numbers are what they are is worth keeping:
 *
 * > less blur, less travel, a tighter stagger so the line finishes sooner, and
 * > a long hold once it is whole — **the reading happens in the hold, not the
 * > motion**.
 *
 * That last clause is the whole idea, and it is what makes this expensive in
 * time: a line that cascades in and immediately leaves has not been read, it
 * has been *watched*. Every beat here is whole well before it goes.
 *
 * Each word starts at `opacity 0`, `blur(4px)`, `translateY(10px)` and clears
 * all three over 740ms on `cubic-bezier(.22,.72,.24,1)`, 55ms apart. Leaving is
 * faster and much tighter — 500ms, 16ms apart, drifting *up* 8px — so the line
 * departs as one object rather than un-cascading itself word by word.
 */
export const CASCADE = {
  in: { dur: 740, stagger: 55, blur: 4, rise: 10 },
  out: { dur: 500, stagger: 16, blur: 4, rise: -8 },
}

/** How long a line of `n` words takes to be whole. */
export const cascadeSpan = (n) => CASCADE.in.dur + (n - 1) * CASCADE.in.stagger

/**
 * The master timeline.
 *
 * ── The fall and the copy do not overlap ──────────────────────────
 *
 * They used to. Beat 1 came up at 700ms with the frame still full, so the line
 * was revealed *through* the crowns — which sounded better than it read: the
 * near layer crosses in front of the type, so the words being introduced were
 * the words being occluded, and the eye had two things competing at the exact
 * moment it was being asked to read one.
 *
 * So the fall is now its own act. Sixty-four crowns come down fast, **every
 * one of them is past the bottom edge by 1900ms**, and only then does anything
 * else happen. `crowns.js` asserts that, so the two acts cannot quietly start
 * overlapping again the next time a duration is touched.
 *
 * The cost is that the sequence is longer — the two phases run end to end
 * instead of on top of each other. The fall is made fast and dense rather than
 * slow and sparse to pay some of that back: a downpour that is over in under
 * two seconds, rather than a drift that takes four.
 *
 * ── Why the holds are what they are ───────────────────────────────
 *
 * The reference holds each line for about 1.5s. These hold for ~600ms, which
 * is the compromise that keeps three beats plus a full crown act under eight
 * seconds. Still long enough that every line is finished and still before it
 * goes, which is the rule that actually matters.
 *
 * It plays once ever and a tap skips it at any point.
 */
export const T = {
  total: 7800,

  glow: [0, 450], //   the bloom, at the top of the fall
  emit: [0, 500], //   a burst, not a trickle — 64 crowns inside half a second
  fall: [0, 1900], //  and every one of them past the bottom edge by here

  /* the copy starts the instant the last crown clears, not a beat after it —
     the cascade fades in over 740ms, so any gap on top of that reads as the
     sequence having stalled rather than as a breath between acts */
  lockIn: 1900, //         `Stimuler PRO` arrives with beat 1, at y461
  b1: 1930, //             "Welcome to"
  b1out: 3400,
  move: [3500, 3750], //   the lockup settles 461 → 397
  b2: 3750, //             "You've unlocked a limited time offer!"
  b2out: 5350,
  b3: 5700, //             "Limited Time"
  off: 6000, //            "50% OFF" scales in from .85, one spring overshoot

  /**
   * And on the same beat, the lockup leaves for the paywall.
   *
   * `50% OFF` is the last thing this screen has to say, so the brand mark's
   * job here is done — it flies up to the exact place the paywall's own header
   * occupies and hands over to it there. That is the whole transition: not a
   * screen replacing a screen, but one element travelling between two, with
   * the glow underneath never moving at all.
   */
  fly: [6000, 6650],

  sweep: [6700, 7350], // one specular pass, masked to the glyphs
  out: [7300, 7800], //   copy out, paywall up, the glow unbroken across it
}

/**
 * `Stimuler PRO`, and the three places it is.
 *
 * `4.png` puts it at y461 under "Welcome to"; `5.png` and `6.png` at y397; and
 * `7.png` — the paywall — has it at y72 at 18px. So it is one element that
 * visits all three, rather than three drawings of the same words. It cascades
 * in once, settles up 64px between beats 1 and 2, holds through beats 2 and 3,
 * and then flies to the header.
 *
 * `land` is where the flight ends: the paywall header's own top, plus the 1.2px
 * that centres a 33px pill scaled to 0.655 against the 24px one it is landing
 * on. `scale` is 18 / 27.5 — the two type sizes — so the words match exactly at
 * the moment of handover. The pills are not quite a uniform scale of each other
 * (53×24 against 62×33), but the crossfade is 500ms over a 2px difference and
 * the type is the mass the eye is tracking.
 */
export const LOCKUP = {
  beat1Y: 461,
  restY: 397,
  land: 73.2,
  /** the two type sizes: 27.5 on the interstitial, 18 in the paywall header */
  scale: 18 / 27.5,
  size: 27.5,

  /**
   * The pill has to be interpolated, not just scaled with everything else.
   *
   * `6.png` draws the interstitial pill at 62×33 beside 97px of "Stimuler";
   * `7.png` draws the header's at 53×24 beside 64px. Those are not a uniform
   * scale of each other — the type is (27.5 → 18, exactly 0.655) but the pill
   * is wider and shorter than that ratio. Scaling the whole lockup by 0.655
   * therefore lands a group 15px narrower than the header's, and since both are
   * centred, "Stimuler" ends up ~7px off. Over a 500ms crossfade between two
   * copies of the same word, 7px is a visible double image.
   *
   * So the pill's own box travels too, from what the interstitial draws to
   * *the header's values divided by the scale* — which means that once the
   * group scale is applied at the end of the flight, the result is the header's
   * geometry to the pixel, and the crossfade has nothing to give away.
   */
  pill: {
    from: { w: 62, h: 33, r: 17, fs: 20, gap: 7 },
    to: { w: 53 / (18 / 27.5), h: 24 / (18 / 27.5), r: 12 / (18 / 27.5), fs: 13.5 / (18 / 27.5), gap: 8 / (18 / 27.5) },
  },
}

/** The three copy beats, measured off their own frames. */
export const BEAT = {
  one: { top: 424, size: 20.6 },
  two: { top: 455, size: 24.8, line: 34 },
  three: { top: 459, size: 27.5 },
  off: { top: 495, size: 64.6 },
}

/**
 * Sixty-four crowns in three depth layers.
 *
 * Up from forty-two, and the fall is now the whole screen's business for its
 * first two seconds rather than a backdrop for the copy — so it can afford to
 * be a downpour. Sixty-four emitted inside 500ms, each crossing the frame in
 * around a second, is a genuine shower: the frame is completely full between
 * roughly 500 and 1300ms, and then it empties.
 *
 * The layer split is what keeps that density from becoming noise. Near crowns
 * are full size, sharp and fast; far ones are half size, blurred, dim and
 * slower. Without depth, sixty-four crowns is a texture. With it, it is
 * weather.
 *
 * The durations are much shorter than they were, and deliberately: a crown
 * taking 2.6s to cross now holds the entire sequence up, because nothing else
 * may start until the last one is gone.
 */
export const LAYERS = {
  near: { n: 16, scale: 1, blur: 0, opacity: 1, dur: [800, 1000], front: true },
  mid: { n: 26, scale: 0.75, blur: 0, opacity: 0.85, dur: [950, 1200], front: false },
  far: { n: 22, scale: 0.5, blur: 1.5, opacity: 0.6, dur: [1150, 1400], front: false },
}

/**
 * The three flows the prototype is built to be walked through.
 *
 * Two of them are the same screen reached two ways, and that is the point: a
 * seasoned user either goes looking (the Premium tab, with the crown catching
 * the light) or gets pointed (the sheet, after a lesson they have just
 * finished). Same destination, different intent, and the paywall should not be
 * able to tell — which is why both land on exactly the same screen with the
 * interstitial already spent.
 */
export const FLOWS = [
  {
    id: 'tab',
    label: 'Premium tab',
    who: 'Seasoned user',
    note: 'Has used the app. The crown catches the light in the nav; tapping it goes straight to the paywall.',
  },
  {
    id: 'sheet',
    label: 'Discovery sheet',
    who: 'Seasoned user',
    note: 'Same user, pointed rather than looking — the sheet after a finished lesson. Also straight to the paywall.',
  },
  {
    id: 'new',
    label: 'First ever visit',
    who: 'New user',
    note: 'Never opened Premium. Opens the 24h window and plays the crown fall and Welcome to Stimuler PRO, once.',
  },
]

/**
 * The dev panel's four shortcuts into the offer window.
 *
 * The last one is the one that matters: without it, confirming the offer
 * really does end means waiting a day, which means in practice it gets checked
 * once, badly, at the end. These rewind the same `offerWindowStartedAt` the
 * page reads, so what they produce is not a simulation of a state — it is the
 * state.
 */
export const WINDOW_LABELS = [
  ['23:59', 23 * 3600e3 + 59 * 60e3],
  ['01:00', 3600e3],
  ['00:30', 30e3],
  ['expired', 0],
]
