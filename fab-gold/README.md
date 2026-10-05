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

The motion is the StressWatch pricing shot's anatomy, rebuilt: a faceted
rosette arrives, a second one counter-rotates in behind it, topographic rings
settle around them, the figure and the struck-through old price fade up, and
the two rosettes then turn against each other forever. None of that shot's
colour, copy, layout or assets are here — the geometry is generated in
`starburst.js` and the palette is the tier's own.

**The rosette is generated, not exported.** Two radii, a corner radius and a
point count; every fill downstream is a function of the same vertex ring. The
facets are one triangle per half-lobe, each shaded by the cosine of its own
direction against a fixed light angle — so the badge lights from the upper left
as one solid, and when it spins, its shading spins with it. That is the part
that would have been impossible with a flat export, and it is the reason the
entry reads as an object turning rather than an image scaling.

**It arrives as itself, at size.** There was a seed dot here that scaled up
into the badge, and it read as a loading spinner resolving rather than as an
object turning up — the eye spends the first 300ms asking what the dot *is*
instead of reading the offer. The entrance is now V1's, beat for beat: up from
below its own slot, already legible as a rosette, tipped, landing on one
overshoot. Both versions answer *how does the discount get here* the same way,
so the comparison between them is about the object and not about its arrival.

It starts at half size rather than V1's third. The ticket is 250 wide and reads
as a ticket at a third of that; the rosette is 196, and at a third it is a 70px
blob with its own blurred shadow around it — indistinguishable from the seed
dot the entrance replaced. Half is where the nine lobes are still countable.
The fade is 130ms and starts *ahead* of the spring for the same reason: at
220ms the badge was still under half opaque while already travelling, and a
half-opaque badge on this ground is exactly the pale blob being avoided.

**The two rosettes turn against each other, forever.** Front clockwise on 80s,
back counter on 110s. Opposed rather than together, because two shapes rotating
the same way at different speeds read as one shape with a rendering bug;
opposed, they read as two objects. A full 360° rather than the 40° the
nine-fold silhouette would allow — the facet shading is fixed to the shape and
turns with it, so only a whole revolution puts every facet back where it
started, and anything less loops with a visible jump in the lighting.

The cast shadow sits *outside* both spins. A drop shadow that rotates with its
object swings its offset around the badge like a clock hand, which is the one
thing that would give away a flat shape being turned rather than an object with
a light above it. The figure is outside the spin too, in HTML over the svg — a
discount that rotates is a discount nobody can read.

**The figure lands late, and after the overshoot.** `50%` fades at 440ms, past
the badge's own settle. Overlapping them puts two things overshooting inside
the same 200ms and the result reads as bounce; separated, the badge is weight
and the figure is arrival.

**The label above it is gone.** There was a `✦ WELCOME OFFER ✦` line and a
`For limited time only` subtitle here. The badge says `50% OFF` and the heading
two intervals down says `Limited Time 50% Offer Today` — the label was a third
statement of the same fact, and the one with nothing to add. The figure inside
is a *fraction* of the badge (19.5%) rather than a fixed size, so growing the
badge gives the number margin against the rosette's waist instead of taking it
away.

**The badge got bigger by overrunning its slot, not by claiming more of one.**
`size` is the svg's box; `slot` is the column the block actually reserves. The
rosette's outer radius is 78 of the viewBox's 110, so at `size` 276 the badge
draws 196 across — which is exactly `slot`. The badge fills the column it
claims; the extra 80 of `size` is the margin the *rings* need, and they spill
out of it.

So the field reaches ~320, passing behind the timer below and under the
header's blur above at 4–8% opacity — while the timer, the heading and the
feature card stay on the lines V1 puts them on, and the card keeps its glimpse
above the price sheet in both versions. Claiming the column instead would have
cost that glimpse, which is worth more than the one faint ring that now crosses
a countdown.

**Three rings, a clean 0.25 apart, from 1.12× out to 1.62×.** Five and seven
were both tried: past three they stop being a field the badge sits in and
become a pattern in their own right, competing with the figure they exist to
frame. Three is also what lets them be spaced *widely* — at five, reaching the
same distance meant 0.15 steps, and adjacent rings that close read as one
thick, fuzzy edge rather than as separate contours. The innermost starts at
1.12 rather than hugging the badge at 1.04, where it read as an outline drawn
on the rosette instead of the first line of something around it.

`contour()` takes the ring's radius **as a multiple of the badge's** rather
than an abstract spread factor, because how far the rings reach past the badge
is the one thing about them anybody ever wants to change and it should not
require solving for it. Stating them as radii is also what fixed their spacing
— under the original formulation the first three all landed inside 1.08× and
could not be told apart. The relaxation toward a circle is capped at 0.75 so
even the outermost keeps a slow undulation: a ring that has gone fully circular
stops belonging to the badge and starts looking like a halo drawn around it.

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
