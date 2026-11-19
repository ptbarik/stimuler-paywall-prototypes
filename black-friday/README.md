# Stimuler · Black Friday — pull the lever → offer paywall

Deep links for review:

| link | shows |
| --- | --- |
| `/` | the reveal, idle — board **2IM-0** |
| `/?at=won` | the moment the drums land — board **2L2-0** |
| `/?at=paywall` | the offer page — board **28E-0** |
| `&still=1` | freezes every entry animation at its finished state |
| `&tall=1` | stretches the frame so the whole page is visible at once |
| `?at=paywall&lights=1` | the alternate banner — marquee bulbs on the sticker's own border. The sticker only exists on the offer page, so `?lights=1` alone shows nothing |

| `?v=2` | **the chosen design** — board **7L0-0** |

The ♪ button in the top-right mutes. It is not in `?v=2`, which follows the
board.

## `?v=2` — the design that ships

Board **7L0-0**. Same flow, rebuilt around two decisions: the page is cold and
the mark is the only warm thing left on it.

| | |
| --- | --- |
| mark | letter-spaced caps, not the die-cut sticker. `0.27em`, 31px, four stacked text-shadows — a tight white core, a violet middle, two wide halos. One wide shadow reads as the type being out of focus; stacked, they read as the letters being lit |
| machine | silver. Rail, bezel, drums, feet, rivets and pay line all a stop cooler, and the case a graphite rather than an espresso — brass body with chrome trim reads as gold gone grey |
| lever | on the reveal only. The arm and the boss it turns on fade out over 0.4s as the machine shrinks into the hero, so it leaves with the pull |
| ground | `#110D1E → #06050E → #100D1E` down the whole 3225, with an opaque violet wash over the hero's 412×460. It lives inside the scroller: pinned to the viewport the page would re-warm every screenful |
| metal | one set of custom properties on the board root. Silver is not grey — every fill is a hard light → dark → light break, which is the whole reason the type reads as metal |
| sheet | glass, the way the Christmas one is: a translucent pane, `blur(4.6px) saturate(1.35)` behind it, a −45° sheen over both, and the rim as inset shadows so the edges cost no layout |
| hero | three equal 30px gaps, measured off the ink — the mark's 44px block carries 11px of leading, the headline's line box carries 4 |

Gold survives in exactly two places: the BLACK FRIDAY mark and the buy button.


## Where everything comes from

Four boards in *Paywalls 2.0*, traced rather than approximated:

```
2IM-0  reveal / idle    2L2-0  landed    28E-0  offer page    312-0  the gold theme
```

Every rectangle of the machine, every type size and every colour is the
artboard's own value. The machine's SVG even keeps the artboard's coordinate
space — its viewBox starts at y 205 — so a rectangle in the file and a
rectangle here are the same numbers.

```
ground   #2A1804 → #1A0E02 60% → #120800       the app's gold theme (312-0)
wash     radial #FFBF4D at 30%, top centre
sticker  #F6D98F → #E0AF40 → #C08722           the brightest thing on the screen
rail     #E8CB83 → #A3761F → #D3A94E           the machine's frame, a stop below it
case     #241606 → #120A01 → #070400           the machine's body
cream    #FBF7EF → #E4D8C2                     drum faces
```

The machine's body used to be maroon, and that was the clash: it was the one
hue on the screen outside the gold family, so beside the sticker's amber it
read as a second accent rather than a dark object. It is black lacquer now,
and its rails sit deliberately a stop below the sticker's gold — two equally
bright golds stacked on each other was the other half of the problem. The
value ladder runs sticker → rail → case → page, which is why the hero can
overlap as tightly as it does without going muddy.

The first pass put this on indigo. A gold-and-maroon machine on an indigo field
is two worlds sharing a screen; on warm near-black it is one object in one
room. Everything else followed the ground — panels, tiles, chips, dividers,
plan cards and the sheet all moved to the gold theme's own values.

One hot accent survives: `#FF6A4D` on the countdown, and nowhere else. The SAVE
badge went gold with it, so the only thing shouting on the page is the clock.

## The lockup

`BlackFridaySticker.jsx`.

The sticker outline is derived, not drawn. Each word is painted again
underneath with a fat round-joined stroke of its own fill, and a thick round
stroke of a shape *is* that shape dilated — so two words painted the same
colour merge into one continuous die cut that hugs the letterforms. Painting it
at 28, 26 and 24 gives the foil edge and the engraved line inside it.

The letters are built the way the sale-poster lettering they come from is
built, which is four things and not one:

| layer | what it does |
| --- | --- |
| side | a wall stepped down-right, lighter at the face and darker behind |
| keyline | a thin gold rim round the face, lit at the top |
| face | a gradient, not a flat fill |
| shadows | the letters drop one onto the sticker, the sticker onto the page |

A pass with flat black letters on flat gold read as a decal — the detail above
is what the difference is made of. The side wall does most of the work, and it
has to be clearly **darker than the sticker it sits on**: the first attempt at
an extrude put dark-on-dark and the depth vanished entirely.

