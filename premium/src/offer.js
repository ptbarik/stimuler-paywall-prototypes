/**
 * The offer window — the one source of truth for it.
 *
 * The interstitial's copy, the paywall badge and the sticky CTA all read the
 * same two numbers from here. Nothing computes a remaining time of its own.
 *
 * ── The three rules ───────────────────────────────────────────────
 *
 * **1 · `startedAt` is written once and never rewritten.** Not on reload, not
 * on a second Premium visit, not on a reinstall. In production that is a
 * server column; here it is one `localStorage` key, and `start()` is the only
 * writer — it no-ops if the key already exists. If this is ever reset the
 * timer becomes a lie and the page loses the only thing it is asking to be
 * believed on.
 *
 * **2 · Expiry is terminal.** Past 24h the paywall renders the full price and
 * nothing anywhere references an offer that used to exist. There is no
 * extension, no grace period, no second window.
 *
 * **3 · The countdown is derived from the timestamp, every tick.** Never a
 * counter decremented from 24:00:00. A counter drifts against the frame clock,
 * and — the part that actually matters — it stops while the tab is
 * backgrounded, so a user who leaves for an hour comes back to an hour they
 * did not spend. `remaining()` is `WINDOW - (now - startedAt)`, so
 * backgrounding is not a case that needs handling; it is simply not a case.
 *
 * The dev panel's "set time remaining" writes `startedAt` *backwards* rather
 * than adding an offset — the same single number, moved — so the shortcut
 * exercises the real code path instead of a second one built to be tested.
 */

export const WINDOW = 24 * 60 * 60 * 1000

const KEY_START = 'stimuler.offerWindowStartedAt'
const KEY_INTRO = 'stimuler.hasSeenIntro'

const read = (k) => {
  try {
    return window.localStorage.getItem(k)
  } catch {
    return null // private mode, or storage disabled
  }
}
const write = (k, v) => {
  try {
    window.localStorage.setItem(k, v)
  } catch {
    /* nothing to do — the prototype degrades to a per-session window */
  }
}

/** ISO string, or null if the user has never opened the Premium tab. */
export function startedAt() {
  const v = read(KEY_START)
  return v || null
}

/**
 * Open the window, if it is not already open.
 *
 * Called on the Premium tab tap and nowhere else. Idempotent by construction:
 * the guard is the whole rule.
 */
export function start() {
  if (read(KEY_START)) return
  write(KEY_START, new Date().toISOString())
}

export function hasSeenIntro() {
  return read(KEY_INTRO) === '1'
}

export function markIntroSeen() {
  write(KEY_INTRO, '1')
}

/** ms left in the window. `0` once it has closed, and `0` if it never opened. */
export function remaining(now = Date.now()) {
  const s = startedAt()
  if (!s) return 0
  const left = WINDOW - (now - Date.parse(s))
  return left > 0 ? left : 0
}

/** Is the discount live? The single question the whole page branches on. */
export function offerActive(now = Date.now()) {
  return startedAt() !== null && remaining(now) > 0
}

/** `23 : 12 : 05` — the three fields the badge sets between its own colons. */
export function fields(ms) {
  const t = Math.max(0, Math.floor(ms / 1000))
  const p = (n) => String(n).padStart(2, '0')
  return [p(Math.floor(t / 3600)), p(Math.floor(t / 60) % 60), p(t % 60)]
}

/* ── dev controls ──────────────────────────────────────────────────
   Only the panel calls these. They move the same timestamp the rest of the
   file reads, so the states they produce are the real ones. */

/** Rewind the window's start so that exactly `ms` is left on it. */
export function devSetRemaining(ms) {
  write(KEY_START, new Date(Date.now() - (WINDOW - ms)).toISOString())
}

export function devResetWindow() {
  try {
    window.localStorage.removeItem(KEY_START)
  } catch {
    /* ignore */
  }
}

export function devResetIntro() {
  try {
    window.localStorage.removeItem(KEY_INTRO)
  } catch {
    /* ignore */
  }
}
