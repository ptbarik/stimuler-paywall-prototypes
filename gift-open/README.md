# Stimuler · tap the gift → the coupon paywall

The four floating actions from Paper's `New FAB` frame, on the real Learn
screen, each with its idle motion built — and tapping any of them takes the gift
to the middle of the screen, opens it, and turns the light out of the box into
the **V1 coupon paywall**.

```bash
npm install
npm run dev        # http://localhost:5173
```

`?s=1` … `?s=4` opens one directly.

| | | idle |
|---|---|---|
| **1** | Gold coupon | rattle + ribbons + wash |
| **2** | Gold pane, gift trailing | rattle + ribbons + one light |
| **3** | Tipped box | **sway** + ribbons + one light |
| **4** | Bloom glass | rattle + ribbons + one light |

## The idle loop

Everything runs on one **6s master cycle**:

| | |
|---|---|
| **0 – 1.2s** | the box works — rattle (1, 2, 4) or sway (3), with the ribbons |
| **1.32 – 3.0s** | one light crosses the pane, left to right |
| **3.0 – 6s** | still |

**The wash and the border glint are one object, not two.** They are the same
travelling band — same width, same starting x, the same `light-wipe` keyframes,
the same 14° skew — so the stretch of edge that lights is always the stretch the
wash is crossing. The border version is that band used as a *mask* on the
outline stroke, which is what keeps it quiet: the stroke can only be as bright
as the band's own falloff at that point, so it fades up and down instead of
arriving as a hard dash going round the perimeter. Turn the band's opacity down
and both get quieter together; there is nothing to tune separately.

The band itself is 170px wide, feathered at six stops and blurred 14px, so what
passes is a spread of light rather than the edge of a rectangle.

**The rattle** (1, 2, 4) rocks on the box's base — the pivot is the bottom
centre, so it tips like an object on a surface rather than spinning like a
sticker. Six diminishing swings, ±7° down to ±1.7°.

**The sway** (3) replaces it, because that box is already tipped at rest: it
swings *through* the upright and back — angle, straight, angle — across the
whole cycle, slow enough to read as an object being weighed rather than a
wobble.

**The ribbons** throw ±15° falling to ±4° with a 6% scale pulse, **70ms behind
the box**. The lag is the whole trick: an ear that moves *with* the head reads
as one rigid object; an ear that arrives late reads as an ear.

**Screen 1 has no border glint.** Its pane is gold paper and a lit gold line on
a gold field is invisible, so it takes the wash alone, a little brighter.

## The tap

Seven beats, 3.05s, every one overlapping the next:

| | |
|---|---|
| **0 – 660ms** | the box travels to the middle and grows 2.4×; the screen dims |
| **560 – 900ms** | the ribbon takes up its slack — the loops give a little |
| **1060 – 1520ms** | the box shivers and a seam of light opens under the lid |
| **1480 – 2020ms** | the lid lifts, tips and drifts off, **carrying the ribbon with it** |
| **1520 – 2080ms** | a coupon starts up out of the box — the top edge only |
| **1820 – 2620ms** | the light swells, one continuous move, out past the frame |
| **2080 – 2940ms** | it evens out; the paywall comes up inside the hold |

**The ribbon is never untied.** The band across the box stays on the box and the
band across the lid stays on the lid, so when the lid goes, the loops, the knot
and the top band all go with it as one piece — which is what a lid with a bow on
it actually does. An earlier version had it come undone and fall away, and a
ribbon dropping off the bottom of the frame read as debris rather than as a gift
being opened.

What is left is a small "take up the slack" on the loops at 560ms, before
anything travels: four degrees in, nine out, and settle. It is the box being
picked up, not the bow coming apart.

**The coupon is never readable.** It rises just far enough for its top edge to
clear the rim and no further, and it sits *before* the box in the stacking
order, so the box's own front wall hides the rest. Its top 34px are blank paper
by design — it could not show the offer even if a delay were nudged later. The
light arrives while it is still coming.

**The light is one move.** A single scale on a single curve, with the blur
applied before the transform so it grows with the light and the edge is never
crisp at any size. It used to be four keyframes with a hard-ish gradient stop,
which made it visibly stop halfway, set off again, and leave a rim you could
trace.

**The peak is a light yellow, not white, and it is short.** `#FBF0C4` — the same
family as the light that made it, so the hand-off from bloom to flat field has
nothing to see. It is solid for **0.29s** and dissolved within another **0.43s**.
It used to be white and hold for over a second, and a long white hold in the
middle of a transition is dead air.

## Three things that had to be got right

**The end-of-sequence timeout has to be stable.** The countdown re-renders the
app every second; an inline `() => setPhase('paywall')` would hand the opening
sequence a new callback each tick and restart its own timeout before it could
ever fire. The light expanded and then simply sat there. `useCallback`.

**The paywall has to come up inside the field's own hold.** It is mounted
underneath from the moment the sequence starts, and at first it faded in at
1.35s — early enough to read through the scrim while the box was still open, so
you could see the price sheet behind the coupon. It now goes to full between
**2.34 and 2.46s**, inside the 0.29s the field is solid. Being under the light
for a beat is a reveal; being under it for a second is a wait.

**`transform-box: view-box` measures transform-origin from the viewBox's corner,
not from (0,0).** These boxes are drawn in viewBoxes starting at negative
coordinates, so the ribbon's pivot at user `(50, 38.5)` has to be written as
`(58.963, 36.772)`. Wrong, and it opens around a point off the box. Rebased
pivots — and the lid's hinge — are in `gifts.jsx`, one set per shape.

## What is vendored

`src/paywall/` is the V1 coupon page from [`fab/`](../fab), copied unchanged
except for one thing: its own device shell — the 44px radius, the bezel and the
drop shadow — is dropped, because here the phone is the stage and the paywall is
only what is inside it. Everything else is the page as it ships at
[stimuler-paywall-offer.vercel.app](https://stimuler-paywall-offer.vercel.app).

## Notes

- The Learn screen is Paper frame `13PK-2` at the export's geometry, stretched
  to 892 so it and the paywall are the same object — which is what lets one
  become the other without the frame resizing under the transition.
- 412 × 892 is fitted to the window with `zoom`, never `transform: scale()`.
- `prefers-reduced-motion` stops all of it.
- Design prototypes, not production code.
