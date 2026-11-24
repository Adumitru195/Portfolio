import type { PorchShot, PorchlightCaseStudy } from '@/types/porchlight'

const base = '/Portfolio/projects/porchlight'
const arcadian = `${base}/arcadian`
const capture = `${base}/case-study`

// Evidence behind this page (checked November 23, 2026):
//  - Arcadian Homes screens are single unedited frames from the 2024 mobile
//    prototype recording (reference/arcadian-homes/Video 2.mp4), made by
//    scripts/porchlight-case-study-assets.py. The cover is the 2024 file,
//    copied unchanged. The 2024 usability summary (Usability Study.webp)
//    records three pain points but no method or participant count.
//  - Porchlight screens are captures of the working prototype: case-study/*
//    from scripts/porchlight-captures.mjs (November 23, 2026), the rest from
//    October 2026. Listings, prices and availability are fictional.
//  - Card height (194 px compact vs 430–451 px full), the 3,205 px homepage
//    and the 11 → 5 → 3 search were measured in the running prototype at
//    390 px. The 5,260 px earlier homepage is its 2x capture (10,520 px) / 2.
//  - Unit tests: 38/38 re-run on November 23, 2026. The browser, axe,
//    keyboard and privacy results are from the prototype's development log
//    (October 3, 2026) and were not re-run.
//  - The wireframe board's files are dated after the prototype source, so the
//    page presents them as layout studies, not as a step before the build.
//  - walkthrough.mp4 is the 14 Oct 2026 recording with one edit: original
//    frames 239-292 (the 4-result state, 1.8 s) were cut on 23 Nov 2026 so a photo
//    whose licence couldn't be confirmed doesn't appear (see scripts/walkthroughs/README.md). It
//    is not one continuous take; don't describe it as one.
//  - Provenance: the prototype's code was written with Claude Code under the
//    owner's product direction, UX/UI and interaction design, and review
//    (Porchlight/docs/DEVELOPMENT-LOG.md). The public page names the owner's
//    role and does not list tools; it must never claim the owner wrote the code.

const phone = (file: string, alt: string, width = 780, height = 1688) => ({ src: file, alt, width, height })

const arcadianShot = (file: string, alt: string, label: string, caption: string): PorchShot => ({
  image: phone(`${arcadian}/${file}`, alt, 496, 1048),
  label,
  caption,
  portrait: true,
})

