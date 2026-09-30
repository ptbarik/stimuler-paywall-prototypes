/**
 * Everything the page says.
 *
 * Two sources, deliberately: the **Figma export** for the chrome, the claims
 * and the prices, and the **Paper frame** (`Stimuler V1 → USA Paywalls → PRO`)
 * for the Premium Benefits rows. The Figma node ships that block as five
 * identical placeholder rows — same bulb, same sentence, five times — so the
 * five real icons and the five real lines come from Paper, which is what was
 * asked for.
 */

export const TITLE = 'Unlock PRO and speak English confidently with AI in weeks'

/**
 * Premium Benefits — the swipeable card row, as the Paper frame now draws it.
 *
 * This replaced the five-row list. Three things changed with it: the eyebrow
 * moved from centred-between-two-rules to left-aligned, a 32px gold headline
 * was added above the cards, and the five one-liners became four cards that
 * each carry a figure and a sentence.
 *
 * The icons are the frame's own 3D marks, pulled down as PNGs rather than
 * redrawn: they are lit and bevelled, and a flat SVG under a gold headline
 * would read as a different family.
 */
export const BENEFIT_HEAD = 'Everything you need to speak confidently'

export const BENEFIT_CARDS = [
  ['bulb', '100+ lessons', 'Grammar, vocab and pronunciation in short daily lessons.'],
  ['mic', '50+ roleplays', 'Order food, sit an interview, make small talk.'],
  ['phone', 'Sarah, daily', 'Up to 30 minutes on call with your AI tutor.'],
  ['book', 'Sound clearer', 'A few minutes of pronunciation practice each day.'],
]

/**
 * The proof band's four cards.
 *
 * The export draws it 569 wide in a 412 page with the neighbours sliced by
 * both edges, and its (hidden) pagination has four dashes — so it is a
 * carousel of four, shown one at a time with its neighbours peeking.
 * `users` is the one the frame has centred.
 */
export const PROOF = [
  { id: 'rank', big: '#1', sub: 'App\nAppstore India', w: 104 },
  /* one 92px text node in the export, which is what breaks it after `13Mn+`
     — the line break is the box, not a character */
  { id: 'users', eyebrow: 'LOVED BY', big: '13Mn+\nusers', w: 92, stack: true },
  { id: 'rating', big: '4.7', sub: 'Learner’s\nrating', w: 96, stars: true },
  { id: 'award', eyebrow: 'GOOGLE AWARDS', big: 'Best AI\nApp’23', fs: 20, w: 104 },
]

/** The 92% claim, split where the export's gradient text breaks it. */
export const CLAIM = { figure: '92%', lines: ['Stimuler users', 'speak fluently', 'in 12 weeks'] }

/** All five testimonial cards, in the export's own order. */
export const TESTIMONIALS = [
  {
    quote: '“At last I found an app that really helps you to grow. Direct to the point instructions for every lesson”',
    name: 'Mateo González',
    role: 'Software developer, Mexico City',
    photo: '/assets/learner-pro.jpg',
  },
  {
    quote: '“I am an introvert. The app is really helpful for me personally. I am practicing English consistently now “',
    name: 'Santiago Rodríguez',
    role: 'Accountant ,Buenos Aires',
    photo: '/assets/t2.png',
  },
  {
    quote: '“This app really helped me with my pronunciation. The features improved my English”',
    name: 'Camila López',
    role: 'Architect, Chicago',
    photo: '/assets/t3.png',
  },
  {
    quote: '“Excellent app for speaking and chatting! It’s improved my English with effective practice”',
    name: 'Isabella Hernández',
    role: 'Designer, Los Angeles',
    photo: '/assets/t4.png',
  },
  {
    quote: '“Its worthy guys! Its not expensive among quality they provide! Smarty professional & effective app”',
    name: 'Valentina Martínez',
    role: 'Beautician, Rio de Janeiro',
    photo: '/assets/t5.png',
  },
]

/**
 * The FAQ.
 *
 * The export only draws the four questions shut. The answers are written here
 * so the rows do something; the block is the last thing on the page, so
 * opening one only grows the page rather than shifting anything above it.
 */
export const FAQ = [
  [
    'Why should I get Stimuler Pro?',
    'It unlocks all 100+ lessons, daily calls with Sarah and instant feedback on every sentence you speak — the plan our fastest-improving learners are on.',
  ],
  [
    'Will the price increase in future ?',
    'Your rate is locked for as long as your plan stays active. ₹999 for the first year is the current price and it is not guaranteed to return.',
  ],
  [
    'Is my payment secure & can I  cancel my plan anytime',
    'Payments run through the App Store and Play Store, so we never see your card. Cancel from your store settings at any time and keep access until the period ends.',
  ],
  [
    'What to do if I am facing any  problems in purchase ?',
    'Write to us at support@stimuler.tech with your order ID and we will sort it within one working day.',
  ],
]

/**
 * The two plans, as the export writes them.
 *
 * `₹99/month` is set as one 32px node in Figma but drawn at three sizes in the
 * render, so it is composed here from its three parts. The yearly card is the
 * one the design has picked.
 */
export const PLANS = [
  {
    id: 'yearly',
    label: 'Yearly  Plan',
    cur: '₹',
    figure: '99',
    per: '/month',
    note: 'Just ₹999 per year',
    badge: 'Save 70%',
    cta: 'Get Stimuler PRO for 1 year',
  },
  {
    id: 'monthly',
    label: 'Monthly  Plan',
    cur: '₹',
    figure: '249',
    per: '',
    note: 'will be Billed Monthly',
    badge: null,
    cta: 'Get Stimuler PRO for 1 month',
  },
]
