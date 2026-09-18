/**
 * Everything the two exports say, and the four places they disagree.
 *
 * The PRO and PRO+ frames are the same page with four substitutions — the
 * conversation line, the user count, the rating, and the first FAQ. They are
 * written out per tier rather than templated because that is how the export
 * has them, and a template would quietly hide how small the difference is.
 */

export const FEATURES = {
  pro: [
    ['lessons', '100+ English practice lessons'],
    ['chat', 'Up to 40mins conversations with Sarah'],
    ['reps', '300+ Exercises for practice'],
    ['cancel', 'Cancel Your Plan Anytime'],
  ],
  plus: [
    ['lessons', '100+ English practice lessons'],
    ['chat', 'Get unlimited conversations with Sarah'],
    ['reps', '300+ Exercises for practice'],
    ['cancel', 'Cancel Your Plan Anytime'],
  ],
}

/** Left label, PRO value, PRO+ value. The table is identical on both tiers —
    only which column is lit changes. */
export const TABLE = [
  /* V3 lifts PRO's roadmap to 100+ too, so this row no longer separates the
     tiers — carried as the export has it rather than corrected. */
  ['Roadmap Days', '100+ Days', '100+ Days'],
  ['Chat with Sarah', 'Daily\npractice', 'Unlimited'],
  ['Access to calling\nwith Sarah AI tutor', 'Daily\n40 mins', 'Unlimited'],
  ['Priority support\nfrom English Experts', 'Yes', 'Yes'],
  ['Learn New Vocabulary\nEveryday challenge', 'Yes', 'Yes'],
]

export const PROOF = {
  pro: { users: '13Mn+', rating: '4.9' },
  plus: { users: '12Mn+', rating: '4.8' },
}

export const TESTIMONIALS = [
  {
    quote:
      '“At last I found an app that really helps you to grow. Direct to the point instructions for every lesson”',
    name: 'Mateo González',
    role: 'Software developer, Mexico City',
    photo: '/assets/learner-1.jpg',
  },
  {
    quote:
      '“I speak up in stand-ups now without rehearsing the sentence first. Eight weeks, and the hesitation is gone.”',
    name: 'Priya Raman',
    role: 'Product manager, Bengaluru',
    photo: null,
  },
  {
    quote:
      '“The roadmap is the part that got me. I always knew what tomorrow was, so I never had to decide to practise.”',
    name: 'Tobias Lindqvist',
    role: 'Data analyst, Malmö',
    photo: null,
  },
]

export const FAQ = {
  pro: [
    'Why should I get Stimuler Pro?',
    'Will the price increase in future ?',
    'Is my payment secure & can I cancel my plan anytime',
    'What to do if I am facing any problems in purchase ?',
  ],
  plus: [
    'Why should I get Stimuler Pro+?',
    'Will the price increase in future ?',
    'Is my payment secure & can I cancel my plan anytime',
    'What to do if I am facing any problems in purchase ?',
  ],
}

export const FAQ_BODY = [
  'It unlocks the full roadmap, unlimited practice with Sarah and priority support from our English experts — the same plan our fastest-improving learners are on.',
  'Your rate is locked for as long as your plan stays active. The welcome offer itself is time-limited and will not return at this price.',
  'Payments run through the App Store and Play Store, so we never see your card. Cancel from your store settings at any time and keep access until the period ends.',
  'Write to us at support@stimuler.tech with your order ID and we will sort it within one working day.',
]

/** The price block. `was` is V2's only new number — the coupon never showed it. */
export const PRICE = {
  pro: { yearly: '$49.99', was: '$99.99', monthly: '$12.99', off: '50% OFF' },
  plus: { yearly: '$49.99', was: '$99.99', monthly: '$12.99', off: '50% OFF' },
}

export const OFFER = {
  eyebrow: 'WELCOME OFFER',
  figure: '50% OFF',
  pct: '50%',
  sub: 'For limited time only, offer ends soon',
  heading: ['Limited Time', '50%', ' Offer Today'],
  reassure: 'Learn with confidence. Cancel anytime.',
}
