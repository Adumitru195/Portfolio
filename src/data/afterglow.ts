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
      alt: 'Afterglow homepage on desktop: a "What’s on" bar with cinema and seven-day date selectors, above a featured Interstellar banner with four showtimes, a View showtimes button, and the Interstellar, Dune: Part Two and The Batman posters arranged in depth',
      width: 2048,
      height: 1280,
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
    title: 'Midnight, lavender and clear information.',
    body: 'A deep midnight surface lets film artwork lead, while a single lavender accent marks every action and selection.',
    displayFont: {
      name: 'Space Grotesk',
      role: 'Display · logo, headings, film titles, tabs and the ticket title',
    },
    bodyFont: {
      name: 'Inter',
      role: 'Body and interface · descriptions, controls and metadata, with tabular figures for times and prices',
      sample: '2014 · PG-13 · 2 hr 49 min · Science fiction, Adventure, Drama',
      paragraph:
        'With Earth’s crops failing, a former pilot leaves his children to search for a new home for humanity on the far side of a wormhole.',
    },
    swatches: [
      { name: 'Midnight', hex: '#141827', usage: 'Page background' },
      { name: 'Surface', hex: '#1E2436', usage: 'Controls, cards and time tiles' },
      { name: 'Lavender', hex: '#B8A4EF', usage: 'Actions and selection only' },
      { name: 'Ivory', hex: '#F5F2EB', usage: 'Text and the ticket summary' },
    ],
    note: 'Every selected state uses the same lavender, and a check, the word “Selected”, an underline bar or a dot carries the meaning too.',
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
      alt: 'Full Afterglow homepage on desktop: the context bar, the featured Interstellar banner with three posters, Showing this week and Upcoming screenings tabs with a title search, and six film cards with posters, ratings, runtimes and next showing times',
      width: 1600,
      height: 1772,
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
          width: 1600,
          height: 1816,
        },
        caption: 'The logline, then the full schedule on one page. Cinema and date carry over.',
      },
      {
        eyebrow: 'Showing selection',
        title: 'Know exactly what you chose.',
        decision: 'Every field in the summary comes from one showing record.',
        body: 'The selected time shows a check and the word “Selected”. A ticket-shaped summary keeps date, time, estimated finish, cinema, screen and starting price together. The prototype then stops honestly: seat selection is the next stage, and nothing has been reserved.',
        image: {
          src: `${base}/summary.webp`,
          alt: 'Showtimes with 11:40 AM selected, marked with a check and the word Selected, beside a ticket-shaped summary of the showing and a note that seat selection is the next stage and nothing has been booked',
          width: 1600,
          height: 1000,
        },
        caption: 'The selected time, its ticket summary, and a clear stopping point.',
      },
    ],
  },
  motion: {
    title: 'Motion that points to the next choice.',
    body: 'Animation is short and purposeful. It introduces the featured film once, confirms what responds to a pointer, and acknowledges each selection, so attention moves from the hero to the programme to the chosen showing.',
    video: {
      mp4: `${base}/motion-demo.mp4`,
      webm: `${base}/motion-demo.webm`,
      poster: {
        src: `${base}/motion-poster.webp`,
        alt: 'Afterglow homepage hero at rest, the first frame of the motion recording',
        width: 1280,
        height: 800,
      },
      caption: 'Recorded from the prototype at 1280 × 800, about 20 seconds, with no audio.',
      description:
        'The recording shows the homepage hero entrance, the poster composition tilting with the pointer, film cards lifting on hover, then the Interstellar film page as times, a format and a date are selected and the ticket summary updates.',
    },
    effects: [
      {
        title: 'Hero entrance',
        body: 'Once per visit, the hero copy rises 12 px in short steps and the posters settle into place. On desktop the 3D scene plays it; elsewhere a CSS version does.',
      },
      {
        title: 'Poster tilt',
        body: 'With a mouse, the poster composition tilts a few degrees toward the pointer and eases back. Frames render only while it moves.',
      },
      {
        title: 'Card hover and focus',
        body: 'A film poster lifts 5 px, its image scales slightly inside the frame and a lavender edge appears. Keyboard focus gets the same lift; on touch, a brief press scale confirms the tap.',
      },
      {
        title: 'Selection feedback',
        body: 'Dates, formats and times change color over 180 ms. The date bar grows in, the check and dot pop in, and the ticket settles once per change.',
      },
      {
        title: 'Scroll reveals',
        body: 'Film cards and showtime groups that start below the fold rise 16 px once as they arrive. Nothing already on screen is hidden.',
      },
    ],
    reducedMotion:
      'With reduced motion, none of these play and the 3D scene isn’t loaded. Selection still shows its check, word, bar and dot.',
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
          width: 1600,
          height: 442,
        },
      },
      {
        title: 'Not at this cinema',
        body: 'A film stays discoverable even when it isn’t showing at the chosen cinema. The page names the limitation and offers other locations.',
        image: {
          src: `${base}/not-at-cinema.webp`,
          alt: 'Showtimes for Everything Everywhere All at Once at Afterglow Lakeside, stating it is not screening there this week and offering buttons to show times at South End or NoDa',
          width: 1600,
          height: 612,
        },
      },
    ],
    alternatives:
      'Other paths considered: showtimes in tabs, hiding unavailable films, and a longer scrolling date strip. The design favours visible choices and explicit recovery.',
  },
  responsive: {
    title: 'Same task. Different composition.',
    body: 'Mobile layouts protect reading space and keep the essential choices within reach.',
    screens: [
      {
        image: {
          src: `${base}/m-home-first.webp`,
          alt: 'Mobile homepage with cinema and a seven-day date grid above the featured film',
          width: 780,
          height: 1688,
        },
        caption: 'Seven days fit the width, with nothing clipped.',
      },
      {
        image: {
          src: `${base}/m-search.webp`,
          alt: 'Mobile title search for "dune" with a result count and the matching film card',
          width: 780,
          height: 1688,
        },
        caption: 'Search sits with the programme tabs.',
      },
      {
        image: {
          src: `${base}/m-film-first.webp`,
          alt: 'Mobile Interstellar film page with the title and logline below the backdrop',
          width: 780,
          height: 1688,
        },
        caption: 'Copy moves below the art for predictable contrast.',
      },
      {
        image: {
          src: `${base}/m-selected.webp`,
          alt: 'Mobile showtimes with 11:40 AM selected and a fixed bottom bar showing the time and a Review showing button',
          width: 780,
          height: 1688,
        },
        caption: 'A fixed bar keeps the chosen time in reach.',
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
        title: 'Touch-friendly feedback',
        body: 'Hover effects are off on touch screens; a brief press scale confirms each tap instead.',
      },
    ],
  },
  outcome: {
    title: 'A connected route from browsing to a chosen showing.',
    changed: [
      'Cinema and date come first and carry through.',
      'Films share one scannable information structure.',
      'Showtimes stay visible on the film page.',
      'A complete summary confirms the selection.',
    ],
    learned: {
      title: 'What the work taught me',
      body: 'The most useful decisions were structural: putting choices in order, keeping context visible and explaining unavailable options. The visual identity and motion support that sequence without replacing it.',
    },
    evidence: {
      title: 'What still needs evidence',
      body: 'No usability study has been run yet. The next step is to watch people find a film and select a showing, including readers with different accessibility needs, then check screen readers, more browsers and real devices. Seat selection and checkout are later stages and haven’t been built.',
      measure: 'Can someone choose the right cinema, date and time, then accurately explain their selection?',
    },
  },
}
