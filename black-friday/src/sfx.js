/**
 * The flow's sound and haptics — synthesised in Web Audio, not sampled.
 *
 * Every sound is built at the moment it plays, so each one is cut to the exact
 * length of the motion it belongs to and scheduled on the audio clock rather
 * than a timer. A timer drifts a frame or two; the audio clock does not — and
 * with twenty-odd reel clicks landing inside two seconds, a drifting frame is
 * the difference between a machine and a rattle. Nothing loads, so nothing has
 * to be waited for.
 *
 * The set is small on purpose — one machine, not a sound per event:
 *
 *   lever    the pull: a ratchet, a spring, and the clunk of it bottoming out
 *   reel     a reel turning: a click train that widens as the drum slows
 *   detent   a reel stopping: a hard wooden chunk, each one a tone higher
 *   jackpot  all three landed: a glass arpeggio up C major over a warm bloom
 *   coins    the payout: sparse metal, falling
 *   build    the page arriving: the same chord, held, with confetti tinkles
 *
 * Everything sits in C major so the three detents climb *into* the jackpot
 * chord rather than being three knocks followed by a tune.
 *
 * Not over-stimulating is the brief, held three ways: the master level is low
 * and runs through a compressor, so nothing spikes; every sound has a soft
 * attack and falls away rather than stopping; and the only thing that repeats
 * — the reel click — drops in level as the drum slows, so the machine quietens
 * into its own landing.
 *
 * A short generated reverb sits under everything at a low mix. It is what
 * makes six separate sounds read as one room instead of six clicks.
 *
 * Haptics use `navigator.vibrate`, which Android honours and iOS Safari and
 * desktop ignore. Each is a few milliseconds — a tick, not a buzz — and they
 * mark only the physical beats: the lever, the three detents, the landing.
 */

let ctx = null
let master = null
let wet = null
let noiseBuf = null
let enabled = true

const MASTER = 0.5

export function setEnabled(on) {
  enabled = on
  if (master && ctx) master.gain.setTargetAtTime(on ? MASTER : 0, ctx.currentTime, 0.02)
}

export function isEnabled() {
  return enabled
}

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
    wet.gain.value = 0.2
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
 * A glass bell, by FM: a sine carrier bent by a second sine at 3.5× its pitch,
 * the bend dying away faster than the note. The fast-dying bend is the strike —
 * bright for a few milliseconds, then pure — which is what a plain sine never
 * has, and why a plain sine reads as a beep.
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

/* ── the machine ─────────────────────────────────────────────────── */

