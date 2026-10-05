# Stimuler · the FAB, four ways it opens

Four directions against the redesign brief, plus the earlier rounds kept for
reference. All of them open the **V2 starburst paywall**.

```bash
npm install
npm run dev        # http://localhost:5173
```

`?s=s` … `?s=v` opens a direction. `?s=b` … `?s=r` opens an earlier round.
`?open=1` lands straight on the paywall, `?open=play` runs the tap from frame one.

## S–V · the four directions

The rule all four obey: **nothing on the tab says the whole offer at rest.** A
seal is shut, a reel is on another line, a tag is folded, a rail is unfinished.
Standing still, the tab's job is to look like something that has not finished
happening yet — and the copy completes as it opens.

| | | | |
|---|---|---|---|
| **S** | The Seal | 56px | unwrap — sealed means unopened means unread |
| **T** | The Reel | 54px | four benefits one at a time, price last |
| **U** | The Tag | 52px | three folded panels, one lifts at a time |
| **V** | The Rail | 52px | the Learn screen's own rail; the offer is earned |

**S · The Seal.** Idle the two ribbon tails lift 8° and a 14px sliver of gold
slides out from under the seal and retracts. Tap: the seal splits on a
diagonal, the ribbon unspools rightward, and the copy is *printed by its
leading edge* — masked, not faded, so the words are uncovered as the ribbon
passes over them. At 620ms the halves rejoin as one disc and bloom.

**T · The Reel.** One line every 2.2s through a masked window; the fourth lands
differently — it overshoots 3px, the rim warms bronze to gold, a bloom passes
behind it. Tapping mid-reel **accelerates and stops** on the offer rather than
interrupting, so an impatient tap still gets the payoff.

**U · The Tag.** Three panels hinged at their bottom edges, `rotateX` −92° to 0.
Idle it lifts one at a time, cycling, so a second glance shows a different
reason. The crease is a 1px line plus a cast shadow on the panel beneath —
without the shadow a fold reads as a cross-fade.

**V · The Rail.** Three nodes and a thread, continuing the roadmap's own
language. **Only the next empty node breathes** — the moving thing on the
screen points at the next action, not at the purchase. At 3/3 the nodes slide
together and the thread curls into a ring, which is the disc. Tapped below 3/3
it does not open the paywall: a 6px nudge and the copy swaps for 1.5s. The
lessons dial in the rail sets 0–3, because all four states are the design.

### Copy, by direction

| | |
|---|---|
| S | "A sealed offer" → "Half price…" → "Half price. Today only." |
| T | "Unlimited calls with Sarah" → "300+ exercises" → "Your plan, rebuilt weekly" → "50% off today" |
| U | "Something for you" · "PRO" → "Unlimited" → "Half price" → "Today only" |
| V | "Finish a lesson to start" → "1 more to unlock it" → "Unlocked — 50% off PRO" |

## Earlier rounds

## The two halves

**B, C, D, F — the badge is on the tab.** Unchanged from the first set. They
carry the paywall's own rosette, and the tap flies that exact object into the
paywall's slot.

| | | | |
|---|---|---|---|
| **B** | Struck coin | 54px | the tab is the coin face, badge punched out in shadow |
| **C** | Contour field | 52px | the paywall's rings as the tab's own ground |
| **D** | Stub ticket | 58px | the die-cut cut down, badge stamped on the stub |
| **F** | Seal off the end | 54px | the biggest badge, hung off the pill's end |

**G–L — the badge is never shown.** Each carries the discount as something
else, and the starburst is **made during the tap**. The tab has something to
reveal instead of something to carry, and six different devices mean six
different runs at the copy.

| | | | | |
|---|---|---|---|---|
| **G** | Price fall | 52px | price anchor | `$12.99 ↓ $6.49/month` — no percentage anywhere |
| **H** | The gauge | 54px | earned | `You've earned 50% off` — the arc is the only figure |
| **I** | Scratch strip | 54px | curiosity | `A code is waiting` — withholds the number |
| **J** | Odometer | 52px | plain | `50 %  OFF PRO TODAY` on flip tiles |
| **K** | The lock | 56px | benefit first | `Unlimited calls with Sarah` — cost on line two |
| **L** | Midnight bar | 50px | loss | `Your 50% expires at midnight` — shortest of the ten |

## A circle and the starburst are the same eighteen points

The badge is nine outer vertices at radius 78 alternating with nine inner ones
at 57.5. Pull the outer nine down to 57.5 and what is left is a circle — same
vertices, same order, same corner rounding. So `bloom.js` walks one to the other
by interpolating **one number**, and every frame in between is a real shape.

A cross-fade would have held up at 30% and fallen apart at 60, where you would
be looking at a circle and a star at the same time. This is why six tabs can
carry six unrelated devices and still arrive at one badge: whatever the device
is, it collapses to a disc, and the disc takes its points.

The *waist* stays at 57.5 the whole way. Moving both radii makes the shape
breathe, which reads as a scale rather than a growth.

