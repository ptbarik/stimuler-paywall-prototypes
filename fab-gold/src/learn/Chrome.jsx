import {
  StatusIcons, Flame,
  NavLearn, NavPractice, NavCall, NavProfile,
} from './Icons.jsx'

/** 412 × 62, 21 above and 19 below, 24 in from each edge. */
export function StatusBar() {
  return (
    <div className="absolute left-0 top-0 z-40 flex items-center pointer-events-none"
         style={{ width: 412, paddingTop: 21, paddingBottom: 19, paddingInline: 24, gap: 154 }}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <span className="text-white" style={{ fontFamily: 'system-ui, sans-serif', fontSize: 17, fontWeight: 600, lineHeight: '22px' }}>9:41</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center"><StatusIcons /></div>
    </div>
  )
}

/** `Hey Sriram!` and the streak, at the export's left 20 / top 50.9 / width 372. */
export function Header() {
  return (
    <div className="absolute z-30 flex items-center justify-between"
         style={{ left: 20, top: 50.906, width: 372, height: 76 }}>
      <span className="font-ub text-white" style={{ fontSize: 28, fontWeight: 500, lineHeight: '34px' }}>
        Hey Sriram!
      </span>
      <span className="flex items-center" style={{ gap: 4, borderRadius: 8, padding: '4px 8px', outline: '1px solid #744732', outlineOffset: -1 }}>
        <Flame />
        <span className="font-qs" style={{ color: '#D97941', fontSize: 24, fontWeight: 700, lineHeight: '30px' }}>2</span>
      </span>
    </div>
  )
}

/**
 * The nav, pinned.
 *
 * In the export it is drawn as the last child of Unit 1's group, which puts it
 * at the bottom of the frame only because Unit 1 happens to be 712 tall. It is
 * a nav bar; it is lifted out of the scroller here so that it stays where a
 * nav bar stays.
 */
const NAV = [
  { label: 'Learn', icon: <NavLearn />, on: true },
  { label: 'Practice', icon: <NavPractice /> },
  { label: 'Call', icon: <NavCall /> },
  { label: 'Profile', icon: <NavProfile /> },
]

export const NAV_H = 94

export function NavBar() {
  return (
    <div className="absolute left-0 bottom-0 z-40" style={{ width: 412, height: NAV_H, background: '#050505' }}>
      <div className="absolute flex items-center"
           style={{ left: 'calc(50% - 0.27px)', top: 'calc(50% - 0.35px)', translate: '-50% -50%', gap: 61 }}>
        {NAV.map((n) => (
          <div key={n.label} className="flex flex-col items-center" style={{ width: n.on ? 36 : undefined, gap: n.label === 'Learn' || n.label === 'Call' ? 0 : 1 }}>
            {n.icon}
            <span className="font-ub capitalize"
                  style={{ color: '#868686', fontSize: 14, fontWeight: n.on ? 600 : 400, letterSpacing: '.01em', lineHeight: '24px' }}>
              {n.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
