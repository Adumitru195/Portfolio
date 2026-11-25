import type { AfterglowCaseStudy, GlowShot } from '@/types/afterglow'

const base = '/Portfolio/projects/afterglow-cinema'
const shots = `${base}/case-study`

// Evidence behind this page (checked November 23, 2026):
//  - Screens in case-study/ are captures of the working prototype
//    (UX Projects/Afterglow Cinema) made by scripts/afterglow-captures.mjs at
//    2x on November 23, 2026, for the date Tuesday, November 24. Cinemas,
//    schedules, availability and prices are the prototype's sample data.
//  - Interface measurements (date grid, card availability lines, Showtimes
//    position, clicks to a summary, summary fields, selection cues, the absence
//    of seat or checkout controls) were taken in the running prototype in
//    Microsoft Edge at 390 x 844 and 1440 x 900.
//  - Test results were re-run on November 23, 2026 with the prototype's own
//    suites in docs/verification/: browser-check 74/74, 74/74, 73/73; axe-audit
//    0 violations in 14 states; artwork-contrast 27/27, lowest 5.25:1;
//    motion-check 61/61; showcase-check 43/43. Bundle sizes are from a fresh
//    production build.
//  - Contrast ratios are computed with the WCAG 2.x formula from the tokens.
//  - motion-demo.mp4/.webm is the October 4, 2026 recording with its first two
//    frames (blank white page-load frames) removed on November 23, 2026; the
//    originals are archived in Afterglow Cinema/docs/portfolio-archive-2026-11-23/.
//  - Films are fictional and their artwork is original to the prototype
//    (scripts/generate-artwork.py there; Afterglow Cinema/docs/ASSET-SOURCES.md).
//    On November 24, 2026 they replaced unlicensed studio artwork; captures,
//    card, poster and recording were remade then (clock fixed to November 23,
//    so the sample schedule is unchanged). Re-verified the same day:
//    browser-check 74/74, 74/74, 73/73; axe 14 states clean; artwork-contrast
//    27/27, lowest 5.25:1; motion 61/61; showcase 43/43. Showtimes now begins
//    at 575 px (1440 x 900) and 664 px (390 x 844).
//  - Provenance: the prototype's code was written with Claude Code under the
//    owner's product direction, UX/UI and interaction design, and review
//    (Afterglow Cinema/docs/DESIGN-LOG.md). The public page names the owner's
//    role and does not list tools; it must never claim the owner wrote the code.

const desktop = (file: string, alt: string, height: number) => ({ src: `${shots}/${file}`, alt, width: 2400, height })
const phone = (file: string, alt: string, label: string, caption?: string): GlowShot => ({
  image: { src: `${shots}/${file}`, alt, width: 780, height: 1688 },
  label,
  caption,
  portrait: true,
})

