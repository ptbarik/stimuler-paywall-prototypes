/**
 * The glyphs.
 *
 * The paywall's own — chevron, shield, cross — are the export's paths. The
 * roadmap screen's are drawn to its silhouettes rather than lifted: `1.png` is
 * a flattened PNG with no SVG twin, so there is nothing to lift, and tracing a
 * 24px icon off a 1× raster produces something worse than redrawing it.
 *
 * The crown is the exception and is not here: it is the export's real path,
 * in `components/CrownGlyph.jsx`, because the whole interstitial is made of it.
 */

const s = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.7,
}

/* ── the paywall ──────────────────────────────────────────────────── */

/** The FAQ chevron, at the export's 13.4×9 with its 2.3px round join. */
export function Chevron() {
  return (
    <svg className="cv" viewBox="0 0 13.4 9" aria-hidden>
      <path d="M1.15 1.15 6.7 6.7l5.55-5.55" {...s} strokeWidth="2.3" />
    </svg>
  )
}

/** The reassurance line's shield-and-tick. */
export function ShieldCheck() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden>
      <path d="M7 1.2 12 3v4.1c0 3-2.1 5-5 5.7-2.9-.7-5-2.7-5-5.7V3l5-1.8Z" {...s} strokeWidth="1" />
      <path d="M4.9 7.1 6.3 8.6 9.2 5.5" {...s} strokeWidth="1.15" />
    </svg>
  )
}

export function Cross() {
  return (
    <svg viewBox="0 0 8 8" aria-hidden>
      <path d="M.6.6l6.8 6.8M.6 7.4 7.4.6" {...s} strokeWidth="1.3" />
    </svg>
  )
}

/* ── the roadmap ──────────────────────────────────────────────────── */

export function Flame() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden>
      <path
        d="M10 2.2c.6 2.3-.5 3.4-1.6 4.4C7 7.9 5.6 9.2 5.6 11.6a4.4 4.4 0 0 0 8.8 0c0-2.1-.8-3.3-1.7-4.4-.3.9-.9 1.4-1.5 1.6.5-2.4-.3-4.7-1.2-6.6Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function PlayCircle() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden>
      <circle cx="7" cy="7" r="5.9" {...s} strokeWidth="1.2" />
      <path d="M5.8 4.7 9.4 7l-3.6 2.3V4.7Z" fill="currentColor" />
    </svg>
  )
}

export function VideoTag() {
  return (
    <svg viewBox="0 0 17 17" aria-hidden>
      <rect x="1.4" y="4" width="10.6" height="9" rx="2" fill="currentColor" />
      <path d="M12 8.2 15.6 6v5l-3.6-2.2Z" fill="currentColor" />
    </svg>
  )
}

export function Sparkle() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path d="M6 1.6 7.1 5 10.5 6 7.1 7.1 6 10.5 5 7.1 1.6 6 5 5 6 1.6Z" fill="currentColor" />
      <path d="M12 8.6 12.6 10.4 14.4 11 12.6 11.6 12 13.4 11.4 11.6 9.6 11 11.4 10.4 12 8.6Z" fill="currentColor" />
    </svg>
  )
}

export function Swords() {
  return (
    <svg viewBox="0 0 26 26" aria-hidden>
      <path d="M4 4h4l13 13v4h-4L4 8V4Z" {...s} />
      <path d="M22 4h-4L5 17v4h4L22 8V4Z" {...s} />
    </svg>
  )
}

export function GrammarBox() {
  return (
    <svg viewBox="0 0 26 26" aria-hidden>
      <rect x="3.5" y="3.5" width="19" height="19" rx="4" {...s} />
      <path d="M10 10.2a3 3 0 1 1 3 3v1.6" {...s} />
      <circle cx="13" cy="18.2" r="1" fill="currentColor" />
    </svg>
  )
}

/* ── the nav bar ──────────────────────────────────────────────────── */

function NavLearn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 6.5h8a3 3 0 0 1 3 3v5a3 3 0 0 0 3 3h2" {...s} />
      <path d="M4 11.5h6" {...s} />
      <circle cx="19.5" cy="6.5" r="2" {...s} />
      <circle cx="4.5" cy="17.5" r="2" {...s} />
    </svg>
  )
}

function NavPractice() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        d="M4 10.5c0-2.8 0-4.2.9-5.1.8-.9 2.2-.9 5-.9h4.2c2.8 0 4.2 0 5 .9.9.9.9 2.3.9 5.1s0 4.2-.9 5.1c-.8.9-2.2.9-5 .9H10l-4.4 3v-3.4c-.9-.3-1.3-.8-1.6-1.5-.2-.9-.2-2.1-.2-4.1Z"
        {...s}
      />
    </svg>
  )
}

function NavCall() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        d="M6.6 4.5 9 4l1.8 4-2 1.4c.6 2 2.1 3.6 4 4.4l1.5-2 4 1.7-.4 2.4c-.2 1-1.1 1.7-2.1 1.6C10.6 17 7 13.4 5 8.3c-.4-1 .2-2.2 1.2-2.4Z"
        {...s}
      />
      <path d="M14.5 5.2a5.2 5.2 0 0 1 4.3 4.3" {...s} strokeWidth="1.4" />
    </svg>
  )
}

function NavProfile() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="8.5" r="3.7" {...s} />
      <path d="M4.6 19.2c1-3.1 3.9-4.7 7.4-4.7s6.4 1.6 7.4 4.7" {...s} />
    </svg>
  )
}

export const NAV_ICONS = [NavLearn, NavPractice, NavCall, NavProfile]
