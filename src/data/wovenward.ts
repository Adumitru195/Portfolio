import type { WovenwardPresentation } from '@/types/presentation'

const base = '/Portfolio/projects/wovenward'

// Set to false to show only the static desktop/mobile composition in the opening.
export const WOVENWARD_SHOWCASE_ENABLED = true

export const wovenward: WovenwardPresentation = {
  eyebrow: 'Personal concept · E-commerce UX/UI',
  subtitle: 'A considered clothing experience.',
  meta: [
    { label: 'Role', value: 'UX & UI Design' },
    { label: 'Year', value: '2026' },
    { label: 'Platform', value: 'Responsive web' },
    { label: 'Scope', value: 'Browse to bag' },
  ],
  showcase: {
    desktop: {
      src: `${base}/showcase-desktop.webp`,
      alt: 'Wovenward homepage on desktop: the serif headline "Clothes you’ll reach for first." beside a large photo of a blush wool coat and a smaller inset of an oat jumper',
      width: 2048,
      height: 1280,
    },
    mobile: {
      src: `${base}/showcase-mobile.webp`,
      alt: 'Wovenward homepage on a phone with the headline and Shop the collection button above the photographs',
      width: 780,
      height: 1688,
    },
    description:
      'The Wovenward homepage shown in a desktop browser window, with the mobile version in a phone frame in front of it on the right.',
    caption: 'The homepage at 1440 px and 390 px. Actual Wovenward interface.',
  },
  imageNote:
    'Products, prices, measurements and stock are sample data for this concept store. Photography is from Burst and StockSnap; sources are recorded in the project’s asset log.',
  overview: {
    title: 'Less uncertainty, from browse to bag.',
    challenge: {
      heading: 'Clothes are easy to see. Fit is harder to judge.',
      body: 'A product photo can’t answer every shopping question. Availability, measurements and the selected variant need to be clear before a shopper adds an item.',
    },
    goal: {
      heading: 'Make each decision legible.',
      body: 'Bring in-stock sizes into discovery, explain sizing on the product page, and carry the exact choice into a reviewable bag.',
    },
    contribution: {
      heading: 'UX & visual design',
      body: 'Experience structure, interface direction, interaction states and responsive refinement.',
    },
    scope: {
      heading: 'A concept store',
      body: 'Homepage, collection, product details, size guidance and bag, with twelve sample products. There is no payment, fulfillment or completed purchase flow.',
    },
  },
  journey: {
    title: 'One decision prepares the next.',
    body: 'The core journey connects discovery, fit and selection without hiding the details.',
    steps: [
      { title: 'Discover', body: 'Enter through featured pieces or a category.' },
      { title: 'Narrow', body: 'Filter by category, size in stock and maximum price.' },
      { title: 'Evaluate', body: 'Inspect the garment and compare measurements.' },
      { title: 'Review', body: 'Check the chosen variant and quantity in the bag.' },
    ],
    principles: [
      {
        title: 'Keep browsing context',
        body: 'Search, filters and sorting live in the URL, so reload, Back and returning to the collection keep the shopper’s choices.',
      },
      {
        title: 'Make correction straightforward',
        body: 'Filters can be removed one at a time, a missing size is flagged beside the size options, and bag quantities can change within stock limits.',
      },
    ],
  },
  wireframes: {
    title: 'Low-fidelity layout study',
    body: 'Retrospective wireframes that map the current experience across six views: homepage, collection, product details, size guide, bag and mobile. They were drawn after the build to show its structure, not as early-stage sketches.',
    corrected: {
      src: `${base}/wovenward-wireframes-corrected.svg`,
      alt: 'Grayscale wireframe board in six parts: homepage with the headline and featured pieces, collection with filters and product cards, product details with size options, size guide tables, bag with a checkout-unavailable notice, and two mobile layouts',
      width: 1536,
      height: 1024,
    },
    supplied: {
      src: `${base}/wireframe-board-supplied.webp`,
      small: `${base}/wireframe-board-supplied-800.webp`,
      alt: 'The originally supplied wireframe board, with generic navigation, pound prices and several color swatches',
      width: 1536,
      height: 1024,
    },
    suppliedNote:
      'The originally supplied board, kept unchanged for reference. It was generated for this study, and five details didn’t match the app.',
    corrections: [
      'Navigation now uses the app’s links (Shop all, Coats & jackets, Knitwear, Shirts, Dresses and Bag) instead of Women, Men, Accessories and Journal.',
      'Prices are shown in US dollars, the app’s currency, instead of pounds.',
      'Each product shows a single colorway, labeled “Available in Olive only.”, because every product currently has one color.',
      'The bag says “Checkout is unavailable” because this is a concept store, rather than “Please try again later”, which suggested a temporary fault.',
      'The homepage uses the real eyebrow, headline and actions: “Clothes you’ll reach for first.”, Shop the collection and Coats & jackets.',
    ],
    svgHref: `${base}/wovenward-wireframes-corrected.svg`,
  },
  identity: {
    title: 'Warm editorial design. Practical controls.',
    body: 'A restrained palette and a clear type hierarchy let the clothing lead the page.',
    swatches: [
      { name: 'Porcelain', hex: '#F5F2EC', usage: 'Page background' },
      { name: 'Deep ink', hex: '#252824', usage: 'Text and the footer' },
      { name: 'Muted indigo', hex: '#344A64', usage: 'Primary actions and focus' },
      { name: 'Clay', hex: '#B9785F', usage: 'Decorative accents only' },
      { name: 'Dark clay', hex: '#8C4E37', usage: 'Accent text, 5.8:1 on porcelain' },
    ],
    displayFont: {
      name: 'Newsreader',
      role: 'Display · page and section titles and the wordmark, mostly at light weights',
    },
    bodyFont: {
      name: 'Manrope',
      role: 'Interface · navigation, prices, available sizes and actions, with tabular figures for prices',
    },
    note: 'Selected and sold-out sizes also use words, checks and distinct borders, so color is never the only signal.',
  },
  collection: {
    title: 'Give the collection a clear entrance.',
    body: 'The homepage leads into featured clothing and categories; the collection is built to browse what’s actually available.',
    hero: {
      src: `${base}/home-hero.webp`,
      small: `${base}/home-hero-800.webp`,
      alt: 'Homepage hero: the eyebrow "The everyday collection", the headline with "reach for" in clay italic, a short paragraph, a Shop the collection button and a Coats & jackets link, beside the coat photo and an overlapping jumper inset',
      width: 1600,
      height: 1000,
    },
    heroNotes: [
      {
        title: 'An editorial opening',
        body: 'The offset image composition and serif headline set the tone, and “Shop the collection” is the single primary next step.',
      },
      {
        title: 'A quieter supporting image',
        body: 'The oat jumper replaced a stronger red inset, and the main caption sits clear of the overlap.',
      },
    ],
    sections: {
      src: `${base}/home-sections.webp`,
      small: `${base}/home-sections-800.webp`,
      alt: 'Featured pieces row of four product cards with names, prices, colors and available sizes, above a Shop by category row of five photo tiles',
      width: 1600,
      height: 1244,
    },
    sectionsCaption: 'Hero products don’t repeat in the featured row, and category tiles use photos not shown elsewhere on the page.',
    filtered: {
      src: `${base}/shop-filtered.webp`,
      small: `${base}/shop-filtered-800.webp`,
      alt: 'All clothing filtered to Knitwear and Shirts, size XS in stock and up to $150: a 3 pieces count, removable filter chips, Clear all, and three product cards',
      width: 1600,
      height: 1000,
    },
    filteredNotes: [
      {
        title: 'Narrow the range',
        body: 'Category, size in stock and maximum price work alongside title search and sorting. A count and removable chips keep active choices visible.',
      },
      {
        title: 'A size filter that means available',
        body: 'Filtering by a size only returns pieces with that size in stock, and cards list only in-stock sizes.',
      },
    ],
    empty: {
      src: `${base}/shop-empty.webp`,
      small: `${base}/shop-empty-800.webp`,
      alt: 'Search for "parka" with 0 pieces: "No pieces match parka." with advice to try a shorter word such as shirt, coat or dress, and Clear all filters and View all 12 pieces buttons',
      width: 1600,
      height: 614,
    },
    emptyCaption: 'Search and filter empty states each explain what to try next.',
  },
  product: {
    title: 'Put fit beside the decision.',
    body: 'Product details pair the garment’s photographs with size, quantity and supporting information.',
    layout: {
      src: `${base}/product-layout.webp`,
      small: `${base}/product-layout-800.webp`,
      alt: 'Funnel-Neck Utility Jacket product page: a vertical thumbnail rail labeled Full look and Detail, a large photo with a 1 / 2 counter, and a panel with price, the Olive color, size options with M selected, a fit note, quantity and Add to bag',
      width: 1600,
      height: 1087,
    },
    layoutCaption: 'The gallery is capped to the viewport height, so the title, options and Add to bag sit on screen together.',
    required: {
      src: `${base}/panel-size-required.webp`,
      alt: 'Size options outlined after Add to bag was pressed without a size, with the message "Choose a size to add this to your bag. Not sure? Open the size guide."',
      width: 962,
      height: 962,
    },
    selected: {
      src: `${base}/panel-size-selected.webp`,
      alt: 'Size M selected with a check, L shown as sold out with a dashed border and strike, a legend for Selected and Sold out, and the status "Size M selected · 6 in stock."',
      width: 962,
      height: 956,
    },
    stateNotes: [
      {
        title: 'Show every state',
        body: 'Available, selected and sold-out sizes look different and carry non-color cues: a check, a dashed strike and a small legend.',
      },
      {
        title: 'Guide, don’t block',
        body: 'Adding without a size outlines the options, explains what’s needed and moves focus to the first available size.',
      },
    ],
    guide: {
      src: `${base}/size-guide.webp`,
      small: `${base}/size-guide-800.webp`,
      alt: 'Size guide dialog with a Centimeters and Inches toggle, a garment measurements table for chest, body length and sleeve, and a body measurements table for chest, waist and hip',
      width: 1473,
      height: 1622,
    },
    guideNotes: [
      {
        title: 'Make comparisons possible',
        body: 'The guide separates garment and body measurements, says how each one is taken, and switches between centimeters and inches.',
      },
      {
        title: 'Honest about models',
        body: 'There are no “model wears size M” notes, because the people in the photographs are real and their sizes aren’t known.',
      },
    ],
  },
  bag: {
    title: 'A reviewable selection, without surprises.',
    body: 'Confirmation repeats the exact choice, and the bag keeps every detail together.',
    added: {
      src: `${base}/added-dialog.webp`,
      small: `${base}/added-dialog-800.webp`,
      alt: 'Added to your bag dialog showing the jacket thumbnail, color Olive, size M, quantity 2 and price $372, the bag count and subtotal, and View bag and Continue shopping buttons',
      width: 1080,
      height: 844,
    },
    addedNotes: [
      {
        title: 'Repeat the exact choice',
        body: 'The confirmation names the item, color, size, quantity and price, then offers View bag or Continue shopping.',
      },
      {
        title: 'Focus that follows',
        body: 'Closing returns focus to Add to bag, or to the selected size when the last one in stock has just been added.',
      },
    ],
    bag: {
      src: `${base}/bag.webp`,
      small: `${base}/bag-800.webp`,
      alt: 'Your bag with two items, each showing color, size, unit price, a quantity stepper, Remove and stock left, beside a summary with the subtotal, a note that it excludes shipping and taxes, and a Checkout is unavailable notice',
      width: 1600,
      height: 833,
    },
    bagNotes: [
      {
        title: 'Keep the detail',
        body: 'Item, color, size, unit price and quantity stay together, and quantities respect stock limits.',
      },
      {
        title: 'Be clear about scope',
        body: 'The subtotal excludes shipping and taxes, and checkout is unavailable in this concept, so no checkout button is offered.',
      },
    ],
  },
  responsive: {
    title: 'Clear decisions on smaller screens.',
    body: 'The collection stays scannable, while product actions remain close to the selection.',
    screens: [
      {
        image: {
          src: `${base}/m-home.webp`,
          alt: 'Mobile homepage with a compact header, the headline and Shop the collection button',
          width: 780,
          height: 1688,
        },
        caption: 'A compact header and the same clear first step.',
      },
      {
        image: {
          src: `${base}/m-shop-filtered.webp`,
          alt: 'Mobile collection with a Filters button showing 4 active filters, opened to the category and size-in-stock options',
          width: 780,
          height: 1688,
        },
        caption: 'Filters collapse behind one button with an active count.',
      },
      {
        image: {
          src: `${base}/m-product.webp`,
          alt: 'Mobile product page with the photo gallery and a fixed bottom bar showing the price, "Choose a size" and Add to bag',
          width: 780,
          height: 1688,
        },
        caption: 'Add to bag stays fixed at the bottom of the screen.',
      },
      {
        image: {
          src: `${base}/m-added.webp`,
          alt: 'Mobile Added to your bag dialog with the item details and View bag button',
          width: 780,
          height: 1688,
        },
        caption: 'Dialogs keep a clear path back to the page.',
      },
      {
        image: {
          src: `${base}/m-bag.webp`,
          alt: 'Mobile bag with item details and quantity steppers',
          width: 780,
          height: 1688,
        },
        caption: 'Bag lines stack without losing variant detail.',
      },
    ],
    notes: [
      {
        title: 'Size guide that fits',
        body: 'Measurement tables show all five sizes on a phone instead of scrolling sideways.',
      },
      {
        title: 'Motion that supports hierarchy',
        body: 'The hero rises in once, cards zoom slightly and crossfade on hover-capable devices, and sections fade up as they arrive.',
      },
      {
        title: 'Visible by default',
        body: 'Content is visible before scripts run; reveals only hide content after the page opts in, and a fallback shows anything left hidden.',
      },
    ],
    reducedMotion:
      'With reduced motion, the hero entrance, card effects, reveals and dialog easing are all turned off.',
  },
  refinements: {
    title: 'Refine the evidence on the page.',
    body: 'A refinement pass focused on garment visibility, hierarchy and more useful card details, followed by fixes found in screenshot review and scripted checks.',
    before: {
      src: `${base}/refine-before.webp`,
      small: `${base}/refine-before-800.webp`,
      alt: 'Earlier collection page with face-led crops, a red crewneck and a yellow-shutter backdrop, and small card text',
      width: 1440,
      height: 1180,
    },
    after: {
      src: `${base}/refine-after.webp`,
      small: `${base}/refine-after-800.webp`,
      alt: 'Refined collection page with garment-led photography and larger card names, prices and available sizes',
      width: 1440,
      height: 1180,
    },
    beforeCaption: 'Earlier iteration: face-led crops and 12 px card details.',
    afterCaption: 'Refined: more of each garment, 16 px names and prices, darker 14 px details.',
    items: [
      {
        title: 'Show more of the garment',
        body: 'Six products moved to sharper photography, and their names, colors and descriptions were rewritten to match what the new images show.',
      },
      {
        title: 'Make card details easier to scan',
        body: 'Names and prices use 16 px type; color and available sizes use darker 14 px text. Long names wrap clear of the price.',
      },
      {
        title: 'One current link at a time',
        body: 'Every category link looked active on the collection page; current state now compares the path and query.',
      },
      {
        title: 'Keep the caption clear',
        body: 'The overlapping hero inset covered the main image’s caption, so the caption moved clear of it.',
      },
      {
        title: 'Fix focus and scroll edge cases',
        body: 'Focus no longer lands on a disabled button after the last item in stock is added, and View bag no longer leaves the page scroll-locked.',
      },
      {
        title: 'Resolve accessibility findings',
        body: 'Struck-through sold-out sizes on cards failed contrast at 55% opacity and now use a muted color plus the strike.',
      },
    ],
  },
  outcome: {
    title: 'A coherent browse-to-bag experience.',
    delivered: {
      title: 'Discovery, fit and review',
      body: 'The homepage, collection, product guidance and bag form one connected journey. The strongest improvements are the visible stock information and precise variant feedback.',
    },
    lesson: {
      title: 'Consistency is product information',
      body: 'A photograph, name, color and size need to agree across the card, product page and bag. A more polished image only helps when those details stay accurate.',
    },
    checks: {
      title: 'Recorded checks',
      body: 'The development record reports 76 scripted checks passing on two consecutive runs, a clean type check and production build, and no axe violations across 24 scanned states.',
    },
    next: {
      title: 'Test confidence, not just completion',
      body: 'Observe shoppers finding an in-stock size, interpreting the size guide and checking a bag, to learn whether the information supports confident choices.',
    },
    limits:
      'No usability study has been conducted. Automated checks don’t establish ease of use or accessibility for everyone; screen readers, other browsers and real devices remain to be tested.',
    pdf: {
      href: `${base}/wovenward-ux-case-study.pdf`,
      label: 'Download the case study PDF',
      detail: '12 pages · 7.3 MB',
    },
  },
}