export const afterglow: AfterglowCaseStudy = {
  opening: {
    eyebrow: 'Independent UX/UI case study · Responsive web',
    subtitle: 'Find a film, compare showtimes, and know exactly what you chose',
    lede: 'A responsive cinema website that connects film discovery, showtimes and a clear showing summary, built as a working prototype for three fictional cinemas.',
    meta: [
      { label: 'My role', value: 'Product direction, UX/UI design, interaction design, and implementation review' },
      { label: 'Deliverable', value: 'Working responsive prototype' },
      { label: 'Year', value: '2026' },
      { label: 'Status', value: 'Concept, not yet tested with users' },
    ],
    hero: {
      image: desktop(
        'd-home.webp',
        'Afterglow homepage on desktop: a What’s on bar with the cinema selector set to Afterglow South End and a seven-day date grid with Tuesday the 24th selected, above the featured Halcyon Drift banner with four showtimes, a View showtimes button and three film posters.',
        1500,
      ),
      label: 'Homepage, 1440 px',
    },
    summaryLabel: 'Three problems, three decisions',
    summary: [
      { problem: 'Film discovery', stat: { value: '7 of 7', label: 'days visible on a 390 px phone, no scrolling', detail: '', kind: 'measured' } },
      { problem: 'Showtime selection', stat: { value: '0', label: 'tabs between a film and its showtimes', detail: '', kind: 'verified' } },
      { problem: 'Understanding the selection', stat: { value: '1 click', label: 'from the homepage to a complete showing summary', detail: '', kind: 'verified' } },
    ],
    note: 'Cinemas, schedules and prices are sample data, and no tickets are sold. The films are fictional, and their posters are original artwork made for the prototype. Afterglow isn’t affiliated with any studio, distributor or cinema.',
  },

  journey: {
    title: 'The whole journey in 23 seconds.',
    intro: 'The working prototype on desktop, from the program to a chosen showing.',
    video: {
      mp4: `${base}/motion-demo.mp4`,
      webm: `${base}/motion-demo.webm`,
      poster: { src: `${base}/motion-poster.webp`, alt: 'Afterglow homepage hero at rest, the first frame of the recording', width: 1280, height: 800 },
      label: 'Afterglow journey recording',
      duration: 23,
      caption: 'Recorded from the working prototype · 23 seconds · No audio',
      description:
        'The recording starts on the Afterglow homepage, where the featured Halcyon Drift banner and its posters settle into place below the cinema and date controls. It scrolls to the Showing this week program and moves the pointer across the film cards, which lift on hover. It opens Halcyon Drift, whose page shows the film details and then the showtimes, grouped by format. Selecting 11:40 AM marks the time with a check and the word Selected, and a ticket-shaped summary of the showing appears. Selecting 2:30 PM updates the ticket. Choosing the IMAX format clears the selection; after picking Wednesday, selecting 12:30 PM shows a new summary for IMAX, screen 4, from $18.75, with its note that seat selection is the next stage and nothing has been booked or reserved.',
    },
    descriptionSummary: 'What the recording shows',
    chapters: [
      { time: '0:00', title: 'Set the context' },
      { time: '0:05', title: 'Browse the program' },
      { time: '0:11', title: 'Compare showtimes' },
      { time: '0:13', title: 'Review the choice' },
    ],
  },

  discovery: {
    id: 'discovery',
    index: '02',
    label: 'Film discovery',
    title: 'Start with where and when.',
    question: 'How do people find a film showing at their cinema, on their date?',
    stats: [
      { value: '7 of 7', label: 'days fit a 390 px phone', detail: 'Chips at least 48 px wide', kind: 'measured' },
      { value: '6 of 6', label: 'cards state their next showing', detail: '“8 showings, next at 11:40 AM”', kind: 'verified' },
      { value: '2', label: 'ways out of an empty search', detail: 'Clear it, or switch lists', kind: 'verified' },
    ],
    primary: {
      image: desktop(
        'd-program.webp',
        'The Showing this week program on desktop: tabs for Showing this week and Upcoming screenings with counts, a title search, the line Showing times for Afterglow South End, Tuesday, November 24, and six film cards, each with a poster, title, year, rating, runtime, genres and a line such as 8 showings, next at 11:40 AM.',
        1183,
      ),
      label: 'The program, 1440 px',
    },
    decisions: [
      { title: 'Context comes first', body: 'Cinema and date sit above the program and carry to every film page.' },
      { title: 'Easy to browse', body: 'One featured film with four direct times, then This week and Upcoming lists with a live title search.' },
      { title: 'Consistent cards', body: 'Year, rating, runtime and genres, always in the same order.' },
      { title: 'No dead-end searches', body: 'An empty search explains itself and offers a way out.' },
    ],
    states: [
      {
        image: desktop('d-search-hint.webp', 'Search for kite in Showing this week: 0 films match. The empty state reads Nothing showing this week matches “kite”, notes Kitebound is in Upcoming screenings, and offers Show upcoming screenings and Clear search.', 712),
        label: 'Match in the other list',
      },
    ],
    phones: [
      phone('m-home.webp', 'Afterglow homepage on a phone: What’s on, the cinema selector, all seven dates in one row with Tuesday the 24th selected, then the featured film.', 'Phone homepage'),
      phone('m-search.webp', 'Phone search for sand: 1 film matches “sand” in Showing this week, with the Sandglass card showing 7 showings, next at 11:40 AM.', 'Phone search'),
    ],
  },

  showtimes: {
    id: 'showtimes',
    index: '03',
    label: 'Showtime selection',
    title: 'The story and the schedule, together.',
    question: 'How do people compare formats, times and cinemas without losing their place?',
    stats: [
      { value: '0', label: 'tabs between details and times', detail: '', kind: 'verified' },
      { value: '575 px', label: 'where Showtimes begins on a 900 px screen', detail: '664 px on an 844 px phone', kind: 'measured' },
      { value: '2', label: 'other cinemas offered when a film isn’t on', detail: '“Show times at South End / NoDa”', kind: 'verified' },
    ],
    primary: {
      image: desktop(
        'd-showtimes.webp',
        'Halcyon Drift showtimes on desktop: cinema Afterglow South End and the date grid carried from the homepage, format chips for All formats, Standard, IMAX and Dolby Cinema, then times grouped under Standard, IMAX and Dolby Cinema with a description and starting price for each; 5:20 PM and 3:45 PM are marked Sold out. A Your showing panel invites choosing a time.',
        1413,
      ),
      label: 'Showtimes, 1440 px',
    },
    decisions: [
      { title: 'Details and times together', body: 'A one-sentence logline, the full synopsis on request, then showtimes on the same page.' },
      { title: 'Choices carry through', body: 'Cinema and date arrive preselected.' },
      { title: 'Formats and availability, in words', body: 'Each format has a one-line description and starting price. Times say “Sold out” or “Few seats left”.' },
      { title: 'Unavailable still leads somewhere', body: 'The page says the film isn’t here and links to cinemas that have it.' },
    ],
    states: [
      {
        image: desktop('d-not-at-cinema.webp', 'Showtimes for The Infinite Afternoon of Mabel Ortiz at Afterglow Lakeside: Not screening at Lakeside this week, it is screening at these Afterglow cinemas instead, with buttons Show times at South End and Show times at NoDa.', 847),
        label: 'Not at this cinema',
      },
    ],
    phones: [
      phone('m-film.webp', 'Halcyon Drift film page on a phone: the backdrop, then the title, year, rating, runtime, genres, logline and Read full synopsis below the image, with Showtimes starting at the bottom of the screen.', 'Phone film page'),
      phone('m-not-at-cinema.webp', 'Phone showtimes at Afterglow Lakeside for The Infinite Afternoon of Mabel Ortiz: Not screening at Lakeside this week, with buttons to show times at South End and at NoDa.', 'Phone, not at this cinema'),
    ],
  },

  selection: {
    id: 'selection',
    index: '04',
    label: 'Understanding the selection',
    title: 'Choosing a showing is not buying a ticket.',
    question: 'How do people know what they chose, and that nothing has been booked yet?',
    stats: [
      { value: '1 click', label: 'from the homepage to a full summary', detail: 'Via a featured time; 2 from any film card', kind: 'verified' },
      { value: '7', label: 'facts in the summary, from one showing', detail: '', kind: 'verified' },
      { value: '0', label: 'seat, checkout or payment controls', detail: '“Nothing has been booked or reserved.”', kind: 'verified' },
    ],
    primary: {
      image: desktop(
        'd-selected.webp',
        'Halcyon Drift showtimes with 11:40 AM selected, marked with a check and the word Selected, beside a ticket-shaped Your showing summary: Tuesday, November 24, 11:40 AM, film ends about 2:49 PM, Afterglow South End, 1400 Camden Yard Way, Standard, screen 5, from $12.50 each. Below it: Next: choose your seats. Seat selection is the next stage of this prototype and hasn’t been built yet. Nothing has been booked or reserved. Then a Choose a different time link.',
        1413,
      ),
      label: 'A selected showing, 1440 px',
    },
    decisions: [
      { title: 'Selection never relies on colour', body: 'A check and the word “Selected” on the time, a bar under the date, a dot on the format. A status line announces the choice.' },
      { title: 'One summary, one source', body: 'Every field comes from the same showing record, so the ticket can’t contradict itself.' },
      { title: 'Everything needed to decide', body: 'Date, start and finish, cinema and address, format and screen, price.' },
      { title: 'A clear boundary', body: '“Next: choose your seats” says that stage isn’t built. No button leads to a missing page.' },
    ],
    states: [],
    phones: [
      phone('m-selected.webp', 'Phone showtimes with 11:40 AM selected, showing a check and Selected, sold-out times labelled, and a fixed bottom bar with 11:40 AM, Tuesday, November 24, Standard and a Review showing button.', 'Phone selection'),
      phone('m-summary.webp', 'Phone Your showing summary: the Halcyon Drift ticket with date, time and end time, cinema and address, format and screen, and price, then Next: choose your seats, nothing has been booked or reserved, and Choose a different time.', 'Phone summary'),
    ],
  },

  system: {
    title: 'Midnight, lavender and purposeful motion.',
    intro: 'Midnight lets the artwork lead; one lavender accent marks every action and selection.',
    swatches: [
      { name: 'Midnight', hex: '#141827', usage: 'Page background', contrast: '—' },
      { name: 'Surface', hex: '#1E2436', usage: 'Controls, cards, time tiles', contrast: '—' },
      { name: 'Lavender', hex: '#B8A4EF', usage: 'Actions and selection only', contrast: '8.06:1 on midnight' },
      { name: 'Ivory', hex: '#F5F2EB', usage: 'Text and the ticket', contrast: '15.79:1 on midnight' },
      { name: 'Control edge', hex: '#737C9C', usage: 'Inputs, chips, time tiles', contrast: '4.28:1 on midnight' },
    ],
    fonts: [
      { name: 'Space Grotesk', role: 'Logo, headings, film titles, ticket title', sample: 'What’s on' },
      { name: 'Inter', role: 'Interface text, with tabular figures for times', sample: '11:40 AM · 2:30 PM · From $12.50' },
    ],
    contrast: [
      { value: '1.74 → 4.28:1', label: 'control edges against the page', detail: 'Now passes WCAG 3:1 for controls', kind: 'recorded' },
      { value: '15.79:1', label: 'ivory text on midnight', detail: 'WCAG 2.x, from the tokens', kind: 'measured' },
    ],
    motion: [
      { title: 'One entrance', body: 'The featured film settles into place once per visit.' },
      { title: 'Cards respond', body: 'On hover or focus, a poster lifts 5 px; on touch, a brief press.' },
      { title: 'Selections acknowledge', body: 'Choices change colour over 180 ms; the ticket settles once.' },
      { title: 'Reveals never hide', body: 'Content below the fold rises 16 px once; nothing on screen is hidden.' },
    ],
    reducedMotion: 'With reduced motion, none of these play and the 3D poster scene isn’t loaded.',
  },

  quality: {
    title: 'Checked in code. Not yet tested with people.',
    intro: 'The prototype’s own automated checks, re-run on November 23, 2026. They aren’t user research.',
    checks: [
      { value: '74 / 74 / 73', label: 'browser checks pass', detail: 'Full journey at 390, 768 and 1440 px.', kind: 'verified' },
      { value: '0', label: 'accessibility violations', detail: 'axe, WCAG 2.2 A/AA, 14 states.', kind: 'verified' },
      { value: '5.25:1', label: 'lowest contrast of text over artwork', detail: '27 of 27 measurements pass.', kind: 'verified' },
      { value: '61 / 61', label: 'motion and reduced-motion checks', detail: 'Including 0 frames drawn at rest.', kind: 'verified' },
      { value: '94.8 kB', label: 'app code, gzipped', detail: 'The 132 kB 3D scene loads only on desktop.', kind: 'measured' },
    ],
    notDone: {
      title: 'Not yet done',
      items: ['Testing with people', 'Screen readers', 'Safari, Firefox and real phones', '200–400% zoom'],
    },
    learned: 'The most useful decisions were about order and honesty: context before content, times beside the story, and a summary that says plainly what hasn’t happened yet.',
    next: {
      title: 'What I’d test next',
      intro: 'Every decision is still a hypothesis. With five to eight people, I’d test:',
      questions: [
        'Can they find a film on at their cinema and date?',
        'Can they compare formats and pick a time without leaving the film page?',
        'Can they say what they chose, and that nothing is booked?',
      ],
    },
    contactLabel: 'Start a project',
  },
}
