import type { PorchlightPresentation } from '@/types/presentation'

const base = '/Portfolio/projects/porchlight'

export const porchlight: PorchlightPresentation = {
  eyebrow: 'Personal concept · Rental discovery',
  meta: [
    { label: 'Role', value: 'UX & UI Design' },
    { label: 'Year', value: '2026' },
    { label: 'Platform', value: 'Responsive web' },
    { label: 'Scope', value: 'Search to tour request' },
  ],
  showcase: {
    desktop: {
      src: `${base}/showcase-desktop.webp`,
      alt: 'Porchlight homepage on desktop: the headline "Find your next home." beside an arched photo of a white front porch, with a raised search panel asking "Where would you like to live?"',
      width: 2048,
      height: 1280,
    },
    mobile: {
      src: `${base}/showcase-mobile.webp`,
      alt: 'Porchlight homepage on a phone: the same headline and search panel stacked above the porch photo',
      width: 780,
      height: 1688,
    },
    description:
      'The refined Porchlight homepage shown in a desktop browser window, with the mobile version in a phone frame overlapping it on the right.',
    caption: 'The refined homepage at 1440 px and 390 px. Actual Porchlight interface.',
  },
  challenge: {
    title: 'Renting asks for more than a good photo.',
    body: [
      'A visitor needs to understand the rent, check whether a home fits, and know what happens after asking to see it. Porchlight brings browsing, property information and tour requests into one focused, rentals-only experience for Charlotte, NC.',
      'It reworks Arcadian Homes, an earlier concept of mine. That design showed two different monthly figures on one rental listing, and its confirmation said a tour was scheduled while also saying an agent would confirm it.',
    ],
    priorities: [
      {
        title: 'Understand the cost',
        body: 'Base rent is the only monthly number. One-time fees, refundable deposits and optional charges are listed separately.',
      },
      {
        title: 'Compare homes',
        body: 'Rent, location, bedrooms, availability and pet policy sit in the same place on every listing card.',
      },
      {
        title: 'Know what happens next',
        body: 'Visitors review a request before sending it, see that it is pending, and can change or cancel it afterward.',
      },
    ],
  },
  wireframes: {
    title: 'Structure first.',
    body: 'Layout studies for the core screens, drawn at desktop and mobile widths. Each one records the job the layout has to do.',
    studies: [
      {
        title: 'Homepage',
        intent: [
          'Location search is the first action.',
          'Featured homes follow the hero.',
          'Mobile cards become compact rows.',
        ],
        desktop: {
          src: `${base}/wf-home.webp`,
          alt: 'Homepage layout study: headline and search on the left, image on the right, then a row of four featured rentals and neighborhood links',
          width: 577,
          height: 481,
        },
        mobile: {
          src: `${base}/wf-home-mobile.webp`,
          alt: 'Homepage layout study on mobile: search stacked above the image, with featured rentals as compact rows',
          width: 158,
          height: 473,
        },
      },
      {
        title: 'Property details',
        intent: [
          'The gallery comes before the details.',
          'Rent stays distinct from other fees.',
          'The tour action stays prominent.',
        ],
        desktop: {
          src: `${base}/wf-listing.webp`,
          alt: 'Property details layout study: a large image with two smaller images, the home title and monthly rent, and a side panel with Request a tour, Save home and fees beyond rent',
          width: 654,
          height: 491,
        },
        mobile: {
          src: `${base}/wf-listing-mobile.webp`,
          alt: 'Property details layout study on mobile, ending in a full-width Request a tour button',
          width: 158,
          height: 473,
        },
      },
      {
        title: 'Tour date and time',
        intent: [
          'Date and time come first.',
          'Contact details follow.',
          'Review appears before submission.',
        ],
        desktop: {
          src: `${base}/wf-tour.webp`,
          alt: 'Tour request layout study, step 1 of 3: tour type, date and time options labeled in Eastern Time, a Continue button, and a summary of the home',
          width: 654,
          height: 491,
        },
        mobile: {
          src: `${base}/wf-tour-mobile.webp`,
          alt: 'Tour request layout study on mobile with the same steps stacked',
          width: 158,
          height: 473,
        },
      },
      {
        title: 'Confirmation',
        intent: [
          'Request received is not a tour booked.',
          'Home, time and type stay together.',
          'Change and cancel paths are clear.',
        ],
        desktop: {
          src: `${base}/wf-confirmation.webp`,
          alt: 'Confirmation layout study: "Tour request received." with a Pending confirmation label, a request summary, and actions to view, change or cancel the request',
          width: 654,
          height: 491,
        },
        mobile: {
          src: `${base}/wf-confirmation-mobile.webp`,
          alt: 'Confirmation layout study on mobile with the summary and actions stacked',
          width: 158,
          height: 473,
        },
      },
    ],
    board: {
      href: `${base}/porchlight-wireframe-board.png`,
      label: 'Open the complete wireframe board',
      detail: 'PNG · all five screens at desktop and mobile widths',
    },
  },
  development: {
    title: 'Giving the homepage a lead.',
    body: 'The first version worked, but nothing on it led. These are two documented stages of Porchlight itself.',
    comparisons: [
      {
        title: 'Search becomes the first action',
        body: [
          'Search had about the same weight as the paragraph above it. It now sits in a raised white panel with its own display-type prompt and a larger input and button.',
          'Five competing “Popular” links became one quiet fallback, and a porch inside a doorway-shaped arch replaced a glass house that read as luxury architecture.',
        ],
        before: {
          src: `${base}/before-desktop-first.webp`,
          alt: 'Earlier homepage: a small search field under the headline, a row of Popular links, and a photo of a modern glass house at dusk',
          width: 1600,
          height: 1000,
        },
        after: {
          src: `${base}/after-desktop-first.webp`,
          alt: 'Refined homepage: a raised search panel with a large input, one browse link, and an arched porch photo with a warm glow behind it',
          width: 1600,
          height: 1000,
        },
        beforeCaption: 'Before: search blends into the hero copy.',
        afterCaption: 'After: search sits in its own raised panel.',
        layout: 'wide',
      },
      {
        title: 'One section leads',
        body: [
          'Every section used the same heading size and card grid. Featured rentals now follow search directly, on a white band with the largest section title.',
          'Three tall principle cards became one slim strip, and eleven “1 home” neighborhood tiles became four photo tiles.',
        ],
        before: {
          src: `${base}/before-desktop.webp`,
          alt: 'Earlier homepage, full length: featured rentals, three tall principle cards, and an eleven-tile neighborhood list with similar weight',
          width: 1200,
          height: 2079,
        },
        after: {
          src: `${base}/after-desktop.webp`,
          alt: 'Refined homepage, full length: featured rentals on a white band, a slim principles strip, and four neighborhood photo tiles',
          width: 1200,
          height: 2011,
        },
        beforeCaption: 'Before: sections compete.',
        afterCaption: 'After: featured rentals lead.',
        layout: 'split',
      },
      {
        title: 'Compact cards on phones',
        body: [
          'On a 390 px phone, each featured card was nearly a full screen tall. Below 600 px, homepage cards now switch to a row with the photo beside the rent and key facts.',
          'Each card dropped from about 450 px to 170 px, and the mobile homepage from about 5,260 px to 3,205 px. Listing pages and search results keep the full details.',
        ],
        before: {
          src: `${base}/before-mobile-cards.webp`,
          alt: 'Earlier mobile homepage: featured rentals as tall cards, with about two visible in the same space',
          width: 780,
          height: 1900,
        },
        after: {
          src: `${base}/after-mobile-cards.webp`,
          alt: 'Refined mobile homepage: four featured rentals as compact rows in the same space',
          width: 780,
          height: 1900,
        },
        beforeCaption: 'Before: two tall cards in this height.',
        afterCaption: 'After: four compact rows in the same height.',
        layout: 'split-reverse',
      },
    ],
  },
  identity: {
    title: 'Warm, residential and easy to scan.',
    body: 'A serif with character for headings, a quiet sans for facts and forms, and a palette taken from a lit front porch.',
    displayFont: {
      name: 'Fraunces',
      role: 'Display · headings, prices, the italic accent in the headline',
      sample: 'Find your',
      accent: 'next home.',
    },
    bodyFont: {
      name: 'Instrument Sans',
      role: 'Body and interface · listing facts, navigation, labels and forms',
      sample: '2 beds · 1 bath · ~1,080 sq ft · Available Oct 15',
      paragraph: 'Monthly rent, move-in costs and pet policy, shown up front. Request a tour when you’re ready.',
    },
    swatches: [
      { name: 'Warm white', hex: '#FBF8F3', usage: 'Page background' },
      { name: 'Forest', hex: '#24563F', usage: 'Actions and links', onDark: true },
      { name: 'Brass', hex: '#B8893A', usage: 'Decorative accents only', onDark: true },
      { name: 'Text', hex: '#1D1B18', usage: 'Headings and body', onDark: true },
    ],
    note: 'Brass is never used for small text. Labels use a darker brass, #845D17, so they stay readable.',
  },
  journey: {
    title: 'From a search to a request.',
    body: 'Each screen answers one question before the visitor moves on.',
    steps: [
      {
        eyebrow: 'Search results',
        title: 'Show why these homes are here.',
        decision: 'Filters stay above the results, and every active filter is a removable chip.',
        body: 'Location, rent, bedrooms and pet policy sit together, with Clear all as a single reset. The search lives in the URL, so back, refresh and sharing all keep it.',
        image: {
          src: `${base}/desktop-search-filtered.webp`,
          alt: 'Search results filtered to rent up to $2,500 and dogs allowed, showing a result count, removable filter chips and listing cards',
          width: 1280,
          height: 900,
        },
        caption: 'Two active filters, shown as chips above five matching homes.',
      },
      {
        eyebrow: 'Property details',
        title: 'Let the home lead. Keep the action close.',
        decision: 'Rent is the only monthly figure on the page.',
        body: 'The gallery comes first, then the facts. Deposits and fees are grouped separately as one-time, refundable or optional, so nothing is blended into the rent.',
        image: {
          src: `${base}/journey-listing.webp`,
          alt: 'Listing page for a four-bedroom home in Ballantyne: a large photo gallery with thumbnails, the home title, and a card showing $2,995 monthly rent',
          width: 1440,
          height: 900,
        },
        caption: 'Gallery first. Monthly rent anchors the action card.',
      },
      {
        eyebrow: 'Tour request · step 1 of 3',
        title: 'One decision per step.',
        decision: 'Times are always shown in the home’s local time zone.',
        body: 'The request splits into the visit, contact details and a review. Continue is always enabled. If something is missing, an error summary links to each field instead of a faded button that never explains itself.',
        image: {
          src: `${base}/journey-tour.webp`,
          alt: 'Request a tour, step 1 of 3: in-person or virtual tour cards, a two-week grid of dates, and a time section labeled Eastern Time (EDT)',
          width: 1440,
          height: 900,
        },
        caption: 'Tour type, date and time, labeled “Eastern Time (EDT)”.',
      },
      {
        eyebrow: 'Confirmation',
        title: 'Received is not the same as confirmed.',
        decision: 'The confirmation never claims a tour is booked.',
        body: 'The heading reads “Tour request received.” beside a Pending confirmation badge with an icon and text. A full summary restores context, and change and cancel stay available afterward.',
        image: {
          src: `${base}/desktop-confirmation.webp`,
          alt: 'Confirmation page: "Tour request received." with a Pending confirmation badge, a requested appointment summary with property, tour type, date, time and time zone, and buttons to change or cancel',
          width: 1280,
          height: 900,
        },
        caption: 'A pending status, the full appointment summary, and both recovery paths.',
      },
    ],
    status: {
      title: 'Two different events',
      shown: {
        label: 'What Porchlight says',
        items: ['Tour request received.', 'Pending confirmation', 'Change or cancel anytime'],
      },
      avoided: {
        label: 'What it never claims',
        items: ['The tour is scheduled', 'The time is confirmed', 'An agent was contacted'],
      },
    },
  },
  responsive: {
    title: 'A smaller screen gets its own rhythm.',
    body: 'Mobile is composed for the phone rather than squeezed from desktop.',
    screens: [
      {
        image: {
          src: `${base}/after-mobile.webp`,
          alt: 'Mobile homepage with the stacked search panel',
          width: 780,
          height: 1688,
        },
        caption: 'Search stacks into one clear entry point.',
      },
      {
        image: {
          src: `${base}/mobile-search-filtered.webp`,
          alt: 'Mobile search with a Filters button showing 2 active, a sort menu and filter chips',
          width: 390,
          height: 844,
        },
        caption: 'Filters collapse into one control with an active count.',
      },
      {
        image: {
          src: `${base}/mobile-listing.webp`,
          alt: 'Mobile listing with a photo carousel and a fixed bottom bar showing $3,250 per month and Request a tour',
          width: 390,
          height: 844,
        },
        caption: 'Rent and Request a tour stay pinned to the bottom.',
      },
      {
        image: {
          src: `${base}/mobile-tour-validation.webp`,
          alt: 'Mobile tour request showing an error summary above the fields',
          width: 390,
          height: 844,
        },
        caption: 'Errors are summarized at the top, then shown inline.',
      },
      {
        image: {
          src: `${base}/mobile-confirmation.webp`,
          alt: 'Mobile confirmation with "Tour request received." and a Pending confirmation badge',
          width: 390,
          height: 844,
        },
        caption: 'The pending status reads the same on every screen.',
      },
    ],
    notes: [
      {
        title: 'The arch flattens',
        body: 'The doorway-shaped hero photo becomes a rounded rectangle below the search.',
      },
      {
        title: 'Cards become rows',
        body: 'Homepage cards put the photo beside the rent, at less than half their former height.',
      },
      {
        title: 'Targets stay large',
        body: 'Buttons, form controls and the save toggle keep a touch area of at least 44 px.',
      },
    ],
  },
  outcome: {
    title: 'A complete journey, ready for real feedback.',
    achieved: [
      {
        title: 'One visual system',
        body: 'Desktop and mobile screens now share one palette, type scale and set of components.',
      },
      {
        title: 'A clearer entrance',
        body: 'Search leads the homepage, and featured rentals follow it directly.',
      },
      {
        title: 'An honest request flow',
        body: 'Costs, time zones and request status are stated plainly from browsing to request management.',
      },
    ],
    untested: {
      title: 'Still untested',
      body: [
        'Porchlight has not been tested with renters, so every decision here is a design proposal. Next, I want to test whether prospective renters can find a suitable home, explain its costs and understand a pending tour request.',
        'After that comes mobile use on real devices and with screen readers, then revising the design around what people actually struggle with.',
      ],
    },
    pdf: {
      href: `${base}/porchlight-case-study.pdf`,
      label: 'Download the case study PDF',
      detail: '12 pages · 16 MB',
    },
  },
}
