/**
 * Everything the offer page says, taken from the Paper board 28E-0 and, where
 * that board reuses the shipping paywall's cards, from the shipping paywall.
 * Only the two lines that are specific to the sale are new.
 */

export const HEADLINE = ['Get fluent for half the price,', 'Invest in the skill that opens doors.']

export const BENEFITS = {
  eyebrow: 'PREMIUM BENEFITS',
  head: 'Everything you need to speak confidently',
  cards: [
    { icon: 'ic-lessons', title: '100+ lessons', sub: 'Grammar, pronunciation & vocab in short daily lessons.' },
    { icon: 'ic-roleplay', title: '50+ roleplays', sub: 'Order food, sit an interview, make small talk.' },
    { icon: 'ic-sarah', title: 'Sarah, daily', sub: 'Up to 30 minutes on call with your AI tutor.' },
    { icon: 'ic-sound', title: 'Sound clearer', sub: 'A few minutes of fluency practice every day.' },
  ],
}

export const TIMELINE_TITLE = 'Your first 8 weeks at a glance'

export const TIMELINE = [
  ['DAY 1', 'Your first call with Sarah', 'Up to 30 minutes, on any topic you pick.'],
  ['DAY 3', 'Roleplays that match your life', '50+ themes — interviews, ordering, small talk.'],
  ['WEEK 2', 'Pronunciation starts feeling natural', 'A few minutes of daily drills, plus 100+ lessons.'],
  ['WEEK 8', 'You speak without rehearsing', 'Put your practice into action in real-life conversations.'],
]

/* broken where the board breaks it: the last line is `12 weeks` on its own */
export const CLAIM = { figure: '92%', text: ['Stimuler users speak fluently in', '12 weeks'] }

export const TESTIMONIALS = [
  { quote: '“At last I found an app that really helps you to grow. Direct to the point instructions for every lesson”',
    name: 'Mateo González', role: 'Software developer, Mexico City', photo: '/assets/learner-1.png' },
  { quote: '“I am an introvert. The app is really helpful for me personally. I am practicing English consistently now”',
    name: 'Santiago Rodríguez', role: 'Accountant, Buenos Aires', photo: '/assets/t2.png' },
  { quote: '“This app really helped me with my pronunciation. The features improved my English”',
    name: 'Camila López', role: 'Architect, Chicago', photo: '/assets/t3.png' },
  { quote: '“Excellent app for speaking and chatting! It’s improved my English with effective practice”',
    name: 'Isabella Hernández', role: 'Designer, Los Angeles', photo: '/assets/t4.png' },
  { quote: '“Its worthy guys! Its not expensive among quality they provide! Smarty professional & effective app”',
    name: 'Valentina Martínez', role: 'Beautician, Rio de Janeiro', photo: '/assets/t5.png' },
]

export const COMPARE = [
  ['Lessons', '2', 'Unlimited'],
  ['Themes with Sarah', '4', 'Unlimited'],
  ['Premium community', 'No', 'Yes'],
  ['Priority support', 'No', 'Yes'],
  ['Talking minutes', '10 min', 'Unlimited'],
]

export const FAQ = [
  ['Why should I get Stimuler Pro?',
    'It unlocks all 100+ lessons, daily calls with Sarah and instant feedback on every sentence you speak — the plan our fastest-improving learners are on.'],
  ['Will the price increase in future ?',
    'Your rate is locked for as long as your plan stays active. The Black Friday price runs for this sale only and is not guaranteed to return.'],
  ['Is my payment secure & can I cancel my plan anytime',
    'Payments run through the App Store and Play Store, so we never see your card. Cancel from your store settings at any time and keep access until the period ends.'],
  ['What to do if I am facing any problems in purchase ?',
    'Write to us at support@stimuler.tech with your order ID and we will sort it within one working day.'],
]

export const REASSURE = 'Learn with confidence. Cancel anytime.'
export const CTA = 'Get started'

export const PLANS = [
  { id: 'yearly', label: 'Yearly Plan', badge: 'SAVE 50%', price: '₹83/month', note: '₹999 billed annually', was: '₹1,999' },
  { id: 'monthly', label: 'Monthly Plan', badge: null, price: '₹249/month', note: 'Billed monthly', was: null },
]
