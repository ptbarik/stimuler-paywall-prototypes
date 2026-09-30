/**
 * Every number on this page, read off the Figma export of `PRO` (node
 * 12176-6027), not estimated from the render.
 *
 * The export is one 412×2598 frame with each block absolutely positioned, so
 * the page is built the same way: one tall absolutely-positioned surface
 * inside a scroller, with the status bar and the price sheet pinned over it.
 * Reflowing it into a flow layout would mean re-deciding every gap, and the
 * gaps are the design.
 */

/** The phone. 412 is the export's own width; 915 is the Pixel-class viewport
 * that goes with a 412 logical width. */
export const FRAME = { w: 412, h: 915 }

/**
 * The page's height with every FAQ row shut — the export's 2598 exactly.
 *
 * The bottom 358 of it is the space the pinned price sheet covers, which is
 * why the last FAQ row can scroll clear of the sheet rather than ending
 * underneath it.
 */
export const PAGE_H = 2598

/** Black, opaque, and the page scrolls under it. */
export const STATUS_H = 45

/** `Title` — the close button's row. */
export const TITLE = { top: 59, w: 370, h: 40 }

/**
 * `Frame 2087327122` — brand, headline, hero, pagination. A 370-wide column at
 * (21, 91) with a 29px gap, which is what puts the hero's top edge at 235:
 * 91 + 32 (brand) + 29 + 54 (headline) + 29.
 */
export const HEAD = { left: 21, top: 91, w: 370, gap: 29 }

/**
 * The hero slot.
 *
 * The export leaves `Calls with sarah feature` as a bare **370×330** rect —
 * the exact frame the four finished scenes were built to, months apart, in
 * four separate projects. They drop in at native size, which is the whole
 * reason the animation is free here.
 */
export const HERO = { left: 21, top: 235, w: 370, h: 330, r: 16 }

/** The pagination dashes, at the column's bottom edge. */
export const DOTS = { top: 585, on: 23.08, off: 8.68, gap: 5, w: 3 }

/** `Dynamic carousel` — 569 wide inside a 412 page, so it is clipped by design. */
export const PROOF = { top: 597, w: 569, h: 145 }

/**
 * Premium Benefits.
 *
 * Not the Figma node's block — that one is five identical placeholder rows,
 * and the Paper frame has since replaced it with the swipeable card row. The
 * section is 412 wide (full bleed, 20px inner padding) at top 817, 413 tall:
 * 34 padding, 345 of content, 34 padding.
 */
export const BENEFITS = { top: 817, w: 412, h: 413 }

/** `Frame 2085663121` — the learners block: chip, 92% claim, testimonial row. */
export const LEARNERS = { left: 26, top: 1266, w: 360.02, gap: 21 }

/** `Frame 2087327116` — the FAQ, and the last thing on the page. */
export const FAQ_TOP = 1922

/** `Sticky` — pinned to the viewport, not the page. */
export const STICKY = { h: 358, pad: 25.05 }

/** The page ground: the export's own three-stop gradient. */
export const PAGE_BG = 'linear-gradient(180deg, #16122A 0%, #120F22 60.1%, #0D0B16 100%)'
