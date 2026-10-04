import type { AfterglowPresentation } from '@/types/presentation'

const base = '/Portfolio/projects/afterglow-cinema'

export const afterglow: AfterglowPresentation = {
  eyebrow: 'Personal concept · Film discovery & showtime selection',
  subtitle: 'Film discovery, with a clearer next step',
  meta: [
    { label: 'Role', value: 'UX & UI Design' },
    { label: 'Year', value: '2026' },
    { label: 'Platform', value: 'Responsive web' },
    { label: 'Scope', value: 'Discovery to showtime selection' },
  ],
  showcase: {
    desktop: {
      src: `${base}/showcase-desktop.webp`,
      alt: 'Afterglow homepage on desktop: a "What’s on" bar with cinema and seven-day date selectors, above a featured Interstellar banner with four showtimes and a View showtimes button',
      width: 1440,
      height: 900,
    },
    mobile: {
      src: `${base}/showcase-mobile.webp`,
      alt: 'Afterglow homepage on a phone: cinema and date selectors stacked above the featured film',
      width: 780,
      height: 1688,
    },
    description:
      'The Afterglow homepage shown in a desktop browser window, with the mobile version in a phone frame overlapping it on the right.',
    caption: 'The homepage at 1440 px and 390 px. Actual Afterglow interface.',
  },
  artworkNote:
    'Film posters and stills belong to their studios and distributors and appear in this design mockup only. Afterglow is a portfolio concept and isn’t affiliated with any studio, distributor or cinema.',
  brief: {
    title: 'Make the next decision easier.',
    challenge:
      'Choosing a film means balancing the story, the location, the date and the times available. Afterglow brings those decisions into one clear sequence, from browsing the programme to reviewing a selected showing.',
    goal: 'Help someone find a film, compare available times and understand their selection without repeatedly searching for context.',
    priorities: [
      {
        title: 'Choose the context first',
        body: 'Cinema and date sit on the homepage and carry into film details, so choices aren’t entered twice.',
      },
      {
        title: 'Make films easier to scan',
        body: 'Rating, runtime and genre always appear in the same order. A short logline comes before the full synopsis.',
      },
      {
        title: 'Show the next step clearly',
        body: 'Visible showtimes lead to a complete showing summary. Selection is marked with words and a check, as well as color.',
      },
    ],
  },
  origin: {
    title: 'Starting from ReelHouse.',
    body: 'Afterglow redesigns ReelHouse Cinemas, an earlier mobile concept of mine. Reviewing its wireframes and high-fidelity screens surfaced the problems the new structure answers.',
    image: {
      src: `${base}/reelhouse-wireframes.webp`,
      alt: 'Nine ReelHouse wireframes on phones: a home screen with a rotating hero and three poster rows, a slide-out menu, a profile, a movie list, film details with Details, Showings and More tabs, a showings tab with a date strip, a seat map, checkout and a Movie Booked confirmation',
      width: 1313,
      height: 771,
    },
    caption: 'The original ReelHouse wireframes, from home screen to booking confirmation.',
    rows: [
      {
        problem: 'Cinema and date first appeared on a film’s Showings tab.',
        response: 'Cinema and date sit at the top of the homepage and carry into every film page.',
      },
      {
        problem: 'Showtimes were hidden behind a tab, next to Details and More.',
        response: 'Showtimes sit on the film page itself, one scroll below a short introduction.',
      },
      {
        problem: 'There was no title search, only three scrolling poster rows.',
        response: 'Title search with a live result count, a Clear button and empty states that suggest a next step.',
      },
      {
        problem: 'The hero rotated, so the featured film changed while you read.',
        response: 'One fixed featured film, with its next four times as direct links.',
      },
      {
        problem: 'Selected dates and times were marked by fill color alone, and the date strip clipped its last day.',
        response: 'Selection adds a check, the word “Selected” and an underline bar. Seven days fit in a fixed grid.',
      },
    ],
    note: 'These are observations from my earlier files, not usability findings.',
  },
  structure: {
    title: 'From a film in mind to a showing that fits.',
    body: 'Each decision stays connected to the next.',
    steps: [
      { title: 'Set the context', body: 'Choose a cinema and date.' },
      { title: 'Explore films', body: 'Browse or search by title.' },
      { title: 'Compare showtimes', body: 'Review formats and times.' },
      { title: 'Review the choice', body: 'Check the showing summary.' },
    ],
    principles: [
      {
        title: 'Keep the context visible',
        body: 'Cinema and date carry from the homepage into film details. Returning to the programme keeps those choices, so browsing never means starting over.',
      },
      {
        title: 'Give every state a way forward',
        body: 'Search can be cleared, unavailable screenings point to other cinemas, and a selected showing can be changed.',
      },
    ],
  },
  identity: {
    title: 'Cinema atmosphere. Clear information.',
    body: 'A dark, warm identity lets film artwork lead while the controls stay consistent.',
    displayFont: {
      name: 'Big Shoulders Display',
      role: 'Display · headings and film titles, with a condensed marquee voice',
    },
    bodyFont: {
      name: 'Atkinson Hyperlegible Next',
      role: 'Body and interface · descriptions, controls and metadata',
      sample: '2014 · PG-13 · 2 hr 49 min · Science fiction, Adventure, Drama',
      paragraph:
        'With Earth’s crops failing, a former pilot leaves his children to search for a new home for humanity on the far side of a wormhole.',
    },
    swatches: [
      { name: 'Charcoal', hex: '#1B1A19', usage: 'Page background' },
      { name: 'Warm ivory', hex: '#F4ECDD', usage: 'Text and the ticket summary' },
      { name: 'Amber', hex: '#F4A62A', usage: 'Actions and selection only' },
    ],
    note: 'Amber identifies actions and selection, but labels and symbols carry the meaning too.',
  },
  discovery: {
    eyebrow: 'Homepage',
    title: 'Start with what’s on.',
    body: 'A fixed featured film leads into a compact, searchable programme.',
    notes: [
      {
        title: 'Context before content',
        body: 'A cinema selector and a seven-day date grid set the programme before anyone chooses a film.',
      },
      {
        title: 'One clear feature',
        body: 'The hero offers a short introduction, four upcoming times and a direct path to showtimes.',
      },
      {
        title: 'A programme to browse',
        body: 'Film cards repeat the same metadata order. This week and upcoming screenings stay distinct.',
      },
    ],
    image: {
      src: `${base}/discovery-home.webp`,
      alt: 'Full Afterglow homepage on desktop: the context bar, the featured Interstellar banner, Showing this week and Upcoming screenings tabs with a title search, and six film cards with posters, ratings, runtimes and next showing times',
      width: 1440,
      height: 1590,
    },
    caption: 'Every card answers “can I see this then?” with a count and the next showing.',
  },
  details: {
    title: 'The story and the schedule, together.',
    body: 'A short introduction gives way to visible showtimes, without switching tabs.',
    steps: [
      {
        eyebrow: 'Movie details',
        title: 'Read a little or a lot.',
        decision: 'Showtimes are on the film page, not behind a tab.',
        body: 'A one-sentence logline supports a quick decision, and the full synopsis opens on request. Standard, IMAX and Dolby Cinema times are grouped with a short format description and a starting price.',
        image: {
          src: `${base}/film.webp`,
          alt: 'Interstellar film page: a backdrop banner with the poster, title, rating, runtime, genres and logline, then a Showtimes section with cinema and date selectors, format chips and times grouped by format',
          width: 1440,
          height: 1660,
        },
        caption: 'The logline, then the full schedule on one page. Cinema and date carry over.',
      },
      {
        eyebrow: 'Showing selection',
        title: 'Know exactly what you chose.',
        decision: 'Every field in the summary comes from one showing record.',
        body: 'A ticket-shaped summary keeps date, time, estimated finish, cinema, screen and starting price together. The selected time shows a check and the word “Selected”. The prototype then stops honestly: seats are next, and nothing has been reserved.',
        image: {
          src: `${base}/summary.webp`,
          alt: 'Showtimes with 1:15 PM selected, marked with a check and the word Selected, beside a ticket-shaped summary of the showing and a note that seat selection is the next stage and nothing has been booked',
          width: 1440,
          height: 900,
        },
        caption: 'The selected time, its ticket summary, and a clear stopping point.',
      },
    ],
  },
  recovery: {
    title: 'A dead end should offer a next step.',
    body: 'Search and availability states explain what happened and how to continue.',
    screens: [
      {
        title: 'No matching title',
        body: 'The empty state keeps the query visible and offers a clear reset. When a match is in the other programme, a hint points there.',
        image: {
          src: `${base}/search-empty.webp`,
          alt: 'Homepage search for "zzz": "0 films match" above an empty state reading "Nothing showing this week matches zzz" with a Clear search button',
          width: 800,
          height: 380,
        },
      },
      {
        title: 'Not at this cinema',
        body: 'A film stays discoverable even when it isn’t showing at the chosen cinema. The page names the limitation and offers other locations.',
        image: {
          src: `${base}/not-at-cinema.webp`,
          alt: 'Showtimes for Everything Everywhere All at Once at Afterglow Lakeside, stating it is not screening there this week and offering buttons to show times at South End or NoDa',
          width: 800,
          height: 380,
        },
      },
    ],
    alternatives:
      'Other paths considered: showtimes in tabs, hiding unavailable films, and a longer scrolling date strip. The redesign favours visible choices and explicit recovery.',
  },
  responsive: {
    title: 'Same task. Different composition.',
    body: 'Mobile layouts protect reading space and keep the essential choices within reach.',
    screens: [
      {
        image: {
          src: `${base}/m-home.webp`,
          alt: 'Mobile homepage with cinema and a seven-day date grid above the featured film',
          width: 780,
          height: 1688,
        },
        caption: 'Seven days fit the width, with nothing clipped.',
      },
      {
        image: {
          src: `${base}/m-search.webp`,
          alt: 'Mobile title search with a live result count',
          width: 780,
          height: 1688,
        },
        caption: 'Search sits with the programme tabs.',
      },
      {
        image: {
          src: `${base}/m-film.webp`,
          alt: 'Mobile Interstellar film page with the title and logline below the backdrop',
          width: 780,
          height: 1688,
        },
        caption: 'Copy moves below the art for predictable contrast.',
      },
      {
        image: {
          src: `${base}/m-summary.webp`,
          alt: 'Mobile ticket-shaped showing summary with the note that seat selection comes next',
          width: 780,
          height: 1688,
        },
        caption: 'The ticket summary stacks below the times.',
      },
      {
        image: {
          src: `${base}/m-not-at-cinema.webp`,
          alt: 'Mobile not-screening state with buttons for other cinemas',
          width: 780,
          height: 1688,
        },
        caption: 'Recovery options stay one tap away.',
      },
    ],
    notes: [
      {
        title: 'Copy below the art',
        body: 'Hero and film-page copy move under the image instead of over it, avoiding unpredictable contrast.',
      },
      {
        title: 'Titles wrap, never clip',
        body: 'Long titles such as Spider-Man: Across the Spider-Verse wrap onto extra lines.',
      },
      {
        title: 'The choice stays in reach',
        body: 'On the film page, a fixed bar keeps the selected time available while you scroll.',
      },
    ],
  },
  outcome: {
    title: 'A stronger foundation for the cinema journey.',
    changed: [
      'Cinema and date move earlier.',
      'Films share one scannable information structure.',
      'Showtimes stay visible.',
      'A complete summary confirms the selection.',
    ],
    learned: {
      title: 'What the work taught me',
      body: 'The most useful changes were structural: putting decisions in order, keeping context visible and explaining unavailable options. The visual identity supports that sequence without replacing it.',
    },
    evidence: {
      title: 'What still needs evidence',
      body: 'No usability study has been run yet. The next step is to watch people find a film and select a showing, including readers with different accessibility needs, then check screen readers, more browsers and real devices.',
      measure: 'Can someone choose the right cinema, date and time, then accurately explain their selection?',
    },
    pdf: {
      href: `${base}/afterglow-cinema-case-study.pdf`,
      label: 'Download the case study PDF',
      detail: '11 pages · 8.6 MB',
    },
  },
}
