# Roadmap paywall — Pro ⇄ Pro+

A working prototype of the roadmap paywall: one 412×2558 page, a tier toggle in
the header that re-themes the whole thing indigo ⇄ gold, and the `02-ai-tutors`
animation running live in the hero.

```bash
npm install
npm run dev      # http://localhost:5173
```

Source designs — Figma `Stimuler V3`:

| | |
|---|---|
| Pro | [`11032:8142`](https://www.figma.com/design/osWKdxXI45xzDtfNglTAjc/Stimuler-V3?node-id=11032-8142) |
| Pro+ | [`11032:8409`](https://www.figma.com/design/osWKdxXI45xzDtfNglTAjc/Stimuler-V3?node-id=11032-8409) |

Both were exported to `~/Desktop/Roadmap Paywall/` as SVG + PNG, and everything
below was measured out of those two files rather than eyeballed off a screenshot.

## The two designs are one page

Pro and Pro+ are the same 412×2558 layout in two palettes. The toggle, the
headline, the hero slot, the benefit card, the table, the social proof, the FAQ
and the sheet land on identical coordinates in both files. What changes is
colour, the header glow's x (Pro's sits 85px right of Pro+'s), which table
column is highlighted — and exactly two strings:

- benefit row 2 — *"Up to 40mins conversations with Sarah"* vs *"Get unlimited
  conversations with Sarah"*
- the plan names and the CTA verb — `PRO YEARLY` / `Get Stimuler PRO` vs
  `PRO+ YEARLY` / `Get Stimuler PRO+`

So this is one component with one piece of state, not two screens. Every tier
colour is a CSS variable on `.frame[data-tier]`, and the swap is a 250ms
ease-out with a 40ms stagger stepped outward from the thumb (`.s1`–`.s5`) —
the same recipe the earlier Pro/Pro+ prototypes use, so the three feel like
one product. The thumb itself travels on a spring rather than the ease-out:
the thing that *moves* should settle, the things that only *recolour* should not.

The table's highlight travels with the tier for the same reason it does in
iteration A and B — the column you are buying is the one reading in white,
which is what stops this being a paid-vs-paid grid that hands the decision to
price.

## The hero

The export leaves a **370×330 block at (21, 265.3)** where the animation goes,
and 370×330 is exactly the frame `02-ai-tutors` was composed to, months earlier,
in its own project. So it drops in at native size — no scale, no re-layout — and
its own built-in *"Learn with 12+ AI tutors"* caption lands at page y 527.6
against the export's 527.9.

`src/scenes/lesson/` is that project's `src/`, vendored unedited (`diff -r`
against `~/Desktop/stimuler-animations/02-ai-tutors/src` is clean apart from its
own `App.jsx`/`main.jsx`/`index.css`, which are its harness, not the scene). The
scene paints `#0D0B10` so it reads as a card in its own project; here it sits
straight on the page, so that background is cleared from the stylesheet
(`.hero > * {background-color:transparent!important}`) rather than by editing a
vendored file.

One deliberate difference from the static export. The design freezes the fan at
**63.8% of its travel** — the tiles are tucked in tighter than the animation
leaves them when it settles. That frame is `Lessons 2` in the scene's own source,
i.e. a sample of the fan, not a keyframe of its own; the animation passes
through it at ~1.05s and then opens to full. Nothing was clamped to hold the
export's frame — at full fan the right tile still ends at x 388.6 inside the
391px slot, so it fits, and freezing a 5s animation on its second beat to match
a still would be the wrong trade.

## What was measured, and how

The exports outline their text, so there is no Figma text node to read a font
size off. Positions are path bounds; colours are fill and gradient-stop
attributes; type sizes are back-solved by rendering, measuring the ink bounds of
each run against the 1:1 PNG, and correcting. Every headline, label, price and
question in the page is now within **1px** of the export, vertically and
horizontally, and the flats and ramps are within a few 8-bit levels.

A handful of things the export settled that a screenshot would not have:

**The dividers in the table and the dividers in the FAQ are different objects.**
The FAQ's are `#6F91FF` fading to nothing at both ends at 50%; the table's are a
left-to-right ramp `#3F58AC → #C9D6FF` at full. They look similar at a glance
and are not interchangeable.

**The table's rows are not centred in their bands.** Row 1 sits ~3px below the
middle of the gap under the pills and row 5 sits ~5px below its own, so a
`mid = (band[i] + band[i+1]) / 2` model puts the last two rows visibly high.
`TABLE.mids` is measured per row instead. The values also run on tighter leading
than the labels — 16px against 22 — which is what keeps *Daily / practice*
reading as one cell against *Chat with Sarah* beside it.

**The blurred bar on the sheet's top edge is behind the sheet.** It sits before
the sheet's own group in the export, and the sheet is opaque, so all that
survives is the 20px of blur reaching up past the edge. Painted over the sheet
instead — which is where it naturally lands if you nest it — it washes out the
top of the price area by about 20%.

**The sheet's gradient starts 89px above the sheet.** Its stops run 2226.6 →
2558 while the sheet itself is 2316 → 2558, so pinning the ramp to the box makes
the whole price area a third too light. The stops in `--sheet` are re-solved for
the 242px box.

**The toggle's hairline is drawn mirrored.** The track carries
`transform="matrix(-1 0 0 1 …)"`, so its gradient's own coordinates run
down-and-*right* in local space and down-and-*left* on screen — and the box only
sees the middle 71% of the ramp. Read straight off the stop list it comes out bright
along the bottom instead of down the right-hand edge.

**The section chips' rim is the tier's colour, not grey.** The grey ramp in the
file belongs to the toggle. The chips use `#534ABD → #B0A9FF → #534ABD` on Pro
and the gold equivalent on Pro+, and Pro+ drops the whole chip group — fill, rim
and label — to 60%.

**`mix-blend-mode: plus-lighter` needs something to add to.** Two of the three
header glows are plus-lighter. In an isolated container they blend against
transparency and then composite normally, which lands about 30% short of the
export; the container carries the page colour so they add to it, as they do in
the file.

## Deliberate departures

- **The headline is centred.** The export has both its lines centred on x 211
  rather than 206 — a consistent 5px offset that nothing else on the page shares
  (the toggle, the hero, the benefit card, the table, the CTA and the home
  indicator are all centred on 206). Read as a slip, not an intent.
- **"Worldwide" has no trailing dots.** The Pro+ export reads `Worldwide..`;
  Pro reads `Worldwide`.
- **The FAQ answers are written here.** The export only draws the collapsed
  state. The block is the last thing on the page, so opening a row only grows
  the page rather than moving anything above it.
- **Prices, copy and the tier split are exploratory** and are not a commitment
  to anything shipped.

## Layout notes

- The frame is 412×917 and cannot reflow, so it is fitted to the window with
  `zoom` — never `transform: scale()`, which leaves the pinned sheet and the
  scroll container in the wrong place at any window that isn't exactly 917 tall.
- The page is the export's full 2558 and the sheet is pinned over the bottom 242
  of the *viewport*. The export leaves the bottom 242 of the page empty for
  exactly that, so at full scroll the last FAQ row clears the sheet instead of
  sitting behind it.
- The benefit icons are the export's own paths at their export coordinates,
  which is why each `viewBox` is the icon's 28×28 slot where the export drew it
  rather than `0 0 28 28`.

## Prototype controls

Bottom-right: tier switch, play/pause, a scrubber across the 5s loop, and a
reduced-motion toggle. `×` hides the panel. The toggle in the page itself is the
real control — the panel's is a shortcut.
