import type { WoveFigure, WovenwardCaseStudy } from '@/types/wovenward'

const base = '/Portfolio/projects/wovenward'
const shots = `${base}/case-study`

// Evidence behind this page (checked November 23, 2026):
//  - Screens in case-study/ are captures of the working storefront
//    (UX Projects/Wovenward) made by scripts/wovenward-captures.mjs at 2x on
//    November 23, 2026. Products, prices, measurements and stock are the
//    storefront's sample data.
//  - Measured or verified in the running storefront (Microsoft Edge, 390 x 844
//    and 1440 x 900): size L narrows 12 pieces to 10; the size guide's cm and
//    inch tables (104 cm chest = 41.0 in, rounded to the nearest half inch);
//    the stock cap ("That's all 2 in stock in size XS"); on a phone, Add to bag
//    with no size scrolls the size options (419-600 px) into view above the
//    fixed bar (from 771 px) and focuses the first available size.
//  - Re-run on November 23, 2026 with the storefront's own suites:
//    docs/verification/flow-check.cjs 76/76, axe-audit.cjs 0 violations in 24
//    states, type check passes. The October 4, 2026 results are in its
//    DESIGN-LOG.md section 9.
//  - Card detail type (12 px at 6.00:1 before, 14 px at 8.06:1 now) and the
//    photography change (960 px to 3,000 px sources) are recorded in that log;
//    the current values were measured.
//  - walkthrough.mp4 is the original recording with one edit: original frames
//    148-191 (4.93-6.37 s, the grid scrolling past a product photo whose
//    licence couldn't be confirmed at source) were cut on November 24, 2026.
//    It is now 25.8 s; the original is archived in Wovenward/docs/
//    portfolio-archive-2026-11-23/walkthrough-original.mp4. It is not one
//    continuous take; don't describe it as one.
//  - Photography: licensed stock images (Burst and StockSnap). See the
//    storefront's docs/ASSET-SOURCES.md and docs/PHOTO-RIGHTS-REVIEW.md. The
//    people shown aren't connected with Wovenward; never imply they endorse it
//    or describe them (no model sizes).
//  - Provenance: the storefront's design log records the owner's brief
//    (palette, scope, constraints) and refinement requests; the build itself is
//    recorded by its implementer and the log doesn't name the tool. The role
//    line below is the owner's own wording; never claim the owner wrote the code.

const desktop = (file: string, alt: string, label: string, height = 1500, width = 2400): WoveFigure => ({
  image: { src: `${shots}/${file}`, alt, width, height },
  label,
  chrome: true,
})
const phone = (file: string, alt: string, label: string): WoveFigure => ({
  image: { src: `${shots}/${file}`, alt, width: 780, height: 1688 },
  label,
  portrait: true,
})