export const sfx = {
  /* the arm coming down: a ratchet running under a spring stretching, then the
     dull clunk of it hitting the stop. Panned right, where the lever is. */
  lever(at = 0) {
    if (!ready()) return
    const t = now() + at
    for (let i = 0; i < 7; i++) {
      noise({ t: t + i * 0.021, dur: 0.012, gain: 0.05 - i * 0.004, type: 'bandpass',
              f: 2400 - i * 130, Q: 7, attack: 0.001, send: 0.3, pan: 0.45 })
    }
    tone({ t, f: 420, to: 190, dur: 0.17, gain: 0.035, type: 'sawtooth', attack: 0.01, glide: 0.15, send: 0.4, pan: 0.4 })
    tone({ t: t + 0.15, f: 150, to: 72, dur: 0.16, gain: 0.1, attack: 0.004, glide: 0.11, send: 0.35, pan: 0.3 })
    noise({ t: t + 0.15, dur: 0.05, gain: 0.07, type: 'lowpass', f: 1100, Q: 0.8, attack: 0.001, send: 0.3, pan: 0.3 })
  },

  /**
   * One drum turning. A click train whose gap widens by 5.5% each step, which
   * is deceleration as the ear hears it, with the level falling as it widens so
   * the reel quietens into its own stop instead of ending mid-clatter.
   */
  reel(at = 0, dur = 1, pan = 0) {
    if (!ready()) return
    const t0 = now() + at
    let t = 0
    let gap = 0.021
    while (t < dur - 0.02) {
      const k = 1 - t / dur
      noise({ t: t0 + t, dur: 0.011, gain: 0.012 + 0.03 * k, type: 'bandpass',
              f: 1500 + Math.random() * 900, Q: 5, attack: 0.001, send: 0.25, pan })
      t += gap
      gap *= 1.055
    }
  },

  /* a drum dropping into its notch: a short wooden chunk with a pitched body,
     the body climbing C–E–G across the three so the stops make a chord */
  detent(at = 0, i = 0) {
    if (!ready()) return
    const t = now() + at
    const body = [261.6, 329.6, 392][i] || 261.6
    const pan = [-0.3, 0, 0.3][i] || 0
    noise({ t, dur: 0.045, gain: 0.17, type: 'bandpass', f: 1250, Q: 5.5, attack: 0.001, send: 0.3, pan })
    tone({ t, f: body * 2, to: body, dur: 0.11, gain: 0.055, attack: 0.002, glide: 0.07, send: 0.4, pan })
    tone({ t, f: 120, to: 66, dur: 0.1, gain: 0.06, attack: 0.003, glide: 0.07, send: 0.2 })
  },

  /* all three landed: a glass arpeggio up two octaves of C major spreading
     left and right, over a soft bloom and a low swell — the high point */
  jackpot(at = 0) {
    if (!ready()) return
    const t = now() + at
    ;[1046.5, 1318.5, 1568, 2093, 2637, 3136].forEach((f, i) =>
      glass({ t: t + i * 0.034, f, dur: 1.6 - i * 0.12, gain: 0.05, index: 1.4,
              pan: (i % 2 ? 1 : -1) * (0.15 + i * 0.1) }))
    noise({ t, dur: 0.4, gain: 0.075, type: 'lowpass', f: 3200, to: 450, attack: 0.006, send: 0.9 })
    tone({ t, f: 261.6, to: 130.8, dur: 0.4, gain: 0.05, attack: 0.01, glide: 0.3, send: 0.6 })
  },

  /* the payout: sparse metal, high and short, scattered across the field and
     falling in pitch as the pile settles */
  coins(at = 0, n = 14) {
    if (!ready()) return
    const t = now() + at
    for (let i = 0; i < n; i++) {
      const d = i * 0.045 + Math.random() * 0.05
      const k = 1 - i / n
      glass({ t: t + d, f: (2400 + Math.random() * 1600) * (0.6 + k * 0.5), dur: 0.3 + Math.random() * 0.3,
              gain: 0.016 + 0.014 * k, index: 2.4, ratio: 5.1, pan: (Math.random() - 0.5) * 1.3, send: 1.1 })
      noise({ t: t + d, dur: 0.02, gain: 0.02 * k, type: 'highpass', f: 5200, attack: 0.001, send: 0.8,
              pan: (Math.random() - 0.5) * 1.2 })
    }
  },

  /* the page arriving under the machine: the chord the arpeggio was climbing
     to, held, with a few confetti tinkles on the pentatonic so no two clash */
  build(at = 0) {
    if (!ready()) return
    const t = now() + at
    tone({ t, f: 130.8, to: 98, dur: 0.35, gain: 0.14, attack: 0.008, glide: 0.3, send: 0.4 })
    ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone({ t: t + i * 0.03, f, dur: 1.8, gain: 0.046, type: i % 2 ? 'sine' : 'triangle', attack: 0.04, send: 1.2 }))
    noise({ t, dur: 0.5, gain: 0.035, f: 500, to: 2600, Q: 1.1, attack: 0.22, send: 1 })
    const pent = [2093, 2349, 2637, 3136, 3520]
    for (let i = 0; i < 7; i++) {
      bell({ t: t + 0.1 + i * 0.15 + Math.random() * 0.06, f: pent[(i * 3) % 5], dur: 0.6, gain: 0.015 })
    }
  },
}
