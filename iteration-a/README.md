# Stimuler · Pro / Pro+ paywall, with the feature carousel in the hero

The paywall from `~/Desktop/Paywall Design.svg` and `~/Desktop/Paywall CTA.svg`,
with the four finished 5s feature animations playing in the hero slot the design
left for them.

```bash
npm install
npm run dev      # http://localhost:5173
```

## The one number that made this cheap

The export contains a bare **370×330 rect at (21, 218)** inside the phone frame —
the placeholder for the animation. That is *exactly* the frame all four feature
scenes were built to, months apart, in four separate projects.

So they drop straight in: no scaling, no re-layout, and `src/timing.js` (the
carousel's join logic) is reused verbatim. `src/scenes/*` is each project's `src/`
vendored in unchanged.

## The four slides

| # | Caption | Scene |
|---|---|---|
| 1 | All the **benefits of Pro**, and **unlimited calls** with Sarah · *Pro:* Up to 40 mins **of calls with Sarah** | `sarah` |
| 2 | **100+ Lessons** to choose from | `lesson` |
| 3 | **Speak with confidence** with every practice session | `conversation` |
| 4 | **Get detailed feedback** on every metric in a tap | `report` |

The export draws **three** pagination dashes but supplies **four** captions.
Four won — all four animations are in, and the dash row is drawn to match.

**Slide 1 is the only genuine copy difference between the tiers**, and it reaches
one step further in than copy: Pro caps calls at 40 minutes, Pro+ doesn't, and the
design puts that on the pill *inside the Sarah scene*. The Pro+ line names both
halves of what is being bought — everything Pro has, **and** the uncapped calls —
with an accent on each, rather than only on the thing Pro lacks. Slides 2–4 keep identical
wording on both tiers and only recolour the accent word (gold ⇄ blue).

## Four changes to scenes that were previously untouched

The carousel project's rule was that no scene was ever edited. Four things break
that here, all deliberate:

**1 · The Sarah pill takes a prop.** `CallSequence` had `40 Minutes` hardcoded.
It is now `minutesLabel = '40 Minutes'` — defaulted, so the source project still
renders identically, and the paywall passes `'Unlimited'` on Pro+. The pill's
geometry is fixed at 123.159px wide in the scene *and* in the export's Pro+
frame, so the label swaps inside an unchanged box.

**2 · The scenes' own backgrounds are cleared — from CSS, not from a scene.**
Three of the four paint `#0D0B10` so they read as a card in their own project.
Here they sit directly on the tier's gradient, and a near-black rectangle over
that gradient is exactly the card the design does *not* have. One rule does it:

```css
.hero [data-panel] > *{background-color:transparent !important}
```

An `!important` in the stylesheet beats the scenes' inline `backgroundColor`, so
`src/scenes/*` stays byte-identical to its source apart from the pill prop.

**3 · The lesson scene's roadmap wash is feathered at the frame edge.** It is a
269×34 ellipse under a **67.7px blur**, so it reaches ~200px past its own box —
far wider than the 370×330 frame, top and bottom. In that scene's own project
that was intended: the frame *was* a card, the wash lifted its whole interior,
and the card's edge was supposed to be a line. Here there is no card, so
`overflow-hidden` turned the wash into a hard-edged rectangle hanging over the
page — a visible box around the animation. The wash now renders in the frame's
own space (outside the camera, with the pan applied to the blob instead) so a
`linear-gradient` mask can feather it top and bottom. Same pixels, minus the
edge; nothing moved or recoloured.

**And the camera is feathered ~10px top and bottom.** Same root cause, second
symptom: the centre card carries a shadow up to 25px deep, and once it has
panned above the frame the only part of it still inside is that shadow — which
landed as a hard-edged dark line straight across the top of the animation. The
feather is the general fix rather than a patch on one shadow: anything crossing
the frame edge now dissolves instead of being cut, which is what a scrolling
list should do anyway. The shadow itself also dropped from `rgba(0,0,0,.5)` to
`.28`, since it no longer has a black ground to lift off.

Worth knowing for the next scene that goes on a gradient: **this is the failure
mode to look for.** A card fill, a shadow or a blur tuned against `#0D0B10` is
invisible on `#0D0B10` and a hard-edged rectangle on anything else. Both boxes
reported here were that, twice over.

**4 · The two chat bubbles are pale glass, not near-black.** Sarah's greeting
(`sarah/timeline.js → sarahBubble`) and the lesson's praise
(`lesson/timeline.js → C.bubble`) were both `#161616`, sampled off exports drawn
on a near-black card. On the tier gradients they read as holes. Both are now
`rgba(255,255,255,.13)` with a `rgba(255,255,255,.30)` hairline and white text —
the same treatment as the `40 Minutes` pill that sits 200px above Sarah's bubble.

The Sarah scene's *suggested reply* (`#1F262C`) and the practice-conversation
scene's grey/violet pair are left alone: those are distinct designed colours
carrying speaker identity, not the same near-black.

## The caption face

**Inter Display Bold, 24/30, -0.35px** — a neo-grotesque, not the geometric
Poppins the scenes use. Figma outlines all text on SVG export, so the face had
to be identified from letterforms (double-storey `a`, spurred `G`, angled `t`)
and then confirmed by measurement: the export's caption ink is 153px and 197px
wide on the two Pro lines, and Inter Display 700 at 24px sets them at 154 and
198. Poppins 700 needed 21px to hit the first line and was then 8px wide on the
second — which is the tell that it was the wrong family, not the wrong size.

**One thing to decide:** the two phone frames in the export disagree about where
this caption sits. Status bar, close button, pill, call button, dashes and price
sheet are identical to the pixel in both — but the caption's ink top is **111 in
the full-scroll page and 134 in the above-the-fold frame**, a 23px difference.
The prototype follows the full-scroll page, since that is the frame it
reproduces. Worth a look; it is a one-line change either way.

## The captions travel with the slides

Each scene owns a headline, so a caption belongs to its slide rather than sitting
above the frame as a label. Each caption moves at **0.32** of its panel's
amplitude and crossfades over the middle half of the transition — enough to read
as attached to the thing sliding, not so much that it looks like a second
carousel running alongside the first.

The carousel's own rule still holds underneath: **a scene finished as a complete
0→5000ms piece plays in full, centred.** `FREEZE = 4790` clamps each clock just
short of the scene's own fade-out, so a panel leaves holding its finished frame,
and the incoming panel's clock starts when it *lands* — the carousel never eats a
scene's first beat.

## Both tiers are dark

This is the first Pro/Pro+ design where neither tier is a light theme. Pro is
navy `#0F0D25`, Pro+ is near-black `#130800`, and each carries the same three
blurred ellipses at the top — `#3B368C` and `#EAC361` respectively, at the
export's own geometry (two of the three `plus-lighter`).

Reproduced as three blurred divs rather than baked to an image, so the tier swap
is a colour transition instead of a crossfade of two bitmaps. `.glows` needs
`isolation:isolate` — without it the `plus-lighter` blend group escapes to the
page and every surface below it composites wrong.

Everything else was sampled off a 1:1 render of each frame and lives in `:root`
blocks in `index.css`.

## The tier morph

250ms ease-out, staggered in 40ms beats from the thumb outward — thumb 0 →
background/caption 40 → table 80 → social/FAQ 120 → sheet 160 → CTA 200. Those
numbers are the 60fps shot *Whistle Plan Selection Interaction*'s own motion
params (`.easeOut(duration: 0.25)`, `stagger_delay 0.04`), not an eyeball.

The two things that *travel* rather than recolour — the segment thumb and the
table's highlight column — use a subtle spring instead.

## The CTA, and its glass

Built from Figma node **`10763:13979`**, not from the SVG. The SVG shows the bar
as a flat `#0F0D25` at 2% and nothing else, because what makes it glass is a
**Background Blur** — which SVG cannot carry, and which the Figma MCP flattens
to a single `backdrop-blur-[30px]`. The layer panel is the real spec:
*Progressive, start 0.5 → end 60*.

CSS has no progressive backdrop-filter either, so it is a stack of seven
`backdrop-filter` layers, each blurring more than the last and each masked to
fade in a little further down. They composite, so a given row gets every layer
above it too — which is what makes the fall-off continuous rather than stepped.
The last band is the bottom 40.24px, matching the export's separate 6.707px
blur on the home-indicator strip.

**Two things about the ramp, both learned the hard way:**

- **Layer 1 has no ramp-in.** Only **13.6px** of glass shows above the button,
  so a first layer that fades in over the top 7% leaves exactly the strip that
  matters completely sharp — and the price card's `PRO MONTHLY` row sits right
  there. It read as guillotined. Content crossing the top edge has to start
  smearing on the first pixel; in the design that row's letters are visibly
  sharper at the top than at the bottom, which is the whole point of the effect.
- **The climb is front-loaded**, most of it in the first third. An even 0.5 → 60
  spread across 108px is nearly clear exactly where you need it not to be.

From the node: button `382×54` at `top 13.6`, `linear-gradient(90.038deg,
#537AFB 0%, #9CB4FF 50.022%, #537AFB 99.995%)`, `drop-shadow(-8px 11px 6px
rgba(15,13,37,.25))`; label **Manrope SemiBold 17.246/1.4, -0.1725px**; sub-label
**Inter Display Medium 12px at 70%** with the bullet set 10px.

`Paywall CTA.svg` has four buttons, and they are four states of one control:
the **verb follows the tier**, the **sub-line follows the plan**.

| | Yearly | Monthly |
|---|---|---|
| **Pro** | Start Learning · Pro Yearly • Save up to 33% | Start Learning · Pro Monthly |
| **Pro+** | Go Unlimited · Pro Yearly • Save up to 33% | Go Unlimited · PRO+ Monthly |

## Getting the user to Pro+

The page opens on **Pro**, which means a user who never touches the toggle never
sees the tier the page exists to sell. Two things address that, and they are
meant to be read as one:

- **A gold wash breathing under the Pro+ label** — 2.6s, opacity 0 → 1 → 0. No
  ring, no badge, no bounce: it should register from the corner of the eye and
  survive being ignored. It is scoped to `[data-tier="pro"]` and retires
  permanently the moment the user toggles even once.
- **A one-shot switch to Pro+ at 20s**, for when the wash goes unread. It fires
  only while the toggle has never been touched — being moved off a tier you just
  chose is the one thing this must never do — so any deliberate tap, in either
  direction, cancels it for the session.

## Where this departs from the export

- **Four slides, not three dashes.** See above.
- **The FAQ answers are written here.** The export only draws the collapsed
  state. Rows expand; the block is the last thing on the page, so opening one
  grows the page (2483 → ~2566) and moves nothing above it.
- **Pro captions for slides 2–4** are the Pro+ wording with a blue accent. The
  export only supplies the Pro+ row of caption placeholders.
- **Testimonials 2–5** are carried over from the earlier Pro/Pro+ prototypes; the
  export embeds only Mateo's photo, the rest of the row being cropped off-frame.
- **The chat bubbles are lighter than the exports draw them**, and **the price
  cards' inner gradient is about half the strength** it was — both on Padmini's
  note of 2026-08-23, after seeing them on the tier gradients rather than on the
  near-black the scenes were drawn against.
- **The Pro+ hint and the 20s auto-switch** are not in the export at all.

## Fitting the window

`zoom: min(1, vw/412, vh/917)` — **`zoom`, never `transform: scale()`.** A scaled
frame keeps its untransformed layout box, so the pinned CTA and the scroll
container land in the wrong place at every window that isn't exactly 917 tall,
which is nearly all of them.

## Prototype controls

Bottom-right: tier, play/pause, a scrubber across the full 21.16s loop, a
reduced-motion toggle, and a readout of which scene is playing and where it is.
`×` hides the panel. The hero is also swipeable and the dashes are clickable —
both just move the clock, so the whole thing stays a pure function of `t`.

## A harness note, if you ever screenshot this

Chrome's `Page.captureScreenshot` with `captureBeyondViewport: true` corrupts the
paint of an **inner** scroller — the whole page comes back a flat `#565656`. And
after scrolling `.scroll` programmatically, headless keeps a stale composited
tile, so a forced style recalc plus two frames is needed before the capture.
Both cost time here looking like page bugs. They are not.

## Structure

```
src/
  design.js      every measurement + both palettes' worth of copy, read off the SVG
  App.jsx        the frame, the zoom fit, tier/plan state, the rAF clock
  Hero.jsx       the four panels and their captions in the 370×330 slot
  Sections.jsx   price sheet · PRO vs PRO+ · social proof · FAQ
  timing.js      the carousel: FREEZE, STEP, TRANS, panelAt(t, j)
  index.css      the two tier palettes and the whole page's geometry
  scenes/        vendored from four projects; unedited but for the Sarah pill prop
```

Sources: `~/Desktop/stimuler-carousel`, and through it
`~/Desktop/call with sarah feature/sarah-call`, `~/Desktop/lesson/lesson-sequence`,
`~/Desktop/conversation/conversation-sequence`, `~/Desktop/stimuler-report-reveal`.
