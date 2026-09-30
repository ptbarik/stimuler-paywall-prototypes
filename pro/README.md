# `pro/` — Stimuler PRO, the Indian first paywall

The Figma node `PRO` (`12176-6027` in *Stimuler V3*) built as a working screen,
with the four finished feature animations running in the 370 × 330 slot the
design leaves bare.

**https://stimuler-pro-paywall.vercel.app**

```bash
npm install && npm run dev      # http://localhost:5173
```

`?y=1300` opens the page already scrolled there — the page is 2598 tall inside
a 915 viewport, so reviewing a block below the fold otherwise means describing
where to scroll to.

---

## What came from where

Three sources, and it matters which:

| | |
|---|---|
| **The Figma export** | every coordinate, colour, radius and type spec on the page |
| **The Pro/Pro+ prototypes** (`iteration-b/`) | the hero — four 5s scenes and the carousel that chains them, vendored unedited |
| **The Paper frame** (`Stimuler V1 → USA Paywalls → PRO`) | the whole Premium Benefits section |

The third one needs explaining. **The Figma node ships Premium Benefits as five
identical placeholder rows** — the same bulb icon and the same sentence
(“Learn English, the smarter way with 100+ lessons”), five times over. The
Paper frame is where that block actually got designed, so it is the source for
it.

## Premium Benefits

The Paper frame now draws this block as a **swipeable card row**, which
replaced the five-row list it was before. Three things changed with it: the
gold eyebrow moved from centred-between-two-rules to left-aligned, a **32px
gold headline** was added above the cards, and the five one-liners became four
cards that each carry a figure and a sentence.

Its numbers, off that frame: a 412-wide full-bleed section at **top 817**, 413
tall (34 / 345 / 34), a **340 column** inside 20px padding, and a **372 card
viewport** that starts at the column's left edge and runs *past* the section's
right padding — which is what slices the third card. Cards are 150 × 186 on a
12 gap, 18px radius, `#6F91FF0A` on a `#FFFFFF12` hairline; icon 34, title 14 /
19 semibold, sub 12 / 17 at 56% white.

The row is a **real scroller**, not a picture of one. The rail only means
anything if the cards move, and the sliced third card is the only thing saying
there are more than two. The rail's thumb is the drawn **44 and travels the
track** rather than sizing itself to the content — a proportional thumb at four
cards in a 372 viewport would be 88, and the design drew 44.

## The hero

The export leaves `Calls with sarah feature` as a **bare 370 × 330 rect**,
which is exactly the frame all four scenes were built to — months apart, in
four separate projects. They drop in at native size: no scale, no re-layout,
and `src/timing.js` is the carousel from the Pro/Pro+ prototypes reused
untouched. `src/scenes/*` is each scene's own source, unedited.

Two differences from where it came from:

- **No per-slide captions.** The earlier page put a changing headline above the
  frame. This design has one headline for the whole page, in gold, directly
  above the hero — a second changing line under it would be two headlines
  arguing.
- **Sarah's pill is pinned to `40 Minutes`**, which is what this design draws
  inside the frame and what the India plan actually sells. On the Pro/Pro+ page
  that string was a function of the tier; there is one tier here.

The scenes' own `#0D0B10` backgrounds are cleared from the stylesheet
(`.hero [data-panel] > * {background-color:transparent}`) rather than by
editing a scene — on this page they sit directly on the page gradient, and a
near-black rectangle over that gradient is exactly the card this design
doesn't have.

## The proof band

`Dynamic carousel` in the export: **569 wide inside a 412 page**, with its
neighbours sliced by both edges and a four-dash pagination sitting hidden
behind it. So it is a carousel of four — `#1 App Appstore India`, `13Mn+
users`, `4.7 Learner's rating`, `Best AI App'23` — shown one at a time with
its neighbours peeking. The cut-off neighbours are the only thing on the page
that says it moves, so it moves: one step every 2.8s.

The track is **absolute, not modular**. Card `k` lives at `k · 186` for a
running, unbounded `k`, and the track slides to `-index · 186`. Wrapping the
index instead would make the card leaving on the left reappear on the right by
travelling back across the frame; absolute indices mean it simply unmounts once
it is two slots out.

`13Mn+ users` is **one 92px text node** in the export, not two — the line break
after `13Mn+` is the box, not a character, which is why it is written with a
`\n` and a fixed width rather than as two elements.

## The price sheet

`Sticky` in the export, drawn **flipped** (`matrix(1,0,0,-1,0,0)`), which is why
the file lists the CTA *before* the plan cards and the render shows them the
other way round. It is pinned to the viewport here rather than to the page, so
it sits over the content at every scroll position, as it would in the app.

`₹99/month` is one 32px text node in Figma and three sizes in the render, so it
is composed from its three parts (22 / 34 / 17).

The two cards are live — tapping one moves the fill and the CTA label follows
(`for 1 year` / `for 1 month`). The design only draws the yearly state.

## Known differences from the export

**Four pagination dashes, not three.** The design draws three under the hero;
the carousel it is describing has four scenes. Rendering three would mean
dropping a scene. One line in `App.jsx` if you'd rather have three.

**The dots fall behind the price sheet at rest.** The design is a 2598-tall
artboard, so everything on it is visible at once. In a real 412 × 915 viewport
with a 358-tall pinned sheet, the visible band above the sheet is 45 → 557, and
the head column runs 91 → 585 — so the hero's last 30px and its pagination are
under the sheet until you scroll. This is a consequence of the block's measured
position, not a bug in the build: the fix is either lifting the head column by
~60 or shrinking the hero slot, and both are design decisions.

**No glare on the CTA.** The `coupon-v3` and `fab` pages sweep a highlight
across the gold button; this design doesn't draw one, so it isn't here. It is
the same recipe if you want it.

**Urbanist is the variable face.** The export uses 400 / 500 / 600 / 700 of it —
the headline is 600, the plan figures 400/700, the CTA 700. One woff2 covers
all four. The testimonial signatures need italic 700, which is a second file.

**Testimonial photos.** The export embeds one (Mateo's); the other four cards
carry photos from the earlier prototypes' asset set so the row isn't four empty
squares. Swap them in `copy.js`.

**`Sarah, daily` says 30 minutes.** The hero pill on the same page says `40
Minutes`, and the FREE-vs-PRO table on the offer paywall says `Upto 40min/day`.
Built as the Paper frame has it; one word in `copy.js` if 40 is right.
