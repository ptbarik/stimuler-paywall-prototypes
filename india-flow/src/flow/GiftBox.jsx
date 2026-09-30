import { useId } from 'react'
import { motion } from 'motion/react'

/**
 * The gift, as two separate pieces — lid and body — so the lid can leave.
 *
 * Both are the onboarding funnel's own art (`lid.svg`, `box-closed.svg`),
 * redrawn inline so the fills can take a palette: the purple one is the
 * funnel's exactly, the gold one is the same box re-inked for the gold page.
 * The body's viewBox starts at the mouth, so with the lid gone the dark inner
 * wall shows — the box reads as open, not as a box with its top cropped off.
 *
 * Geometry, in the funnel's own units: the lid is 181 × 93; the body hangs
 * 60.8 below the lid's top and is 181 × 147.5 including the mouth. Closed,
 * the lid's rim covers the mouth exactly.
 */

export const BOX = { w: 181, lidH: 93, bodyTop: 60.82, bodyH: 147.5 }

export const PALETTES = {
  pro: {
    body: '#4A42C4', inner: '#4A42C4', mouth: '#4038B8', rim: '#2E2880',
    lidTop: '#7B73FF', lidMid: '#5A52E0', lidFace: '#6C63FF',
    rib: '#FDF2C5', rib2: '#FBEEB8', rib3: '#FFF5CA',
    beam: '#BBB7FF',
    ball: ['#FFFFFF', '#C9C4FF', '#6C63FF'],
  },
  plus: {
    body: '#B07A20', inner: '#8E5F16', mouth: '#94621A', rim: '#6A420F',
    lidTop: '#F6CF6E', lidMid: '#D39B35', lidFace: '#E6B24C',
    rib: '#6B2F12', rib2: '#5E2A10', rib3: '#7A3718',
    beam: '#FFE29D',
    ball: ['#FFFFFF', '#FFE9A8', '#D39B35'],
  },
}

export function Lid({ p }) {
  return (
    <svg width={181} height={93} viewBox="0 0 181 93" style={{ display: 'block', overflow: 'visible' }}>
      <rect y="60.821" width="181" height="31.8426" fill={p.rim} />
      <path d="M10.0556 50.765H170.944L181 60.8206H0L10.0556 50.765Z" fill={p.lidTop} />
      <path d="M23.4628 39.0339H157.537L167.592 44.0617H13.4072L23.4628 39.0339Z" fill={p.lidMid} />
      <rect x="74" y="54.0007" width="17" height="39" fill={p.rib} />
      <rect x="91" y="54.0007" width="16" height="39" fill={p.rib2} />
      <path d="M13.4074 44.4807L23.463 39.0339H157.537L167.593 44.4807L170.944 48.5657L173.738 51.9699L181 60.8209L170.944 55.3742H10.0556L0 60.8209L7.4294 51.9699L10.0556 48.5657L13.4074 44.4807Z" fill={p.lidFace} />
      <path d="M7.42969 51.9716L10.0558 48.5674L18.4355 44.9362H162.379L170.945 48.5674L173.738 51.9716L166.103 49.4752H14.9714L7.42969 51.9716Z" fill={p.rib} />
      <path d="M107.259 55.3742H73.7407L75.1145 49.4735L75.8201 44.9345L76.8443 39.0339H104.156L105.142 44.9345L105.901 49.4735L107.259 55.3742Z" fill={p.rib} />
      <path d="M34.0558 21.0076C34.9251 8.55592 45.8654 -0.823904 58.4914 0.0574326C65.5713 0.551803 71.6772 4.1685 75.5226 9.44513L75.5998 9.30646L76.3517 10.6649C76.8295 11.4187 77.2631 12.2016 77.6496 13.0096L95.5851 45.4061L59.7746 45.0369C58.3309 45.2115 56.8488 45.2544 55.3429 45.1492C42.7171 44.2676 33.1867 33.4592 34.0558 21.0076ZM58.5851 11.8973C51.5053 11.4032 45.3652 16.7385 44.8713 23.8133C44.3849 30.7829 49.5597 36.841 56.4826 37.492L56.4777 37.5008L56.6984 37.5096C56.7311 37.5121 56.7643 37.5161 56.797 37.5184C57.0633 37.5369 57.3286 37.5454 57.592 37.5477L79.9416 38.5047L69.5119 19.6668C67.6763 15.3791 63.5605 12.2448 58.5851 11.8973Z" fill={p.rib} />
      <path d="M147.529 21.0076C146.66 8.5558 135.72 -0.824069 123.094 0.0573689C116.013 0.551823 109.906 4.1692 106.06 9.44702L105.985 9.30639L105.233 10.6648C104.756 11.4187 104.322 12.2015 103.935 13.0095L85.9999 45.406L125.108 45.407L125.001 45.2019C125.413 45.1949 125.827 45.1782 126.242 45.1492C138.868 44.2676 148.398 33.4593 147.529 21.0076ZM123.001 11.8972C130.081 11.4032 136.221 16.7385 136.715 23.8132C137.201 30.7828 132.026 36.8409 125.103 37.4919L125.108 37.5007L124.888 37.5095C124.855 37.5121 124.822 37.516 124.789 37.5183C124.523 37.5369 124.257 37.5453 123.994 37.5476L101.645 38.5046L112.074 19.6667C113.91 15.3789 118.025 12.2446 123.001 11.8972Z" fill={p.rib} />
    </svg>
  )
}

/* `lit` fills the box's opening with light — brightest at the back wall,
   where it would be coming up from inside — so the glow belongs to the
   inside of the box and not to its rim. */
export function Body({ p, lit = false }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={181} height={147.5} viewBox="431.104 316.924 181 147.5" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        {/* a glow from low in the box: warm and brightest in the middle of
            the opening, falling off to its corners — a lit interior, not a
            lit strip */}
        <radialGradient id={`${id}l`} cx="0.5" cy="1.1" r="0.75">
          <stop offset="0" stopColor={p.beam} stopOpacity=".95" />
          <stop offset="0.6" stopColor={p.beam} stopOpacity=".45" />
          <stop offset="1" stopColor={p.beam} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="437.807" y="333.684" width="167.593" height="130.722" fill={p.body} />
      <rect x="505.104" y="334.104" width="17" height="130" fill={p.rib2} />
      <rect x="522.104" y="334.104" width="16" height="130" fill={p.rib3} />
      <path d="M605.4 333.683H437.807L442.723 327.364L446.187 322.825L451.215 316.924H591.992L596.834 322.825L600.558 327.364L605.4 333.683Z" fill={p.mouth} />
      <rect x="451.215" y="316.924" width="140.778" height="16.7593" fill={p.inner} />
      <motion.rect x="451.215" y="316.924" width="140.778" height="16.7593" fill={`url(#${id}l)`}
                   initial={false} animate={{ opacity: lit ? 0.85 : 0 }} transition={{ duration: lit ? 0.35 : 0.25 }} />
      <path opacity="0.1" d="M606.238 371.04L437.807 336.684H606.238V371.04Z" fill="#313131" />
      {/* the underside, so the box sits on something */}
      <rect x="437.807" y="440" width="167.593" height="24.4" fill="#000" opacity=".12" />
    </svg>
  )
}
