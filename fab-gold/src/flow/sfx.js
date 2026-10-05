/**
 * The flow's sound and haptics — synthesised, not sampled.
 *
 * Every sound is built in Web Audio at the moment it plays, so each one can
 * be cut to the length of the motion it belongs to and scheduled on the audio
 * clock rather than a timer (a timer drifts a frame or two; the audio clock
 * does not). Nothing is loaded, so there is nothing to wait for.
 *
 * The palette is deliberately small and soft — one family of sounds, not a
 * sound per event:
 *
 *   thud     the box landing: a low sine falling in pitch, felt more than heard
 *   shimmer  the offer headline arriving: four high bell notes, rising
 *   rattle   the box rocking: three tiny wooden ticks, only the first twice
 *   windup   the box squashing before it opens: a short rising breath
 *   pop      the lid coming off: a cork, with a knock under it and air after
 *   air      light coming out of the box: a high chord swelling in
 *   bloop    the ball leaving the box: a soft bubble up an octave, then a ping
 *   burst    the ball opening: a glass arpeggio over a poof and glitter
 *   rise     the badge flying up to the page: a swoosh gliding into the chord
 *
 * Everything from the gift's arrival to the badge landing sits in C major —
 * the key of the arrival chord — so the sequence climbs *into* that chord
 * rather than being a string of effects followed by a tune. The bells are
 * FM-synthesised glass, and the sounds are spread across the stereo field.
 *   arrive   the badge landing on the page: a warm chord, a few tinkles
 *
 * **Not over-stimulating** is the brief, and it is held three ways: the master
 * level is low and runs through a compressor, so nothing spikes; every sound
 * has a soft attack and falls away rather than stopping; and the one thing
 * that repeats (the rattle) plays for the first two rocks only and then the
 * box rocks in silence.
 *
 * A short generated reverb sits under everything at a low mix — it is what
 * makes nine separate sounds read as one space instead of nine clicks.
 *
 * Haptics use `navigator.vibrate`, which Android browsers honour and iOS
 * Safari and desktop browsers ignore. Each is a few milliseconds — a tick, not
 * a buzz — and they mark only the physical beats: the landing, the lid, the
 * burst, the arrival.
 */

let ctx = null
let master = null
let wet = null
let noiseBuf = null
let enabled = true

export function setEnabled(on) {
  enabled = on
  if (master && ctx) master.gain.setTargetAtTime(on ? MASTER : 0, ctx.currentTime, 0.02)
}

const MASTER = 0.55

/** Create the context on a user gesture — browsers refuse audio before one. */
export function unlock() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    ctx = new AC()
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -18
    comp.knee.value = 12
    comp.ratio.value = 4
    comp.attack.value = 0.003
    comp.release.value = 0.2
    master = ctx.createGain()
    master.gain.value = enabled ? MASTER : 0
    master.connect(comp).connect(ctx.destination)

    /* the room: 1.4s of decaying stereo noise as an impulse, mixed low */
    const len = Math.floor(ctx.sampleRate * 1.4)
    const ir = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2)
    }
    const verb = ctx.createConvolver()
    verb.buffer = ir
    wet = ctx.createGain()
    wet.gain.value = 0.22
    wet.connect(verb).connect(master)

    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const n = noiseBuf.getChannelData(0)
    for (let i = 0; i < n.length; i++) n[i] = Math.random() * 2 - 1
  }
  if (ctx.state === 'suspended') ctx.resume()
}

const now = () => (ctx ? ctx.currentTime : 0)
const ready = () => ctx && enabled

/* ── building blocks ─────────────────────────────────────────────── */

function out(node, send = 1, pan = 0) {
  let n = node
  if (pan && ctx.createStereoPanner) {
    const p = ctx.createStereoPanner()
    p.pan.value = pan
    n = node.connect(p)
  }
  n.connect(master)
  if (send) {
    const s = ctx.createGain()
    s.gain.value = send
    n.connect(s).connect(wet)
  }
}

/** One oscillator with an attack/decay envelope and an optional glide. */
function tone({ t, f, to, type = 'sine', dur = 0.3, gain = 0.1, attack = 0.008, glide = dur, send = 1, pan = 0 }) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(f, t)
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + glide)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g)
  out(g, send, pan)
  o.start(t)
  o.stop(t + dur + 0.05)
}

/**
 * A glass bell, by FM: a sine carrier bent by a second sine at 3.5× its
 * pitch, the bend dying away faster than the note. The fast-dying bend is
 * the *strike* — bright for a few milliseconds, then pure — which is what
 * a plain sine never has and why the old bells sounded like beeps.
 */
