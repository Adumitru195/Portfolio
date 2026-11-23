import type { PresentationImage } from '@/types/presentation'
import { backwaterRelease } from '@/data/backwater-release'

const base = '/Portfolio/projects/backwater-journal'

// The six product-tour screens are byte-identical to the website's assets
// (backwaterjournal-site: images/app/). Each already includes its phone frame.
// Capture dates, from the evidence:
//  - dock, communityPost, newCatch, species, market: the same captures as the
//    July 2026 App Store frames; the New Catch form shows "Mon, Jul 6 at
//    10:58 PM". They show the build before the 1.0 public release.
//  - explore: recaptured after the 1.1.0 Explore redesign; added to the
//    website on October 14, 2026, before 1.2.0.
// None of them shows version 1.2.0.
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
  // Cut out of the earlier App Store screenshot along the phone's outer rim
  // (transparent outside it), so it matches the other framed screens.
  exploreBefore: screen('explore-before-1-1-0.webp', 808, 1688,
    'Earlier Explore screen: a search field with separate filter and layer buttons, a zoomed-in map with pins, and a bottom sheet for Skokie Lagoon with a Search this area button and All, Fish Activity, Conditions and Species chips.'),
  species: screen('species.webp', 640, 1325,
    'Species collection in the Journal: Caught, Uncaught and All tabs, Freshwater, Saltwater and Hybrid filters, and species cards showing catch counts, best catch and the month last caught.'),
  market: screen('market.webp', 640, 1325,
    'Market screen: Saved and My Listings buttons, a List Your Gear banner, gear search, category chips, and an empty state reading No gear listed yet with a List Your Gear button.'),
}

export interface BwScreen {
  label: string
  caption: string
  image: PresentationImage
}

export const sources = {
  website: 'https://www.backwaterjournal.com/',
  appStore: backwaterRelease.appStoreUrl,
}

const latestRelease = `Version ${backwaterRelease.latest.version} · ${backwaterRelease.latest.date}`

