# Stimuler · seven FAB tabs, shining

The seven tabs from Paper's `1XDM-1` frame, on the real Learn screen, with the
light and the stars built. Animation only — there is no flow, no tap, no paywall.

```bash
npm install
npm run dev        # http://localhost:5173
```

`?t=1` … `?t=7` opens one directly.

| | | |
|---|---|---|
| **1** | Gold bar | gold body, bronze mark, 2 stars |
| **2** | Dark bar | the same tab with the gold body taken out, 2 stars |
| **3** | Slate glass | cool pane, warm veil, 2 stars |
| **4** | Night to gold | black to gold across the width, square action |
| **5** | Gold ticket | flat gold, die-cut, dark crown |
| **6** | Ticket + mark | the same ticket with the mark and 2 stars on the stub |
| **7** | Two-tier band | full bleed, flush to the nav |

## One light, one cycle

**6s.** The band crosses from 1.2s to 3s, then nothing until the cycle turns.

**The wash and the border glint are the same object.** Same width, same starting
x, the same `light-wipe` keyframes, the same 14° skew — so the stretch of edge
that lights is always the stretch the wash is crossing. The border version is
that band used as a **mask** on the outline stroke, which is what keeps it
quiet: the stroke can only be as bright as the band's own falloff at that point,
so it fades up and down instead of arriving as a hard dash. There is one
strength control and both get quieter together.

The band itself is **180px wide, feathered at seven stops and blurred 15px** —
what passes is a spread of light, not the edge of a rectangle.

The stroke is drawn on the border's own centreline — inset by half the border
width, radius reduced by the same — so it sits *on* the edge rather than beside
it. On the two die-cut tickets it follows the cut; on the two-tier band, which
is flush to the nav, it follows an **open** path: up one side, across the top,
down the other, and stop. There is no bottom edge to run along.

## The stars

**A twinkle is not a pulse.** It brightens fast (18% of the cycle), half
collapses, comes back smaller, and only then goes out — four stops rather than
two, with a couple of degrees of turn so the points catch differently each time.
2.9s each.

**Every star carries its own delay.** Two stars on the same clock read as a
loading indicator; a second and a half apart, they read as light catching. The
offsets are set per tab in `fabs/index.jsx`, not derived, because which pairing
looks accidental depends on where the two stars sit relative to each other.

## Notes on fidelity

- Geometry, fills and copy are read out of Paper node by node. Each tab reports
  its own `top` — the sheet ranges from 657 to 673 depending on how tall the tab
  is and how far it tucks behind the nav — so the frame only provides the ground
  and the chrome.
- **The sheet writes its golds in `oklab()`.** Every one is resolved to hex here
  so seven tabs cannot quietly disagree on a browser that interpolates
  differently. `oklab(74.8% 0.012 0.130)` is `#D3A63D`, which is the file's own
  gold to a digit.
- **The Stimuler mark is kept once at full fidelity.** The sheet re-emits it
  three times at three sizes and offsets; it is the same artwork each time, and
  its head is an exported blob of several hundred micro-segments — shortening it
  by hand changes the silhouette, so it stays whole and gets placed three ways.
- 412 × 844 is fitted to the window with `zoom`, never `transform: scale()`.
- `prefers-reduced-motion` stops all of it.
