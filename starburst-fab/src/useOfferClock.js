import { useEffect, useState } from 'react'

/**
 * One 24-hour window, and every readout on the button derived from it.
 *
 * The three stops are the ones the sheet drew its keyframes at — full, a
 * little past halfway, and inside the last hour — so switching stops puts the
 * running prototype on the exact frame the design was signed off at, rather
 * than somewhere near it.
 */
export const STOPS = [
  { id: 'full', label: '23:59:41', seconds: 86381, note: 'the rim full' },
  { id: 'mid',  label: '13:12:00', seconds: 47520, note: 'the rim at 55%' },
  { id: 'last', label: '00:52:00', seconds: 3120,  note: 'inside the last hour' },
]

const DAY = 86400
const pad = (n) => String(n).padStart(2, '0')

export function useOfferClock(stopId) {
  const stop = STOPS.find((s) => s.id === stopId) ?? STOPS[0]
  const [left, setLeft] = useState(stop.seconds)

  useEffect(() => { setLeft(stop.seconds) }, [stop.seconds])

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  const hh = Math.floor(left / 3600)
  const mm = Math.floor((left % 3600) / 60)
  const ss = left % 60
  return {
    left,
    parts: { hh: pad(hh), mm: pad(mm), ss: pad(ss) },
    hms: `${pad(hh)}:${pad(mm)}:${pad(ss)}`,
    ms: `${pad(Math.floor(left / 60))}:${pad(ss)}`,
    fraction: left / DAY,
    lastHour: left < 3600,
  }
}