The letters are real outlines pulled from Inter Display and warped onto a
quadratic **by arc length** — each point placed at its distance along the
curve, then pushed out perpendicular to it, so stems stay square to the curve.
`textPath` was not dependable enough to ship, and per-letter rotation is the
wrong shape.

The die cut is the union of two dilated words, and a union of dilations is not
the dilation of a union: where the gap between BLACK and FRIDAY falls between
the body width and the rim width, the bodies fail to touch while the rims do,
and a bright band of rim shows through the middle. `D_BRIDGE` is an arc along
that gap painted with the body, narrower than the body pass so it fills the
seam without ever defining the outer edge.

**The bulbs sit on the real border.** The die cut has no path of its own — it
is the union of two glyph outlines grown by a round stroke — so there is
nothing to hang a dash pattern on, and an arc floating above the banner was a
poor substitute. `/tmp/bfarch/bulbs.py` rasterises exactly what the SVG draws,
walks the outer boundary of that bitmap, resamples it at even arc length and
drops any bulb landing too near one already kept (arc length alone bunches them
where the cut doubles back into a notch). The 38 points it emits are baked into
`BULBS`. Re-run it if the lettering or the rim width changes.

The sockets are drawn once and never blink; only the lamps do. Without that the
bulbs disappear into the gold on the off beat.

The outlines come from `/tmp/bfarch/genjsx3.py` (fontTools + brotli, read
straight from `public/fonts/interdisplay-700.woff2`). Re-run it to change the
wording, the sizes or the curve.

## The page is traced, not approximated

`Paywall.jsx` positions every section absolutely at board 28E-0's own `top`,
inside a 412 × 3382 canvas — the board's coordinate space. An earlier version
rebuilt it as a flow layout with its own paddings: the skeleton matched but
almost every detail drifted (type sizes, card geometry, the whole testimonial
treatment, a four-item tab bar where the board has five). Absolute coordinates
make that drift impossible.

Two values are deliberately *not* copied, both indigo-era leftovers still in
the file: the PRO column's border `#6F91FF` and the tab-bar icon strokes
`#8E88B5`. Both are cool blue-greys on a warm page; they use the gold and the
tab label's own colour instead.

One trap worth recording: **framer-motion writes `transform` on every motion
element**, so a `transform: translateX(-50%)` in the style of a `motion.div` is
silently wiped the moment it animates. Every centred section here uses the
standalone `translate` property, which composes with framer's transform rather
than fighting it.

## The hand-off

The machine is mounted **once** and never remounts. That is the whole trick.

| phase | what happens |
| --- | --- |
| `idle` | three stars, nothing pulsing. The whole screen is the target — the lever is scenery, not an instruction |
| `spinning` | the arm dips 17° and springs straight back; the drums brake at 900 / 1250 / 1650ms, each overshooting 14px and snapping back |
| `won` | pay-line arrows light, the bezel flashes once, the aura brightens, the drums darken from `#BCA887` to full ink — board 2L2-0, held for 900ms |
| `paywall` | the sticker drops in from above and overshoots; the machine travels up and scales to 0.62; confetti goes off in three throws; the page builds beneath |

After the hand-off the sticker and the machine both track `scrollTop` instead of
being pinned, so they behave like part of the page rather than a layer over it.

The drums are wound to a stop, not spun to a result. The strip ends on the
symbol it has to show and the easing brakes into it — which is the honest way
to animate an outcome that was never random. Nothing in the copy says *win*,
*luck* or *try again*.

## The sound

`sfx.js` — synthesised in Web Audio at the moment it plays, nothing loaded.

Six sounds, one machine: `lever`, `reel`, `detent`, `jackpot`, `coins`, `build`.
All of them are scheduled in a single call the instant the lever is pulled, on
the audio clock rather than on timers — twenty-odd reel clicks inside two
seconds, and a timer drifting a frame each is the difference between a machine
and a rattle.

- The reel click train widens by 5.5% a step and drops in level as it widens,
  so each drum quietens into its own stop instead of ending mid-clatter.
- The three detents are pitched C–E–G, so the stops build the chord the jackpot
  arpeggio then climbs, and `build` holds at the top of it. The whole sequence
  is one phrase in C major, not six effects in a row.
- Not over-stimulating is the brief: the master level is low and compressed,
  every sound has a soft attack and falls away rather than stopping, and a
  short generated reverb underneath makes six sounds read as one room.

Haptics mark only the physical beats — the pull, the three stops, the landing.

## One bug worth remembering

The lever used to fly off the screen on tap. The angle was not the problem —
`transform-box: view-box` measures `transform-origin` from the **view box's own
corner**, and this machine's viewBox starts at `y 205`, so every origin needs
that 205 taken off it. The arm was pivoting 205px below its own bracket.

## Run

```
npm install
npm run dev
```
