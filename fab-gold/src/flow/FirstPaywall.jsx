import { useEffect, useRef } from 'react'

/**
 * The first paywall — https://stimuler-pro-paywall-v2.vercel.app, as built.
 *
 * Its build — from `pro-v2/` in this repo — is copied whole under
 * `public/p1v2/` (asset and font paths rewritten to that prefix) and run
 * here in an iframe. To refresh it after changing `pro-v2`: build there, copy
 * `dist/` here, and rewrite `/assets/` and `/fonts/` to `/p1v2/assets/` and
 * `/p1v2/fonts/` in `index.html` and the built js and css. Served from this
 * site, the frame is same-origin, which is the point: the flow can listen
 * inside it for a tap on the page's own × and hand over to the gift — no
 * copy of the page, and nothing about it changed.
 *
 * That page draws its own 412 × 915 phone on its own stand, so the iframe is
 * given a desktop-sized viewport (where the phone sits at scale 1) and is
 * shifted so the phone lands exactly on this frame, the stand's controls
 * falling outside it. The offset is read off the page's `.frame` element
 * once it has laid out, not assumed.
 */
const VIEW = { w: 1280, h: 1000 }

export default function FirstPaywall({ onClose }) {
  const ref = useRef(null)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    let timer
    const hook = () => {
      const doc = el?.contentDocument
      if (!doc) return
      /* line the phone up with this frame */
      const place = () => {
        const f = doc.querySelector('.frame')
        if (!f) return false
        const r = f.getBoundingClientRect()
        el.style.left = `${-r.left}px`
        el.style.top = `${-r.top}px`
        el.style.opacity = 1
        return true
      }
      let tries = 0
      const poll = () => { if (!place() && tries++ < 60) timer = setTimeout(poll, 50) }
      poll()
      /* the page's own × — delegated, so a re-render inside cannot drop it */
      doc.addEventListener('click', (e) => {
        if (!done.current && e.target.closest?.('button.close')) {
          done.current = true
          e.preventDefault()
          onClose()
        }
      }, true)
    }
    el.addEventListener('load', hook)
    return () => { el.removeEventListener('load', hook); clearTimeout(timer) }
  }, [onClose])

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#0D0B16' }}>
      <iframe ref={ref} src="/p1v2/index.html" title="Stimuler PRO — first paywall"
              className="absolute border-0" style={{ width: VIEW.w, height: VIEW.h, left: -434, top: -19.5, opacity: 0, transition: 'opacity .2s' }} />
    </div>
  )
}
