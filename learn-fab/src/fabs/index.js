import { A1, A4, A5 } from './A.jsx'
import { B1 } from './B.jsx'
import { N1, N2, N3, N4 } from './N.jsx'
import { G1, G2, G3 } from './G.jsx'

/**
 * The eleven, in the sheet's own order and with the sheet's own notes.
 *
 * `reacts` is what the variant needs from the prototype to be worth looking
 * at: the clock, the scroller, or a finished lesson. The switcher surfaces
 * exactly that control and says so, rather than showing five sliders of which
 * four do nothing to the button on screen.
 */
export const FABS = [
  { id: 'A1', family: 'A', name: 'Crossfade readout', C: A1,
    note: 'two messages, one slot · holds 3.2s each, 420ms crossfade with a 6px drift' },
  { id: 'A4', family: 'A', name: 'Depleting rim', C: A4, reacts: 'clock',
    note: 'the border is the clock · one 24h sweep, no readout, warms to red under an hour' },
  { id: 'A5', family: 'A', name: 'Sarah, with the S mark', C: A5,
    note: 'the Stimuler route glyph instead of a letter · a ring pulses out of it every 8s' },
  { id: 'B1', family: 'B', name: 'Two-tier', C: B1,
    note: 'at the slot rather than full bleed · slides up 96px on entry, digits never animate' },
  { id: 'N1', family: 'N', name: 'Collapse on scroll', C: N1, reacts: 'scroll',
    note: 'gets out of the way while you read, comes back when you stop · 280ms each way' },
  { id: 'N2', family: 'N', name: 'Last hour', C: N2, reacts: 'clock',
    note: 'the clock drops a field and the housing warms · one 900ms transition, once' },
  { id: 'N3', family: 'N', name: 'Earned entrance', C: N3, reacts: 'lesson',
    note: 'absent until a lesson lands, then rises 96px while the ring fills · 620ms' },
  { id: 'N4', family: 'N', name: 'Shine sweep', C: N4,
    note: 'a 22° band crosses the action every 4.75s · 1.15s sweep, 3.6s pause' },
  { id: 'G1', family: 'G', name: 'Frosted pane', C: G1,
    note: 'neutral frost, 26px blur · gold appears twice and only twice, the crown and the action' },
  { id: 'G2', family: 'G', name: 'Gold-tinted glass', C: G2,
    note: 'a gold veil at 22% falling to 2%, with a gold rim and a gold top light' },
  { id: 'G3', family: 'G', name: 'Edge-lit', C: G3,
    note: 'colourless pane · a 2px gold light along the top edge, the action outlined not filled' },
]

export const FAMILIES = [
  { key: 'A', label: 'A · inset pill', tint: '#E9B94D' },
  { key: 'B', label: 'B · two-tier band', tint: '#E9B94D' },
  { key: 'N', label: 'N · new since', tint: '#43D6A0' },
  { key: 'G', label: 'G · glass + gold', tint: '#9AC7FF' },
]

export const byId = (id) => FABS.find((f) => f.id === id) ?? FABS[0]