export const wovenward: WovenwardCaseStudy = {
  opening: {
    eyebrow: 'Personal concept · Responsive e-commerce',
    title: 'Wovenward',
    subtitle: 'Clothing chosen with the facts in view.',
    lede: 'A responsive clothing store designed around three questions every shopper asks: is it available in my size, how will it fit, and what exactly am I buying? The scope runs from browsing to the bag.',
    meta: [
      { label: 'My role', value: 'Product direction, UX/UI design direction, prototype review and iteration' },
      { label: 'Deliverable', value: 'Working responsive storefront' },
      { label: 'Scope', value: 'Browse to bag; no checkout' },
      { label: 'Status', value: 'Concept, not yet tested with shoppers' },
    ],
    hero: {
      image: {
        src: `${shots}/d-home.webp`,
        alt: 'Wovenward homepage on desktop: the serif headline “Clothes you’ll reach for first.” with “reach for” in italic clay, a short introduction and a Shop the collection button, beside a large photo of a blush wool-blend coat and a smaller inset of an oat mock-neck jumper.',
        width: 2400,
        height: 1500,
      },
      label: 'Homepage, 1440 px',
      chrome: true,
    },
    contentsLabel: 'In this case study',
    note: 'Products, prices, measurements and stock are sample data, and nothing can be bought. Stock photography is used for illustration. No affiliation with or endorsement by the people depicted is claimed.',
  },

  experience: {
    title: 'A product photo can’t answer every question.',
    challenge: 'Shoppers need to know what’s available in their size, how a piece will fit, and exactly what they’ve chosen before it reaches the bag. Wovenward puts those answers where each decision is made.',
    video: {
      mp4: `${base}/walkthrough.mp4`,
      poster: {
        src: `${base}/walkthrough-poster.webp`,
        alt: 'Wovenward All clothing page with category and size filters, the first frame of the walkthrough',
        width: 1600,
        height: 1000,
      },
      label: 'shopping walkthrough',
      duration: 26,
      caption: 'Recorded from the working storefront · 26 seconds · No audio',
      description:
        'The recording starts on All clothing and checks size L under Size in stock, which narrows 12 pieces to 10 by leaving out pieces where L is sold out. It opens the Mock-Neck Jumper, then the size guide, scrolling through the garment and body measurements in centimeters before closing it. It selects size L and adds the jumper to the bag, and the Added to your bag dialog confirms color, size, quantity and price. View bag ends on the bag page: one Mock-Neck Jumper in Oat, size L, at $128, with the note that checkout is unavailable in this concept store.',
    },
    descriptionSummary: 'What the walkthrough shows',
  },

  discover: {
    id: 'discover',
    index: '02',
    label: 'Discover',
    title: 'Discover what is actually available.',
    standfirst: 'A size filter should describe stock, not the sizes a garment was once made in.',
    lead: desktop(
      'd-shop-size.webp',
      'All clothing on desktop filtered by size L: the Size in stock control with L selected, a count of 10 pieces, a removable “Size L” chip and Clear all, and product cards that list only their in-stock sizes.',
      'Size in stock: L, 1440 px',
    ),
    notes: [
      { title: 'Filters describe stock', figure: '12 → 10', body: 'Choosing L under “Size in stock” leaves out every piece whose L is sold out.', source: 'verified' },
      { title: 'Cards agree with the filter', body: 'Cards list only available sizes. For each size, XS to XL, the filter returns exactly the cards that list it.', source: 'verified' },
      { title: 'Choices are kept', body: 'Search, filters and sort live in the address, so reload and Back restore them.', source: 'verified' },
      { title: 'Easy to undo', figure: '2 ways out', body: 'Each filter is a removable chip. An empty result offers Clear all filters or View all 12 pieces.', source: 'verified' },
    ],
    supporting: [
      desktop(
        'd-shop-empty.webp',
        'No pieces match “zzz” with these filters: the empty state explains that search looks at product names, with Clear all filters and View all 12 pieces buttons, and the active chips “zzz” and “Size XS”.',
        'Empty result',
      ),
    ],
    phones: [
      phone('m-shop-size.webp', 'All clothing on a phone: filters collapsed behind a Filters button showing 1 active, 10 pieces, a removable Size L chip, and two product cards listing available sizes.', 'Phone, filtered'),
    ],
  },

  fit: {
    id: 'fit',
    index: '03',
    label: 'Fit',
    title: 'Understand how it fits.',
    standfirst: 'Fit information sits beside the size choice, and the store won’t let a missing size pass silently.',
    lead: desktop(
      'd-product.webp',
      'Mock-Neck Jumper product page on desktop: a gallery with Front, Seated and Detail thumbnails, the price, colour Oat, size options XS to XL with M sold out, a Size guide link, a fit note and quantity.',
      'Product page, 1440 px',
    ),
    notes: [
      { title: 'Two kinds of measurement', body: 'The size guide shows the garment laid flat and the body each size is designed for, for all five sizes, with how each is measured.', source: 'verified' },
      { title: 'Centimetres or inches', figure: '104 cm = 41.0 in', body: 'One switch converts every table, rounded to the nearest half inch.', source: 'measured' },
      { title: 'Sold out, never by colour alone', body: 'A sold-out size has a dashed border, a diagonal strike and “sold out” in its name, with a key beside the options.', source: 'verified' },
      { title: 'A missing size is caught', body: 'Add to bag without a size shows an inline message, outlines the options and moves focus to the first available size.', source: 'verified' },
    ],
    supporting: [
      desktop(
        'd-size-guide-cm.webp',
        'Size guide for the Mock-Neck Jumper in centimetres: garment chest, body length and sleeve for XS to XL, then body chest, waist and hip, with how to measure each.',
        'Size guide, centimetres',
        1620,
        1472,
      ),
      desktop(
        'd-size-guide-in.webp',
        'The same size guide switched to inches: chest 41.0, 43.5, 45.5, 48.0 and 50.5 inches from XS to XL.',
        'Size guide, inches',
        1620,
        1472,
      ),
    ],
    phones: [],
    sequence: {
      label: 'On a phone',
      before: phone('m-product.webp', 'Mock-Neck Jumper on a phone, scrolled to the top, with a fixed bar at the bottom showing $128, Choose a size, and Add to bag.', 'Tap Add to bag, no size chosen'),
      after: phone('m-size-required.webp', 'After tapping Add to bag: the page has scrolled to the size options above the fixed bar, M is shown sold out, and a red message reads “Choose a size to add this to your bag. Not sure? Open the size guide.”', 'The sizes, in view'),
      caption: 'The fixed Add to bag bar scrolls the size options into view above itself and focuses the first available size (measured at 390 × 844).',
    },
  },

  review: {
    id: 'review',
    index: '04',
    label: 'Review',
    title: 'Review exactly what you chose.',
    standfirst: 'Every confirmation repeats the variant, and the bag stays honest about stock and price.',
    lead: desktop(
      'd-bag.webp',
      'Your bag on desktop with 3 items: a Mock-Neck Jumper in Oat, size L, quantity 1 with “3 in stock in size L”; a Funnel-Neck Utility Jacket in Olive, size XS, quantity 2 with the increase button disabled and “That’s all 2 in stock in size XS”; a $500 subtotal that excludes shipping and taxes, and a note that checkout is unavailable.',
      'Bag, 1440 px',
    ),
    notes: [
      { title: 'The exact variant, confirmed', body: 'Adding opens a confirmation with colour, size, quantity and price, plus the bag count and subtotal.', source: 'verified' },
      { title: 'Quantities respect stock', figure: '“That’s all 2 in stock”', body: 'Steppers stop at the stock left, counting what’s already in the bag; typed values are clamped.', source: 'verified' },
      { title: 'A transparent subtotal', body: 'The subtotal excludes shipping and taxes, and says so. Checkout is outside this concept’s scope, and the bag states it plainly.', source: 'verified' },
      { title: 'A bag that checks availability', body: 'Only product, colour, size and quantity are saved in the browser, and they’re checked against stock on every visit.', source: 'recorded' },
    ],
    supporting: [
      desktop(
        'd-added.webp',
        'Added to your bag dialog over the product page: Mock-Neck Jumper, colour Oat, size L, quantity 1, price $128, bag 1 item, subtotal $128, with View bag and Continue shopping buttons.',
        'Confirmation, 1440 px',
      ),
    ],
    phones: [
      phone('m-added.webp', 'The Added to your bag confirmation on a phone, listing colour, size, quantity and price, with View bag and Continue shopping.', 'Phone confirmation'),
      phone('m-bag.webp', 'Your bag on a phone with both lines, quantity steppers, the stock notes and line totals.', 'Phone bag'),
    ],
  },

  identity: {
    title: 'Editorial identity, functional design.',
    standfirst: 'Newsreader gives the store its editorial voice; Manrope, indigo actions and visible borders keep every control plain to use.',
    palette: [
      { name: 'Porcelain', hex: '#F5F2EC', role: 'Page', contrast: 'Ink 13.35:1' },
      { name: 'Deep ink', hex: '#252824', role: 'Text and footer', contrast: '13.35:1' },
      { name: 'Muted indigo', hex: '#344A64', role: 'Primary actions', contrast: '8.14:1; white on it 9.09:1' },
      { name: 'Dark clay', hex: '#8C4E37', role: 'Accent text', contrast: '5.77:1' },
      { name: 'Clay', hex: '#B9785F', role: 'Rules and markers only', contrast: '3.18:1, never text' },
    ],
    type: [
      { name: 'Newsreader', role: 'Titles and the wordmark, mostly light weights', sample: 'Clothes you’ll reach for first.' },
      { name: 'Manrope', role: 'Prices, controls and product facts', sample: 'Available sizes: XS, S, M, L · $128' },
    ],
    refinements: [
      { title: 'Card details easier to read', figure: '12 px → 14 px', body: 'Colour and available sizes moved to 14 px in a darker grey: 6.00:1 → 8.06:1 contrast.', source: 'recorded' },
      { title: 'Sharper, garment-led photography', figure: '960 → 3,000 px', body: 'Six products received higher-resolution photography, cropped to show more garment and less face.', source: 'recorded' },
      { title: 'Title and options on one screen', body: 'The desktop gallery is capped to the viewport height, so the name, price and sizes appear with the photo.', source: 'recorded' },
      { title: 'Tables that fit a phone', body: 'The size guide shows all five sizes at 390 px without sideways scrolling.', source: 'verified' },
    ],
  },

  evidence: {
    title: 'Checked in code. Not yet tested with shoppers.',
    standfirst: 'The storefront’s own automated checks, first recorded on October 4, 2026 and re-run for this page on November 23, 2026. They aren’t user research.',
    checks: [
      { label: 'Scripted shopping checks', recorded: '76 / 76', rerun: '76 / 76' },
      { label: 'Accessibility (axe), 24 states', recorded: '0 violations', rerun: '0 violations' },
      { label: 'Type check and production build', recorded: 'Pass', rerun: 'Pass' },
      { label: 'Phone: Add to bag with no size', recorded: '—', rerun: 'Sizes in view, first size focused' },
    ],
    notDone: ['Testing with shoppers', 'Screen readers', 'Safari, Firefox and real phones', 'Windows High Contrast'],
    learned: 'Trust in a clothing store is built from small, consistent facts: the same size list on the card and the filter, the same variant in the confirmation and the bag.',
    next: [
      'Do shoppers set a size before browsing, and trust the result?',
      'Can they choose a size from the guide alone?',
      'After adding, can they say exactly what is in their bag?',
    ],
    contactLabel: 'Start a project',
  },
}
