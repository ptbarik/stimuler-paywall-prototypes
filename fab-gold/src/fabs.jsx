import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/**
 * The two tabs from `FAB Animation` (Paper 1BZN-0), revised, animated.
 *
 * Geometry, fills and type are read off the Paper node. Both gradients are
 * written there in `oklab()` and are resolved to hex here so the tab cannot
 * quietly disagree with the design on a browser that interpolates differently
 * — `oklab(21% 0.005 0.021)` is `#1E170D`.
 *
 * The line alternates between **Get Stimuler PRO** and **Unlock unlimited
 * practice**. It slides rather than cross-fades: two lines dissolving through
 * each other are illegible for the 200ms they overlap, and at this size that
 * is most of the transition.
 */

const COPY = ['Get Stimuler PRO', 'Unlock unlimited practice']
const SWAP_MS = 2800
const EASE = [0.22, 0.72, 0.24, 1]

/* the rosette, exactly as the node draws it */
const STAR =
  'M-4.4,-72.6Q0.0,-78.0 4.4,-72.6L9.8,-66.0Q19.7,-54.0 34.9,-56.9L43.3,-58.5Q50.1,-59.8 50.1,-52.8L50.0,-44.3Q49.8,-28.8 63.3,-21.1L70.7,-17.0Q76.8,-13.5 72.3,-8.2L66.7,-1.8Q56.6,10.0 62.1,24.5L65.1,32.4Q67.5,39.0 60.6,40.1L52.3,41.5Q37.0,44.0 31.8,58.7L29.0,66.7Q26.7,73.3 20.7,69.7L13.3,65.4Q0.0,57.5 -13.3,65.4L-20.7,69.7Q-26.7,73.3 -29.0,66.7L-31.8,58.7Q-37.0,44.0 -52.3,41.5L-60.6,40.1Q-67.5,39.0 -65.1,32.4L-62.1,24.5Q-56.6,10.0 -66.7,-1.8L-72.3,-8.2Q-76.8,-13.5 -70.7,-17.0L-63.3,-21.1Q-49.8,-28.7 -50.0,-44.3L-50.1,-52.8Q-50.1,-59.8 -43.3,-58.5L-34.9,-56.9Q-19.7,-54.0 -9.8,-66.0Z'

function useAlternating() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % COPY.length), SWAP_MS)
    return () => clearInterval(t)
  }, [])
  return i
}

/** The line that changes, in a box that does not. */
function Line({ i, left, top, style, h = 22 }) {
  return (
    <div style={{ position: 'absolute', left, top, height: h, overflow: 'hidden' }}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div key={i} className="font-id"
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.34, ease: EASE }}
                    style={{ whiteSpace: 'nowrap', ...style }}>
          {COPY[i]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/**
 * The seal — two rosettes, which is how the node builds it.
 *
 * A dark bronze one at `rotate(10.9)` and the gold one at `rotate(-19.9)`, so
 * the back one shows as a 30° offset rim of points rather than a shadow. They
 * turn **against** each other here: together at different speeds they read as
 * one shape with a rendering fault, opposed they read as two objects.
 *
 * A full 360° rather than the 40° the nine-fold silhouette would allow — the
 * gold one's gradient is fixed to the shape and turns with it, so anything
 * less loops with a visible jump in the lighting.
 */
export function Seal({ size, spin = false, uid }) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg viewBox="-110 -110 220 220" width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`${uid}g`} x1="18%" y1="4%" x2="82%" y2="96%">
            <stop offset="0%" stopColor="#FFE7A8" /><stop offset="52%" stopColor="#E8B54B" /><stop offset="100%" stopColor="#B47A22" />
          </linearGradient>
        </defs>
        <motion.path d={STAR} fill="#896221" style={{ transformOrigin: '50% 50%' }}
                     initial={{ rotate: 10.9 }}
                     animate={spin ? { rotate: 10.9 - 360 } : { rotate: 10.9 }}
                     transition={spin ? { duration: 44, repeat: Infinity, ease: 'linear' } : { duration: 0 }} />
        <motion.path d={STAR} fill={`url(#${uid}g)`} style={{ transformOrigin: '50% 50%' }}
                     initial={{ rotate: -19.9 }}
                     animate={spin ? { rotate: -19.9 + 360 } : { rotate: -19.9 }}
                     transition={spin ? { duration: 30, repeat: Infinity, ease: 'linear' } : { duration: 0 }} />
      </svg>
      {/* outside the turning paths, always upright — a discount that spins is
          a discount nobody can read */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-id" style={{ fontSize: size * 0.184, fontWeight: 700, letterSpacing: '-.012em', lineHeight: 1, color: '#fff' }}>50%</span>
        <span className="font-id" style={{ fontSize: size * 0.118, fontWeight: 700, letterSpacing: '-.012em', lineHeight: 1, color: '#fff', marginTop: size * 0.028 }}>OFF</span>
      </div>
    </div>
  )
}

