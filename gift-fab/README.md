# Stimuler · Learn — the gift, animated

The eight revised floating actions from Paper's `Revised FAB` frame, running on
the real Learn screen, with the motion built. A rail on the right switches
between them.

```bash
npm install
npm run dev        # http://localhost:5173
```

`?fab=1` … `?fab=8` opens one directly.

## The loop

Every variant runs the same **4.2s cycle**, and the three things that can happen
in it never happen at the same time:

| | |
|---|---|
| **0.00 – 1.18s** | the box rattles; on the pop-out variants the ribbons swing after it |
| **1.20 – 3.13s** | the pane's own highlight runs — a border chase on seven, a glare across the paper on the ticket |
| **3.13 – 4.20s** | nothing at all |

The pause is the point, and it is most of what makes this read as an invitation
rather than a spinner. A gift that shakes continuously is a loading state. A
gift that shakes, stops, catches the light and then waits is an object asking to
be opened.

## The four behaviours

**1 · The rattle — all eight.** Six diminishing swings, ±7° down to ±1.7°, with
a 2.5px hop at the second beat. The pivot is the **bottom centre of the box**,
not its middle: it tips like an object resting on a surface rather than spinning
like a sticker. On the tilted sticker (6) the 9° rest angle lives on an outer
wrapper and the rattle on an inner one, so the two never fight over the same
transform.

**2 · The ribbons — on the five that break the top edge.** Variants 2, 4, 5, 6
and 7 push the box above the pill, so the loops have somewhere to move into and
they swing on their own: ±15° falling to ±4°, with a 6% scale pulse, **70ms
behind the box**. The lag is the whole trick — an ear that moves *with* the head
reads as one rigid object; an ear that arrives late reads as an ear.

Variants 1, 3 and 8 keep the gift **inside** the pill, and there their ribbons
stay rigid with the box. Ears flapping against a hard edge read as a glitch, not
an invitation.

**3 · The glare — variant 1 only.** The gold ticket is the one pane already made
of gold, so a border chase on it would be a gold line on a gold field. It gets a
54px band swept across the paper instead, clipped to the die-cut with
`clip-path: path()`, peaking at **42% white** and starting **1.6s in** — well
clear of the rattle, which is the "not clashing" part of the brief. It is
deliberately quieter than a normal shine: on a fully gold surface, anything
brighter stops reading as light and starts reading as a white shape.

**4 · The border chase — the other seven.** One lit 92-unit segment travelling
the pill's own outline, once per cycle, starting the instant the box goes still.

Every outline carries `pathLength="1000"`, so a rounded rectangle and a ticket's
die-cut edge take the **same dash numbers** and finish their lap in the same
time. Nothing is measured, and nothing drifts out of sync when a radius changes.

## Two things that had to be got right

**`transform-box: view-box` measures transform-origin from the viewBox's
corner, not from (0,0).** The ribbons pivot at the knot, and these gifts are
drawn in viewBoxes that start at negative coordinates — a knot at user
`(50, 38.5)` inside a viewBox starting at `(-8.963, 1.733)` has to be written as
`(58.963, 36.772)`. Get it wrong and the ribbons swing around a point somewhere
off the box. The rebased pivots are in `gifts.jsx`, one per shape.

**The border chase needs `animation-fill-mode: backwards.`** Without it the
stroke sits fully drawn and fully opaque for the 1.2s *before* its delay
elapses — a static gold line on the pill during the rattle, which is the one
moment it must not be there.

## The rail

Eight designs, and the three things worth doing to a loop while you judge it:

- **Animating / Held still** — freezes every animation where it is.
- **Full speed / Half speed** — one multiplier on the whole frame, so the
  rattle, the ribbons and the highlight keep their relationship to each other.
  Half speed is for reading the ribbons, which at full speed are a flick.
- **Replay from frame one** — remounting is what restarts a CSS animation, and
  restarting it is the only way to watch the first beat again.
- **Time left** — three stops; the readouts are live from whichever you pick.

## Notes

- The screen behind the button is the same one the other prototypes carry —
  Paper frame `13PK-2`, at the export's geometry.
- Every FAB's geometry, fills and copy are read out of Paper node by node. What
  is added here is only the motion.
- `prefers-reduced-motion` stops all of it.
- Design prototypes, not production code.