export const porchlight: PorchlightCaseStudy = {
  opening: {
    eyebrow: 'Independent UX/UI case study · Responsive website',
    subtitle: 'Find a home, understand the details, and know what happens next',
    lede: 'A redesign of Arcadian Homes, my earlier real estate concept from 2024. Porchlight narrows it to a responsive rental website for Charlotte, NC, and fixes three problems in its rental journey.',
    meta: [
      { label: 'My role', value: 'Product direction, UX/UI design, interaction design, and implementation review' },
      { label: 'Deliverable', value: 'Working responsive prototype' },
      { label: 'Timeline', value: 'Arcadian Homes 2024 → Porchlight 2026' },
      { label: 'Status', value: 'Concept, not yet tested with renters' },
    ],
    summaryLabel: 'Three problems, three redesigns',
    summary: [
      {
        problem: 'Rental costs',
        change: 'One monthly rent; other charges labelled.',
        stat: { value: '2 → 1', label: 'monthly figure in the price headline', detail: '', kind: 'observed' },
      },
      {
        problem: 'Search and comparison',
        change: 'Rentals only, with clear filters.',
        stat: { value: '55%', label: 'shorter listing cards on phones', detail: '', kind: 'measured' },
      },
      {
        problem: 'Tour requests',
        change: 'A reviewed, pending request.',
        stat: { value: '0', label: 'claims that a tour is booked', detail: '', kind: 'verified' },
      },
    ],
    dataNote: 'Porchlight’s listings, prices and availability are fictional sample data. Its numbers measure the interface, the prototype’s behaviour and its automated checks, not renter success, satisfaction, conversion or business results.',
  },

  walkthrough: {
    eyebrow: 'Working prototype',
    title: 'The rental journey in 37 seconds.',
    body: 'Search, filter, open a home and request a tour. The request stays pending: nothing in a demo can confirm it.',
    descriptionSummary: 'What the walkthrough shows',
    video: {
      mp4: `${base}/walkthrough.mp4`,
      poster: {
        src: `${base}/walkthrough-poster.webp`,
        alt: 'Porchlight homepage with the location search, the first frame of the walkthrough',
        width: 1600,
        height: 1000,
      },
      label: 'rental journey walkthrough',
      duration: 37,
      caption: 'Recorded from the working prototype · 37 seconds · No audio',
      description:
        'The recording starts on the Porchlight homepage, types Charlotte into the location search and opens the results. It sets a maximum rent of $2,500 a month, two or more bedrooms and dogs allowed, narrowing 11 sample homes to 3, then opens the craftsman bungalow in Plaza Midwood and scrolls to its rent summary. Request a tour opens the three-step form, where it chooses an in-person tour on Friday, October 16 at 11:00 AM, enters a demo name and an example.com email, and reviews the request, including the note that this demo request won’t contact an agent. After Submit tour request, it ends on “Tour request received.” with the Pending confirmation status and a summary of the requested appointment.',
    },
  },

  origin: {
    title: 'A rental search inside a do-everything real estate site.',
    body: [
      'Arcadian Homes, my 2024 concept, brought listings and tour booking together, alongside buying, selling, calculators, an agent finder and articles.',
      'Revisiting it in 2026, I found three problems in its rental path, each visible on a real screen.',
    ],
    cover: {
      image: { src: `${arcadian}/cover.webp`, alt: 'Arcadian Homes 2024 cover: a laptop and a phone showing the same listing page, a $349,000 home with Schedule a Tour and Contact Agent buttons, in brass branding.', width: 620, height: 443 },
      label: 'Arcadian Homes, 2024',
      caption: 'Buying, renting and selling in one product.',
    },
    research: {
      title: 'My 2024 usability summary recorded:',
      points: [
        'The rental listings page needs rental prices rather than buying prices.',
        'Users need a way to change the tour date once they’ve selected one.',
        'Users like having more than one way to navigate to a page.',
      ],
      attribution: 'That is all it records: not how the sessions were run or how many people took part, and the redesign hasn’t been retested. I treat these as signals, not findings.',
    },
    stat: { value: '5 → 3', label: 'top-level sections, all about renting', detail: 'Buy, Rent, Sell, Resources, Pro Finder → Find a home, Saved homes, My tours.', kind: 'observed' },
  },

  costs: {
    id: 'costs',
    index: '02',
    label: 'Rental costs',
    title: 'One monthly number. Everything else, labelled.',
    intro: 'A renter’s first question is the monthly cost. Arcadian gave two different answers. The homes below differ and Porchlight’s prices are samples, so compare how costs are labelled and grouped, not the amounts.',
    stats: [
      { value: '2 → 1', label: 'monthly figure in the price headline', detail: 'Rent only, on every listing and card.', kind: 'observed' },
      { value: '3', label: 'labelled groups for other costs', detail: 'One-time, refundable, optional monthly.', kind: 'verified' },
    ],
    problems: [
      { text: '$3,234/mo sits above “Est. Payment: $4,374/mo”, with neither explained.', kind: 'observed' },
      { text: 'The same estimate appears on the home’s $349,000 sale listing: a mortgage figure on a rental.', kind: 'observed' },
      { text: 'My 2024 summary had flagged it.', kind: 'research' },
    ],
    before: {
      heading: 'Arcadian Homes, 2024',
      shots: [
        arcadianShot('price.webp', 'Arcadian Homes 2024 mobile listing: a brick house photo, the price $3,234/mo with 4 bd, 3 ba and 2,221 sqft, the address, and directly below it “Est. Payment: $4,374/mo”, then Schedule a Tour and Contact Agent buttons.', 'Rental listing', 'Two monthly figures.'),
        arcadianShot('sale.webp', 'The same Arcadian Homes address shown as $349,000 with the same “Est. Payment: $4,374/mo”, a map, Single-family, $278 price/sqft and Built in 2003.', 'Same home, for sale', 'The same estimate at $349,000.'),
      ],
    },
    after: {
      heading: 'Porchlight, 2026',
      shots: [
        {
          image: phone(`${capture}/mobile-listing.webp`, 'Porchlight listing on a phone: a photo gallery of a craftsman bungalow (photo 1 of 5), House · Plaza Midwood, the title and address, a $2,150 monthly rent card, and a fixed bottom bar with $2,150/mo and Request a tour.'),
          label: 'Listing',
          caption: 'One monthly figure, always in reach.',
          portrait: true,
        },
      ],
    },
    breakdown: {
      image: { src: `${capture}/mobile-costs.webp`, alt: 'Sample move-in costs, separate from the $2,150 monthly rent: one-time application fee $65 per adult applicant; refundable security deposit $2,150 and pet deposit $300, only with pets; optional pet rent $25 a month per pet.', width: 716, height: 974 },
      label: 'Move-in costs',
      caption: 'Grouped by type, never added to rent.',
    },
    decisions: [
      'Base rent is the only monthly number in the price headline and on cards.',
      'Deposits, fees and optional charges like pet rent sit in a separate, labelled list.',
      'No purchase prices or mortgage estimates anywhere.',
    ],
    validate: ['Can renters work out the move-in cost from the listing alone?'],
  },

  discovery: {
    id: 'discovery',
    index: '03',
    label: 'Search and comparison',
    title: 'Fewer distractions. Results that explain themselves.',
    intro: 'In Arcadian, renters worked around buying and selling features. Within Porchlight, the first build’s phone cards then filled most of the screen, so the card comparison below is between two Porchlight iterations, not against Arcadian.',
    stats: [
      { value: '55%', label: 'shorter homepage cards on phones', detail: '430–451 px → 194 px', kind: 'measured' },
      { value: '39%', label: 'shorter mobile homepage', detail: '5,260 px → 3,205 px', kind: 'measured' },
      { value: '2 → 4', label: 'homes in the same screen height', detail: 'The same 950 px', kind: 'measured' },
      { value: '11 → 3', label: 'sample listings after three filters', detail: '≤ $2,500/mo, dogs, 2+ beds', kind: 'verified' },
    ],
    problems: [
      { text: 'In Arcadian, renting shared a menu with buying, selling and an agent finder.', kind: 'observed' },
      { text: 'Arcadian listings mixed in purchase data such as price per square foot.', kind: 'observed' },
      { text: 'Iteration: Porchlight’s own first build showed about two homes per phone screen.', kind: 'measured' },
    ],
    before: {
      heading: 'Porchlight first build (earlier iteration)',
      shots: [
        {
          image: { src: `${base}/before-mobile-cards.webp`, alt: 'Porchlight’s first build (an earlier iteration of Porchlight, not Arcadian Homes), mobile homepage: featured rentals as tall cards, with about two visible in the same space', width: 780, height: 1900 },
          label: 'Porchlight first build',
          caption: 'Earlier iteration: two tall cards.',
          portrait: true,
        },
      ],
    },
    after: {
      heading: 'Porchlight, refined iteration',
      shots: [
        {
          image: { src: `${base}/after-mobile-cards.webp`, alt: 'Refined Porchlight mobile homepage: four featured rentals as compact rows in the same space', width: 780, height: 1900 },
          label: 'Porchlight refined cards',
          caption: 'Four homes, same height.',
          portrait: true,
        },
        {
          image: phone(`${capture}/mobile-search.webp`, 'Porchlight search on a phone: Homes for rent in Charlotte, a Filters button showing 3 active, a sort menu, “3 homes available”, chips for Up to $2,500/mo, 2+ bedrooms and Dogs allowed, Clear all filters, and the first result card.'),
          label: 'Search',
          caption: 'Filters as removable chips.',
          portrait: true,
        },
      ],
    },
    decisions: [
      'Rentals only: three sections, no sign-in wall or calculators.',
      'Filters above the results as removable chips; the search is kept in the URL.',
      'Below 600 px, homepage cards become rows: photo beside rent and key facts.',
    ],
    validate: ['Do compact cards show enough to choose which home to open?'],
  },

  tours: {
    id: 'tours',
    index: '04',
    label: 'Tour requests',
    title: 'A request is not a booking.',
    intro: 'Arcadian promised a scheduled tour, then said the time still had to be confirmed.',
    stats: [
      { value: '3', label: 'steps, ending in a review', detail: 'Time, details, review', kind: 'verified' },
      { value: '0', label: 'contact details stored', detail: 'Cleared on submit', kind: 'verified' },
    ],
    problems: [
      { text: 'Schedule Tour stays faded without saying why; times have no time zone.', kind: 'observed' },
      { text: '“Your tour has been scheduled!”, then “An agent will… confirm your date/time.” Both can’t be true.', kind: 'observed' },
      { text: 'No tour details and no way to change the date, as my 2024 summary had flagged.', kind: 'research' },
    ],
    before: {
      heading: 'Arcadian Homes, 2024',
      shots: [
        arcadianShot('tour-picker.webp', 'Arcadian Homes tour picker: In-Person and Virtual tabs, three date cards with Fri May 13 selected, a Time dropdown, and a faded Schedule Tour button.', 'Tour picker', 'Faded button, no time zone.'),
        arcadianShot('confirmation.webp', 'Arcadian Homes confirmation: “Your tour has been scheduled!” followed by “An agent will be in touch with you shortly via email to confirm your date/time.”, with Done and Cancel Tour buttons and no tour details.', 'Confirmation', '“Scheduled”, yet unconfirmed.'),
      ],
    },
    after: {
      heading: 'Porchlight, 2026',
      shots: [
        {
          image: phone(`${capture}/mobile-tour-step1.webp`, 'Request a tour, step 1 of 3 (Date and time) on a phone: a summary of the home with $2,150/mo, and tour type cards for In-person and Virtual.'),
          label: 'Step 1',
          caption: 'One decision per step.',
          portrait: true,
        },
        {
          image: phone(`${capture}/mobile-tour-review.webp`, 'Request a tour, step 3 of 3, Review your request: the home, In-person tour and Thursday, November 26, 2026, with an Edit link.'),
          label: 'Step 3 · Review',
          caption: 'Editable before sending.',
          portrait: true,
        },
        {
          image: phone(`${capture}/mobile-confirmation.webp`, 'Porchlight confirmation on a phone: “Tour request received.” with a Pending confirmation badge, the note “This request is waiting to be confirmed. Until then, you can change or cancel it below.”, a photo of the home and the Requested appointment summary.'),
          label: 'Received',
          caption: 'Pending, with change and cancel.',
          portrait: true,
        },
      ],
    },
    disclosure: {
      image: { src: `${capture}/mobile-tour-disclosure.webp`, alt: 'Before you submit: Porchlight is a demo. Submitting won’t contact an agent or book a real tour. Your request will be marked “Pending confirmation” and saved in this browser, without your contact details, so you can change or cancel it.', width: 716, height: 426 },
      label: 'Shown before submitting',
      caption: 'The demo says it contacts no one.',
    },
    status: {
      title: 'Two different events',
      shown: { label: 'What Porchlight says', items: ['Tour request received.', 'Pending confirmation', 'Change or cancel anytime'] },
      avoided: { label: 'What it never claims', items: ['The tour is scheduled', 'The time is confirmed', 'An agent was contacted'] },
    },
    decisions: [
      'Three steps: time, details, then a review before sending.',
      'Continue stays enabled; missing answers get an error summary linked to each field.',
      'Times say “Eastern Time”, and the confirmation says “Tour request received.”',
    ],
    validate: ['After submitting, can renters tell whether their tour is confirmed?'],
  },

  process: {
    title: 'Layout studies and visual system.',
    intro: 'Supporting documentation: layout studies at desktop and mobile widths, and the small system of type and colour the screens share.',
    wireframes: {
      shots: [
        { image: { src: `${base}/wf-home.webp`, alt: 'Homepage layout study: headline and search on the left, image on the right, then a row of four featured rentals and neighborhood links', width: 577, height: 481 }, label: 'Homepage', caption: 'Search first.' },
        { image: { src: `${base}/wf-listing.webp`, alt: 'Property details layout study: a large image with two smaller images, the home title and monthly rent, and a side panel with Request a tour, Save home and fees beyond rent', width: 654, height: 491 }, label: 'Listing', caption: 'Rent apart from fees.' },
        { image: { src: `${base}/wf-tour.webp`, alt: 'Tour request layout study, step 1 of 3: tour type, date and time options labeled in Eastern Time, a Continue button, and a summary of the home', width: 654, height: 491 }, label: 'Tour request', caption: 'Time zone shown.' },
        { image: { src: `${base}/wf-confirmation.webp`, alt: 'Confirmation layout study: “Tour request received.” with a Pending confirmation label, a request summary, and actions to view, change or cancel the request', width: 654, height: 491 }, label: 'Confirmation', caption: 'Received, not booked.' },
      ],
      note: 'Desktop layouts shown. The board includes each screen at 390 px.',
      board: { href: `${base}/porchlight-wireframe-board.png`, label: 'Open the wireframe board', detail: 'PNG · five screens, desktop and mobile' },
    },
    identity: {
      fonts: [
        { name: 'Fraunces', role: 'Headings and prices' },
        { name: 'Instrument Sans', role: 'Facts, navigation and forms' },
      ],
      swatches: [
        { name: 'Warm white', hex: '#FBF8F3', usage: 'Background' },
        { name: 'Forest', hex: '#24563F', usage: 'Actions', onDark: true },
        { name: 'Brass', hex: '#B8893A', usage: 'Accents only', onDark: true },
        { name: 'Text', hex: '#1D1B18', usage: 'Headings, body', onDark: true },
      ],
      note: 'Forest on warm white is 8.0:1. Brass (2.97:1) is decoration only; labels use a darker brass at 5.6:1.',
    },
  },

  quality: {
    title: 'Responsive, accessible, and checked.',
    intro: 'Phones get their own layouts. Automated checks confirm the prototype works as designed; they are not user testing.',
    attribution: 'Results come from the prototype’s test suite and development log, and describe technical quality, not renter outcomes.',
    phones: [
      {
        image: { src: `${base}/after-mobile.webp`, alt: 'Mobile homepage with the stacked search panel', width: 780, height: 1688 },
        label: 'Homepage',
        caption: 'Search stacks first.',
        portrait: true,
      },
      {
        image: { src: `${base}/mobile-tour-validation.webp`, alt: 'Mobile tour request showing an error summary above the fields', width: 390, height: 844 },
        label: 'Errors',
        caption: 'Summarized, then inline.',
        portrait: true,
      },
    ],
    checks: [
      { value: '38/38', label: 'unit tests pass', detail: 'Filters, time zones, tour changes. Re-run Nov 23, 2026.', kind: 'verified' },
      { value: '69/69', label: 'browser checks', detail: 'Full journey at 1440 and 390 px. Oct 3, 2026.', kind: 'verified' },
      { value: '0', label: 'axe violations', detail: '16 states at 1440 and 390 px. Oct 3, 2026.', kind: 'verified' },
      { value: '1.87 → 3.67:1', label: 'control border contrast', detail: 'Now passes WCAG 1.4.11 (3:1).', kind: 'measured' },
      { value: '44 px', label: 'minimum touch targets', detail: 'Buttons, fields, save toggle.', kind: 'verified' },
    ],
    notDone: {
      title: 'Not yet done',
      items: ['Testing with renters', 'Screen readers', 'Safari, Firefox, real phones'],
    },
  },

  reflection: {
    title: 'A clearer rental journey, ready to test.',
    accomplished: [
      { title: 'Found the problems', body: 'Three failures in my own earlier work, each on a real screen.' },
      { title: 'Designed the fixes', body: 'Clear costs, focused search and an honest request flow.' },
      { title: 'Refined it in a working prototype', body: 'A working, responsive prototype, reviewed and refined against the design goals, with automated checks.' },
    ],
    learned: '“Scheduled” versus “requested” is one word, but it decides what a product promises. Status language is a design decision.',
    next: {
      title: 'What I’d validate next',
      intro: 'Every decision is still a hypothesis. With five to eight renters, I’d test:',
      questions: [
        'Can they work out a home’s move-in cost?',
        'Can they find a home that fits, and say why it matched?',
        'Can they tell whether their tour is confirmed?',
      ],
    },
    contactLabel: 'Start a project',
  },
}