`d` is driven off a scalar motion value through `bloomPath` rather than handed
to motion as a list of path strings. Path interpolation would work — every
frame has the same command structure — but the radius is the thing actually
being animated, and keeping it that way puts the easing on the radius instead
of on a string.

## Four mechanics, not six

`Reveal.jsx` has four, and that is deliberate rather than a shortfall:

- **gauge** — the arc runs from half to full, then thickens into the disc it
  was tracing.
- **scratch** — the foil wipes left to right off a badge that was under it the
  whole time. The only one with no bloom, because there is nothing to make.
- **bar** — the day's hairline runs to full, then gathers to a point at centre.
- **collapse** — a rounded rectangle packs down into a circle. This is `price`,
  `odometer` and `lock` together, because all three are *a block of something*
  collapsing and the only honest difference is where the block starts and how
  big it is. Three near-identical functions would have been three names for one
  idea.

Each tab states its own `from`/`strip`/`rail` geometry, so the disc forms
exactly where its device was standing.

## The tap, end to end

```
    0 – 220ms   the device becomes a disc; the tab fades out under it
  220 – 460ms   the disc grows nine points — r 57.5 → 78
  460 – 1180ms  the badge travels and grows to the paywall's slot
  720 – 1460ms  the contour rings ripple out of it
 1010 – 1210ms  the paywall comes up underneath, its own badge already landed
 1240 – 1380ms  the flying copy fades into the one that was always there
```

B/C/D/F skip the first two lines and start at the flight — `1150ms` against
`1610ms`.

**There is no whiteout.** The gift flow had one because a box opening has to
hide the moment the box stops being a box; this has nothing to hide. You watch
the thing you tapped become the thing you are looking at.

The landing is `(206, 256)`: the scroller's 158 of top padding plus half the
offer block's 196-tall slot. Taken off the paywall's own numbers — a few pixels
out and the hand-off reads as a jump.

## One deliberate change to the paywall

`theme.js` had V2's badge in the **tier's** colour — indigo on PRO, gold on
PRO+ — while the coupon two lines above it is gold on both, under the comment
*"the offer is gold, the tier is not."*

The badge now joins the coupon. Ten tabs end in this rosette in gold, and a
badge that changes colour halfway across the screen reads as two badges.
Reverting the four lines in `src/paywall/theme.js` puts the indigo back.

## M–R · glass — superseded

**The brief rules out glassmorphism, so these are not taken forward.** They are
left deployed and marked in the rail because the gestures in them are reusable:
the commit-time origin, the plan carried through to `PriceSheet`, and the
scratch canvas all survive the visual direction being dropped.

### What they were

The argument, in one line: **a tap is a decision you can take back, and a
gesture is one you already made.** Every interaction here is a conversion
mechanic doing a job, not a flourish.

| | | | |
|---|---|---|---|
| **M** | Slide to claim | 56px | commitment — release past 70% |
| **N** | Hold to unlock | 54px | effort justification — 700ms |
| **O** | Scratch it yourself | 54px | curiosity, paid for — 55% cleared |
| **P** | Pick before you go | 58px | pre-selection — the paywall opens on your plan |
| **Q** | Pull up to compare | 52 → 148px | progressive disclosure |
| **R** | Tear the stub | 58px | endowment — past 56px it detaches |

### The glass is real

`GlassPane.jsx` uses `glass-card`'s material unchanged — a generated normal map
read by three `feDisplacementMap` passes through `backdrop-filter: url()`, not
a blur. Two numbers are dialled against that prototype, because what is behind
the pane is different:

- **Depth 44, not 63.** The deeper the bend reaches, the more of the pane is
  edge-clamped samples, and over the roadmap's dark rows that is a grey wash.
  Keeping it at the rim is what gives the pane a thickness.
- **The rim carries the gold.** On the paywall the glass had colour to borrow;
  here it has to bring its own.

Chrome only, as before. Everywhere else gets `blur() saturate()` — frost
without refraction — detected with `CSS.supports`, not sniffed.

### They report their own origin

The other ten declare where their badge is. These six **report it at commit
time**, because on five of them the user moved the thing themselves: the knob
is wherever they let go of it, the stub is wherever they tore it to. A static
origin would start the flight from somewhere nobody was looking.

So there are three ways the badge arrives, and `leadOf()` is three cases
because of it — already on the tab (nothing owed), made out of a device (a
device beat and a bloom), or the gesture already got it to a disc (only the
nine points are owed, 300ms).

**P and Q carry the plan through.** `PriceSheet` opens on whichever chip was
touched, so the choice made on the Learn screen is not made twice.

## Where the designs live

Paper, page **USA Paywalls**:

- **FAB · ten options · the badge is never shown until the tap** — all ten,
  with the copy angle and the open mechanic on each, and the morph diagram.
- **FAB · six glass tabs you can do something to** — M–R, with the conversion
  mechanic named on each.
- **FAB · starburst · 6 short tabs → V2 paywall** — the first set, for history.
