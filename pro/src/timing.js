/**
 * The carousel.
 *
 * Four finished 5000ms scenes — Sarah call, lesson sequence, practice
 * conversation, report reveal — chained into one loop. They were built
 * independently but to the same spec, which is what makes this cheap: all four
 * are **370×330**, all four run **5000ms**, and every one of them is a pure
 * function of its own `ms`. Nothing here reaches inside a scene; each panel is
 * handed a local clock and asked to render.
 *
 * ── Why the joins are built the way they are ──────────────────────
 *
 * Each scene ends by fading itself out (4800–4850, depending on the scene) so
 * that its *own* loop doesn't cut. In a carousel that fade is wrong twice
 * over: the outgoing panel would dissolve to nothing before it left, and the
 * incoming one would arrive as an empty frame and only then start building —
 * so the slide itself would have nothing in it to see.
 *
 * So the carousel does two things:
 *
 * **1 · It freezes each scene just short of its own fade-out.** `FREEZE` is
 * 4790, earlier than the earliest scene fade (4800), so no panel ever begins
 * dissolving. A panel leaves holding its finished frame — the full report, the
 * completed timeline — which is the frame actually worth showing on the way
 * out. Nothing in any scene had to be edited for this; clamping the clock is
 * enough, because they are all pure functions of it.
 *
 * **2 · The incoming panel's clock starts when it lands**, and every scene
 * plays its whole run centred and unoccluded.
 *
 * This started out the other way — the incoming clock started when the panel
 * started *moving*, so it arrived already `TRANS` into its own opening and the
 * slide had something in it. That was wrong, and two scenes proved it. The
 * Sarah call spends its first **750ms** on the calling state — the button
 * appearing, the label, the ripples establishing — and the lesson fans its
 * three tutor cards out at **250ms with a 110ms stagger**. A 620ms lead-in
 * swallowed nearly all of both. These scenes were each finished as complete
 * 0→5000ms pieces; the carousel does not get to eat the first beat of one.
 *
 * The cost is that a panel slides in showing its own first frame, which for
 * all four scenes is an empty one — so the join is a finished frame sweeping
 * out rather than a new one sweeping in. `TRANS` came down to 500 to keep that
 * brief. Worth it: no scene is ever seen part-played.
 *
 * ── The cycle, per panel ──────────────────────────────────────────
 *
 * Panel `j` measures time as `v = t - j·STEP`, wrapped into `[-TRANS, STEP)`:
 *
 * | `v` | | scene clock |
 * |---|---|---|
 * | `-TRANS → 0` | sliding in from the right | held at `0` |
 * | `0 → FREEZE` | **centred — the scene plays in full** | `0 → FREEZE` |
 * | `FREEZE → STEP` | sliding out to the left | frozen at `FREEZE` |
 *
 * `STEP === FREEZE + TRANS`, which is what makes those line up: the scene
 * reaches its last frame exactly as the panel starts to leave.
 */

/** The scene frame. All four exports agree on this. */
export const FRAME = { w: 370, h: 330, r: 20 }

/**
 * The shared background.
 *
 * Three of the four scenes already paint `#0D0B10`; the report was drawn on
 * `#1C1920`. Since the report's own frame is transparent, the carousel paints
 * this once, behind everything, and the panels slide over an unbroken surface
 * rather than each carrying its own card.
 */
export const BG = '#0D0B10'

/** Just short of the earliest scene fade-out (report and lesson, at 4800). */
export const FREEZE = 4790

/**
 * The slide. Long enough to read as travel, short enough that the empty frame
 * behind the departing panel never becomes a wait.
 */
export const TRANS = 500

/** One panel's turn, landing to landing: its full run, then its exit. */
export const STEP = FREEZE + TRANS

export const PANELS = ['sarah', 'lesson', 'conversation', 'report']
export const LOOP = STEP * PANELS.length

export const LABELS = {
  sarah: 'Calls with Sarah',
  lesson: 'Learn with 12+ AI tutors',
  conversation: 'Practice conversation',
  report: 'Report',
}

/**
 * The slide easing.
 *
 * In-out and gentle at both ends. A carousel that starts instantly reads as a
 * cut with extra steps, and one that stops instantly reads as a bump — the
 * whole point of the beat is that the eye is carried across it.
 */
export const slideEase = bezier(0.62, 0.02, 0.2, 1)

/**
 * Where panel `j` is at carousel time `t`.
 *
 * Returns the panel's x offset in px, whether it is worth rendering at all,
 * and the **local scene clock** to hand it. A pure function of `t`, like
 * everything inside the scenes, so the whole carousel scrubs.
 */
export function panelAt(t, j) {
  // v ∈ [-TRANS, STEP): negative means this panel is on its way in
  let v = mod(t - j * STEP, LOOP)
  if (v >= LOOP - TRANS) v -= LOOP

  // the scene clock runs only while the panel is centred: held at its first
  // frame on the way in, stopped just short of its own fade-out on the way out
  const ms = clamp(v, 0, FREEZE)

  if (v < -TRANS || v >= STEP) return { render: false, x: FRAME.w, ms: 0, phase: 'off' }

  if (v < 0) {
    // sliding in from the right, showing its first frame
    const p = slideEase((v + TRANS) / TRANS)
    return { render: true, x: FRAME.w * (1 - p), ms, phase: 'in' }
  }
  if (v >= FREEZE) {
    // sliding out to the left, holding its finished frame
    const p = slideEase((v - FREEZE) / TRANS)
    return { render: true, x: -FRAME.w * p, ms, phase: 'out' }
  }
  return { render: true, x: 0, ms, phase: 'centre' }
}

/** Which panel currently owns the centre, for the dev readout. */
export function indexAt(t) {
  return Math.floor(mod(t, LOOP) / STEP)
}

// ── helpers ───────────────────────────────────────────────────────
export const mod = (a, n) => ((a % n) + n) % n
export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)

/** A cubic-bezier evaluated properly: Newton on x, then read y. */
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const fx = (t) => ((ax * t + bx) * t + cx) * t
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx
  return (x) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 8; i++) {
      const e = fx(t) - x
      if (Math.abs(e) < 1e-6) break
      const d = dx(t)
      if (Math.abs(d) < 1e-6) break
      t -= e / d
    }
    return ((ay * t + by) * t + cy) * t
  }
}
