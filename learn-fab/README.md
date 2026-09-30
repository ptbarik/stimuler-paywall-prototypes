# Stimuler · Learn — eleven floating actions, one slot

The Learn screen from Paper's `USA Paywalls` page, running, with all eleven
floating actions from the two FAB sheets dropped into the **390 × 96 slot** the
frame marks and switchable from a rail on the right.

```bash
npm install
npm run dev        # http://localhost:5173
```

`?fab=A1` … `?fab=G3` opens one directly.

| | |
|---|---|
| the frame | `13PK-2` — `2`, 412 × 844 |
| the slot | `new fab 1`, 390 × 96, parked below the artboard as a size marker |
| eight of the eleven | `1474-2` — *FAB · static states for animation (390×96 slot)* |
| the other three | `14FD-2` — *glass + gold, three options* |

## What is being compared

Eleven answers to the same question — *how loud should a permanent upsell be,
and what should it be made of* — over the same screen, at the same slot, with
the same clock.

| | | |
|---|---|---|
| **A1** | Crossfade readout | two messages, one slot; the offer and the clock trade places every 3.2s |
| **A4** | Depleting rim | the border *is* the clock — one 24h sweep, no readout at all |
| **A5** | Sarah, with the S mark | a person rather than a crown, with a ring that pulses out every 8s |
| **B1** | Two-tier | the loudest: a band for the offer over a row that is a clock and a button |
| **N1** | Collapse on scroll | gets out of the way while you read, comes back when you stop |
| **N2** | Last hour | above an hour it is amber and HH:MM:SS; under it, MM:SS on a red ground |
| **N3** | Earned entrance | absent until a lesson lands — the only one not on screen at rest |
| **N4** | Shine sweep | nothing changes; a 22° band crosses the action every 4.75s |
| **G1** | Frosted pane | neutral frost, gold twice and only twice — the crown and the action |
| **G2** | Gold-tinted glass | the pane itself is warm; what is underneath reads through amber |
| **G3** | Edge-lit | colourless pane, a 2px gold bevel light, the action outlined not filled |

The **entrance is shared** — up from below the slot, one overshoot, the fade
running ahead of the spring. Which floating action is right is a question you
answer by comparing the objects; eleven different arrivals would turn it into a
question about arrivals. N3 is the exception, and deliberately so: its whole
argument is that it should not be there until you have earned it.

## The rail

Eleven rows in the sheet's own A / B / N / G grouping, and under them the
controls the selected variant actually reacts to — the panel says which of
those you are looking at rather than showing every control at all times.

- **Time left** — the three stops the sheet drew its keyframes at: `23:59:41`
  (rim full), `13:12:00` (rim at 55%), `00:52:00` (inside the last hour). The
  clock then runs down live from wherever you put it. A4 and N2 are driven by
  it; the rest only read it out.
- **Land a lesson** — brings N3 on. Picking N3 lands one for you a beat later
  so you see the entrance it is about; the button replays it or takes it away.
- **Replay entrance** — replays the arrival for whichever is selected.
- **Scrolling** is not a control. N1 reads the roadmap's real scroller, so you
  scroll the phone.

Under 900px wide the rail folds to two strips above the frame. The frame is the
thing that has to stay whole.

## Where the numbers came from

The frame and both sheets were read out of Paper node by node — geometry from
`get_jsx` and `get_computed_styles`, never off a screenshot.

- **The slot is 390 × 96 and it is centred**, so 11 in from each edge. The
  `new fab 1` rectangle is parked 3282px below the artboard as a pure size
  marker — it says how big, not where. It sits **14 above the nav**, which is
  the gap the earlier five FAB directions kept at their own 68px height.
- **The nav is 94 tall on `#050505`.** In the export it is drawn as the last
  child of Unit 1's group and lands at the bottom of the frame only because
  Unit 1 happens to be 712 tall. It is a nav bar; it is lifted out of the
  scroller here so that it stays where a nav bar stays.
