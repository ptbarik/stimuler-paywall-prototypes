/**
 * The Learn screen's roadmap, as the frame draws it.
 *
 * Three units, six lesson groups, one of them unlocked. Everything here was
 * read out of the export rather than invented — including the fact that the
 * only lesson carrying real art is Unit 1's, and that Unit 3's two lessons ask
 * for money where Unit 2's ask for yesterday's homework.
 *
 * One deliberate divergence: the export numbers Unit 3's nodes 2 and 3, which
 * is a duplicated group's numbering left behind rather than a decision — the
 * rail is a single sequence and it counts 1…6 here.
 */

export const HERO_H = 360        // 344 card + 16 of the block's own bottom pad
export const ROW_H = 104         // 88 card + 16
export const ROW_GAP = 2
export const NOTE_BLOCK = 84     // 12 above + 56 of two 28px lines + 16 below
export const GROUP_GAP = 22
export const NODE = 32           // every rail node, numbered or not

const PAIR = [
  { icon: 'twister', label: 'Tongue Twister' },
  { icon: 'grammar', label: 'Grammar Practice' },
]

export const UNITS = [
  {
    n: 1,
    title: 'Know your English level',
    rule: '#9F946B',
    tick: '#E7CEA5',
    lead: 32.29,                 // this unit's divider sits a little further off its rail
    groups: [
      {
        node: { n: 1, state: 'current' },
        hero: {
          state: 'open',
          tag: 'Roleplay',
          title: 'Introduction',
          cta: 'Start Lesson',
          art: '/assets/learner.png',
        },
        note: 'Execises will be created based on your weaker areas',
        rows: [
          { icon: 'twister', label: 'Reading exercise' },
          { icon: 'grammar', label: 'Grammar practice' },
        ],
      },
    ],
  },
  {
    n: 2,
    title: 'Restaurant conversations',
    rule: '#9F976B',
    tick: '#524760',
    lead: 28,
    groups: [
      { node: { n: 2 }, hero: { state: 'locked', tag: 'Grammar', title: 'Mastering pronouns', cta: 'Finish Day 1 to Unlock' }, rows: PAIR },
      { node: { n: 3 }, hero: { state: 'locked', tag: 'Vocabulary', title: 'Ordering Food', cta: 'Finish Day 1 to Unlock' }, rows: PAIR },
      { node: { n: 4 }, hero: { state: 'locked', tag: 'Roleplay', title: 'Ordering Food', cta: 'Finish Day 1 to Unlock' }, rows: PAIR },
    ],
  },
  {
    n: 3,
    title: 'Trip Planning conversation',
    rule: '#9F976B',
    tick: '#524760',
    lead: 28,
    groups: [
      { node: { n: 5 }, hero: { state: 'premium', tag: 'Grammar', title: 'Mastering Verbs', cta: 'Premium lesson' }, rows: PAIR },
      { node: { n: 6 }, hero: { state: 'premium', tag: 'Roleplay', title: 'Planning a trip', cta: 'Premium lesson' }, rows: PAIR },
    ],
  },
]

/** Where each of a group's rail nodes sits, measured from the group's top. */
export function nodeCentres(group) {
  const base = HERO_H + (group.note ? NOTE_BLOCK : 0)
  return [16, ...group.rows.map((_, i) => base + i * (ROW_H + ROW_GAP) + 44)]
}

export function groupHeight(group) {
  const rows = group.rows.length
  return HERO_H + (group.note ? NOTE_BLOCK : 0) + rows * ROW_H + (rows - 1) * ROW_GAP
}
