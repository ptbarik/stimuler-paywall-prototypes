/**
 * Every string on the screen, in one file.
 *
 * All of it is transcribed from the exports in `~/Desktop/premium tab`, not
 * rewritten. Two places where a brief and the design disagreed, and the design
 * won:
 *
 * - **Three interstitial beats, not two.** `4.png`, `5.png` and `6.png` are
 *   "Welcome to Stimuler PRO" → "You've unlocked a limited time offer!" →
 *   "Limited Time / 50% OFF". The middle beat is the one that names what is
 *   being given, and dropping it leaves the discount arriving unannounced.
 * - **`Practice`, not `Practise`.** US spelling, matching the `Practice` nav
 *   tab beside it. Consistency inside one screen beats correctness in one
 *   half of it.
 */

/* ── the roadmap, the screen the flow starts on ───────────────────── */
export const HOME = {
  greeting: 'Hey Sriram!',
  streak: '2',
  unit: ['Unit 1', 'Know your English level'],
  lessonKind: 'Roleplay',
  lessonTitle: 'Introduction',
  lessonCta: 'Start Lesson',
  note: 'Execises will be created based\non your weaker areas',
  locked: ['Reading Exercise', 'Grammar Practice'],
  nav: ['Learn', 'Practice', 'Call', 'Profile', 'Premium'],
}

/* ── the sheet, after a first lesson ──────────────────────────────── */
export const SHEET = {
  head: 'Unlock guided lessons,\npractice, and more',
  cta: 'Explore Premium',
}

/* ── the crown interstitial ───────────────────────────────────────── */
/**
 * The three beats.
 *
 * `\n` is a hard line break and `{}` marks the words that take the gold
 * accent — the same convention the onboarding prototype's intro beats use, so
 * the copy stays a readable string and nothing has to reach inside markup to
 * change it. Nothing is braced today: the design sets beats 1 and 2 entirely
 * in white and beat 3 entirely in gold, so the accent is on the line rather
 * than inside it.
 */
export const BEATS = {
  one: 'Welcome to',
  two: ['You’ve unlocked a', 'limited time offer!'],
  three: 'Limited Time',
  off: '50% OFF',
}

/* ── the paywall ──────────────────────────────────────────────────── */

/**
 * A caption per carousel slide.
 *
 * The export gives the first one under the frame in `7.png`; the other three
 * float loose beside it in `premium flow.png`, one per scene thumbnail. Each
 * is two parts — the second is the gold half of the line.
 */
export const SLIDES = [
  { scene: 'sarah', a: 'Have a real conversation with\nSarah, ', b: 'any time you want' },
  { scene: 'lesson', a: 'Learn with ', b: '12+ AI tutors' },
  { scene: 'conversation', a: 'Practice speaking, and\n', b: 'find out exactly what to fix' },
  { scene: 'report', a: 'Watch your English\nimprove, ', b: 'week by week' },
]

/**
 * The fifth caption the export draws.
 *
 * `premium flow.png` lays out four loose captions against three scene
 * thumbnails, so one of them has no frame to belong to. This is it. Kept here
 * because it is in the design and deleting it silently would lose the fact
 * that a decision was made; the dev panel can swap it onto the lesson slide.
 */
export const SPARE_CAPTION = {
  scene: 'lesson',
  a: 'Know what to practice next,\nwith ',
  b: 'lessons made for you',
}

export const TABLE_CHIP = 'Free vs PRO'

/**
 * Free vs PRO.
 *
 * `// NOTE:` the last row reads Yes in both columns, so as drawn the table
 * argues PRO adds nothing there. Flagged, not changed — the export is the
 * signed-off artefact and this prototype is not the place to renegotiate it.
 */
export const TABLE_ROWS = [
  { label: 'Roadmap Days', free: '✕', pro: '100+ Days' },
  { label: 'Chat with Sarah', free: '✕', pro: 'Unlimited' },
  { label: 'Access to calling\nwith Sarah AI tutor', free: '✕', pro: 'Upto\n40min/day' },
  { label: 'Priority support\nfrom English Experts', free: 'No', pro: 'Yes' },
  { label: 'Learn New Vocabulary\nEveryday challenge', free: 'Yes', pro: 'Yes' },
]

export const PROOF = {
  lovedBy: 'LOVED BY',
  users: ['13Mn+', 'users'],
  rating: ['4.9', 'Learner’s rating'],
  award: ['Google play', 'Best AI App', 'Worldwide'],
  claim: ['92%', 'Stimuler users\nspeak fluently\nin 12 weeks'],
}

export const TESTIMONIALS = [
  {
    img: 't1.jpg',
    q: '“At last I found an app that really helps you to grow. Direct to the point instructions for every lesson”',
    name: 'Mateo González',
    role: 'Software developer, Mexico City',
  },
  {
    img: 't2.png',
    q: '“I am an introvert. The app is really helpful for me personally. I am practicing English consistently now “',
    name: 'Santiago Rodríguez',
    role: 'Accountant, Buenos Aires',
  },
  {
    img: 't3.png',
    q: '“This app really helped me with my pronunciation. The features improved my English”',
    name: 'Camila López',
    role: 'Architect, Chicago',
  },
  {
    img: 't4.png',
    q: '“Excellent app for speaking and chatting! It’s improved my English with effective practice”',
    name: 'Isabella Hernández',
    role: 'Designer, Los Angeles',
  },
  {
    img: 't5.png',
    q: '“Its worthy guys! Its not expensive among quality they provide! Smarty professional & effective app”',
    name: 'Valentina Martínez',
    role: 'Beautician, Rio de Janeiro',
  },
]

export const FAQ_CHIP = 'Frequently asked questions'

/** The export only draws the FAQ shut; the answers are written to fill it. */
export const FAQS = [
  {
    q: 'Why should I get Stimuler Pro?',
    a: 'PRO opens the full 100+ day roadmap, unlimited chat with Sarah, up to 40 minutes of calling a day and priority support from English experts — the whole coach rather than a sample of it.',
  },
  {
    q: 'Will the price increase in future ?',
    a: 'Your rate is locked for as long as your plan stays active. If pricing changes it changes for new subscribers only.',
  },
  {
    q: 'Is my payment secure & can I\ncancel my plan anytime',
    a: 'Payments run through the Play Store, so Stimuler never sees your card. Cancel from your store subscriptions at any time.',
  },
  {
    q: 'What to do if I am facing any\nproblems in purchase ?',
    a: 'Write to support@stimuler.com with your order id. Purchase issues are answered the same day.',
  },
]

/* ── the pinned CTA ───────────────────────────────────────────────── */
export const CTA = {
  trust: 'Learn with confidence. Cancel anytime.',
  badge: 'Limited Time Offer Today',
  full: '₹1999',
  offer: '₹999',
  /** the sub-line reads the price actually being charged, so it swaps too */
  subOffer: 'Just ₹83 per month paid for a whole year',
  subFull: 'Just ₹167 per month paid for a whole year',
  action: 'Try Stimuler PRO for a year',
  more: 'See all plans',
}
