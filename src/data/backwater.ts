import type { PresentationImage } from '@/types/presentation'

const base = '/Portfolio/projects/backwater-journal'

// The six current product-tour screens are the official website assets
// (backwaterjournal.com/images/app/), pixel-identical to the screens in the
// case study PDF. Each is a transparent PNG-style webp that already includes
// its phone frame, so it is shown without another device frame.
const screen = (file: string, width: number, height: number, alt: string): PresentationImage => ({
  src: `${base}/${file}`,
  width,
  height,
  alt,
})

export const backwaterScreens = {
  dock: screen('dock.webp', 640, 1325,
    'Dock screen: a greeting, a row of personal catch statistics, and a Fishing Conditions card rated Great with Prime Bite, 67 degrees, the bite window, wind, sunrise, sunset, pressure, rain and a View Conditions button.'),
  communityPost: screen('community-post.webp', 640, 1328,
    'A shared catch in the Dock: a post by Andrew D. tagged Catch Log, with a photo of a white crappie, its weight and length, and a location chip naming the lake and county.'),
  newCatch: screen('new-catch.webp', 640, 1326,
    'New Catch form: a Catch Basics group with Add Photos (up to 10), a required Primary Species field, weight and length fields side by side, and a prefilled date and time with a Change link, followed by Trip Details.'),
  explore: screen('explore.webp', 640, 1325,
    'Current Explore screen: a full-width map with a search field for waters, spots and catches, Species, Filters and Saved chips, three stacked map controls, and a Fishing spots panel showing Skokie Lagoon with distance, species, Public access and Community spot labels.'),
  exploreBefore: screen('explore-before-1-1-0.jpg', 808, 1688,
    'Earlier Explore screen: a search field with separate filter and layer buttons, a zoomed-in map with pins, and a bottom sheet for Skokie Lagoon with a Search this area button and All, Fish Activity, Conditions and Species chips.'),
  species: screen('species.webp', 640, 1325,
    'Species collection in the Journal: Caught, Uncaught and All tabs, Freshwater, Saltwater and Hybrid filters, and species cards showing catch counts, best catch and the month last caught.'),
  market: screen('market.webp', 640, 1325,
    'Market screen: Saved and My Listings buttons, a List Your Gear banner, gear search, category chips, and an empty state reading No gear listed yet with a List Your Gear button.'),
}

export interface BwPoint {
  title: string
  body: string
}

export interface BwScreen {
  label: string
  caption: string
  image: PresentationImage
}

export interface Experience {
  id: string
  label: string
  kicker: string
  title: string
  intro: string
  screens: BwScreen[]
  task: string
  decision: string[]
  evidence: string[]
  next: string
  note?: string
}

export const sources = {
  website: 'https://www.backwaterjournal.com/',
  appStore: 'https://apps.apple.com/us/app/backwater-journal/id6761636518',
  privacy: 'https://www.backwaterjournal.com/privacy/',
  support: 'https://www.backwaterjournal.com/support/',
}

