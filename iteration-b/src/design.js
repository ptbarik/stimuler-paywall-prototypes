/**
 * Everything measured out of `Paywall Design.svg`.
 *
 * The design is two 412×917 phone frames — Pro (indigo) and Pro+ (gold) — over
 * a 412×2483 scrolling page, plus a 4-up row of loose carousel slides with
 * their captions. Every number below is read off that file: frame-local
 * coordinates from the SVG's own frame rects, colours sampled from a 1:1 render
 * of each frame.
 *
 * The single most useful thing in the export: **a bare 370×330 rect at (21, 218)**
 * where the hero animation goes. That is exactly the frame all four feature
 * scenes were built to, so the carousel drops in at native size — no scaling,
 * no re-layout.
 */

export const FRAME = { w: 412, h: 917 }
export const PAGE_H = 2558

/**
 * The hero animation's slot.
 *
 * Iteration B moves the tier toggle out of the price sheet and up into the
 * header, above the caption — so everything in the hero drops to make room and
 * the sheet loses the 57px the toggle used to occupy inside it.
 *
 * The 2026-08-24 18:56 re-export then tightened the whole thing: the header
 * block came up 12px, the sheet 20, the table stayed exactly where it was, and
 * everything from the social proof down moved *down* a little — which is how a
 * page that got tighter at the top still ends up 42px taller (2516 → 2558).
 * The extra height is the CTA bar, which grew 108 → 126.
 */
export const CAR = { x: 21, y: 278, w: 370, h: 330 }

/**
 * The four slides.
 *
 * `head` is the caption above the animation, as two lines with the accent word
 * marked. Slide 1 is the one place the two tiers say genuinely different things
 * — Pro caps the call at 40 minutes, Pro+ doesn't — and that difference reaches
 * one step further in, into the scene's own pill (`pill`). Slides 2–4 keep the
 * same words on both tiers and only recolour the accent.
 */
export const SLIDES = [
  {
    scene: 'sarah',
    pro:  { head: [[['Up to 40 mins', 0]], [['of calls with Sarah', 1]]], pill: '40 Minutes' },
    // Pro+ names both halves of what it is: everything Pro has, *plus* the
    // uncapped calls. The two accented runs are the two things being bought.
    plus: {
      head: [
        [['All the ', 0], ['benefits of Pro', 1], [',', 0]],
        [['and ', 0], ['unlimited calls', 1], [' with Sarah', 0]],
      ],
      pill: 'Unlimited',
    },
  },
  {
    scene: 'lesson',
    both: [[['100+ Lessons', 1], [' to', 0]], [['choose from', 0]]],
  },
  {
    scene: 'conversation',
    both: [[['Speak with confidence', 1]], [['with every practice session', 0]]],
  },
  {
    scene: 'report',
    both: [[['Get detailed feedback', 1]], [['on every metric in a tap', 0]]],
  },
]

/** The caption for slide `i` on tier `tier`, as line → [text, isAccent][]. */
export function headFor(i, tier) {
  const s = SLIDES[i]
  return s.both ?? s[tier].head
}

/** The Sarah scene's pill label. Only slide 1 has one. */
export const pillFor = (tier) => SLIDES[0][tier].pill

/** PRO vs PRO+ — five rows, the delta marked inside one table rather than two. */
export const TABLE_ROWS = [
  { label: 'Roadmap Days',                          pro: '50+ Days',      plus: '100+ Days' },
  { label: 'Chat with Sarah',                       pro: 'Daily\npractice', plus: 'Unlimited' },
  { label: 'Access to calling\nwith Sarah AI tutor', pro: 'Daily\n40 mins', plus: 'Unlimited' },
  { label: 'Priority support\nfrom English Experts', pro: 'Yes',          plus: 'Yes' },
  { label: 'Learn New Vocabulary\nEveryday challenge', pro: 'Yes',        plus: 'Yes' },
]

/** Row bands, from the divider positions in the export. */
export const TABLE = {
  box: { x: 15, y: 892, w: 382, h: 418, r: 32 },
  head: 985.8,           // the PRO / PRO+ pills
  bands: [1006, 1054.5, 1098.5, 1163, 1227.5, 1282.7],
  col: { pro: 190.3, plus: 283.5, w: 84.8 },
  hl: { y: 977, h: 305.7, r: 12.5 },
  rule: { x: 44, w: 326 },
}

export const PLANS = [
  { id: 'yearly',  name: 'PRO YEARLY',  sub: 'Best value for committed learners.', price: '$200.00 / year',
    badge: 'HIGHLY RECOMMENDED', ctaSub: { pro: 'Pro Yearly • Save up to 33%', plus: 'Pro Yearly • Save up to 33%' } },
  { id: 'monthly', name: 'PRO MONTHLY', sub: 'Flexible plans for lasting fluency', price: '$46.99 / month',
    ctaSub: { pro: 'Pro Monthly', plus: 'PRO+ Monthly' } },
]

/** The CTA verb changes with the tier; the sub-line changes with the plan. */
export const CTA_LABEL = { pro: 'Start Learning', plus: 'Go Unlimited' }

/** New in iteration B: a reassurance line sitting just above the CTA. */
export const TRUST_LINE = 'Learn with confidence. Cancel anytime.'

export const TESTIMONIALS = [
  { img: 't1.jpg', q: '“At last I found an app that really helps you to grow. Direct to the point instructions for every lesson”',
    name: 'Mateo González', role: 'Software developer, Mexico City' },
  { img: 't2.png', q: '“I am an introvert. The app is really helpful for me personally. I am practicing English consistently now “',
    name: 'Santiago Rodríguez', role: 'Accountant, Buenos Aires' },
  { img: 't3.png', q: '“This app really helped me with my pronunciation. The features improved my English”',
    name: 'Camila López', role: 'Architect, Chicago' },
  { img: 't4.png', q: '“Excellent app for speaking and chatting! It’s improved my English with effective practice”',
    name: 'Isabella Hernández', role: 'Designer, Los Angeles' },
  { img: 't5.png', q: '“Its worthy guys! Its not expensive among quality they provide! Smarty professional & effective app”',
    name: 'Valentina Martínez', role: 'Beautician, Rio de Janeiro' },
]

export const FAQS = [
  { q: 'Why should I get Stimuler Pro?',
    a: 'Pro opens the full roadmap, daily practice with Sarah and priority support from English experts — the whole coach, not a sample of it.' },
  { q: 'Will the price increase in future ?',
    a: 'Your rate is locked for as long as your plan stays active. If pricing changes, it changes for new subscribers only.' },
  { q: 'Is my payment secure & can I\ncancel my plan anytime',
    a: 'Payments run through the App Store and Play Store, so Stimuler never sees your card. Cancel from your store subscriptions at any time.' },
  { q: 'What to do if I am facing any\nproblems in purchase ?',
    a: 'Write to support@stimuler.com with your order id. Purchase issues are answered the same day.' },
]