- **The roadmap has three lanes**: the rail at 22.63, the cards at 76.63, both
  inside a column that starts at 20 — which is where the header starts too.
  Rail 32.33, gap 21.67, card 314.
- **A group is 360 + 104 + 2 + 104**, and its rail nodes sit at 16 from the
  top for the lesson and at the card's own centre for each exercise. That model
  reproduces the export's node positions to within 4px across all six groups,
  and Unit 1's group height to 1.2px.
- **The rail is one line per unit**, first node centre to last, with the nodes
  drawn on top in an opaque fill. The export builds the same picture out of a
  separate segment per gap; a single line under opaque discs is the same result
  and cannot drift out of register with the circles it is supposed to stop at.
- **A4's rim is 928 long**, which is the export's number and *not* the true
  perimeter of a 390 × 96 rounded rectangle. Recomputing it would put the 55%
  state at a different place on the corner than the frame it was signed off in.
- **The golds are written in oklab in the export** and resolved to hex here, so
  eleven buttons cannot quietly disagree with each other on a browser that
  interpolates differently. `oklab(80.9% 0.013 0.135)` is `#E9B94C`, which is
  the file's own `--color-gold` to a digit.
- The learner photo is the file's own asset, at the export's crop. The locked
  and premium lessons have **no** art in the design — what is there is Paper's
  missing-image placeholder, and it is rebuilt as one rather than filled in
  with a photograph the design has never had.

## Six calls worth arguing with

**N1 collapses to the left, not to the corner.** The sheet's three states are
laid out left-aligned in a row, which tells you the widths — 390, 222, 96 — and
nothing about which edge is pinned. Collapsed, the button is a *crown*, and the
crown is on the left at rest; so the crown stays put and the copy and the arrow
are what get dropped. Pinning it right instead would slide the crown 294px
across the screen while shrinking, which reads as the button being replaced
rather than folded. Worth a second opinion — bottom-right is where a collapsed
FAB usually lives.

**N3's absent state is nothing, not a dashed box.** The sheet draws it as a
dashed slot reading `nothing here yet`. That is the sheet telling you where the
button would be. On the screen itself, absent means absent.

**The glass three have less to work with here than on the sheet.** The sheet
shows G1–G3 over a purple lesson card, because a glass surface with nothing
behind it is a grey rectangle. At the real slot, 14 above the nav, what is
behind the button is usually the roadmap's own near-black ground — so the frost
does nothing until you scroll a card under it. That is not a bug in the build;
it is the finding. Scroll a lesson card under the slot and G1 and G2 come
alive; leave the page at rest and G3, which never depended on colour behind it,
is the only one of the three still doing something.

**The blur is real.** The sheet had to fake the glass with a pre-blurred copy
of the card behind it. Here it is a live `backdrop-filter` over the actual
scroller.

**Unit 3's rail counts 5 and 6.** The export numbers its two nodes 2 and 3,
which is a duplicated group's numbering left behind rather than a decision. The
rail is one sequence and it counts through.

**The header is opaque, so the scroller starts under it rather than behind
it.** The design's own 135.43 to the first unit rule is preserved as the
scroller's top padding, so nothing moves at rest.

## Fitting

412 × 844 cannot reflow, and the whole point here is a button pinned 14 above
the nav — a frame you have to scroll the *browser* to see the bottom of hides
the one thing being judged. So the frame is fitted to whatever is left after
the header and the rail, measured off the DOM rather than assumed, both axes
checked with the smaller winning.

The fit is applied with `zoom`, never `transform: scale()`. A transform does
not change layout: the frame would keep reserving its full 844, the page would
scroll anyway, and — worse here — the pinned FAB and the roadmap's own scroll
container would end up computing against the unscaled box.

## Notes

- `prefers-reduced-motion` stops the shine, the ring and the crossfade drift.
- These are design prototypes, not production code. Prices, copy and the offer
  are exploratory and not a commitment to anything shipped.