/**
 * Freckles — three, no more.
 *
 * Each on its own duration and its own repeatDelay, so they never blink
 * together; two sparkles on one clock read as a loading indicator. They sit
 * *off* the seal rather than on it, because light catching an edge happens in
 * the air beside a thing, not on its face.
 */
const FRECKLES = [
  { x: 56, y: 6, s: 9, d: 2.3, gap: 1.9, delay: 0 },
  { x: 2, y: 52, s: 7, d: 2.9, gap: 2.6, delay: 1.1 },
  { x: 62, y: 50, s: 6, d: 2.1, gap: 3.1, delay: 2.0 },
]

function Freckles({ left, top }) {
  return (
    <div style={{ position: 'absolute', left, top, width: 76, height: 76, pointerEvents: 'none' }}>
      {FRECKLES.map((f, i) => (
        <motion.svg key={i} width={f.s} height={f.s} viewBox="0 0 12 12"
                    style={{ position: 'absolute', left: f.x, top: f.y }}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: [0, 0.95, 0.25, 0], scale: [0.4, 1, 0.7, 0.4], rotate: [0, 18, 24] }}
                    transition={{ duration: f.d, delay: f.delay, repeat: Infinity, repeatDelay: f.gap, ease: 'easeInOut', times: [0, 0.22, 0.55, 1] }}>
          <path d="M6 0c.5 4.6 1.4 5.5 6 6-4.6.5-5.5 1.4-6 6-.5-4.6-1.4-5.5-6-6 4.6-.5 5.5-1.4 6-6Z" fill="#FFF0C4" />
        </motion.svg>
      ))}
    </div>
  )
}

/**
 * Five grounds for the starburst bar.
 *
 * The node's brown is dull for a specific reason, and it is worth naming
 * because it decides what the alternatives have to do: **it is the same hue
 * family as the gold it is carrying.** A warm-brown bar under a gold seal and
 * gold type gives the gold nothing to be brighter *than* — the whole tab sits
 * in one narrow band of yellow, so it reads as a slab rather than as metal on
 * a dark ground. Dulling is a separation problem, not a brightness one.
 *
 * Four ways out, deliberately different in kind rather than four browns:
 *
 *   ink       take the colour out. The seal and the type become the only
 *             warm things on the tab, so they read hotter without a single
 *             value changing. The rim carries slightly more gold to make up
 *             for a body that now contributes none.
 *   indigo    go cool, and go to the page's own ground — this is the gold
 *             offer paywall's purple, so the tab previews what it opens, and
 *             gold on indigo is the widest hue separation the palette has.
 *   ember     keep it dark but give it a light source. Neutral at the left
 *             running to heat at the right end where the timer sits, so the
 *             bar has a direction. The flat brown's real fault is that it is
 *             lit from nowhere.
 *   oxblood   stay warm but change family — red rather than yellow. Keeps the
 *             richness the brown was reaching for and stops competing with
 *             the gold, because it is no longer the same colour as it.
 */
export const GROUNDS = {
  brown: {
    from: 'invented',
    name: 'Brown', note: 'the node as drawn — one hue family, top to bottom',
    bar: 'linear-gradient(96deg,#1E170D 0%,#241B0E 48%,#3A2B10 100%)',
    rim: '#B47A2299', glow: '#E8B54B33',
  },
  ink: {
    from: 'invented',
    name: 'Ink', note: 'no colour in the body — the gold is the only warm thing left',
    bar: 'linear-gradient(96deg,#0C0B0F 0%,#121116 48%,#1B1921 100%)',
    rim: '#C99233B0', glow: '#E8B54B2E',
  },
  indigo: {
    from: 'invented',
    name: 'Indigo', note: "the offer page's own ground — the tab previews what it opens",
    bar: 'linear-gradient(96deg,#15112A 0%,#1B1537 48%,#251D48 100%)',
    rim: '#C89A3BA8', glow: '#E8B54B36',
  },
  ember: {
    from: 'invented',
    name: 'Ember', note: 'neutral at the left, heat at the right — it is lit from somewhere',
    bar: 'linear-gradient(100deg,#0F0D13 0%,#19141A 44%,#301C0B 78%,#432710 100%)',
    rim: '#B98334A8', glow: '#E8B54B3D',
  },
  oxblood: {
    from: 'invented',
    name: 'Oxblood', note: 'still warm, but red — it stops being the same colour as the gold',
    bar: 'linear-gradient(96deg,#200810 0%,#2C0D16 48%,#3C151C 100%)',
    rim: '#C2873699', glow: '#E8B54B33',
  },

  /*
   * Four more, taken off the Learn screen rather than invented.
   *
   * Sampling the screen turns up something the first four missed: **the
   * homepage's warm accent is terracotta, not gold.** The streak chip is
   * `#D97941` inside `#744732`; the unit heading is `#E7CEA5` sand; the live
   * roadmap node is `#66512D` bronze inside an `#F8C6B7` blush ring. There is
   * no yellow-gold anywhere on this screen — the gold belongs to the paywall,
   * and the brown bar was borrowed from there too, which is part of why it
   * sits on the Learn screen like a patch.
   *
   * So these four are built only from colours already on the page. Each one
   * names where it came from, because that is the thing worth checking.
   */
  sienna: {
    from: 'screen',
    name: 'Sienna', note: 'the streak chip, #744732 — the one saturated warm thing already here',
    bar: 'linear-gradient(96deg,#2A1711 0%,#38211A 48%,#4B2C1D 100%)',
    rim: '#C27A42A8', glow: '#D9794133',
  },
  olive: {
    from: 'screen',
    name: 'Node bronze', note: 'the live roadmap node, #66512D — bronze with a green bias, so it is not the gold',
    bar: 'linear-gradient(96deg,#16160F 0%,#201E14 48%,#322E1A 100%)',
    rim: '#A8923FB0', glow: '#C99C3330',
  },
  card: {
    from: 'screen',
    name: 'Card grey', note: 'the exercise cards, #252525 → #343434 — the tab becomes one of the screen’s own',
    bar: 'linear-gradient(96deg,#1B1B1B 0%,#242424 48%,#333333 100%)',
    rim: '#C99233B0', glow: '#E8B54B2E',
  },
  dusk: {
    from: 'screen',
    name: 'Dusk', note: 'the unit ticks, #524760 — the only cool colour on the page',
    bar: 'linear-gradient(96deg,#191523 0%,#221C2E 48%,#302741 100%)',
    rim: '#C89A3BA8', glow: '#E8B54B33',
  },
}

