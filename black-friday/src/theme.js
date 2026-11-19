/* Every value here is sampled from the Paper designs, not invented:
   reveal 2IM-0, landed 2L2-0, offer page 28E-0 (file "Paywalls 2.0").

   The whole screen is three materials and nothing else — gold, maroon, cream —
   on an indigo-purple ground. That is what makes it hang together: the slot
   machine is not an object sitting on a background, it is cut from the same
   three materials as the type and the cards. */

/* The ground is the app's own gold theme (board 312-0), not the indigo the
   first pass used. A gold-and-maroon machine on an indigo field was always two
   worlds sharing a screen; on warm near-black it is one object in one room. */
export const BG =
  'linear-gradient(180deg, #2A1804 0%, #1A0E02 60%, #120800 100%)'

/* the 412×460 wash across the top, verbatim from 312-0 */
export const BG_GLOW =
  'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,191,77,0.30) 0%, rgba(255,191,77,0) 70%)'

/* Board 7L0-0 — no brown left anywhere. The page is the app's own indigo all
   the way down, and the hero's 412x460 is an opaque violet wash over it, so the
   mark and the machine are the only lit things on the screen. */
export const BG_V2 =
  'linear-gradient(180deg, #110D1E 23.29%, #06050E 53.35%, #100D1E 84.03%)'

export const BG_GLOW_V2 =
  'radial-gradient(ellipse 107.74% 58.54% at 50% 6.51%, rgba(23,26,78,0.30) 0%, #06040D 100%)'

/* a second, hotter light that only exists once the reels land — the machine's
   own aura spilling onto the page */
export const BG_LIT =
  'radial-gradient(ellipse 86% 34% at 50% 26%, rgba(255,191,77,0.20) 0%, rgba(255,191,77,0) 72%),' +
  'radial-gradient(ellipse 70% 26% at 50% 6%, rgba(255,191,77,0.18) 0%, rgba(255,191,77,0) 75%)'

/* the same spill, in the silver flow's own light */
export const BG_LIT_V2 =
  'radial-gradient(ellipse 86% 34% at 50% 26%, rgba(170,182,255,0.16) 0%, rgba(170,182,255,0) 72%),' +
  'radial-gradient(ellipse 70% 26% at 50% 6%, rgba(170,182,255,0.14) 0%, rgba(170,182,255,0) 75%)'

/* the machine's gold rail: #F2CF7A → #B8862B → #E9C46A, run on the diagonal */
export const GOLD = {
  1: '#F2CF7A',
  2: '#B8862B',
  3: '#E9C46A',
  light: '#FFF1D8',
  mid: '#D49C4B',
  deep: '#8A5E14',
  line: '#E7CA79',
  css: 'linear-gradient(135deg,#F2CF7A 0%,#B8862B 50%,#E9C46A 100%)',
  flat: 'linear-gradient(180deg,#FFF1D8 0%,#F2CF7A 38%,#C8942F 100%)',
}

/* The machine's case. It was maroon, which was the one hue on the screen that
   did not belong to the gold family — beside the sticker's amber it read as a
   clash rather than an accent. It is now the same espresso the page's panels
   are made of, so the machine is a dark object with gold edges and the sticker
   is the only bright thing in the hero. */
export const CASE = {
  1: '#4A3010',
  2: '#2A1A06',
  3: '#2A1709',
  well: '#2E1A09',
  css: 'linear-gradient(140deg,#4A3010 0%,#2A1A06 50%,#2A1709 100%)',
}

/* The machine's rails sit a stop below the sticker's gold on purpose. Two
   equally bright golds stacked on each other is the other half of why the hero
   felt busy; now the value ladder runs sticker → rail → case → page. */
export const RAIL = {
  1: '#E8CB83',
  2: '#A3761F',
  3: '#D3A94E',
  deep: '#7A5512',
  line: '#C9A961',
}

/* The silver machine, for the 7L0-0 page. The gold one was built to sit on a
   warm field; on a page that goes indigo under the hero it merges with the
   banner above it instead of standing apart. Same construction — rail, case,
   well — a stop cooler at every step, with the case a graphite rather than an
   espresso so the chrome reads as chrome and not as brass gone grey. */
export const STEEL = {
  1: '#EEF2F8',
  2: '#8A91A3',
  3: '#C6CEDC',
  deep: '#5B6274',
  line: '#AFB7C7',
}

export const CASE_STEEL = {
  1: '#4E5468',
  2: '#2C3040',
  3: '#23262F',
  well: '#272A36',
}

/* the reel faces */
export const CREAM = {
  1: '#FBF7EF',
  2: '#E4D8C2',
  line: '#D8CBB2',
  idle: '#BCA887',
  ink: '#30190A',
}

/* the one hot accent — a brightened cabinet maroon, so urgency never arrives
   as a colour the rest of the screen has not already used */
export const EMBER = {
  hot: '#FF6A4D',
  mid: '#E04A2F',
  glow: 'rgba(255,106,77,0.40)',
}

export const TEXT = {
  hi: '#F6E7C6',
  white: '#FFFFFF',
  warm: '#C2A47A',
  mid: 'rgba(255,255,255,0.74)',
  low: 'rgba(255,255,255,0.56)',
  faint: 'rgba(255,255,255,0.36)',
  /* the two gradient text fills the gold theme uses for labels and headings */
  label: 'linear-gradient(90deg,#B09A6E 0%,#FFF0C9 52%,#E6C88B 100%)',
  head: 'linear-gradient(90deg,#EAB259 0%,#FFE292 52%,#EAB259 100%)',
}

/* surfaces, from 312-0 */
export const SURFACE = {
  panel: 'linear-gradient(180deg,#3A2508 0%,rgba(58,37,8,0.85) 38.06%,rgba(13,7,0,0.79) 100%)',
  tile: 'rgba(231,202,121,0.05)',
  line: 'rgba(231,202,121,0.12)',
  hair: 'rgba(231,202,121,0.10)',
  chip: '#241704',
  sheet:
    'linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.035) 26%, rgba(255,255,255,0) 54%),' +
    'linear-gradient(180deg, rgba(34,23,10,0.86) 0%, rgba(58,43,22,0.78) 100%)',
  sheetLine: 'rgba(231,202,121,0.48)',
  tabbar: '#140C02',
  tabline: 'rgba(231,202,121,0.14)',
  planOn: 'radial-gradient(ellipse 54% 96% at 50% 50%, #4A3613 0%, #2A1B08 82%)',
  planOff: '#33240F',
  planOffLine: '#6B5428',
  cta: 'linear-gradient(90deg,#DB992F 0%,#FFE090 50%,#DB992F 100%)',
  ctaShadow: 'rgba(219,153,47,0.30)',
}

export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  snap: [0.34, 1.56, 0.64, 1],
}

/* ?still=1 freezes every entry animation at its finished state, for screenshots
   and design review. The motion still runs in normal use. */
export const STILL =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('still') === '1'
