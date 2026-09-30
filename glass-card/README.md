# glass-card

The price bottom sheet from Figma `12222-26563`, built as real glass and put
over content you can move.

**https://stimuler-glass-card.vercel.app**

## What is here

Two separate things, deliberately kept apart:

1. **The card**, at the export's own numbers. Not rounded, not approximated —
   `49.418`, `11.497`, `19.1617`, `244.2876`. It is being compared against a
   Figma render side by side, so the fractions matter.
2. **The material**, rebuilt so the Figma Glass panel's five sliders actually do
   something in a browser.

## The material

Figma's Glass panel gives Light, Refraction, Depth, Dispersion, Frost and Splay.
CSS has exactly one of them: `backdrop-filter: blur()` is Frost. The rest are
*displacement* of what sits behind the pane, and the only way to displace a
backdrop in a browser is to reference an SVG filter from `backdrop-filter`.

So `src/components/Glass.jsx` generates a normal map on a canvas — a signed
distance field of the rounded rectangle, turned into an inward ramp, encoded as
`R = 128 + nx·t·refraction·127` and the same in green for `ny`. Neutral grey
means "leave this pixel alone"; toward the rim each pixel is pushed along the
**outward** normal, so the pane samples from beyond its own edge and the content
there stretches. That stretch is the whole illusion — it is what makes a pane
read as an object sitting on top of a screen rather than a blurred rectangle
painted into it.

Three `feDisplacementMap` passes read that one map at three slightly different
strengths, and `feColorMatrix` + `feBlend mode="screen"` recombines them one per
colour channel. That is Dispersion: glass bends red less than blue, and at the
rim of a real lens you can watch the two come apart.

| Slider | What it moves |
| --- | --- |
| Light angle / intensity | the specular rim, drawn as a gradient stroke on the sheet's own outline so it follows the 18px corners |
| Refraction | how hard the rim bends what is behind it |
| Depth | how far in from the edge the bend reaches — a 0-100 dial, `× 0.45` px |
| Dispersion | how far apart the three channel passes are pushed (`± 16 %` at 100) |
| Frost | the blur, the one part CSS already had (`× 0.2` → stdDeviation) |
| Splay | how sharply the bend falls off; 0 holds it at the rim, 100 spreads it inward |

Defaults are the values on the node: `-45° / 80 %`, Refraction 100, Depth 63,
Dispersion 50, Frost 23, Splay 0.

### Chrome only

`backdrop-filter: url(#filter)` is a Chrome feature. Safari and Firefox fall
back to `blur() saturate()` — frost, no refraction — and the rail says so. This
is detected with `CSS.supports('backdrop-filter', 'url(#a)')`, not by sniffing
the user agent.

### Filter units

`filterUnits="userSpaceOnUse"` **and** `primitiveUnits="userSpaceOnUse"` with an
explicit `x/y/width/height`, so `feImage` lands at 1:1 and `scale` is in CSS
pixels rather than a fraction of the bounding box. Without both, the map tiles
or the displacement changes strength when the pane resizes.

## Behind the glass

Three backdrops, because a blurred rectangle over a flat colour looks identical
whether it is refracting or not:

- **Pro screen** — what it will actually sit on.
- **Colour field** — saturated blobs with hard white bars, where dispersion
  splits into visible fringes.
- **Hairlines** — a 16px grid under an 80px grid. A straight line is the only
  honest test of refraction.

All three are taller than the frame. Drag or scroll the phone to pull content
under the pane; that moment is when it stops looking painted on.

**Pinned / Free** switches between the sheet sitting at the bottom edge and the
sheet being draggable anywhere over the backdrop.

## Notes from the export

- The yearly card's fill is an ellipse **rotated 130.937°**, which
  `radial-gradient` cannot express — Figma's own CSS export flags it as
  unsupported. It is rebuilt here as a rotated, clipped div at the SVG's
  `scale(64.8633 131.889)`, over a flat `#1C1843` base.
- The gradient border is `conic-gradient(…) border-box` **under** a
  `linear-gradient(#1C1843,#1C1843) padding-box` layer. Background layers paint
  first-listed-on-top, so the flat fill has to be listed first or the conic
  covers the whole card instead of just the 1px ring.
- The CTA radius exports as `957.127px`; the SVG path says `27`. It is 27.
- The CTA sheen's `matrix(-0.71,-0.71,-0.71,0.71,0,0)` is a 45° rotation about
  the rect's own origin, resolved here to
  `left: 63.78; top: -31.38; transform-origin: 0 0; rotate(45deg)`.
- `border-top: 1px solid #4C43BC` is drawn as an SVG stroke, not a CSS border,
  so it keeps its weight around the corners instead of tapering to nothing.

## Deep links

Every control is in the URL, so a particular setting can be sent to someone:

```
?scene=rules&refraction=60&depth=40&dispersion=100&frost=8&splay=70
?scene=field&flat=1          # glass off, for comparison
?float=1&sweep=0             # free-floating pane, CTA sheen held still
```

## Running it

```sh
npm install
npm run dev
```
