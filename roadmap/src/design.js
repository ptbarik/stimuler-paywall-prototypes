/**
 * Every number here is measured out of `~/Desktop/Roadmap Paywall/PRO.svg` and
 * `PRO+.svg` — the two 412×2558 exports of Figma `11032:8142` / `11032:8409`.
 *
 * The exports outline their text, so nothing below is read off a Figma text
 * node: positions are path bounds, colours are fill attributes, and type sizes
 * are back-solved from cap heights against a 1:1 render of each frame. Where
 * the two tiers disagree the difference is carried as a CSS variable in
 * `index.css` rather than duplicated here — the page is one layout in two
 * palettes, which is the whole reason a toggle can swap it in place.
 *
 * The one gift in the export: the hero is a **370×330 block at (21, 265.3)**,
 * and 370×330 is exactly the frame `02-ai-tutors` was composed to. So the
 * animation drops in at native size — no scale, no re-layout — and its own
 * "Learn with 12+ AI tutors" caption lands within 0.3px of where the export
 * draws it. `src/scenes/lesson` is that project's source, vendored unedited.
 */

export const PAGE_H = 2558

/** The hero animation's slot, in page coordinates. */
export const HERO = { x: 21, y: 265.315, w: 370, h: 330 }

/** Headline, two lines. The second is the tier's accent colour. */
export const HEAD = ['Lessons built for your', 'learning journey']

/**
 * The four benefit rows.
 *
 * Row 2 is the only line in the whole page whose *words* change with the tier —
 * Pro caps calls at 40 minutes, Pro+ does not — so it is the one entry that
 * carries a per-tier string instead of a shared one.
 */
export const BENEFITS = [
  { icon: 'lessons', text: '100+ Practice lessons tailored to your goal' },
  {
    icon: 'chat',
    pro: 'Up to 40mins conversations with Sarah',
    plus: 'Get unlimited conversations with Sarah',
  },
  { icon: 'pen', text: '300+ Exercises for practice' },
  { icon: 'calendar', text: 'Cancel Your Plan Anytime' },
]

export const benefitText = (b, tier) => b.text ?? b[tier]

/** PRO vs PRO+ — five rows, the delta marked inside one table rather than two. */
export const TABLE_ROWS = [
  { label: 'Roadmap Days', pro: '100+ Days', plus: '100+ Days' },
  { label: 'Chat with Sarah', pro: 'Daily\npractice', plus: 'Unlimited' },
  { label: 'Access to calling\nwith Sarah AI tutor', pro: 'Daily\n40 mins', plus: 'Unlimited' },
  { label: 'Priority support\nfrom English Experts', pro: 'Yes', plus: 'Yes' },
  { label: 'Learn New Vocabulary\nEveryday challenge', pro: 'Yes', plus: 'Yes' },
]

/** The table, in page coordinates. */
export const TABLE = {
  box: { x: 15, y: 832.5, w: 382, h: 417.7, r: 32 },
  head: 926.3, // the PRO / PRO+ pills
  /** the four divider lines the export draws, in page coordinates */
  rules: [995.45, 1038.85, 1103.62, 1168.38],
  /**
   * Each row's line-box centre.
   *
   * Not derived from the dividers: the export's rows are *not* centred in
   * their own bands. Row 1 sits 3px below its band's middle (the pills above
   * it eat into the space) and row 5 sits 5px below its own, which is why a
   * mid = (band[i] + band[i+1]) / 2 model puts the last two rows visibly high.
   * These are measured off the render instead — the cap-to-baseline centre of
   * each row's text, plus the 1.15px between that and the line box CSS
   * actually centres.
   */
  mids: [973.5, 1016.5, 1071, 1135.5, 1200],
  col: { pro: 190.3, plus: 285.28, w: 84.79 },
  hl: { y: 917.25, h: 305.73, r: 12.5 },
  rule: { x: 44.14, w: 326.93 },
}

/** The two plans on the pinned sheet. Both tiers show the same prices. */
export const PLANS = [
  { id: 'yearly', name: { pro: 'PRO YEARLY', plus: 'PRO+ YEARLY' }, badge: '50% OFF', price: '$49.99' },
  { id: 'monthly', name: { pro: 'PRO MONTHLY', plus: 'PRO+ MONTHLY' }, price: '$12.99' },
]

export const CTA_LABEL = { pro: 'Get Stimuler PRO', plus: 'Get Stimuler PRO+' }
export const TRUST_LINE = 'Learn with confidence. Cancel anytime.'

/** The award block. Three hard line breaks, right-aligned, as the export sets it. */
export const AWARD = ['Google play', 'Best AI App', 'Worldwide']

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

/**
 * The export only draws the FAQ collapsed. The answers are written here so the
 * rows do something; the block is the last thing on the page, so opening one
 * only grows the page rather than moving anything above it.
 */
export const FAQS = [
  {
    q: 'Why should I get Stimuler Pro?',
    a: 'Pro opens the full roadmap, daily practice with Sarah and priority support from English experts — the whole coach, not a sample of it.',
  },
  {
    q: 'Will the price increase in future ?',
    a: 'Your rate is locked for as long as your plan stays active. If pricing changes, it changes for new subscribers only.',
  },
  {
    q: 'Is my payment secure & can I\ncancel my plan anytime',
    a: 'Payments run through the App Store and Play Store, so Stimuler never sees your card. Cancel from your store subscriptions at any time.',
  },
  {
    q: 'What to do if I am facing any\nproblems in purchase ?',
    a: 'Write to support@stimuler.com with your order id. Purchase issues are answered the same day.',
  },
]
