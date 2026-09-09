# Stimuler · Pro / Pro+ paywall prototypes

Two working prototypes of the Pro / Pro+ paywall, each a React + Vite app running
the four finished feature animations live in its hero. They differ **only in
information architecture** — same animations, same content, same copy — so the
two can be put side by side and compared.

| | | |
|---|---|---|
| [`iteration-a/`](iteration-a) | tier toggle **inside the price sheet** | https://stimuler-paywall-carousel.vercel.app |
| [`iteration-b/`](iteration-b) | tier toggle **in the header** | https://stimuler-paywall-carousel-b.vercel.app |
| [`roadmap/`](roadmap) | the roadmap paywall — one animation, one toggle | https://stimuler-roadmap-paywall.vercel.app |
| [`premium/`](premium) | **the Premium tab flow** — nav → crown interstitial → paywall | https://stimuler-premium-tab.vercel.app |
| [`fab/`](fab) | **the offer block, two ways** — coupon ticket vs starburst badge | https://stimuler-paywall-offer.vercel.app |

```bash
cd fab                # or premium, iteration-a, iteration-b, roadmap
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

## The roadmap paywall

[`roadmap/`](roadmap) is a separate design — Figma `11032:8142` (Pro) and
`11032:8409` (Pro+) — and a separate question. Where A and B ask *where does the
tier toggle go*, this one asks what the page looks like when the hero is a
**single** animation rather than a four-slide carousel, and the argument for the
tier is carried by a PRO vs PRO+ comparison table further down instead.

It runs `02-ai-tutors` alone in the hero, in the same bare 370×330 slot the
export leaves for it, with the toggle in the header re-theming the whole 2558px
page indigo ⇄ gold. Its README has the measurement notes — including the handful
of places where reading the export literally and reading it correctly are not
the same thing.

## The Premium tab flow

[`premium/`](premium) is the whole entry, not a page: the roadmap screen with
its nav, the two ways into Premium (the crown's specular sweep, and a sheet
after a first lesson), a one-time crown-fall interstitial, and the PRO paywall
it hands over to — built from `~/Desktop/premium tab`.

It is built around **three flows**, each staged in one click from the panel: a
seasoned user who goes looking (the Premium tab, with the crown catching the
light), the same user *pointed* rather than looking (the discovery sheet after
a finished lesson), and a new user's first ever visit — the only one that plays
the crown fall and `Welcome to Stimuler PRO`. The first two deliberately land
on the same screen: the paywall should not be able to tell which door you came
through.

Two other things make it different from the three above. It runs the
**consolidated carousel** in the hero rather than a single scene, with a caption
per slide and the export's four pagination dashes under it. And it carries a
**real 24-hour offer window**: one timestamp, written once and never rewritten,
with the countdown derived from it on every tick, and an expiry that is
terminal — past 24h the paywall is ₹1999 with no strike, no badge and no timer,
and nothing on the page mentions that there was ever an offer.

The interstitial's word cascade is lifted from the intro beats of
[usa-onboarding-v2](https://usa-onboarding-v2.vercel.app/) — 740ms per word on
`cubic-bezier(.22,.72,.24,1)`, 55ms apart, clearing a 4px blur and 10px of rise
together, with a long hold after, because the reading happens in the hold
rather than in the motion.

Its README has the full notes, including the four places where the brief and
the design disagreed and why the design won each one.

## Notes

- The frame is 412×917 and cannot reflow, so it is fitted to the window with
  `zoom` — never `transform: scale()`, which leaves the pinned CTA and the scroll
  container in the wrong place at any window that isn't exactly 917 tall.
- Deployment config (`vercel.json`) is included; the `.vercel` link folders are not.
- These are design prototypes, not production code. Prices, copy and the tier
  split are exploratory and not a commitment to anything shipped.
