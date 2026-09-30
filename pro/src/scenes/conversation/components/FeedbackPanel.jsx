import { C, PANEL, clamp01, lerp } from '../timeline'
import Icon, { ExportGlyph } from './Icons'
import { GLYPH } from '../glyphs'

/**
 * The feedback panel.
 *
 * Opens **from the icon** — `transformOrigin` is the retry button's own centre
 * expressed as a percentage of the panel box, so the card grows out of the
 * thing that was glowing rather than out of its own middle or an edge.
 *
 * Row 3 of the brief: the marked run is the same content in both places.
 * `want eat` is `markText` cream and underlined inside the bubble, and the
 * same characters in `redText` inside the panel — the panel row reuses the
 * bubble's own words rather than restating them.
 */
export default function FeedbackPanel({ open, origin, tabs, red, connector, green }) {
  const b = PANEL.box
  const ox = ((origin.x - b.x) / b.w) * 100
  const oy = ((origin.y - b.y) / b.h) * 100

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: b.x,
        top: b.y,
        width: b.w,
        height: b.h,
        borderRadius: b.r,
        background: `linear-gradient(180deg, ${C.panelFrom}, ${C.panelTo})`,
        boxShadow: 'inset 0 0 0 0.8px rgba(255,255,255,0.10)',
        transformOrigin: `${ox}% ${oy}%`,
        transform: `scale(${lerp(0.85, 1, open)})`,
        opacity: clamp01(open * 1.4),
      }}
    >
      {/* ── tabs ─────────────────────────────────────────────── */}
      <div style={{ opacity: tabs }}>
        <div
          className="absolute"
          style={{
            left: PANEL.tabTrack.x - b.x,
            top: PANEL.tabTrack.y - b.y,
            width: PANEL.tabTrack.w,
            height: PANEL.tabTrack.h,
            borderRadius: PANEL.tabTrack.r,
            background: C.tabTrack,
          }}
        />
        <div
          className="absolute"
          style={{
            left: PANEL.tabPill.x - b.x,
            top: PANEL.tabPill.y - b.y,
            width: PANEL.tabPill.w,
            height: PANEL.tabPill.h,
            borderRadius: PANEL.tabPill.r,
            background: `linear-gradient(135deg, ${C.tabFrom}, ${C.tabTo})`,
          }}
        />
        {PANEL.tabs.map((tab) => (
          <span
            key={tab.label}
            className="absolute whitespace-nowrap"
            style={{
              left: tab.x - b.x,
              top: PANEL.tabText.y - b.y + PANEL.tabText.h / 2,
              transform: 'translateY(-50%)',
              fontSize: PANEL.tabText.fs,
              color: C.text,
              opacity: tab.active ? 1 : 0.86,
            }}
          >
            {tab.label}
          </span>
        ))}
      </div>

      {/* ── the connector, drawn rather than faded ────────────── */}
      <svg
        className="absolute top-0 left-0"
        width={b.w}
        height={b.h}
        viewBox={`${b.x} ${b.y} ${b.w} ${b.h}`}
        fill="none"
      >
        <defs>
          <linearGradient id="connector" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.connectorFrom} />
            <stop offset="1" stopColor={C.connectorTo} />
          </linearGradient>
        </defs>
        <line
          x1={PANEL.connector.x}
          y1={PANEL.connector.y1}
          x2={PANEL.connector.x}
          y2={PANEL.connector.y2}
          stroke="url(#connector)"
          strokeWidth={PANEL.connector.sw}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - connector}
        />
      </svg>

      {/* ── the error row ────────────────────────────────────── */}
      <Row
        show={red}
        circle={{ ...PANEL.redCircle, fill: C.redCircle, glyph: 'cross', gsize: 8.1 }}
        card={{ ...PANEL.redBox, fill: C.redRow }}
        text={PANEL.redText}
        runs={PANEL.redRuns}
        markColor={C.redText}
        b={b}
      />

      {/* ── the correction ───────────────────────────────────── */}
      <Row
        show={green}
        circle={{ ...PANEL.greenCircle, fill: C.greenCircle, glyph: 'tick', gsize: 7.3 }}
        card={{ ...PANEL.greenBox, fill: C.greenRow }}
        text={PANEL.greenText}
        runs={PANEL.greenRuns}
        markColor={C.greenText}
        b={b}
      >
        {PANEL.greenIcons.map((ic) => (
          <div key={ic.glyph}>
            <div
              className="absolute"
              style={{
                left: ic.x - b.x,
                top: ic.y - b.y,
                width: ic.d,
                height: ic.d,
                borderRadius: '50%',
                background: C.greenBtn,
                border: `0.809875px solid ${C.greenBtnStroke}`,
              }}
            />
            {ic.glyph === 'translate' ? (
              <ExportGlyph
                name="translatePanel"
                x={GLYPH.translatePanel.box[0] - b.x}
                y={GLYPH.translatePanel.box[1] - b.y}
              />
            ) : (
              <Icon name="speaker" x={ic.x - b.x + 4.4} y={ic.y - b.y + 6.3} size={11} color={C.iconGlyph} />
            )}
          </div>
        ))}
      </Row>

      <div
        className="absolute"
        style={{
          left: PANEL.divider.x1 - b.x,
          top: PANEL.divider.y - b.y,
          width: PANEL.divider.x2 - PANEL.divider.x1,
          height: 0.5,
          background: 'rgba(255,255,255,0.2)',
          opacity: green,
        }}
      />
    </div>
  )
}

function Row({ show, circle, card, text, runs, markColor, b, children }) {
  return (
    <div style={{ opacity: show, transform: `translateY(${lerp(8, 0, show)}px)` }}>
      <div
        className="absolute"
        style={{
          left: circle.x - b.x,
          top: circle.y - b.y,
          width: circle.d,
          height: circle.d,
          borderRadius: '50%',
          background: circle.fill,
        }}
      />
      <Icon
        name={circle.glyph}
        x={circle.x - b.x + (circle.d - circle.gsize) / 2}
        y={circle.y - b.y + (circle.d - circle.gsize) / 2 + (circle.glyph === 'tick' ? 1.5 : 0)}
        size={circle.gsize}
        color="#fff"
      />
      <div
        className="absolute"
        style={{
          left: card.x - b.x,
          top: card.y - b.y,
          width: card.w,
          height: card.h,
          borderRadius: card.r,
          background: card.fill,
        }}
      />
      <span
        className="absolute whitespace-pre"
        style={{
          left: text.x - b.x,
          top: text.y - b.y + text.h / 2,
          transform: 'translateY(-50%)',
          fontSize: text.fs,
          color: C.text,
        }}
      >
        {runs.map((r, i) => (
          <span key={i} style={r.mark ? { color: markColor } : undefined}>
            {r.t}
          </span>
        ))}
      </span>
      {children}
    </div>
  )
}