/* ── 1 · Starburst ──────────────────────────────────────────────────
   Slot 390 × 72. Bar 360 × 54 at (30, 16), so its centre line is y 43.
   The seal is 76 and sits at top 5 — **centred on the bar**, which is
   the fix: at the node's own top 13 its centre fell 8px low and the
   whole tab read as tilted. */
export function StarburstFab({ clock, onTap, bg = 'brown' }) {
  const i = useAlternating()
  const g = GROUNDS[bg] ?? GROUNDS.brown
  const tile = {
    position: 'absolute', top: 32, height: 22, borderRadius: 8,
    background: '#423D3D33', border: '0.8px solid #FCD37BA8', boxSizing: 'border-box',
    display: 'grid', placeItems: 'center',
  }
  const digit = { fontSize: 12, fontWeight: 700, lineHeight: '16px', color: '#FDC864' }
  const colon = { position: 'absolute', top: 32, fontSize: 14, fontWeight: 600, lineHeight: '18px', color: '#FDC864' }

  return (
    <div style={{ position: 'relative', width: 390, height: 72, cursor: 'pointer' }} onClick={onTap}>
      <div style={{ position: 'absolute', left: 28, top: 18, width: 340, height: 50, borderRadius: 25, background: g.glow, filter: 'blur(20px)' }} />
      <div style={{
        position: 'absolute', left: 30, top: 16, width: 360, height: 54, borderRadius: 27,
        background: g.bar,
        border: `1px solid ${g.rim}`, boxSizing: 'border-box', boxShadow: '0 16px 36px #00000085',
      }} />

      {/*
        The seal's own light, at about a third of what it was.

        At 0.3–0.52 it was a lamp behind the badge: the gold bled out over the
        bar and the seal lost its edge against its own halo. The node already
        carries a 340-wide glow under the whole tab, so this only has to say
        *there is something here* — 0.10 to 0.17, and it breathes on 4.2s
        rather than pulsing, so it never reads as a blink.
      */}
      <motion.div
        style={{ position: 'absolute', left: -10, top: -3, width: 92, height: 92, borderRadius: 46, background: '#E8B54B', filter: 'blur(17px)' }}
        animate={{ opacity: [0.1, 0.17, 0.1], scale: [0.97, 1.03, 0.97] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Line i={i} left={74} top={32} h={20} style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: '-.012em', lineHeight: '20px', color: '#FFE7A8' }} />

      <div style={{ ...tile, left: 279, width: 24 }}><span className="font-id tnum" style={digit}>{clock.parts.hh}</span></div>
      <span className="font-id" style={{ ...colon, left: 306 }}>:</span>
      <div style={{ ...tile, left: 313, width: 25 }}><span className="font-id tnum" style={digit}>{clock.parts.mm}</span></div>
      <span className="font-id" style={{ ...colon, left: 342 }}>:</span>
      <div style={{ ...tile, left: 349, width: 23 }}><span className="font-id tnum" style={digit}>{clock.parts.ss}</span></div>

      <div style={{ position: 'absolute', left: -2, top: 5 }}><Seal size={76} spin uid="sbf" /></div>
      <Freckles left={-2} top={5} />
    </div>
  )
}

/* ── 2 · Stub ticket ────────────────────────────────────────────────
   Slot 390 × 72. The die-cut is 390 × 58 at (0, 14), bite at x 279–297.
   The stub carries the figure as type rather than as a badge. */