export const backwater = {
  documentTitle: 'Backwater Journal · Andrew Dumitru',
  runningHead: 'Product design + development / iOS',

  opening: {
    eyebrow: 'A personal interest. A released product.',
    title: 'Backwater Journal',
    tagline: 'Every catch has a story.',
    lede: 'An independent iOS app I designed, built and released. It connects personal catch records, nearby discovery and an angler community.',
    roleLabel: 'My role',
    role: 'Founder, product designer and mobile app developer',
    meta: [
      { label: 'Platform', value: 'iOS / iPhone' },
      { label: 'Released', value: 'July 14, 2026' },
      { label: 'Latest update', value: '1.1.0 · September 27, 2026' },
      { label: 'Available in', value: 'United States and Canada' },
    ],
    links: [
      { label: 'Visit the website', href: sources.website },
      { label: 'View on the App Store', href: sources.appStore },
    ],
    screens: [
      { label: 'Dock', caption: 'Conditions and catch statistics', image: backwaterScreens.dock },
      { label: 'Explore', caption: 'The map-first discovery screen', image: backwaterScreens.explore },
    ] satisfies BwScreen[],
    caption: 'Current website product-tour screens.',
  },

  context: {
    label: 'Context + ownership',
    kicker: 'From fishing interest to product',
    title: 'I took the idea beyond the mockup.',
    body: [
      'Fishing gave me a reason to build something of my own. I designed and developed Backwater Journal as an iOS product, bringing its screens, navigation and supporting services into a working app.',
      'Owning the whole product meant every design decision also had to be built, released and maintained. That made me think about the experience as a set of connected jobs rather than a collection of screens.',
    ],
    roles: [
      { title: 'Product direction', body: 'I shaped the experience around logging, discovery, community and fishing gear, and decided how those parts relate to each other.' },
      { title: 'Interface + implementation', body: 'I worked across visual design and mobile development rather than stopping at static screens.' },
      { title: 'Release + refinement', body: 'I released the app on the App Store and continued it through a documented update that rebuilt Explore.' },
    ] satisfies BwPoint[],
    facts: [
      { label: 'Platform', value: 'iOS / iPhone' },
      { label: 'Initial release', value: 'July 14, 2026' },
      { label: 'Latest verified update', value: '1.1.0 · September 27, 2026' },
      { label: 'Available regions', value: 'United States and Canada' },
      { label: 'Price', value: 'Free on the App Store' },
      { label: 'Tools', value: 'Figma, React Native / Expo, Supabase, TestFlight' },
    ],
    factsNote: 'An independent product available on the App Store.',
  },

  structure: {
    label: 'Experience structure',
    kicker: 'One product, several connected jobs',
    title: 'Keep the fishing experience connected.',
    intro: 'My design intent is to connect the moments before, during and after a trip without making every task feel the same.',
    steps: [
      { name: 'Prepare', parts: 'Dock + Explore', body: 'Conditions and nearby discovery.' },
      { name: 'Record', parts: 'Catch Log + Journal', body: 'Structured records and personal stories.' },
      { name: 'Revisit', parts: 'Species + catch history', body: 'A record that becomes useful over time.' },
      { name: 'Connect', parts: 'Community + Market', body: 'Share experiences and coordinate gear trades.' },
    ],
    navLabel: 'Where it lives in the app',
    nav: 'The bottom navigation has four tabs: Dock, Journal, Explore and Market. Community posts appear in the Dock, and the species collection sits in the Journal, so each tab holds more than one related job.',
    recordsLabel: 'Two kinds of records',
    records: [
      { title: 'Catch log', body: 'A structured record of a single catch: photos, species, weight, length, date and time, lure or bait, and trip details.' },
      { title: 'Journal entry', body: 'Stories, notes and updates from time on the water that do not fit into those fields.' },
    ] satisfies BwPoint[],
    principleLabel: 'Design principle',
    principle: 'Keep structure where it helps people remember details; leave room for expression where the experience is personal.',
  },

  experienceLabels: {
    task: 'The task',
    decision: 'The design decision',
    evidence: 'The visible evidence',
    next: 'Next question',
  },

  experiences: [
    {
      id: 'dock',
      label: 'Dock + community',
      kicker: 'Planning and sharing have different jobs',
      title: 'A useful starting point. A place to connect.',
      intro: 'The Dock is the first tab. It holds two different kinds of content: practical information for planning a trip, and catches other anglers have chosen to share.',
      screens: [
        { label: 'Dock / conditions', caption: 'Conditions sit below the personal statistics row.', image: backwaterScreens.dock },
        { label: 'Dock / shared catch', caption: 'A shared post tagged Catch Log, with like, comment and share actions.', image: backwaterScreens.communityPost },
      ],
      task: 'Before a trip, an angler wants to know whether conditions look worth going out for. After a trip, they may want to share a catch and see what others have caught.',
      decision: [
        'Conditions and statistics answer different questions, so I kept them visually separate. Statistics describe your own record: catches, this week, best weight and day streak. Conditions describe the water right now: a rating, the bite window, wind, sunrise, sunset, pressure and rain.',
        'Shared catches pair a photograph with the key fishing details, so a post reads as a catch story rather than a plain status update.',
      ],
      evidence: [
        'The conditions card leads with a plain-language summary (“Prime Bite”, “Calm in Northfield this evening”) before the detail grid, and ends with a View Conditions action.',
        'The shared post carries a Catch Log tag, species, weight, length and a location chip naming a lake and county.',
      ],
      next: 'Do people read the conditions rating as a summary to plan with rather than a guarantee? And does seeing practical information and community posts in one tab feel clear, or crowded?',
      note: 'The statistics shown belong to an example account. They are not adoption or performance figures.',
    },
    {
      id: 'catch-logging',
      label: 'Catch logging',
      kicker: 'The details worth remembering',
      title: 'Turn a catch into a useful record.',
      intro: 'A catch log is the product’s core record. The form has to work at the water, often one-handed, sometimes with a weak signal.',
      screens: [
        { label: 'New Catch', caption: 'Catch Basics first, then Trip Details.', image: backwaterScreens.newCatch },
      ],
      task: 'Record a catch while the details are fresh, without having to fill in everything at once.',
      decision: [
        'The form opens with a Catch Basics group: photos, then the species, then measurements, then date and time. Trip details such as lure or bait come after. Photos and fields do different jobs: the image remembers the moment, while the data supports later review.',
        'Weight and length sit side by side with their units in the labels, and the date and time are filled in already with a Change link, so the time of the catch usually needs no typing.',
      ],
      evidence: [
        'Primary Species is the only field marked required in the visible form, and Add Photos states its limit: up to 10 photos.',
        'Version 1.1.0 added Pin on Map for catch logging, offline catch drafts, measurement improvements and catch history export.',
      ],
      next: 'How long does it take to log a catch outdoors, and do people understand when a catch is saved as an offline draft rather than posted?',
    },
    {
      id: 'explore',
      label: 'Explore',
      kicker: 'The map as the main workspace',
      title: 'Make discovery easier to act on.',
      intro: 'Explore was rebuilt in version 1.1.0. The current screen leads with the map, then places search, species filters and saved access above it.',
      screens: [
        { label: 'Explore / current', caption: 'Map-first, with a Fishing spots panel above the navigation.', image: backwaterScreens.explore },
      ],
      task: 'Find a place to fish, narrow it by species, and understand a spot without losing track of where it is.',
      decision: [
        'Search stays at the top and names its scope: waters, spots and catches. Species, Filters and Saved sit directly beneath it as labelled chips, and three round map controls, including layers and locate, stack on the right edge of the map.',
        'A selected spot opens a compact panel above the bottom navigation rather than replacing the map, so its distance and species stay connected to its place.',
      ],
      evidence: [
        'The Fishing spots panel shows Skokie Lagoon with a distance, the species listed for it, and Public access and Community spot labels, while the surrounding map stays visible behind it.',
        'The 1.1.0 notes describe Explore as rebuilt with improved fishing spot discovery, catch activity, saved fishing spots, weather and fishing conditions, and better map interactions.',
      ],
      next: 'Can someone find, open and save a spot on their first try? And how do people interpret labels like Public access?',
    },
    {
      id: 'species',
      label: 'Species + personal progress',
      kicker: 'Give the record a reason to grow',
      title: 'From individual catches to a personal collection.',
      intro: 'The species collection lives in the Journal tab. It is a second way into the same catch history.',
      screens: [
        { label: 'Species', caption: 'Caught species with counts and best catches.', image: backwaterScreens.species },
      ],
      task: 'Look back at what you have caught without scrolling through every individual catch, and see which species you have not caught yet.',
      decision: [
        'Caught, Uncaught and All tabs change what the collection shows, and water-type chips (Freshwater, Saltwater, Hybrid) narrow it further.',
        'Each card summarises a species from your own records: how many times you caught it, your best catch, and when you last caught one.',
      ],
      evidence: [
        'The cards show “3x caught”, “Best Catch 3 lbs” and “Last May 2026”, with a Top badge on the White Crappie card and a “7 caught” total for the collection.',
        'Species illustrations are labelled in the app as AI artwork, with species data credited to FishBase.',
      ],
      next: 'Does the Uncaught view give people a reason to keep logging, or does it add clutter for casual anglers?',
      note: 'The counts belong to an example account. They are not evidence of app adoption or product performance.',
    },
    {
      id: 'market',
      label: 'Market',
      kicker: 'A marketplace with clear boundaries',
      title: 'Help people coordinate. State what the app handles.',
      intro: 'Market supports gear search, categories, saved listings and creating a listing. Buyers and sellers message each other to arrange the transaction.',
      screens: [
        { label: 'Market / empty state', caption: 'No listings yet, with one clear next action.', image: backwaterScreens.market },
      ],
      task: 'Find fishing gear from other anglers, or list your own, and then arrange the details with the other person.',
      decision: [
        'Saved and My Listings sit in the header, keeping saved gear and your own listings one step away. A List Your Gear banner, search and category chips (Rods, Reels, Lures, Tackle, Apparel) come next.',
        'When nothing is listed, the empty state explains the situation and offers one action: List Your Gear. It turns an empty screen into a starting point instead of a dead end.',
      ],
      evidence: [
        'The empty state reads “No gear listed yet” and repeats the List Your Gear action as the screen’s main button.',
      ],
      next: 'Do people understand who handles payment, pickup and shipping before they message a seller?',
      note: 'The screenshot shows the empty state. It does not imply a populated marketplace.',
    },
  ] satisfies Experience[],

  exploreComparison: {
    label: 'Before and after 1.1.0',
    title: 'What changed in Explore',
    before: {
      label: 'Earlier Explore',
      caption: 'Cropped from the earlier App Store screenshot, added to this portfolio on July 7, 2026, before the 1.1.0 update.',
      image: backwaterScreens.exploreBefore,
    },
    after: {
      label: 'Current Explore',
      caption: 'The current website product-tour screen, matching the App Store screenshot after 1.1.0.',
      image: backwaterScreens.explore,
    },
    changes: [
      { title: 'Search scope', body: 'The search field changed from “Search lakes, rivers, spots, @angle…” (truncated in the screenshot) to “Search waters, spots and catches”.' },
      { title: 'Filters', body: 'Icon-only filter and layer buttons beside the search became labelled Species, Filters and Saved chips, with map controls stacked on the map.' },
      { title: 'Selected spot', body: 'A bottom sheet with All, Fish Activity, Conditions and Species chips became a Fishing spots panel listing distance, species and access labels.' },
    ] satisfies BwPoint[],
    reasonLabel: 'Documented reason',
    reason: '“Explore has been rebuilt with improved fishing spot discovery, catch activity, saved fishing spots, weather and fishing conditions, and better map interactions.”',
    reasonSource: 'Version 1.1.0 release notes, App Store',
    reading: 'My reading, as design intent: naming the filters and putting Saved in view makes the main ways to narrow the map visible without opening a menu. The release notes do not record a measured outcome for this change.',
  },

  marketBoundary: {
    label: 'Product boundary',
    body: 'Backwater Journal does not process marketplace payments or provide buyer protection. Buyers and sellers arrange payment, pickup and shipping directly, and listings, messages and accounts can be reported or blocked in the app.',
  },

  release: {
    label: 'Release + iteration',
    kicker: 'A product that continued after launch',
    title: 'The latest verified update changed the experience.',
    versions: [
      { date: 'July 14, 2026', name: 'Initial release / 1.0', body: 'The App Store version history records the first public release.' },
      { date: 'September 27, 2026', name: 'Refinement / 1.1.0', body: 'Explore was rebuilt, with additions to catch capture, portability and reliability.' },
    ],
    changes: [
      { title: 'Explore', body: 'Discovery, saved places, catch activity, conditions and map interactions.' },
      { title: 'Capture', body: 'Pin on Map, offline catch drafts and measurement improvements.' },
      { title: 'Ownership', body: 'Catch history export.' },
      { title: 'Reliability', body: 'Privacy, performance and reliability improvements.' },
    ] satisfies BwPoint[],
    verified: 'Checked against the App Store version history on October 14, 2026: 1.1.0 is the latest version.',
    note: 'These are documented release changes. They do not establish improved task completion, retention or user satisfaction.',
  },

  visual: {
    label: 'Visual system',
    kicker: 'A field-journal feel',
    title: 'Warm surfaces. Clear hierarchy. Room for the catch.',
    paletteLabel: 'Presentation palette',
    swatches: [
      { name: 'Paper', hex: '#F4F1EA' },
      { name: 'Forest', hex: '#20382F' },
      { name: 'Brass', hex: '#D9A441' },
      { name: 'Ink', hex: '#1F2A24' },
    ],
    typeTitle: 'Typography sets the pace.',
    typeBody: 'Editorial serif headings bring character to this presentation. A quiet sans-serif keeps decisions, captions and product facts easy to scan.',
    inAppLabel: 'Inside the app',
    inApp: 'The screens use the same idea: serif titles such as “Prime Bite”, “White Crappie” and “Market” sit above a plain sans-serif for fields, labels and data. A deep green marks primary actions such as View Conditions and List Your Gear.',
    approachLabel: 'My presentation approach',
    approach: 'Large phone showcases, generous margins and subtle contour lines echo time on the water. Forest green anchors important sections; brass stays a restrained accent.',
    note: 'The palette is drawn from the current marketing site. Presentation typography is not a specification of every font used inside the app.',
  },

  trust: {
    label: 'Trust + evaluation',
    kicker: 'Trust is part of the product',
    title: 'Sensitive places. Shared content. Real people.',
    items: [
      { title: 'Location deserves care', body: 'The published privacy policy describes location-based features and says location permissions are controlled in device settings. It also warns that sharing exact catch locations can be sensitive, so clear sharing choices matter.' },
      { title: 'Personal records and public posts', body: 'A catch log is a personal record; a Dock post shares it with others. The privacy policy says what other people can see depends on app settings and feature design, which is why I want to test whether people understand what a post reveals.' },
      { title: 'Community needs controls', body: 'Published support describes in-app reporting and blocking for listings, messages and accounts.' },
      { title: 'Support needs a clear path', body: 'Public support covers bug reports, account questions, privacy and deletion requests, and marketplace safety concerns.' },
    ] satisfies BwPoint[],
    tasksLabel: 'Proposed evaluation tasks',
    tasks: [
      'Log a catch with a photo, species and measurements.',
      'Find a fishing spot for a chosen species and save it.',
      'Explain what other people will see in a shared catch post.',
      'Create a Market listing and say who handles payment.',
    ],
    checksLabel: 'Also on real devices',
    checks: 'Readability outdoors in bright light, VoiceOver and larger text sizes.',
    note: 'No usability testing has been reported for this case study. No tester counts, usability scores, adoption figures or measured outcomes are included.',
  },

  outcome: {
    label: 'Outcome + reflection',
    kicker: 'From idea to an ongoing product',
    title: 'Shipping the app was a beginning.',
    delivered: 'I brought Backwater Journal through product design and mobile development into a released iOS app, then continued it through an update that rebuilt Explore and strengthened catch logging.',
    next: 'The product connects records, maps, community and marketplace tools to different parts of fishing. My next step is to evaluate how clearly people can move between those experiences, starting with the tasks above.',
    closing: ['Keep the product useful.', 'Let evidence guide the next change.'],
    sourcesLabel: 'Source record · October 14, 2026',
    sources: [
      { label: 'Website', detail: 'Current product descriptions and screens', href: sources.website },
      { label: 'App Store', detail: 'Release history: 1.0 and 1.1.0', href: sources.appStore },
      { label: 'Privacy policy', detail: 'Last updated September 2026', href: sources.privacy },
      { label: 'Support', detail: 'Last updated July 2026', href: sources.support },
    ],
    pdf: {
      href: `${base}/backwater-journal-case-study.pdf`,
      label: 'Download case study PDF',
      detail: '12 pages · 3.9 MB',
    },
  },
}
