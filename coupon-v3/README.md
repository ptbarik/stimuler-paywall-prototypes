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
| Active toggle label | 600, dark ink | **700**, white ink on PRO |
| Toggle track | no stroke | 1px `#8A8991` hairline |
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

**The switch's white ink is PRO only.** The 18 Sep screenshot post-dates the CSS
export and moves PRO's live label from `#171436` to white, and gives the track a
`#8A8991` hairline. The hairline is structural and applies to both tiers (warmed
to `#8F8577` on gold). The white ink does not: white on PRO+'s `#FFE292` is
about 1.3:1 and unreadable, so PRO+ keeps `#130800`. If the gold pill was
darkened in the same pass, send that frame and both go white.

## The CTA's shine

A 24%-wide highlight crossing the button at 20°, resting off the right-hand
edge for two thirds of its 4.2s cycle. Three things about it.

**It is at 20°, not vertical.** A vertical bar reads as a wipe across the
button; angled, it reads as light moving over a surface.

**It rests.** A highlight that is always mid-crossing stops being an accent and
becomes a spinner, which on a purchase button reads as *pending*.

**`--shine` is the tier's own.** White on PRO's indigo; a warm white on PRO+,
because pure white over that gold blows out rather than glints.

It is a CSS keyframe rather than a spring because it is ambient — it reacts to
nothing, and driving it from React would re-render the price sheet sixty times a
second for a decoration. `isolation: isolate` on the button is the V3 export's
own and is load-bearing: it gives the button its own stacking context so the
sweep is clipped by the pill instead of escaping over the sheet.

The V3 file draws a glare bar inside the CTA as geometry — `Rectangle 100868`,
20.37 × 123.28 at 45°, `#5E52FF` / `#F2BE61`. An earlier build animated that
literally. It is not used: painted flat, `#5E52FF` is lighter than the button at
its ends but *darker* than it at the middle stop (`#6F64FF`), so the bar
brightened the edges and dimmed the centre. The sweep above is the one that
reads as light.

**The selected price card has no running rim.** An earlier build put a conic
gradient round its border. Removed — two highlights inside the same 100px of
sheet compete, and the CTA is the one that should win.

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