function glass({ t, f, dur = 1.2, gain = 0.04, index = 1.6, ratio = 3.5, pan = 0, send = 1.3 }) {
  const car = ctx.createOscillator()
  const mod = ctx.createOscillator()
  const modGain = ctx.createGain()
  const g = ctx.createGain()
  car.frequency.value = f
  mod.frequency.value = f * ratio
  modGain.gain.setValueAtTime(f * index, t)
  modGain.gain.exponentialRampToValueAtTime(f * 0.02, t + dur * 0.35)
  mod.connect(modGain).connect(car.frequency)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  car.connect(g)
  out(g, send, pan)
  car.start(t); mod.start(t)
  car.stop(t + dur + 0.05); mod.stop(t + dur + 0.05)
}

/** A bell: a sine and two inharmonic partials that die faster than it does. */
function bell({ t, f, dur = 1.2, gain = 0.06, send = 1.4 }) {
  tone({ t, f, dur, gain, attack: 0.004, send })
  tone({ t, f: f * 2.76, dur: dur * 0.45, gain: gain * 0.28, attack: 0.003, send })
  tone({ t, f: f * 5.4, dur: dur * 0.2, gain: gain * 0.12, attack: 0.002, send })
}

/** Filtered noise, with the filter optionally swept. */
function noise({ t, dur = 0.1, gain = 0.1, type = 'bandpass', f = 1000, to, Q = 1, attack = 0.004, send = 0.6, pan = 0 }) {
  const src = ctx.createBufferSource()
  src.buffer = noiseBuf
  const filt = ctx.createBiquadFilter()
  filt.type = type
  filt.Q.value = Q
  filt.frequency.setValueAtTime(f, t)
  if (to) filt.frequency.exponentialRampToValueAtTime(to, t + dur)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(filt).connect(g)
  out(g, send, pan)
  src.start(t, Math.random() * 0.5)
  src.stop(t + dur + 0.05)
}

export function haptic(pattern) {
  if (!enabled) return
  try { navigator.vibrate?.(pattern) } catch { /* not supported — fine */ }
}

/* ── the sounds, each at `at` seconds from now ───────────────────── */