/*
 * 68 tall, not 58.
 *
 * The stack is a 22px headline over a 22px row of tiles with 4 between them,
 * and in a 58-tall ticket that leaves six pixels top and bottom. Six is
 * enough to not technically touch and nowhere near enough to look deliberate
 * — the headline reads as pressed against the edge. The ticket keeps its
 * place in the 72 slot and takes the ten pixels of slack above it instead, so
 * the tab is no taller and the padding goes 6 → 10.
 */
const TICKET =
  'M17,0 H279 A9 9 0 0 0 297 0 H373 A17 17 0 0 1 390 17 V51 A17 17 0 0 1 373 68 H297 A9 9 0 0 0 279 68 H17 A17 17 0 0 1 0 51 V17 A17 17 0 0 1 17 0 Z'


/* the Stimuler mark, at the node's own two paths and bronze */
const MARK_A = "M-11.677 52.184C-12.714 52.672 -13.741 53.181 -14.8 53.621C-15.513 53.913 -16.279 54.215 -17.052 54.295C-17.574 54.349 -18.065 54.288 -18.528 54.032C-19.575 53.449 -20.43 52.236 -20.739 51.107C-20.908 50.494 -20.916 49.692 -20.567 49.134C-20.136 48.44 -18.047 46.721 -17.344 46.103C-14.395 43.532 -11.41 41 -8.391 38.51C-6.713 37.126 -5.044 35.672 -3.278 34.4C-2.778 34.036 -2.171 33.614 -1.558 33.467C-1.01 33.337 -0.496 33.458 -0.028 33.752C1.27 34.567 4.393 39.28 5.149 40.79C5.315 41.122 5.461 41.483 5.539 41.848C5.665 42.442 5.506 42.959 5.175 43.454C4.575 44.35 3.396 45.38 2.607 46.164C2.526 47.451 2.451 48.736 2.387 50.023C2.317 51.268 2.284 52.58 1.924 53.782C1.65 54.69 0.263 56.83 0.203 57.313C0.147 57.781 0.184 58.287 0.184 58.759C0.184 58.759 0.184 61.388 0.184 61.388C0.184 61.388 0.186 66.214 0.186 66.214C0.186 67.428 0.14 68.7 0.33 69.903C0.408 70.39 0.549 70.749 0.879 71.124C1.379 71.694 1.811 71.748 2.276 71.892C-0.428 72.201 -4.113 72.046 -6.738 71.507C-6.213 71.434 -5.406 71.507 -4.844 70.958C-4.611 70.636 -4.563 70.101 -4.525 69.721C-4.402 68.464 -4.403 67.182 -4.381 65.918C-4.381 65.918 -4.298 60.498 -4.298 60.498C-4.298 60.498 -4.271 58.329 -4.271 58.329C-4.268 58.05 -4.215 57.721 -4.267 57.451C-4.365 56.941 -4.808 56.267 -5.051 55.791C-5.369 55.157 -5.682 54.52 -5.989 53.878C-6.309 53.205 -6.551 52.453 -6.926 51.809C-7.073 51.558 -7.251 51.324 -7.506 51.168C-7.956 50.895 -8.529 50.994 -9.012 51.121C-9.927 51.359 -10.824 51.786 -11.677 52.184Z"
const MARK_B = "M-13.537 34.016C-11.295 33.764-8.938 34.463-7.108 35.656-7.038 35.7-6.968 35.749-6.898 35.794-6.831 35.841-6.763 35.889-6.694 35.936-6.626 35.986-6.559 36.034-6.492 36.086-6.426 36.135-6.359 36.187-6.295 36.239-6.231 36.29-6.165 36.342-6.102 36.395-6.038 36.448-5.973 36.502-5.912 36.556-5.849 36.613-5.788 36.667-5.727 36.725-5.666 36.779-5.605 36.835-5.546 36.893-5.486 36.949-5.43 37.008-5.37 37.068-5.311 37.127-5.256 37.184-5.199 37.245-5.143 37.306-5.086 37.367-5.033 37.428-4.978 37.489-4.925 37.55-4.872 37.615-4.818 37.678-4.767 37.74-4.715 37.803-4.664 37.868-4.613 37.932-4.563 37.998-4.515 38.062-4.465 38.129-4.415 38.193-4.369 38.261-4.323 38.326-4.274 38.394-4.23 38.462-4.184 38.53-4.14 38.598-4.096 38.665-4.052 38.734-4.01 38.803-3.967 38.874-3.925 38.943-3.884 39.014-3.845 39.084-3.804 39.157-3.766 39.227-3.725 39.298-3.689 39.369-3.652 39.441-3.614 39.514-3.579 39.586-3.543 39.657-3.509 39.733-3.476 39.806-3.442 39.879-3.409 39.952-3.377 40.028-3.347 40.101-3.315 40.176-3.286 40.25-3.256 40.326-3.226 40.4-3.2 40.477-3.173 40.552-3.143 40.629-3.12 40.704-3.094 40.78-3.069 40.857-3.045 40.935-3.021 41.01-2.999 41.088-2.977 41.165-2.956 41.242-2.937 41.32-2.915 41.397-2.896 41.476-2.877 41.554-2.859 41.632-2.843 41.71-2.826 41.789-2.81 41.868-2.794 41.946-2.78 42.026-2.766 42.105-2.754 42.183-2.74 42.263-2.729 42.341-2.716 42.424-2.706 42.503-2.696 42.583-2.688 42.663-2.679 42.743-2.671 42.825-2.664 42.904-2.658 42.983-2.652 43.063-2.649 43.144-2.644 43.223-2.641 43.305-2.637 43.386-2.635 43.466-2.635 43.545-2.633 43.628-2.633 43.707-2.635 43.788-2.635 43.866-2.637 43.949-2.641 44.029-2.644 44.109-2.649 44.189-2.653 44.269-2.659 44.351-2.664 44.431-2.672 44.511-2.68 44.59-2.688 44.67-2.698 44.751-2.707 44.831-2.716 44.911-2.729 44.989-2.741 45.069-2.755 45.147-2.767 45.23-2.782 45.308-2.796 45.388-2.811 45.467-2.828 45.545-2.844 45.625-2.862 45.704-2.881 45.782-2.899 45.86-2.92 45.939-2.94 46.017-2.96 46.094-2.982 46.173-3.004 46.251-3.027 46.328-3.052 46.404-3.076 46.481-3.101 46.558-3.126 46.636-3.152 46.713-3.181 46.79-3.208 46.865-3.236 46.941-3.265 47.017-3.296 47.091-3.326 47.168-3.357 47.243-3.387 47.317-3.42 47.392-3.454 47.465-3.487 47.541-3.522 47.614-3.557 47.687-3.592 47.76-3.629 47.833-3.664 47.907-3.701 47.978-3.742 48.05-3.778 48.124-3.82 48.195-3.861 48.266-3.899 48.336-3.942 48.407-3.984 48.477-4.027 48.546-4.067 48.616-4.113 48.685-4.158 48.754-4.202 48.823-4.247 48.892-4.293 48.96-4.341 49.027-4.387 49.094-4.436 49.161-4.484 49.226-4.534 49.293-5.97 51.194-8.5 52.851-10.983 53.25-10.983 53.25-11.064 53.259-11.064 53.259-12.081 53.371-12.931 53.067-13.718 52.472-15.55 51.083-17.467 48.144-18.784 46.28-19.704 44.98-20.711 43.647-21.43 42.241-21.658 41.791-21.858 41.319-21.911 40.822-22.039 39.682-21.867 38.799-21.085 37.903-19.149 35.684-16.606 34.296-13.537 34.016Z"
const SPARK = 'M12.428 22.271L12.982 24.584 15.33 25.129 12.982 25.676 12.428 27.988 11.874 25.676 9.526 25.129 11.874 24.584Z'

