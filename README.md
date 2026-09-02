# Stimuler · Pro / Pro+ paywall prototypes

Two working prototypes of the Pro / Pro+ paywall, each a React + Vite app running
the four finished feature animations live in its hero. They differ **only in
information architecture** — same animations, same content, same copy — so the
two can be put side by side and compared.

| | | |
|---|---|---|
| [`iteration-a/`](iteration-a) | tier toggle **inside the price sheet** | https://stimuler-paywall-carousel.vercel.app |
| [`iteration-b/`](iteration-b) | tier toggle **in the header** | https://stimuler-paywall-carousel-b.vercel.app |

```bash
cd iteration-b        # or iteration-a
npm install
npm run dev           # http://localhost:5173
```

Each folder has its own README with the full build notes — where every number
came from, what was measured out of the Figma exports, and the traps hit along
the way. Start there.

## What the two are testing

**A** puts the tier toggle inside the white price sheet, roughly two-thirds down
the page. **B** lifts it into the header, directly under the close button, so the
tier is the first decision on the screen rather than something found halfway down
the thing you are buying.

Everything else follows from that one move. In B the hero drops to make room, the
sheet loses the height the toggle occupied, and a reassurance line is added above
the CTA. Below the price sheet the two are identical to the pixel.

## The hero

Both run the same four 5-second feature animations — Sarah call → 12+ AI tutors →
practice conversation → report — chained into one ~21s loop in a single 370×330
frame, with a caption per slide.

The reason that was cheap: the export left a **bare 370×330 rect** where the
animation goes, which is exactly the frame all four scenes were built to, months
apart, in four separate projects. They drop in at native size. `src/scenes/*` is
each scene's own source vendored in, essentially unedited — see the per-iteration
README for the handful of deliberate exceptions and why each one was necessary.

## Prototype controls

Bottom-right of each: tier switch, play/pause, a scrubber across the whole loop,
a reduced-motion toggle, and a readout of which scene is playing. `×` hides the
panel. The hero is swipeable and the pagination dashes are clickable — both just
move the clock, so the whole thing stays a pure function of time.

## Notes

- The frame is 412×917 and cannot reflow, so it is fitted to the window with
  `zoom` — never `transform: scale()`, which leaves the pinned CTA and the scroll
  container in the wrong place at any window that isn't exactly 917 tall.
- Deployment config (`vercel.json`) is included; the `.vercel` link folders are not.
- These are design prototypes, not production code. Prices, copy and the tier
  split are exploratory and not a commitment to anything shipped.