export const sfx = {
  thud(at = 0) {
    if (!ready()) return
    const t = now() + at
    /* pitched up from a true sub-thump: phone speakers roll off under ~200Hz,
       so the fall runs 220 → 85 with a soft knock on top that they can play */
    tone({ t, f: 220, to: 85, dur: 0.2, gain: 0.12, attack: 0.006, glide: 0.16, send: 0.3 })
    noise({ t, dur: 0.06, gain: 0.08, type: 'lowpass', f: 900, send: 0.2 })
  },

  /* the headline arriving: four glass notes climbing a C major chord, left
     to right, over a breath of pad — the key the whole flow resolves in */
  shimmer(at = 0) {
    if (!ready()) return
    const t = now() + at
    ;[1318.5, 1568, 2093, 2637].forEach((f, i) => glass({ t: t + i * 0.085, f, dur: 1.3, gain: 0.042, index: 1.1, pan: -0.35 + i * 0.23 }))
    ;[523.25, 783.99].forEach((f) => tone({ t, f, dur: 1.5, gain: 0.016, attack: 0.35, send: 1.4 }))
  },

  rattle(at = 0) {
    if (!ready()) return
    const t = now() + at
    /* three small wooden knocks: a narrow band of noise with a short pitched
       body under it, so they read as a lid on a box rather than static */
    ;[0, 0.085, 0.16].forEach((d, i) => {
      const k = 1 - i * 0.28
      noise({ t: t + d, dur: 0.04, gain: 0.2 * k, f: 1300, Q: 6, send: 0.3, pan: i % 2 ? 0.15 : -0.15 })
      tone({ t: t + d, f: 620, to: 480, dur: 0.05, gain: 0.03 * k, attack: 0.002, send: 0.3 })
    })
  },

  /* the squash before the lid goes: a short rising breath, so the pop has
     something to release */
  windup(at = 0) {
    if (!ready()) return
    const t = now() + at
    tone({ t, f: 300, to: 540, dur: 0.2, gain: 0.03, attack: 0.08, glide: 0.18, send: 0.6 })
    noise({ t, dur: 0.18, gain: 0.025, f: 700, to: 1600, Q: 1.2, attack: 0.1, send: 0.6 })
  },

  /* the lid coming off: a cork — a pitch dropping fast off a bright start —
     with a soft knock of the box under it and air as the lid lifts away */
  pop(at = 0) {
    if (!ready()) return
    const t = now() + at
    tone({ t, f: 1150, to: 260, dur: 0.07, gain: 0.105, attack: 0.002, glide: 0.035, send: 0.5 })
    noise({ t, dur: 0.03, gain: 0.06, f: 1600, Q: 0.9, attack: 0.001, send: 0.4 })
    tone({ t, f: 170, to: 105, dur: 0.12, gain: 0.07, attack: 0.004, glide: 0.1, send: 0.2 })
    noise({ t: t + 0.03, dur: 0.28, gain: 0.035, f: 900, to: 2600, Q: 1.1, attack: 0.08, send: 0.8, pan: 0.2 })
  },

  /* light coming up out of the box: a high C major chord swelling in, each
     voice a few cents apart so it shimmers, with air on top */
  air(at = 0, dur = 0.8) {
    if (!ready()) return
    const t = now() + at
    ;[[1046.5, -0.3], [1318.5, 0.3], [1568, 0], [1052, 0.15]].forEach(([f, pan]) =>
      tone({ t, f, dur, gain: 0.016, attack: dur * 0.5, send: 1.5, pan }))
    noise({ t, dur, gain: 0.03, type: 'highpass', f: 5000, attack: dur * 0.5, send: 1 })
  },

  /* the ball leaving the box: a soft rising bubble, G5 up to G6, with a small
     glass ping as it comes to hang */
  bloop(at = 0) {
    if (!ready()) return
    const t = now() + at
    tone({ t, f: 784, to: 1568, dur: 0.3, gain: 0.06, attack: 0.02, glide: 0.24, send: 0.9 })
    tone({ t, f: 392, to: 784, dur: 0.24, gain: 0.02, type: 'triangle', attack: 0.02, glide: 0.22, send: 0.9 })
    glass({ t: t + 0.26, f: 1568, dur: 0.7, gain: 0.022, index: 0.9 })
  },

  /* the ball opening: a quick glass arpeggio up two octaves of C major,
     spreading out left and right, over a soft *poof* of air and a bloom
     under it, with glitter — the sequence's high point */
  burst(at = 0) {
    if (!ready()) return
    const t = now() + at
    ;[1046.5, 1318.5, 1568, 2093, 2637, 3136].forEach((f, i) =>
      glass({ t: t + i * 0.032, f, dur: 1.6 - i * 0.12, gain: 0.052, index: 1.4, pan: (i % 2 ? 1 : -1) * (0.15 + i * 0.1) }))
    noise({ t, dur: 0.42, gain: 0.09, type: 'lowpass', f: 3200, to: 450, attack: 0.006, send: 0.9 })
    tone({ t, f: 261.6, to: 130.8, dur: 0.38, gain: 0.05, attack: 0.01, glide: 0.3, send: 0.6 })
    for (let i = 0; i < 12; i++) {
      noise({ t: t + 0.04 + i * 0.035 + Math.random() * 0.02, dur: 0.012, gain: 0.03 * (1 - i / 14),
              type: 'highpass', f: 5500 + Math.random() * 2500, attack: 0.001, send: 1.2, pan: Math.random() * 1.6 - 0.8 })
    }
  },

  /* the badge flying up to the page: a swoosh and a glide from C6 to G6 —
     it lifts into the arrival chord rather than stopping short of it */
  rise(at = 0) {
    if (!ready()) return
    const t = now() + at
    noise({ t, dur: 0.55, gain: 0.045, f: 420, to: 2200, Q: 1.1, attack: 0.25, send: 1 })
    tone({ t, f: 1046.5, to: 1568, dur: 0.55, gain: 0.02, attack: 0.22, glide: 0.5, send: 1.2 })
  },

  arrive(at = 0) {
    if (!ready()) return
    const t = now() + at
    tone({ t, f: 130.8, to: 98, dur: 0.35, gain: 0.16, attack: 0.008, glide: 0.3, send: 0.4 })
    ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone({ t: t + i * 0.03, f, dur: 1.8, gain: 0.05, type: i % 2 ? 'sine' : 'triangle', attack: 0.03, send: 1.2 }))
    /* a few confetti tinkles, sparse and quiet, on the pentatonic so no two
       can clash */
    const pent = [2093, 2349, 2637, 3136, 3520]
    for (let i = 0; i < 6; i++) bell({ t: t + 0.12 + i * 0.16 + Math.random() * 0.06, f: pent[(i * 3) % 5], dur: 0.6, gain: 0.016 })
  },
}