export const backwater = {
  documentTitle: 'Backwater Journal · Andrew Dumitru',
  runningHead: 'Product design + development / iOS',

  opening: {
    eyebrow: 'A personal interest. A released product.',
    title: 'Backwater Journal',
    tagline: 'Every catch has a story.',
    lede: 'An independent fishing app I designed, developed, and released for iOS. Backwater Journal brings trip planning, catch records, fishing spot discovery, and an angler community into one connected experience.',
    roleLabel: 'My role',
    role: 'Founder, Product Designer & Mobile App Developer',
    meta: [
      { label: 'Platform', value: 'iOS / iPhone' },
      { label: 'Initial release', value: backwaterRelease.released },
      { label: 'Latest release', value: latestRelease },
      { label: 'Tools', value: 'Figma, React Native, Expo, Supabase' },
    ],
    links: [
      { label: 'Visit the website', href: sources.website },
      { label: 'View on the App Store', href: sources.appStore },
    ],
    screens: [
      { label: 'Dock', caption: 'Conditions and catch statistics', image: backwaterScreens.dock },
      { label: 'Explore', caption: 'The map-first discovery screen', image: backwaterScreens.explore },
    ] satisfies BwScreen[],
    caption: 'Website product-tour screens: Dock captured before the 1.0 release, Explore after the 1.1.0 redesign. Neither shows version 1.2.0.',
  },

  // 01
  // Product walkthrough between the opening and section 01. Not a numbered
  // section. Source: "UX Projects/Backwater Journal/Walkthrough Video 1.2.0/
  // draft-v2" (approved). Recorded from the 1.2.0 development build on an
  // Android emulator; other people's names and photos in the Activity scene
  // are redacted in the edit.
  walkthrough: {
    eyebrow: 'Product walkthrough',
    title: 'See Backwater Journal in action.',
    body: 'A short walkthrough of the Dock, Explore, catch logging, Fishing Outlook, and Activity center, recorded from the running Android development build.',
    disclosure: 'Recorded from the running app on an Android emulator · Version 1.2.0 · 30 seconds, no sound',
    label: 'Backwater Journal walkthrough',
    playLabel: 'Play the Backwater Journal walkthrough (30 seconds, no sound)',
    playText: 'Play walkthrough · 0:30',
    descriptionLabel: 'What the walkthrough shows',
    duration: 30,
    landscape: {
      mp4: `${base}/walkthrough/backwater-journal-1.2.0-walkthrough-landscape-1920x1080.mp4`,
      poster: `${base}/walkthrough/backwater-journal-1.2.0-walkthrough-landscape-poster.webp`,
      width: 1920,
      height: 1080,
    },
    vertical: {
      mp4: `${base}/walkthrough/backwater-journal-1.2.0-walkthrough-vertical-1080x1920.mp4`,
      poster: `${base}/walkthrough/backwater-journal-1.2.0-walkthrough-vertical-poster.webp`,
      width: 1080,
      height: 1920,
    },
    description:
      'What the walkthrough shows, in order: the Dock with catch statistics and today’s fishing conditions; Explore, where the map key opens and a public fishing spot’s card is shown; the New Catch form scrolled from Catch Basics through trip details, conditions and visibility, without saving; the Fishing Outlook with current conditions, upcoming fishing windows and a 5-day forecast; and the Activity center’s All and Unread filters. Other people’s names and photos are hidden.',
  },
  idea: {
    name: 'From an idea to a real product',
    title: 'Fishing gave me a reason to build something of my own.',
    body: [
      'I wanted a place where anglers could prepare for a trip, record what they caught, discover fishing spots, and share their experiences without treating each activity as a separate task.',
      'That idea became Backwater Journal.',
      'I was responsible for shaping the product, designing its interface, developing the app, and bringing it to the App Store.',
    ],
    challenge:
      'The challenge wasn’t just designing individual screens. It was making several different activities feel connected while keeping each one straightforward to use.',
  },

  // 02
  structure: {
    name: 'Designing around the fishing experience',
    title: 'One app. Several connected activities.',
    intro: 'I organized the product around four parts of the fishing experience.',
    steps: [
      { name: 'Prepare', body: 'Check fishing conditions and explore nearby waters.' },
      { name: 'Record', body: 'Log catches, measurements, photos, and trip details.' },
      { name: 'Revisit', body: 'Review catch history and track species.' },
      { name: 'Connect', body: 'Share experiences and coordinate fishing gear trades with other anglers.' },
    ],
    body: [
      'These activities shaped the app’s navigation, content hierarchy, and interaction patterns.',
      'I wanted anglers to move between practical information and personal records without feeling as though they were using unrelated features.',
    ],
  },

  // 03
  explore: {
    name: 'Rethinking Explore',
    title: 'Making discovery easier to understand.',
    body: [
      'Explore became one of the most important areas I revisited after launch.',
      'The earlier design separated its controls between icon buttons near the search field and filter chips along the bottom of the map. The layout offered several ways to explore, but the relationship between search, filters, and the map wasn’t as clear as I wanted.',
      'For version 1.1.0, I redesigned Explore around a more direct interaction.',
      'Search remained at the top, with clearly labeled Species, Filters, and Saved controls grouped directly beneath it.',
      'I also refined the selected-spot panel so anglers could view a location’s details while keeping the surrounding map visible.',
    ],
    goal: 'The goal was to make the next action more obvious without taking attention away from the map.',
    before: {
      label: 'Earlier Explore',
      caption: 'Cropped from the earlier App Store screenshot, added to this portfolio on July 7, 2026, before the 1.1.0 update.',
      image: backwaterScreens.exploreBefore,
    } satisfies BwScreen,
    after: {
      label: 'Redesigned Explore',
      caption: 'Captured after the 1.1.0 redesign, before version 1.2.0. From the website’s product tour.',
      image: backwaterScreens.explore,
    } satisfies BwScreen,
    changesLabel: 'What changed',
    changes: [
      'Clearer labels for primary filtering actions.',
      'Related controls grouped near search.',
      'A more compact selected-spot panel.',
      'A stronger connection between map locations and their details.',
    ],
    validateLabel: 'Still to validate',
    validate: 'Can someone find, open and save a spot on their first try? How do people read labels such as Public access?',
    note: 'The updated interface shipped in version 1.1.0. Formal usability testing is still needed to establish how these changes affect task completion and comprehension.',
  },

  // 04
  beyond: {
    name: 'Building an experience beyond the map',
    title: 'Making each interaction useful.',
    body: [
      'Explore was only one part of the product.',
      'For catch logging, I organized the form around the details anglers would want to remember: photos, species, measurements, date and time, followed by additional trip information.',
      'For personal progress, I designed the species collection as another way to revisit catch history without opening individual records.',
      'The Dock combines fishing conditions with shared community activity, while the Market gives anglers a place to list and discover fishing gear.',
      'These features serve different needs, but I wanted them to feel like parts of the same product.',
    ],
    closing: 'The design balances structured records with room for personal stories and community interaction.',
    // Two larger phones. Slot 1: species collection. Slot 2: the Dock.
    // These are the pre-1.0 captures until authentic 1.2.0 screenshots replace
    // them (see docs/backwater-1.2.0-screenshot-guide.md).
    screens: [
      { label: 'Species', caption: 'Caught species with counts and best catches.', image: backwaterScreens.species },
      { label: 'Dock / shared catch', caption: 'A shared post in the Dock.', image: backwaterScreens.communityPost },
    ] satisfies BwScreen[],
    catchLogging: {
      label: 'Catch logging',
      screen: {
        label: 'New Catch',
        caption: 'Captured July 6, 2026, before the 1.0 release.',
        image: backwaterScreens.newCatch,
      } satisfies BwScreen,
      rows: [
        {
          label: 'The problem',
          body: 'Anglers log catches at the water, often one-handed and sometimes with a weak signal, while the details are still fresh.',
        },
        {
          label: 'The design decision',
          body: 'Catch Basics come first, in the order people remember them: photos, species, measurements, then date and time. Trip details follow. The date and time are filled in already, with a Change link.',
        },
        {
          label: 'The evidence',
          body: 'In the form, Primary Species is the only required field, and Add Photos states its limit of 10. Version 1.1.0 added offline catch drafts and map-based catch locations, as its release notes record.',
        },
        {
          label: 'Still to validate',
          body: 'How long logging takes outdoors, and whether people understand when a catch is saved as an offline draft rather than posted.',
        },
      ],
    },
    note: 'These screens were captured before the 1.0 release, so they don’t show later changes such as the updated species artwork in 1.2.0. Their statistics and counts belong to an example account. They are not adoption or performance figures.',
  },

  // 05
  release: {
    name: 'Continuing to improve after launch',
    title: 'Releasing the app was the beginning.',
    intro: 'Backwater Journal continued evolving after its initial release.',
    versions: [
      {
        name: 'Version 1.0',
        date: backwaterRelease.released,
        body: 'The first public release established the foundation for catch logging, journaling, discovery, community activity, and the fishing gear marketplace.',
      },
      {
        name: 'Version 1.1.0',
        date: 'September 27, 2026',
        body: 'I rebuilt Explore and introduced improvements to catch capture, including offline catch drafts, map-based catch locations, measurement refinements, and catch history export.',
      },
      {
        name: `Version ${backwaterRelease.latest.version}`,
        date: backwaterRelease.latest.date,
        body: 'The next update focused on how anglers stay connected and personalize their experience. It introduced an Activity center and configurable push notifications, four profile colors, improvements to Fishing Conditions and Fishing Outlook, updated species artwork, and dark-mode refinements.',
      },
    ],
    closing:
      'Working through these releases gave me experience with the decisions that happen after launch, from refining existing interactions to maintaining a growing product.',
    verified: `Checked against the App Store version history on ${backwaterRelease.verifiedOn}: ${backwaterRelease.latest.version} is the latest version.`,
  },

  // 06
  trust: {
    name: 'Trust, privacy, and product boundaries',
    title: 'Useful information still needs thoughtful boundaries.',
    body: [
      'Fishing locations can be personal, especially when anglers choose to share their catches.',
      'That creates an important design consideration: helping people discover useful information while making it understandable what they are sharing with others.',
      'The app includes different content visibility options, and its marketplace allows users to communicate directly rather than processing transactions inside the app.',
      'Privacy, reporting, and clear expectations remain important parts of the product.',
    ],
    next: 'I want to evaluate these experiences more closely with real users, especially whether anglers understand location visibility and marketplace responsibilities.',
    sources:
      'Sources: in-app reporting and blocking, and the marketplace’s user-to-user payments, are described on the support page published in July 2026. The privacy policy published in September 2026 says content may be visible to others depending on app settings. Its October 30, 2026 update describes private and followers-only sharing and removing photo location metadata; that update came after version 1.2.0, so this case study doesn’t attribute those details to a specific release.',
  },

  // 07
  learned: {
    name: 'What I learned',
    title: 'What building Backwater taught me.',
    body: [
      'Backwater Journal gave me the opportunity to take responsibility for an entire digital product rather than one design deliverable.',
      'I worked through the relationship between user flows, interface design, implementation, technical constraints, and release decisions.',
    ],
    lesson:
      'One of my biggest lessons came from redesigning Explore: making an interface clearer doesn’t always require adding more features. Sometimes it means reorganizing what already exists and making the choices easier to understand.',
    after: [
      'The product has now reached three public versions, but releasing updates alone doesn’t prove that every design decision is successful.',
      'The next step is more structured usability evaluation, particularly around catch logging, Explore, location-sharing expectations, and overall accessibility.',
      'Backwater Journal continues to be a project where I can apply what I learn, test new ideas, and improve a product beyond its first release.',
    ],
    closingLabel: 'Closing thought',
    contactLabel: 'Start a project',
    closing: ['Design it. Build it.', 'Learn from it. Keep improving.'],
  },
}
