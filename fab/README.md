# Stimuler · paywall — the offer block, two ways

One paywall, built twice. The page is identical top to bottom; the only thing
that differs is **how the discount is presented**, and one chip in the price
sheet that follows from it.

| | | |
|---|---|---|
| **Version 1** | Coupon ticket | the export as drawn — the discount on paper |
| **Version 2** | Starburst badge | the discount as an object that arrives |

Both versions carry the **Stimuler Pro ↔ Stimuler Pro+** switch, so there are
four screens in the deploy and the toggle is shared across the two frames —
comparing V1's coupon against V2's badge is only fair if both are wearing the
same palette.

```bash
npm install
npm run dev        # http://localhost:5173
```

`?v=1` and `?v=2` open a single version. Above 1024px wide both are up at once,
side by side, on independent scrollers — which is the point: *which offer block*
is a question you answer by looking at two of them, not by remembering one.

**The frame always fits the window.** 412 × 892 is scaled to whatever is left
after the header, measured off the DOM rather than assumed, so changing a word
in the header cannot push the phone below the fold. That matters more than it
sounds: the pinned CTA is one of the things being judged, and a paywall you
have to scroll the *browser* to reach the bottom of cannot be judged at all.

## Where the numbers came from

Two Figma CSS exports, `PRO` (412×2469) and `PRO+` (412×2468). They are the
same frame twice with four substitutions — the conversation line, the user
count, the rating and the first FAQ — so `theme.js` is two objects with
identical keys and nothing under `components/` knows which tier it is drawing.
It only reads `t.*`.

Worth writing down, because they are the things that were measured rather than
guessed:

- **The page has one vertical interval, and it is 31.5px.** Coupon → timer →
  heading → feature card, all 31.5 apart in the export. V2 keeps it. That is why
  the badge is 196 rather than sized to fill the space the coupon vacated:
  swapping the block changes what the offer *is*, not the rhythm the rest of
  the page is set to.
- **The comparison table's value columns are at 190.3 and 285.3, 84.8 apart.**
  Those are the two `w-[85px]` cells.
- **The coupon is 250.17 × 137.49** on `#FEF4CB`, with three `#D9D9D9` notches
  a side at y 38.86 / 62.77 / 86.68 at r 5.98. The export builds its scalloped
  edge as a `Subtract` of six ellipses out of a 26.9-radius rectangle, so
  `CouponTicket.jsx` rebuilds it the same way — one path with six arc bites,
  because the notches have to cut the paper rather than sit on it.
- **The hatch is 43 strokes at 35.64°**, generated at that angle rather than
  listed as `Vector 53`–`Vector 95`.
- **The tier switch is 244.05 × 43.38 with a 113.45 × 33.77 knob**, inset 4.8.
  It is one element that slides, not two that cross-fade, so the two halves are
  the same object at two positions.

The trophy and the learner photo are the only raster assets, and both were
lifted out of `PRO.svg` — they are the file's own two embedded images, decoded
from their base64 rather than re-sourced.

## Version 2 — what the badge is doing

The motion is the StressWatch pricing shot's anatomy, rebuilt: a seed dot sits
alone, springs open into a faceted rosette that lands on one overshoot, a
second rosette counter-rotates in behind it, topographic rings blow out past
the edge and settle faint, and only then does the figure inside and the
struck-through old price fade up. None of that shot's colour, copy, layout or
assets are here — the geometry is generated in `starburst.js` and the palette
is the tier's own.

**The rosette is generated, not exported.** Two radii, a corner radius and a
point count; every fill downstream is a function of the same vertex ring. The
facets are one triangle per half-lobe, each shaded by the cosine of its own
direction against a fixed light angle — so the badge lights from the upper left
as one solid, and when it spins, its shading spins with it. That is the part
that would have been impossible with a flat export, and it is the reason the
entry reads as an object turning rather than an image scaling.

**The dot is the badge, not a placeholder for it.** It is 7px of the back
rosette's own fill; when the spring fires, the thing that grows is already on
screen. That is what makes the entry read as one object arriving rather than
two objects swapping.

**The figure lands late, and after the overshoot.** `50%` fades at 520ms, past
the badge's own settle. Overlapping them puts two things overshooting inside
the same 200ms and the result reads as bounce; separated, the badge is weight
and the figure is arrival.

**The label above it is gone.** There was a `✦ WELCOME OFFER ✦` line and a
`For limited time only` subtitle here. The badge says `50% OFF` and the heading
two intervals down says `Limited Time 50% Offer Today` — the label was a third
statement of the same fact, and the one with nothing to add. The height it
freed went into the badge, not into whitespace: it is 244 rather than 196, and
the figure inside is a *fraction* of that (19.5%) rather than a fixed size, so
growing the badge gave the number margin against the waist instead of taking
it away.

The whole timeline is one object at the top of `StarburstOffer.jsx`, so the
numbers quoted above and the numbers that run cannot drift apart.

## Version 1 — the pop

The ticket arrives rather than appears: it comes up from below the fold of its
own slot, small and tipped nine degrees, and lands on one overshoot. Three
things do the work and they are deliberately not simultaneous.

**The paper lands first, and alone.** Nothing else moves during its overshoot,
so the bounce reads as the weight of a physical thing rather than a page full
of elements springing at once.

**The shine crosses on the settle, not on the landing.** It starts at 480ms,
after the paper has stopped travelling, and runs at the hatch's own 35.64° so
the two read as one surface. A highlight sweeping across something still in
motion reads as a glitch; across something at rest it reads as paper catching
the light, which is the entire argument for putting a discount on a ticket.

**The figure is last and overshoots hardest.** `50% OFF` is the one number on
the block that has to be read, so it is the one thing allowed a second bounce
after everything else has settled.

## The chrome

**The toggle and the CTA are both pinned**, at the top and the bottom of the
frame. The toggle is the first decision on the page and has to stay reachable
while the comparison table is being read; the CTA is the last one and should
never need to be scrolled to.

Behind the toggle is a *masked* backdrop blur, not an opaque bar. A solid band
would cut the frame in two at a fixed line and make it read as two panes; the
mask lets the blur fall off to nothing over its last 45%, so content passing
under it dissolves instead of meeting an edge. The wash on top is the page's
own top stop, so the band is the background densified rather than a new colour
laid over it — which is why it survives the tier switch without a second value.

**The CTA carries a shine** crossing at 20°, 24% of the button wide, resting
off the right-hand edge for two-thirds of its 4.2s cycle. A highlight that is
always mid-crossing stops being an accent and becomes a spinner. It is a CSS
keyframe rather than a spring because it is ambient — it reacts to nothing, and
driving it from React would re-render the price sheet sixty times a second for
a decoration.

## The one content difference

V1's yearly card carries a `50% OFF` chip. V2's does not — the badge has
already said `50% OFF` two hundred pixels up, so repeating it on the chip is
noise. The card shows the price it replaces instead, struck through as the
badge settles. That is the only copy change between the two versions, and it is
the argument V2 is actually making: if the discount is a thing you watched
arrive, the sheet no longer has to re-state it.

## Layout

```
src/
  theme.js                 the two tiers, key-for-key
  copy.js                  every string, and the four places the tiers disagree
  starburst.js             the rosette: ring, roundedPath, facets, contour
  Icons.jsx                redrawn on a 24-grid — the export flattens its icons
  components/
    Paywall.jsx            the page, once. `variant` picks the offer block
    CouponTicket.jsx       V1, and its pop
    StarburstOffer.jsx     V2, and its timeline
    Chrome.jsx             status bar, close, tier switch, timer
    Sections.jsx           features, table, proof, testimonials, FAQ, sheet
```