/* the scratch panel on the stub, in ticket-local coordinates */
const FOIL = { x: 300, y: 14, w: 76, h: 40, r: 10 }
const TICKET_58 =
  'M17,0 H279 A9 9 0 0 0 297 0 H373 A17 17 0 0 1 390 17 V41 A17 17 0 0 1 373 58 H297 A9 9 0 0 0 279 58 H17 A17 17 0 0 1 0 41 V17 A17 17 0 0 1 17 0 Z'

/**
 * The stub is a scratch card.
 *
 * A raised figure says *here is the number*. A covered one says *there is a
 * number here and you have not seen it yet*, which is a different and better
 * sentence for a tab whose whole job is to get touched. The payoff is also
 * now something the user did rather than something that was printed.
 *
 * **It takes a drag or a tap.** The drag is the real thing — a canvas mask
 * erased under the finger, which is what makes it feel like foil rather than
 * like a button that plays a video. But a scratch card that *only* scratches
 * is a tab a hurried thumb cannot open, so a tap clears it in one sweep. Both
 * end in the same place.
 *
 * **It finishes itself at 45% cleared.** Nobody should have to scrub a whole
 * panel to buy something, and the last few flakes are the part that feels
 * like work rather than like a reveal.
 *
 * Coverage is tracked on a coarse grid rather than by reading pixels back —
 * `getImageData` on every pointermove is the one thing here that would
 * stutter.
 */
