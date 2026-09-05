# Stimuler · the Premium tab flow

Roadmap → crown interstitial → PRO paywall, with a **real 24-hour offer window
that genuinely expires**. React + Vite + Tailwind, one 412×917 frame, no
payments and no backend — but the offer window is modelled as if it were
server-anchored, because it is the one thing on the page that has to be true.

**https://stimuler-premium-tab.vercel.app**

```bash
npm install
npm run dev          # http://localhost:5173
```

Tap **Premium** in the nav to start. `Start Lesson` opens the sheet that is the
other entry point. The panel on the right drives everything, and its top group
is the three flows below.

Sources: `~/Desktop/premium tab` — `1.png`/`2.png` (roadmap and sheet),
`3.png`–`6.png` (the interstitial's four frames), `7.png` (the 412×2470
paywall), `CTA1`–`CTA3` (the price block's three states).

---

## The three flows

The panel's top group stages each one and gets out of the way. None of them is
a mode: each writes the same two pieces of state the app writes for itself —
the offer timestamp and `hasSeenIntro` — so from any of these starting
positions the app behaves exactly as it would have if the user had arrived
there on their own. Deep links: `?flow=tab`, `?flow=sheet`, `?flow=new`.

**a · Seasoned user · the Premium tab.** Has been using the app. The crown in
the nav catches the light; tapping it goes straight to the paywall, with the
window already ~23h in.

**b · Seasoned user · the discovery sheet.** The same user, *pointed* rather
than looking — the sheet that follows a finished lesson. `Explore Premium`
routes exactly as the tab does.

Two flows rather than one because the intent differs and the entry points are
designed differently, but they deliberately land on **the same screen**: the
paywall should not be able to tell how you got to it, and nothing about it
changes based on which door you came through.

**c · New user · the first ever visit.** Nothing set. Tapping Premium opens the
24-hour window *at that moment* and plays the crown fall and `Welcome to
Stimuler PRO`, once ever. The timer on the paywall it hands over to reads
23:59:5x, because the window really did just start.

---

## The offer window

`src/offer.js` is the only file that knows what time it is. The interstitial,
the paywall badge and the pinned CTA all read it; nothing computes a remaining
time of its own.

**`offerWindowStartedAt` is written once and never rewritten.** Not on reload,
not on a second Premium visit, not on reinstall. In production that is a server
column; here it is one `localStorage` key, and `start()` is the only writer —
it returns early if the key exists. The guard *is* the rule.

**Expiry is terminal.** Past 24h the paywall renders ₹1999 with no strike, no
badge, no timer and no animation, and nothing anywhere refers to an offer that
used to exist. No "you missed it", no "come back tomorrow". A page that mourns
its own expired discount is telling the user they were too slow, which is not a
thing to say to someone still deciding whether to buy.

**The countdown is derived from the timestamp on every tick.** `remaining()` is
`WINDOW - (now - startedAt)`, recomputed each time. Not a counter decremented
in memory — a counter drifts against the frame clock, and, the part that
actually matters, it *stops while the tab is backgrounded*, so a user who
leaves for an hour comes back to an hour they did not spend. Anchoring to a
timestamp means backgrounding is not a case that needs handling; it is not a
case at all.

The panel's **Set time remaining** rewinds that same single timestamp rather
than adding an offset, so what it produces is not a simulation of the expired
state — it *is* the expired state, reached the way a day of waiting would reach
it.

---

## The interstitial

**Two acts, three beats, 7800ms, and it plays once ever.** The design has three
frames: `4.png` welcomes, `5.png` says something has been unlocked, `6.png`
says what. Tapping anywhere skips it; every visit after the first goes straight
to the paywall.

### The fall finishes before the copy starts

Sixty-four crowns come down, **every one of them is past the bottom edge by
1900ms**, and only then does anything else happen.

They used to overlap, and it sounded better than it read. The near layer
crosses in *front* of the type, so the words being introduced were the words
being occluded — the eye had two things competing at the exact moment it was
being asked to read one. Separating them costs about a second and a half and
buys a screen that is doing one thing at a time.

`crowns.js` asserts the boundary at load, so the two acts cannot quietly start
overlapping again the next time a duration is touched. The fall is made fast
and dense rather than slow and sparse to pay some of that time back: a
downpour that is over in under two seconds rather than a drift that takes four.

The copy then starts on the *instant* the last crown clears rather than a beat
after it — the cascade fades in over 740ms of its own, so any gap on top of
that reads as the sequence having stalled rather than as a breath between acts.

### The type animation

Taken from the intro beats of the Stimuler onboarding prototype
([usa-onboarding-v2](https://usa-onboarding-v2.vercel.app/)), to its numbers.
Each word starts at `opacity 0`, `blur(4px)` and `translateY(10px)` and clears
all three over **740ms on `cubic-bezier(.22,.72,.24,1)`, 55ms apart**. Leaving
is 500ms, 16ms apart, drifting *up* 8px — much tighter, so the line departs as
one object rather than un-cascading itself back out word by word, which reads
as a rewind.

That source's own note on why those numbers is worth keeping:

> less blur, less travel, a tighter stagger so the line finishes sooner, and a
> long hold once it is whole — **the reading happens in the hold, not the
> motion**.

**The blur is the part doing the work.** A word that only fades was always
there at a lower opacity. A word that only rises slid in from somewhere.
Defocused and *then* resolving is the one combination that reads as the word
coming into being — which is what makes this a reveal rather than an entrance,
and why it belongs on a line emerging out of a screenful of falling crowns.

**That hold is most of why it costs 7800ms.** The reference spends 3.4s on a
*single* line. Three of those is ten seconds, so the holds here are cut to
~600ms each: brisk enough to keep three beats *plus* a full crown act under
eight seconds, long enough that every line is finished and still before it
goes, which is the rule that actually matters. Squeezing back to 3400ms means a
beat leaving before it has finished arriving, which is the one thing the
reference is careful never to do.

It is also **computed rather than animated**. The reference uses `@keyframes`
with a per-word `animation-delay`, which is right there and wrong here: a
running CSS animation cannot be asked what it looks like at 2400ms. Everything
on this screen is a pure function of one clock so the panel can scrub it, so
the same curve is evaluated directly instead. Same numbers, same result, and
the scrubber stays honest.

### The fall

**64 crowns**, three depth layers, every one an independent pure function of
the clock. The crown itself is the export's own path out of `3.svg`, gradients
and 4px/2px drop shadow included.

| layer | n | scale | fall | blur | opacity |
|---|---|---|---|---|---|
| near | 16 | 1.0 | 0.80–1.00s | — | 1.0 |
| mid | 26 | 0.75 | 0.95–1.20s | — | 0.85 |
| far | 22 | 0.5 | 1.15–1.40s | 1.5px | 0.6 |

Up from forty-two, and now that the fall owns the screen outright for its first
two seconds rather than serving as a backdrop for the copy, it can afford to be
a downpour. Sixty-four emitted inside **500ms**, each crossing the frame in
around a second: the frame is completely full between roughly 500 and 1300ms,
and then it empties.

The durations are much shorter than they were, and deliberately — a crown
taking 2.6s to cross now holds the entire sequence up, because nothing else may
start until the last one is gone.

The layer split is what keeps that density from becoming noise. Without depth,
sixty-four crowns is a texture; with it, it is weather.

Three other things do the work:

**Terminal velocity, not constant acceleration.** Each crown accelerates over
the first ~300ms of its own fall and then holds that speed. A pure `t²` gravity
curve is wrong here: things this light meet air resistance almost immediately,
and a crown still visibly gaining speed at the bottom of a phone reads as a
physics bug rather than as weight.

**Everything independent, from a fixed seed.** Own duration, delay, x, spin
rate *and direction*, sway phase. The instant two of them move identically the
whole thing reads as a sprite sheet, and the eye finds that faster than it
finds anything else on screen. Seeded, so two people reviewing watch the same
fall.

**Nothing fades out mid-air.** Every crown's travel ends past the bottom edge —
the difference between a fall and a dissolve. The layer durations are sliced
out of the 1.4–2.6s range rather than scaled by a per-layer speed, because
scaling overruns; `crowns.js` asserts the arithmetic at load.

### The beats

`Stimuler PRO` is **one element visiting three positions**, never redrawn.
`4.png` puts it at y461 under "Welcome to"; `5.png` and `6.png` at y397; and
`7.png` — the paywall — has it at y72 at 18px. So it cascades in with beat 1,
settles up 64px between beats 1 and 2, holds through beats 2 and 3, and then
flies to the header. The brand mark is the constant the three messages change
underneath; re-animating it on every beat would make it a fourth message.

### The lockup flies to the paywall

**On the same beat that `50% OFF` lands**, the lockup leaves for y73 at 0.655
scale — exactly where and how big the paywall's own header is. `50% OFF` is the
last thing this screen has to say, so the brand mark's job here is done and it
goes on ahead to the next screen, arriving before the screen does.

That is the transition. Not a screen replacing a screen: one element travelling
between two, with the glow underneath never moving at all.

**The pill has to be interpolated, not just scaled with everything else.**
`6.png` draws the interstitial pill at 62×33 beside 97px of "Stimuler"; `7.png`
draws the header's at 53×24 beside 64px. Those are not a uniform scale of each
other — the type is (27.5 → 18, exactly 0.655) but the pill is proportionally
wider and shorter. Scaling the whole lockup by 0.655 therefore lands a group
15px narrower than the header's, and since both are centred, "Stimuler" ends up
~7px off — which over a 500ms crossfade between two copies of the same word is
a visible double image. So the pill's own box travels too, from what the
interstitial draws to *the header's values divided by the scale*, and the
landing matches to the pixel.

`50% OFF` scales in from 0.85 with one spring overshoot — the only overshoot on
the screen, because two things overshooting in the same second read as bounce
rather than as weight. Its specular pass is clipped to the glyphs with
`background-clip:text`, so the light travels *through* the letterforms rather
than across a box containing them. One pass. A sweep that repeats turns the
number into a loading state.

### The handover, which is not a cut

The three blurred ellipses behind all of this belong to neither screen. During
the intro they are rendered by `App`; on the paywall they live inside the
scrolling page, because they have to scroll away with it. Across the last 500ms
the two crossfade on exact complements — and because they are the *same image
at the same offset* (the paywall opens at scrollTop 0), crossfading one into
the other leaves the light unchanged. Nothing about it moves, brightens or
dips.

That is the whole trick. The eye holds onto the one element on screen that does
not know a screen changed, so it reads as having scrolled into the page rather
than as having been taken to another one.

The glow also **blooms during the fall**, over the first 400ms — not before it.
It is the light the crowns are falling through, so it has to arrive with them;
lighting the frame first and then dropping things into it makes it a backdrop
that was already there, which is a duller idea.

---

## The paywall

`7.png` is a 412×2470 page and this is that page, with the CTA pinned over the
bottom 308 of it.

### The price goes first

On landing, the top half is **fully present and simply not moving** while the
price strike plays in the pinned card. Once the strike settles, the hero's
clock is released and the scene carries on.

The order is the argument: **what it costs, then why it is worth it.** Running
both at once splits the attention of the one moment the page has to make its
case, and the animation always wins that fight — it moves more, and it is at
the top of the screen.

**Parked, not blanked.** The first version of this faded the hero out while it
waited, and a paywall whose top half is empty on arrival reads as broken rather
than as deferential. So it holds `HERO_POSTER` instead — **620ms into the Sarah
call**, which is the export's own still for this slot: the `40 Minutes` pill,
the green call button and `Calling Sarah…` all up and settled, exactly as
`7.png` draws it. The page arrives *looking like the design*.

**Parked, not rewound to zero.** The carousel is a loop, so without this the
hero would resume wherever it happened to be — for someone landing on the
paywall, a quarter of the way into the report scene with no idea what it is.
And frame 0 of the call is empty, which is the problem this exists to solve.
Releasing the clock continues *from* the poster.

That 620 is 130ms short of the scene's `connect` beat, which is the last piece:
the very next thing that happens after the price has been read is the call
connecting. The wait is paid back immediately.

With no live offer there is no strike to wait for, so the hold is just long
enough to let the page settle before anything starts moving on it.

### The hero is one carousel, not four blocks

The export draws the Sarah call at the top with **four pagination dashes** under
it and one caption under those; the other three scenes float loose beside the
flow with a caption each. So this is not four stacked feature sections — it is
the consolidated carousel in one slot, with the caption changing per slide,
which is what the dashes are there to say.

That also settles the scroll-trigger question (*play at 40% visibility, one at
a time, never restart*): there is only ever one animation on the page and it
owns its slot. Those rules exist to stop four animations fighting; with one
there is nothing to arbitrate.

The slot is **370×330 at (21, 120)** — the frame all four scenes were composed
to, months apart, in four separate projects. They drop in at native size, and
the Sarah call's green button lands within 2px of where the export draws it.

The live dash grows while the others shrink on one 320ms curve, so the
indicator moves rather than blinks, and the caption crossfades over the join
rather than cutting at it — a hard swap draws the eye to the text at the exact
moment the picture is moving.

### The CTA card

Rebuilt from the `CTA3 - with final offer` export, which is one 277.26-tall
auto-layout column of four blocks 13 apart. Three details were wrong before and
between them are why the block read as off:

**The badge was too round.** `3.52px` corners, not 11. At 11 it reads as a pill
floating on the card; at 3.5 it reads as a tab cut into the box's top edge,
which is what the export draws.

**The price box was missing its ember.** 11.06 corners rather than 16, sitting
*slightly darker* than the sheet around it, with a blurred `#7C561F` ellipse
inside its top edge — 228.92 × 51.43, blurred 64.53 at 83%. That ellipse is
where the warmth at the top of the card comes from; without it the box is a
flat outline and the whole sheet reads colder than the export.

**The sheet had square corners and the wrong gradient.** 18px top radius,
`#48412B → #130A05 → #000` on the export's own 180.19°, and a blurred gold bar
across the top edge — drawn *over* the sheet, since under an opaque one none of
it survives.

Also now correct: the price is weight 800 with a `0 4px 36px` white glow, the
timer's fields are fixed 17×17 boxes (which turn out to be doing structural
work as well as decorative — they stop the badge re-measuring every second),
the colon is the export's 2.12 × 7.09 white bar rather than a glyph, and
`See all plans` is Urbanist 500 at 18px in `#B0B0B0`.

### The price strike

A ₹1999 that arrives already crossed out is a claim. A ₹1999 that is present
for 300ms, gets crossed out while you watch, and is *replaced* is an event. The
export's `CTA1`, `CTA2` and `CTA3` are the three frames of exactly that, in
order, which is what says it was meant to move.

| ms | |
|---|---|
| 0–800 | `₹1999`, full size, unstruck, nothing else |
| 800–1300 | the line draws — `scaleX` 0→1 from the left, 3px, `#BF4A4A` |
| 1050–1500 | the badge and the per-month line arrive with it |
| 1400–2050 | `₹1999` out, `₹999` in — **one shared move** |
| 2200–2550 | the timer settles into its chipped form |

**2900ms, up from 1300.** The first cut was paced like a flourish, and this is
not a flourish — it is the page's whole argument about price, and it was over
before the eye had finished arriving at the bottom of the screen. Every beat is
longer, but most of the extra went into the *unstruck hold*: `₹1999` now sits
there for 800ms before anything happens to it, because crossing out a number
only means something if the number was read first.

**The swap is one transition, not two.** Both figures occupy the same centred
slot and are driven by a single eased value: the old one scales down and fades
as the new one scales up and in, on the same curve, at the same instant. Two
independently-timed animations in that slot would have to be kept in step by
hand forever, and would drift the first time either duration was touched.

Plays once per paywall mount. Not on scroll, not looping.

The timer uses `tabular-nums` and its digits **do not animate**. A flip or a
slide is charming for the four seconds it takes to notice and exhausting across
the three minutes someone spends reading a paywall — and the point of the timer
is that it is true, not that it is busy.

### The laurel carousel

Redrawn from the `Dynamic carousel` export: **145 tall**, not the 66 the earlier
paywall gave it, and now it moves. Three claims on a ring — the Play award,
`13Mn+ users`, the rating — each holding the centre for 2.4s and taking 620ms
to hand over. The centred item is at full size and full opacity; its neighbours
sit at 0.72 and 0.3, and the frame's own edges do the clipping.

**The ring is modular, not a list of duplicates.** Each item's distance from
the centre is `wrap(i - p, 3)` into `[-1.5, 1.5)`, so an item leaving the right
re-enters from the left in one step. At `|d| = 1.5` it is 312px off centre,
which on a 412 frame is entirely outside it — the wrap happens where there is
nothing to see it. Transforms are computed per frame rather than transitioned
for the same reason: a CSS transition would animate that wrap back across the
whole band.

**The pitch and the side scale are measured off the render, not taken from the
export's frames.** Those frames are 253.53 and 168.38 wide, but they are text
boxes and the three items hold different amounts of text, so their widths say
nothing about the spacing. What is measurable is the ink: the centre item's
laurels sit at x128 and x283.5 — ±77.75 from its centre — and the neighbours'
at x48.5 and x352.3, at 0.72 the size. Solving those back gives a **208 pitch**
and a **0.72 side scale**, not the 0.87 the frame heights imply.

Everything below the band carries the 79px it grew, and the page is 79 longer.

### The button's shine

A narrow band skewed 22° travelling left to right across the gold CTA, clipped
by the button's own radius. The skew is the point: a vertical band sweeping
horizontally reads as a wipe, and it is the diagonal that reads as light
catching a curved surface.

It sweeps in 1.15s and then waits 3.6s, and **the pause is doing more work than
the sweep**. At a shorter interval a gold button glinting every second and a
half stops being a highlight and becomes a texture, and the eye filters it out
inside a single page visit. Rare enough to be noticed each time is the whole
specification.

It also does not start until the price has settled. A button glinting
*underneath* a price being struck through is two things asking for the same
glance at the moment the page can least afford to split it.

### The nav crown, for returning users

A specular sweep across the glyph, clipped to the glyph's own paths, 900ms.
**Three per session, at least 60s apart, never over a sheet or a modal.**

The band is mounted *inside* the SVG and clipped to the crown's two paths, so
the light travels through the glyph's shape — including the gaps between its
points — rather than across a box that happens to contain a crown. It exists
only while the sweep is running, so the animation starts on mount and cannot be
caught half-played.

In flow (a), whose whole subject is the crown catching your eye, the first
sweep lands at 900ms instead of 4s. Same cap, same spacing, same rules; only
the first delay differs, and it differs because the first one is the thing
being demonstrated. The panel's **Sweep the crown** fires one on demand without
spending one of the three.

Not a badge — a badge claims something is waiting for you, and nothing is; a
tab that lies about having news is a tab people learn to distrust. Not a pulse
— anything that loops in a nav bar becomes wallpaper inside a day, after which
it costs attention forever and buys none. A sweep is a single event with a
beginning and an end, which is why it can be noticed without nagging. The cap
matters more than the animation: the fourth sweep in a session would be the one
that taught the user to stop seeing it, so there isn't one.

---

## Where the design and the brief disagreed

The design won every time. Four places:

| | brief | built |
|---|---|---|
| **Interstitial** | two beats, 3400ms, with a live `Ends in 23:59:58` chip | the design's **three** beats, 7800ms, **no chip** — `4.png`/`5.png`/`6.png` draw none |
| **Price strike** | a block near the top of the scroll *plus* a sticky CTA | the design's single price surface: it plays **inside the pinned CTA card**, which is where `7.png` and the three `CTA` frames put it |
| **Spelling** | `Practise` (verb form) | `Practice`, as drawn — US spelling, matching the `Practice` nav tab beside it |
| **Expired copy** | `Just ₹167 per month paid for a whole year` under the ₹1999 | **no sub-line**, because `CTA1` draws none, and `CTA1` is the expired frame |

Two more worth stating rather than burying:

**The badge is 250 wide, not the 161 `7.png` draws.** That page's badge reads
`Limited Time Offer Today` and stops — no countdown — so 161 is the width of a
badge with no timer in it. `CTA2` and `CTA3`, which do have one, both draw it
at 250, and both are 1:1 with the frame. Since a live offer always shows the
timer, 250 is the width this badge is ever actually seen at.

**The export draws four captions against three scene thumbnails.** One of them
— *"Know what to practice next, with lessons made for you"* — has no frame to
belong to. It is kept in `copy.js` and the panel can swap it onto the lesson
slide, because deleting it silently would lose the fact that a choice was made.

And one thing flagged but not changed:

> `// NOTE:` the comparison table's last row reads **Yes** in both columns, so
> as drawn it argues PRO adds nothing there. The export is the signed-off
> artefact and a prototype is not the place to renegotiate it.

---

## Prototype controls

Built first, and the reason is the third group: without a way to reach the
expired state, verifying that the offer really ends means waiting a day — which
means in practice it gets verified once, badly, at the end.

- **Flows** — the three above, each staged in one click
- **Screen** — roadmap, the Premium tap, the paywall, the sheet, and a
  crown sweep on demand
- **Offer window** — a live readout of `startedAt`, `remaining`, `offerActive`
  and `hasSeenIntro`; set the remaining time to 23:59 / 01:00 / 00:30 /
  expired; reset `hasSeenIntro`; reset the whole first visit
- **Interstitial** — play/pause, 0.1× / 0.25× / 0.5× / 1×, a scrubber across
  the full 7800ms, a live readout of which beat the clock is in, and jump
  buttons for each moment in the sequence
- **Feature carousel** — jump to any of the four scenes, scrub the 21160ms
  loop, release or re-hold the hero, and swap in the spare caption
- **Price** — replay the strike
- **Motion** — force `prefers-reduced-motion`

Everything here drives the values the flow itself drives. Nothing is a separate
code path built to be demonstrated.

### Deep links

`?flow=tab|sheet|new` stages a flow before first paint.
`?screen=intro&t=2400` opens on that frame, frozen. `?scroll=1200` opens the
paywall at a page offset, `?strike=600` freezes the price mid-sequence,
`?remaining=0` sets the window before first paint so the expired paywall can be
linked to rather than described, `?fresh` clears everything, `?bare` drops the
panel. They write through the same functions the flow uses, so a link cannot
produce a state the app cannot reach on its own.

---

## Structure

```
src/
  offer.js              the window: start, expiry, remaining — one source of truth
  copy.js               every string, and the two design-vs-brief calls
  design.js             every measured number, and the interstitial timeline
  crowns.js             64 crowns, seeded, pure functions of the clock
  ease.js               the reference's curves, evaluated rather than declared
  carousel.timing.js    the consolidated carousel's own timing, vendored
  App.jsx               routing, one rAF clock, the handover
  screens/              Roadmap · CrownInterstitial · Paywall
  components/           CrownGlyph · CrownField · Cascade · Carousel · NavBar
                        PriceCTA · OfferTimer · Sections · DevPanel
  scenes/               the four feature animations, vendored
```

Two notes on what is measured and what is shared.

**The comparison table is the roadmap paywall's table.** Its box is 382 × 417.7
with value columns at x 190.3 and 285.28, 84.79 apart — identical to that
page's, to the hundredth. So its internals are that page's measurements shifted
by one constant rather than measured a second time, and the two prototypes
cannot drift apart.

**The three background ellipses are that page's too** — `#EAC361` at 25%,
`#F1E8D2` at 12% and `#E19748` at 60%, the last two `plus-lighter`, which is
what `3.svg` draws as `filter0_f` and its two siblings.

The frame is 412×917 and cannot reflow, so it is fitted to the window with
`zoom` — never `transform: scale()`, which leaves the pinned CTA and the scroll
container in the wrong place at any window that isn't exactly 917 tall.

## Not in scope

No payments, no backend, no router, no localisation, no light theme, no PRO+
tier (it does not exist in India). No last-chance extension, no second window,
no offer reset under any circumstance.
