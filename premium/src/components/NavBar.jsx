import { useCallback, useEffect, useRef, useState } from 'react'
import { HOME } from '../copy'
import { NAV } from '../design'
import { NAV_ICONS } from '../Icons'
import CrownGlyph from './CrownGlyph'

/**
 * The nav bar, and the crown's specular sweep.
 *
 * ── Why a sweep, and why it is capped ─────────────────────────────
 *
 * The returning user's entry point is a light band travelling across the crown
 * glyph, behind a mask clipped to the glyph, over 900ms. Not a scale, not a
 * bounce, not a badge:
 *
 * - a **badge** claims something is waiting for you, and nothing is; a tab
 *   that lies about having news is a tab people learn to distrust
 * - a **bounce or a pulse** is a loop, and anything that loops in a nav bar
 *   becomes wallpaper inside a day — after which it costs attention forever
 *   and buys none
 *
 * A sweep is a single event with a beginning and an end, which is why it can
 * be noticed without being nagging — and why the cap matters more than the
 * animation does. **Three per session, at least 60s apart**, and never while a
 * sheet or a modal is open. The fourth sweep in a session would be the one
 * that taught the user to stop seeing it, so there isn't one.
 *
 * The counter is per mount, deliberately: a session is a session, and a page
 * reload is a new one.
 */
const MAX_SWEEPS = 3
const GAP = 60_000

/**
 * When the first one lands.
 *
 * In the product this is a few seconds after the app settles — a sweep during
 * page load lands unread. In the prototype that is a few seconds of watching
 * nothing, so the flow that is *about* the crown catching your eye asks for it
 * sooner. Same cap, same spacing, same rules; only the first delay differs,
 * and it differs because the thing being demonstrated is the first one.
 */
const FIRST = 4_000
const FIRST_EAGER = 900

export default function NavBar({ active, onPremium, blocked, reduced, eager, sweepNow }) {
  const [sweeping, setSweeping] = useState(false)
  const fired = useRef(0)
  const blockedRef = useRef(blocked)
  blockedRef.current = blocked

  const run = useCallback(() => {
    setSweeping(true)
    setTimeout(() => setSweeping(false), 950)
  }, [])

  useEffect(() => {
    if (reduced) return
    let timer
    const schedule = (delay) => {
      timer = setTimeout(() => {
        if (fired.current >= MAX_SWEEPS) return
        // never over a sheet or a modal: the sweep would be arguing with the
        // thing it is trying to send you to
        if (blockedRef.current) {
          schedule(5_000) // look again shortly rather than burning the slot
          return
        }
        fired.current += 1
        run()
        if (fired.current < MAX_SWEEPS) schedule(GAP)
      }, delay)
    }
    schedule(eager ? FIRST_EAGER : FIRST)
    return () => clearTimeout(timer)
  }, [reduced, eager, run])

  /* the panel's "Sweep now", which does not spend one of the three: it is
     showing the animation, not exercising the cap */
  useEffect(() => {
    if (sweepNow) run()
  }, [sweepNow, run])

  return (
    <nav className="nav">
      {HOME.nav.map((label, i) => {
        const isPremium = i === 4
        const Icon = NAV_ICONS[i]
        return (
          <button
            key={label}
            className={i === active ? 'on' : ''}
            style={{ left: NAV.x[i] - 32 }}
            onClick={isPremium ? onPremium : undefined}
            aria-current={i === active ? 'page' : undefined}
          >
            {/* `sweep` mounts the light band *inside* the SVG, clipped to the
                crown's own two paths — so the light travels through the glyph's
                shape, including the gaps between its points, rather than across
                a box that happens to contain a crown. It exists only while the
                sweep is running, so the animation starts on mount and cannot be
                caught half-played. */}
            {isPremium ? (
              <span className={`crownwrap${sweeping ? ' sweep' : ''}`}>
                <CrownGlyph size={24} shadow={false} sweep={sweeping} style={{ display: 'block' }} />
              </span>
            ) : (
              <Icon />
            )}
            {label}
          </button>
        )
      })}
    </nav>
  )
}