function Foil({ onDone, w = FOIL.w, h = FOIL.h, r = FOIL.r }) {
  const canvas = useRef(null)
  const cells = useRef(new Set())
  const fired = useRef(false)
  const moved = useRef(0)
  const COLS = 14, ROWS = 6

  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext('2d')
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#9E8A64'); g.addColorStop(0.44, '#C6B892'); g.addColorStop(1, '#8F7C58')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    /* the tooth of the coating — without it the panel reads as a flat chip
       of paint and the eye does not expect it to come off */
    ctx.strokeStyle = 'rgba(255,255,255,.22)'
    ctx.lineWidth = 1
    for (let x = -h; x < w + h; x += 7) {
      ctx.beginPath(); ctx.moveTo(x, h); ctx.lineTo(x + h, 0); ctx.stroke()
    }
    ctx.fillStyle = 'rgba(74,53,12,.55)'
    ctx.font = '700 8.5px "Inter Display", system-ui'
    ctx.textAlign = 'center'
    ctx.letterSpacing = '1.6px'
    ctx.fillText('SCRATCH', w / 2, h / 2 + 3)
  }, [])

  const finish = () => {
    if (fired.current) return
    fired.current = true
    onDone()
  }

  const erase = (e, radius) => {
    const c = canvas.current
    if (!c || fired.current) return
    const r = c.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * w
    const y = ((e.clientY - r.top) / r.height) * h
    const ctx = c.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
    const cx = Math.floor((x / w) * COLS)
    const cy = Math.floor((y / h) * ROWS)
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) cells.current.add(`${cx + i}:${cy + j}`)
    if (cells.current.size / (COLS * ROWS) > 0.45) finish()
  }

  return (
    <canvas
      ref={canvas} width={w} height={h}
      onPointerDown={(e) => { e.stopPropagation(); moved.current = 0; e.currentTarget.setPointerCapture(e.pointerId); erase(e, 11) }}
      onPointerMove={(e) => { if (e.buttons === 0 && e.pointerType === 'mouse') return; moved.current += 1; erase(e, 11) }}
      /* a tap — down and up with barely any travel — is not a failed scratch,
         it is someone in a hurry. It clears the panel rather than ignoring them. */
      onPointerUp={(e) => { e.stopPropagation(); if (moved.current < 3) finish() }}
      style={{
        position: 'absolute', inset: 0, width: w, height: h,
        borderRadius: r, touchAction: 'none', cursor: 'pointer',
      }}
    />
  )
}

