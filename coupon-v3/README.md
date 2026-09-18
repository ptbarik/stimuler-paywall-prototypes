# Stimuler V3 · the coupon paywall

One screen, two tiers. The coupon ticket only — the starburst badge that shared
this codebase in [`fab/`](../fab) is removed rather than switched off, so there
is no dead branch pretending to be a choice.

```bash
npm install
npm run dev        # http://localhost:5173
```

`?tier=pro` and `?tier=plus` open a tier directly; the switch inside the phone
keeps the URL in step. The frame scales to whatever the header leaves, measured
off the DOM — the pinned CTA is the thing being judged and it cannot be below
the browser's fold.

## What V3 changed

Diffed against the September exports rather than re-read, so the list is exact.
Nothing else moved: the 31.5px interval between coupon, timer, heading and
feature card is untouched, and so is the comparison table's 84.8px column pitch.

| | out of V2 | V3 |
|---|---|---|
| Feature card | `rgba(50,44,109,.3)` on PRO | `rgba(255,255,255,.06)`, both tiers |
| Section chips | hairline outline, Inter Display | solid plate, **Geist** 500 / 13.73, 38 tall |
| Chip fill | — | `#191935` (PRO) · `#140901` (PRO+) |
| PRO yearly card | translucent tint | solid `#201C47` |
| PRO+ chrome black | `#000000` | `#140901` |
| PRO+ CTA ink | `#130800` | `#402305` |
| PRO+ `50% OFF` chip ink | dark | `#FFFFFF` |
| Table pills | PRO+ carried a translucent PRO pill | identical across tiers |
| Active toggle label | 600 | **700** |
| Roadmap Days | `50+` vs `100+` | `100+` in **both** columns |

Two of those are worth a second look before this ships.

**Roadmap Days now says `100+ Days` on both sides.** Both exports have it, so
it is carried as drawn rather than corrected — but it leaves the row comparing
nothing, with PRO's value in white and PRO+'s in grey saying the same thing. If
that is a copy slip rather than a product change, it is a one-line fix in
`copy.js`.

**The active toggle label is 700 on both tiers here, and the exports disagree.**
PRO+ was updated to 700; PRO still reads 600. The switch has to be symmetrical
— the same control cannot change weight depending on which half is live — so
both are bold.

## The two animations

### The CTA's glare

The bar being swept is the design's own. V3 added `Rectangle 100868` inside the
CTA: 20.37 × 123.28 at 45°, `#5E52FF` on PRO and `#F2BE61` on PRO+, with
`isolation: isolate` on the button around it. So this is not a highlight
invented for the prototype — it is the file's geometry given somewhere to go.

Three things separate it from a literal read of the export.

**It composites additively.** The export paints the bar as a flat fill, and
`#5E52FF` is lighter than the button at its ends but *darker* than it at the
middle stop (`#6F64FF`). Painted opaquely the bar therefore brightens the edges
and dims the centre — the exact opposite of a glare. `plus-lighter` keeps the
design's hue and makes it lighten everywhere it crosses.

**Its edges are feathered across the whole 22px.** A hard-edged rectangle
crossing a gradient this smooth reads as a rectangle. The stops ramp
symmetrically, so the brightest point is a line with no width.

**It travels linearly.** No easing at either end. Light crossing a surface moves
at one speed; any acceleration makes it read as an object being dragged instead.
The rest between passes happens off the right-hand edge, so the eye never
catches it waiting — 62% of the 3.6s cycle is travel.

`isolation: isolate` is load-bearing and is the export's own: it gives the
button its own stacking context, so the bar composites against the gradient and
is clipped by the pill instead of escaping over the price sheet.

### The selected price card's rim

One conic gradient turning behind the card, masked down to the 1.5px ring: the
card's own box punched out of a full-bleed plate with `mask-composite: exclude`,
so what survives is exactly the border — and it follows the 11.5px radii for
free.

**`@property` is what makes it turn at all.** A bare custom property is a string
to the animation engine and would step between keyframes rather than
interpolate. Declaring `--rim-a` an `<angle>` is the whole trick.

**It is additive over the static border, not instead of it.** The outline stays
a full outline at every point in the cycle and simply brightens in one place.
Painted opaquely it would read as a segment chasing a gap.

The lit arc is ~70° of the 360 with a white core and falloff at both ends, on a
6s linear turn — slower than the CTA's glare on purpose. Two highlights on the
same 100px of screen competing at the same tempo read as a loading state.

One honest limitation: a conic gradient's angular speed is not the same as
perimeter speed on a rectangle, so the shine moves faster across the short
edges than the long ones. On a 183 × 77 card the difference is small enough to
read as natural. It would not be on something much wider.

## Layout

```
src/
  theme.js               the two tiers, key-for-key, with `glare` and `rim`
  copy.js                every string, and the places the tiers disagree
  Icons.jsx              redrawn on a 24-grid — the export flattens its icons
  index.css              the glare and rim keyframes, and the font faces
  components/
    Paywall.jsx          the page
    CouponTicket.jsx     the offer, and its pop
    Chrome.jsx           status bar, close, tier switch, timer
    Sections.jsx         features, table, proof, testimonials, FAQ, sheet
```