export function TicketFab({ clock, onTap }) {
  const i = useAlternating()
  const [scratched, setScratched] = useState(false)
  const L = 26

  /* the reveal is allowed to land before the page moves — 700ms, which is
     long enough to read two words and short enough not to feel like a wait */
  const reveal = () => {
    setScratched(true)
    setTimeout(() => onTap?.(), 700)
  }
  const tile = {
    position: 'absolute', top: 40, height: 22, borderRadius: 8,
    background: '#FFFFFF33', border: '1px solid #FFF2D6A8', boxSizing: 'border-box',
    display: 'grid', placeItems: 'center',
  }
  const digit = { fontSize: 12, fontWeight: 700, lineHeight: '16px', color: '#81632C' }
  const colon = { position: 'absolute', top: 40, fontSize: 14, fontWeight: 600, lineHeight: '18px', color: '#81632C' }

  return (
    <div style={{ position: 'relative', width: 390, height: 72, cursor: 'pointer' }}
         onClick={() => { if (!scratched) onTap?.() }}>
      <div style={{ position: 'absolute', left: 16, top: 14, width: 358, height: 54, borderRadius: 27, background: '#E8B54B3D', filter: 'blur(22px)' }} />
      <div style={{
        position: 'absolute', left: 0, top: 4, width: 390, height: 68,
        background: 'linear-gradient(118deg,#E8B54A 0%,#FFE7A8 52%,#D7A23A 100%)',
        clipPath: `path('${TICKET}')`,
      }}>
        {/*
          The glare, and it arrives *after* the line has changed rather than
          with it. Together they are one loud event and the eye picks the
          brighter one, which is the light — so the copy swap goes unread.
          620ms behind, it reads as the tab acknowledging the change.

          Kept deliberately faint: 0.34 at its brightest, 120px of feathered
          band, and no hard edge anywhere. On a surface this pale a glare is
          a few percent of lift, not a white stripe.
        */}
        <motion.div
          key={i}
          style={{
            position: 'absolute', top: -22, width: 120, height: 115,
            background: 'linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.34) 48%,rgba(255,255,255,0) 100%)',
            transform: 'skewX(-16deg)', filter: 'blur(9px)', pointerEvents: 'none',
          }}
          initial={{ left: -140, opacity: 0 }}
          animate={{ left: [-140, 430], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.95, delay: 0.62, ease: [0.4, 0, 0.35, 1], times: [0, 0.12, 0.8, 1] }}
        />
      </div>
      <svg width="390" height="68" viewBox="0 0 390 68" style={{ position: 'absolute', left: 0, top: 4 }}>
        <path d="M288 13V55" fill="none" stroke="#8A6319" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 6" opacity="0.5" />
      </svg>

      {/* 10 from the top edge, 10 from the bottom */}
      <Line i={i} left={L} top={14} h={22} style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.012em', lineHeight: '22px', color: '#3A2A0C' }} />

      <div style={{ ...tile, left: L, width: 24 }}><span className="font-id tnum" style={digit}>{clock.parts.hh}</span></div>
      <span className="font-id" style={{ ...colon, left: L + 27 }}>:</span>
      <div style={{ ...tile, left: L + 34, width: 25 }}><span className="font-id tnum" style={digit}>{clock.parts.mm}</span></div>
      <span className="font-id" style={{ ...colon, left: L + 63 }}>:</span>
      <div style={{ ...tile, left: L + 70, width: 23 }}><span className="font-id tnum" style={digit}>{clock.parts.ss}</span></div>

      {/* the stub. The figure is underneath the whole time — plain brown on
          the ticket's own gold, no relief, because the reveal is the event
          and type that is also doing a trick competes with it. */}
      <div style={{ position: 'absolute', left: FOIL.x, top: FOIL.y + 4, width: FOIL.w, height: FOIL.h }}>
        <motion.div className="grid place-items-center"
                    style={{ position: 'absolute', inset: 0 }}
                    initial={false}
                    animate={{ scale: scratched ? 1 : 0.94 }}
                    transition={{ duration: 0.42, ease: EASE }}>
          <span className="font-id" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.012em', color: '#5A3E12' }}>
            50% off
          </span>
        </motion.div>
        <AnimatePresence>
          {!scratched && (
            <motion.div key="foil" style={{ position: 'absolute', inset: 0 }}
                        exit={{ opacity: 0, scale: 1.06 }}
                        transition={{ duration: 0.3, ease: EASE }}>
              <Foil onDone={reveal} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * `1DRF-0`, to its own numbers.
 *
 * Written out rather than folded into `TicketFab` with a flag, because the
 * two tickets are not the same ticket with an extra layer: this one is the
 * node's 58-tall die-cut at the node's own offsets, and the other carries the
 * 68-tall padding fix. Sharing a component meant one of them drifting every
 * time the other moved, which is exactly what happened — the first pass put
 * this variant on the padded geometry and nothing landed where it was drawn.
 *
 * So every number below is read off the node: the ticket at `0, 14, 390×58`,
 * the mark at `-4, 15` in a 61 box, the sparkles at `11, 26` and `35, 53`, the
 * headline and clock at `56`, the foil at `307, 21, 71×39`.
 *
 * The mark is drawn **inside** the ticket rather than beside it, so the
 * die-cut clips it. At `top 15` in a 61 box it runs to 76 and the ticket ends
 * at 72; left loose it hangs below the paper, which is the one thing a
 * watermark cannot do.
 */
export function TicketMarkFab({ clock, onTap }) {
  const i = useAlternating()
  const [scratched, setScratched] = useState(false)
  /*
   * Centred, which it was not.
   *
   * The stub runs from the perforation at 288 to the ticket's right edge at
   * 390, so its middle is 339; the ticket runs 14 to 72, so its middle is 43.
   * The node has the panel at `307, 21`, which puts it 3.5px right and 2.5px
   * high — small enough to look like a mistake rather than a decision, which
   * is the worst amount to be off by. 72×40 at `303, 23` lands it on both
   * centres in whole pixels.
   */
  const FOIL_M = { x: 303, y: 23, w: 72, h: 40 }

  const reveal = () => {
    setScratched(true)
    setTimeout(() => onTap?.(), 700)
  }

  const tile = {
    position: 'absolute', top: 44, height: 22, borderRadius: 8,
    background: '#FFFFFF33', border: '1px solid #FFF2D6A8', boxSizing: 'border-box',
    display: 'grid', placeItems: 'center',
  }
  const digit = { fontSize: 12, fontWeight: 700, lineHeight: '16px', color: '#81632C' }
  const colon = { position: 'absolute', fontSize: 14, fontWeight: 600, lineHeight: '18px', color: '#81632C' }

  return (
    <div style={{ position: 'relative', width: 390, height: 72, cursor: 'pointer' }}
         onClick={() => { if (!scratched) onTap?.() }}>
      <div style={{ position: 'absolute', left: 16, top: 20, width: 358, height: 50, borderRadius: 26, background: '#E8B54B3D', filter: 'blur(22px)' }} />

      <div style={{
        position: 'absolute', left: 0, top: 14, width: 390, height: 58,
        background: 'linear-gradient(118deg,#E8B54A 0%,#FFE7A8 52%,#D7A23A 100%)',
        clipPath: `path('${TICKET_58}')`,
      }}>
        {/* the mark, circular-clipped and bled off the left end. `#C09447` on
            the ticket's own gold — a watermark reads as the stock it is
            printed on; the same mark at full strength would be a second
            object competing with the stub, which is where the eye has to go. */}
        <svg viewBox="-20 39 61 61" width="61" height="61"
             style={{ position: 'absolute', left: 1, top: 1, borderRadius: 240, overflow: 'hidden' }}>
          <path transform="translate(10.67 24.53)" fillRule="nonzero" d={MARK_A} fill="#C09447" />
          <path transform="translate(34.13 12.8)" fillRule="nonzero" d={MARK_B} fill="#C09447" />
        </svg>
        {/* the node's two sparkles, on their own clocks — two lights on one
            timer read as a loading indicator rather than as light catching */}
        {[{ x: 16, y: 12, d: 2.4, gap: 2.2, delay: 0.3 }, { x: 41, y: 36, d: 2.9, gap: 2.7, delay: 1.6 }].map((f, n) => (
          <motion.svg key={n} viewBox="10 22 6 6" width="6" height="6"
                      style={{ position: 'absolute', left: f.x, top: f.y, overflow: 'visible' }}
                      /* they rest at 0.3 rather than going out. The node draws
                         them at a flat 0.7 and they are part of the composition
                         — a sparkle that disappears leaves a hole in the mark's
                         corner for most of its cycle. */
                      animate={{ opacity: [0.3, 0.85, 0.45, 0.3], scale: [0.86, 1.12, 0.96, 0.86] }}
                      transition={{ duration: f.d, delay: f.delay, repeat: Infinity, repeatDelay: f.gap, ease: 'easeInOut', times: [0, 0.24, 0.58, 1] }}>
            <path d={SPARK} fillRule="nonzero" fill="#FFFFFF" />
          </motion.svg>
        ))}
        <motion.div
          key={i}
          style={{
            position: 'absolute', top: -22, width: 120, height: 104,
            background: 'linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.34) 48%,rgba(255,255,255,0) 100%)',
            transform: 'skewX(-16deg)', filter: 'blur(9px)', pointerEvents: 'none',
          }}
          initial={{ left: -140, opacity: 0 }}
          animate={{ left: [-140, 430], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.95, delay: 0.62, ease: [0.4, 0, 0.35, 1], times: [0, 0.12, 0.8, 1] }}
        />
      </div>

      <svg width="390" height="58" viewBox="0 0 390 58" style={{ position: 'absolute', left: 0, top: 14 }}>
        <path d="M288 11V47" fill="none" stroke="#8A6319" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 6" opacity="0.5" />
      </svg>

      {/* 16, not 18. `Unlock unlimited practice` sets 207 wide at 18 and the
          run from the headline's 72 to the perforation at 288 is 216 — nine
          pixels of air, which reads as the longer line only just fitting. At
          16 it is 184 and both lines sit in the same comfortable column. */}
      <Line i={i} left={72} top={21} h={20} style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.012em', lineHeight: '20px', color: '#3A2A0C' }} />

      <div style={{ ...tile, left: 72, width: 24 }}><span className="font-id tnum" style={digit}>{clock.parts.hh}</span></div>
      <span className="font-id" style={{ ...colon, left: 99, top: 44 }}>:</span>
      <div style={{ ...tile, left: 106, width: 25 }}><span className="font-id tnum" style={digit}>{clock.parts.mm}</span></div>
      <span className="font-id" style={{ ...colon, left: 134, top: 45 }}>:</span>
      <div style={{ ...tile, left: 142, width: 23 }}><span className="font-id tnum" style={digit}>{clock.parts.ss}</span></div>

      {/* Under the foil, in the headline's own ink rather than white. White
          was the figure announcing itself against a coating that is no longer
          there once you have scratched it — on bare gold it reads as a label
          stuck on the ticket. `#3A2A0C` makes it the same voice as the line
          above, which is what it is: the ticket finishing its sentence. */}
      <div style={{ position: 'absolute', left: FOIL_M.x, top: FOIL_M.y, width: FOIL_M.w, height: FOIL_M.h }}>
        <motion.div className="flex flex-col items-center justify-center"
                    style={{ position: 'absolute', inset: 0 }}
                    initial={false} animate={{ scale: scratched ? 1 : 0.94 }}
                    transition={{ duration: 0.42, ease: EASE }}>
          <span className="font-id" style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-.015em', lineHeight: '24px', color: '#3A2A0C' }}>50%</span>
          <span className="font-id" style={{ fontSize: 15, fontWeight: 700, letterSpacing: '.02em', lineHeight: '16px', color: '#3A2A0C' }}>OFF</span>
        </motion.div>
        <AnimatePresence>
          {!scratched && (
            <motion.div key="foil" style={{ position: 'absolute', inset: 0 }}
                        exit={{ opacity: 0, scale: 1.06 }} transition={{ duration: 0.3, ease: EASE }}>
              <Foil w={FOIL_M.w} h={FOIL_M.h} r={9} onDone={reveal} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/*
 * One tab ships. `StarburstFab`, `TicketFab` and `GROUNDS` above are the
 * earlier rounds — kept in the file rather than deleted because this
 * workspace has no working git and they are the only copy, but nothing
 * imports them. Add one back to this list to see it again.
 */
export const FABS = [
  { id: 'ticket-mark', name: 'Stub + mark', C: TicketMarkFab, note: 'the 1DRF-0 ticket — mark watermarked into the left end, scratch the stub' },
]
